---
title: Workflow Overview
phase: 0
purpose: Complete end-to-end process description
---

# Workflow Overview

This document describes the complete workflow for converting an article into a structured video script.

## Process Summary

```
Article (MD) → [Analysis] → [Structure] → [Scripts] → [Expansion] → [Timing] → script.json
```

**Total Time**: 15-30 minutes (depending on article complexity)

## Five Stages

### Stage 1: Article Analysis (5 min)

**Goal**: Extract core message and key information

**Actions**:
1. Read entire article carefully
2. Identify core message (1-2 sentences)
3. Determine target audience
4. Extract 3-5 key points with evidence
5. Create attention-grabbing hook
6. Craft clear call-to-action
7. Determine tone (professional/casual/urgent)

**Output**: Analysis object (embedded in script.json)

**Rule File**: `article-analysis.md`

### Stage 2: Scene Structure Design (8 min)

**Goal**: Plan 5-7 scenes with optimal flow

**Actions**:
1. Review analysis from Stage 1
2. Design scene sequence (must include Hook + CTA)
3. Select scene types for each segment
4. Plan visual cues and animations
5. Ensure logical narrative flow
6. Balance scene durations (target: 90-120s total)

**Output**: Scene array with types and visual cues

**Rule File**: `scene-structure.md`

### Stage 3: Script Generation (10 min)

**Goal**: Write narrations for each scene

**Actions**:
1. Write conversational narrations
2. Target 2-3 words/second (baseline for natural TTS)
3. Use simple, active language
4. Include emotional hooks
5. Ensure smooth transitions between scenes
6. Keep each narration focused and concise

**Output**: Narration text for each scene

**Rule File**: `script-generation.md`

### Stage 4: Narration Expansion (5 min)

**Goal**: Optimize narrations for 1.2x playback

**Why**: TTS audio will be played at 1.2x speed for engagement

**Actions**:
1. Expand each narration to 1.25 words/second
2. Add descriptive details
3. Include transition phrases
4. Maintain natural flow
5. Preserve core message

**Calculation**:
```
Baseline: 2.5 words/sec
Target for 1.2x: 2.5 / 1.25 = 2.0 words/sec
Actual TTS: 1.5-1.6 words/sec (natural speech)
Result: 1.5 * 1.25 = 1.875-2.0 words/sec (feels natural)
```

**Rule File**: `narration-expansion.md`

### Stage 5: Timing Calculations (3 min)

**Goal**: Calculate precise durations and frame counts

**Actions**:
1. Count words in each expanded narration
2. Calculate duration: `words / 1.25 seconds`
3. Round to nearest 0.5 seconds
4. Calculate cumulative start times
5. Convert to frames (30 fps): `seconds * 30`
6. Verify total duration: 108-144 seconds

**Formulas**:
```
duration = wordCount / 1.5 (rounded to 0.5s)
startTime = sum of previous durations
startFrame = startTime * 30
durationFrames = duration * 30
```

**Rule File**: `timing-calculations.md`

## Quality Gates

After each stage, verify:

- ✅ **Stage 1**: Core message clear, 3-5 key points identified
- ✅ **Stage 2**: 5-7 scenes, includes Hook + CTA, types assigned
- ✅ **Stage 3**: All narrations written, 2-3 words/sec
- ✅ **Stage 4**: Narrations expanded to 1.5-1.6 words/sec
- ✅ **Stage 5**: Total duration 90-120s, all frames calculated

**Final Validation**: `quality-checklist.md`

## Data Flow

```
┌─────────────────────────────────────────────────┐
│ Stage 1: Article Analysis                       │
├─────────────────────────────────────────────────┤
│ • coreMessage                                   │
│ • targetAudience                                │
│ • keyPoints[]                                   │
│ • hook, cta, tone                               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Stage 2: Scene Structure                        │
├─────────────────────────────────────────────────┤
│ • scenes[].type                                 │
│ • scenes[].visualCues                           │
│ • Narrative flow validation                     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Stage 3: Script Generation                      │
├─────────────────────────────────────────────────┤
│ • scenes[].narration (baseline)                 │
│ • 2-3 words/second target                       │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Stage 4: Narration Expansion                    │
├─────────────────────────────────────────────────┤
│ • scenes[].narration (expanded)                 │
│ • 1.25 words/second target                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Stage 5: Timing Calculations                    │
├─────────────────────────────────────────────────┤
│ • scenes[].duration                             │
│ • scenes[].startTime                            │
│ • scenes[].startFrame                           │
│ • scenes[].durationFrames                       │
│ • metadata.duration (total)                     │
└─────────────────────────────────────────────────┘
                    ↓
                script.json
```

## Output Structure

The final `script.json` contains:

```json
{
  "analysis": { /* Stage 1 output */ },
  "metadata": {
    "title": "Article Title",
    "duration": 105.5,
    "fps": 30,
    "style": "neon-glassmorphism"
  },
  "scenes": [
    {
      "id": "scene-1",
      "type": "hook",
      "startTime": 0,
      "duration": 6.5,
      "startFrame": 0,
      "durationFrames": 195,
      "narration": "Expanded narration text...",
      "visualCues": { /* keywords, animation */ }
    },
    // ... more scenes
  ]
}
```

## Next Steps

1. Follow each rule file in sequence
2. Generate complete script.json
3. Validate with quality-checklist.md
4. Use script-to-remotion skill for video production

## Common Pitfalls

- ❌ Skipping narration expansion (results in too-fast video)
- ❌ Not rounding durations (causes frame misalignment)
- ❌ Missing quality checks (invalid JSON structure)
- ❌ Ignoring total duration constraint (90-120s)

## Success Criteria

- ✅ All 5 stages completed
- ✅ script.json validates against schema
- ✅ Total duration within 108-144 seconds
- ✅ All timing calculations accurate
- ✅ Narrations natural and engaging
