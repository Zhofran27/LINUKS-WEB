'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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

export default function ContentManagementPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFilter, setActiveFilter] = useState<ContentType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createType, setCreateType] = useState<'article' | 'faq'>('article');

  // Mock data - nanti ganti dengan API call ke backend
  const [articles, setArticles] = useState<Article[]>([
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

  const [faqs, setFaqs] = useState<FAQItem[]>([
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

  // Aurora Mesh Gradient WebGL Shader
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const c = canvas;

    function syncSize() {
      const w = c.clientWidth || 1280;
      const h = c.clientHeight || 720;
      if (c.width !== w || c.height !== h) {
        c.width = w;
        c.height = h;
      }
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
    if (ro) ro.observe(c);
    syncSize();

    const gl = (c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = v_texCoord;
    
    // Aurora mesh gradient: Primary Pink, Lavender, Baby Blue, Peach Cream
    vec3 primaryPink = vec3(1.0, 0.36, 0.54);      // #FF5C8A
    vec3 lavender = vec3(0.91, 0.84, 1.0);          // #E9D5FF
    vec3 babyBlue = vec3(0.65, 0.71, 0.99);        // #A5B4FC
    vec3 peachCream = vec3(1.0, 0.96, 0.94);       // #FFF4EF
    
    // Animated noise for fluid movement
    float n1 = snoise(uv * 1.5 + u_time * 0.08);
    float n2 = snoise(uv * 2.0 - u_time * 0.12);
    float n3 = snoise(uv * 2.5 + u_time * 0.06);
    float n4 = snoise(uv * 1.8 - u_time * 0.1);
    
    // Smooth transitions between colors
    vec3 color = mix(primaryPink, lavender, uv.x + n1 * 0.25);
    color = mix(color, babyBlue, uv.y * 0.8 + n2 * 0.2);
    color = mix(color, peachCream, (1.0 - uv.x) * (1.0 - uv.y) * 0.6 + n3 * 0.15);
    color = mix(color, primaryPink, n4 * 0.1 + 0.05);
    
    // Soft vignette
    float vignette = 1.0 - length((uv - 0.5) * 0.8);
    color *= 0.9 + vignette * 0.1;
    
    gl_FragColor = vec4(color, 1.0);
}`;

    function cs(type: number, src: string) {
      if (!gl) throw new Error('WebGL not available');
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');

    let animationId: number;
    function render(t: number) {
      if (!ro) syncSize();
      if (!gl || !canvas) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationId = requestAnimationFrame(render);
    }
    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      if (ro) ro.disconnect();
    };
  }, []);

  const handleDeleteArticle = useCallback((id: number) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleDeleteFAQ = useCallback((id: number) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* Aurora Mesh Gradient Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        <canvas ref={canvasRef} style={{display: 'block', width: '100%', height: '100%'}} />
      </div>

      {/* Floating Blobs for extra depth */}
      <div className="fixed top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-[100px] z-0 pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-[80px] z-0 pointer-events-none"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>

      {/* Main Content */}
      <main className="min-h-screen p-grid-margin relative z-10">
        {/* Top Header */}
        <header className="flex justify-between items-center h-20 mb-8 w-full">
          <div>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight">Content Management</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">Manage articles and FAQ for the community.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </button>
            <div className="w-12 h-12 glass-card rounded-full overflow-hidden border-2 border-primary/20 flex items-center justify-center bg-primary-container/30 text-primary">
              <span className="material-symbols-outlined text-[24px]">person</span>
            </div>
          </div>
        </header>

        {/* Stats Bento */}
        <div className="grid grid-cols-12 gap-6 mb-12">
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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
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

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <div key={`${item.type}-${item.id}`} className="glass-card glass-card-hover p-5 rounded-lg flex items-center gap-6 group">
              <div className="w-24 h-16 rounded overflow-hidden bg-surface-container shrink-0 flex items-center justify-center">
                {item.type === 'article' && 'image' in item && item.image ? (
                  <img 
                    src={item.image} 
                    alt={'title' in item ? item.title : ''}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full ${item.type === 'article' ? 'bg-secondary-container/50' : 'bg-tertiary-container/50'} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-[32px] ${item.type === 'article' ? 'text-on-secondary-container' : 'text-on-tertiary-container'}`}>
                      {item.type === 'article' ? 'article' : 'help'}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${item.type === 'article' ? 'bg-secondary-container/50 text-on-secondary-container' : 'bg-tertiary-container/50 text-on-tertiary-container'} px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase`}>
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
                  className="p-2 hover:bg-error/10 rounded-full text-on-surface-variant hover:text-error transition-all"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}

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
      </main>

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
            <div className="space-y-4">
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                  {createType === 'article' ? 'Title' : 'Question'}
                </label>
                <input 
                  type="text"
                  placeholder={createType === 'article' ? 'Enter article title...' : 'Enter question...'}
                  className="w-full p-3 bg-white/30 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface-variant block mb-1">
                  {createType === 'article' ? 'Content' : 'Answer'}
                </label>
                <textarea 
                  rows={6}
                  placeholder={createType === 'article' ? 'Write your article content here...' : 'Write the answer here...'}
                  className="w-full p-3 bg-white/30 border border-outline-variant/30 rounded-lg font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
                />
              </div>
              {createType === 'article' && (
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant block mb-1">Cover Image</label>
                  <div className="border-2 border-dashed border-outline-variant/30 rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-on-surface-variant hover:border-primary/50 hover:bg-white/10 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[32px]">cloud_upload</span>
                    <span className="font-label-md text-label-md">Click to upload or drag and drop</span>
                    <span className="font-caption text-caption opacity-60">PNG, JPG up to 10MB</span>
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-3 border border-outline-variant/30 rounded-lg font-bold text-on-surface-variant hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-primary text-on-primary rounded-lg font-bold hover:shadow-lg hover:shadow-primary/20 transition-all">
                  Create {createType === 'article' ? 'Article' : 'FAQ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}