// app/login/page.tsx
'use client'

import { useActionState } from 'react'
import { authenticate } from '@/app/actions'
import Link from 'next/link'

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#111] relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Login Card */}
      <div className="max-w-md w-full bg-white/80 dark:bg-[#1e1e1e]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 relative z-10 transition-colors">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">ยินดีต้อนรับกลับ!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">กรอกข้อมูลเพื่อเข้าสู่โลกนิยายของคุณ</p>
        </div>

        <form action={formAction} className="space-y-5">
          
          {/* 👇 ส่วนที่แก้ไข: Username / Email Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">
              ชื่อผู้ใช้ หรือ อีเมล
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                name="identifier" // ✅ เปลี่ยนชื่อ field เป็น identifier
                type="text"       // ✅ เปลี่ยนเป็น text เพื่อให้พิมพ์ชื่อได้
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="username หรือ name@example.com" 
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1 ml-1">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">รหัสผ่าน</label>
              <a href="#" className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">ลืมรหัสผ่าน?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                name="password" 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="••••••••" 
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 animate-pulse">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 dark:shadow-none font-bold transition transform hover:-translate-y-0.5 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังตรวจสอบ...
              </span>
            ) : 'เข้าสู่ระบบ'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            ยังไม่มีบัญชีใช่ไหม?{' '}
            <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition">
              สมัครสมาชิกใหม่
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}