/**
 * 博客数据类型定义
 * 极简主义设计 - 数据结构保持简洁
 */

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readingTime: number; // 分钟
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface BlogMetadata {
  title: string;
  description: string;
  author: string;
  email: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ArchiveMonth {
  year: number;
  month: number;
  monthName: string;
  posts: BlogPost[];
}

export interface ArchiveYear {
  year: number;
  months: ArchiveMonth[];
  totalPosts: number;
}
