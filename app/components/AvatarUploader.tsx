// app/components/AvatarUploader.tsx
'use client'

import { useState, useRef } from 'react'
import { updateAvatar } from '@/app/actions'

type Props = {
  user: {
    id: number
    username: string
    image: string | null
  }
}

export default function AvatarUploader({ user }: Props) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // เช็คขนาดไฟล์ (Client Side) - ไม่เกิน 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert('❌ รูปภาพต้องมีขนาดไม่เกิน 2MB ครับ')
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('avatarFile', file)

    // เรียก Server Action
    const result = await updateAvatar(formData)
    
    if (result.error) {
      alert(result.error)
    }
    
    setIsUploading(false)
    // ล้างค่า Input เพื่อให้เลือกรูปเดิมซ้ำได้ถ้าต้องการ
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
      
      {/* 1. รูป Profile */}
      <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-xl bg-slate-200 dark:bg-slate-800 relative">
        {user.image ? (
          <img 
            src={user.image} 
            alt={user.username} 
            className={`w-full h-full object-cover transition duration-300 ${isUploading ? 'opacity-50 blur-sm' : 'group-hover:opacity-90'}`}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold ${isUploading ? 'opacity-50' : ''}`}>
            {user.username.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* 2. Overlay ไอคอนกล้อง (แสดงเมื่อ Hover) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
        <div className="bg-black/50 text-white p-2 rounded-full backdrop-blur-sm">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
        </div>
      </div>

      {/* 3. Loading Spinner */}
      {isUploading && (
        <div className="absolute inset-0 flex items-center justify-center">
           <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      )}

      {/* 4. Hidden Input */}
      <input 
        type="file" 
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {/* 5. ปุ่มแก้ไขเล็กๆ ด้านล่าง */}
      <div className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 text-slate-700 dark:text-white p-1.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-600 group-hover:scale-110 transition">
         <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      </div>

    </div>
  )
}