// app/coin/topup/truemoney/page.tsx
'use client'

import { useState } from 'react'
import { redeemAngpao } from '@/app/actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TrueMoneyPage() {
  const [link, setLink] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const result = await redeemAngpao(link)

    if (result.success) {
      setMessage({ type: 'success', text: `สำเร็จ! คุณได้รับ +${result.amount} เหรียญ` })
      setLink('')
      router.refresh()
    } else {
      setMessage({ type: 'error', text: result.error || 'เกิดข้อผิดพลาด' })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] dark:bg-[#111] p-4">
      <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-100 dark:border-slate-800">
        
        <div className="text-center mb-8">
          {/* 👇 เปลี่ยนลิงก์รูปตรงนี้ครับ */}
          <img 
            src="/truemoney-svg.png"
            alt="TrueMoney" 
            className="h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">เติมเงินด้วยซองของขวัญ</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            สร้างซองของขวัญในแอป TrueMoney <br/>แล้วนำลิงก์มากรอกด้านล่าง
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
              ลิงก์ซองของขวัญ (Gift Link)
            </label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://gift.truemoney.com/campaign/?v=..."
              required
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111] focus:ring-2 focus:ring-orange-500 outline-none transition text-slate-900 dark:text-white"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 dark:shadow-none transition disabled:bg-slate-300"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'ยืนยันการเติมเงิน'}
          </button>
        </form>

        <Link href="/coin/topup" className="block text-center mt-6 text-sm text-slate-400 hover:underline">
          &larr; กลับไปหน้าเลือกวิธีเติมเงิน
        </Link>

      </div>
    </div>
  )
}