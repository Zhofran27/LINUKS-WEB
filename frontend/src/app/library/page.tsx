'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface Resource {
  id: number;
  title: string;
  description: string;
  category: string;
  readTime: string;
  image?: string;
  type: 'article' | 'emergency';
  icon: string;
}

const categories = [
  { id: 'all', label: 'All Resources', icon: 'grid_view' },
  { id: 'harassment', label: 'Sexual Harassment', icon: 'security' },
  { id: 'rights', label: 'Student Rights', icon: 'gavel' },
  { id: 'prevention', label: 'Prevention', icon: 'verified_user' },
  { id: 'mental', label: 'Mental Health', icon: 'psychology' },
];

const resources: Resource[] = [
  {
    id: 1,
    title: 'Understanding Title IX on Campus',
    description: 'A comprehensive guide to your legal protections and how to navigate institutional policies.',
    category: 'rights',
    readTime: '5 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwQBcqT_8e5iI7zaP5RT4G0fjPyXZSy0p-1nSeH35hkJtbwPE6gGVARZuJWKhpYkxEkUP4wIQXJOzKcxp8R9xsf7d5DecoJoAnyCLnihN8WxRxtUbnB790AckDSIh9FRzTAPBRWQuRdxF_5UzCtBJmuWkwyZHJ1Eqs5C3YXpcgINxe_x0O-mWFd98P090k7ocTnBS5CisWJAgtz6cPZCCJrO3B_QBOtfmLPRybEGvK64Miy0T_KwKX4K-IfGK6iY2XkMKfGhxzIemk',
    type: 'article',
    icon: 'arrow_forward',
  },
  {
    id: 2,
    title: 'Coping After an Incident',
    description: 'Finding your way back to safety through professional resources and self-care practices.',
    category: 'mental',
    readTime: '8 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZOrwdLwK4KMd1pDLMGdhV2iq7Vm94cnDEHBosDUSAemDhYvNXlwBJA1zGH3b5h32Sc3rRhJPJzIcrDEeFl1ircpfTRNv6bYkWDj_Mp4Vl-D9RG2Vjnl4dI0IYcZo95pji2Bkco2rB5Teda1NSBEpxqtkgCn68EOow-u50r1Bdv4U11QRXWYRYCMSEyY_r9ifIw-Sh3JxhtQ3kPZKqbYxXFIuordeo7kjvmPmNfR7lGBKVKpjtOU9KCZD5UyQKoNJeapXKiAWAjux-',
    type: 'article',
    icon: 'spark',
  },
  {
    id: 3,
    title: 'Consent in the Digital Age',
    description: 'Navigating boundaries, social media, and digital interactions in modern student life.',
    category: 'harassment',
    readTime: '12 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCX0iLFPv_SIzgl8iHMxqknEj-gHkt-qCXZaQGImL-_rZ00899XDaNEneJHflL9dtsx8HPUfoMotq1CUA2Enw-BBEGX8XVGy0n_bElvPx9WHbfWZ_CDacdbXT4imom8oYeloOnu85cXfWLYQ4b8Si_2_WY32z15FoHJR8gbB3oJGxykJuvH07i7adTo2-1UJd1K7W-mxL3WXPFKWu5dociBaRoFFDZDgG9ROsj__mL55lNmwMt6_IvN_Xrz6gBsgvFkgP4jbFKjWo6B',
    type: 'article',
    icon: 'policy',
  },
  {
    id: 4,
    title: 'Mindfulness for Anxiety',
    description: 'Practical exercises to ground yourself and find calm in high-stress situations.',
    category: 'mental',
    readTime: '6 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDODoMUVhOK8sqcJaWqqkKoOZhCQVVlzO3OIZCrgEwEhsZfiFPvVKySn5vCM6sgd52VUUFq0BKpjcbRjm7PT3lEfxDRfvyYoKkr6CZC8zzPAmKs__ZA1WalBQw3vV_NMEzSC5Cru_wI4KHDJWj3-jp_ZQdLBJDzvB-oIKJxtHSKtfc7rLC5aupHCtQQqvcDeQMXSByminrYtRJiN2LzoHE6xdibhtNGlzz5NGxtHo3WPv0JtiUi5rScY8B1yuiSi01LS76krds9MPTx',
    type: 'article',
    icon: 'self_improvement',
  },
  {
    id: 5,
    title: 'Active Bystander Intervention',
    description: 'Learn the 5 D\'s of bystander intervention to safely support others in your community.',
    category: 'prevention',
    readTime: '3 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG-AYpuWqfwhBhCBrBHFf_ALr7ggwmO5N3YK7qVPdK6ooqZqNnTpJ5QSbw3iLSTcsza4tyTQkSkYbfKw2CeFfOpPUJ4tPGm-blBcFgApVG7gZnTyhrvK3GL_K-_Is6IOItTklT4Za477pvwNAsM6hvO_aaF_xhei9F5LgL60U8TYd5mcU0LVQp1wGqFw66nomLFYjNYpFHAMK4q_iN_p4SzjXhY3KXweToUvvu-VFwW90TUWmHst7Tfkgq7L1a4VBGA7UK-6v0wA8X',
    type: 'article',
    icon: 'group',
  },
  {
    id: 6,
    title: 'Quick Reference: Reporting',
    description: 'Need to report something immediately? Here\'s our step-by-step secure process.',
    category: 'harassment',
    readTime: '',
    type: 'emergency',
    icon: 'bolt',
  },
];

