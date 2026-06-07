# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目上下文，在操作此仓库时使用。

## 项目概述

"中国—东盟气候智慧型热带农业协同平台"官方网站，包含前台展示页面和后台管理系统。项目性质为政务/学术机构官网，设计风格要求庄重、沉稳，避免商业化和AI感。

## 启动命令

```bash
npm install          # 安装依赖（首次运行）
npm run dev          # 启动开发服务器（http://localhost:3000）
npm run build        # 生产构建
npm run generate     # 静态生成（nuxt generate），输出到 .output/public
npm run preview      # 预览生产构建结果
npm run db:push      # 同步 Prisma schema 到数据库
npm run db:seed      # 运行数据库种子脚本
npm run db:setup     # db:push + db:seed 一键初始化数据库
```

首次启动步骤：
```bash
npm install
npm run db:setup     # 创建 SQLite 数据库并写入初始数据
npm run dev          # 启动开发服务器
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Nuxt 3（前台 SSG 静态生成，管理后台 SPA 模式） |
| 前端 | Vue 3 Composition API，纯手写 CSS，不使用任何 UI 组件库 |
| CSS | Scoped CSS + CSS Variables（variables.css全局变量） |
| 数据库 | SQLite（文件位于 db/platform.db） |
| ORM | Prisma 5 |
| 认证 | JWT（单管理员账号） |
| 部署 | nuxt generate 生成静态文件，部署到 CDN |

## 项目结构

```
├── nuxt.config.ts              # Nuxt 配置（static preset、路由规则、routeRules）
├── app.vue                     # 应用入口
├── package.json
├── prisma/
│   ├── schema.prisma           # 数据库表结构定义
│   └── seed.js                 # 种子数据脚本
├── db/
│   └── platform.db             # SQLite 数据库文件
├── assets/
│   └── css/
│       ├── variables.css       # CSS 变量（颜色、字体、尺寸、圆角、过渡）
│       └── global.css          # 全局样式重置（box-sizing、container类）
├── server/
│   ├── utils/
│   │   ├── prisma.js           # Prisma 客户端单例
│   │   └── jwt.js              # JWT 签名/验证工具
│   ├── middleware/
│   │   └── auth.js             # 管理端 JWT 认证中间件
│   └── api/                    # 所有 API 接口
│       ├── nav-menus.get.js
│       ├── carousel-items.get.js
│       ├── news.get.js
│       ├── news/[id].get.js
│       ├── news-meta/[id].get.js       # 文章元数据（栏目信息、子栏目ID）
│       ├── unit-categories.get.js
│       ├── support-units.get.js
│       ├── contact-info.get.js
│       ├── qrcode.get.js
│       ├── messages.post.js
│       ├── sub-categories.get.js       # 根据 menuSlug 获取子目录列表
│       └── admin/                      # 管理端接口（全部需要 JWT）
│           ├── login.post.js
│           ├── nav-menus/              # CRUD
│           ├── carousel/               # CRUD
│           ├── news/                   # CRUD
│           ├── unit-categories/        # CRUD
│           ├── support-units/          # CRUD
│           ├── messages/               # 留言管理（列表、详情、标已读、回复、删除）
│           └── settings.put.js         # 联系信息 + 二维码配置
├── composables/
│   └── useApi.js               # 前台/后台 API 请求封装
├── layouts/
│   ├── default.vue             # 前台页面布局（HeaderNav + 页脚）
│   └── admin.vue               # 后台页面布局（仅容器）
├── components/
│   ├── HeaderNav.vue           # 顶部标题栏 + 导航菜单 + 搜索 + 二维码 + 语言切换
│   ├── QrcodeModal.vue         # 二维码弹窗放大查看
│   ├── CarouselBanner.vue      # 轮播图组件（640×400px，5秒自动播放）
│   ├── NewsList.vue            # 最新动态列表（支持原地切换查看详情）
│   ├── SupportUnits.vue        # 支撑单位展开/收起组件
│   ├── ContactBlock.vue        # 联系我们区块（带边框）
│   ├── FooterSection.vue       # 页脚（支撑单位链接、联系信息、版权）
│   └── AdminSidebar.vue        # 后台侧边栏导航（深绿色背景）
├── pages/
│   ├── index.vue               # 首页（SSG）— 轮播图+最新动态
│   ├── category/[slug].vue     # 导航栏目详情页（SSG）— 侧边栏子目录导航+内容
│   ├── news/[id].vue           # 文章详情页（SSG）— 面包屑+正文
│   ├── units/[categoryId].vue  # 支撑单位列表页（SSG）
│   ├── about.vue               # 关于我们
│   ├── downloads.vue           # 资料下载
│   ├── experts.vue             # 专家团队
│   ├── projects.vue            # 合作项目
│   ├── data.vue                # 数据中心（Chart.js 图表）
│   ├── search.vue              # 搜索结果（?q=xxx）
│   ├── message.vue             # 留言表单页（SPA，ssr: false，需登录）
│   ├── login.vue               # 前台用户登录
│   ├── register.vue            # 前台用户注册
│   ├── user/index.vue          # 用户中心
│   ├── [...slug].vue           # 404 页面
│   └── admin/                  # 管理后台（全部 SPA）
│       ├── login.vue           # 管理员登录页
│       ├── index.vue           # 后台首页（数据概览）
│       ├── nav-menus.vue       # 导航菜单管理
│       ├── category-content.vue# 栏目内容管理
│       ├── carousel.vue        # 轮播图管理
│       ├── news.vue            # 资讯列表
│       ├── news/[id].vue       # 资讯编辑器
│       ├── units.vue           # 支撑单位 + 分类管理
│       ├── about.vue           # 关于我们管理
│       ├── downloads.vue       # 资料下载管理
│       ├── experts.vue         # 专家管理
│       ├── projects.vue        # 合作项目管理
│       ├── messages.vue        # 留言工单列表
│       ├── messages/[id].vue   # 留言详情 + 回复
│       ├── subscribers.vue     # 邮件订阅管理
│       └── settings.vue        # 系统设置（联系方式、二维码）
└── public/
    └── images/                 # 占位 SVG 图片（轮播图、二维码）
