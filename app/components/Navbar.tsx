// app/components/Navbar.tsx
import Link from 'next/link'
import { auth, signOut } from '@/auth'
import ThemeToggle from './ThemeToggle'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Navbar() {
  const session = await auth()

  let user = null
  if (session?.user?.id) {
    user = await prisma.user.findUnique({
      where: { id: Number(session.user.id) }
    })
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#1a1b26]/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent hover:opacity-80 transition">
              📚 MyNovel
            </Link>
          </div>

          <div className="flex items-center gap-4">

            <ThemeToggle />

            {user ? (
              <>
                {/* ปุ่ม Admin */}
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin/topup"
                    className="hidden md:flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 shadow-md shadow-red-200 dark:shadow-none transition transform hover:-translate-y-0.5"
                  >
                    <span>🛡️</span> แอดมิน
                  </Link>
                )}

                {/* ปุ่มเขียนนิยาย */}
                <Link
                  href="/novel/create"
                  className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-indigo-700 hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  <span>✍️</span> เขียนเรื่องใหม่
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">

                  {/* 1. ส่วนแสดงเหรียญ (ย้ายออกมาอยู่นอก Link Profile) */}
                  <Link 
                    href="/coin/topup" 
                    className="hidden md:flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1.5 rounded-full border border-yellow-200 dark:border-yellow-700 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 hover:scale-105 transition transform cursor-pointer group/coin"
                    title="เติมเหรียญ"
                  >
                    <span className="text-yellow-600 dark:text-yellow-400 text-sm group-hover/coin:rotate-12 transition">🪙</span>
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
                      {user.coins.toLocaleString()}
                    </span>
                    <span className="w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-[10px] ml-1">+</span>
                  </Link>

                  {/* 2. ส่วน Profile (มีชื่อ + รูป) */}
                  <Link href="/profile" className="flex items-center gap-3 group ml-2" title="ไปที่โปรไฟล์ของฉัน">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                        {user.username || user.email.split('@')[0]}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'นักเขียน'}
                      </p>
                    </div>

                    {/* Avatar */}
                    <div className="h-9 w-9 rounded-full overflow-hidden shadow-md group-hover:ring-2 group-hover:ring-indigo-300 dark:group-hover:ring-indigo-500 transition relative bg-slate-200 dark:bg-slate-700">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {(user.username?.[0] || user.email?.[0] || 'U').toUpperCase()}
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* ปุ่ม Logout */}
                  <form
                    action={async () => {
                      'use server'
                      await signOut()
                    }}
                  >
                    <button className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full" title="ออกจากระบบ">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              // กรณี Guest
              <div className="flex gap-3">
                <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium px-3 py-2 text-sm transition">
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="bg-slate-900 dark:bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 shadow-lg transition">
                  สมัครสมาชิก
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}