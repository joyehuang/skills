import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "examples");

function shell(title, brand, tagline, activeNav, main) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<link rel="stylesheet" href="shared.css" />
</head>
<body>
<header class="site-header">
  <div class="page-frame site-header-inner">
    <a class="brand" href="#"><span class="filo-avatar" aria-hidden="true"></span><span>
      <div class="brand-name font-heading">${brand}</div>
      <div class="brand-tagline">${tagline}</div>
    </span></a>
    <nav class="nav-desktop" aria-label="主导航">
      <a href="#" ${activeNav === "home" ? 'class="is-active"' : ""}>首页</a>
      <a href="#" ${activeNav === "settings" ? 'class="is-active"' : ""}>设置</a>
      <a href="#">帮助</a>
    </nav>
    <div style="display:flex;align-items:center;gap:.5rem;margin-left:auto">
      <span class="header-search" role="search">搜索…<kbd>⌘K</kbd></span>
      <a class="btn btn-primary" href="#">登录</a>
      <button type="button" class="nav-mobile-toggle hit-area" aria-label="菜单">≡</button>
    </div>
  </div>
</header>
<main id="main" class="page-frame">${main}</main>
<footer class="site-footer"><p style="margin:0">示例页 · 非真实产品 · 无 PII</p></footer>
</body>
</html>`;
}

const r1Base = (variant) => {
  const layouts = {
    opus: `<div class="page-intro"><div class="eyebrow font-heading">Preferences</div><h1 class="font-heading">会议室预约偏好</h1><p style="color:var(--muted-foreground);max-width:36rem;margin:0">设置默认时长、常用楼层与提醒方式。保存后对 DeskFlow 全部成员生效。</p></div>
<div style="display:grid;gap:1rem;max-width:720px">
<div class="card" style="padding:1.5rem"><h2 class="font-heading" style="font-size:1.1rem;margin:0 0 1rem">默认时长</h2>
<div class="filter-row"><button type="button" class="filter-chip is-on">30 分钟</button><button type="button" class="filter-chip">45 分钟</button><button type="button" class="filter-chip">60 分钟</button></div></div>
<div class="card" style="padding:1.5rem"><h2 class="font-heading" style="font-size:1.1rem;margin:0 0 1rem">房间筛选</h2>
<label class="label">优先楼层</label><select class="input" style="max-width:280px"><option>3F · 开放区</option><option>5F · 静音</option></select>
<div class="filter-row" style="margin-top:1rem"><button type="button" class="filter-chip is-on">需要显示器</button><button type="button" class="filter-chip">需要白板</button></div></div>
<div class="card" style="padding:1.5rem"><h2 class="font-heading" style="font-size:1.1rem;margin:0 0 1rem">通知</h2>
<p class="field-hint">会议开始前 10 分钟发送提醒。</p>
<label style="display:flex;align-items:center;gap:.75rem;margin-top:.75rem"><input type="checkbox" checked /> 邮件摘要（示例域）</label></div>
<div style="display:flex;gap:.75rem;flex-wrap:wrap"><button type="button" class="btn btn-primary">保存偏好</button><button type="button" class="btn btn-outline">恢复默认</button></div></div>`,
    codex: `<div class="hero-split" style="margin-top:1rem"><div><div class="eyebrow font-heading">DeskFlow</div><h1 class="font-heading" style="font-size:2rem;margin:0 0 .75rem">预约偏好</h1><p style="color:var(--muted-foreground)">把常用选项写在这里，下次订会议室少点三次。</p></div>
<div class="card entry-card"><p class="entry-meta"><span class="type-chip chip-method">工作区</span></p><h3 class="font-heading">当前默认 · 45 分钟</h3><p class="preview">5F 静音室 · 白板 + 视频会议</p></div></div>
<div class="entry-grid" style="margin-top:1.25rem"><article class="card entry-card"><h3 class="font-heading">时长</h3><div class="filter-row"><span class="filter-chip is-on">45m</span><span class="filter-chip">60m</span></div></article>
<article class="card entry-card"><h3 class="font-heading">提醒</h3><p class="preview">提前 10 分钟 · 站内通知</p></article>
<article class="card entry-card"><h3 class="font-heading">冲突策略</h3><p class="preview">自动建议相邻空闲时段</p></article></div>
<button type="button" class="btn btn-primary" style="margin-top:1.25rem">保存</button>`,
    composer: `<div class="page-intro"><h1 class="font-heading">DeskFlow · 会议室预约偏好</h1></div>
