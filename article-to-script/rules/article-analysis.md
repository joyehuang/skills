---
title: Article Analysis
phase: 1
purpose: Extract core message and key information from article
---

# Article Analysis

Extract the essential information needed to create a compelling video script.

## Goal

Distill the article into its core message, key points, and structural elements that will guide scene design.

## Process

### 1. Initial Reading (2 min)

Read the entire article to understand:
- Main topic and thesis
- Target audience and tone
- Key arguments and evidence
- Desired outcome (what should viewers do?)

### 2. Core Message Extraction (1 min)

**Core Message**: A 1-2 sentence summary of the article's main point.

**Requirements**:
- Clear and concise
- Captures the "so what?" of the article
- Can be spoken in 5-8 seconds
- Emotionally engaging

**Example**:
```
Article: "10 Reasons to Switch to Solar Energy"
Core Message: "Solar energy isn't just better for the planet—it's better for your wallet, cutting energy bills by up to 70% while increasing home value."
```

### 3. Target Audience Identification (1 min)

**Target Audience**: Who is this content for?

**Consider**:
- Demographics (age, location, income)
- Psychographics (values, interests, pain points)
- Prior knowledge level
- Decision-making power

**Example**:
```
"Homeowners aged 35-55 interested in sustainability and long-term cost savings"
```

### 4. Key Points Extraction (3-5 min)

**Key Points**: 3-5 main arguments or facts that support the core message.

**Each key point must have**:
- **Point**: Clear statement (1 sentence)
- **Evidence**: Supporting data, example, or reasoning (1-2 sentences)

**Selection Criteria**:
- ✅ Directly supports core message
- ✅ Has concrete evidence or example
- ✅ Resonates emotionally or logically
- ✅ Can be visualized in video
- ❌ Avoid tangential information
- ❌ Skip weak or unsupported claims

**Example**:
```json
{
  "point": "Solar panels pay for themselves in 6-8 years",
  "evidence": "With average energy savings of $1,500/year and federal tax credits covering 30%, most homeowners break even quickly."
}
```

### 5. Hook Creation (2 min)

**Hook**: Attention-grabbing opening statement (5-8 seconds)

**Effective hooks**:
- Ask a provocative question
- State a surprising fact
- Challenge a common belief
- Present a bold claim

**Formula**: [Surprise/Question] + [Relevance to viewer]

**Examples**:
- "What if I told you your roof could make you money while you sleep?"
- "97% of homeowners don't know this about their energy bills."
- "You're throwing away $2,000 every year. Here's how to stop."

### 6. Call-to-Action (CTA) Design (1 min)

**CTA**: Clear next step for the viewer (8-12 seconds)

**Requirements**:
- Specific action (not vague like "learn more")
- Low friction (easy to complete)
- Time-sensitive if possible
- Includes contact method

**Examples**:
- "Schedule your free solar assessment at GreenEnergy.com/free"
- "Download our 2025 Solar Savings Calculator—link in bio"
- "Call 1-800-GO-SOLAR today for 20% off installation"

### 7. Tone Selection (1 min)

**Tone**: The emotional style of delivery

**Options**:
- **Professional**: Authoritative, data-driven, trustworthy (B2B, finance, health)
- **Casual**: Friendly, conversational, accessible (lifestyle, consumer products)
- **Urgent**: Pressing, action-oriented, FOMO-driven (limited offers, breaking news)

**Selection Guide**:
- Match article's original tone
- Consider audience expectations
- Align with brand voice

## Output Format

```json
{
  "analysis": {
    "coreMessage": "Solar energy isn't just better for the planet—it's better for your wallet, cutting energy bills by up to 70% while increasing home value.",
    "targetAudience": "Homeowners aged 35-55 interested in sustainability and long-term cost savings",
    "keyPoints": [
      {
        "point": "Solar panels pay for themselves in 6-8 years",
        "evidence": "With average energy savings of $1,500/year and federal tax credits covering 30%, most homeowners break even quickly."
      },
      {
        "point": "Solar increases home resale value by 4-6%",
        "evidence": "Studies show homes with solar sell for $15,000 more on average and spend 20% less time on the market."
      },
      {
        "point": "Modern solar panels last 25-30 years",
        "evidence": "Today's panels come with 25-year performance warranties and require minimal maintenance—just occasional cleaning."
      }
    ],
    "hook": "What if I told you your roof could make you money while you sleep?",
    "cta": "Schedule your free solar assessment at GreenEnergy.com/free—limited slots available this month.",
    "tone": "professional"
  }
}
```

## Quality Checklist

Before moving to Stage 2, verify:

- [ ] Core message is 1-2 sentences and under 20 words
- [ ] Target audience is specific (not "everyone")
- [ ] 3-5 key points identified
- [ ] Each key point has supporting evidence
- [ ] Hook is attention-grabbing and relevant
- [ ] CTA is specific and actionable
- [ ] Tone is selected and consistent with content

## Common Mistakes

❌ **Too many key points**: Stick to 3-5. More = diluted message
❌ **Weak evidence**: "Studies show" without specifics isn't compelling
❌ **Generic CTA**: "Visit our website" isn't actionable
❌ **Boring hook**: Starting with "In this video..." wastes precious seconds
❌ **Mismatched tone**: Casual tone for serious medical content confuses viewers

## Tips

✅ **Use data**: Numbers are memorable ("70% savings" > "significant savings")
✅ **Think visually**: Choose key points that can be shown, not just told
✅ **Test the hook**: Would YOU stop scrolling for this?
✅ **Make CTA urgent**: Add scarcity or time limit when appropriate

## Next Step

Once analysis is complete, proceed to **Stage 2: Scene Structure Design** (`scene-structure.md`)
