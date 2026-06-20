import GlassCard from "@/components/glass/GlassCard";
import Button from "@/components/ui/Button";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🦋</span>
          <span className="text-primary font-bold text-xs uppercase tracking-widest">Welcome Back</span>
        </div>
        <h1 className="text-4xl font-[family-name:var(--font-sora)] text-primary font-bold">
          Halo, Zhofran 🌷
        </h1>
        <p className="text-on-surface-variant mt-2">
          Senang melihatmu kembali. Ini adalah ruang amanmu.
        </p>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard className="p-6" hover>
          <h2 className="text-xl font-[family-name:var(--font-sora)] font-bold text-on-surface mb-2">
            Butuh tempat bercerita?
          </h2>
          <p className="text-on-surface-variant text-sm mb-4">
            Laporanmu akan diproses dengan kerahasiaan penuh.
          </p>
          <Button variant="primary">Buat Laporan Baru</Button>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-[family-name:var(--font-sora)] font-bold text-on-surface mb-4">
            Status Laporan
          </h3>
          <div className="p-4 rounded-xl bg-surface-container-low border border-white/40">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">Laporan #429</span>
              <span className="px-2 py-0.5 rounded-full bg-secondary-container text-secondary text-[10px] font-bold">
                DIPROSES
              </span>
            </div>
            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary w-2/3"></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-[family-name:var(--font-sora)] font-bold text-on-surface mb-2">
            Safe Library
          </h3>
          <p className="text-on-surface-variant text-sm mb-4">
            Edukasi dan dukungan mental.
          </p>
          <Button variant="outline" size="sm">Buka Perpustakaan</Button>
        </GlassCard>
      </div>
    </div>
  );
}