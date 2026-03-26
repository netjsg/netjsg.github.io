/**
 * 博客页脚组件
 * 极简主义设计 - 简洁的页脚布局
 */

import { blogMetadata } from '@/lib/metadata';
import { Link } from 'wouter';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">快速链接</h3>
            <ul className="flex flex-row gap-6">
              <li>
                <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/archive" className="text-foreground/60 hover:text-foreground transition-colors">
                  存档
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">社交媒体</h3>
            <div className="flex gap-4">
              {blogMetadata.social.github && (
                <a
                  href={blogMetadata.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              )}
              {blogMetadata.social.twitter && (
                <a
                  href={blogMetadata.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              )}
              {blogMetadata.social.linkedin && (
                <a
                  href={blogMetadata.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <p className="text-sm text-foreground/50 text-center">
            © {currentYear} {blogMetadata.author}. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}
