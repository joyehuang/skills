---
name: friend-link
description: 处理 joyehuang.me 友情链接申请。当用户说"有友链申请/有人申请友链/links 页新评论/加个友链"，或收到 waline 评论通知（含 "Name: / Desc: / Link:" 格式）时使用。流程：解析申请 → 校验链接 → 写入 blog 仓库 links.json + logbook → git 提交推送（Vercel 部署）→ 用 Waline 管理员 API 在评论区回复对方。核心入口是 ~/bin/friend-link.sh。
---

# Friend Link 申请处理

## 触发场景
- 收到 Telegram 通知「📝 新评论 · joyehuang.me」且 URL 含 `/links`（来自 waline postSave hook）
- 评论内容是友链申请格式（含 `Name:` `Desc:` `Link:` `Avatar:`）
- 用户直接说"加了友链/回复他"

## 标准流程

### 1. 确认申请内容
从通知/评论里提取四字段（Name / Desc / Link / Avatar）。Waline 查询评论：
```bash
curl -sL "https://waline.joyehuang.me/comment?path=%2Flinks&page=1&pageSize=20&sortBy=insertedAt_desc" \
  -H "Referer: https://joyehuang.me/links" -H "User-Agent: Mozilla/5.0"
```
申请评论特征：`type != administrator`，comment 含 `Name: xxx<br>Desc: xxx<br>Link: <a ...>`。

### 2. 一键执行（核心）
```bash
# dry-run 先检查（可选）
~/bin/friend-link.sh --dry-run "Name: xxx
Desc: xxx
Link: https://xxx
Avatar: https://xxx"

# 正式执行（解析→校验→写 links.json→写 logbook→commit+push→评论区回复）
~/bin/friend-link.sh "Name: xxx
Desc: xxx
Link: https://xxx
Avatar: https://xxx"
```
脚本自动完成：校验 Link 可达 → 写入 `~/dev/blog/public/links.json` → 更新 `~/dev/blog/src/site.config.ts` 的 logbook → `git commit + push`（触发 Vercel 部署）→ 用管理员 JWT POST 回复申请者"已添加你的友链"。

### 3. 验证
```bash
# 等 Vercel 部署（约 1 分钟）后：
curl -sL "https://joyehuang.me/links.json" | python3 -c "import json,sys; d=json.load(sys.stdin); print([f['name'] for f in d['friends'][0]['link_list']])"
```
确认新名字在列表里；如用户要求截图，用 ego-browser 打开 https://joyehuang.me/links 验证（注意：友链页是星座图，名字 hover 才显示，DOM/snapshotText 确认即可）。

## 技术细节（复用踩坑记录）

### Waline 管理员认证
- Waline 部署：`~/dev/waline-deploy`（Vercel + Neon Postgres），admin 用户 id=1（joye）
- 管理员 token = `jwt.sign('1', JWT_KEY)`，JWT_KEY 在 `~/dev/waline-deploy/.env` 的 `JWT_TOKEN`
- 请求带 `Authorization: Bearer <token>` + `Referer: https://joyehuang.me/links`

### 评论回复 API
```
POST https://waline.joyehuang.me/comment
  url=/links
  comment=回复内容
  nick=joye
  pid=<申请评论 objectId>
  rid=<申请评论 objectId>
  at=<申请者昵称>
  link=https://www.joyehuang.me/
```
成功返回 `{"errno":0,...}`，新评论 objectId 递增。

### 数据库（备用，直接查评论/用户）
```bash
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
psql "<DATABASE_URL from .env>" -c "SELECT id, display_name, type FROM wl_users;"
psql "<DATABASE_URL>" -c "SELECT id, nick, comment, status FROM wl_comment ORDER BY id DESC LIMIT 10;"
```

## 注意事项
- **先 dry-run** 确认解析正确，再正式执行（脚本会真实写入并 push）
- 脚本完成后会**自动发 Telegram 通知**（经 ~/bin/notify-telegram.py，发到用户的 pi-telegram）——包含处理结果和线上链接
- 若博客仓库有未提交改动，脚本会 stash——执行后检查 `git stash list`
- 评论通知会发到用户 Telegram（waline postSave hook），收到通知即代表有新申请
- 回复文案固定：「已添加你的友链，欢迎常来～ 🙌」（@对方）
