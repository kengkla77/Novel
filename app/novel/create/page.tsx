// app/novel/create/page.tsx
import { createNovel } from '@/app/actions'
import Link from 'next/link'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CoverUploadInput from '@/app/components/CoverUploadInput' // 👈 Import ตัวเช็คไฟล์

export default async function CreateNovelPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    // 🌓 1. พื้นหลังหลัก
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] py-12 px-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-2">เริ่มต้นจินตนาการของคุณ</h1>
          <p className="text-slate-500 dark:text-slate-400">สร้างสรรค์นิยายเรื่องใหม่สู่สายตานักอ่าน</p>
        </div>

        {/* 🌓 2. Main Form Card */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          
          <div className="h-1.5 w-full bg-slate-50 dark:bg-slate-800">
            <div className="h-full w-1/3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-r-full"></div>
          </div>

          <form action={createNovel} className="p-8 md:p-10 space-y-8">
            
            {/* ชื่อเรื่อง */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                ชื่อเรื่อง <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  name="title" 
                  required 
                  placeholder="ใส่ชื่อนิยายของคุณที่นี่..."
                  className="w-full text-xl md:text-2xl font-bold border-b-2 border-slate-300 dark:border-slate-600 bg-transparent py-3 px-2 focus:border-indigo-600 dark:focus:border-indigo-400 focus:outline-none transition-colors placeholder-slate-300 dark:placeholder-slate-600 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* รูปปก */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                รูปปกนิยาย (เลือก 1 วิธี)
              </label>
              
              <div className="grid md:grid-cols-2 gap-4">
                
                {/* Upload Card */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition group bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">อัปโหลดรูป</span>
                  </div>
                  
                  {/* 👇 ใช้ Component ป้องกันไฟล์เกิน 1MB */}
                  <CoverUploadInput /> 
                </div>

                {/* URL Card */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50/30 dark:hover:bg-purple-900/10 transition group bg-slate-50/50 dark:bg-slate-800/50">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    </div>
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">แปะลิงก์ (URL)</span>
                  </div>
                  <input 
                    type="url" 
                    name="coverUrl" 
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600"
                  />
                </div>

              </div>
            </div>

            {/* เรื่องย่อ */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                คำโปรย / เรื่องย่อ <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="description" 
                required 
                rows={6}
                placeholder="เรื่องราวเกี่ยวกับอะไร..."
                className="w-full border border-slate-200 dark:border-slate-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white leading-relaxed resize-none bg-white dark:bg-slate-900 shadow-inner"
              />
            </div>

            <div className="pt-6 flex flex-col-reverse md:flex-row gap-4">
              <Link href="/" className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 text-center transition">ยกเลิก</Link>
              <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none transition transform hover:-translate-y-0.5">✨ สร้างนิยาย</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}