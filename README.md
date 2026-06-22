# joyehuang/skills

[![skills.sh](https://skills.sh/b/joyehuang/skills)](https://skills.sh/joyehuang/skills)

A personal collection of [agent skills](https://skills.sh) — reusable procedural knowledge for AI coding agents (Claude Code, OpenCode, Cursor, Codex, and anything that speaks the `SKILL.md` convention).

Each subdirectory is an independently installable skill with its own `SKILL.md`.

## Install

```bash
# install a single skill
npx skills add joyehuang/skills/<skill-name>

# install all skills in this repo
npx skills add joyehuang/skills
```

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

### Video & content production

| Skill | What it does |
| --- | --- |
| [`article-to-script`](./article-to-script) | Convert written articles into structured video scripts (timing, narration, scenes). |
| [`script-to-remotion`](./script-to-remotion) | Convert video scripts into runnable Remotion projects (React + TTS + render). |
| [`gemini-tts-fast`](./gemini-tts-fast) | Text-to-speech via Google Gemini TTS at fixed 1.2x speed, WAV output. |

### Users & social

| Skill | What it does |
| --- | --- |
| [`user-insight-research`](./user-insight-research) | Generate a 7-day plan of user-insight research topics as strict JSON. |
| [`x-auto-engagement`](./x-auto-engagement) | Auto-like and reply to relevant tweets on a cron schedule. |

### Utilities

| Skill | What it does |
| --- | --- |
| [`screenshot`](./screenshot) | Capture desktop / window / region screenshots on macOS with permission preflight. |

## License

[Apache License 2.0](./LICENSE).
