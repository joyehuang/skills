---
name: article-to-script
description: Convert written articles into structured video scripts with timing, narration, and scene breakdowns
tags: [video, content, script, documentation]
version: 3.0.0
---

# article-to-script

Convert written articles into structured video scripts ready for video production. This skill analyzes articles, designs scene structures, generates narrations, and calculates precise timing for video creation.

## ⚠️ CRITICAL REQUIREMENT: English Language Only

**ALL NARRATIONS MUST BE WRITTEN IN ENGLISH**

This is a **non-negotiable requirement**. Regardless of the input article's language (Chinese, Japanese, Spanish, etc.), all output narrations in `script.json` MUST be in **English**.

**Why English?**
- ✅ International audience reach
- ✅ TTS compatibility across all platforms
- ✅ Professional standard for global content
- ✅ Easier translation to other languages if needed

**If you generate narrations in any language other than English, the script is INVALID and must be regenerated.**

## When to Use

Use this skill when you need to:
- Convert blog posts or articles into video scripts
- Design structured narratives for social media videos (108-144 seconds)
- Plan scene-by-scene breakdowns with visual cues
- Generate narrations optimized for text-to-speech playback
- Calculate precise timing for video production workflows

**Do NOT use** for:
- Direct video rendering (use `script-to-remotion` for that)
- Transcript generation from existing videos
- Interactive video content

## How to Use

### Input Requirements

- **Article file** (markdown format)
  - Clear structure with headings
  - 500-2000 words recommended
  - Contains core message, key points, and call-to-action

### Output

- **script.json**: Unified JSON file containing:
  - Article analysis (core message, audience, key points)
  - Complete scene structure (5-7 scenes)
  - **Narrations for each scene (MUST be in English)**
  - Precise timing calculations (seconds and frames)
  - Visual cues and animation suggestions

**CRITICAL**: All narrations MUST be written in **English**, regardless of the input article language. This is required for TTS generation and international audience reach.

### Workflow Overview

The skill follows a **5-stage workflow**:

1. **Article Analysis** → Extract core message, audience, key points, hook, CTA
2. **Scene Structure Design** → Plan 5-7 scenes with types and flow
3. **Script Generation** → Write narrations (2-3 words/second baseline)
4. **Narration Expansion** → Expand to 1.25 words/second for 1.2x playback
5. **Timing Calculations** → Calculate durations, frames, and timestamps

Each stage is documented in detail in the `rules/` directory.

### Example Usage

```bash
# 1. Read the article
Read /path/to/article.md

# 2. Follow the workflow (read rule files in order)
Read .claude/skills/article-to-script/rules/workflow-overview.md
Read .claude/skills/article-to-script/rules/article-analysis.md
Read .claude/skills/article-to-script/rules/scene-structure.md
Read .claude/skills/article-to-script/rules/script-generation.md
Read .claude/skills/article-to-script/rules/narration-expansion.md
Read .claude/skills/article-to-script/rules/timing-calculations.md

# 3. Generate the script
Write /path/to/output/script.json

# 4. Validate against schema
Read .claude/skills/article-to-script/schemas/script-schema.json
# Verify structure matches

# 5. Quality check
Read .claude/skills/article-to-script/rules/quality-checklist.md
```

## Key Features

### Intelligent Scene Types

The skill supports 6 scene types optimized for different content:

- **Hook** (5-8s): Grab attention with bold statement
- **Text Display** (15-20s): Present core message or key point
- **Number Comparison** (12-18s): Show before/after or statistics
- **Three Columns** (15-20s): Compare 3 items or show progression
- **Case Study** (20-30s): Tell a story or show transformation
- **CTA** (8-12s): Clear call-to-action with contact info

### Timing Optimization

- **Baseline**: 2-3 words/second for natural TTS speech
- **Expansion**: 1.25 words/second for 1.2x playback speed
- **Frame precision**: Convert seconds to frames (30 fps default)
- **Scene pacing**: Automated duration distribution

### Quality Assurance

Built-in validation checks:
- Total duration: 108-144 seconds
- Scene count: 5-7 scenes
- Narration pacing: Within optimal ranges
- Visual cue completeness
- JSON schema compliance

## Rule Files

All workflow rules are documented in `rules/`:

- **workflow-overview.md**: Complete end-to-end process
- **article-analysis.md**: Extract core message and structure
- **scene-structure.md**: Design scene flow and types
- **script-generation.md**: Write effective narrations
- **narration-expansion.md**: Optimize for TTS playback
- **timing-calculations.md**: Duration and frame formulas
- **quality-checklist.md**: Validation criteria

## Schema Reference

- **schemas/script-schema.json**: Complete JSON Schema for output validation

## Examples

- **examples/sample-article.md**: Reference article input
- **examples/sample-script.json**: Complete script output with all fields

## Next Steps

After generating `script.json`, use the **script-to-remotion** skill to:
1. Generate React components for each scene
2. Assemble a complete Remotion project
3. Optionally generate TTS audio
4. Render the final video

## Version History

- **v3.0.0** (2025-01): Pure documentation skill, unified schema
- **v2.1.0** (2024-12): CLI-based Phase 1-3 implementation
- **v1.0.0** (2024-11): Initial monolithic skill

## Support

For issues or questions:
- Check `rules/quality-checklist.md` for common problems
- Review `examples/` for reference implementations
- Consult `script-to-remotion` skill for downstream workflow
