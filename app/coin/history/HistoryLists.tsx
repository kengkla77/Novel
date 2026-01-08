// app/coin/history/HistoryLists.tsx
'use client'

import { useState } from 'react'

type TopUp = {
  id: number
  amount: number
  status: string
  createdAt: Date
  proofImage: string
}

type Usage = {
  id: number
  createdAt: Date
  chapter: {
    title: string
    price: number // 👈 1. ตรวจสอบว่าใน Database มี field price ไหม (ถ้าไม่มีให้แก้เป็น number | null)
    novel: {
      title: string
    }
  }
}

export default function HistoryLists({ 
  topUps, 
  usages 
}: { 
  topUps: TopUp[], 
  usages: Usage[] 
}) {
  const [activeTab, setActiveTab] = useState<'topup' | 'usage'>('topup')

  return (
    <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden min-h-[500px]">
      
      {/* ส่วนหัว Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button 
          onClick={() => setActiveTab('topup')}
          className={`flex-1 py-4 text-sm font-bold transition ${activeTab === 'topup' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          📥 ประวัติการเติมเงิน
        </button>
        <button 
          onClick={() => setActiveTab('usage')}
          className={`flex-1 py-4 text-sm font-bold transition ${activeTab === 'usage' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-b-2 border-orange-600' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
        >
          📤 ประวัติการใช้เหรียญ
        </button>
      </div>

      <div className="p-6">
        
        {/* TAB 1: ประวัติการเติมเงิน */}
        {activeTab === 'topup' && (
          <div className="space-y-4">
            {topUps.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-4xl mb-2">💸</p>
                <p>ยังไม่มีประวัติการเติมเงิน</p>
              </div>
            ) : (
              topUps.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-600' :
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {item.status === 'APPROVED' ? '✅' : item.status === 'REJECTED' ? '❌' : '⏳'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white">เติมเงินเข้าระบบ</p>
                      <p className="text-xs text-slate-500">
                        {new Date(item.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-green-600 dark:text-green-400">
                      +{item.amount.toLocaleString()} 🪙
                    </p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status === 'APPROVED' ? 'สำเร็จ' : item.status === 'REJECTED' ? 'ไม่สำเร็จ' : 'รอตรวจสอบ'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: ประวัติการใช้เหรียญ (แก้ไขใหม่ ✨) */}
        {activeTab === 'usage' && (
          <div className="space-y-4">
            {usages.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-4xl mb-2">🔐</p>
                <p>ยังไม่มีประวัติการใช้เหรียญ</p>
              </div>
            ) : (
              usages.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-orange-200 dark:hover:border-orange-900 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center text-lg">
                      🔓
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 dark:text-white text-sm line-clamp-1">
                        {item.chapter.novel.title}
                      </p>
                      <div className="flex items-center gap-2">
                         <span className="text-xs bg-slate-200 dark:bg-slate-700 px-1.5 rounded text-slate-600 dark:text-slate-300">
                           ตอน: {item.chapter.title}
                         </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(item.createdAt).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  
                  {/* 👇 ส่วนที่แก้: แสดงราคา (ถ้าฟรีให้ขึ้นว่า ฟรี) */}
                  <div className="text-right">
                    <p className="font-bold text-lg text-red-500 dark:text-red-400">
                      {item.chapter.price > 0 ? `-${item.chapter.price.toLocaleString()}` : 'ฟรี'} 🪙
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium">ปลดล็อคแล้ว</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  )
}