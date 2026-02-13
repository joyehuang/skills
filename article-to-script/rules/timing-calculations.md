---
title: Timing Calculations
phase: 5
purpose: Calculate precise durations, timestamps, and frame counts
---

# Timing Calculations

Convert word counts into precise timing data (seconds and frames) for video production.

## Goal

Calculate exact timing for each scene:
- Duration in seconds
- Start time (timestamp)
- Frame count and start frame (30 fps)

## Formulas

### Duration Calculation

**Formula**: `duration = wordCount / wordsPerSecond`

**Constants**:
- `wordsPerSecond = 1.25` (expanded narration rate)
- Round to nearest 0.5 seconds for clean timing

**Example**:
```
Narration: "Solar energy isn't just better for the planet—it's way better for your wallet too. You can cut your monthly energy bills by up to 70%, while also increasing your home's resale value. It's a win-win."

Word count: 42 words
Raw duration: 42 / 1.25 = 28 seconds
Rounded: 28.0 seconds (already clean)
```

**Rounding Rules**:
```
27.3s → 27.5s
27.7s → 28.0s
27.1s → 27.0s

Use: Math.round(duration * 2) / 2
```

### Start Time Calculation

**Formula**: `startTime = sum of all previous scene durations`

**Example**:
```
Scene 1: duration = 7.0s, startTime = 0s
Scene 2: duration = 22.5s, startTime = 7.0s (0 + 7.0)
Scene 3: duration = 16.0s, startTime = 29.5s (7.0 + 22.5)
Scene 4: duration = 18.5s, startTime = 45.5s (29.5 + 16.0)
Scene 5: duration = 11.0s, startTime = 64.0s (45.5 + 18.5)

Total duration: 75.0s
```

### Frame Calculations

**Constants**:
- `fps = 30` (frames per second)

**Formulas**:
```
startFrame = startTime * fps
durationFrames = duration * fps
```

**Example**:
```
Scene 2:
  startTime = 7.0s
  duration = 22.5s

  startFrame = 7.0 * 30 = 210
  durationFrames = 22.5 * 30 = 675
```

**Note**: Frames must be integers. If rounding is needed, round durations first (to 0.5s) so frames are always clean multiples of 15.

## Calculation Process

### Step 1: Count Words (1 min per scene)

For each scene's expanded narration:
```
Example narration: "What if I told you your roof could actually make you money while you sleep? Sound too good to be true?"

Word count: 22 words
```

### Step 2: Calculate Duration (1 min per scene)

Apply formula:
```
duration = 22 / 1.5 = 14.67 seconds
rounded = Math.round(14.67 * 2) / 2 = 14.5 seconds
```

### Step 3: Calculate Start Times (2 min total)

Work sequentially through scenes:
```
Scene 1: startTime = 0s, duration = 7.0s
Scene 2: startTime = 0 + 7.0 = 7.0s, duration = 22.5s
Scene 3: startTime = 7.0 + 22.5 = 29.5s, duration = 16.0s
...
```

### Step 4: Calculate Frames (1 min total)

For each scene:
```
Scene 1:
  startFrame = 0 * 30 = 0
  durationFrames = 7.0 * 30 = 210

Scene 2:
  startFrame = 7.0 * 30 = 210
  durationFrames = 22.5 * 30 = 675
```

### Step 5: Verify Total Duration (1 min)

**Critical Check**:
```
Sum all scene durations = total duration
Total MUST be 108-144 seconds
```

**If out of range**:
- < 90s: Go back to Stage 4, expand narrations more
- > 120s: Go back to Stage 4, trim narrations

### Step 6: Update Metadata (1 min)

Calculate final metadata:
```json
{
  "metadata": {
    "title": "Article Title",
    "duration": 105.5,  // Sum of all scene durations
    "fps": 30,
    "style": "neon-glassmorphism"
  }
}
```

## Output Format

