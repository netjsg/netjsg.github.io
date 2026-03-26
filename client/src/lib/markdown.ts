/**
 * Markdown 文件解析工具
 * 用于解析 Front Matter 和 Markdown 内容
 */

export interface PostMetadata {
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  excerpt?: string;
}

export interface ParsedPost extends PostMetadata {
  id: string;
  content: string;
  excerpt: string; // 在 ParsedPost 中确保 excerpt 存在（即使是自动提取的）
}

/**
 * 解析 Front Matter 和 Markdown 内容
 * Front Matter 格式：
 * ---
 * title: 文章标题
 * slug: url-slug
 * date: 2024-01-15
 * category: 分类
 * tags: [标签1, 标签2]
 * excerpt: 摘要
 * ---
 * # 文章内容
 */
export function parseMarkdown(markdown: string): ParsedPost | null {
  // 移除 BOM 和规范化换行符
  let normalized = markdown.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');

  // 查找 Front Matter 分隔符
  const firstDelimiterIndex = normalized.indexOf('---');
  if (firstDelimiterIndex !== 0) {
    console.error('Invalid markdown format: missing front matter start');
    return null;
  }

  const secondDelimiterIndex = normalized.indexOf('---', 3);
  if (secondDelimiterIndex === -1) {
    console.error('Invalid markdown format: missing front matter end');
    return null;
  }

  const frontMatterStr = normalized.substring(3, secondDelimiterIndex).trim();
  const content = normalized.substring(secondDelimiterIndex + 3).trim();

  // 解析 Front Matter
  const metadata = parseFrontMatter(frontMatterStr);
  if (!metadata) {
    return null;
  }

  return {
    id: metadata.slug,
    content: content,
    ...metadata,
    excerpt: metadata.excerpt || extractExcerpt(content),
  };
}

/**
 * 解析 Front Matter YAML 格式
 */
function parseFrontMatter(frontMatterStr: string): PostMetadata | null {
  const lines = frontMatterStr.split('\n');
  const metadata: any = {};

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) continue;

    const key = trimmedLine.substring(0, colonIndex).trim();
    const value = trimmedLine.substring(colonIndex + 1).trim();

    if (key === 'tags') {
      // 解析数组格式 [tag1, tag2]
      const tagsMatch = value.match(/\[(.*?)\]/);
      if (tagsMatch) {
        metadata.tags = tagsMatch[1]
          .split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0);
      } else {
        metadata.tags = [];
      }
    } else {
      metadata[key] = value;
    }
  }

  // 验证必需字段
  const required = ['title', 'slug', 'date', 'category'];
  for (const field of required) {
    if (!metadata[field]) {
      console.error(`Missing required field in front matter: ${field}`);
      return null;
    }
  }

  if (!metadata.tags) {
    metadata.tags = [];
  }

  return metadata as PostMetadata;
}

/**
 * 从 Markdown 内容中提取摘要（第一段）
 */
export function extractExcerpt(content: string, length = 150): string {
  // 移除 Markdown 语法
  let text = content
    .replace(/#+\s/g, '') // 移除标题
    .replace(/[*_]/g, '') // 移除强调
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除链接
    .replace(/`[^`]+`/g, '') // 移除行内代码
    .replace(/```[\s\S]*?```/g, ''); // 移除代码块

  // 获取第一段
  const paragraph = text.split('\n').find((p) => p.trim().length > 0);
  if (!paragraph) return '';

  // 截断到指定长度
  return paragraph.substring(0, length).trim();
}
