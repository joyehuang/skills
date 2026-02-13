#!/usr/bin/env python3
"""
publish.py - Like tweets and post reply comments via X API v2.

Reads OAuth 1.0a credentials from .env. For each comment, likes the tweet
first then posts the reply. Respects delays between posts to avoid rate
limiting. Uses hardcoded defaults with optional CLI overrides.

Usage:
    python3 publish.py --comments <json-file> --env <path> [--max <n>] [--min-delay <s>] [--max-delay <s>]
"""
from __future__ import annotations

import argparse
import json
import os
import random
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from dotenv import load_dotenv
from requests_oauthlib import OAuth1


API_BASE = "https://api.x.com/2"

# Hardcoded publish defaults
DEFAULTS = {
    "max_per_batch": 10,
    "min_delay_seconds": 30,
    "max_delay_seconds": 120,
    "like_before_reply": True,
}


def load_env(env_path: str | None) -> None:
    if env_path:
        p = Path(env_path)
        if not p.exists():
            print(f"ERROR: .env file not found: {env_path}", file=sys.stderr)
            sys.exit(1)
        load_dotenv(p)
    else:
        load_dotenv()


def get_oauth() -> OAuth1:
    required = [
        "X_CONSUMER_KEY",
        "X_CONSUMER_SECRET",
        "X_ACCESS_TOKEN",
        "X_ACCESS_TOKEN_SECRET",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        print(
            f"ERROR: Missing environment variables: {', '.join(missing)}",
            file=sys.stderr,
        )
        sys.exit(2)

    return OAuth1(
        os.environ["X_CONSUMER_KEY"],
        os.environ["X_CONSUMER_SECRET"],
        os.environ["X_ACCESS_TOKEN"],
        os.environ["X_ACCESS_TOKEN_SECRET"],
    )


def get_session() -> requests.Session:
    session = requests.Session()
    proxy = os.getenv("X_PROXY_URL")
    if proxy:
        session.proxies = {"http": proxy, "https": proxy}
    return session


def like_tweet(session: requests.Session, auth: OAuth1, user_id: str, tweet_id: str) -> dict:
    """Like a tweet. Returns {"success": bool, "error": str|None}."""
    url = f"{API_BASE}/users/{user_id}/likes"
    payload = {"tweet_id": tweet_id}

    try:
        resp = session.post(url, auth=auth, json=payload)
        if resp.status_code == 200:
            return {"success": True, "error": None}
        else:
            return {"success": False, "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"success": False, "error": str(e)}


def post_reply(session: requests.Session, auth: OAuth1, tweet_id: str, text: str) -> dict:
    """Post a reply to a tweet. Returns {"success": bool, "reply_id": str|None, "error": str|None}."""
    url = f"{API_BASE}/tweets"
    payload = {
        "text": text,
        "reply": {"in_reply_to_tweet_id": tweet_id},
    }

    try:
        resp = session.post(url, auth=auth, json=payload)
        if resp.status_code in (200, 201):
            data = resp.json()
            reply_id = data.get("data", {}).get("id")
            return {"success": True, "reply_id": reply_id, "error": None}
        else:
            return {"success": False, "reply_id": None, "error": f"HTTP {resp.status_code}: {resp.text[:200]}"}
    except Exception as e:
        return {"success": False, "reply_id": None, "error": str(e)}


def main():
    parser = argparse.ArgumentParser(description="Publish likes and replies via X API")
    parser.add_argument("--comments", required=True, help="Path to comments JSON file")
    parser.add_argument("--env", required=True, help="Path to .env file with OAuth credentials")
    parser.add_argument("--max", type=int, default=DEFAULTS["max_per_batch"], help=f"Max comments per batch (default: {DEFAULTS['max_per_batch']})")
    parser.add_argument("--min-delay", type=float, default=DEFAULTS["min_delay_seconds"], help=f"Min delay between posts in seconds (default: {DEFAULTS['min_delay_seconds']})")
    parser.add_argument("--max-delay", type=float, default=DEFAULTS["max_delay_seconds"], help=f"Max delay between posts in seconds (default: {DEFAULTS['max_delay_seconds']})")
    args = parser.parse_args()

    # Load env
    load_env(args.env)
    auth = get_oauth()
    session = get_session()

    user_id = os.getenv("X_USER_ID")
    if not user_id:
        print("ERROR: X_USER_ID not set in environment.", file=sys.stderr)
        sys.exit(2)

    max_per_batch = args.max
    min_delay = args.min_delay
    max_delay = args.max_delay

    # Load comments
    comments_path = Path(args.comments)
    if not comments_path.exists():
        print(f"ERROR: Comments file not found: {args.comments}", file=sys.stderr)
        sys.exit(1)
    with comments_path.open("r", encoding="utf-8") as f:
        comments_data = json.load(f)

    # Accept both raw list and {comments: [...]} wrapper
    if isinstance(comments_data, dict):
        comments = comments_data.get("comments", [])
    elif isinstance(comments_data, list):
        comments = comments_data
    else:
        print("ERROR: Invalid comments file format.", file=sys.stderr)
        sys.exit(1)

    if not comments:
        print("ERROR: No comments to publish.", file=sys.stderr)
        sys.exit(1)

    # Enforce batch cap
    if len(comments) > max_per_batch:
        print(
            f"WARNING: Trimming batch from {len(comments)} to {max_per_batch} (max_per_batch).",
            file=sys.stderr,
        )
        comments = comments[:max_per_batch]

    # Publish loop
    results = []
    success_count = 0
    failure_count = 0

    for i, item in enumerate(comments):
        tweet_id = str(item.get("tweet_id", "")).strip()
        comment_text = str(item.get("generated_comment", "")).strip()

        if not tweet_id or not comment_text:
            results.append({
                "tweet_id": tweet_id,
                "status": "skipped",
                "reason": "missing tweet_id or comment text",
            })
            failure_count += 1
            continue

        entry = {
            "tweet_id": tweet_id,
            "comment": comment_text,
            "like_result": None,
            "reply_result": None,
            "status": "pending",
        }

        # Like
        if DEFAULTS["like_before_reply"]:
            like_res = like_tweet(session, auth, user_id, tweet_id)
            entry["like_result"] = like_res
            if not like_res["success"]:
                print(
                    f"WARNING: Failed to like tweet {tweet_id}: {like_res['error']}",
                    file=sys.stderr,
                )

        # Reply
        reply_res = post_reply(session, auth, tweet_id, comment_text)
        entry["reply_result"] = reply_res

        if reply_res["success"]:
            entry["status"] = "published"
            entry["reply_id"] = reply_res["reply_id"]
            success_count += 1
        else:
            entry["status"] = "failed"
            entry["error"] = reply_res["error"]
            failure_count += 1
            print(
                f"ERROR: Failed to reply to tweet {tweet_id}: {reply_res['error']}",
                file=sys.stderr,
            )

        results.append(entry)

        # Delay between posts (skip after last one)
        if i < len(comments) - 1:
            delay = random.uniform(min_delay, max_delay)
            print(f"Waiting {delay:.1f}s before next post...", file=sys.stderr)
            time.sleep(delay)

    # Build report
    report = {
        "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "total": len(comments),
        "success_count": success_count,
        "failure_count": failure_count,
        "results": results,
    }

    json.dump(report, sys.stdout, ensure_ascii=False, indent=2)
    print()


if __name__ == "__main__":
    main()
