/**
 * 博客文章存档页面
 * 按时间线（年、月）分组展示所有文章
 */

import { Link } from 'wouter';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { loadPosts, type ParsedPost } from '@/lib/postLoader';
import { ChevronLeft, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface MonthGroup {
  month: string;
  posts: ParsedPost[];
}

interface YearGroup {
  year: string;
  months: MonthGroup[];
  totalPosts: number;
}

export default function Archive() {
  const [archiveData, setArchiveData] = useState<YearGroup[]>([]);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allPosts = await loadPosts();
        setTotalPostCount(allPosts.length);

        const groupedData = groupPostsByTimeline(allPosts);
        setArchiveData(groupedData);
      } catch (error) {
        console.error('Failed to load posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const groupPostsByTimeline = (posts: ParsedPost[]): YearGroup[] => {
    const yearMap = new Map<string, Map<string, ParsedPost[]>>();

    // 确保文章按日期降序排列
    const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    sortedPosts.forEach(post => {
      const date = new Date(post.date);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0') + '月';

      if (!yearMap.has(year)) {
        yearMap.set(year, new Map());
      }

      const monthMap = yearMap.get(year)!;
      if (!monthMap.has(month)) {
        monthMap.set(month, []);
      }
      monthMap.get(month)!.push(post);
    });

    const result: YearGroup[] = [];
    yearMap.forEach((monthMap, year) => {
      const monthGroups: MonthGroup[] = [];
      let totalPosts = 0;
      
      monthMap.forEach((posts, month) => {
        monthGroups.push({ month, posts });
        totalPosts += posts.length;
      });

      result.push({
        year,
        months: monthGroups.sort((a, b) => b.month.localeCompare(a.month)), // 月份降序
        totalPosts,
      });
    });

    return result.sort((a, b) => b.year.localeCompare(a.year)); // 年份降序
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Header Section */}
        <section className="container py-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-all mb-8 group">
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              返回首页
            </Link>
            <h1 className="text-6xl font-black text-foreground mb-4 tracking-tighter">时光<span className="text-primary italic">轴</span></h1>
            <p className="text-xl text-foreground/60 font-light italic">记录下的每一刻，共 {totalPostCount} 篇文章</p>
          </motion.div>
        </section>

        {/* Timeline Content */}
        <section className="container pb-32">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : archiveData.length > 0 ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto relative"
            >
              {/* Vertical Timeline Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent transform -translate-x-1/2 hidden md:block" />

              {archiveData.map((yearGroup) => (
                <div key={yearGroup.year} className="mb-20">
                  {/* Year Marker */}
                  <div className="flex justify-center mb-12 relative">
                    <div className="bg-primary text-primary-foreground px-8 py-2 rounded-full text-2xl font-black shadow-xl shadow-primary/20 z-10">
                      {yearGroup.year}
                    </div>
                  </div>

                  <div className="space-y-12">
                    {yearGroup.months.map((monthGroup) => (
                      <div key={monthGroup.month} className="relative">
                        {/* Month Label */}
                        <div className="flex items-center gap-4 mb-8 md:justify-center">
                          <div className="h-px flex-1 bg-border md:hidden" />
                          <div className="flex items-center gap-2 text-primary font-bold tracking-widest uppercase text-sm bg-secondary/50 px-4 py-1 rounded-full">
                            <Calendar size={14} />
                            {monthGroup.month}
                          </div>
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        {/* Posts in Month */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                          {monthGroup.posts.map((post, index) => (
                            <motion.div 
                              key={post.id}
                              variants={itemVariants}
                              className={`relative group ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}
                            >
                              {/* Dot on timeline for desktop */}
                              <div className={`absolute top-1/2 w-4 h-4 rounded-full bg-background border-4 border-primary shadow-lg shadow-primary/30 z-20 hidden md:block ${index % 2 === 0 ? '-right-[34px]' : '-left-[34px]'} transform -translate-y-1/2 group-hover:scale-125 transition-transform`} />

                              <Link href={`/post/${post.slug}`} className="block">
                                <div className="p-6 rounded-3xl border border-border/50 hover:border-primary/30 hover:bg-secondary/30 transition-all duration-500">
                                  <div className="flex flex-col gap-2">
                                    <div className={`text-[10px] font-bold text-primary/60 uppercase tracking-widest ${index % 2 === 0 ? 'md:justify-end' : ''} flex gap-2`}>
                                      <span>{post.category}</span>
                                      {post.tags.slice(0, 1).map(tag => <span key={tag}>#{tag}</span>)}
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                      {post.title}
                                    </h3>
                                    <div className="text-xs text-foreground/40 font-medium">
                                      {new Date(post.date).toLocaleDateString('zh-CN', { day: 'numeric', month: 'long' })}
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-32">
              <p className="text-foreground/40 text-2xl font-light italic">时光静好，暂无文字记录</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
