// app/novel/[id]/chapter/[chapterId]/edit/page.tsx
import { PrismaClient } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import EditChapterForm from '@/app/components/EditChapterForm'

const prisma = new PrismaClient()

type Props = {
  params: Promise<{ id: string; chapterId: string }>
}

export default async function EditChapterPage(props: Props) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = await props.params;
  const novelId = Number(params.id)
  const chapterId = Number(params.chapterId)

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId }
  })

  if (!chapter) notFound()

  return (
    // 🌓 1. ปรับพื้นหลังหลัก
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            แก้ไขตอน: <span className="text-indigo-600 dark:text-indigo-400">{chapter.title}</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">ปรับปรุงเนื้อหาให้น่าติดตามยิ่งขึ้น</p>
        </div>

        {/* 🌓 2. ปรับตัว Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
           <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800">
              <div className="h-full w-1/3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-r-full"></div>
           </div>
           
           <div className="p-8 md:p-10">
              <EditChapterForm 
                novelId={novelId}
                chapterId={chapterId}
                initialTitle={chapter.title}
                initialContent={chapter.content}
                initialOrder={chapter.order}
                initialPrice={chapter.price} // 👈 ส่งค่าราคาเดิมไปด้วย (ต้องไปแก้ Form รับด้วยนะ)
              />
           </div>
        </div>

      </div>
    </div>
  )
}