```

## 配色方案（CSS 变量，定义于 variables.css）

采用暖调大地色系的政务/学术风格配色，灵感源自热带土壤与自然材质。无蓝色或紫色元素：

| 变量 | 值 | 用途 |
|------|------|------|
| `--color-bg` | `#faf8f5` | 页面主背景（暖象牙白） |
| `--color-bg-light` | `#f3f0ea` | 轻微暖灰背景 |
| `--color-bg-card` | `#fefdfb` | 卡片背景 |
| `--color-header-bg` | `#2c2219` | Header/Footer 深咖啡色背景 |
| `--color-header-text` | `#f5f0e8` | Header/Footer 暖奶油色文字 |
| `--color-accent` | `#b87235` | 强调色：陶土铜色（链接悬停、按钮、装饰条） |
| `--color-accent-hover` | `#944f1a` | 强调色深色 |
| `--color-accent-light` | `#faf0e5` | 强调色浅色背景 |
| `--color-on-accent` | `#ffffff` | 强调色背景上的文字色 |
| `--color-text` | `#3d3226` | 正文字色（暖深棕） |
| `--color-text-secondary` | `#6b5d4e` | 次要文字 |
| `--color-text-muted` | `#978c7a` | 弱化文字/占位符 |
| `--color-border` | `#e5dfd4` | 边框/分割线 |
| `--color-table-header` | `#f7f4f0` | 表格表头背景 |
| `--color-danger-bg` | `#fdf0ed` | 危险操作悬停背景 |
| `--color-warning-bg` | `#fef9e7` | 警告行背景 |
| `--color-success` | `#5a8a4a` | 成功色（橄榄绿） |
| `--color-error` | `#c0503a` | 错误/警告色（暖红） |
| `--color-warning` | `#c88830` | 警告色（琥珀） |

## CSS 规则（不可随意更改）

- **背景色**：暖象牙白或极浅暖灰（`#f3f0ea`），不使用大面积色块
- **强调色为陶土铜色** `#b87235`，禁止使用蓝色 `#1a5c9e`、蓝紫渐变或鲜红色 `#c41f3a`
- **边框**：仅"联系我们"区块使用 `1px solid var(--color-border)`，其余区块通过留白分区
- **字体**：`-apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", "Segoe UI", sans-serif`
- **桌面端**：≥768px，左右分栏布局
- **移动端**：<768px，全部上下堆叠，可点击区域 ≥44×44px
- **过渡动画**：0.2s-0.3s ease
- **页面最大宽度**：1200px（`.container`）
- **所有颜色**优先使用 CSS 变量，禁止硬编码色值（除图表等特殊场景）

## 数据库表（9 张表）

| 表名 | 说明 | 关键字段 |
|------|------|----------|
| admins | 管理员 | username, password_hash（SHA256） |
| nav_menus | 导航菜单 | name, slug, sort_order, is_highlight, is_visible |
| carousel_items | 轮播图 | image_url, title, link_url, sort_order, is_visible |
| news_articles | 资讯文章 | title, content(富文本HTML), summary, cover_image, publish_time, is_published, category_slug, sub_category_id |
| unit_categories | 支撑单位分类 | name（院属单位/管理机构/重要平台）, sort_order |
| support_units | 支撑单位 | category_id, name, logo_url, website_url, sort_order |
| contact_info | 联系信息 | key_name（address/phone/header_note）, value |
| qrcode_config | 二维码配置 | image_url |
| messages | 留言 | category, sender_name, sender_email, sender_phone, content, is_read, reply, replied_at |

## API 规范

- 响应格式：`{ code: 200, message: "success", data: {...} }`
- 认证方式：管理端请求头携带 `Authorization: Bearer <token>`

