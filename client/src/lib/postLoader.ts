/**
 * 文章加载器
 * 自动从 public/posts 目录加载所有 Markdown 文件
 */

import { parseMarkdown, ParsedPost } from './markdown';

export type { ParsedPost };

let cachedPosts: ParsedPost[] | null = null;

/**
 * 获取文章文件列表
 */
async function getArticleFiles(): Promise<string[]> {
  try {
    // 生产环境下使用 build 时生成的 posts.json
    // 使用 import.meta.env.BASE_URL 确保在 github.io 的子目录下也能正确找到
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
    const url = import.meta.env.PROD ? `${baseUrl}posts.json` : '/api/posts';
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch article list from ${url}`);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching article list:', error);
    return [];
  }
}

/**
 * 加载所有文章
 */
export async function loadPosts(): Promise<ParsedPost[]> {
  if (cachedPosts) {
    return cachedPosts;
  }

  try {
    const posts: ParsedPost[] = [];
    const articleFiles = await getArticleFiles();
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

    // 加载每个 Markdown 文件
    for (const file of articleFiles) {
      try {
        const postResponse = await fetch(`${baseUrl}posts/${file}`);
        if (!postResponse.ok) {
          console.warn(`Failed to load post ${file}: ${postResponse.status}`);
          continue;
        }

        const markdown = await postResponse.text();
        const post = parseMarkdown(markdown);

        if (post) {
          posts.push(post);
        } else {
          console.warn(`Failed to parse post ${file}`);
        }
      } catch (error) {
        console.error(`Error loading post ${file}:`, error);
      }
    }

    // 按日期排序（最新的在前）
    posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    cachedPosts = posts;
    return posts;
  } catch (error) {
    console.error('Failed to load posts:', error);
    return [];
  }
}

/**
 * 获取单篇文章
 */
export async function getPost(slug: string): Promise<ParsedPost | null> {
  const posts = await loadPosts();
  return posts.find((post) => post.slug === slug) || null;
}

/**
 * 获取相邻文章（上一篇和下一篇）
 */
export async function getAdjacentPosts(
  slug: string
): Promise<{ prev: ParsedPost | null; next: ParsedPost | null }> {
  const posts = await loadPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  };
}

/**
 * 获取指定分类的文章
 */
export async function getPostsByCategory(
  category: string
): Promise<ParsedPost[]> {
  const posts = await loadPosts();
  return posts.filter((post) => post.category === category);
}

/**
 * 获取指定标签的文章
 */
export async function getPostsByTag(tag: string): Promise<ParsedPost[]> {
  const posts = await loadPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<string[]> {
  const posts = await loadPosts();
  const categories = new Set(posts.map((post) => post.category));
  return Array.from(categories).sort();
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await loadPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * 清除缓存（用于开发环境热更新）
 */
export function clearPostCache(): void {
  cachedPosts = null;
}
