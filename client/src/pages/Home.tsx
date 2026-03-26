/**
 * 博客首页
 * 极简主义设计 - 展示最新文章和分类
 */

import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { loadPosts, getAllCategories, ParsedPost } from '@/lib/postLoader';
import { blogMetadata } from '@/lib/metadata';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Category {
  name: string;
  slug: string;
}

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<ParsedPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const allPosts = await loadPosts();
      setLatestPosts(allPosts.slice(0, 5));

      const categoryNames = await getAllCategories();
      const categoryObjects = categoryNames.map(name => ({ name, slug: name.toLowerCase() }));
      setCategories(categoryObjects);
      setIsLoaded(true);
    }

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden transition-colors duration-500">
      {/* Dynamic Art Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[100px]"
        />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] dark:opacity-[0.05]" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")` }} />
      </div>

      <Header />

      <main className="flex-1">
        {/* Artistic Hero Section */}
        <section className="container pt-20 pb-16 md:pt-32 md:pb-24">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
            <div className="flex-1 order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 60 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="h-1 bg-primary mb-8"
                />
                <h2 className="text-sm uppercase tracking-[0.4em] text-primary font-bold mb-6">Gio's Creative Space</h2>
                <p className="text-3xl md:text-5xl font-light text-foreground/80 leading-tight mb-12 max-w-2xl italic serif">
                  探索技术与生活的交汇点，<br/>
                  在这里，每一行代码和文字都拥有生命。
                </p>
                <div className="flex gap-6">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link href="/posts" className="px-10 py-4 bg-foreground text-background rounded-full font-medium hover:bg-foreground/90 transition-all shadow-xl shadow-foreground/10">
                      开始阅读
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            <div className="flex-shrink-0 order-1 md:order-2">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative cursor-pointer group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-[10rem] md:text-[18rem] font-black leading-none tracking-tighter flex items-center select-none">
                  <motion.span 
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, -2, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="text-foreground relative z-10 drop-shadow-2xl"
                  >
                    g
                  </motion.span>
                  <motion.span 
                    animate={{ 
                      y: [0, 10, 0],
                      rotate: [0, 2, 0]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="text-primary -ml-8 md:-ml-16 relative z-20 mix-blend-multiply dark:mix-blend-screen italic drop-shadow-[0_0_30px_rgba(var(--primary),0.3)]"
                  >
                    io
                  </motion.span>
                </div>

                {/* Ambient Glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.3, 0.1]
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                  className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] -z-10"
                />

                {/* Orbiting Elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[1px] border-dashed border-primary/30 rounded-full scale-110 opacity-50"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-[0.5px] border-primary/10 rounded-full scale-150"
                />

                {/* Floating Particles */}
                <motion.div
                  animate={{ 
                    y: [-20, 20, -20],
                    x: [-10, 10, -10],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 right-10 w-4 h-4 bg-primary/40 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ 
                    y: [20, -20, 20],
                    x: [10, -10, 10],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 -left-10 w-3 h-3 bg-blue-400/30 rounded-full blur-sm"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Post Feed - Redesigned for Art Style */}
        <section className="py-20 relative">
          <div className="container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <h2 className="text-6xl md:text-7xl font-black text-foreground mb-4 tracking-tighter">
                  最新<span className="text-primary italic">发布</span>
                </h2>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="h-1 bg-gradient-to-r from-primary to-transparent rounded-full" 
                />
              </motion.div>
              <Link href="/posts" className="group flex items-center gap-2 text-foreground/40 hover:text-primary transition-all font-bold tracking-[0.2em] uppercase text-xs">
                <span>View all stories</span>
                <div className="w-8 h-px bg-foreground/20 group-hover:w-12 group-hover:bg-primary transition-all" />
              </Link>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-8"
            >
              {latestPosts.map((post: ParsedPost) => (
                <motion.article 
                  key={post.id} 
                  variants={itemVariants}
                  whileHover={{ 
                    x: 10,
                    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-border/40 bg-card/30 backdrop-blur-sm hover:bg-card/80 transition-all duration-700"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    <div className="flex-1 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                      <div className="flex flex-col items-center md:items-start min-w-[120px]">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-2">
                          {post.category}
                        </span>
                        <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">
                          {new Date(post.date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <Link href={`/post/${post.slug}`} className="block group/title mb-2">
                          <h3 className="text-2xl md:text-4xl font-bold text-foreground group-hover/title:text-primary transition-all duration-500 tracking-tight">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-foreground/50 leading-relaxed line-clamp-1 max-w-2xl font-light text-sm md:text-base">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="hidden sm:flex gap-3">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[10px] font-medium text-foreground/30 px-3 py-1 border border-foreground/5 rounded-lg bg-foreground/[0.02]">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <Link href={`/post/${post.slug}`} className="relative w-14 h-14 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-primary-foreground transition-all duration-700 shadow-2xl shadow-primary/0 group-hover:shadow-primary/30 shrink-0">
                        <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 bg-primary rounded-full -z-10"
                        />
                      </Link>
                    </div>
                  </div>

                  {/* Enhanced Background Decoration */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-primary/15 transition-all duration-700" />
                  <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/10 rounded-[2.5rem] transition-colors duration-700" />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Immersive Categories */}
        <section className="container py-20">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-[0.5em] text-primary font-bold mb-4">Explore by Theme</h2>
            <h3 className="text-5xl font-black text-foreground">内容分类</h3>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {categories.map(category => (
              <motion.div key={category.slug} variants={itemVariants} className="h-full">
                <Link href={`/category/${category.slug}`} className="group block relative h-full p-8 rounded-[3rem] border border-border overflow-hidden hover:border-primary/30 transition-all duration-500">
                  <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700 blur-2xl" />
                  <div className="relative z-10">
                    <h4 className="text-3xl font-black text-foreground group-hover:text-primary transition-colors mb-6">{category.name}</h4>
                    <p className="text-foreground/50 leading-relaxed mb-12">在这个空间里，我记录关于 {category.name} 的所有思考与沉淀。</p>
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                      进入探索 <ChevronRight size={16} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
