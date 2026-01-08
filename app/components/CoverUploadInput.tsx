// app/components/CoverUploadInput.tsx
'use client'

import { useState } from 'react'

export default function CoverUploadInput() {
  const [showError, setShowError] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    // ⚠️ เช็คขนาดไฟล์ (1MB = 1024 * 1024 bytes)
    if (file && file.size > 1024 * 1024) {
      setShowError(true) // เปิด Popup
      e.target.value = '' // ล้างค่าทิ้งทันที
    }
  }

  return (
    <>
      {/* Input Field */}
      <input 
        type="file" 
        name="coverFile" 
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-xs text-slate-600 dark:text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-white dark:file:bg-slate-700 file:text-slate-900 dark:file:text-white hover:file:bg-slate-50 dark:hover:file:bg-slate-600 cursor-pointer transition" 
      />

      {/* 🚨 Custom Popup Modal */}
      {showError && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          
          {/* Backdrop (พื้นหลังมืดๆ เบลอๆ) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowError(false)} // กดพื้นหลังเพื่อปิด
          ></div>
          
          {/* Card (กล่องข้อความ) */}
          <div className="relative bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700">
            
            <div className="text-center">
              {/* Icon แจ้งเตือน */}
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title & Description */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                ไฟล์ขนาดใหญ่เกินไป!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                ระบบรองรับรูปภาพขนาดไม่เกิน <strong>1MB</strong> ครับ <br/>
                กรุณาเลือกรูปใหม่ที่มีขนาดเล็กลง หรือนำรูปไปย่อขนาดก่อนนะครับ
              </p>

              {/* Close Button */}
              <button 
                onClick={() => setShowError(false)}
                className="w-full inline-flex justify-center px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition shadow-lg shadow-indigo-200 dark:shadow-none"
              >
                รับทราบ
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}