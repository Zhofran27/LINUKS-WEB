'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

interface Book {
  id: string;
  title: string;
  authors: string[];
  thumbnail: string;
  category: string;
}

const libraryBooks: Book[] = [
  {
    id: '1',
    title: '5 Cara Mengelola Kecemasan Hari Ini',
    authors: ['Dr. Sarah Wijaya'],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBC8lcEj4lgYORw1PmTvHNAFGBEu4f-sAcv6D1GAthzCWGDRJJsjuktK1i-_5ZIOwKJx6rZcON1HqIyuj_nmfil_9fGQebxNT9U8fP6ZqUjiPyHbTLBYb4I5-KrTlT_pLastMYHDDO8R2DDi6Tdz6ZQ8UQtyvX3vG8KP8eWcMCB_jNjlsF4XGwaXmkBjq0VMCYPZMeE6xfINDnzYY2oqu6cs2HT_M14O08Lp-dxwWLi0HqX68XP5Fo0TuSGk94cPka9CiaUICkVxIRs',
    category: 'Mental Health',
  },
  {
    id: '2',
    title: 'Journaling Sebagai Terapi Mandiri',
    authors: ['Rina Andari, M.Psi'],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDha6LjwUHl2y7x52_pkOFuhBUu0KEKF3ZUephmMc8moCwrTMGRsnaH-ABDTi9O46u1cVNb16D3YmbGEUPqYxXbM9QYoqcNcCOpRjYePoteMS-C0LRo0-7gaFIZ7bRxrXyowskOZ5GppczKEkXmJZoTLh7NExwfupuzOwWc8HU_V1dVWwN_ly7auxRHrG3Q81T1_pNWlQiTc-P87jR8V13nAZU_zn5U_0weyKzf_JZGuHQKqlAJM4cQfNcvaNjgra5CROekRy36FP-Z',
    category: 'Self Care',
  },
  {
    id: '3',
    title: 'Pahami Hakmu di Mata Hukum',
    authors: ['LBH Jakarta'],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdOzfL4fXzkJ3Ci71XHqgTdrpNkJL5O070CWILWc1aBC9Qx8becDoYjHE10mWXoG2CJvAA8Jsyf3i_pbthWty--Lv7lkRYCdkOUGaatXsg-2cCrvGcCGFe6Kay2tryLxhY9QTZAC8dNBi6LWfG1wWYac5WkzpxGBhW65nSVqer9T_jWKuSTb8GcB_L-tRCEAmG1PUtnTe5ulmjVEHJjIJzP7NyX2rKNreIXYebOW2git4YkZjQjex3m_WBvsFqxuDEoKknayaqnn7J',
    category: 'Legal Info',
  },
  {
    id: '4',
    title: 'Kisah Mereka yang Telah Bangkit',
    authors: ['Tim LINUKS'],
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBL3qpVjQYG9T3NCdHt6gxSh3SC-VFybxuX00HpyndCBg3OaSvrUpe3Xc9bJHGDu0TYumPj8LA8awf-A4suUIfnf2XC3g207-7X_QLzpKplf-IEZOD-ji6NFcLyFF6wvOoCTtOC4LxoGBoP1lrvv2P6iTcidjq4r1s3So7e2hJWhxd6aYKKQ1XxyHJBUJ3uLZIk5O_sMIZNb79ge9oWFB-7VqJqe502RtCd1rO-pl14mS1-_KG3D3ZJkEfqyzyPdMp3mhtNTlvS0uG-',
    category: 'Community',
  },
];

