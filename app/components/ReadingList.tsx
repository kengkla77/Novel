// app/components/ReadingList.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

// ฟังก์ชันย่อตัวเลข
function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

// 👇 1. แก้ Type ตรงนี้ให้ author รับค่า null ได้
type Bookmark = {
  novel: {
    id: number
    title: string
    coverImage: string | null
    viewCount: number
    author: { username: string } | null  // 👈 เพิ่ม | null
    chapters: { id: number }[]
    _count: { likes: number }
  }
}

export default function ReadingList({ bookmarks }: { bookmarks: Bookmark[] }) {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
         <p className="text-slate-400">ยังไม่มีนิยายในชั้นหนังสือ</p>
         <Link href="/" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">ไปสำรวจนิยายสนุกๆ กันเถอะ</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header + Toggle Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
           📚 ชั้นหนังสือ <span className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{bookmarks.length}</span>
        </h2>

        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
           <button 
             onClick={() => setView('grid')}
             className={`p-2 rounded-md transition ${view === 'grid' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
             title="มุมมองแบบการ์ด"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
           </button>
           <button 
             onClick={() => setView('list')}
             className={`p-2 rounded-md transition ${view === 'list' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
             title="มุมมองแบบรายการ"
           >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
           </button>
        </div>
      </div>

      <div className={view === 'grid' ? "grid grid-cols-2 md:grid-cols-4 gap-6" : "flex flex-col gap-4"}>
        {bookmarks.map(({ novel }) => (
           <Link key={novel.id} href={`/novel/${novel.id}`} className="group block">
              
              {/* 🖼️ Mode 1: Grid View */}
              {view === 'grid' ? (
                <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                   <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800 relative">
                      {novel.coverImage ? (
                         <img src={novel.coverImage} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                      )}
                      
                      {/* 👇 2. แก้ไขส่วน Overlay ให้โชว์ครบทั้ง 3 อย่าง (วิว, ไลก์, ตอน) */}
                      <div className="absolute bottom-0 w-full bg-black/60 backdrop-blur-sm py-1.5 px-3">
                         <div className="flex justify-between text-[10px] text-white/90 font-medium">
                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1">👁️ {formatNumber(novel.viewCount)}</span>
                                <span className="flex items-center gap-1">❤️ {formatNumber(novel._count.likes)}</span>
                            </div>
                            <span className="flex items-center gap-1">📑 {novel.chapters.length} ตอน</span>
                         </div>
                      </div>

                   </div>
                   
                   <div className="p-3">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">{novel.title}</h3>
                      {/* 👇 ใส่ ? หรือ || เพื่อกัน Error กรณี author เป็น null */}
                      <p className="text-xs text-slate-500 dark:text-slate-400">โดย {novel.author?.username || 'นิรนาม'}</p>
                   </div>
                </div>
              ) : (
                
                // 📜 Mode 2: List View
                <div className="bg-white dark:bg-[#1e1e1e] p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 transition-all hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                   <div className="flex-shrink-0 w-16 h-24 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                      {novel.coverImage ? (
                         <img src={novel.coverImage} className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-xl">📖</div>
                      )}
                   </div>

                   <div className="flex-1 flex flex-col justify-center">
                      <h3 className="font-bold text-base text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-1">
                        {novel.title}
                      </h3>
                      {/* 👇 กัน Error ตรงนี้ด้วย */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                        เขียนโดย <span className="font-medium text-slate-700 dark:text-slate-300">{novel.author?.username || 'นิรนาม'}</span>
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                         <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                           👁️ {formatNumber(novel.viewCount)}
                         </span>
                         <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                           ❤️ {formatNumber(novel._count.likes)}
                         </span>
                         <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-indigo-500 dark:text-indigo-400 font-bold">
                           📑 {novel.chapters.length} ตอน
                         </span>
                      </div>
                   </div>
                </div>
              )}
           </Link>
        ))}
      </div>
    </div>
  )
}