<div style="display:grid;gap:1rem;max-width:800px"><section class="card" style="padding:1.5rem"><h2 class="font-heading" style="font-size:1.05rem">默认时长</h2><div class="filter-row"><button class="filter-chip is-on">30 分</button><button class="filter-chip">45 分</button><button class="filter-chip">60 分</button></div></section>
<section class="card" style="padding:1.5rem"><h2 class="font-heading" style="font-size:1.05rem">房间条件</h2><div class="filter-row"><button class="filter-chip is-on">显示器</button><button class="filter-chip">白板</button><button class="filter-chip">8 人+</button></div></section>
<section class="card" style="padding:1.5rem"><h2 class="font-heading" style="font-size:1.05rem">通知</h2><label><input type="checkbox" checked /> 开始前 10 分钟提醒</label></section>
<div><button class="btn btn-primary">保存</button> <button class="btn btn-outline">重置</button></div></div>`,
    gemini: `<div class="promo-banner"><p>偏好设置仅影响你的预约表单默认值，不会改动他人日历。</p></div>
<div class="page-intro"><h1 class="font-heading">预约偏好</h1></div>
<div class="card" style="padding:1.75rem;max-width:640px"><div class="field" style="margin-bottom:1.25rem"><label class="label">默认会议时长</label><select class="input"><option>30 分钟</option><option selected>45 分钟</option></select></div>
<div class="field" style="margin-bottom:1.25rem"><label class="label">楼层偏好</label><input class="input" value="3F 开放协作区" /></div>
<div class="field"><label class="label">提醒</label><p class="field-hint">勾选后将写入你的通知队列。</p><label style="display:flex;gap:.5rem;margin-top:.5rem"><input type="checkbox" checked /> 站内提醒</label></div>
<p class="field-error" style="display:none">示例：请选择至少一项房间能力。</p>
<button type="button" class="btn btn-primary" style="margin-top:1.25rem">保存偏好</button></div>`,
    grok: `<div class="page-intro"><div class="eyebrow font-heading">Settings</div><h1 class="font-heading">会议室预约 · 偏好</h1></div>
<div style="max-width:680px;display:grid;gap:1rem"><div class="card" style="padding:1.25rem 1.5rem"><strong class="font-heading">时长</strong><div class="filter-row" style="margin-top:.75rem"><button class="filter-chip is-on">30</button><button class="filter-chip">45</button><button class="filter-chip">60</button></div></div>
<div class="card" style="padding:1.25rem 1.5rem"><strong class="font-heading">筛选</strong><div class="filter-row" style="margin-top:.75rem"><button class="filter-chip is-on">白板</button><button class="filter-chip">视频</button></div></div>
<div class="card" style="padding:1.25rem 1.5rem"><strong class="font-heading">通知开关</strong><p class="field-hint" style="margin-top:.5rem">会议前 10 分钟</p><input type="checkbox" checked style="margin-top:.5rem" /></div>
<button class="btn btn-primary">保存</button></div>`,
  };
  return layouts[variant];
};

const files = [
  ["r1-opus.html", "偏好 · DeskFlow", "DeskFlow", "办公空间预约", "settings", r1Base("opus")],
  ["r1-codex.html", "偏好 · DeskFlow", "DeskFlow", "办公空间预约", "settings", r1Base("codex")],
  ["r1-composer.html", "偏好 · DeskFlow", "DeskFlow", "办公空间预约", "settings", r1Base("composer")],
  ["r1-gemini.html", "偏好 · DeskFlow", "DeskFlow", "办公空间预约", "settings", r1Base("gemini")],
  ["r1-grok.html", "偏好 · DeskFlow", "DeskFlow", "办公空间预约", "settings", r1Base("grok")],
  ["r2-form.html", "报名 · 市民夜校", "市民夜校", "公益课程报名", "home", `<div class="page-intro"><h1 class="font-heading">春季工作坊报名</h1><p style="color:var(--muted-foreground)">填写信息后 3 个工作日内邮件确认（示例流程）。</p></div>