export default function LandingPage() {
  const solusiRef = useRef<HTMLDivElement>(null);

  const scrollToSolusi = () => {
    solusiRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const canvas = document.getElementById('shader-canvas-landing') as HTMLCanvasElement;
    if (!canvas) return;

    function syncSize() {
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(syncSize) : null;
    if (ro) ro.observe(canvas);
    syncSize();

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
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
    float n1 = snoise(uv * 1.5 + u_time * 0.1);
    float n2 = snoise(uv * 2.0 - u_time * 0.15);
    float n3 = snoise(uv * 3.0 + u_time * 0.05);
    vec3 pink = vec3(1.0, 0.36, 0.54);
    vec3 lavender = vec3(0.91, 0.84, 1.0);
    vec3 babyBlue = vec3(0.65, 0.71, 0.99);
    vec3 peach = vec3(1.0, 0.96, 0.94);
    vec3 color = mix(pink, lavender, uv.x + n1 * 0.2);
    color = mix(color, babyBlue, uv.y + n2 * 0.2);
    color = mix(color, peach, (1.0 - uv.x) * (1.0 - uv.y) + n3 * 0.2);
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

  return (
    <div className="min-h-screen overflow-x-hidden landing-page">
      <div className="fixed inset-0 w-full h-full z-0" style={{display: 'block'}}>
        <canvas id="shader-canvas-landing" style={{display: 'block', width: '100%', height: '100%'}} />
      </div>

      {/* Navbar: HAPUS REPORTS */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/20 backdrop-blur-xl border-b border-white/30 shadow-[0_8px_32px_0_rgba(53,9,41,0.05)] h-20 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image 
            alt="LINUKS Logo" 
            className="h-16 w-16 object-contain" 
            src="/logo.png" 
            width={64} 
            height={64} 
          />
          <span className="font-display-lg-mobile text-display-lg-mobile font-extrabold text-primary tracking-tighter">LINUKS</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
          <Link href="/" className="text-primary font-bold border-b-2 border-primary pb-1">Home</Link>
          <Link href="/library" className="text-on-surface-variant hover:bg-white/10 transition-colors duration-300 px-3 py-1 rounded-lg">Library</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">notifications</span>
          </Link>
          <Link 
            href="/login" 
            className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary/30 hover:bg-primary/10 transition-colors"
          >
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </Link>
        </div>
      </nav>

      <header className="pt-40 pb-24 px-6 md:px-12 relative overflow-hidden z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-primary font-label-md mb-8">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            <span>Pendamping Digital Setia Kamu 🦋</span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6 leading-tight">
            Safe. Seen. <span className="text-primary">Supported.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-12 max-w-2xl mx-auto">
            Ruang aman untuk bercerita, melapor, dan mendapatkan dukungan tanpa takut dihakimi. Identitasmu, kendalimu. ✨
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-label-md rounded-full hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3)]"
            >
              Cerita Sekarang
              <span className="material-symbols-outlined">send</span>
            </Link>
            <button 
              onClick={scrollToSolusi}
              className="w-full sm:w-auto px-8 py-4 glass-card text-primary font-label-md rounded-full hover:bg-white/60 active:scale-95 transition-all"
            >
              Pelajari LINUKS
            </button>
          </div>
        </div>
      </header>

      <section ref={solusiRef} className="py-section-gap px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="font-headline-md text-headline-md text-on-background mb-4">Solusi Aman Untukmu</h2>
            <p className="text-on-surface-variant">Kami merancang fitur yang memprioritaskan privasi dan kesehatan mentalmu.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-grid-gutter">
            <div className="md:col-span-8 glass-card p-component-padding rounded-lg flex flex-col justify-between group hover:translate-y-[-4px] transition-all">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                <span className="material-symbols-outlined text-[32px]">visibility_off</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm mb-2">Anonymous Reporting</h3>
                <p className="text-on-surface-variant">Laporkan kejadian dengan aman. Identitasmu sepenuhnya terlindungi dengan enkripsi tingkat lanjut.</p>
              </div>
              <div className="mt-8 flex justify-end">
                <span className="material-symbols-outlined text-primary-fixed-dim opacity-0 group-hover:opacity-100 transition-opacity">arrow_forward</span>
              </div>
            </div>
            <div className="md:col-span-4 glass-card p-component-padding rounded-lg bg-tertiary-container/20 group hover:translate-y-[-4px] transition-all">
              <div className="w-14 h-14 bg-tertiary/10 rounded-full flex items-center justify-center text-tertiary mb-6">
                <span className="material-symbols-outlined text-[32px]">verified_user</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-2">Secure Evidence</h3>
              <p className="text-on-surface-variant">Simpan bukti digital dalam brankas awan yang aman dan tidak terlacak.</p>
            </div>
            <div className="md:col-span-4 glass-card p-component-padding rounded-lg group hover:translate-y-[-4px] transition-all">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center text-secondary mb-6">
                <span className="material-symbols-outlined text-[32px]">query_stats</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm mb-2">Report Tracking</h3>
              <p className="text-on-surface-variant">Pantau status laporanmu secara real-time melalui dashboard privat.</p>
            </div>
            <div className="md:col-span-8 glass-card p-component-padding rounded-lg bg-primary-container/10 group hover:translate-y-[-4px] transition-all">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
                    <span className="material-symbols-outlined text-[32px]">auto_stories</span>
                  </div>
                  <h3 className="font-headline-sm text-headline-sm mb-2">Educational Resources</h3>
                  <p className="text-on-surface-variant">Pelajari hak-hakmu dan dapatkan panduan hukum serta dukungan psikis dari ahlinya.</p>
                </div>
                <div className="w-full md:w-48 h-32 glass-card rounded-lg flex items-center justify-center overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1491841550275-ad7854e35ca6?w=400&h=300&fit=crop" alt="Educational resources" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-gap px-6 md:px-12 bg-white/30 backdrop-blur-sm relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-md text-headline-md text-on-background mb-4">Empat Langkah Menuju Aman</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            <div className="hidden md:block absolute top-10 left-0 w-full h-[2px] bg-outline-variant/30 -z-10"></div>
            <div className="text-center group">
              <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">forum</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-sm mb-2">Ceritakan</h4>
              <p className="text-on-surface-variant text-sm">Bagikan pengalamanmu dengan panduan sistem AI yang empatik.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-6 text-tertiary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">shield</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-sm mb-2">Lindungi</h4>
              <p className="text-on-surface-variant text-sm">Amankan identitas dan bukti penting dalam satu langkah mudah.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-6 text-secondary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">speed</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-sm mb-2">Pantau</h4>
              <p className="text-on-surface-variant text-sm">Lihat perkembangan laporanmu tanpa perlu menghubungi admin manual.</p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 glass-card rounded-full flex items-center justify-center mx-auto mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">favorite</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm text-sm mb-2">Dampingi</h4>
              <p className="text-on-surface-variant text-sm">Dapatkan dukungan psikologis dan hukum dari partner LINUKS.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-gap px-6 md:px-12 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto glass-card p-12 rounded-xl flex flex-col md:flex-row items-center justify-around gap-12 border-primary/20">
          <div className="text-center">
            <div className="text-display-lg-mobile md:text-display-lg font-extrabold text-primary mb-2">5000+</div>
            <div className="text-on-surface-variant font-label-md uppercase tracking-widest">Jiwa Terbantu</div>
          </div>
          <div className="hidden md:block w-[1px] h-20 bg-outline-variant/30"></div>
          <div className="text-center">
            <div className="text-display-lg-mobile md:text-display-lg font-extrabold text-tertiary mb-2">100%</div>
            <div className="text-on-surface-variant font-label-md uppercase tracking-widest">Privasi Terjaga</div>
          </div>
          <div className="hidden md:block w-[1px] h-20 bg-outline-variant/30"></div>
          <div className="text-center">
            <div className="text-display-lg-mobile md:text-display-lg font-extrabold text-secondary mb-2">24/7</div>
            <div className="text-on-surface-variant font-label-md uppercase tracking-widest">Dukungan Siap</div>
          </div>
        </div>
      </section>

      {/* SAFE SPACE LIBRARY — DENGAN FOTO ASLI DARI ACUAN */}
      <section className="py-section-gap px-6 md:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-background mb-2">Safe Space Library</h2>
              <p className="text-on-surface-variant">Temukan artikel dan motivasi untuk perjalanan penyembuhanmu.</p>
            </div>
            <Link href="/library" className="hidden md:flex items-center gap-2 text-primary font-bold group">
              Lihat Semua
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
            </Link>
          </div>

          <div className="pinterest-grid">
            {/* Card 1 — Mental Health */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 group cursor-pointer">
              <img 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC8lcEj4lgYORw1PmTvHNAFGBEu4f-sAcv6D1GAthzCWGDRJJsjuktK1i-_5ZIOwKJx6rZcON1HqIyuj_nmfil_9fGQebxNT9U8fP6ZqUjiPyHbTLBYb4I5-KrTlT_pLastMYHDDO8R2DDi6Tdz6ZQ8UQtyvX3vG8KP8eWcMCB_jNjlsF4XGwaXmkBjq0VMCYPZMeE6xfINDnzYY2oqu6cs2HT_M14O08Lp-dxwWLi0HqX68XP5Fo0TuSGk94cPka9CiaUICkVxIRs"
                alt="5 Cara Mengelola Kecemasan"
              />
              <div className="p-4">
                <h4 className="font-label-md text-primary mb-1">MENTAL HEALTH</h4>
                <p className="font-bold">5 Cara Mengelola Kecemasan Hari Ini</p>
              </div>
            </div>

            {/* Card 2 — Self Care */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 group cursor-pointer">
              <img 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDha6LjwUHl2y7x52_pkOFuhBUu0KEKF3ZUephmMc8moCwrTMGRsnaH-ABDTi9O46u1cVNb16D3YmbGEUPqYxXbM9QYoqcNcCOpRjYePoteMS-C0LRo0-7gaFIZ7bRxrXyowskOZ5GppczKEkXmJZoTLh7NExwfupuzOwWc8HU_V1dVWwN_ly7auxRHrG3Q81T1_pNWlQiTc-P87jR8V13nAZU_zn5U_0weyKzf_JZGuHQKqlAJM4cQfNcvaNjgra5CROekRy36FP-Z"
                alt="Journaling Sebagai Terapi"
              />
              <div className="p-4">
                <h4 className="font-label-md text-secondary mb-1">SELF CARE</h4>
                <p className="font-bold">Journaling Sebagai Terapi Mandiri</p>
              </div>
            </div>

            {/* Card 3 — Quote */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 group cursor-pointer">
              <div className="bg-primary/10 p-8 flex flex-col items-center justify-center text-center min-h-[200px]">
                <span className="material-symbols-outlined text-[48px] text-primary mb-4">format_quote</span>
                <p className="italic text-lg font-headline-sm mb-4">"Kamu tidak sendirian. Keberanianmu adalah awal dari cahaya."</p>
                <span className="text-caption">- Community Note</span>
              </div>
            </div>

            {/* Card 4 — Legal Info */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 group cursor-pointer">
              <img 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdOzfL4fXzkJ3Ci71XHqgTdrpNkJL5O070CWILWc1aBC9Qx8becDoYjHE10mWXoG2CJvAA8Jsyf3i_pbthWty--Lv7lkRYCdkOUGaatXsg-2cCrvGcCGFe6Kay2tryLxhY9QTZAC8dNBi6LWfG1wWYac5WkzpxGBhW65nSVqer9T_jWKuSTb8GcB_L-tRCEAmG1PUtnTe5ulmjVEHJjIJzP7NyX2rKNreIXYebOW2git4YkZjQjex3m_WBvsFqxuDEoKknayaqnn7J"
                alt="Pahami Hakmu"
              />
              <div className="p-4">
                <h4 className="font-label-md text-tertiary mb-1">LEGAL INFO</h4>
                <p className="font-bold">Pahami Hakmu di Mata Hukum</p>
              </div>
            </div>

            {/* Card 5 — Community */}
            <div className="glass-card rounded-2xl overflow-hidden mb-6 group cursor-pointer">
              <img 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBL3qpVjQYG9T3NCdHt6gxSh3SC-VFybxuX00HpyndCBg3OaSvrUpe3Xc9bJHGDu0TYumPj8LA8awf-A4suUIfnf2XC3g207-7X_QLzpKplf-IEZOD-ji6NFcLyFF6wvOoCTtOC4LxoGBoP1lrvv2P6iTcidjq4r1s3So7e2hJWhxd6aYKKQ1XxyHJBUJ3uLZIk5O_sMIZNb79ge9oWFB-7VqJqe502RtCd1rO-pl14mS1-_KG3D3ZJkEfqyzyPdMp3mhtNTlvS0uG-"
                alt="Kisah Mereka"
              />
              <div className="p-4">
                <h4 className="font-label-md text-primary mb-1">COMMUNITY</h4>
                <p className="font-bold">Kisah Mereka yang Telah Bangkit</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-section-gap px-6 md:px-12 bg-white/30 backdrop-blur-sm relative z-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-md text-headline-md text-center mb-12">Pertanyaan Populer</h2>
          <div className="space-y-4">
            <details className="glass-card rounded-lg p-6 group cursor-pointer">
              <summary className="flex justify-between items-center font-bold list-none">
                <span>Apakah data saya benar-benar aman?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-on-surface-variant">Ya, LINUKS menggunakan enkripsi end-to-end. Bahkan tim kami tidak dapat melihat identitasmu jika kamu memilih untuk tetap anonim.</p>
            </details>
            <details className="glass-card rounded-lg p-6 group cursor-pointer">
              <summary className="flex justify-between items-center font-bold list-none">
                <span>Bagaimana cara LINUKS membantu proses hukum?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-on-surface-variant">Kami bekerja sama dengan LBH dan konsultan hukum untuk memastikan bukti yang kamu simpan valid dan siap digunakan jika kamu memutuskan untuk melapor ke polisi.</p>
            </details>
            <details className="glass-card rounded-lg p-6 group cursor-pointer">
              <summary className="flex justify-between items-center font-bold list-none">
                <span>Berapa biaya untuk menggunakan LINUKS?</span>
                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <p className="mt-4 text-on-surface-variant">Layanan dasar pelaporan dan pendampingan LINUKS sepenuhnya gratis untuk penyintas.</p>
            </details>
          </div>
        </div>
      </section>

      <footer className="w-full py-section-gap bg-surface-container-low border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center px-6 md:px-12 gap-grid-gutter relative z-10">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex items-center gap-2">
            <Image alt="LINUKS Logo" className="h-8 w-8" src="/logo.png" width={32} height={32} />
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">LINUKS</span>
          </div>
          <p className="font-caption text-caption text-on-surface-variant max-w-xs text-center md:text-left">
            © 2024 LINUKS. Supporting your journey with care. 🦋✨
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-6 font-caption text-caption">
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors">Support Center</Link>
          <Link href="#" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}