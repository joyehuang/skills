# Merge notes

Consolidation of three scattered skill locations into this repo, 2026-08-12.

## What came from where

| Destination | Source | Action |
| --- | --- | --- |
| root-level skills (18) | this repo (`joyehuang/skills`, branch `master`) | unchanged — this repo was already canonical |
| `terminal-slide-deck/` | `~/dev/joye-skills/skills/terminal-slide-deck` (`joyehuang/joye-skills`) | copied; its MIT `LICENSE` copied alongside |
| `personal/web-search/` | `~/.agents/skills/web-search` | **copied, not moved** |
| `personal/publish-artifact/` | `~/.agents/skills/publish-artifact` | **copied, not moved**; `scripts/node_modules/` excluded (gitignored — run `npm install` at the deployed location) |
| `personal/herdr-workflow/` | `~/.agents/skills/herdr-workflow` | **copied, not moved** |

## What was deliberately NOT merged

- **`~/.agents/skills/ego-browser`** — a symlink to `~/.local/share/ego/ego-skills`, owned and updated by the ego app. Vendoring it would fork a third-party skill and go stale. Left as-is.
- **`~/.agents/skills/*` originals** — all still in place and still authoritative for the running pi agent. Nothing was deleted or moved; the copies here are mirrors.
- **The `joye-skills` repo and both GitHub remotes** — untouched. `joyehuang/joye-skills` still exists and its README links (including the GitHub Pages demo URL for `terminal-slide-deck`) still resolve. Archive it on GitHub when convenient; the demo link in this README points at that repo's Pages deployment, so update it if you ever delete the repo.

## Findings from the inventory

- **No name collisions.** `terminal-slide-deck` was the only skill in `joye-skills`, and nothing in this repo shared its name. No content had to be reconciled.
- **No obsolete content found.** Every skill has a `SKILL.md` with valid `name`/`description` frontmatter.
- **Layout mismatch resolved.** `joye-skills` nested skills under `skills/`; this repo keeps them flat at the root (which is what the published `npx skills add joyehuang/skills/<name>` paths depend on), so `terminal-slide-deck` was flattened on the way in.
- **License mismatch.** This repo is Apache-2.0; `joye-skills` was MIT. `terminal-slide-deck` keeps its MIT license in its own directory rather than being silently relicensed. Same copyright holder, so unify them if you'd rather have one license.
- **No secrets in the copied pi skills.** They read credentials from external files (`~/.config/tavily/key`, `~/.config/r2-upload/env`) — no keys are embedded.
- **Missing docs.** Only `gemini-tts-fast` has a per-skill `README.md`; the rest rely on `SKILL.md` alone. That's fine for agent consumption, but the repo README is now the single human-facing index.
- **Duplicate commits.** `aa63ed0` and `fa4f17a` have identical messages ("Add README, LICENSE, .gitignore; untrack .DS_Store"). Cosmetic; history was not rewritten.

## Follow-ups (not done, your call)

1. Archive `joyehuang/joye-skills` on GitHub and point its README here.
2. Optionally replace the live `~/.agents/skills/{web-search,publish-artifact,herdr-workflow}` directories with symlinks into `personal/` so there's one source of truth (recipe in the README). Do it one at a time and verify pi still loads each.
3. Decide on one license across the repo.