```json
{
  "analysis": { /* From Stage 1 */ },
  "metadata": {
    "title": "10 Reasons to Switch to Solar Energy",
    "duration": 105.5,
    "fps": 30,
    "style": "neon-glassmorphism"
  },
  "scenes": [
    {
      "id": "scene-1",
      "type": "hook",
      "startTime": 0,
      "duration": 7.0,
      "startFrame": 0,
      "durationFrames": 210,
      "narration": "What if I told you your roof could actually make you money while you sleep? Sound too good to be true?",
      "visualCues": {
        "keywords": ["roof", "money", "sleep"],
        "animation": "bouncy"
      }
    },
    {
      "id": "scene-2",
      "type": "textDisplay",
      "startTime": 7.0,
      "duration": 22.5,
      "startFrame": 210,
      "durationFrames": 675,
      "narration": "Solar energy isn't just better for the planet—it's way better for your wallet too. You can cut your monthly energy bills by up to 70%, while also increasing your home's resale value. It's a win-win.",
      "visualCues": {
        "keywords": ["solar energy", "wallet", "70% savings"],
        "animation": "smooth"
      }
    },
    {
      "id": "scene-3",
      "type": "numberComparison",
      "startTime": 29.5,
      "duration": 16.0,
      "startFrame": 885,
      "durationFrames": 480,
      "narration": "Here's the best part: solar panels actually pay for themselves in just 6 to 8 years. With average savings of $1,500 every year and a 30% federal tax credit, you'll break even faster than you think.",
      "visualCues": {
        "keywords": ["pay for themselves", "6-8 years"],
        "numbers": [
          {
            "label": "Payback Period",
            "newValue": "6-8 years"
          },
          {
            "label": "Annual Savings",
            "oldValue": "$0",
            "newValue": "$1,500"
          }
        ],
        "animation": "smooth",
        "layout": "split-screen"
      }
    },
    {
      "id": "scene-4",
      "type": "threeColumns",
      "startTime": 45.5,
      "duration": 18.5,
      "startFrame": 1365,
      "durationFrames": 555,
      "narration": "And get this: today's solar panels come with 25-year performance warranties. They require minimal maintenance—just occasional cleaning. And they deliver lasting value for decades to come.",
      "visualCues": {
        "keywords": ["25-year warranty", "minimal maintenance", "lasting value"],
        "animation": "stagger"
      }
    },
    {
      "id": "scene-5",
      "type": "cta",
      "startTime": 64.0,
      "duration": 11.0,
      "startFrame": 1920,
      "durationFrames": 330,
      "narration": "Ready to start saving money? Schedule your free solar assessment today at GreenEnergy.com/free. Limited slots available this month—don't wait!",
      "visualCues": {
        "keywords": ["free assessment", "GreenEnergy.com", "limited slots"],
        "animation": "scale"
      }
    }
  ]
}
```

## Timing Validation

### Frame Alignment Check

All frames should be multiples of 15 (due to 0.5s rounding):
```
0.5s * 30fps = 15 frames
1.0s * 30fps = 30 frames
1.5s * 30fps = 45 frames
```

**If you see frames like 217 or 683**:
❌ Duration wasn't rounded to 0.5s
✅ Go back and fix rounding

### Continuity Check

Each scene's start time should equal previous scene's end time:
```
Scene 2 start: 7.0s
Scene 1 end: 0s + 7.0s = 7.0s ✓

Scene 3 start: 29.5s
Scene 2 end: 7.0s + 22.5s = 29.5s ✓
```

**If there are gaps or overlaps**:
❌ Start time calculation error
✅ Recalculate cumulative sum

### Total Duration Check

```
Sum all scene durations = metadata.duration
metadata.duration MUST be 108-144 seconds
```

**Critical**: This is the final gate before output. If out of range, must go back to Stage 4.

## Quality Checklist

Before finalizing script.json, verify:

- [ ] All scenes have `duration` calculated (rounded to 0.5s)
- [ ] All scenes have `startTime` calculated (cumulative)
- [ ] All scenes have `startFrame` calculated (startTime * 30)
- [ ] All scenes have `durationFrames` calculated (duration * 30)
- [ ] All frames are multiples of 15
- [ ] No gaps or overlaps between scenes
- [ ] metadata.duration equals sum of scene durations
- [ ] Total duration is 108-144 seconds
- [ ] metadata.fps is 30
- [ ] metadata.style is "neon-glassmorphism"

## Common Mistakes

❌ **Forgetting to round**: 14.67s instead of 14.5s → messy frame counts
❌ **Wrong words per second**: Using 2.5 instead of 1.5 → durations too short
❌ **Cumulative start time errors**: Not adding previous durations correctly
❌ **Frame rounding**: Rounding frames instead of seconds → misalignment
❌ **Skipping total check**: Not verifying 90-120s constraint

## Tips

✅ **Use a spreadsheet**: Track word counts, durations, start times in columns
✅ **Double-check math**: One error cascades through all subsequent scenes
✅ **Verify frames first**: If frames aren't multiples of 15, fix immediately
✅ **Keep 2 decimal places**: 7.0s not 7s, 22.5s not 22.50s (for consistency)
✅ **Test with real TTS**: If possible, generate audio and verify timing feels right

## Example Calculation Workflow

```
Scene 1: Hook
  Word count: 22
  Duration: 22 / 1.5 = 14.67 → 14.5s
  Start: 0s
  Frames: 0, 435 (14.5 * 30)

Scene 2: TextDisplay
  Word count: 42
  Duration: 42 / 1.25 = 28 → 28.0s
  Start: 14.5s
  Frames: 435, 840 (28.0 * 30)

Scene 3: NumberComparison
  Word count: 38
  Duration: 38 / 1.5 = 25.33 → 25.5s
  Start: 42.5s (14.5 + 28.0)
  Frames: 1275, 765 (25.5 * 30)

Scene 4: ThreeColumns
  Word count: 32
  Duration: 32 / 1.5 = 21.33 → 21.5s
  Start: 68.0s (42.5 + 25.5)
  Frames: 2040, 645 (21.5 * 30)

Scene 5: CTA
  Word count: 27
  Duration: 27 / 1.5 = 18 → 18.0s
  Start: 89.5s (68.0 + 21.5)
  Frames: 2685, 540 (18.0 * 30)

Total: 107.5s ✓ (within 90-120s)
```

## Next Step

Once all timing calculations are complete and verified, proceed to **Quality Checklist** (`quality-checklist.md`) for final validation before outputting script.json.