export default function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredResources = activeCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === activeCategory);

  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent">
      {/* Navbar */}
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
          <Link href="/" className="text-on-surface-variant hover:bg-white/10 transition-colors duration-300 px-3 py-1 rounded-lg">Home</Link>
          <Link href="/library" className="text-primary font-bold border-b-2 border-primary pb-1">Library</Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant text-[24px]">notifications</span>
          </Link>
          <Link href="/login" className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-primary/30 hover:bg-primary/10 transition-colors">
            <span className="material-symbols-outlined text-primary text-[20px]">person</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-section-gap px-6 md:px-12">
        {/* Hero */}
        <section className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary mb-4">Safe Space Library</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Your sanctuary for knowledge, empowerment, and support. Explore curated resources designed to keep you safe and informed.
          </p>
        </section>

        {/* Category Filter */}
        <nav aria-label="Resource Categories" className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                px-6 py-2 rounded-full font-label-md text-label-md transition-all active:scale-95 flex items-center gap-2
                ${activeCategory === cat.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'glass-card text-on-surface-variant hover:bg-primary/10'
                }
              `}
            >
              <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Flex Grid - CENTERED with real images */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 items-start">
            {filteredResources.map((resource) => (
              <article 
                key={resource.id} 
                className={`
                  glass-card overflow-hidden group cursor-pointer
                  ${resource.type === 'emergency' 
                    ? 'w-full sm:w-[calc(40%-12px)] lg:w-[calc(33.333%-16px)]' 
                    : 'w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]'
                  }
                `}
              >
                {resource.type === 'article' ? (
                  <>
                    {resource.image ? (
                      <img 
                        src={resource.image} 
                        alt={resource.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                        <span className="material-symbols-outlined text-5xl text-primary/20">image</span>
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full font-caption text-caption">
                          {categories.find(c => c.id === resource.category)?.label}
                        </span>
                        {resource.readTime && (
                          <span className="font-caption text-caption text-on-surface-variant">{resource.readTime}</span>
                        )}
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{resource.title}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant mb-4">{resource.description}</p>
                      <span className="inline-flex items-center gap-2 text-primary font-label-md text-label-md hover:underline decoration-2">
                        Read full guide <span className="material-symbols-outlined text-[16px]">{resource.icon}</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-5 bg-primary-container/10 h-full flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-white/50 backdrop-blur-sm text-primary rounded-full font-caption text-caption">Emergency</span>
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-2">{resource.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">{resource.description}</p>
                    <button className="w-full py-3 bg-primary text-white rounded-full font-label-md text-label-md shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2">
                      Start Quick Report <span className="material-symbols-outlined">{resource.icon}</span>
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button className="glass-card w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-primary text-white font-label-md">1</button>
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center font-label-md text-on-surface-variant hover:bg-primary/10 transition-all">2</button>
            <button className="w-10 h-10 rounded-full glass-card flex items-center justify-center font-label-md text-on-surface-variant hover:bg-primary/10 transition-all">3</button>
          </div>
          <button className="glass-card w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-all">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-section-gap bg-surface-container-low border-t border-outline-variant/30">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-grid-gutter">
          <div className="flex flex-col gap-2 items-center md:items-start">
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">LINUKS</span>
            <p className="font-caption text-caption text-on-surface-variant">© 2024 LINUKS. Supporting your journey with care.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</Link>
            <Link href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Support Center</Link>
            <Link href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
          </nav>
        </div>
      </footer>

      {/* Floating Action Button */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-xl flex items-center justify-center group hover:scale-110 active:scale-95 transition-all z-[100]">
        <span className="material-symbols-outlined text-[28px]">add</span>
        <span className="absolute right-full mr-4 px-4 py-2 bg-primary text-white rounded-lg text-label-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Suggest Resource
        </span>
      </button>
    </div>
  );
}