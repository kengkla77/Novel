// app/coin/history/page.tsx
import { auth } from '@/auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import HistoryLists from './HistoryLists'

const prisma = new PrismaClient()

export default async function CoinHistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const userId = Number(session.user.id)

  // 1. ดึงประวัติการเติมเงิน (เรียงจากล่าสุดไปเก่าสุด)
  const topUps = await prisma.topUpRequest.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  })

  // 2. ดึงประวัติการใช้เหรียญ (ChapterAccess)
  const usages = await prisma.chapterAccess.findMany({
    where: { userId },
    include: {
      chapter: {
        include: {
          novel: { select: { title: true } } // ดึงชื่อนิยายมาด้วย
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] py-20 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">📜 ประวัติการทำรายการ</h1>
             <p className="text-sm text-slate-500 dark:text-slate-400">รายการเติมเงินและการใช้เหรียญย้อนหลัง</p>
          </div>
          <Link 
            href="/coin/topup" 
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            + เติมเหรียญเพิ่ม
          </Link>
        </div>

        {/* แสดงรายการ (Client Component) */}
        {/* แปลงประเภทข้อมูลให้ตรงกับ Type ที่กำหนดไว้ (แก้ปัญหา Type mismatch) */}
        <HistoryLists 
          topUps={JSON.parse(JSON.stringify(topUps))} 
          usages={JSON.parse(JSON.stringify(usages))} 
        />

        <div className="mt-8 text-center">
           <Link href="/profile" className="text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:underline">
             &larr; กลับไปหน้าโปรไฟล์
           </Link>
        </div>

      </div>
    </div>
  )
}