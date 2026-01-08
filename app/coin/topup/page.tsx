// app/coin/topup/page.tsx
import Link from 'next/link'

export default function TopUpSelectionPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#111] py-20 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            🏦 เติมเหรียญเข้าระบบ
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            เลือกช่องทางการชำระเงินที่คุณสะดวกที่สุด
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          {/* 1. TrueMoney Ang Pao (ซองของขวัญ) */}
          <Link 
            href="/coin/topup/truemoney" 
            className="group relative bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-orange-400 dark:hover:border-orange-500 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center"
          >
            {/* ลายน้ำด้านหลัง */}
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition duration-500 transform rotate-12 group-hover:rotate-0 group-hover:scale-110">
               <img src="/truemoney.png" alt="TrueMoney Logo" className="w-48 h-48 object-contain grayscale" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-sm">
                <span className="text-4xl">🧧</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-orange-500 transition">
                ซองของขวัญ TrueMoney
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                สะดวก รวดเร็ว ไม่มีค่าธรรมเนียม <br/>เพียงวางลิงก์ซองของขวัญ
              </p>
              <span className="px-6 py-2 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg shadow-orange-200 dark:shadow-none group-hover:shadow-orange-400/50 transition">
                เลือกเติมเงิน
              </span>
            </div>
          </Link>

          {/* 2. QR Payment / แนบสลิป (เปิดใช้งานแล้ว! ✅) */}
          <Link 
            href="/coin/topup/qrcode"
            className="group relative bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl border-2 border-slate-100 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center"
          >
            {/* ลายน้ำด้านหลัง */}
            <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition duration-500 transform -rotate-12 group-hover:rotate-0 group-hover:scale-110">
               <img src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png" className="w-48 h-48 object-contain grayscale" />
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition shadow-sm">
                 <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-500 transition">
                สแกนจ่าย / แนบสลิป
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                สแกน QR Code ผ่านแอปธนาคาร <br/>แล้วแนบรูปสลิปเพื่อยืนยัน
              </p>
              
              <span className="px-6 py-2 bg-white dark:bg-slate-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold group-hover:bg-blue-500 group-hover:text-white transition shadow-lg shadow-blue-100 dark:shadow-none">
                สร้าง QR Code
              </span>
            </div>
          </Link>

        </div>
        
        <div className="mt-12 text-center">
           <p className="text-xs text-slate-400">
             พบปัญหาการเติมเงิน? <a href="#" className="text-indigo-500 hover:underline">ติดต่อแอดมิน</a>
           </p>
        </div>

      </div>
    </div>
  )
}