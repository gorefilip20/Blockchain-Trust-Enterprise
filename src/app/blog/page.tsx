'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, ChevronRight, User } from 'lucide-react';

type Post = { id: string; title: string; slug: string; excerpt: string; content: string; author: string; category: string; status: string; created_at: string };

export default function PublicBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog').then((r) => r.json()).then(setPosts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="blog-public-page">
      <header className="blog-header">
        <div className="blog-header-inner">
          <Link href="/" className="blog-back-link"><ArrowLeft size={16} /> Back to workspace</Link>
          <div className="blog-brand">
            <div className="blog-brand-mark"><span /></div>
            <div><strong>Blockchain Trust</strong><small>Enterprise Blog</small></div>
          </div>
        </div>
      </header>

      <main className="blog-main">
        <div className="blog-hero">
          <p className="blog-eyebrow">Insights & research</p>
          <h1>BTE knowledge base</h1>
          <p className="blog-subtitle">Expert analysis on corporate structuring, digital asset custody, and institutional strategy.</p>
        </div>

        {loading && <div className="blog-loading">Loading posts...</div>}

        <div className="blog-grid">
          {posts.map((post) => (
            <article className="blog-card" key={post.id}>
              <div className="blog-card-top">
                <span className="blog-category-badge">{post.category}</span>
                <ChevronRight size={16} className="blog-card-arrow" />
              </div>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <footer className="blog-card-footer">
                <span><User size={13} /> {post.author}</span>
                <span><Calendar size={13} /> {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </footer>
            </article>
          ))}
        </div>

        {!loading && posts.length === 0 && <div className="blog-empty">No published posts yet. Check back soon for insights.</div>}
      </main>

      <footer className="blog-page-footer">
        <span>&copy; 2026 Blockchain Trust Enterprise. All rights reserved.</span>
      </footer>
    </div>
  );
}
