// app/admin/topup/page.tsx
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { approveTopUp, rejectTopUp } from '@/app/actions'

const prisma = new PrismaClient()

// ฟังก์ชันช่วยคำนวณ "ส่งเมื่อ ... ที่แล้ว"
function timeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + " ปีที่แล้ว"
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + " เดือนที่แล้ว"
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + " วันที่แล้ว"
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + " ชั่วโมงที่แล้ว"
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + " นาทีที่แล้ว"
  return "เมื่อสักครู่นี้"
}

export default async function AdminTopUpPage() {
  const session = await auth()
  
  // เช็ค User และ ID ให้ชัวร์
  if (!session || !session.user || !(session.user as any).id) {
    redirect('/login')
  }

  const userId = Number((session.user as any).id)
  const user = await prisma.user.findUnique({ where: { id: userId } })
  
  if (user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold bg-[#111]">
        ⛔ Access Denied: สำหรับผู้ดูแลระบบเท่านั้น
      </div>
    )
  }

  // ดึงรายการสถานะ PENDING
  const pendingRequests = await prisma.topUpRequest.findMany({
    where: { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'asc' }
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111] p-4 md:p-8 transition-colors">
      <div className="max-w-6xl mx-auto mt-16"> {/* เพิ่ม mt-16 หลบ Navbar */}
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            👮‍♂️ ตรวจสอบสลิป 
            <span className="bg-red-500 text-white text-base px-3 py-1 rounded-full shadow-md">
              รอตรวจ {pendingRequests.length} รายการ
            </span>
          </h1>
          <div className="text-sm text-slate-500 dark:text-slate-400">
             (ตรวจสอบยอดเงินในแอปธนาคารของคุณเทียบกับข้อมูลด้านล่าง)
          </div>
        </div>

        {pendingRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">ไม่มีรายการค้างตรวจสอบ</p>
            <p className="text-slate-400 text-sm mt-2">พักผ่อนได้เลยแอดมิน!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {pendingRequests.map((req) => (
              <div key={req.id} className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col hover:border-indigo-500/50 transition duration-300">
                
                {/* 🔍 ส่วนแสดงเวลา (ไฮไลท์สำคัญ) */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 border-b border-indigo-100 dark:border-indigo-900/30 flex justify-between items-center text-sm">
                   <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     {/* แสดงเวลาแบบละเอียด */}
                     {new Date(req.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} น.
                   </div>
                   <span className="text-xs text-slate-500 dark:text-slate-400">
                     ({timeAgo(req.createdAt)})
                   </span>
                </div>

                {/* รูปสลิป */}
                <div className="relative h-72 bg-slate-200 dark:bg-[#000] group cursor-pointer border-b border-slate-100 dark:border-slate-800">
                  <a href={req.proofImage} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={req.proofImage} 
                      alt="Slip" 
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                      <svg className="w-12 h-12 text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                      <span className="text-white font-bold text-lg">คลิกเพื่อดูรูปเต็ม</span>
                    </div>
                  </a>
                </div>

                {/* ข้อมูล User & ยอดเงิน */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                        {req.user.username}
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-500">ID: {req.user.id}</span>
                      </h3>
                    </div>
                    
                    <p className="text-xs text-slate-400 mb-4">
                      วันที่: {new Date(req.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-center mb-4">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">ยอดแจ้งโอน</p>
                      <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
                        {req.amount.toLocaleString()} <span className="text-base font-medium text-slate-400">บาท</span>
                      </p>
                    </div>
                  </div>

                  {/* ปุ่ม Action */}
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <form action={rejectTopUp.bind(null, req.id)} className="w-full">
                      <button className="w-full py-2.5 border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        ปฏิเสธ
                      </button>
                    </form>
                    
                    <form action={approveTopUp.bind(null, req.id)} className="w-full">
                      <button className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition shadow-lg shadow-green-200 dark:shadow-none flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                        อนุมัติยอด
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}