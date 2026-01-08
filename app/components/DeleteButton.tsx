// app/components/DeleteButton.tsx
'use client'

import { useState } from 'react'

type Props = {
  action: () => void
}

export default function DeleteButton({ action }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* 🔴 ปุ่มลบ (สไตล์ข้อความ) */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-200 text-xs font-medium hover:bg-red-100 transition"
      >
        ลบ
      </button>

      {/* 📦 หน้าต่าง Popup (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* พื้นหลังสีดำจางๆ + เบลอ */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* กล่องข้อความ */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
            
            {/* ไอคอนตกใจ */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">ยืนยันการลบ?</h3>
              <p className="text-sm text-gray-500 mb-6">
                คุณแน่ใจหรือไม่ที่จะลบรายการนี้? <br/>
                เมื่อลบแล้วข้อมูลจะหายไปถาวรและกู้คืนไม่ได้ครับ
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setIsOpen(false)}
                className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition"
              >
                ยกเลิก
              </button>

              <form action={action} className="flex-1">
                <button 
                  type="submit"
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium shadow-sm transition"
                >
                  ลบทันที
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}