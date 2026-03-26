/**
 * 文章列表页面
 * 极简主义设计 - 展示所有文章和分类筛选
 */

import { Link } from 'wouter';
import { useState, useEffect, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { loadPosts, getAllCategories, ParsedPost } from '@/lib/postLoader';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export default function Posts() {
  const [posts, setPosts] = useState<ParsedPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allPosts = await loadPosts();
        const allCategories = await getAllCategories();
        setPosts(allPosts);
        setCategories(allCategories);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;
    if (selectedCategory) {
      result = result.filter((post) => post.category === selectedCategory);
    }
    if (selectedTag) {
      result = result.filter((post) => post.tags.includes(selectedTag));
    }
    return result;
  }, [posts, selectedCategory, selectedTag]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="container py-16 pb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ChevronLeft size={18} />
            返回首页
          </Link>
          <h1 className="text-5xl font-bold text-foreground mb-4">所有文章</h1>
          <p className="text-lg text-foreground/60">
            共有 {posts.length} 篇文章
          </p>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Filters Section */}
        <section className="container py-8 border-b border-border space-y-6">
          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-3 items-center">
              <span className="text-sm font-medium text-foreground/70 mr-2">分类:</span>
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                全部
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 mr-2">
                <Tag size={16} />
                <span>标签:</span>
              </div>
              <button
                onClick={() => setSelectedTag(null)}
                className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                  selectedTag === null
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background border border-border text-foreground hover:bg-secondary'
                }`}
              >
                全部
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                    tag === selectedTag
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Posts List */}
        <section className="container py-16">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-foreground/60">加载中...</p>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="max-w-3xl space-y-12">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group"
                >
                  <Link href={`/post/${post.slug}`} className="block">
                    <h2 className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                      {post.title}
                    </h2>
                  </Link>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/50 mb-4">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('zh-CN')}
                    </time>
                    <span className="text-foreground/30">•</span>
                    <Link href={`/category/${post.category}`} className="hover:text-primary transition-colors">
                      {post.category}
                    </Link>
                  </div>

                  <p className="text-foreground/70 mb-6 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag: string) => (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          tag === selectedTag
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <Link href={`/post/${post.slug}`} className="inline-flex items-center gap-1 text-primary hover:gap-2 transition-all font-medium">
                    阅读更多 <ChevronRight size={18} />
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary/20 rounded-lg">
              <p className="text-foreground/60 mb-6">
                未找到匹配的文章
              </p>
              <button
                onClick={() => { setSelectedCategory(null); setSelectedTag(null); }}
                className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                重置所有筛选
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
