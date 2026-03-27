# gio-blog - 简约、自动化的个人博客

一个基于 React 19、Tailwind CSS 4 构建的极简主义个人博客。旨在提供最纯粹的写作体验，支持 Markdown 驱动、全自动化部署，并已针对 GitHub Pages 进行深度优化。

## ✨ 特性

- **极简主义设计**：清晰的排版、适当的留白，专注于内容阅读。
- **Markdown 驱动**：只需在 `posts/` 目录添加 `.md` 文件即可发布。
- **多级目录支持**：支持子目录组织文章（如 `posts/教程/git.md`），系统会自动递归扫描。
- **全自动化元数据**：
  - **自动分类**：默认以**文件夹名称**作为文章分类（例如 `教程/` 目录下的文章分类为 `教程`）。
  - **路径解析**：Front Matter 中的 `category` 支持完整路径，系统会自动提取最后一级目录名。
  - **自动 Slug**：如果不手动指定，系统会自动使用**文件名**作为访问路径。
- **动态导航栏**：右上角的分类导航会根据文章中的分类实时动态生成，无需修改代码。
- **GitHub Pages 深度优化**：
  - **自动化构建**：通过 GitHub Actions 实现推送即发布。
  - **SPA 路由兼容**：通过 `404.html` 脚本解决了刷新页面 404 的问题。
  - **静态列表生成**：Vite 插件在构建时自动扫描文章目录并生成 `posts.json`。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```
访问 `http://localhost:3000` 查看博客。

### 构建与预览

```bash
pnpm build
pnpm preview
```

## 📝 内容管理

### 添加文章

在 `client/public/posts/` 目录下创建一个新的 `.md` 文件即可。

### 文章格式示例

```markdown
---
title: "我的第一篇博文"
date: "2024-03-27"
tags: ["React", "Vite"]
excerpt: "这是一段精简的文章摘要..."
# category: "client/public/posts/教程" (可选，系统会自动提取为 "教程")
# slug: "my-post-slug" (可选，默认使用文件名)
---

# 正文开始
这里写你的 Markdown 内容。
```

### 自动分类规则

1. **文件夹即分类**：`posts/tec/git.md` 的分类将自动设为 `tec`。
2. **路径提取**：如果 Front Matter 中的 `category` 为 `client/public/posts/教程`，分类将自动设为 `教程`。
3. **手动指定**：也可以在 Front Matter 中直接填写 `category: 生活`。

## 🛠️ 技术栈

- **框架**：React 19 + Wouter (轻量级路由)
- **样式**：Tailwind CSS 4
- **构建**：Vite 7
- **UI 组件**：shadcn/ui
- **图标**：Lucide React
- **部署**：GitHub Actions

## 📂 项目结构

```text
client/
├── public/
│   ├── posts/             # Markdown 文章存放目录 (支持多级目录)
│   ├── 404.html           # SPA 路由重定向脚本
│   └── posts.json         # 构建时自动生成的静态文章列表
├── src/
│   ├── components/        # 核心 UI 组件 (Header, Footer 等)
│   ├── pages/             # 页面组件 (Home, Post, Category, Archive)
│   ├── lib/               # 核心逻辑 (Markdown 解析器、文章加载器)
│   └── App.tsx            # 应用入口与路由配置
.github/workflows/
└── deploy.yml             # GitHub Actions 自动化部署配置
```

## 🌐 部署到 GitHub Pages

项目已针对 `github.io` 进行了深度优化，部署步骤如下：

1. 将代码推送到 GitHub 的 `master` 分支。
2. 在 GitHub 仓库设置中：**Settings > Pages**。
3. 将 **Build and deployment > Source** 设置为 **GitHub Actions**。
4. 等待 Actions 运行完成后即可通过 `https://<您的用户名>.github.io/` 访问。

## 许可证

MIT
