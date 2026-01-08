// app/components/CommentSection.tsx
'use client'

import { addComment, deleteComment } from '@/app/actions'
import { useRef } from 'react'
import DeleteCommentButton from './DeleteCommentButton'

// 👇 1. อัปเดต Type ให้รับค่า image มาด้วย
type Comment = {
  id: number
  content: string
  createdAt: Date
  user: { 
    id: number; 
    username: string;
    image: string | null // 👈 เพิ่มบรรทัดนี้ครับ
  }
}

type Props = {
  novelId: number
  comments: Comment[]
  hasUser: boolean
  currentUserId?: number
  authorId?: number
}

export default function CommentSection({ novelId, comments, hasUser, currentUserId, authorId }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="mt-12 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">💬 ความคิดเห็น</h3>
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-full font-bold">
          {comments.length}
        </span>
      </div>

      {/* 1. กล่องเขียนคอมเมนต์ */}
      <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 mb-10 transition-colors">
        {hasUser ? (
          <form 
            action={async (formData) => {
              await addComment(novelId, formData)
              formRef.current?.reset()
            }} 
            ref={formRef}
          >
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">แสดงความคิดเห็นของคุณ</label>
            <textarea
              name="content"
              required
              rows={4}
              placeholder="เขียนข้อความที่นี่... (ให้กำลังใจนักเขียน หรือติชมผลงาน)"
              className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#111] focus:bg-white dark:focus:bg-[#111] focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 transition"
            />
            <div className="mt-4 flex justify-end">
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold shadow-md shadow-indigo-200 dark:shadow-none transition transform hover:-translate-y-0.5"
              >
                ส่งความคิดเห็น 🚀
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
            <p className="text-slate-500 dark:text-slate-400 mb-2">คุณต้องเข้าสู่ระบบก่อนแสดงความคิดเห็น</p>
            <a href="/login" className="inline-block text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
              เข้าสู่ระบบ / สมัครสมาชิก
            </a>
          </div>
        )}
      </div>

      {/* 2. รายการคอมเมนต์ */}
      <div className="space-y-6">
        {comments.map((comment) => {
          const canDelete = currentUserId === comment.user.id || currentUserId === authorId
          const deleteAction = deleteComment.bind(null, comment.id, novelId)

          return (
            <div key={comment.id} className="flex gap-4 group">
              
              {/* 👇 2. ส่วน Avatar ที่แก้ไขใหม่ */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 relative bg-slate-200 dark:bg-slate-800">
                {comment.user.image ? (
                  // ✅ ถ้ามีรูป ให้แสดงรูป
                  <img 
                    src={comment.user.image} 
                    alt={comment.user.username} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  // ❌ ถ้าไม่มีรูป ให้แสดงตัวอักษรย่อเหมือนเดิม
                  <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    {comment.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content Bubble */}
              <div className="flex-1">
                <div className="bg-white dark:bg-[#1e1e1e] p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 dark:border-slate-800 group-hover:border-indigo-100 dark:group-hover:border-slate-700 transition relative">
                  
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-200 text-base">
                          {comment.user.username}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {new Date(comment.createdAt).toLocaleDateString('th-TH', { 
                            day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' 
                          })}
                        </span>
                    </div>
                    
                    {canDelete && (
                      <div className="opacity-0 group-hover:opacity-100 transition">
                         <DeleteCommentButton action={deleteAction} />
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {comment.content}
                  </p>

                </div>
              </div>
            </div>
          )
        })}

        {comments.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-600">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            <p>ยังไม่มีความคิดเห็น</p>
            <p className="text-sm">เป็นคนแรกที่เริ่มพูดคุยเลย!</p>
          </div>
        )}
      </div>

    </div>
  )
}