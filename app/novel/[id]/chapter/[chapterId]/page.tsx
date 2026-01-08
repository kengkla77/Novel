// app/novel/[id]/chapter/[chapterId]/page.tsx
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import { deleteChapter, unlockChapter } from '@/app/actions' // 👈 Import deleteChapter
import DeleteButton from '@/app/components/DeleteButton'     // 👈 Import ปุ่มลบ

const prisma = new PrismaClient()

// ฟังก์ชันหาตอนก่อนหน้า/ถัดไป
async function getAdjacentChapters(novelId: number, currentOrder: number) {
  const [prev, next] = await Promise.all([
    prisma.chapter.findFirst({
      where: { novelId, order: { lt: currentOrder } },
      orderBy: { order: 'desc' },
      select: { id: true }
    }),
    prisma.chapter.findFirst({
      where: { novelId, order: { gt: currentOrder } },
      orderBy: { order: 'asc' },
      select: { id: true }
    })
  ])
  return { prev, next }
}

type Props = { params: Promise<{ id: string; chapterId: string }> }

export default async function ChapterPage(props: Props) {
  const params = await props.params;
  const novelId = Number(params.id)
  const chapterId = Number(params.chapterId)

  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : undefined

  // 1. ดึงข้อมูลตอน
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      novel: true,
      accesses: {
        where: { userId: userId || -1 }
      }
    }
  })

  if (!chapter) notFound()

  // 2. ดึงตอนก่อนหน้า/ถัดไป
  const { prev, next } = await getAdjacentChapters(novelId, chapter.order)

  // 3. เพิ่มยอดวิว
  await prisma.chapter.update({ where: { id: chapterId }, data: { viewCount: { increment: 1 } } })
  await prisma.novel.update({ where: { id: novelId }, data: { viewCount: { increment: 1 } } })

  // 4. ตรวจสอบสิทธิ์
  const isOwner = userId === chapter.novel.authorId
  const isPurchased = chapter.accesses.length > 0
  const isFree = chapter.price === 0
  const isUnlocked = isOwner || isFree || isPurchased

  // เตรียม Action สำหรับลบตอน
  const deleteAction = deleteChapter.bind(null, chapterId, novelId)

  // Server Action สำหรับกดซื้อ
  async function buyChapter() {
    'use server'
    const result = await unlockChapter(chapter!.id, chapter!.price)
    if (result?.error) redirect('/coin/topup') 
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] py-12 transition-colors duration-300 text-slate-900 dark:text-slate-100">
      
      {/* Navbar Fixed */}
      <div className="fixed top-16 left-0 w-full bg-white/90 dark:bg-[#111]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-3 z-40 flex justify-between items-center shadow-sm">
         <div className="flex items-center gap-4">
            <Link href={`/novel/${novelId}`} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </Link>
            <div>
               <h2 className="font-bold text-sm md:text-base line-clamp-1">{chapter.novel.title}</h2>
               <p className="text-xs text-slate-500 dark:text-slate-400">ตอนที่ {chapter.order}</p>
            </div>
         </div>

         <div className="flex items-center gap-2">
            <Link href="/" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            </Link>
            {!isUnlocked && (
               <div className="hidden md:flex items-center gap-1 text-yellow-600 font-bold text-sm bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                  🔒 {chapter.price} เหรียญ
               </div>
            )}
         </div>
      </div>

      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1e1e1e] px-8 py-16 md:px-16 md:py-20 shadow-xl shadow-slate-200/50 dark:shadow-none rounded-none md:rounded-lg mt-8 relative transition-colors">
        
        {/* Header เนื้อหา */}
        <div className="text-center mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
          <p className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-sm uppercase mb-2">EPISODE {chapter.order}</p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
            {chapter.title} {chapter.price > 0 && !isUnlocked && <span className="text-yellow-500 ml-2 text-2xl align-middle">🔒</span>}
          </h1>
          
          <div className="flex justify-center items-center gap-4 mt-4 text-xs text-slate-400 dark:text-slate-500">
             <span>👁️ {chapter.viewCount.toLocaleString()}</span>
             <span>📅 {new Date(chapter.createdAt).toLocaleDateString('th-TH')}</span>
          </div>

          {/* 👇 เพิ่มปุ่ม แก้ไข/ลบ สำหรับเจ้าของตรงนี้ครับ */}
          {isOwner && (
            <div className="flex justify-center items-center gap-3 mt-6 pt-6 border-t border-dashed border-slate-100 dark:border-slate-800">
               <Link 
                 href={`/novel/${novelId}/chapter/${chapterId}/edit`}
                 className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center gap-2"
               >
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                 แก้ไขตอน
               </Link>
               <DeleteButton action={deleteAction} />
            </div>
          )}
        </div>

        {/* Logic การแสดงผลเนื้อหา (เหมือนเดิม) */}
        {isUnlocked ? (
          <div className="prose prose-lg md:prose-xl max-w-none text-slate-800 dark:text-slate-300 dark:prose-invert leading-loose whitespace-pre-wrap font-sarabun">
            {chapter.content}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 border-2 border-dashed border-yellow-200 dark:border-yellow-900/50 rounded-2xl bg-yellow-50/30 dark:bg-yellow-900/10 transition-colors">
            <div className="text-6xl mb-4 drop-shadow-md">🔒</div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">เนื้อหานี้ถูกล็อค</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 text-center max-w-sm">
              สนับสนุนนักเขียนเพื่อเปิดอ่านตอนนี้ ในราคาเพียง <br/>
              <strong className="text-yellow-600 dark:text-yellow-400 text-xl">{chapter.price} เหรียญ</strong>
            </p>
            <form action={buyChapter}>
               <button type="submit" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg font-bold px-10 py-3 rounded-full shadow-lg shadow-orange-200 dark:shadow-none transition transform hover:-translate-y-1 flex items-center gap-2">
                 <span>🔓</span> ปลดล็อคเลย
               </button>
            </form>
            <Link href="/coin/topup" className="mt-6 text-sm text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 hover:underline flex items-center gap-1">
               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
               เติมเหรียญเพิ่ม
            </Link>
          </div>
        )}

        {/* Footer Navigation (เหมือนเดิม) */}
        <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
           {prev ? (
             <Link href={`/novel/${novelId}/chapter/${prev.id}`} className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition">
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                ตอนก่อนหน้า
             </Link>
           ) : (
             <div className="text-slate-300 dark:text-slate-700 cursor-not-allowed flex items-center gap-2 font-bold">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
               ตอนแรก
             </div>
           )}
           <Link href={`/novel/${novelId}`} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
           </Link>
           {next ? (
             <Link href={`/novel/${novelId}/chapter/${next.id}`} className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition">
                ตอนถัดไป
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </Link>
           ) : (
             <div className="text-slate-300 dark:text-slate-700 cursor-not-allowed flex items-center gap-2 font-bold">
               ตอนล่าสุด
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             </div>
           )}
        </div>

      </div>
    </div>
  )
}