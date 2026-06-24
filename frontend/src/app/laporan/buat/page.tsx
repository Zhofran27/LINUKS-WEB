import CreateLaporanForm from '@/components/laporan/CreateLaporanForm';

export default function BuatLaporanPage() {
  return (
    <div className="max-w-lg mx-auto pb-24 lg:pb-0">
      <div className="glass-card p-6 md:p-8">
        <CreateLaporanForm />
      </div>
    </div>
  );
}