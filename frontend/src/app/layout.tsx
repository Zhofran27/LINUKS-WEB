import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "600", "700", "800"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "LINUKS - Safe Space",
  description: "Platform pelaporan aman",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${sora.variable} ${jakarta.variable}`}>
        <Sidebar />
        <main className="lg:ml-72 min-h-screen p-8 pb-24 lg:pb-8">
          {children}
        </main>
        <MobileNav />
      </body>

      <html lang="id">
  <head>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
  </head>
  <body className={`${sora.variable} ${jakarta.variable}`}>
    ...
  </body>
</html>
    </html>
  );
}