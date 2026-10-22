import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "examples");

function shell({ title, brand, tagline, nav, active, main }) {
  const navHtml = nav
    .map((n) => `<a href="#" ${active === n ? 'class="is-active"' : ""}>${n}</a>`)
    .join("");
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
    <nav class="nav-desktop" aria-label="主导航">${navHtml}</nav>
    <div style="display:flex;align-items:center;gap:.5rem;margin-left:auto">
      <a class="version-pill" href="#">公告</a>
      <span class="header-search" role="search">搜索…<kbd>⌘K</kbd></span>
      <a class="btn btn-outline" href="#" style="min-height:40px">注册</a>
      <a class="btn btn-primary" href="#">登录</a>
      <button type="button" class="nav-mobile-toggle hit-area" aria-label="菜单">≡</button>
    </div>
  </div>
</header>
<main id="main" class="page-frame">${main}</main>
<footer class="site-footer page-frame">
  <div class="footer-inner">
    <p class="footer-note">${tagline} · ${brand} 官方页面。</p>
    <nav class="footer-links"><a href="#">关于</a><a href="#">隐私说明</a><a href="#">使用条款</a><a href="#">联系</a></nav>
  </div>
</footer>
</body>
</html>`;
}

const hero = (eyebrow, h1, sub, cta, visual = true) => `
<div class="promo-banner"><p>${sub.slice(0, 60)}… 本周活动与库存同步更新。</p><a class="btn btn-outline" href="#" style="min-height:40px">${cta || "了解更多"}</a></div>
<div class="hero-split">
  <div class="hero-copy"><div class="eyebrow font-heading">${eyebrow}</div><h1 class="font-heading">${h1}</h1><p>${sub}</p>
  <div class="hero-search"><input class="input" placeholder="搜索本页内容…" /><button type="button" class="btn btn-primary">搜索</button></div></div>
  ${visual ? `<div class="hero-visual card">${visual === "card" ? `<article class="entry-card" style="margin:1.25rem;border:none;box-shadow:none"><span class="type-chip chip-pick">精选</span><h3 class="font-heading">本周主打</h3><p class="preview">详情见下方目录与活动表。</p></article>` : `<div class="filo-mascot-xl" aria-hidden="true"></div>`}</div>` : ""}
</div>`;

const stats = (rows) =>
  `<div class="stat-grid" style="margin-top:2rem">${rows
    .map(
      ([l, v, d]) =>
        `<div class="card stat-card"><div class="stat-label">${l}</div><div class="stat-value">${v}</div>${d ? `<div class="stat-delta">${d}</div>` : ""}</div>`,
    )
    .join("")}</div>`;

const section = (title, link, body) =>
  `<div class="section-head"><h2 class="font-heading">${title}</h2>${link ? `<a href="#">${link}</a>` : ""}</div>${body}`;

const cards = (items) =>
  `<div class="entry-grid-6">${items
    .map(
      ([chip, chipClass, t, p]) =>
        `<article class="card entry-card"><div class="entry-meta"><span class="type-chip ${chipClass}">${chip}</span><span class="font-mono">10-18</span></div><h3 class="font-heading">${t}</h3><p class="preview">${p}</p></article>`,
    )
    .join("")}</div>`;

const table = (heads, rows) =>
  `<div class="data-table-wrap"><table class="data-table"><thead><tr>${heads.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => `<td${i === 0 ? ' class="font-mono"' : ""}>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;

const tableRows = (all) => table(all[0], all.slice(1));

const quotes = (items) =>
  `<div class="testimonial-grid">${items
    .map(
      ([q, a]) =>
        `<blockquote class="card quote-card"><p>「${q}」</p><footer>— ${a}</footer></blockquote>`,
    )
    .join("")}</div>`;

const faq = (items) =>
  `<div class="faq-list">${items.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</div>`;

const steps = (items) =>
  `<div class="step-grid">${items
    .map(
      ([n, t, p], i) =>
        `<article class="card step-card"><div class="step-num">${String(i + 1).padStart(2, "0")}</div><h3 class="font-heading">${t}</h3><p>${p}</p></article>`,
    )
    .join("")}</div>`;

const cta = (h, p, btn) =>
  `<section class="footer-cta"><div><h2 class="font-heading">${h}</h2><p>${p}</p></div><a class="btn btn-outline" href="#">${btn}</a></section>`;

const chart = (rows) =>
  `<div class="card" style="padding:1.25rem;margin-top:1rem">${rows
    .map(([l, w]) => `<div class="chart-bar-row"><span>${l}</span><div class="chart-bar"><span style="width:${w}"></span></div></div>`)
    .join("")}</div>`;

function deskFlow(variant) {
  const extra =
    variant === "codex"
      ? `<div class="two-col" style="margin-top:2rem">${cards([
          ["策略", "chip-method", "冲突自动改期", "相邻空档优先推荐。"],
          ["提醒", "chip-read", "会前 10 分钟", "站内 + 日历同步。"],
          ["权限", "chip-concept", "团队共享", "管理员可锁定楼层。"],
          ["报表", "chip-career", "利用率周报", "周一发送摘要。"],
        ]).replace("entry-grid-6", "entry-grid")}</div>`
      : section(
          "常用会议室",
          "查看全部",
          table(
            ["房间", "容量", "设备", "本周占用"],
            [
              ["A-301", "8", "白板/屏", "62%"],
              ["B-静音-02", "6", "隔音", "81%"],
              ["C-开放-11", "12", "投影", "44%"],
              ["D-电话亭", "2", "耳机", "29%"],
            ],
          ),
        );
  return (
    hero(
      "DeskFlow",
      "会议室预约偏好",
      "为团队设置默认时长、楼层与设备筛选；保存后新建预约会自动带入，减少重复点击。",
      "查看使用指南",
    ) +
    stats([
      ["本周预约", "128", "+12%"],
      ["平均时长", "47m", ""],
      ["冲突改期", "9", "自动处理"],
      ["满意度", "4.8", "内部调研"],
    ]) +
    section(
      "偏好设置",
      "",
      `<div class="two-col"><div class="card" style="padding:1.5rem"><h3 class="font-heading">默认时长</h3><div class="filter-row"><button class="filter-chip is-on">30 分</button><button class="filter-chip">45 分</button><button class="filter-chip">60 分</button></div><p class="field-hint" style="margin-top:.75rem">可覆盖单次预约，不影响历史记录。</p></div>
<div class="card" style="padding:1.5rem"><h3 class="font-heading">设备筛选</h3><div class="filter-row"><button class="filter-chip is-on">显示器</button><button class="filter-chip is-on">白板</button><button class="filter-chip">八人+</button></div></div></div>
<div class="card" style="padding:1.5rem;margin-top:1rem"><h3 class="font-heading">通知</h3><label style="display:flex;gap:.5rem;margin-top:.5rem"><input type="checkbox" checked /> 开始前 10 分钟提醒</label><label style="display:flex;gap:.5rem;margin-top:.5rem"><input type="checkbox" /> 结束后续订提示</label><div style="margin-top:1rem"><button class="btn btn-primary">保存偏好</button> <button class="btn btn-outline">恢复默认</button></div></div>`,
    ) +
    extra +
    section(
      "常见问题",
      "",
      faq([
        ["偏好何时生效？", "保存后下一次创建预约立即生效，进行中的会议不受影响。"],
        ["能否按部门区分？", "企业版支持管理员下发模板，标准版仅个人偏好。"],
        ["冲突如何处理？", "系统优先推荐相邻空档，并保留原邀请对象。"],
        ["能否导出报表？", "利用率与时长分布可在仪表盘导出 CSV。"],
      ]),
    ) +
    cta("需要团队统一模板？", "联系管理员开通部门级默认偏好与审批流。", "预约演示")
  );
}

const pages = {
  "r1-opus.html": () =>
    shell({
      title: "偏好 · DeskFlow",
      brand: "DeskFlow",
      tagline: "办公空间预约",
      nav: ["首页", "预约", "偏好", "帮助"],
      active: "偏好",
      main: deskFlow("opus"),
    }),
  "r1-codex.html": () =>
    shell({
      title: "偏好 · DeskFlow",
      brand: "DeskFlow",
      tagline: "办公空间预约",
      nav: ["首页", "预约", "偏好", "帮助"],
      active: "偏好",
      main: deskFlow("codex"),
    }),
  "r1-composer.html": () =>
    shell({
      title: "偏好 · DeskFlow",
      brand: "DeskFlow",
      tagline: "办公空间预约",
      nav: ["首页", "预约", "偏好", "帮助"],
      active: "偏好",
      main: deskFlow("opus"),
    }),
  "r1-gemini.html": () =>
    shell({
      title: "偏好 · DeskFlow",
      brand: "DeskFlow",
      tagline: "办公空间预约",
      nav: ["首页", "预约", "偏好", "帮助"],
      active: "偏好",
      main: deskFlow("codex"),
    }),
  "r1-grok.html": () =>
    shell({
      title: "偏好 · DeskFlow",
      brand: "DeskFlow",
      tagline: "办公空间预约",
      nav: ["首页", "预约", "偏好", "帮助"],
      active: "偏好",
      main: deskFlow("opus"),
    }),

  "r2-form.html": () =>
    shell({
      title: "报名 · 市民夜校",
      brand: "市民夜校",
      tagline: "公益课程与工作坊",
      nav: ["首页", "课程", "报名", "关于"],
      active: "报名",
      main:
        hero(
          "2026 春季",
          "工作坊在线报名",
          "选择课程、填写联系方式并确认时段；提交后可在「我的报名」查看审核进度。",
          "下载报名须知",
        ) +
        stats([
          ["开放课程", "24", "3 门新课"],
          ["剩余名额", "186", ""],
          ["平均审核", "2 天", ""],
          ["完成率", "92%", "上期"],
        ]) +
        section(
          "填写报名表",
          "",
          `<div class="two-col"><form class="card" style="padding:1.5rem"><label class="label">姓名</label><input class="input" value="王晓晨" />
<label class="label" style="margin-top:1rem">课程</label><select class="input"><option>版画入门 · 周六班</option></select>
<label class="label" style="margin-top:1rem">联系手机</label><input class="input" aria-invalid="true" value="13800001234" /><p class="field-error">号码格式有误，请检查后再提交。</p>
<label class="label" style="margin-top:1rem">备注</label><textarea class="input" rows="3">希望了解是否需要自备材料。</textarea>
<button type="button" class="btn btn-primary" style="margin-top:1.25rem">提交报名</button></form>
<div><div class="toast-stack" style="position:static;max-width:none"><div class="toast toast-destructive"><div class="toast-title">提交未成功</div><div class="toast-muted">请先修正标红字段。</div></div></div>
${steps([
            ["材料", "课程材料", "开课前三天发送清单。"],
            ["审核", "名额确认", "超额时按时间顺序排队。"],
            ["签到", "现场核验", "携带报名编号即可。"],
            ["证书", "结业", "全勤可领取电子证书。"],
          ])}</div></div>`,
        ) +
        section(
          "学员反馈",
          "",
          quotes([
            ["版画班的材料包很齐全，老师节奏清晰。", "2025 秋 · 学员 L"],
            ["报名流程比想象短，审核状态也会推送。", "2025 冬 · 学员 M"],
          ]),
        ) +
        cta("想开设新课程？", "机构合作与场地共建开放申请中。", "提交合作意向"),
    }),

  "r2-landing.html": () =>
    shell({
      title: "城行单车",
      brand: "城行单车",
      tagline: "城市短时租赁",
      nav: ["首页", "站点", "资费", "帮助"],
      active: "首页",
      main:
        hero(
          "Urban Ride",
          "短途出行，随取随还",
          "覆盖主城区 320+ 站点，按分钟计费，支持行程摘要与发票申请。",
          "查看站点地图",
        ) +
        stats([
          ["在线车辆", "4,280", ""],
          ["今日行程", "18,902", "+8%"],
          ["平均时长", "14m", ""],
          ["用户评分", "4.7", "近 30 天"],
        ]) +
        section(
          "为什么选择城行",
          "",
          cards([
            ["透明", "chip-method", "计费清晰", "结束行程即生成明细，无隐藏调度费。"],
            ["安全", "chip-career", "车况上报", "刹车与轮胎问题 24h 内响应。"],
            ["绿色", "chip-concept", "碳排统计", "个人中心可查看累计减排。"],
            ["企业", "chip-read", "团队账户", "统一开票与行程审计。"],
            ["夜间", "chip-pick", "反光模式", "App 内提醒与灯光检查清单。"],
            ["客服", "chip-company", "7×12 在线", "高峰时段优先接入。"],
          ]),
        ) +
        section("近 7 日骑行趋势", "", chart([["周一", "55%"], ["周三", "68%"], ["周五", "82%"], ["周日", "61%"]])) +
        section(
          "常见问题",
          "",
          faq([
            ["如何结束行程？", "在指定停车区锁车并在 App 内点击「还车」。"],
            ["跨区还车收费吗？", "部分区域会标注调度费，还车前地图可见。"],
            ["丢失物品怎么办？", "提交工单后客服会联系最近运维人员协助。"],
          ]),
        ) +
        cta("新用户首单立减", "注册后 7 天内首 30 分钟享受减免。", "立即注册"),
    }),

  "r2-dashboard.html": () =>
    shell({
      title: "仓配中心 · 运营仪表盘",
      brand: "仓配中心",
      tagline: "库存与出库",
      nav: ["概览", "出库", "补货", "报表"],
      active: "概览",
      main: `<div class="shell-layout" style="min-height:auto;margin:0 -1.25rem"><aside class="shell-sidebar"><a class="is-active" href="#">概览</a><a href="#">出库</a><a href="#">补货</a><a href="#">异常</a><a href="#">设置</a></aside><div class="shell-main">
<div class="page-intro" style="padding-top:0"><h1 class="font-heading">今日运营概览</h1><p style="color:var(--muted-foreground)">拣货、复核与在途车辆实时汇总。</p></div>
${stats([
        ["待拣单", "128", "+6"],
        ["准时率", "94%", ""],
        ["异常件", "6", "需跟进"],
        ["在途车辆", "42", ""],
      ])}
${section(
        "SKU 监控",
        "导出",
        table(
          ["SKU", "库位", "余量", "状态"],
          [
            ["BX-204", "A-12", "340", "正常"],
            ["BX-881", "C-03", "12", "低库存"],
            ["PK-119", "B-07", "0", "待补货"],
            ["PK-442", "D-01", "88", "正常"],
          ],
        ),
      )}
${section("环节完成度", "", chart([["拣货", "72%"], ["复核", "58%"], ["装车", "81%"], ["签收", "67%"]]))}
${section(
        "值班备注",
        "",
        quotes([
          ["B 区电梯检修，大宗货物改走南通道。", "值班长 · 08:30"],
          ["低库存 SKU 已触发补货单 #8821。", "系统 · 09:12"],
        ]),
      )}
</div></div>`,
    }),

  "r2-list.html": () =>
    shell({
      title: "纸间杂志 · 目录",
      brand: "纸间杂志",
      tagline: "独立出版与连载",
      nav: ["首页", "目录", "专题", "订阅"],
      active: "目录",
      main:
        hero(
          "Archive",
          "文章目录与连载索引",
          "按主题、作者与日期浏览长文；支持收藏与稍后读同步。",
          "订阅周刊",
          "card",
        ) +
        `<div class="list-toolbar"><input class="input" style="max-width:320px;border-radius:9999px" placeholder="搜索标题或作者…" /><div class="filter-row"><button class="filter-chip is-on">全部</button><button class="filter-chip">连载</button><button class="filter-chip">随笔</button><button class="filter-chip">访谈</button></div></div>` +
        stats([
          ["已发布", "248", ""],
          ["连载中", "12", ""],
          ["本周更新", "7", ""],
          ["订阅者", "3.2k", ""],
        ]) +
        `<div class="week-divider">2026 年 10 月</div>` +
        cards([
          ["随笔", "chip-read", "夜班编辑部的灯光", "排版室在凌晨两点仍然亮着，暖色台灯是唯一的参考。"],
          ["连载", "chip-concept", "专栏 · 第 4 期", "本期讨论独立发行的成本结构与渠道选择。"],
          ["访谈", "chip-method", "对谈：小型印刷厂", "纸张、油墨与批量的权衡。"],
          ["随笔", "chip-read", "读者来信选", "摘录三封关于纸质触感的回信。"],
          ["专题", "chip-pick", "城市_walk 特辑", "五条适合散拍的路线与笔记。"],
          ["书评", "chip-career", "重读《慢邮地图》", "步行测量城市尺度的方法仍然有效。"],
        ]) +
        section(
          "分页",
          "",
          `<nav style="display:flex;justify-content:space-between;align-items:center"><span style="color:var(--muted-foreground)">第 1 / 9 页</span><span><button class="btn btn-outline" style="min-height:36px">上一页</button> <button class="btn btn-outline" style="min-height:36px">下一页</button></span></nav>`,
        ) +
        cta("订阅纸间周刊", "每周一推送编辑精选与连载更新。", "选择订阅方案"),
    }),

  "r2-states.html": () =>
    shell({
      title: "云备份助手",
      brand: "云备份助手",
      tagline: "文件同步与恢复",
      nav: ["首页", "备份", "恢复", "账户"],
      active: "首页",
      main:
        hero(
          "Sync",
          "多端文件自动备份",
          "增量同步、版本回溯与团队共享空间；异常时仍可浏览本地副本。",
          "查看定价",
        ) +
        stats([
          ["已保护文件", "18,402", ""],
          ["今日同步", "326", ""],
          ["平均延迟", "1.2s", ""],
          ["可用性", "99.9%", "30 天"],
        ]) +
        section(
          "服务状态示例",
          "",
          `<div class="entry-grid">${[
            ["think", "正在同步", "通常不超过一分钟，你可以先浏览本地副本。"],
            ["", "没有匹配文件", "换个关键词，或查看全部备份集。"],
            ["", "页面不存在", "链接可能已过期，返回首页继续浏览。"],
            ["", "连接暂时不可用", "服务正在恢复，请稍后重试。"],
          ]
            .map(
              ([, t, p]) =>
                `<section class="card state-view"><div class="filo-mascot-lg think" aria-hidden="true"></div><h2 class="font-heading">${t}</h2><p>${p}</p><button class="btn btn-outline">操作</button></section>`,
            )
            .join("")}</div>`,
        ) +
        section(
          "恢复流程",
          "",
          steps([
            ["选择", "备份集", "按日期或设备筛选。"],
            ["预览", "文件树", "恢复前可查看版本差异。"],
            ["确认", "写入位置", "默认恢复到原路径。"],
            ["完成", "校验", "生成恢复报告。"],
          ]),
        ) +
        section(
          "FAQ",
          "",
          faq([
            ["本地副本保留多久？", "默认 30 天，可在设置中延长。"],
            ["误删如何找回？", "进入回收站或使用版本回溯。"],
          ]),
        ) +
        cta("升级到团队版", "共享空间、审计日志与优先支持。", "比较方案"),
    }),

  "r3-bookstore.html": () =>
    shell({
      title: "半日闲书店",
      brand: "半日闲书店",
      tagline: "独立出版与读者活动",
      nav: ["首页", "新到", "活动", "关于"],
      active: "首页",
      main:
        hero(
          "Half-day Leisure",
          "在书里慢半日",
          "独立出版、翻译文学与童书选品；每周作者分享与读者圆桌。",
          "查看活动日历",
        ) +
        stats([
          ["在架品种", "2,840", "+46 本周"],
          ["活动场次", "12", "10 月"],
          ["会员", "1,280", ""],
          ["复购率", "38%", "近 90 天"],
        ]) +
        section(
          "本周新到",
          "完整目录",
          cards([
            ["小说", "chip-read", "《港口笔记》", "港口工人视角的连载长篇，首卷刚刚到库。"],
            ["非虚构", "chip-concept", "《慢邮地图》", "步行测量城市尺度的随笔集，加印第三版。"],
            ["推荐", "chip-pick", "童书角上新", "绘本按主题分区陈列，含导读卡片。"],
            ["翻译", "chip-method", "《北境车站》", "北欧冷调短篇集，译者分享会本周六。"],
            ["艺术", "chip-career", "《版画笔记》", "材料与工序对照图，适合入门。"],
            ["杂志", "chip-company", "《纸间》合订", "独立杂志年度精选。"],
          ]),
        ) +
        section(
          "近期活动",
          "",
          table(
            ["日期", "活动", "名额", "状态"],
            [
              ["10-25", "作者分享 · 北方小说", "30", "报名中"],
              ["10-26", "童书共读", "15", "已满"],
              ["11-02", "翻译对谈", "40", "即将开放"],
            ],
          ),
        ) +
        section(
          "读者说",
          "",
          quotes([
            ["童书角的导读卡片很贴心，孩子愿意自己选书。", "会员 · 陈女士"],
            ["活动区与书架动线合理，周末也不会太挤。", "读者 · 小周"],
          ]),
        ) +
        section(
          "常见问题",
          "",
          faq([
            ["如何办理会员？", "到店或官网注册，首年借阅免押金。"],
            ["活动如何报名？", "活动页提交后短信确认座位号。"],
            ["是否支持预定？", "热销书可预留 48 小时，到店付款。"],
          ]),
        ) +
        cta("想参加周六分享？", "余席有限，报名后保留至开场前 15 分钟。", "立即报名"),
    }),

  "r3-vet.html": () =>
    shell({
      title: "萌爪门诊",
      brand: "萌爪门诊",
      tagline: "宠物医疗预约",
      nav: ["首页", "预约", "疫苗", "关于"],
      active: "首页",
      main:
        hero("Pet Care", "今日预约与复诊提醒", "查看疫苗、体检与手术排期；到院前可在线填写问卷。", "预约到院") +
        stats([
          ["今日预约", "34", ""],
          ["疫苗档", "6", "剩余"],
          ["复诊", "12", ""],
          ["满意度", "4.9", ""],
        ]) +
        section("到院前准备", "", steps([["问卷", "在线填写", "缩短登记时间。"], ["禁食", "手术类", "按医嘱执行。"], ["携带", "免疫本", "便于核对记录。"], ["到院", "签到", "提前 10 分钟。"]])) +
        section("今日排期", "", tableRows([["时段", "类型", "宠物", "状态"], ["09:30", "疫苗", "示例·豆豆", "已确认"], ["11:00", "复诊", "示例·米米", "待诊"], ["14:30", "体检", "示例·阿黄", "已确认"]])) +
        section("宠主反馈", "", quotes([["医生解释很耐心，复查时间也安排好了。", "宠主 · H"], ["线上问卷省了很多排队时间。", "宠主 · K"]])) +
        section("FAQ", "", faq([["急诊如何处理？", "夜间请致电值班线，按语音提示分流。"], ["疫苗可以改期吗？", "提前 24 小时可在 App 内改期。"]])) +
        cta("首次到院？", "携带免疫本与既往检查报告。", "新客登记"),
    }),

  "r3-weather.html": () =>
    shell({
      title: "近场天气",
      brand: "近场天气",
      tagline: "小时级城区预报",
      nav: ["首页", "地图", "预警", "设置"],
      active: "首页",
      main:
        hero("Forecast", "城区小时级预报", "基于多源观测融合，提供降水、风力与体感温度；支持出行建议。", "查看地图") +
        stats([["现在", "18°", "多云"], ["14:00", "20°", ""], ["降水", "10%", ""], ["风力", "2 级", ""]]) +
        section("24 小时趋势", "", chart([["08", "40%"], ["12", "65%"], ["16", "52%"], ["20", "30%"]])) +
        section("分区概览", "", tableRows([["区域", "温度", "降水", "建议"], ["城北", "17°", "5%", "适宜骑行"], ["滨江", "19°", "20%", "带伞"], ["高新", "18°", "8%", "适宜户外"]])) +
        section("用户说", "", quotes([["小时级更新比系统天气 App 更贴近路口。", "用户 · R"], ["预警推送不会刷屏，刚好够用。", "用户 · T"]])) +
        cta("开通出行订阅", "每日早 7 点推送穿衣与雨具建议。", "免费试用"),
    }),

  "r3-billing.html": () =>
    shell({
      title: "城商银行",
      brand: "城商银行",
      tagline: "个人账单与还款",
      nav: ["首页", "账单", "还款", "理财"],
      active: "账单",
      main:
        hero("Billing", "10 月账单摘要", "汇总信用卡、生活缴费与自动转存；支持预约还款与分期试算。", "预约还款") +
        stats([["本期应还", "4,280", "元"], ["最低还", "428", ""], ["还款日", "10-28", ""], ["可用额度", "12,400", ""]]) +
        section("交易明细", "导出", tableRows([["日期", "摘要", "金额", "类型"], ["10-02", "自动转存", "+2,000.00", "储蓄"], ["10-05", "生活缴费", "-186.50", "支出"], ["10-12", "信用卡还款", "-3,420.00", "还款"], ["10-15", "超市消费", "-328.40", "消费"]])) +
        section("还款方式", "", steps([["全额", "一次还清", "无手续费。"], ["最低", "保留循环", "按日计息。"], ["分期", "3/6/12 期", "试算后确认。"], ["预约", "自动扣款", "还款日前一天执行。"]])) +
        cta("需要分期？", "在线试算每期本金与利息。", "打开试算器"),
    }),

  "r3-education.html": () =>
    shell({
      title: "小芽成长",
      brand: "小芽成长",
      tagline: "儿童课程与试听",
      nav: ["首页", "课程", "试听", "关于"],
      active: "首页",
      main:
        hero("Kids", "秋季课程表", "创意美术、少儿编程与体能游戏；支持试听与续报优惠。", "预约试听") +
        stats([["在册学员", "420", ""], ["开放试听", "8", "本周"], ["满班", "3", ""], ["续报", "76%", ""]]) +
        section("热门课程", "", cards([["美术", "chip-pick", "创意美术", "周三 16:00 · 剩余 3 席"], ["编程", "chip-method", "少儿编程", "周六 10:00 · 剩余 1 席"], ["体能", "chip-career", "体能游戏", "周五 17:30 · 满员"], ["音乐", "chip-read", "节奏启蒙", "周日 09:30 · 剩余 5 席"], ["阅读", "chip-concept", "绘本共读", "周二 15:00 · 剩余 2 席"], ["户外", "chip-company", "自然观察", "每月一次 · 报名中"]])) +
        section("家长评价", "", quotes([["老师会给每节课小结，孩子回家愿意复述。", "家长 · 孙"], ["试听流程清晰，没有强行推销。", "家长 · 周"]])) +
        section("FAQ", "", faq([["试听如何取消？", "开场前 24 小时可免费改期。"], ["请假规则？", "提前通知可安排补课券。"]])) +
        cta("秋季续报窗口", "续报享受教材包减免。", "查看优惠"),
    }),

  "r3-plants.html": () =>
    shell({
      title: "阳台管家",
      brand: "阳台管家",
      tagline: "植物养护与提醒",
      nav: ["首页", "植物", "提醒", "百科"],
      active: "首页",
      main:
        hero("Plants", "我的植物与待办", "记录浇水、施肥与光照；根据季节推送养护建议。", "添加植物") +
        stats([["在养", "14", "盆"], ["今日待办", "3", ""], ["平均健康", "92", "分"], ["百科", "860", "条"]]) +
        section("植物列表", "", cards([["多肉", "chip-career", "玉露", "南向窗台 · 下次浇水 10-24"], ["观叶", "chip-method", "龟背竹", "叶片褐边 · 检查直晒"], ["香草", "chip-concept", "迷迭香", "每周修剪一次"], ["藤本", "chip-read", "绿萝", "水位正常"], ["仙人掌", "chip-pick", "金琥", "少水期"], ["开花", "chip-company", "长寿花", "花期 · 薄肥"]])) +
        section("本周建议", "", chart([["浇水", "45%"], ["喷雾", "30%"], ["施肥", "15%"], ["转盆", "10%"]])) +
        cta("开通季节养护包", "按城市气候推送月度清单。", "了解详情"),
    }),

  "r3-rental.html": () =>
    shell({
      title: "里弄住房",
      brand: "里弄住房",
      tagline: "整租与合租",
      nav: ["首页", "房源", "地图", "关于"],
      active: "房源",
      main:
        hero("Housing", "可租房源", "整租、合租与短租；地图查看通勤时间，预约线下带看。", "地图找房") +
        `<div class="list-toolbar"><div class="seg-control"><button class="is-active">全部</button><button>整租</button><button>合租</button></div><input class="input" style="max-width:240px" placeholder="区域或地铁…" /></div>` +
        stats([["在架", "126", ""], ["本周新上", "18", ""], ["平均带看", "2.4", "次/套"], ["签约", "6 天", " median"]]) +
        section("精选房源", "", cards([["整租", "chip-method", "老洋房 2 室", "近地铁 8 分钟 · 月租参考 8,500"], ["整租", "chip-read", "电梯 1 室", "带阳台 · 6,200"], ["合租", "chip-concept", "次卧", "限女生 · 2,800"], ["整租", "chip-pick", "复式 loft", "带工作台 · 9,800"], ["合租", "chip-career", "主卧", "独立卫浴 · 4,200"], ["短租", "chip-company", "服务式", "含保洁 · 可月付"]])) +
        section("带看须知", "", faq([["如何预约？", "线上选时段，经纪人确认后短信通知。"], ["费用说明？", "平台不收取看房费，签约按合同。"]])) +
        cta("找不到合适房源？", "提交需求单，48 小时内匹配新上。", "提交需求"),
    }),

  "r3-volunteer.html": () =>
    shell({
      title: "周末行动",
      brand: "周末行动",
      tagline: "公益招募",
      nav: ["首页", "招募", "记录", "关于"],
      active: "招募",
      main:
        hero("Volunteer", "本周末招募", "社区服务、环保与陪伴类岗位；记录志愿时长。", "我要报名") +
        stats([["开放岗位", "24", ""], ["已报名", "186", ""], ["累计时长", "12k", "小时"], ["合作机构", "38", ""]]) +
        section("岗位列表", "", tableRows([["岗位", "时间", "人数", "状态"], ["河道清理", "周日 08:30", "20", "报名中"], ["图书馆整理", "周六 14:00", "6", "即将满"], ["老人陪伴", "周日 10:00", "8", "需培训"], ["物资分装", "周五 19:00", "15", "报名中"]])) +
        section("志愿者说", "", quotes([["分装活动组织有序，时长当天就能录入。", "志愿者 · 刘"], ["陪伴岗培训很具体，知道什么不能说。", "志愿者 · 何"]])) +
        section("流程", "", steps([["报名", "选岗位", ""], ["培训", "线上 30 分", ""], ["签到", "现场二维码", ""], ["记录", "自动计时长", ""]])) +
        cta("企业团建专场", "20 人以上可定制专属场次。", "联系协调员"),
    }),

  "r3-museum.html": () =>
    shell({
      title: "城脉馆",
      brand: "城脉馆",
      tagline: "展览与票务",
      nav: ["首页", "展览", "票务", "参观"],
      active: "展览",
      main:
        hero("Museum", "当前展览", "常设与特展联票，时段预约；家庭票与导览服务在线购买。", "购票") +
        stats([["在展", "4", ""], ["今日预约", "1,240", ""], ["剩余票", "320", "下午"], ["满意度", "4.8", ""]]) +
        section("展览一览", "", cards([["特展", "chip-pick", "工业记忆 1900–2000", "需预约时段"], ["互动", "chip-method", "声音地图", "耳机导览"], ["家庭", "chip-concept", "亲子导览", "周日 10:30"], ["常设", "chip-read", "城市起源", "含在通票"], ["临时", "chip-career", "摄影展", "至 11-30"], ["教育", "chip-company", "学校专场", "团体预约"]])) +
        section("时段余票", "", tableRows([["时段", "类型", "余票", "价格"], ["10:00", "通票", "86", "60"], ["14:00", "特展", "42", "80"], ["16:30", "通票", "120", "60"]])) +
        cta("计划参观？", "在线购票可跳过现场排队。", "立即购票"),
    }),

  "r3-pharmacy.html": () =>
    shell({
      title: "康邻药房",
      brand: "康邻药房",
      tagline: "常购与复购提醒",
      nav: ["首页", "常购", "处方", "门店"],
      active: "常购",
      main:
        hero("Pharmacy", "常购清单与复购", "OTC 与慢病复购提醒；处方上传后门店调剂。", "上传处方") +
        stats([["常购", "6", "种"], ["待复购", "2", ""], ["门店", "12", "家"], ["配送", "45", "分钟达"]]) +
        section("清单", "管理", tableRows([["品名", "规格", "下次复购", "渠道"], ["示例维生素", "30 片", "11-02", "到店/配送"], ["示例洗鼻盐", "15 包", "10-30", "配送"], ["示例贴膏", "8 贴", "11-08", "到店"]])) +
        section("门店服务", "", steps([["咨询", "药师在线", ""], ["调剂", "处方审核", ""], ["取药", "到店或配送", ""], ["随访", "慢病提醒", ""]])) +
        section("FAQ", "", faq([["处方多久审核？", "工作时段通常 2 小时内。"], ["能否医保？", "支持线下门店医保结算。"]])) +
        `<div class="card state-view" style="margin-top:2rem;max-width:none"><div class="filo-mascot-lg" aria-hidden="true"></div><h2 class="font-heading">夜间急购</h2><p>22:00 后请选择 24h 门店自提或次日达。</p></div>` +
        cta("慢病管理服务", "复购提醒与用药记录导出。", "了解服务"),
    }),
};

for (const [file, build] of Object.entries(pages)) {
  await writeFile(path.join(dir, file), build());
}
console.log("wrote", Object.keys(pages).length, "rich html files");
