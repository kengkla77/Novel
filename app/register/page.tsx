// app/register/page.tsx
'use client'

import { useActionState } from 'react'
import { register } from '@/app/actions'
import Link from 'next/link'

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, undefined)

  return (
    // 🌓 1. พื้นหลังหลัก
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#111] relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor (ปรับ Effect ให้สวยทั้งมืดและสว่าง) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-200 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* 🌓 2. การ์ดสมัครสมาชิก */}
      <div className="max-w-md w-full bg-white/80 dark:bg-[#1e1e1e]/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl border border-white/50 dark:border-slate-800 relative z-10 transition-colors">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
            {/* ไอคอน User Plus */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">สร้างบัญชีใหม่</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">เริ่มต้นเขียนและอ่านนิยายในแบบของคุณ</p>
        </div>

        <form action={formAction} className="space-y-5">
          
          {/* Username Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">ชื่อผู้ใช้ (Username)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              {/* 🌓 Input Styles */}
              <input 
                name="username" 
                type="text" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="Ex. NovelWriter007" 
              />
            </div>
          </div>
          
          {/* Email Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">อีเมล</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 11-8 0 4 4 0 018 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                name="email" 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                placeholder="name@example.com" 
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 ml-1">รหัสผ่าน</label>
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
          {state?.error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/50 animate-pulse">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{state.error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white py-3.5 rounded-xl shadow-lg hover:shadow-indigo-500/30 dark:shadow-none font-bold transition transform hover:-translate-y-0.5 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังสมัครสมาชิก...
              </span>
            ) : 'ยืนยันการสมัคร'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-800 dark:hover:text-indigo-300 hover:underline transition">
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}