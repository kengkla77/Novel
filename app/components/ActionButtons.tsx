// app/components/ActionButtons.tsx
'use client'

import { toggleBookmark, toggleLike } from '@/app/actions'
import { useTransition,useState } from 'react' // ใช้เพื่อความลื่นไหล
import LoginModal from './LoginModal'


type Props = {
  novelId: number
  isBookmarked: boolean
  isLiked: boolean
  likeCount: number
  hasUser: boolean // เช็คว่า Login หรือยัง
}

export default function ActionButtons({ novelId, isBookmarked, isLiked, likeCount, hasUser }: Props) {
  const [isPending, startTransition] = useTransition()
  const [showLoginModal, setShowLoginModal] = useState(false)

  // ฟังก์ชันกดปุ่ม (ถ้ายังไม่ Login ให้ Alert)
  const handleAction = (action: any) => {
    if (!hasUser) {
      setShowLoginModal(true) // ✅ เปลี่ยนจาก alert เป็นเปิด Modal
      return
    }

    startTransition(() => {
      action(novelId)
    })
  }

  return (
    <>
      {/* 👇 ใส่ Modal ไว้ตรงนี้ */}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

      <div className="flex gap-4">
        
        {/* ปุ่ม Like */}
        <button
          onClick={() => handleAction(toggleLike)}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition transform hover:-translate-y-0.5 shadow-md ${
            isLiked
              ? 'bg-pink-500 text-white shadow-pink-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-500 hover:text-pink-500 dark:hover:text-pink-400'
          }`}
        >
          <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{isLiked ? 'ถูกใจแล้ว' : 'ถูกใจ'}</span>
          <span className={`ml-1 text-xs ${isLiked ? 'text-pink-200' : 'text-slate-400'}`}>({likeCount})</span>
        </button>

        {/* ปุ่ม Bookmark */}
        <button
          onClick={() => handleAction(toggleBookmark)}
          disabled={isPending}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition transform hover:-translate-y-0.5 shadow-md ${
            isBookmarked
              ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <svg className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <span>{isBookmarked ? 'ติดตามแล้ว' : 'เพิ่มเข้าชั้น'}</span>
        </button>

      </div>
    </>
  )
}