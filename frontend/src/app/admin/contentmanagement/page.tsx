'use client';

import { useState, useEffect, useCallback } from 'react';

interface Article {
  id: number;
  title: string;
  content: string;
  image: string;
  created_at: string;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
}

type ContentType = 'all' | 'article' | 'faq';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function ContentManagementPage() {
  const [activeFilter, setActiveFilter] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<'article' | 'faq'>('article');
  const [articles, setArticles] = useState<Article[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch articles from backend
  const fetchArticles = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/articles`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch articles');
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      // Fallback to mock if API not ready
      setArticles([
        {
          id: 1,
          title: 'Safety Protocols: Navigating Night Walks',
          content: 'Detailed guide on staying safe during night walks...',
          image: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&h=300&fit=crop',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          title: 'Building Trust: Community Guidelines 2024',
          content: 'Community guidelines for building trust...',
          image: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    }
  }, []);

  // Fetch FAQs from backend
  const fetchFAQs = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/faq`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch FAQs');
      const data = await res.json();
      setFaqs(data);
    } catch (err) {
      // Fallback to mock if API not ready
      setFaqs([
        {
          id: 1,
          question: 'How do I verify a new volunteer?',
          answer: 'To verify a new volunteer, you need to...',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 2,
          question: 'Emergency contacts: Who to call first?',
          answer: 'In case of emergency, contact...',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchArticles(), fetchFAQs()]);
    setLoading(false);
  }, [fetchArticles, fetchFAQs]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const allContent = [
    ...articles.map(a => ({ ...a, type: 'article' as const })),
    ...faqs.map(f => ({ ...f, type: 'faq' as const })),
  ];

  const filteredContent = allContent.filter(item => {
    if (activeFilter === 'article') return item.type === 'article';
    if (activeFilter === 'faq') return item.type === 'faq';
    return true;
  }).filter(item => {
    const searchLower = searchQuery.toLowerCase();
    if (item.type === 'article') {
      return item.title.toLowerCase().includes(searchLower);
    }
    return item.question.toLowerCase().includes(searchLower);
  });

  const stats = {
    totalArticles: articles.length,
    totalFaq: faqs.length,
    totalContent: articles.length + faqs.length,
  };

  const handleDeleteArticle = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete article');
      await fetchArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      // Fallback: delete locally
      setArticles(prev => prev.filter(a => a.id !== id));
    } finally {
      setActionLoading(false);
    }
  }, [fetchArticles]);

  const handleDeleteFAQ = useCallback(async (id: number) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/faq/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete FAQ');
      await fetchFAQs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      // Fallback: delete locally
      setFaqs(prev => prev.filter(f => f.id !== id));
    } finally {
      setActionLoading(false);
    }
  }, [fetchFAQs]);

  const handleCreate = useCallback(async (formData: { title: string; content: string; image?: string }) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = createType === 'article' ? `${API_BASE}/articles` : `${API_BASE}/faq`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error(`Failed to create ${createType}`);
      
      await fetchAll();
      setIsCreateModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setActionLoading(false);
    }
  }, [createType, fetchAll]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getTypeIcon = (type: string) => type === 'article' ? 'article' : 'help';

  const getTypeColor = (type: string) => {
    return type === 'article' 
      ? { bg: 'bg-secondary-container/50', text: 'text-on-secondary-container' }
      : { bg: 'bg-tertiary-container/50', text: 'text-on-tertiary-container' };
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Content Management</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">Manage articles and FAQ for the community.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="glass-card p-4 rounded-lg bg-error/10 border-error/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-error">error</span>
          <p className="font-body-md text-body-md text-error">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-on-surface-variant hover:text-primary"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Stats Bento */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-lg flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined text-[28px]">article</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Total Articles</p>
            <p className="font-headline-md text-headline-md text-on-surface">{stats.totalArticles}</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-lg flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
            <span className="material-symbols-outlined text-[28px]">quiz</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">FAQ Entries</p>
            <p className="font-headline-md text-headline-md text-on-surface">{stats.totalFaq}</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 glass-card p-6 rounded-lg flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-primary-container flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-[28px]">folder</span>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Total Content</p>
            <p className="font-headline-md text-headline-md text-on-surface">{stats.totalContent}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={() => setActiveFilter('all')}
            className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${activeFilter === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass-card text-on-surface-variant hover:text-primary'}`}
          >
            All Content
          </button>
          <button 
            onClick={() => setActiveFilter('article')}
            className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${activeFilter === 'article' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass-card text-on-surface-variant hover:text-primary'}`}
          >
            Articles
          </button>
          <button 
            onClick={() => setActiveFilter('faq')}
            className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all ${activeFilter === 'faq' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'glass-card text-on-surface-variant hover:text-primary'}`}
          >
            FAQ
          </button>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <div className="relative glass-card rounded-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search content..."
              className="bg-transparent border-none rounded-full pl-10 pr-4 py-2 text-label-md font-label-md focus:ring-2 focus:ring-primary/50 w-64 transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => { setCreateType('article'); setIsCreateModalOpen(true); }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-label-md text-label-md shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Create New
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="glass-card p-12 rounded-lg flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="font-body-md text-body-md text-on-surface-variant">Loading content...</p>
        </div>
      ) : (
        <>
          {/* Content List */}
          <div className="space-y-4">
            {filteredContent.map((item) => {
              const typeColors = getTypeColor(item.type);
              return (
                <div key={`${item.type}-${item.id}`} className="glass-card glass-card-hover p-5 rounded-lg flex items-center gap-6 group">
                  <div className="w-24 h-16 rounded overflow-hidden bg-surface-container shrink-0 flex items-center justify-center">
                    {item.type === 'article' && 'image' in item && item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full ${typeColors.bg} flex items-center justify-center`}>
                        <span className={`material-symbols-outlined text-[32px] ${typeColors.text}`}>{getTypeIcon(item.type)}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`${typeColors.bg} ${typeColors.text} px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase`}>
                        {item.type === 'article' ? 'Article' : 'FAQ'}
                      </span>
                      <span className="font-caption text-caption text-on-surface-variant opacity-60">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                    <h3 className="font-headline-sm text-[18px] text-on-surface leading-snug truncate">
                      {item.type === 'article' ? item.title : item.question}
                    </h3>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="p-2 hover:bg-primary/10 rounded-full text-on-surface-variant hover:text-primary transition-all">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button 
                      onClick={() => item.type === 'article' ? handleDeleteArticle(item.id) : handleDeleteFAQ(item.id)}
                      disabled={actionLoading}
                      className="p-2 hover:bg-error/10 rounded-full text-on-surface-variant hover:text-error transition-all disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredContent.length === 0 && (
              <div className="glass-card p-12 rounded-lg flex flex-col items-center justify-center gap-4 text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] opacity-40">folder_open</span>
                <p className="font-body-md text-body-md">No content found</p>
                <button 
                  onClick={() => { setCreateType('article'); setIsCreateModalOpen(true); }}
                  className="mt-2 text-primary font-label-md text-label-md hover:underline"
                >
                  Create new content
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center glass-card px-6 py-4 rounded-lg">
            <p className="font-caption text-caption text-on-surface-variant">
              Showing 1 to {filteredContent.length} of {filteredContent.length} entries
            </p>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-bold">1</button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-primary hover:text-white transition-all font-bold">2</button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center glass-card hover:bg-primary hover:text-white transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="glass-card p-8 rounded-2xl w-full max-w-lg relative border border-white/50 shadow-2xl">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h2 className="font-headline-md text-headline-md text-on-background mb-6">
              Create New {createType === 'article' ? 'Article' : 'FAQ'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const formData = new FormData(form);
              handleCreate({
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                image: createType === 'article' ? formData.get('image') as string : undefined,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                    {createType === 'article' ? 'Title' : 'Question'}
                  </label>
                  <input 
                    name="title"
                    type="text"
                    required
                    placeholder={createType === 'article' ? 'Enter article title...' : 'Enter question...'}
                    className="w-full p-3 bg-white/30 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                    {createType === 'article' ? 'Content' : 'Answer'}
                  </label>
                  <textarea 
                    name="content"
                    rows={6}
                    required
                    placeholder={createType === 'article' ? 'Write your article content here...' : 'Write the answer here...'}
                    className="w-full p-3 bg-white/30 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                  />
                </div>
                {createType === 'article' && (
                  <div>
                    <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Cover Image URL</label>
                    <input
                      name="image"
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      className="w-full p-3 bg-white/30 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1 py-3 border border-outline-variant/30 rounded-lg font-bold text-on-surface-variant hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={actionLoading}
                    className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50"
                  >
                    {actionLoading ? 'Creating...' : `Create ${createType === 'article' ? 'Article' : 'FAQ'}`}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}