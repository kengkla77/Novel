// app/components/EditChapterForm.tsx
'use client'

import { useActionState } from 'react'
import { updateChapter } from '@/app/actions'
import Link from 'next/link'

type Props = {
  novelId: number
  chapterId: number
  initialTitle: string
  initialContent: string
  initialOrder: number
  initialPrice: number
}

export default function EditChapterForm({ novelId, chapterId, initialTitle, initialContent, initialOrder, initialPrice }: Props) {
  const [state, formAction, isPending] = useActionState(updateChapter, undefined)

  return (
    <form action={formAction} className="space-y-8">

      <input type="hidden" name="novelId" value={novelId} />
      <input type="hidden" name="chapterId" value={chapterId} />

      <div className="flex flex-col md:flex-row gap-6">
        {/* ลำดับตอน */}
        <div className="w-full md:w-32">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">ลำดับที่</label>
          <input
            type="number"
            name="order"
            required
            defaultValue={initialOrder}
            // 👇 แก้ไข: เพิ่ม dark mode styles
            className={`w-full text-center text-xl font-bold border-2 rounded-xl p-3 bg-slate-50 dark:bg-slate-800 dark:text-white outline-none transition focus:bg-white dark:focus:bg-slate-700 ${state?.error
                ? 'border-red-400 text-red-600 bg-red-50'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 focus:border-indigo-500'
              }`}
          />
        </div>

        {/* ชื่อตอน (Underline Style) */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">ชื่อตอน</label>
          <div className="relative group">
            <input
              type="text"
              name="title"
              required
              defaultValue={initialTitle}
              placeholder="ใส่ชื่อตอน..."
              // 👇 แก้ไข: เพิ่ม dark:text-white และ dark:border-slate-700
              className="w-full text-xl md:text-2xl font-bold border-b-2 border-slate-200 dark:border-slate-700 bg-transparent py-2 px-1 focus:border-indigo-600 focus:outline-none transition-colors placeholder-slate-300 dark:placeholder-slate-600 text-slate-900 dark:text-white"
            />
            {/* Icon ปากกาด้านขวา */}
            <div className="absolute right-0 top-3 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-500 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-sm font-bold">{state.error}</span>
        </div>
      )}

      {/* ราคา */}
      <div>
        <label className="block text-sm font-bold text-yellow-600 dark:text-yellow-400 mb-2 flex items-center gap-1">
          <span>🪙</span> ราคา (เหรียญ)
        </label>
        <input
          type="number"
          name="price"
          defaultValue={initialPrice}
          min="0"
          placeholder="0 = อ่านฟรี"
          // 👇 แก้ไข: เพิ่ม dark styles
          className="w-full bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-yellow-500 text-slate-900 dark:text-white"
        />
      </div>

      {/* เนื้อหา */}
      <div>
        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          เนื้อหา <span className="text-red-400">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={20}
          defaultValue={initialContent}
          placeholder="เริ่มเขียนนิยายของคุณ..."
          // 👇 แก้ไข: ปรับสีพื้นหลังและตัวหนังสือในโหมดมืด
          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition shadow-inner bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sarabun text-lg leading-loose resize-y"
        />
      </div>

      <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-200 dark:shadow-none disabled:bg-slate-400 flex justify-center items-center gap-2"
        >
          {isPending ? 'กำลังบันทึก...' : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              บันทึกการแก้ไข
            </>
          )}
        </button>

        <Link
          href={`/novel/${novelId}/chapter/${chapterId}`}
          className="px-8 py-3.5 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition text-center"
        >
          ยกเลิก
        </Link>
      </div>

    </form>
  )
}