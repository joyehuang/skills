---
name: interview-kb
description: 面经统一管理：接收并归档面试记录（本地 md/txt、飞书文档/妙记），按公司/日期分类存入 ~/research/面经/，维护 README 台账，可生成脱敏公开版发布到 joyehuang.dev。当用户发来面经/面试记录/沟通总结/岗位信息，或要求整理面经时使用。不要用于：非面试相关的文档管理、飞书文档内容编辑（走 lark-doc）。
---

# Interview KB（面经管理）

## 是什么

统一管理 Joye 的面试资产：面经（完整/浓缩）、沟通记录、岗位信息、会议妙记。私有版存本地，公开版脱敏后发 joyehuang.dev。

## 目录结构

```
~/research/面经/
├── README.md           ← 总台账（索引所有记录，状态图例）
├── 沟通记录/           ← 与 HR/猎头/创始人的沟通总结
│   └── YYYY-MM-DD-公司-对象-主题.md
├── 已面试/             ← 面经记录
│   └── YYYY-MM-DD-公司-岗位方向.md
├── 岗位信息/           ← 岗位/JD/公司调研
│   └── YYYY-MM-DD-公司-岗位.md
└── 待整理/             ← 收到的原始材料暂存（未分类）
```

命名规范：`YYYY-MM-DD-公司-类型.md`，类型 = 面经/沟通/岗位/妙记。

## 收件流程（用户发来任何面试相关材料时）

1. **识别来源类型**：
   - 本地 md/txt → 直接读取
   - 飞书文档 URL（/docx/ /wiki/）→ `lark-cli docs +fetch --doc <url> --doc-format markdown --as user`（personal profile，用户需授权 docs/drive）
   - 飞书妙记 URL（/minutes/）→ `lark-cli minutes +detail`（personal profile，需 minutes scope）
   - 纯文本/截图 → 转文字后存待整理
2. **归档**：按内容归类到对应目录，命名 `YYYY-MM-DD-公司-类型.md`，文件头带元信息（来源 URL、时间、参与人、状态）
3. **更新 README 台账**：在对应分类表格加一行（日期/公司/主题/来源/状态）
4. **确认**：回复用户归档位置 + 台账摘要

## 状态图例（README 用）

- 🔴 已面试
- 🟡 沟通中
- 🟢 感兴趣 / 待投
- ⚪ 已投递
- 🔵 已归档

## 脱敏公开版（发布 joyehuang.dev）

用户要求公开面经时：
1. 复制私有版 → 去除：个人信息（姓名/学校/坐标/可到岗时间）、面试官名、公司名（或改为"某公司"）、具体业务数据（ARR/内部指标）、未公开产品细节
2. 保留：问题清单、回答思路、技术复盘、踩坑点
3. 存 `~/research/面经/public/`（脱敏后），命名加 `-public` 后缀
4. 发布到 joyehuang.dev（发布方式见下）

## 发布到 joyehuang.dev

joyehuang.dev 部署在 Cloudflare Pages（CF 账号 Huangdeshiou@gmail.com，Free plan）。
- 静态内容：wrangler/直接上传，或走 R2 公网链接
- 具体发布命令待 joyehuang.dev 站点搭建后补充（TODO）

## 验证清单

- [ ] 收件后 README 台账已更新
- [ ] 飞书文档拉取用 `--as user`（personal profile）
- [ ] 私有版含完整元信息（来源 URL/日期/参与人）
- [ ] 公开版已脱敏（个人信息/公司名/敏感数据）
- [ ] 不把密钥/appSecret 写进任何文件
