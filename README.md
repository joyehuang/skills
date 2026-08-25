# joyehuang/skills

[![skills.sh](https://skills.sh/b/joyehuang/skills)](https://skills.sh/joyehuang/skills)

A personal collection of [agent skills](https://skills.sh) — reusable procedural knowledge for AI coding agents (Claude Code, OpenCode, Cursor, Codex, pi, and anything that speaks the `SKILL.md` convention).

This is the **canonical, unified skills repo**. Everything previously scattered across `joyehuang/joye-skills` and the local pi runtime (`~/.agents/skills/`) now lives here. See [MERGE-NOTES.md](./MERGE-NOTES.md) for what came from where.

## Layout

```
skills/
├── <skill-name>/          # portable skills — one directory per skill, at the repo root
│   └── SKILL.md           # required: YAML frontmatter (name, description) + instructions
├── personal/              # machine-specific skills mirrored from the local pi agent
│   └── <skill-name>/SKILL.md
├── MERGE-NOTES.md
└── README.md
```

Two tiers, on purpose:

- **Root level = portable.** Anything installable by a stranger with `npx skills add`. No hardcoded absolute paths, no assumptions about this machine.
- **`personal/` = mine.** Skills wired to my own setup (local paths under `~/.agents/`, credential files under `~/.config/`, my Cloudflare R2 bucket, my herdr conventions). Kept in version control so it's backed up and diffable, deliberately *not* at the root so `npx skills add joyehuang/skills` doesn't push my personal workflow into anyone else's agent.

Root layout is flat and unchanged from before the merge, so existing `npx skills add joyehuang/skills/<skill-name>` commands keep working.

## Naming and structure conventions

- Directory name == `name:` in the SKILL.md frontmatter == the slug users type. Lowercase, hyphenated.
- `SKILL.md` is required and is the entry point. Frontmatter carries `name` and `description`; the description is what an agent matches against, so write it as trigger phrases, not a summary.
- Optional `argument-hint:` for slash-command style skills, `disable-model-invocation: true` for ones that should only run when explicitly invoked.
- Supporting files go in conventional subdirectories: `scripts/` (executables), `references/` and `rules/` (long-form docs the agent reads on demand), `assets/` (images, fonts, components), `templates/`, `examples/`, `evals/`.
- Keep `SKILL.md` short; push detail into `references/` so it's only loaded when needed.

## Install (portable skills)

```bash
# a single skill
npx skills add joyehuang/skills/<skill-name>

# everything at the root
npx skills add joyehuang/skills

# see what's in the repo
npx skills add joyehuang/skills --list
```

## How pi loads local skills

The pi agent auto-discovers skills from `~/.agents/skills/`. Each entry is a directory (or a **symlink to one**) containing a `SKILL.md`; pi reads the frontmatter `name`/`description` at startup and loads the body only when the description matches what you're asking for.

Current live setup on this machine:

```
~/.agents/skills/
├── ego-browser -> ~/.local/share/ego/ego-skills   # symlink, owned by the ego app — not vendored here
├── herdr-workflow/                                # mirrored to personal/herdr-workflow
├── publish-artifact/                              # mirrored to personal/publish-artifact
└── web-search/                                    # mirrored to personal/web-search
```

The three mirrored ones are **copies**, not moves — the live pi setup is untouched and still authoritative. To make this repo the single source of truth later, replace each live directory with a symlink:

```bash
# optional, one skill at a time; verify pi still sees it before doing the next
mv ~/.agents/skills/web-search ~/.agents/skills/web-search.bak
ln -s ~/dev/skills/personal/web-search ~/.agents/skills/web-search
```

Note `publish-artifact/scripts/` needs its npm dependency installed at the deployed location (`npm install` in that directory; `node_modules/` is gitignored). `ego-browser` is third-party and updated by the ego app itself — leave the symlink alone.

Claude Code uses a different path (`~/.claude/skills/` globally, `.claude/skills/` per project); the same symlink trick works there.

## Skills

### Learn & explore

| Skill | What it does |
| --- | --- |
| [`learn`](./learn) | Systematically learn an open-source project with cross-session progress tracking. |
| [`deep-dive`](./deep-dive) | Source-level deep dive into one module or system in the current project. |
| [`quiz`](./quiz) | Self-test on what you've learned from `/learn` or `/deep-dive`. |
| [`compare`](./compare) | Compare technical solutions in the context of the current project, with concrete code references. |
| [`explore-site`](./explore-site) | Explore any site that ships an agent manifest at `/.well-known/`. |

### Summarize & produce

| Skill | What it does |
| --- | --- |
| [`diff-story`](./diff-story) | Turn git changes into a coherent technical narrative. |
| [`blog`](./blog) | Transform learning notes / diff stories into publishable technical blog posts. |
| [`resume`](./resume) | Package project work into STAR-format resume content + interview prep. |
| [`brainstorm`](./brainstorm) | Discover secondary development directions for the current project. |
| [`archive-card-writer`](./archive-card-writer) | Turn fragmented notes into structured archive cards for a personal blog. |
| [`curated-content-writer`](./curated-content-writer) | Turn external papers / articles / links into concise curated entries with reading notes. |
| [`personal-wiki`](./personal-wiki) | Import and organize Markdown, Feishu docs, and LLM share links in a Git-backed personal Wiki. |

### Video & content production

| Skill | What it does |
| --- | --- |
| [`article-to-script`](./article-to-script) | Convert written articles into structured video scripts (timing, narration, scenes). |
| [`script-to-remotion`](./script-to-remotion) | Convert video scripts into runnable Remotion projects (React + TTS + render). |
| [`gemini-tts-fast`](./gemini-tts-fast) | Text-to-speech via Google Gemini TTS at fixed 1.2x speed, WAV output. |

### Presentation

| Skill | What it does |
| --- | --- |
| [`terminal-slide-deck`](./terminal-slide-deck) | Single-file HTML slide decks in a cyan-on-near-black terminal aesthetic, with a bespoke data-viz component library. ([demo](https://joyehuang.github.io/joye-skills/skills/terminal-slide-deck/references/demo-reference.html)) |

### Users & social

| Skill | What it does |
| --- | --- |
| [`user-insight-research`](./user-insight-research) | Generate a 7-day plan of user-insight research topics as strict JSON. |
| [`x-auto-engagement`](./x-auto-engagement) | Auto-like and reply to relevant tweets on a cron schedule. |

### Utilities

| Skill | What it does |
| --- | --- |
| [`screenshot`](./screenshot) | Capture desktop / window / region screenshots on macOS with permission preflight. |

### Personal (machine-specific — see [`personal/`](./personal))

| Skill | What it does |
| --- | --- |
| [`personal/web-search`](./personal/web-search) | Web search + page fetching via the Tavily API (key at `~/.config/tavily/key`). |
| [`personal/publish-artifact`](./personal/publish-artifact) | Report → styled HTML → Cloudflare R2 → clickable link pipeline. |
| [`personal/herdr-workflow`](./personal/herdr-workflow) | Preferred herdr pattern for spawning coding-agent workspaces (worktree + agents + file-based prompts). |

## License

[Apache License 2.0](./LICENSE), except [`terminal-slide-deck`](./terminal-slide-deck), which keeps the MIT license it shipped under in `joye-skills` ([terminal-slide-deck/LICENSE](./terminal-slide-deck/LICENSE)). `screenshot/` carries its own upstream Apache-2.0 notice.
