export const STATUS_MAP: Record<number, {
  label: string;
  color: string;
  bg: string;
  icon: string;
  progress: number;
  keterangan: string;
}> = {
  1: { label: 'Menunggu Verifikasi', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: 'schedule', progress: 15, keterangan: 'Laporanmu sudah diterima dan sedang dalam antrian verifikasi.' },
  2: { label: 'Perlu Klarifikasi', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', icon: 'help', progress: 30, keterangan: 'Tim kami memerlukan informasi atau dokumen tambahan darimu.' },
  3: { label: 'Dalam Proses', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: 'sync', progress: 60, keterangan: 'Laporanmu sedang aktif ditinjau oleh tim profesional kami.' },
  4: { label: 'Diteruskan Satgas', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: 'groups', progress: 85, keterangan: 'Laporan telah diteruskan ke Satgas untuk penanganan lebih lanjut.' },
  5: { label: 'Selesai', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: 'check_circle', progress: 100, keterangan: 'Laporan telah selesai ditangani. Terima kasih atas kepercayaanmu.' },
  6: { label: 'Ditolak', color: 'text-red-700', bg: 'bg-red-50 border-red-200', icon: 'cancel', progress: 0, keterangan: 'Laporan tidak dapat diproses. Hubungi kami jika ada pertanyaan.' },
};

export const STATUS_OPTIONS = [
  'Menunggu Verifikasi',
  'Perlu Klarifikasi',
  'Diproses',
  'Diteruskan ke Satgas',
  'Selesai',
  'Ditolak',
];

export const STATUS_STYLE: Record<string, string> = {
  'Menunggu Verifikasi': 'bg-amber-100 text-amber-700 border-amber-200',
  'Perlu Klarifikasi': 'bg-orange-100 text-orange-700 border-orange-200',
  'Diproses': 'bg-blue-100 text-blue-700 border-blue-200',
  'Diteruskan ke Satgas': 'bg-purple-100 text-purple-700 border-purple-200',
  'Selesai': 'bg-green-100 text-green-700 border-green-200',
  'Ditolak': 'bg-red-100 text-red-700 border-red-200',
};

export const PRIORITY_MAP: Record<string, { label: string; style: string }> = {
  'Menunggu Verifikasi': { label: 'Tinggi', style: 'text-red-500 bg-red-50' },
  'Perlu Klarifikasi': { label: 'Tinggi', style: 'text-red-500 bg-red-50' },
  'Diproses': { label: 'Sedang', style: 'text-amber-600 bg-amber-50' },
  'Diteruskan ke Satgas': { label: 'Sedang', style: 'text-amber-600 bg-amber-50' },
  'Selesai': { label: 'Rendah', style: 'text-green-600 bg-green-50' },
  'Ditolak': { label: 'Rendah', style: 'text-green-600 bg-green-50' },
};

export const USER_TIMELINE_STEPS = [
  { status_id: 1, label: 'Laporan Diterima', icon: 'assignment_turned_in' },
  { status_id: 2, label: 'Perlu Klarifikasi', icon: 'help_outline' },
  { status_id: 3, label: 'Sedang Ditinjau', icon: 'manage_search' },
  { status_id: 4, label: 'Diteruskan ke Satgas', icon: 'groups' },
  { status_id: 5, label: 'Selesai', icon: 'verified' },
];

export const ADMIN_TIMELINE_STEPS = [
  { status: 'Menunggu Verifikasi', label: 'Laporan Diterima', icon: 'assignment_turned_in' },
  { status: 'Perlu Klarifikasi', label: 'Perlu Klarifikasi', icon: 'help_outline' },
  { status: 'Diproses', label: 'Sedang Ditinjau', icon: 'manage_search' },
  { status: 'Diteruskan ke Satgas', label: 'Diteruskan ke Satgas', icon: 'groups' },
  { status: 'Selesai', label: 'Selesai', icon: 'verified' },
];
