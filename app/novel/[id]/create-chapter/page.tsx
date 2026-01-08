// app/novel/[id]/create-chapter/page.tsx
import { createChapter } from '@/app/actions'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import CreateChapterForm from '@/app/components/CreateChapterForm'

const prisma = new PrismaClient()

type Props = {
  params: Promise<{ id: string }>
}

export default async function CreateChapterPage(props: Props) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = await props.params;
  const novelId = Number(params.id);

  const lastChapter = await prisma.chapter.findFirst({
    where: { novelId: novelId },
    orderBy: { order: 'desc' },
    select: { order: true }
  })
  const nextOrder = (lastChapter?.order ?? 0) + 1;

  return (
    // 👇 เพิ่ม dark:bg-[#1e1e1e] และ dark:border-slate-800 ตรงนี้
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-[#1e1e1e] shadow-md dark:shadow-none rounded-lg mt-10 border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      
      <h1 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-white relative z-10 flex items-center justify-center gap-2">
        📝 เขียนตอนใหม่ <span className="text-indigo-600 dark:text-indigo-400 text-lg bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">#{nextOrder}</span>
      </h1>
      
      <CreateChapterForm novelId={novelId} nextOrder={nextOrder} />

    </div>
  )
}