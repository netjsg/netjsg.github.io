/**
 * 博客导航栏组件
 * 极简主义设计 - 简洁的导航结构
 */

import { Link } from 'wouter';
import { getAllCategories } from '@/lib/postLoader';
import { useEffect, useState } from 'react';
import { Github, Moon, Sun } from 'lucide-react';
import { blogMetadata } from '@/lib/metadata';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

interface Category {
  name: string;
  slug: string;
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    async function fetchCategories() {
      const categoryNames = await getAllCategories();
      const categoryObjects = categoryNames.map(name => ({ name, slug: name.toLowerCase() }));
      setCategories(categoryObjects);
    }

    fetchCategories();
  }, []);
  return (
    <header className="sticky top-0 z-50 bg-background/60 backdrop-blur-md border-b border-border transition-colors duration-300">
      <nav className="container py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group relative">
          <span className="text-4xl font-light tracking-tighter transition-all duration-500 group-hover:tracking-widest flex items-baseline">
            <span className="font-black italic text-primary">g</span>
            <span className="text-foreground -ml-1">io</span>
            <span className="w-1 h-1 bg-primary rounded-full ml-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </span>
          <motion.div 
            className="absolute -bottom-1 left-0 h-px bg-primary w-0 group-hover:w-full transition-all duration-500"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Dynamic Category Links */}
          <div className="hidden md:flex gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.name}`} 
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Archive Link */}
          <Link href="/archive" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
            存档
          </Link>

          {/* Theme Toggle */}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-secondary text-foreground/70 hover:text-foreground transition-all duration-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          {/* Github Icon */}
          <a
            href={blogMetadata.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground transition-colors p-1"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
        </div>
      </nav>
    </header>
  );
}
