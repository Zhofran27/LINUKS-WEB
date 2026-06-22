export default function Dashboard() {
  return (
    <div className="space-y-16 max-w-7xl mx-auto pb-24 lg:pb-0">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl butterfly-float">🦋</span>
            <span className="text-primary font-bold tracking-widest text-[10px] uppercase">
              Welcome Back
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-primary leading-tight">
            Halo, Zhofran 🌷
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2 max-w-md">
            Senang melihatmu kembali. Ingat, ini adalah ruang amanmu untuk berbagi dan bertumbuh.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="p-3 glass-card text-primary active:scale-90">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-3 glass-card text-primary active:scale-90">
            <span className="material-symbols-outlined">search</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-grid-gutter pb-section-gap">
        <section className="md:col-span-6 lg:col-span-8 group">
          <div className="glass-card p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-white/60 to-primary-container/20 border-primary/20">
            <div className="absolute -right-10 -top-10 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[200px]" style={{fontVariationSettings: "'FILL' 1"}}>edit_document</span>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
                <span className="material-symbols-outlined text-lg">security</span>
                <span className="text-xs font-bold">AKSI CEPAT</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-4">
                Butuh tempat bercerita?
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-sm mb-8">
                Laporanmu akan diproses dengan kerahasiaan penuh oleh tim profesional kami yang berempati.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <button className="px-8 py-4 bg-primary text-white rounded-full font-bold flex items-center gap-3 shadow-xl glow-pink transition-all active:scale-95">
                <span>Buat Laporan Baru</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
              <span className="font-caption text-on-surface-variant italic">
                ✨ Privasimu adalah prioritas kami
              </span>
            </div>
          </div>
        </section>

        <section className="md:col-span-3 lg:col-span-4">
          <div className="glass-card p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Status Laporan</h3>
              <span className="material-symbols-outlined text-primary">analytics</span>
            </div>
            <div className="flex-grow flex flex-col gap-4">
              <div className="p-4 rounded-[2rem] bg-surface-container-low border border-white/40">
                <div className="flex justify-between mb-2">
                  <span className="font-label-md text-label-md">Laporan #429</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-container text-secondary text-xs font-bold">
                    DIPROSES
                  </span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary w-2/3"></div>
                </div>
                <p className="font-caption text-on-surface-variant mt-2">
                  Sedang ditinjau oleh Konselor
                </p>
              </div>
              <div className="p-4 rounded-[2rem] bg-white/20 border border-white/10 flex items-center justify-center border-dashed">
                <span className="font-caption text-on-surface-variant">
                  Belum ada laporan aktif lainnya
                </span>
              </div>
            </div>
            <button className="mt-4 text-primary font-bold font-label-md hover:underline flex items-center gap-1">
              Lihat Riwayat <span className="material-symbols-outlined text-base">open_in_new</span>
            </button>
          </div>
        </section>

        <section className="md:col-span-3 lg:col-span-4">
          <div className="glass-card p-6 flex flex-col relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-8xl opacity-10 butterfly-float">🌸</div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Safe Library</h3>
            <p className="font-caption text-on-surface-variant mb-6">
              Edukasi dan dukungan mental di genggamanmu.
            </p>
            <div className="space-y-4">
              <div className="flex gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD6RHbzLtXBgXiSG_-T0UsamMGprHfH5Tz-IkttNU4IJFY69CEge7fcMn-2Imtr-6NTnlxnwasaz4AUqO0-f_BNJ2NsCf18AoaOKSl9Ry2bavgQN1J8feEFcXMw-HcrHTnM4b6dXvTokYakjrFZmmziPCO6lYvdLoQUL53pIbIuZImLy_KdVLlbnvCNHHiEddG7i9rCuqO51xiIY-Nlb-er9SGBBkpWLlmDv5clsyNhVbZnMFxqpDM6ipoLabRO5MiXqXil6CzzjNl" />
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md group-hover:text-primary transition-colors">
                    Self-Care 101
                  </span>
                  <span className="font-caption text-on-surface-variant">5 min read • ✨ Tips</span>
                </div>
              </div>
              <div className="flex gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBApaQZbW-OL7bY4f8AWYQUqjbL0dNlHyz5TQ0xabA5_4JdqRLkemCQRlkTMsY5-t0BCz4RJje7ppJctVPw9auoEsMg7voA-dwSz5Tukt2ouOnNu7aJcZHu_iqVavyvHy9YOKT9EQna2dqdNFIB7w4Da-bZRl5P3bS5V7lScxjlnvn_8cGQR59t7tzMWOS-P9OgioI_YPMVhKCtU2hjFc6BNuUhsvmX0pKCn3x5nefCNEMV0PYJyPIRM3W_g9v41xfhIyZeKyH3nTQZ" />
                </div>
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md group-hover:text-primary transition-colors">
                    Batas Sehat
                  </span>
                  <span className="font-caption text-on-surface-variant">8 min read • 🛡️ Safe</span>
                </div>
              </div>
            </div>
            <button className="mt-6 w-full py-3 border border-primary/20 rounded-full text-primary font-bold font-label-md hover:bg-primary/5 transition-colors">
              Buka Perpustakaan
            </button>
          </div>
        </section>

        <section className="md:col-span-6 lg:col-span-5">
          <div className="glass-card p-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-6">Aktivitas Terbaru</h3>
            <div className="space-y-6">
              <div className="flex gap-4 relative">
                <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-outline-variant"></div>
                <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-secondary flex-shrink-0 relative z-10">
                  <span className="material-symbols-outlined text-xl">assignment_turned_in</span>
                </div>
                <div className="pb-2">
                  <p className="font-body-md font-bold">Laporan Diperbarui</p>
                  <p className="font-caption text-on-surface-variant">Tim LINUKS sedang meninjau dokumenmu.</p>
                  <p className="text-xs text-outline mt-1 uppercase font-bold">2 Jam yang lalu</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-outline-variant"></div>
                <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary flex-shrink-0 relative z-10">
                  <span className="material-symbols-outlined text-xl">auto_stories</span>
                </div>
                <div className="pb-2">
                  <p className="font-body-md font-bold">Membaca Artikel</p>
                  <p className="font-caption text-on-surface-variant">Kamu baru saja menyelesaikan &quot;Meditasi 101&quot;.</p>
                  <p className="text-xs text-outline mt-1 uppercase font-bold">Kemarin</p>
                </div>
              </div>
              <div className="flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary flex-shrink-0 relative z-10">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </div>
                <div className="pb-2">
                  <p className="font-body-md font-bold">Welcome aboard!</p>
                  <p className="font-caption text-on-surface-variant">Zhofran, selamat datang di komunitas LINUKS.</p>
                  <p className="text-xs text-outline mt-1 uppercase font-bold">3 hari yang lalu</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="md:col-span-6 lg:col-span-3 flex flex-col gap-grid-gutter">
          <div className="glass-card p-6 flex-grow bg-white/30 border-white/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">quiz</span>
              </div>
              <h4 className="font-bold text-on-surface">FAQ</h4>
            </div>
            <p className="font-caption text-on-surface-variant">Pertanyaan seputar privasi & cara penggunaan.</p>
            <a href="#" className="inline-flex items-center gap-1 text-tertiary font-bold mt-4 font-label-md group">
              Cari Jawaban <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </a>
          </div>
          <div className="glass-card p-6 flex-grow bg-white/20 border-white/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">support_agent</span>
              </div>
              <h4 className="font-bold text-on-surface">Dukungan</h4>
            </div>
            <p className="font-caption text-on-surface-variant">Butuh bantuan teknis atau bantuan langsung?</p>
            <a href="#" className="inline-flex items-center gap-1 text-primary font-bold mt-4 font-label-md group">
              Hubungi Kami <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">chat_bubble</span>
            </a>
          </div>
        </section>
      </div>

      <footer className="w-full py-section-gap border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-grid-gutter mt-12 relative z-10">
        <div>
          <span className="font-headline-sm text-headline-sm text-on-surface mb-2 block">LINUKS</span>
          <p className="font-caption text-caption text-on-surface-variant opacity-70">© 2024 LINUKS. Supporting your journey with care.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Safety Guidelines</a>
          <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Support Center</a>
          <a href="#" className="font-caption text-caption text-on-surface-variant hover:text-primary transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}