**前台公开接口（无需认证）：**

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /nav-menus | 获取可见导航菜单 |
| GET | /carousel-items | 获取可见轮播图 |
| GET | /news?page=1&size=6 | 分页获取已发布资讯 |
| GET | /news/:id | 获取资讯详情 |
| GET | /news-meta/:id | 获取文章元数据（categoryName, subCategoryName, subCategoryId, categorySlug） |
| GET | /unit-categories | 获取支撑单位分类 |
| GET | /support-units?categoryId=1 | 获取某分类下的单位 |
| GET | /sub-categories?menuSlug=xxx | 获取某栏目下的子目录列表 |
| GET | /contact-info | 获取联系信息（地址、电话） |
| GET | /qrcode | 获取二维码图片地址 |
| POST | /messages | 提交留言 |

**后台管理接口（需要 JWT 认证）：**
- POST /admin/login — 登录
- nav-menus、carousel、news、unit-categories、support-units 的完整 CRUD
- GET /admin/messages — 留言列表（支持 status=unread/read 筛选）
- GET /admin/messages/:id — 留言详情
- PUT /admin/messages/:id/read — 标记已读
- PUT /admin/messages/:id/reply — 回复留言
- DELETE /admin/messages/:id — 删除留言
- PUT /admin/settings — 更新联系信息 + 二维码

## 路由与生成策略

| 路由 | 模式 | 说明 |
|------|------|------|
| / | SSG | 首页，构建时预渲染 |
| /category/:slug | SSG | 栏目详情页 |
| /units/:categoryId | SSG | 支撑单位列表页 |
| /news/:id | SSG | 文章详情页 |
| /about, /downloads, /experts, /projects, /data, /search | SSG | 静态内容页 |
| /message | SPA | 留言表单，需登录 |
| /login, /register | SPA | 认证页面 |
| /user/** | SPA | 用户中心 |
| /admin/** | SPA | 管理后台所有页面 |
| /:pathMatch(.*)* | SSG | 404 页面 |

SSG 预渲染路由在 nuxt.config.ts 的 `nitro.prerender.routes` 中手写列举。

## 页面关键交互逻辑

### 面包屑规则
- **文章详情页**（news/[id].vue）：`首页 > 一级栏目 > 子栏目名称(色#333) > 文章标题`
- **栏目页**（category/[slug].vue）：`首页 > 栏目名称`
- 面包屑中的首页链接保持强调色，其余层级文字色 `var(--color-text-muted)`，子栏目名称文字色 `#333333`
- 子栏目名称可点击，链接到 `/category/:slug?subId=xxx`，subId 用于栏目页侧边栏自动高亮对应子目录

### 导航栏
- Header 深墨绿背景，标题居中，右侧有语言切换、搜索、二维码
- 导航栏 4列网格（桌面），8 个菜单项，悬浮/激活时变浅绿色粗体
- 移动端单列堆叠

### 轮播图
- 固定 640×400px，5秒自动播放
- 左右箭头 + 底部圆点指示器
- 淡入淡出过渡 0.4s
- 移动端触摸滑动，宽度 100%

### 最新动态
- 首次加载最新 6 条资讯
- 点击条目跳转到 `/news/:id` 详情页
- 有"查看更多"按钮加载更多

### 支撑单位
- 点击主标题展开/收起三个子分类（院属单位/管理机构/重要平台）
- max-height 过渡动画
- 点击子分类跳转到 `/units/:categoryId`

### 栏目页（category/[slug].vue）
- 左侧侧边栏：子目录列表（按钮式，点击选中高亮）、重要新闻、热门话题
- 右侧主内容：按子目录分区块展示新闻列表
- 子目录选择高亮 URL 驱动：URL 携带 `?subId=xxx` 时自动选中对应子目录
- 无 `subId` 时默认选中第一个子目录
- active 背景为墨绿 `var(--color-accent)`，hover 背景为 `var(--color-accent-light)`

### 留言表单
- 需登录（localStorage 存 user_token）
- 5个分类下拉选项：交流、提供经验、信息、项目合作建议、考察交流
- 前端校验：标题2-22字无特殊符号、内容10-1000字
- 支持图片附件上传（限制5张，每张50M以内）
- 提交防重复点击，成功/失败提示

### 二维码
- 标题栏右侧 80×80px 缩略图
- 点击弹出居中大图遮罩弹窗，点击遮罩关闭

### 管理后台
- 单管理员 JWT 登录（token 存 localStorage）
- 侧边栏深墨绿背景导航
- 所有模块支持增删查改
- 留言支持按已读/未读筛选、标记已读、回复
- 未读留言数在首页概览以红色警告色显示

## 优化建议与注意事项

1. **所有颜色必须通过 CSS 变量引用**，禁止硬编码十六进制色值
2. 图表（data.vue）中的颜色是 Chart.js data 配置，允许直接写色值，但需配合大地暖色配色方案
3. 留言表单的附件上传功能前端已完成 UI，但后端需对接文件存储服务
4. i18n 已集成，所有页面文案通过 `t()` 翻译函数渲染（部分页面直接中文文案未走 i18n）
5. SSG 模式下动态路由（如 `/news/:id`）需要在构建时通过 crawler 发现或手写路由列表
6. 代码中所有错误处理使用 `console.error` 输出，生产环境建议替换为日志上报

## 初始账号

- 管理员：用户名 `admin`，密码 `admin123`
- 前台用户：通过 /register 注册
