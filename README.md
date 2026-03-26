# Simple Blog - 简约个人博客

一个基于 React 19、Tailwind CSS 4 和 TypeScript 构建的简约个人博客项目。支持部署到 GitHub Pages 和云服务器。

## 特性

- **极简主义设计**：清晰的排版、适当的留白和精心选择的色彩
- **响应式设计**：完美适配桌面、平板和手机设备
- **快速加载**：使用 Vite 构建，支持 HMR 热更新
- **类型安全**：完整的 TypeScript 支持
- **易于定制**：简洁的代码结构，易于扩展和修改
- **多种部署方式**：支持 GitHub Pages、云服务器等多种部署选项

## 技术栈

- **框架**：React 19 + Wouter（轻量级路由）
- **样式**：Tailwind CSS 4 + 自定义 CSS 变量
- **类型**：TypeScript 5.6
- **构建**：Vite 7
- **UI 组件**：shadcn/ui
- **Markdown 渲染**：Streamdown
- **图标**：Lucide React

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

访问 `http://localhost:3000` 查看博客。

### 构建生产版本

```bash
pnpm build
```

构建完成后，静态文件将生成在 `dist` 目录中。

### 预览生产版本

```bash
pnpm preview
```

## 项目结构

```
client/
├── public/                 # 静态文件（favicon、robots.txt 等）
├── src/
│   ├── components/        # 可复用组件
│   │   ├── Header.tsx     # 导航栏
│   │   └── Footer.tsx     # 页脚
│   ├── pages/             # 页面组件
│   │   ├── Home.tsx       # 首页
│   │   ├── Posts.tsx      # 文章列表
│   │   ├── Post.tsx       # 文章详情
│   │   ├── Category.tsx   # 分类页
│   │   ├── About.tsx      # 关于页
│   │   └── NotFound.tsx   # 404 页面
│   ├── lib/               # 工具函数和数据
│   │   ├── types.ts       # TypeScript 类型定义
│   │   ├── posts.ts       # 示例文章数据
│   │   └── metadata.ts    # 博客元数据
│   ├── contexts/          # React Context
│   ├── App.tsx            # 主应用组件
│   ├── main.tsx           # 入口文件
│   └── index.css          # 全局样式
└── index.html             # HTML 模板
```

## 自定义博客

### 修改博客信息

编辑 `client/src/lib/metadata.ts` 修改博客标题、描述、作者信息和社交媒体链接。

### 添加文章

编辑 `client/src/lib/posts.ts` 添加新文章。每篇文章需要以下信息：

```typescript
{
  id: '4',
  title: '文章标题',
  slug: 'article-slug',
  excerpt: '文章摘要',
  content: '文章内容（支持 Markdown）',
  date: '2024-01-20',
  category: '分类名称',
  tags: ['标签1', '标签2'],
  author: '作者名称',
  readingTime: 5, // 阅读时间（分钟）
}
```

### 修改样式

全局样式定义在 `client/src/index.css` 中。修改 CSS 变量可以改变整个网站的色彩和排版。

主要的 CSS 变量：

- `--primary`：主色（深蓝）
- `--foreground`：文字颜色（深灰）
- `--background`：背景色（纯白）
- `--card`：卡片背景（浅灰）
- `--border`：边框颜色（浅灰）

### 添加新页面

1. 在 `client/src/pages/` 创建新的页面组件
2. 在 `client/src/App.tsx` 中添加路由

## 部署

详细的部署指南请参考 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 快速部署到 GitHub Pages

1. 创建 GitHub 仓库
2. 配置 GitHub Actions（参考 DEPLOYMENT.md）
3. 推送代码到 main 分支
4. GitHub Actions 会自动构建并部署

### 部署到云服务器

1. 构建项目：`pnpm build`
2. 上传 `dist` 目录到服务器
3. 配置 Nginx 或其他 Web 服务器
4. 配置域名和 SSL 证书

## 内容管理

目前博客文章存储在 `client/src/lib/posts.ts` 中。对于更大规模的博客，可以考虑：

1. **使用 Markdown 文件**：将文章存储为 Markdown 文件，通过脚本加载
2. **集成 CMS**：使用 Headless CMS（如 Strapi、Contentful）管理内容
3. **升级到全栈**：使用 `webdev_add_feature` 添加数据库支持

## 性能优化

- 使用 Vite 的代码分割自动优化包体积
- 静态资源使用 CDN URL 存储在 `/home/ubuntu/webdev-static-assets/`
- 启用 Gzip 压缩和缓存策略
- 使用 Tailwind CSS 的 PurgeCSS 移除未使用的样式

## 浏览器支持

支持所有现代浏览器（Chrome、Firefox、Safari、Edge）。

## 许可证

MIT

## 常见问题

**Q: 如何添加评论功能？**
A: 可以集成第三方评论系统（如 Disqus、Utterances）或升级到全栈项目添加后端支持。

**Q: 如何实现搜索功能？**
A: 可以使用客户端搜索库（如 Fuse.js）或集成全文搜索服务。

**Q: 如何优化 SEO？**
A: 确保每个页面有适当的 meta 标签、标题和描述。可以使用 `react-helmet` 管理 head 标签。

**Q: 支持暗色主题吗？**
A: 项目已配置了暗色主题的 CSS 变量。可以在 `App.tsx` 中启用 `switchable` 主题切换。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如有问题或建议，请通过以下方式联系：

- 提交 GitHub Issue
- 发送邮件到博客作者
- 通过社交媒体联系

---

**祝您使用愉快！** 🎉
