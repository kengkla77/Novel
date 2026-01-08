// app/components/LoginModal.tsx
'use client'

import Link from 'next/link'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      
      {/* Backdrop (พื้นหลังมืดๆ เบลอๆ) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} // กดพื้นหลังเพื่อปิด
      ></div>

      {/* Card */}
      <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-sm p-8 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700 text-center">
        
        {/* Icon กุญแจ */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-6">
          <svg className="h-8 w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
          เข้าสู่ระบบก่อนใช้งาน
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
          ฟีเจอร์นี้สงวนสิทธิ์เฉพาะสมาชิกเท่านั้น <br/>กรุณาเข้าสู่ระบบเพื่อกดถูกใจหรือบันทึกนิยาย
        </p>

        <div className="space-y-3">
          <Link 
            href="/login" 
            className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition transform hover:-translate-y-0.5"
          >
            เข้าสู่ระบบ
          </Link>
          
          <Link 
            href="/register" 
            className="block w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-bold transition"
          >
            สมัครสมาชิกใหม่
          </Link>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 underline"
        >
          ไว้คราวหลัง
        </button>

      </div>
    </div>
  )
}