import { PrismaClient } from '@prisma/client'
import Link from 'next/link'

const prisma = new PrismaClient()

function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

async function getNovels() {
  const novels = await prisma.novel.findMany({
    orderBy: { createdAt: 'desc' },
    include: { 
      author: { select: { username: true } },
      _count: { select: { likes: true } },
      chapters: { select: { id: true } } 
    }
  })
  return novels
}

export default async function Home() {
  const novels = await getNovels()

  return (
    // 🌓 ปรับพื้นหลังหลัก
    <main className="min-h-screen bg-slate-50 dark:bg-[#111] pb-20 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#1a1b26] border-b border-slate-200 dark:border-slate-800 mb-10 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            โลกแห่งจินตนาการ <span className="text-indigo-600 dark:text-indigo-400">ไร้ขีดจำกัด</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            คลังนิยายออนไลน์ที่คุณสามารถอ่านและเขียนเรื่องราวของคุณเองได้ง่ายๆ
          </p>
          <div className="flex justify-center gap-4">
             <Link href="/novel/create" className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform hover:-translate-y-1">
               เริ่มเขียนเลย
             </Link>
          </div>
        </div>
      </div>

      {/* Novel Grid */}
      <div id="all-novels" className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <span className="text-2xl">🔥</span>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">นิยายมาใหม่</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {novels.map((novel) => (
            <Link key={novel.id} href={`/novel/${novel.id}`} className="group block h-full">
              {/* 🌓 การ์ดนิยาย */}
              <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col relative top-0 hover:-top-1">
                
                {/* ปก */}
                <div className="aspect-[2/3] w-full bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                  {novel.coverImage ? (
                    <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                      <span className="text-4xl mb-2">📖</span>
                      <span className="text-xs">No Cover</span>
                    </div>
                  )}
                  {/* Overlay Stats (Dark Mode Friendly) */}
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-8 pb-2 px-3">
                    <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-300 font-medium">
                      <div className="flex items-center gap-1"><svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg><span>{novel.chapters.length}</span></div>
                      <div className="flex items-center gap-1"><svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg><span>{formatNumber(novel.viewCount)}</span></div>
                      <div className="flex items-center gap-1"><svg className="w-3 h-3 text-slate-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><span>{formatNumber(novel._count.likes)}</span></div>
                    </div>
                  </div>
                </div>

                {/* ข้อมูล */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-snug mb-1 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {novel.title}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span>โดย {novel.author?.username || 'นิรนาม'}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
                    {novel.description || "-"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {novels.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <p className="text-slate-400">ยังไม่มีนิยายในระบบ</p>
          </div>
        )}
      </div>
    </main>
  )
}