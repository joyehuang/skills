#!/usr/bin/env python3
"""
fetch_timeline.py - Fetch home timeline and apply rule-based pre-filters.

Reads OAuth 1.0a credentials from .env. Uses hardcoded filter defaults
with optional CLI overrides. Outputs filtered tweets as JSON to stdout.

Usage:
    python3 fetch_timeline.py --env <path> [--count <n>] [--lang <code>] [--min-likes <n>]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

import requests
from dotenv import load_dotenv
from requests_oauthlib import OAuth1


API_BASE = "https://api.x.com/2"

# Hardcoded filter defaults
DEFAULTS = {
    "language": "en",
    "min_likes": 5,
    "skip_retweets": True,
    "skip_replies": True,
    "skip_media_only": True,
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


def fetch_home_timeline(auth: OAuth1, user_id: str, count: int) -> list[dict]:
    """Fetch reverse-chronological home timeline."""
    session = get_session()
    url = f"{API_BASE}/users/{user_id}/timelines/reverse_chronological"
    params = {
        "max_results": min(count, 100),
        "tweet.fields": "id,text,author_id,lang,public_metrics,created_at,referenced_tweets",
        "user.fields": "id,username,name,public_metrics",
        "expansions": "author_id",
    }

    resp = session.get(url, auth=auth, params=params)

    if resp.status_code == 401:
        print("ERROR: X API 401 Unauthorized. Check OAuth credentials.", file=sys.stderr)
        sys.exit(3)
    if resp.status_code == 429:
        print("ERROR: X API 429 Rate Limited. Try again later.", file=sys.stderr)
        sys.exit(4)
    if resp.status_code != 200:
        print(
            f"ERROR: X API returned {resp.status_code}: {resp.text}",
            file=sys.stderr,
        )
        sys.exit(5)

    data = resp.json()
    tweets = data.get("data", [])

    # Build author lookup from includes
    authors = {}
    for user in data.get("includes", {}).get("users", []):
        authors[user["id"]] = user

    # Attach author info to each tweet
    for tweet in tweets:
        author = authors.get(tweet.get("author_id"), {})
        tweet["_author"] = {
            "username": author.get("username", ""),
            "name": author.get("name", ""),
            "followers_count": author.get("public_metrics", {}).get("followers_count", 0),
        }

    return tweets


def is_retweet(tweet: dict) -> bool:
    refs = tweet.get("referenced_tweets", [])
    return any(r.get("type") == "retweeted" for r in refs)


def is_reply(tweet: dict) -> bool:
    refs = tweet.get("referenced_tweets", [])
    return any(r.get("type") == "replied_to" for r in refs)


def is_quote(tweet: dict) -> bool:
    refs = tweet.get("referenced_tweets", [])
    return any(r.get("type") == "quoted" for r in refs)


def apply_filters(tweets: list[dict], lang: str, min_likes: int) -> tuple[list[dict], list[dict]]:
    """Apply rule-based filters. Returns (passed, skipped) lists."""
    passed = []
    skipped = []

    for tweet in tweets:
        reason = None

        if DEFAULTS["skip_retweets"] and is_retweet(tweet):
            reason = "retweet"
        elif DEFAULTS["skip_replies"] and is_reply(tweet):
            reason = "reply"
        elif lang and tweet.get("lang", "") != lang:
            reason = f"language:{tweet.get('lang', 'unknown')}"
        elif min_likes > 0:
            likes = tweet.get("public_metrics", {}).get("like_count", 0)
            if likes < min_likes:
                reason = f"min_likes:{likes}<{min_likes}"
        elif DEFAULTS["skip_media_only"]:
            text = tweet.get("text", "").strip()
            if len(text) < 20 and ("https://t.co/" in text or text == ""):
                reason = "media_only"

        if reason:
            skipped.append({"tweet_id": tweet["id"], "reason": reason})
        else:
            passed.append(tweet)

    return passed, skipped


def format_tweet(tweet: dict) -> dict:
    """Format a tweet for agent consumption."""
    metrics = tweet.get("public_metrics", {})
    author = tweet.get("_author", {})
    return {
        "tweet_id": tweet["id"],
        "text": tweet.get("text", ""),
        "author_id": tweet.get("author_id", ""),
        "author_username": author.get("username", ""),
        "author_name": author.get("name", ""),
        "author_followers": author.get("followers_count", 0),
        "lang": tweet.get("lang", ""),
        "likes": metrics.get("like_count", 0),
        "retweets": metrics.get("retweet_count", 0),
        "replies": metrics.get("reply_count", 0),
        "created_at": tweet.get("created_at", ""),
        "is_quote": is_quote(tweet),
    }


def main():
    parser = argparse.ArgumentParser(description="Fetch X home timeline with pre-filters")
    parser.add_argument("--env", required=True, help="Path to .env file with OAuth credentials")
    parser.add_argument("--count", type=int, default=50, help="Number of raw tweets to fetch (max 100)")
    parser.add_argument("--lang", default=DEFAULTS["language"], help=f"Language filter (default: {DEFAULTS['language']})")
    parser.add_argument("--min-likes", type=int, default=DEFAULTS["min_likes"], help=f"Minimum likes filter (default: {DEFAULTS['min_likes']})")
    args = parser.parse_args()

    # Load env and auth
    load_env(args.env)
    auth = get_oauth()

    user_id = os.getenv("X_USER_ID")
    if not user_id:
        print("ERROR: X_USER_ID not set in environment.", file=sys.stderr)
        sys.exit(2)

    # Fetch
    raw_tweets = fetch_home_timeline(auth, user_id, args.count)

    # Filter
    passed, skipped = apply_filters(raw_tweets, args.lang, args.min_likes)

    # Format output
    result = {
        "fetched": len(raw_tweets),
        "passed": len(passed),
        "skipped_count": len(skipped),
        "skipped_reasons": skipped,
        "tweets": [format_tweet(t) for t in passed],
    }

    json.dump(result, sys.stdout, ensure_ascii=False, indent=2)
    print()  # trailing newline


if __name__ == "__main__":
    main()