<form class="card" style="padding:1.5rem;max-width:520px"><label class="label">姓名</label><input class="input" value="示例姓名" />
<label class="label" style="margin-top:1rem">课程</label><select class="input"><option>版画入门</option></select>
<label class="label" style="margin-top:1rem">手机号</label><input class="input" aria-invalid="true" /><p class="field-error">请填写 11 位示例号码，勿用真实号码。</p>
<button type="button" class="btn btn-primary" style="margin-top:1.25rem">提交</button></form>
<div class="toast-stack"><div class="toast toast-destructive"><div class="toast-title">提交未成功</div><div class="toast-muted">请修正高亮字段后重试。</div></div></div>`],
  ["r2-landing.html", "落地 · 城市单车", "城行单车", "短时租赁", "home", `<div class="hero-split" style="margin-top:1.5rem"><div class="hero-copy"><div class="eyebrow font-heading">Mobility</div><h1 class="font-heading">短途出行，随取随还</h1><p>站点覆盖主城区，按分钟计费，支持行程摘要导出。</p><a class="btn btn-primary" href="#">查看站点地图</a></div>
<div class="card entry-card"><h3 class="font-heading">新用户指南</h3><p class="preview">下载应用 → 实名认证 → 扫码开锁。全程约 3 分钟。</p></div></div>
<div class="section-head"><h2 class="font-heading">为什么选择我们</h2></div>
<div class="entry-grid"><article class="card entry-card"><h3 class="font-heading">透明计费</h3><p class="preview">无隐藏调度费，结束行程即生成账单。</p></article>
<article class="card entry-card"><h3 class="font-heading">车况上报</h3><p class="preview">刹车或轮胎问题一键报修，24h 内处理。</p></article>
<article class="card entry-card"><h3 class="font-heading">行程安全</h3><p class="preview">夜间骑行建议开启反光模式提醒。</p></article></div>
<div class="card" style="padding:1.25rem;margin-top:2rem"><h3 class="font-heading" style="margin:0 0 .75rem">常见问题</h3>
<details open><summary style="cursor:pointer;font-weight:600">如何结束行程？</summary><p style="color:var(--muted-foreground)">在指定停车区手动锁车并点击 App 内「还车」。</p></details>
<details><summary style="cursor:pointer;font-weight:600">可以跨区还车吗？</summary><p style="color:var(--muted-foreground)">部分区域需额外调度费，地图上会标注。</p></details></div>`],
  ["r2-dashboard.html", "仪表盘 · 仓配中心", "仓配中心", "库存与出库", "home", `<div class="shell-layout" style="min-height:auto;margin-top:0"><aside class="shell-sidebar"><a class="is-active" href="#">概览</a><a href="#">出库</a><a href="#">补货</a></aside>
<div class="shell-main"><div class="page-intro" style="padding-top:0"><h1 class="font-heading">今日运营</h1></div>
<div class="stat-grid"><div class="card stat-card"><div class="stat-label">待拣单</div><div class="stat-value">128</div></div><div class="card stat-card"><div class="stat-label">准时率</div><div class="stat-value">94%</div></div><div class="card stat-card"><div class="stat-label">异常件</div><div class="stat-value">6</div></div><div class="card stat-card"><div class="stat-label">在途车辆</div><div class="stat-value">42</div></div></div>
<div class="data-table-wrap" style="margin-top:1.25rem"><table class="data-table"><thead><tr><th>SKU</th><th>库位</th><th>余量</th><th>状态</th></tr></thead><tbody>
<tr><td class="font-mono">BX-204</td><td>A-12</td><td>340</td><td><span class="type-chip chip-method">正常</span></td></tr>
<tr><td class="font-mono">BX-881</td><td>C-03</td><td>12</td><td><span class="type-chip chip-pick">低库存</span></td></tr></tbody></table></div>
<div style="margin-top:1.25rem"><div class="chart-bar-row"><span>拣货</span><div class="chart-bar"><span style="width:72%"></span></div><span class="font-mono">72%</span></div>
<div class="chart-bar-row"><span>复核</span><div class="chart-bar"><span class="coral" style="width:58%"></span></div><span class="font-mono">58%</span></div></div></div></div>`],
  ["r2-list.html", "列表 · 独立杂志", "纸间杂志", "选题与连载", "home", `<div class="page-intro"><h1 class="font-heading">文章目录</h1><p style="color:var(--muted-foreground)">按主题浏览已发布长文与连载。</p></div>
