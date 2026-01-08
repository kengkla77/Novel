// app/coin/topup/qrcode/page.tsx
'use client'

import { useState } from 'react'
import { generatePromptPayQR, uploadSlip } from '@/app/actions' // 👈 import uploadSlip เพิ่ม
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

export default function QRCodePage() {
  const [amount, setAmount] = useState<number | ''>('')
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false) // State สำหรับตอนกดส่งสลิป
  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) return
    
    setLoading(true)
    const res = await generatePromptPayQR(Number(amount))
    if (res.success && res.qrImage) {
      setQrCode(res.qrImage)
    }
    setLoading(false)
  }

  // ฟังก์ชันส่งสลิป
  const handleUploadSlip = async (formData: FormData) => {
    setUploading(true)
    const res = await uploadSlip(formData)
    
    if (res?.success) {
      // ✅ Popup แจ้งเตือนสำเร็จ
      await Swal.fire({
        icon: 'success',
        title: 'แจ้งโอนเงินเรียบร้อย!',
        text: 'กรุณารอแอดมินตรวจสอบความถูกต้อง',
        confirmButtonText: 'กลับไปหน้าโปรไฟล์',
        confirmButtonColor: '#4F46E5', // สี Indigo ให้เข้ากับธีมเว็บ
        background: '#fff', // รองรับ Dark Mode ต้อง Config เพิ่ม (แต่นี้พื้นฐาน)
        allowOutsideClick: false // บังคับให้กดปุ่มตกลงเท่านั้น
      })
      
      router.push('/profile') // พอกดตกลงปุ๊บ ค่อยเด้งไปหน้าโปรไฟล์
    } else {
      // ❌ Popup แจ้งเตือน Error
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: res?.error || 'ไม่สามารถส่งข้อมูลได้ กรุณาลองใหม่',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#d33'
      })
    }
    setUploading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#111] p-4 transition-colors">
      <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-800">
        
        {/* ... Header (เหมือนเดิม) ... */}

        {!qrCode ? (
          // ... Form สร้าง QR (เหมือนเดิม) ...
          <form onSubmit={handleGenerate} className="space-y-4">
             {/* ... copy code เดิมมาวาง ... */}
             <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">จำนวนเงิน (บาท)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111] text-slate-900 dark:text-white" />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">{loading ? '...' : 'สร้าง QR Code'}</button>
          </form>
        ) : (
          <div className="text-center animate-in zoom-in duration-300">
             
             {/* QR Code Section */}
             <div className="bg-white p-4 rounded-xl border-2 border-blue-500 inline-block mb-4 shadow-lg">
                <img src={qrCode} alt="PromptPay QR" className="w-64 h-64" />
             </div>
             <p className="font-bold text-slate-800 dark:text-white text-lg mb-6">
               ยอดโอน: <span className="text-blue-600 dark:text-blue-400">{Number(amount).toLocaleString()} บาท</span>
             </p>

             <hr className="border-slate-200 dark:border-slate-700 mb-6" />

             {/* 👇 ส่วนฟอร์มแนบสลิป (ใหม่) */}
             <div className="text-left">
               <h3 className="font-bold text-slate-700 dark:text-slate-300 mb-2">📤 แนบหลักฐานการโอน</h3>
               <form action={handleUploadSlip} className="space-y-3">
                  <input type="hidden" name="amount" value={amount} />
                  
                  <input 
                    type="file" 
                    name="slip" 
                    accept="image/*" 
                    required 
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  
                  <button 
                    type="submit" 
                    disabled={uploading}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none transition disabled:bg-slate-400 flex justify-center items-center gap-2"
                  >
                    {uploading ? 'กำลังส่งข้อมูล...' : '✅ ยืนยันการแจ้งโอน'}
                  </button>
               </form>
             </div>

             <button onClick={() => setQrCode(null)} className="mt-4 text-slate-400 hover:underline text-sm">ยกเลิก / ทำรายการใหม่</button>
          </div>
        )}
      </div>
    </div>
  )
}