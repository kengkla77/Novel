import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { Providers } from "./components/Providers"; // 👈 1. Import

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export const metadata: Metadata = {
  title: "MyNovel - เว็บอ่านนิยายออนไลน์",
  description: "คลังนิยายคุณภาพที่คุณเขียนเองได้",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 👇 2. เพิ่ม suppressHydrationWarning
    <html lang="th" suppressHydrationWarning>
      
      {/* 👇 3. เพิ่ม class dark:bg... และ dark:text... */}
      <body className={`${prompt.className} antialiased bg-[#FDFBF7] dark:bg-[#1a1b26] text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
        
        {/* 👇 4. ห่อด้วย Providers */}
        <Providers>
          <Navbar />
          <div className="pt-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}