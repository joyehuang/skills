---
title: Narration Expansion
phase: 4
purpose: Optimize narrations for 1.2x playback speed
---

# Narration Expansion

Expand narrations to compensate for 1.2x TTS playback speed, ensuring natural pacing when played back.

## Goal

Transform baseline narrations (2-3 words/second) into expanded versions (1.25 words/second) that sound natural when played at 1.2x speed.

## Why Expansion?

### The Math

**Problem**: TTS at normal speed (2.5 w/s) sounds too slow for social media videos.

**Solution**: Generate TTS at slower speed, play back at 1.2x.

```
Normal TTS:     2.5 words/second (sounds slow)
                      ↓
Generate at:    1.25 words/second (sounds VERY slow)
                      ↓
Play at 1.2x:   1.5 words/second (sounds natural!)
```

### The Result

Viewers hear natural-paced speech (1.5 w/s), but TTS engines generate at slower pace for clarity.

**Benefits**:
- ✅ Clearer pronunciation
- ✅ Better emphasis on keywords
- ✅ More natural rhythm
- ✅ Easier to follow
- ✅ Video duration matches target (90-120s becomes 75-100s after 1.2x)

## Target Ratios

| Metric | Baseline (Stage 3) | Expanded (Stage 4) | After 1.2x Playback |
|--------|-------------------|-------------------|---------------------|
| Words/second | 2.5 | 1.25 | 1.5 |
| Scene duration | 12s | 19.2s | 16s (19.2 ÷ 1.2) |
| Total duration | 60-85s | 108-144s | 90-120s |

**Critical**: Expanded duration MUST be 108-144 seconds (final video after 1.2x will be 90-120s).

## Expansion Techniques

### 1. Add Descriptive Details

**Baseline**:
```
"Solar panels pay for themselves in 6 to 8 years."
(10 words = 4s → expands to 6s)
```

**Expanded**:
```
"Here's something amazing: solar panels actually pay for themselves in just 6 to 8 years."
(15 words = 10s → plays back at 8s)
```

**Techniques**:
- Add introductory phrases: "Here's the thing..." "Get this..."
- Include emphasis words: "actually," "really," "truly"
- Use descriptive adjectives: "amazing," "incredible," "simple"

### 2. Include Transition Phrases

**Baseline**:
```
"You'll save $1,500 per year. That's a 30% tax credit."
(11 words = 4.4s → 6.6s)
```

**Expanded**:
```
"You'll save around $1,500 every single year. And here's the best part: you'll get a 30% federal tax credit to help cover costs."
(24 words = 16s → 12.8s)
```

**Techniques**:
- Add connectors: "And here's the best part..." "But wait, there's more..."
- Use clarifying phrases: "In other words..." "What this means is..."
- Include time references: "Right now," "Today," "Over the long term"

### 3. Elaborate on Numbers

**Baseline**:
```
"Cut energy bills by 70%."
(5 words = 2s → 3s)
```

**Expanded**:
```
"You can cut your monthly energy bills by up to 70%. That means if you're paying $200 now, you could be paying just $60."
(25 words = 16.7s → 13.3s)
```

**Techniques**:
- Give context: "That means..." "To put it in perspective..."
- Add concrete examples: "$200 now vs. $60 later"
- Include comparisons: "That's like..." "Imagine..."

### 4. Reinforce Key Points

**Baseline**:
```
"Modern panels last 25 to 30 years."
(7 words = 2.8s → 4.2s)
```

**Expanded**:
```
"Here's something most people don't know: modern solar panels are built to last 25 to 30 years. That's decades of reliable, clean energy."
(25 words = 16.7s → 13.3s)
```

**Techniques**:
- Add revelation phrases: "Here's what most people don't know..."
- Include benefit statements: "That means..." "Which gives you..."
- Use parallel structure: "X, Y, and Z"

### 5. Expand Transitions

**Baseline**:
```
Scene 2 ends: "Cut bills by 70%."
Scene 3 starts: "Panels pay for themselves in 6-8 years."
```

**Expanded**:
```
Scene 2 ends: "You can cut your bills by up to 70%. So how long until you break even?"
Scene 3 starts: "Great question. Solar panels actually pay for themselves in just 6 to 8 years. Let me show you the math."
```

## Expansion Process

### Step 1: Calculate Target Word Count (1 min per scene)

**Formula**: `target_words = baseline_words × 2.0`

Example:
```
Baseline: "Solar panels pay for themselves in 6 to 8 years."
Baseline words: 10
Target: 10 × 2.0 = 20 words
```

