// app/components/DeleteCommentButton.tsx
'use client'

import { useState } from 'react'

type Props = {
  action: () => void
}

export default function DeleteCommentButton({ action }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 🗑️ ปุ่มลบ (ไอคอนถังขยะ) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="text-slate-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition"
        title="ลบคอมเมนต์"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
      </button>

      {/* 📦 Popup ยืนยัน (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">ลบคอมเมนต์นี้?</h3>
            <p className="text-sm text-slate-500 mb-6 text-center">
              คุณต้องการลบความคิดเห็นนี้ใช่หรือไม่?
            </p>

            <div className="flex gap-3">
              <button onClick={() => setIsOpen(false)} className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 text-sm font-bold">ยกเลิก</button>
              <form action={action} className="flex-1">
                <button type="submit" className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-bold">ลบทันที</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}