<div class="list-toolbar"><input class="input" style="max-width:320px;border-radius:9999px" placeholder="搜索标题…" /><div class="filter-row"><button class="filter-chip is-on">全部</button><button class="filter-chip">连载</button><button class="filter-chip">随笔</button></div></div>
<div class="week-divider">2026 年 10 月</div>
<div class="entry-grid"><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-read">随笔</span><span class="font-mono">10-18</span></div><h3 class="font-heading">夜班编辑部的灯光</h3><p class="preview">排版室在凌晨两点仍然亮着，<span class="mark">暖色台灯</span>是唯一的参考。</p></article>
<article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-concept">连载</span><span class="font-mono">10-12</span></div><h3 class="font-heading">专栏 · 第 4 期</h3><p class="preview">本期讨论独立发行的成本结构。</p></article>
<article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-read">随笔</span><span class="font-mono">10-08</span></div><h3 class="font-heading">读者来信选</h3><p class="preview">摘录三封关于纸质触感的回信。</p></article></div>
<nav style="display:flex;justify-content:space-between;margin-top:2rem;font-size:14px"><span style="color:var(--muted-foreground)">共 48 篇</span><span><button class="btn btn-outline" style="min-height:36px">上一页</button> <button class="btn btn-outline" style="min-height:36px">下一页</button></span></nav>`],
  ["r2-states.html", "状态 · 云备份", "云备份助手", "同步服务", "home", `<div class="page-intro"><h1 class="font-heading">异常与空状态</h1></div>
