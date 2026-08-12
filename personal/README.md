# personal/

Machine-specific skills, mirrored from the live pi agent at `~/.agents/skills/`.

These are **not** meant to be installed by anyone else — they hardcode paths and setups that only exist on my machine:

| Skill | Depends on |
| --- | --- |
| [`web-search`](./web-search) | Tavily API key at `~/.config/tavily/key` |
| [`publish-artifact`](./publish-artifact) | Cloudflare R2 credentials at `~/.config/r2-upload/env`, `rclone`, and `npm install` in `scripts/` |
| [`herdr-workflow`](./herdr-workflow) | the `herdr` CLI and my worktree/agent conventions |

Paths inside these `SKILL.md` files (e.g. `~/.agents/skills/publish-artifact/scripts/report.sh`) refer to the **deployed** location, not to this directory. The copies here are for version control and diffing.

The live copies under `~/.agents/skills/` are still authoritative — edits made here do not take effect until you copy them across, or until you replace the live directories with symlinks (recipe in the top-level [README](../README.md#how-pi-loads-local-skills)).

No credentials are stored in these files; they all read from external config files at runtime.
