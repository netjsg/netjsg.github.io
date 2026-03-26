# 文章管理指南

## 快速开始

现在您可以通过创建 Markdown 文件来管理博客文章。所有文章都应该放在 `public/posts/` 目录中。

## 创建新文章

### 1. 创建 Markdown 文件

在 `public/posts/` 目录中创建一个新的 `.md` 文件，例如 `my-first-post.md`。

### 2. 文章格式

每篇文章都需要包含 Front Matter（元数据）和内容。格式如下：

```markdown
---
title: 文章标题
slug: article-url-slug
date: 2024-01-15
category: 分类名称
tags: [标签1, 标签2, 标签3]
excerpt: (可选) 文章摘要，如果省略，系统会自动从正文中提取第一段作为摘要
---

# 文章标题

这里是文章内容，支持完整的 Markdown 语法。

## 二级标题

您可以使用所有标准的 Markdown 语法：

- 列表项 1
- 列表项 2
- 列表项 3

### 代码示例

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

**粗体文本** 和 *斜体文本* 都支持。

> 引用文本也是支持的
```

### 3. Front Matter 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 文章标题 | `我的第一篇文章` |
| `slug` | 文章 URL 路径，用于生成链接 | `my-first-post` |
| `date` | 发布日期，格式 YYYY-MM-DD | `2024-01-15` |
| `category` | 文章分类 | `技术`、`生活`、`设计` |
| `tags` | 文章标签，用方括号和逗号分隔 | `[React, JavaScript, Web]` |
| `excerpt` | (可选) 文章摘要，如果省略，系统会自动从正文中提取第一段作为摘要 | `这是一篇关于...的文章` |

## 文件命名规则

- 使用英文字母、数字和连字符（`-`）
- 建议使用小写字母
- 文件名应该与 `slug` 字段对应
- 例如：`hello-world.md`、`my-first-post.md`

## 自动加载功能

现在的系统已经实现了**自动加载**功能！您只需要将 Markdown 文件保存到 `public/posts/` 目录中，系统会自动发现并显示它们，不再需要手动在 `postLoader.ts` 中注册。

## 支持的 Markdown 语法

### 标题
```markdown
# 一级标题
## 二级标题
### 三级标题
```

### 列表
```markdown
- 无序列表项 1
- 无序列表项 2

1. 有序列表项 1
2. 有序列表项 2
```

### 强调
```markdown
**粗体** 或 __粗体__
*斜体* 或 _斜体_
***粗斜体***
```

### 链接和图片
```markdown
[链接文本](https://example.com)
![图片描述](https://example.com/image.jpg)
```

### 代码
```markdown
行内代码：`code`

代码块：
\`\`\`javascript
function hello() {
  console.log('Hello');
}
\`\`\`
```

### 引用
```markdown
> 这是一个引用
> 可以有多行
```

### 分割线
```markdown
---
```

### 表格
```markdown
| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 数据 | 数据 | 数据 |
```

## 示例文章

您可以参考 `public/posts/` 目录中已有的示例文章：
- `hello-world.md` - 基础文章示例
- `markdown-guide.md` - Markdown 语法示例

## 部署和发布

### 本地测试
```bash
pnpm dev
```

访问 `http://localhost:3000` 查看您的博客。新添加的文章会自动显示在：
- 首页的最新文章部分
- 文章列表页面（`/posts`）
- 存档页面（`/archive`）

### 构建生产版本
```bash
pnpm build
```

构建完成后，静态文件会生成在 `dist` 目录中，可以部署到任何静态网站托管服务。

## 常见问题

### 文章没有显示？

1. 检查文件是否在 `public/posts/` 目录中
2. 检查 Front Matter 是否正确（必需字段：title, slug, date, category）
3. 检查 Front Matter 前后是否有 `---` 分隔符
4. 刷新浏览器页面

### 日期格式不对？

确保日期格式为 `YYYY-MM-DD`，例如 `2024-01-15`。

### 标签没有显示？

标签格式应该是 `[标签1, 标签2]`，用方括号和逗号分隔。

### 如何修改已发布的文章？

直接编辑对应的 Markdown 文件，保存后刷新浏览器即可看到更新。

### 如何删除文章？

1. 从 `public/posts/` 目录中删除对应的 `.md` 文件
2. 刷新浏览器

## 最佳实践

1. **保持摘要简洁**：摘要应该在 150 字以内
2. **使用有意义的 slug**：避免使用过长或不相关的 URL 路径
3. **合理分类**：使用一致的分类名称
4. **标签不宜过多**：每篇文章 3-5 个标签比较合适
5. **定期备份**：定期备份您的 Markdown 文件
6. **记得注册新文件**：创建新文章后一定要在 `ARTICLE_FILES` 中注册

## 获取帮助

如有任何问题，请参考项目的 README.md 或 DEPLOYMENT.md 文档。
