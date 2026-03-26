/**
 * 404 页面
 * 极简主义设计
 */

import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container py-32 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
          <p className="text-xl text-foreground/60 mb-8">
            抱歉，我们找不到您要查找的页面。
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
            <ChevronLeft size={18} />
            返回首页
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
