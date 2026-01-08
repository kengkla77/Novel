// app/components/CreateChapterForm.tsx
'use client'

import { useActionState } from 'react'
import { createChapter } from '@/app/actions'
import Link from 'next/link'

type Props = {
  novelId: number
  nextOrder: number
}

export default function CreateChapterForm({ novelId, nextOrder }: Props) {
  const [state, formAction, isPending] = useActionState(createChapter, undefined)

  return (
    <form action={formAction} className="space-y-6 relative z-10">
      
      <input type="hidden" name="novelId" value={novelId} />

      <div className="flex gap-4">
        {/* ลำดับตอน */}
        <div className="w-1/4">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ลำดับที่</label>
          <input 
            type="number" 
            name="order"
            required
            defaultValue={nextOrder} 
            // 👇 ปรับสีพื้นหลัง ตัวหนังสือ และขอบสำหรับ Dark Mode
            className={`w-full border rounded-lg p-2.5 bg-slate-50 dark:bg-slate-800 text-center font-mono font-bold outline-none focus:ring-2 dark:text-white transition-colors ${
              state?.error 
                ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-900 text-red-600 dark:text-red-400' 
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500 text-slate-600'
            }`}
          />
        </div>

        {/* ชื่อตอน (แก้ปัญหาตัวหนังสือจาง) */}
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">ชื่อตอน</label>
          <input 
            type="text" 
            name="title"
            required
            autoFocus
            placeholder="เช่น บทนำ, การเริ่มต้น..." 
            // 👇 ใส่ dark:bg-slate-800 และ dark:text-white ให้ชัดเจน
            className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Error Message */}
      {state?.error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-sm font-bold">{state.error}</span>
        </div>
      )}

      {/* เนื้อหา */}
      <div>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">เนื้อหา</label>
        <textarea 
          name="content"
          required
          rows={15}
          placeholder="บรรเลงจินตนาการของคุณตรงนี้..." 
          // 👇 ใส่ dark:bg-slate-800 และ dark:text-slate-100
          className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 outline-none font-sarabun leading-relaxed transition-colors placeholder-slate-400 dark:placeholder-slate-500"
        />
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          type="submit" 
          disabled={isPending}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white py-2.5 rounded-lg transition font-bold shadow-lg shadow-indigo-200 dark:shadow-none disabled:bg-slate-400 dark:disabled:bg-slate-600"
        >
          {isPending ? 'กำลังบันทึก...' : 'บันทึกตอนใหม่'}
        </button>
        
        <Link 
          href={`/novel/${novelId}`}
          className="px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium transition-colors"
        >
          ยกเลิก
        </Link>
      </div>

    </form>
  )
}