<div style="display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
<section class="card state-view"><div class="filo-mascot-lg think" aria-hidden="true"></div><h2 class="font-heading">正在同步</h2><p>通常不超过一分钟，你可以先浏览本地副本。</p></section>
<section class="card state-view"><div class="filo-mascot-lg" aria-hidden="true"></div><h2 class="font-heading">没有匹配文件</h2><p>换个关键词，或查看全部备份集。</p><button class="btn btn-outline">查看全部</button></section>
<section class="card state-view"><div class="filo-mascot-lg" aria-hidden="true"></div><h2 class="font-heading">页面不存在</h2><p>链接可能已过期，返回首页继续浏览。</p><a class="btn btn-primary" href="#">回首页</a></section>
<section class="card state-view"><div class="filo-mascot-lg" aria-hidden="true"></div><h2 class="font-heading">连接暂时不可用</h2><p>服务正在恢复，请稍后重试。</p><button class="btn btn-primary">重试</button></section></div>`],
];

const r3 = [
  ["r3-vet.html", "宠物医院 · 萌爪门诊", "萌爪门诊", "预约与复诊提醒", `<div class="page-intro"><h1 class="font-heading">今日预约</h1><p style="color:var(--muted-foreground)">查看疫苗与复诊时段，勿填写真实宠物主信息。</p></div><div class="entry-grid"><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-career">疫苗</span><span class="font-mono">09:30</span></div><h3 class="font-heading">幼犬首免 · 示例</h3><p class="preview">携带 previous 免疫本，空腹无需。</p></article><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-method">复诊</span><span class="font-mono">11:00</span></div><h3 class="font-heading">皮肤复查</h3><p class="preview">上次处方续用需医生确认。</p></article><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-concept">宣教</span></div><h3 class="font-heading">冬季保暖要点</h3><p class="preview">短毛品种注意室内湿度。</p></article></div>`],
  ["r3-bookstore.html", "书店 · 半日闲", "半日闲书店", "选书与活动", `<div class="hero-split"><div><h1 class="font-heading">本周新到</h1><p style="color:var(--muted-foreground)">独立出版与翻译文学为主。</p></div><div class="card entry-card"><h3 class="font-heading">作者分享 · 周六</h3><p class="preview">线下 30 席，报名后短信提醒（示例）。</p></div></div><div class="entry-grid" style="margin-top:1.5rem"><article class="card entry-card"><span class="type-chip chip-read">小说</span><h3 class="font-heading">《港口笔记》</h3><p class="preview">港口工人视角的连载长篇。</p></article><article class="card entry-card"><span class="type-chip chip-concept">非虚构</span><h3 class="font-heading">《慢邮地图》</h3><p class="preview">步行测量城市尺度的随笔集。</p></article><article class="card entry-card"><span class="type-chip chip-pick">推荐</span><h3 class="font-heading">童书角上新</h3><p class="preview">绘本按主题分区陈列。</p></article></div>`],
  ["r3-weather.html", "天气 · 近场预报", "近场天气", "小时级预报", `<div class="page-intro"><h1 class="font-heading">城区预报</h1></div><div class="stat-grid"><div class="card stat-card"><div class="stat-label">现在</div><div class="stat-value">18°</div><div class="stat-delta">多云</div></div><div class="card stat-card"><div class="stat-label">14:00</div><div class="stat-value">20°</div></div><div class="card stat-card"><div class="stat-label">降水</div><div class="stat-value">10%</div></div><div class="card stat-card"><div class="stat-label">风力</div><div class="stat-value">2 级</div></div></div><div class="card" style="padding:1.5rem;margin-top:1.25rem"><h2 class="font-heading" style="font-size:1.1rem">24 小时趋势</h2><div class="chart-bar-row"><span>08</span><div class="chart-bar"><span style="width:40%"></span></div></div><div class="chart-bar-row"><span>12</span><div class="chart-bar"><span style="width:65%"></span></div></div><div class="chart-bar-row"><span>18</span><div class="chart-bar"><span style="width:30%"></span></div></div></div>`],
  ["r3-billing.html", "账单 · 城商银行", "城商银行", "个人账单摘要", `<div class="page-intro"><h1 class="font-heading">10 月账单摘要</h1><p style="color:var(--muted-foreground)">示例数据，非真实账户。</p></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>日期</th><th>摘要</th><th>金额</th></tr></thead><tbody><tr><td class="font-mono">10-02</td><td>自动转存</td><td class="font-mono">+2,000.00</td></tr><tr><td class="font-mono">10-05</td><td>生活缴费</td><td class="font-mono">-186.50</td></tr><tr><td class="font-mono">10-12</td><td>信用卡还款</td><td class="font-mono">-3,420.00</td></tr></tbody></table></div><div class="card" style="padding:1.25rem;margin-top:1rem"><p style="margin:0">本期应还 <strong class="font-mono">4,280.00</strong> · 还款日 10-28</p><button class="btn btn-primary" style="margin-top:1rem">预约还款</button></div>`],
  ["r3-education.html", "教育 · 小芽成长", "小芽成长", "儿童课程表", `<div class="promo-banner"><p>秋季试听开放中，预约后教室门口签到即可。</p><a class="btn btn-outline" href="#">试听说明</a></div><div class="page-intro"><h1 class="font-heading">课程表 · 示例班</h1></div><div class="topic-grid"><article class="card topic-card"><h3 class="font-heading">创意美术</h3><p class="topic-stats">周三 16:00 · 剩余 3 席</p></article><article class="card topic-card"><h3 class="font-heading">少儿编程</h3><p class="topic-stats">周六 10:00 · 剩余 1 席</p></article><article class="card topic-card"><h3 class="font-heading">体能游戏</h3><p class="topic-stats">周五 17:30 · 满员</p></article></div>`],
  ["r3-plants.html", "植物 · 阳台管家", "阳台管家", "浇水与光照", `<div class="page-intro"><h1 class="font-heading">我的植物</h1></div><div class="entry-grid"><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-career">多肉</span><span class="font-mono">上次 3 天前</span></div><h3 class="font-heading">玉露 · 示例</h3><p class="preview">南向窗台，下次浇水建议 10-24。</p></article><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-method">观叶</span></div><h3 class="font-heading">龟背竹</h3><p class="preview">叶片边缘发褐，检查是否直晒。</p></article><article class="card entry-card"><div class="entry-meta"><span class="type-chip chip-concept">提醒</span></div><h3 class="font-heading">今日待办</h3><p class="preview">2 盆需喷雾，1 盆需转盆。</p></article></div>`],
  ["r3-rental.html", "租房 · 里弄住房", "里弄住房", "房源浏览", `<div class="page-intro"><h1 class="font-heading">可租房源</h1><div class="seg-control" style="margin-top:1rem"><button class="is-active">全部</button><button>整租</button><button>合租</button></div></div><div class="entry-grid"><article class="card entry-card"><h3 class="font-heading">老洋房 · 2 室</h3><p class="preview">近地铁 8 分钟 · 示例月租 8,500</p></article><article class="card entry-card"><h3 class="font-heading">电梯公寓 · 1 室</h3><p class="preview">带阳台 · 示例月租 6,200</p></article><article class="card entry-card"><h3 class="font-heading">合租 · 次卧</h3><p class="preview">限女生 · 示例月租 2,800</p></article></div>`],
  ["r3-volunteer.html", "志愿 · 周末行动", "周末行动", "公益招募", `<div class="hero-split"><div><h1 class="font-heading">本周末招募</h1><p style="color:var(--muted-foreground)">社区服务时长可录入志愿记录（示例）。</p></div><div class="card entry-card"><h3 class="font-heading">河道清理</h3><p class="preview">周日 08:30 集合 · 需穿防滑鞋</p></div></div><div class="entry-grid" style="margin-top:1.5rem"><article class="card entry-card"><h3 class="font-heading">图书馆整理</h3><p class="preview">周六 14:00 · 6 人</p></article><article class="card entry-card"><h3 class="font-heading">老人陪伴</h3><p class="preview">周日 10:00 · 需培训</p></article><article class="card entry-card"><h3 class="font-heading">物资分装</h3><p class="preview">周五 19:00 · 室内</p></article></div>`],
  ["r3-museum.html", "博物馆 · 城脉馆", "城脉馆", "展览与票务", `<div class="page-intro"><h1 class="font-heading">当前展览</h1></div><div class="entry-grid"><article class="card entry-card"><span class="type-chip chip-read">特展</span><h3 class="font-heading">工业记忆 1900–2000</h3><p class="preview">常设联票可进，需预约时段。</p></article><article class="card entry-card"><span class="type-chip chip-concept">互动</span><h3 class="font-heading">声音地图</h3><p class="preview">戴耳机听取老城区采样。</p></article><article class="card entry-card"><span class="type-chip chip-method">家庭</span><h3 class="font-heading">亲子导览</h3><p class="preview">周日 10:30 中文讲解。</p></article></div><section class="footer-cta" style="margin-top:2.5rem"><div><h2 class="font-heading">计划参观？</h2><p>在线购票可跳过现场排队（示例流程）。</p></div><a class="btn btn-outline" href="#">购票</a></section>`],
  ["r3-pharmacy.html", "药房 · 康邻", "康邻药房", "常购与提醒", `<div class="page-intro"><h1 class="font-heading">常购清单</h1><p style="color:var(--muted-foreground)">示例药品名，非医疗建议。</p></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>品名</th><th>规格</th><th>下次复购</th></tr></thead><tbody><tr><td>示例维生素</td><td>30 片</td><td class="font-mono">11-02</td></tr><tr><td>示例洗鼻盐</td><td>15 包</td><td class="font-mono">10-30</td></tr></tbody></table></div><div class="card state-view" style="margin-top:1.5rem;border:none;background:transparent"><div class="filo-mascot-lg" aria-hidden="true"></div><h2 class="font-heading">处方上传</h2><p>线下处方拍照后 24h 内审核（示例说明）。</p></div>`],
];

for (const [name, title, brand, tag, nav, main] of files) {
  await writeFile(path.join(dir, name), shell(title, brand, tag, nav, main));
}
for (const [name, title, brand, tag, main] of r3) {
  await writeFile(path.join(dir, name), shell(title, brand, tag, "home", main));
}

console.log("wrote", files.length + r3.length, "html files");