### Step 2: Expand Narration (3 min per scene)

Add details using techniques above while maintaining:
- Original message and key points
- Natural conversational flow
- TTS-friendly language

### Step 3: Count and Adjust (1 min per scene)

**Check word count**:
```
Expanded: "Here's something amazing: solar panels actually pay for themselves in just 6 to 8 years."
Count: 15 words (close to target of 16)
Duration: 15 / 1.5 = 10 seconds
Playback at 1.2x: 10 / 1.25 = 8 seconds ✓
```

**If too short**: Add more detail
**If too long**: Remove filler words

### Step 4: Verify Total Duration (2 min)

**Critical Check**:
```
Sum all scene word counts
Total words / 1.25 = expanded duration
Expanded duration MUST be 108-144 seconds
```

**If total < 90s**: Expand shorter scenes more
**If total > 120s**: Trim longer scenes or consolidate

## Scene-Specific Expansion Targets

| Scene Type | Baseline Words | Target Expansion | Expanded Words |
|------------|---------------|-----------------|----------------|
| Hook | 10-15 | 1.8x | 18-27 |
| TextDisplay | 25-40 | 2.0x | 50-80 |
| NumberComparison | 25-35 | 2.0x | 50-70 |
| ThreeColumns | 25-40 | 2.0x | 50-80 |
| CaseStudy | 40-60 | 2.0x | 80-120 |
| CTA | 18-25 | 1.8x | 32-45 |

**Note**: Hook and CTA need slightly less expansion (1.8x) to keep them punchy.

## Output Format

```json
{
  "scenes": [
    {
      "id": "scene-1",
      "type": "hook",
      "narration": "What if I told you your roof could actually make you money while you sleep? Sound too good to be true?",
      "visualCues": { /* ... */ }
    },
    {
      "id": "scene-2",
      "type": "textDisplay",
      "narration": "Solar energy isn't just better for the planet—it's way better for your wallet too. You can cut your monthly energy bills by up to 70%, while also increasing your home's resale value. It's a win-win.",
      "visualCues": { /* ... */ }
    }
    // ... more expanded scenes
  ]
}
```

## Quality Checklist

Before moving to Stage 5, verify:

- [ ] All narrations expanded from baseline
- [ ] Word count per scene in target range
- [ ] Total word count: 135-180 words (for 90-120s duration)
- [ ] Narrations still sound natural and conversational
- [ ] No meaningless filler ("um," "like," "you know")
- [ ] Key messages preserved from baseline
- [ ] Transitions between scenes still smooth

## Common Mistakes

❌ **Over-expansion**: Adding so much fluff that meaning gets lost
❌ **Robotic phrasing**: "Furthermore, additionally, moreover..." (sounds like an essay)
❌ **Losing key points**: Getting sidetracked and forgetting the core message
❌ **Inconsistent expansion**: Some scenes 1.3x, others 2x (should be 1.5-2.0x consistently)
❌ **Forgetting playback math**: Expanding to 1.8x thinking "more is better"

## Tips

✅ **Test read-aloud**: Expanded narration should still sound natural
✅ **Use "you" language**: "You'll save" not "One will save"
✅ **Add energy**: Expanded doesn't mean boring—add excitement
✅ **Stay on brand**: Keep the tone from Stage 1 analysis
✅ **Check total first**: Make sure final total is 90-120s before fine-tuning

## Example: Before vs. After

### Before Expansion (Stage 3)

```
Scene 2 (TextDisplay):
"Solar energy isn't just better for the planet—it's better for your wallet. Cut your energy bills by up to 70% while increasing your home's value."

Words: 28
Duration: 28 / 2.5 = 11.2s
```

### After Expansion (Stage 4)

```
Scene 2 (TextDisplay):
"Solar energy isn't just better for the planet—it's way better for your wallet too. You can cut your monthly energy bills by up to 70%, while also increasing your home's resale value. It's a win-win."

Words: 42
Duration: 42 / 1.5 = 28s
Playback at 1.2x: 28 / 1.25 = 22.4s ✓
```

**Changes**:
- Added "way" and "too" for emphasis
- Changed "Cut" to "You can cut your monthly" for clarity
- Added "It's a win-win" as reinforcement
- Result: 1.5x expansion, natural flow

## Next Step

Once all narrations are expanded and total duration is 90-120s, proceed to **Stage 5: Timing Calculations** (`timing-calculations.md`)
