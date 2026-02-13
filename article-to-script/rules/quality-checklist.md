---
title: Quality Checklist
phase: 6
purpose: Final validation - Focus on Executability over Visual Effects
---

# Quality Checklist

**核心原则**：可执行性 > 视觉效果。脚本必须是"可执行的制作手册"，不是"炫技的概念设计"。

## 🎯 最重要的3个问题

写完脚本后，先问自己：

1. **如果我是制作者，能不能直接照着做？**
   - 如果需要"解读"或"想象"，就是失败的

2. **如果我是观众，2分钟后能记住什么？**
   - 答不出3个核心点，就是信息不够清晰

3. **旁白内容够硬吗？**
   - 去掉视觉特效，光听旁白能不能传递价值？

## 1. Structure Validation

### Analysis Object
- [ ] `coreMessage` exists (1-2 sentences, < 30 words)
- [ ] `targetAudience` is specific (not "everyone")
- [ ] `keyPoints` array has 3-5 items
- [ ] Each key point has `point` and `evidence` fields
- [ ] `hook` is attention-grabbing (5-15 words)
- [ ] `cta` is actionable and specific
- [ ] `tone` is one of: "professional", "casual", "urgent"

### Metadata Object
- [ ] `duration` equals sum of all scene durations
- [ ] `duration` is between 108-144 seconds ✓
- [ ] `fps` is 30

### Scenes Array
- [ ] Contains 5-7 scenes
- [ ] First scene is type `hook`
- [ ] Last scene is type `cta`
- [ ] All required fields present (id, type, startTime, duration, startFrame, durationFrames, narration, visualCues)

## 2. Content Quality ⭐ **最重要**

### ⚠️ Language Check - CRITICAL

- [ ] **ALL narrations are in ENGLISH** (not Chinese, not Japanese, not any other language)
- [ ] No mixed languages within narrations
- [ ] Uses natural, conversational English
- [ ] American English spelling and style (e.g., "color" not "colour")

### Narrations - 可执行性核心检查

**❌ 致命错误（立即修改）**：
- [ ] **NO** 使用中文旁白（ALL narrations MUST be in English）
- [ ] **NO** 旁白过短：20秒场景只有10字
- [ ] **NO** 不完整："为什么？三个原因。"（没展开）
- [ ] **NO** 太抽象："安装很快"（应该"1-3天"）
- [ ] **NO** 书面语："Photovoltaic systems demonstrate..."
- [ ] **NO** 无数据："效果好"（应该"省$11,000"）

**✅ 必须通过**：
- [ ] **可直接照读**：每个旁白拿起来就能读，无需解读
- [ ] **长度充足**：
  - Hook ≥ 18 words
  - TextDisplay ≥ 50 words
  - NumberComparison ≥ 40 words
  - ThreeColumns ≥ 50 words
  - CaseStudy ≥ 70 words
  - CTA ≥ 30 words
- [ ] **信息完整**：每个场景有开头、过程、结论
- [ ] **具体数据**：
  - 不是"很快" → 是"1-3天"
  - 不是"很便宜" → 是"比传统便宜70%"
  - 不是"效果好" → 是"Johnson家省了$11,000"
- [ ] **信息密度**：每10秒 ≥ 1个核心信息点
- [ ] **口语化**：短句、常用词、主动语态
- [ ] **流畅转场**：用问题/连接词引入下一场景

### Visual Cues
- [ ] All scenes have `keywords` (2-5 specific words)
- [ ] `numberComparison` scenes have `numbers` array
- [ ] Numbers have label + newValue

## 3. Timing Validation

- [ ] All durations rounded to 0.5s increments
- [ ] Word counts match durations (≈ words / 1.25)
- [ ] Total duration: 108-144 seconds
- [ ] Hook: 6-8s, CTA: 8-12s
- [ ] All frames are multiples of 15
- [ ] No gaps between scenes

## 4. Scene Type Compliance

### Hook Scene
- [ ] Duration 6-8s
- [ ] 反常识开场（provocative question/statement）
- [ ] **Narration ≥ 18 words**

### TextDisplay Scenes
- [ ] Duration 15-20s
- [ ] One clear idea with support
- [ ] **Narration ≥ 50 words**

### NumberComparison Scenes
- [ ] Duration 12-18s
- [ ] Has `numbers` array
- [ ] Explains numbers' meaning
- [ ] **Narration ≥ 40 words**

### ThreeColumns Scenes
- [ ] Duration 15-20s
- [ ] Lists 3 things with details
- [ ] **Narration ≥ 50 words**

### CaseStudy Scenes
- [ ] Duration 20-30s
- [ ] Complete story: background + process + result
- [ ] Specific details (names, dates, numbers)
- [ ] **Narration ≥ 70 words**

### CTA Scene
- [ ] Duration 8-12s
- [ ] Clear action verb + contact info
- [ ] **Narration ≥ 30 words**
- [ ] Contact info repeated/emphasized

## 5. 可执行性终极检查 ⭐

### 三问检查

1. **制作者能直接照着做吗？**
   - [ ] 旁白可直接照读
   - [ ] 画面描述清晰
   - [ ] 时长分配明确

2. **观众能记住什么？**
   - [ ] Hook 抓住注意力（6秒内）
   - [ ] 每10秒传递1个信息点
   - [ ] 有明确数据和案例
   - [ ] CTA 清晰

3. **去掉特效，内容够硬吗？**
   - [ ] 旁白内容硬（不依赖炫技）
   - [ ] 信息密度高
   - [ ] 每个场景都在传递价值

### 信息密度检查
- [ ] **总信息点** ≥ (总时长 ÷ 10)
  - 120秒视频 → ≥12个信息点
- [ ] **数据点** ≥ 3个（数字、百分比、时间）
- [ ] **案例** ≥ 1个（具体故事）
- [ ] **对比** ≥ 1个（前后、新旧）

## Common Fixes

### Issue: Narrations too short ⭐ 最常见
```
❌ 20秒场景，10字旁白
✅ 修正：加数据、例子、过程描述
   "专业团队1-3天完成。测量、安装、接线、验收。
   Johnson家周五开始，周日就用上了。"（50字）
```

### Issue: Duration out of range
- < 108s → 扩展旁白，加细节
- > 144s → 删除填充词，合并场景

### Issue: No concrete data
```
❌ "效果很好"
✅ "Johnson家5年省了$11,000，卖房多赚$20,000"
```

## Sign-Off

确认以下全部通过：
- ✅ 旁白完整（可直接照读，信息充实）
- ✅ 信息密度高（每10秒≥1个点）
- ✅ 数据具体（有数字、例子、对比）
- ✅ 时长准确（108-144秒）
- ✅ 可执行性强（拿到就能做）

**If all pass**: ✓ script.json ready for production

---

**记住**：好的脚本 = 可执行的制作手册，不是炫技的概念设计。
