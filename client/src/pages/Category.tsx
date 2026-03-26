/**
 * 博客分类页面
 * 极简主义设计 - 展示特定分类的文章
 */

import { useParams, Link } from 'wouter';
import { useEffect, useState, useMemo } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPostsByCategory, ParsedPost } from '@/lib/postLoader';
import { ChevronLeft, ChevronRight, Tag } from 'lucide-react';

export default function Category() {
  const params = useParams();
  const slug = params.slug as string;
  const categoryName = slug;

  const [posts, setPosts] = useState<ParsedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // 获取该分类下所有的标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  // 根据选中的标签过滤文章
  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const categoryPosts = await getPostsByCategory(categoryName);
      setPosts(categoryPosts);
      setSelectedTag(null); // 切换分类时重置选中的标签
      setLoading(false);
    }

    fetchPosts();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16 text-center">
          <p>正在加载文章...</p>
        </main>
        <Footer />
      </div>
    );
  }

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
          <h1 className="text-5xl font-bold text-foreground mb-4">{categoryName}</h1>
          <p className="text-lg text-foreground/60">关于“{categoryName}”分类的文章</p>
          <p className="text-sm text-foreground/50 mt-4">共有 {posts.length} 篇文章</p>
        </section>

        {/* Tag Cloud Section */}
        {allTags.length > 0 && (
          <section className="container mb-8">
            <div className="flex flex-wrap gap-2 items-center p-4 bg-secondary/30 rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/70 mr-2">
                <Tag size={16} />
                <span>筛选标签:</span>
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
          </section>
        )}

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Posts */}
        <section className="container py-16">
          {filteredPosts.length > 0 ? (
            <div className="space-y-6 max-w-3xl">
              {filteredPosts.map(post => (
                <article key={post.id} className="card-minimal">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <Link href={`/post/${post.slug}`} className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                      <p className="text-foreground/60 mt-2 mb-4">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                            className={`text-xs px-3 py-1 rounded transition-colors ${
                              tag === selectedTag
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-foreground/50 whitespace-nowrap">
                      <div>{new Date(post.date).toLocaleDateString('zh-CN')}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/60 mb-4">
                {selectedTag ? `标签为 “${selectedTag}” 的文章暂无` : '该分类下暂无文章'}
              </p>
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-primary hover:underline"
                >
                  清除筛选
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
