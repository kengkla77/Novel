// app/novel/[id]/edit/page.tsx
import { PrismaClient } from '@prisma/client'
import { updateNovel } from '@/app/actions'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/auth'
import CoverUploadInput from '@/app/components/CoverUploadInput' // 👈 Import ตัวเช็คไฟล์

const prisma = new PrismaClient()

type Props = { params: Promise<{ id: string }> }

export default async function EditNovelPage(props: Props) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = await props.params;
  const id = Number(params.id)
  const novel = await prisma.novel.findUnique({ where: { id } })
  if (!novel) notFound()

  const updateNovelWithId = updateNovel.bind(null, id)

  return (
    // 🌓 1. พื้นหลังหลัก
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] py-12 px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">แก้ไขผลงาน</h1>
          <p className="text-slate-500 dark:text-slate-400">ปรับปรุงรายละเอียด: <span className="font-bold text-slate-700 dark:text-slate-300">{novel.title}</span></p>
        </div>

        {/* 🌓 2. Main Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          
          <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800">
            <div className="h-full w-1/3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-r-full"></div>
          </div>

          <form action={updateNovelWithId} className="p-8 md:p-10 space-y-8">
            
            {/* ชื่อเรื่อง */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                ชื่อเรื่อง
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  name="title" 
                  required 
                  defaultValue={novel.title}
                  className="w-full text-xl md:text-2xl font-bold border-b-2 border-slate-300 dark:border-slate-600 bg-transparent py-3 px-2 focus:border-yellow-500 dark:focus:border-yellow-400 focus:outline-none transition-colors placeholder-slate-300 dark:placeholder-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* รูปปก */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                รูปปกนิยาย
              </label>
              
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Preview รูปเดิม */}
                <div className="flex-shrink-0 mx-auto md:mx-0 w-32 h-48 bg-slate-100 dark:bg-slate-800 rounded-lg shadow-md overflow-hidden relative ring-4 ring-white dark:ring-slate-700">
                    {novel.coverImage ? ( <img src={novel.coverImage} className="w-full h-full object-cover" /> ) : ( <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600 text-2xl">📖</div> )}
                    <div className="absolute bottom-0 w-full bg-black/50 text-white text-[10px] text-center py-1">ปัจจุบัน</div>
                </div>

                <div className="flex-1 w-full space-y-4">
                   {/* Upload */}
                   <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-yellow-400 dark:hover:border-yellow-500 hover:bg-yellow-50/30 dark:hover:bg-yellow-900/10 transition group bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        เปลี่ยนรูป (อัปโหลด)
                      </div>
                      
                      {/* 👇 ใช้ Component ป้องกันไฟล์เกิน 1MB */}
                      <CoverUploadInput /> 
                   </div>

                   {/* URL */}
                   <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-orange-400 dark:hover:border-orange-500 hover:bg-orange-50/30 dark:hover:bg-orange-900/10 transition group bg-slate-50/50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold text-sm">
                        <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        เปลี่ยนรูป (URL Link)
                      </div>
                      <input 
                        type="url" 
                        name="coverUrl" 
                        placeholder="https://..." 
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600" 
                      />
                   </div>
                </div>
              </div>
            </div>

            {/* คำโปรย */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                คำโปรย
              </label>
              <textarea 
                name="description" 
                required 
                rows={6}
                defaultValue={novel.description || ''}
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 outline-none text-slate-900 dark:text-white leading-relaxed resize-none bg-white dark:bg-slate-900 shadow-inner"
              />
            </div>

            <div className="pt-6 flex flex-col-reverse md:flex-row gap-4">
              <Link 
                href={`/novel/${id}`}
                className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition"
              >
                ยกเลิก
              </Link>
              <button 
                type="submit" 
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-yellow-200 dark:shadow-none transition transform hover:-translate-y-0.5"
              >
                บันทึกการแก้ไข
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}