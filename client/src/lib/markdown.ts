/**
 * Markdown 文件解析工具
 * 用于解析 Front Matter 和 Markdown 内容
 */

export interface PostMetadata {
  title: string;
  slug?: string;
  date: string;
  category?: string; // 变为可选
  tags: string[];
  excerpt?: string;
}

export interface ParsedPost extends Omit<PostMetadata, 'slug' | 'category'> {
  id: string;
  slug: string;
  category: string; // 解析后确保存在
  content: string;
  excerpt: string;
}

/**
 * 解析 Front Matter 和 Markdown 内容
 * @param markdown 原始文本
 * @param fallbackSlug 如果 Front Matter 中没有 slug，使用的备用值（通常是文件名）
 * @param fallbackCategory 如果 Front Matter 中没有 category，使用的备用值（通常是文件夹名）
 */
export function parseMarkdown(
  markdown: string,
  fallbackSlug?: string,
  fallbackCategory?: string
): ParsedPost | null {
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

  const finalSlug = metadata.slug || fallbackSlug;
  if (!finalSlug) {
    console.error('Post missing both slug in front matter and fallback slug');
    return null;
  }

  // 提取分类：如果 category 是路径（如 client/public/posts/教程），取最后一部分
  let finalCategory = metadata.category || fallbackCategory || '未分类';
  if (finalCategory.includes('/')) {
    finalCategory = finalCategory.split('/').pop() || '未分类';
  }

  return {
    ...metadata,
    id: finalSlug,
    slug: finalSlug,
    category: finalCategory,
    content: content,
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
