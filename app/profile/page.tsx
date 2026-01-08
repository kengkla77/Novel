// app/profile/page.tsx
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, signOut } from '@/auth' // เพิ่ม signOut เข้ามา
import { deleteNovel } from '@/app/actions'
import DeleteButton from '@/app/components/DeleteButton'
import ReadingList from '@/app/components/ReadingList'
import AvatarUploader from '@/app/components/AvatarUploader'

const prisma = new PrismaClient()

// ฟังก์ชันย่อตัวเลข (1.2k)
function formatNumber(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

async function getUserProfile(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      // 1. ดึงนิยายที่เขียน
      novels: { 
        orderBy: { createdAt: 'desc' },
        include: { 
          chapters: { select: { id: true } },
          _count: { select: { likes: true } }
        }
      },
      // 2. ดึงชั้นหนังสือ
      bookmarks: {
        orderBy: { id: 'desc' }, 
        include: {
          novel: {
             include: {
                author: { select: { username: true } },
                chapters: { select: { id: true } },
                _count: { select: { likes: true } }
             }
          }
        }
      }
    }
  })
}

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await getUserProfile(Number(session.user.id))
  if (!user) redirect('/login')

  const totalViews = user.novels.reduce((sum, novel) => sum + novel.viewCount, 0)
  const totalLikes = user.novels.reduce((sum, novel) => sum + novel._count.likes, 0)
  const totalNovels = user.novels.length

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] pb-20 transition-colors duration-300">
      
      {/* =========================================
          ส่วนที่ 1: Header & Profile Info (ของเดิม)
      ========================================= */}
      <div className="bg-white dark:bg-[#1e1e1e] border-b border-slate-200 dark:border-slate-800 pt-10 pb-20 transition-colors">
         <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-8">
            
            <AvatarUploader user={user} />

            <div className="text-center md:text-left flex-1">
               <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white mb-2">{user.username}</h1>
               <p className="text-slate-500 dark:text-slate-400 mb-4">{user.email}</p>
               
               <div className="inline-flex gap-2 mb-4 md:mb-0">
                 <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                    {user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'นักเขียน'}
                 </span>
                 <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-bold">
                    สมาชิกเมื่อ {new Date(user.createdAt).toLocaleDateString('th-TH', { year: '2-digit', month: 'short' })}
                 </span>
               </div>
            </div>

            <div className="flex gap-4">
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[100px]">
                  <div className="text-2xl font-black text-slate-800 dark:text-white">{formatNumber(totalViews)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">ยอดอ่าน</div>
               </div>
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 text-center min-w-[100px]">
                  <div className="text-2xl font-black text-slate-800 dark:text-white">{formatNumber(totalLikes)}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">ยอดไลก์</div>
               </div>
            </div>

         </div>
      </div>

      {/* Container เนื้อหาหลัก */}
      <div className="max-w-5xl mx-auto px-6 -mt-12 relative z-10">
         
         {/* =========================================
             ✨ ส่วนที่เพิ่มใหม่: Wallet & History Card ✨
             แทรกอยู่ระหว่าง Header กับ นิยาย
         ========================================= */}
         <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden mb-12">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
               <div className="text-center md:text-left">
                  <p className="text-indigo-200 text-sm font-medium mb-1">ยอดเหรียญคงเหลือ</p>
                  <h2 className="text-5xl font-extrabold flex items-center justify-center md:justify-start gap-2">
                  {user.coins.toLocaleString()} <span className="text-2xl opacity-80">🪙</span>
                  </h2>
               </div>

               <div className="flex flex-wrap justify-center gap-3 w-full md:w-auto">
                  <Link 
                  href="/coin/topup"
                  className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition shadow-lg text-center min-w-[140px]"
                  >
                  + เติมเหรียญ
                  </Link>
                  
                  <Link 
                  href="/coin/history"
                  className="px-6 py-3 bg-indigo-800/50 hover:bg-indigo-800/70 text-white border border-indigo-400/30 rounded-xl font-bold transition text-center flex items-center justify-center gap-2 min-w-[140px]"
                  >
                  <span>📜</span> ประวัติ
                  </Link>
               </div>
            </div>
         </div>

         {/* =========================================
             ส่วนที่ 2: งานเขียนของฉัน (ของเดิม)
         ========================================= */}
         <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  ✍️ งานเขียนของฉัน <span className="text-sm bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{totalNovels}</span>
               </h2>
               <Link href="/novel/create" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">+ เขียนเรื่องใหม่</Link>
            </div>

            {user.novels.length > 0 ? (
               <div className="grid md:grid-cols-2 gap-6">
                  {user.novels.map((novel) => {
                     const deleteAction = deleteNovel.bind(null, novel.id)
                     return (
                        <div key={novel.id} className="bg-white dark:bg-[#1e1e1e] p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 transition-colors hover:border-indigo-200 dark:hover:border-indigo-900">
                           <Link href={`/novel/${novel.id}`} className="flex-shrink-0 w-24 h-36 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden shadow-inner relative">
                              {novel.coverImage ? (
                                 <img src={novel.coverImage} className="w-full h-full object-cover" alt={novel.title} />
                              ) : (
                                 <div className="w-full h-full flex items-center justify-center text-2xl">📖</div>
                              )}
                           </Link>
                           <div className="flex-1 flex flex-col">
                              <div className="flex justify-between items-start">
                                 <Link href={`/novel/${novel.id}`} className="font-bold text-lg text-slate-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1 mb-1">
                                    {novel.title}
                                 </Link>
                                 <div className="flex items-center gap-2">
                                    <Link href={`/novel/${novel.id}/edit`} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition" title="แก้ไข">
                                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </Link>
                                    <DeleteButton action={deleteAction} />
                                 </div>
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-auto">
                                 {novel.description || 'ไม่มีคำโปรย'}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                                 <span className="flex items-center gap-1">👁️ {formatNumber(novel.viewCount)}</span>
                                 <span className="flex items-center gap-1">❤️ {formatNumber(novel._count.likes)}</span>
                                 <span className="flex items-center gap-1">📄 {novel.chapters.length} ตอน</span>
                              </div>
                           </div>
                        </div>
                     )
                  })}
               </div>
            ) : (
               <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50">
                  <p className="text-slate-400 mb-2">คุณยังไม่มีผลงานเขียน</p>
                  <Link href="/novel/create" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">เริ่มเขียนนิยายเรื่องแรกของคุณเลย!</Link>
               </div>
            )}
         </div>

         {/* =========================================
             ส่วนที่ 3: ชั้นหนังสือ (ของเดิม)
         ========================================= */}
         <div className="mb-20">
            <ReadingList bookmarks={user.bookmarks} />
         </div>

         {/* =========================================
             ส่วนที่ 4: ปุ่มออกจากระบบ (ใส่ไว้ด้านล่างสุด)
         ========================================= */}
         <div className="mb-12">
            <form 
               action={async () => {
               'use server'
               await signOut({ redirectTo: '/login' })
               }}
            >
               <button className="w-full py-4 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl font-bold transition border border-transparent hover:border-red-200 dark:hover:border-red-800 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                  ออกจากระบบ
               </button>
            </form>
         </div>

      </div>
    </div>
  )
}