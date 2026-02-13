---
title: Scene Structure Design
phase: 2
purpose: Plan 5-7 scenes with optimal flow and visual types
---

# Scene Structure Design

Design the scene-by-scene structure that will bring the article to life visually.

## Goal

Create a logical narrative flow with 5-7 scenes, each assigned an optimal visual type and animation style.

## Scene Types

### Available Scene Types

| Type | Duration | Use Case | Visual Style |
|------|----------|----------|--------------|
| **hook** | 5-8s | Opening attention-grabber | Bold text, typewriter effect, bouncy entrance |
| **textDisplay** | 15-20s | Present core message or key point | Large text with fitText, slide-in animations |
| **numberComparison** | 12-18s | Show before/after, statistics | Animated number changes, comparison layout |
| **threeColumns** | 15-20s | Compare 3 items, show progression | Staggered column reveals |
| **caseStudy** | 20-30s | Tell story, show transformation | Sequential reveals, before/after transitions |
| **cta** | 8-12s | Call to action with contact | Multi-step reveal, emphasis on action |

### Scene Type Selection Guide

**hook** - Use when:
- ✅ Opening the video (Scene 1)
- ✅ Bold statement or question
- ✅ Need maximum attention in < 8 seconds

**textDisplay** - Use when:
- ✅ Presenting core message
- ✅ Explaining a single concept
- ✅ Need clean, readable text focus

**numberComparison** - Use when:
- ✅ Showing statistics (e.g., "70% savings")
- ✅ Before/after comparisons
- ✅ Data has visual impact

**threeColumns** - Use when:
- ✅ Comparing 3 options or features
- ✅ Showing 3-step process
- ✅ Listing advantages

**caseStudy** - Use when:
- ✅ Telling a customer story
- ✅ Showing transformation over time
- ✅ Need narrative depth (longest scene)

**cta** - Use when:
- ✅ Closing the video (final scene)
- ✅ Presenting action steps
- ✅ Showing contact info

## Mandatory Scene Requirements

### Must Include

1. **Hook Scene** (Scene 1): REQUIRED
   - Type: `hook`
   - Duration: 5-8 seconds
   - Purpose: Grab attention immediately

2. **CTA Scene** (Final Scene): REQUIRED
   - Type: `cta`
   - Duration: 8-12 seconds
   - Purpose: Clear next action

### Recommended Structure

**5-Scene Template** (90-100 seconds):
```
1. Hook (6s)
2. TextDisplay - Core Message (18s)
3. NumberComparison - Key Stat (15s)
4. TextDisplay - Supporting Point (20s)
5. CTA (12s)
Total: 71s base (will expand to ~95s after narration)
```

**6-Scene Template** (100-115 seconds):
```
1. Hook (6s)
2. TextDisplay - Core Message (16s)
3. NumberComparison - Stat 1 (14s)
4. ThreeColumns - 3 Benefits (18s)
5. TextDisplay - Final Point (16s)
6. CTA (10s)
Total: 80s base (will expand to ~105s)
```

**7-Scene Template** (110-120 seconds):
```
1. Hook (6s)
2. TextDisplay - Core Message (15s)
3. NumberComparison - Stat 1 (13s)
4. ThreeColumns - 3 Benefits (17s)
5. CaseStudy - Customer Story (25s)
6. TextDisplay - Final Point (14s)
7. CTA (10s)
Total: 100s base (will expand to ~115s)
```

## Design Process

### Step 1: Review Analysis (1 min)

From Stage 1, you have:
- Core message
- 3-5 key points with evidence
- Hook text
- CTA text

### Step 2: Map Content to Scenes (3 min)

**Assign each key point to a scene type**:

Example mapping:
```
Key Point 1: "Solar panels pay for themselves in 6-8 years"
→ Scene Type: numberComparison
→ Why: Focus on "6-8 years" number, before/after savings

Key Point 2: "Modern panels last 25-30 years"
→ Scene Type: textDisplay
→ Why: Single strong statement about longevity

Key Point 3: "Installation takes just 1-3 days"
→ Scene Type: threeColumns
→ Why: Show 3-day process (Day 1, 2, 3)
```

### Step 3: Plan Scene Flow (2 min)

**Ensure logical narrative progression**:

1. **Hook** → Grab attention
2. **Problem/Context** → Why this matters
3. **Solution/Benefit** → Core value proposition
4. **Evidence** → Proof points (data, examples)
5. **Reinforcement** → Additional benefits
6. **CTA** → Next action

### Step 4: Define Visual Cues (2 min)

For each scene, specify:

**Keywords**: 2-5 key words/phrases to emphasize visually
- Should be nouns, numbers, or action verbs
- Will be styled prominently in animations

**Numbers** (if applicable): Data to display
```json
{
  "label": "Annual Savings",
  "oldValue": "$0",
  "newValue": "$1,500"
}
```

**Animation**: Spring-based animation style
- "bouncy" - Energetic, attention-grabbing
- "smooth" - Professional, flowing
- "stagger" - Sequential reveals
- "scale" - Zoom in/out emphasis

**Layout** (optional): Spatial arrangement
- "split-screen" - Two-column comparison
- "centered" - Single focus point
- "grid-3" - Three-column layout

## Output Format

```json
{
  "scenes": [
    {
      "id": "scene-1",
      "type": "hook",
      "narration": "", // To be filled in Stage 3
      "visualCues": {
        "keywords": ["roof", "money", "sleep"],
        "animation": "bouncy"
      }
    },
    {
      "id": "scene-2",
      "type": "textDisplay",
      "narration": "",
      "visualCues": {
        "keywords": ["solar energy", "wallet", "70% savings"],
        "animation": "smooth"
      }
    },
    {
      "id": "scene-3",
      "type": "numberComparison",
      "narration": "",
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
      "narration": "",
      "visualCues": {
        "keywords": ["25-year warranty", "minimal maintenance", "lasting value"],
        "animation": "stagger"
      }
    },
    {
      "id": "scene-5",
      "type": "cta",
      "narration": "",
      "visualCues": {
        "keywords": ["free assessment", "GreenEnergy.com", "limited slots"],
        "animation": "scale"
      }
    }
  ]
}
```

## Quality Checklist

Before moving to Stage 3, verify:

- [ ] 5-7 scenes total
- [ ] First scene is type `hook`
- [ ] Last scene is type `cta`
- [ ] Each scene has appropriate type for content
- [ ] Visual cues defined for all scenes
- [ ] Keywords are specific and visually compelling
- [ ] Narrative flow is logical (problem → solution → proof → action)
- [ ] Scene types varied (not all textDisplay)

## Common Mistakes

❌ **Too many scenes**: > 7 scenes = rushed, fragmented
❌ **Wrong scene type**: Using textDisplay for data that should be numberComparison
❌ **No variation**: All scenes same type = boring
❌ **Weak keywords**: Generic words like "this" or "it" instead of concrete nouns
❌ **Illogical flow**: Jumping to CTA before presenting benefits

## Tips

✅ **Front-load value**: Best scenes should be #2-3 (highest retention)
✅ **Use data scenes wisely**: numberComparison and threeColumns are high-impact
✅ **Vary pacing**: Mix short (hook, CTA) with longer scenes (caseStudy)
✅ **Think visually**: Choose keywords that can be styled creatively
✅ **Test the flow**: Read scene IDs in order—does it tell a story?

## Next Step

Once scene structure is complete, proceed to **Stage 3: Script Generation** (`script-generation.md`)
