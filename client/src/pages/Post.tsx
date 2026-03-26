/**
 * 文章详情页面
 * 极简主义设计 - 展示单篇文章内容
 */

import { useRoute, Link } from 'wouter';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getPost, getAdjacentPosts, type ParsedPost } from '@/lib/postLoader';
import { Streamdown } from 'streamdown';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdjacentPost {
  prev: ParsedPost | null;
  next: ParsedPost | null;
}

export default function Post() {
  const [, params] = useRoute('/post/:slug');
  const [post, setPost] = useState<ParsedPost | null>(null);
  const [adjacent, setAdjacent] = useState<AdjacentPost>({
    prev: null,
    next: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadPost = async () => {
      if (!params?.slug) return;

      try {
        const loadedPost = await getPost(params.slug);
        const adjacentPosts = await getAdjacentPosts(params.slug);

        setPost(loadedPost);
        setAdjacent(adjacentPosts);
      } catch (error) {
        console.error('Failed to load post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16">
          <p className="text-foreground/60">加载中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              文章未找到
            </h1>
            <Link href="/posts" className="text-primary hover:text-primary/80 transition-colors">
              返回文章列表
            </Link>
          </div>
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
        <section className="container py-16">
          <Link href="/posts" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8">
            <ChevronLeft size={18} />
            返回文章列表
          </Link>

          <h1 className="text-5xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('zh-CN')}
            </time>
            <span className="text-foreground/40">•</span>
            <span>{post.category}</span>
            <span className="text-foreground/40">•</span>
            <div className="flex gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Article Content */}
        <article className="container py-16 max-w-3xl">
          <div className="prose prose-sm max-w-none">
            <Streamdown>{post.content}</Streamdown>
          </div>
        </article>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Navigation */}
        <section className="container py-16 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Previous Post */}
            {adjacent.prev ? (
              <Link href={`/post/${adjacent.prev.slug}`} className="group p-6 border border-border rounded hover:bg-card transition-colors">
                <div className="flex items-center gap-2 text-sm text-foreground/60 mb-2">
                  <ChevronLeft size={16} />
                  上一篇
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {adjacent.prev.title}
                </h3>
              </Link>
            ) : (
              <div className="p-6 border border-border rounded opacity-50">
                <div className="text-sm text-foreground/60 mb-2">上一篇</div>
                <p className="text-foreground/40">没有更早的文章</p>
              </div>
            )}

            {/* Next Post */}
            {adjacent.next ? (
              <Link href={`/post/${adjacent.next.slug}`} className="group p-6 border border-border rounded hover:bg-card transition-colors text-right">
                <div className="flex items-center justify-end gap-2 text-sm text-foreground/60 mb-2">
                  下一篇
                  <ChevronRight size={16} />
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {adjacent.next.title}
                </h3>
              </Link>
            ) : (
              <div className="p-6 border border-border rounded opacity-50 text-right">
                <div className="text-sm text-foreground/60 mb-2">下一篇</div>
                <p className="text-foreground/40">没有更新的文章</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
