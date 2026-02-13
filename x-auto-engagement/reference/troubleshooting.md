# Troubleshooting

## 1) X API 401 Unauthorized

Symptoms:
- fetch_timeline.py exits with code 3
- publish.py returns HTTP 401 errors

Checks:
1. Verify all four OAuth 1.0a tokens are set in .env: X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET.
2. Verify X_USER_ID matches the account that owns the access token.
3. Verify the X Developer App has Read and Write permissions (not Read-only).
4. Regenerate access tokens in the X Developer Portal if they may have been revoked.

## 2) X API 403 Forbidden

Symptoms:
- Like or reply requests return HTTP 403

Checks:
1. The account may be restricted or suspended. Check the X account status.
2. The X Developer App may lack Write permissions. Verify in the Developer Portal.
3. The tweet may have been deleted or replies may be restricted by the author.

## 3) X API 429 Rate Limited

Symptoms:
- fetch_timeline.py exits with code 4
- publish.py returns HTTP 429 errors

Checks:
1. Home timeline has a rate limit of 180 requests per 15 minutes. Wait before retrying.
2. Tweet creation has a rate limit of 200 tweets per 15 minutes (usually not hit with batch sizes of 10).
3. Increase publish delays: use --min-delay 60 --max-delay 180.
4. Reduce cron frequency or batch size (--max 5).

## 4) All Tweets Filtered Out

Symptoms:
- fetch_timeline.py returns passed: 0
- Agent reports no eligible tweets

Checks:
1. Check skipped_reasons in the fetch output to see why tweets were filtered.
2. If language filter dominates: confirm the timeline has English-language tweets, or use --lang to change the filter.
3. If min_likes filter dominates: lower the threshold with --min-likes 1.
4. Increase --count to fetch more raw tweets (e.g., --count 100).

## 5) Publish Partially Fails

Symptoms:
- Report shows failure_count > 0

Checks:
1. Inspect results[].error in the publish report for each failed item.
2. Common causes: tweet was deleted, replies restricted, duplicate reply detected by X.
3. Do not manually retry failed items from the same batch. Let the next cron run handle new tweets.
4. If failures are consistent, check OAuth token permissions and account status.

## 6) X-PROFILE.md Not Found

Symptoms:
- Agent reports it cannot find X-PROFILE.md

Checks:
1. Verify X-PROFILE.md exists in the workspace root (users/{name}/X-PROFILE.md).
2. Copy from template if missing: cp .openclaw/skills/x-auto-engagement/templates/X-PROFILE.md users/{name}/X-PROFILE.md
3. Edit the copied file to match the desired persona.

## 7) .env Not Found or Missing Variables

Symptoms:
- Scripts exit with "ERROR: .env file not found" or "Missing environment variables"

Checks:
1. Verify .env exists in the workspace root (users/{name}/.env).
2. Copy from template: cp .openclaw/skills/x-auto-engagement/reference/env-example.txt users/{name}/.env
3. Fill in all required values: X_CONSUMER_KEY, X_CONSUMER_SECRET, X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET, X_USER_ID.

## 8) Python Dependencies Missing

Symptoms:
- ModuleNotFoundError for requests, dotenv, etc.

Fix:
```bash
pip install -r .openclaw/skills/x-auto-engagement/scripts/requirements.txt
```

## 9) Proxy Issues

Symptoms:
- Connection timeouts or refused connections
- Works without proxy but fails with X_PROXY_URL set

Checks:
1. Verify the proxy URL format: http://host:port (not https://).
2. Verify the proxy is running and accessible from this machine.
3. Remove X_PROXY_URL from .env if proxy is not needed.
