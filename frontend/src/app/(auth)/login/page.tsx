import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-purple-300 flex items-center justify-center p-6">

      {/* Card utama */}
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

        {/* ============================
            KOLOM KIRI — Branding
        ============================ */}
        <div className="hidden md:flex flex-col items-center justify-center p-10 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">

          {/* Dekoratif blur background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60" />

          {/* Logo + Teks */}
          <div className="relative z-10 flex flex-col items-center gap-2 text-center scale-150 mb-8">
            <Image
              src="/logo.png"
              alt="LINUKS Logo"
              width={280}
              height={280}
              className="object-contain drop-shadow-xl w-full max-w-[200px] scale-150"
            />
            <h3 className="text-4xl font-bold text-pink-500 tracking-wide -mt-4">LINUKS</h3>
            <p className="text-sm text-gray-400 leading-relaxed max-w-[200px]">
              Perlindungan & Pencegahan Kekerasan Seksual
            </p>
          </div>

        </div>

        {/* ============================
            KOLOM KANAN — Form
        ============================ */}
        <div className="flex flex-col justify-center px-8 md:px-10 py-10 bg-white">

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Selamat Datang di Ruang Amanmu 🦋</h2>
          </div>

          {/* Form */}
          <LoginForm />

          {/* Link ke Register */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Belum punya akun?{' '}
            <Link href="/register" className="text-pink-500 font-semibold hover:underline">
              Daftar sekarang
            </Link>
          </p>

        </div>
      </div>

      {/* Footer bawah */}
      {/* <div className="absolute bottom-4 flex gap-6 text-xs text-gray-400">
        <span>Privacy Policy</span>
        <span>Safety Guidelines</span>
        <span>Support</span>
      </div> */}

    </main>
  );
}