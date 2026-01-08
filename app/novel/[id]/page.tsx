// app/novel/[id]/page.tsx
import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import { deleteNovel } from '@/app/actions'
import ActionButtons from '@/app/components/ActionButtons'
import CommentSection from '@/app/components/CommentSection'
import DeleteButton from '@/app/components/DeleteButton'

const prisma = new PrismaClient()

// 👇 อัปเดตฟังก์ชันนี้ให้รับ userId เพื่อเช็คว่าซื้อตอนไหนไปบ้าง
async function getNovel(id: string, userId?: number) {
  return await prisma.novel.findUnique({
    where: { id: Number(id) },
    include: {
      chapters: { 
        orderBy: { order: 'asc' },
        // 👇 ดึงข้อมูลการซื้อ (accesses) ของ User คนนี้มาด้วย
        include: {
          accesses: {
            where: { userId: userId || -1 }
          }
        }
      },
      comments: { include: { user: true }, orderBy: { createdAt: 'desc' } },
      _count: { select: { likes: true, bookmarks: true } },
      author: true
    },
  })
}

async function getUserStatus(userId: number | undefined, novelId: number) {
  if (!userId) return { isLiked: false, isBookmarked: false }
  const [like, bookmark] = await Promise.all([
    prisma.like.findUnique({ where: { userId_novelId: { userId, novelId } } }),
    prisma.bookmark.findUnique({ where: { userId_novelId: { userId, novelId } } })
  ])
  return { isLiked: !!like, isBookmarked: !!bookmark }
}

type Props = { params: Promise<{ id: string }> }

export default async function NovelDetail(props: Props) {
  const params = await props.params;
  const id = params.id;

  const session = await auth()
  const userId = session?.user?.id ? Number(session.user.id) : undefined

  // 👇 ส่ง userId เข้าไปใน query
  const novel = await getNovel(id, userId)
  if (!novel) notFound()

  const isOwner = session?.user && userId === novel.authorId
  const userStatus = await getUserStatus(userId, novel.id)
  const deleteNovelWithId = deleteNovel.bind(null, novel.id)

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#111] transition-colors duration-300 pb-20">

      {/* Header Banner */}
      <div className="h-64 w-full bg-gradient-to-r from-slate-900 to-slate-800 absolute top-16 left-0 z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 pt-10">

        {/* Main Content Box */}
        <div className="bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-visible md:overflow-hidden relative transition-colors">
          <div className="md:flex items-start">

            {/* Cover Image */}
            <div className="md:w-1/3 md:flex-shrink-0 p-6 md:p-8 md:pr-0 flex justify-center md:block relative -mt-20 md:mt-0 z-20">
              <div className="aspect-[2/3] w-48 md:w-full relative group rounded-2xl shadow-2xl shadow-indigo-500/30 overflow-hidden ring-4 ring-white dark:ring-slate-700 transition-all duration-300 hover:scale-[1.02] hover:shadow-indigo-500/40">
                {novel.coverImage ? (
                  <img src={novel.coverImage} alt={novel.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-300 dark:text-slate-600">
                    <span className="text-5xl mb-2">📖</span>
                    <span className="text-sm font-medium">No Cover</span>
                  </div>
                )}
              </div>
            </div>

            {/* Info Section */}
            <div className="p-8 md:p-10 flex-1 flex flex-col pt-4 md:pt-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-2 items-center">
                  <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">นิยาย</span>
                  {isOwner && (
                    <div className="flex gap-2 items-center ml-2">
                      <Link href={`/novel/${novel.id}/edit`} className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition">แก้ไข</Link>
                      <DeleteButton action={deleteNovelWithId} />
                    </div>
                  )}
                </div>
                <span className="text-slate-400 text-sm">{new Date(novel.updatedAt).toLocaleDateString('th-TH')}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">{novel.title}</h1>
              <div className="text-slate-500 dark:text-slate-400 font-medium mb-6 flex items-center gap-2">
                <span>เขียนโดย</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold underline decoration-2 underline-offset-2">{novel.author?.username || 'นิรนาม'}</span>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 mb-8 border-y border-slate-100 dark:border-slate-800 py-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></div>
                  <div className="flex flex-col"><span className="text-sm font-bold text-slate-900 dark:text-slate-200">{novel.viewCount.toLocaleString()}</span><span className="text-xs">คนอ่าน</span></div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="p-2 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg></div>
                  <div className="flex flex-col"><span className="text-sm font-bold text-slate-900 dark:text-slate-200">{novel._count.likes.toLocaleString()}</span><span className="text-xs">ถูกใจ</span></div>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                  <div className="flex flex-col"><span className="text-sm font-bold text-slate-900 dark:text-slate-200">{novel.chapters.length}</span><span className="text-xs">ตอน</span></div>
                </div>
              </div>

              <div className="mb-6"><ActionButtons novelId={novel.id} isLiked={userStatus.isLiked} isBookmarked={userStatus.isBookmarked} likeCount={novel._count.likes} hasUser={!!session} /></div>

              <div className="prose prose-slate dark:prose-invert text-slate-600 dark:text-slate-300 mb-8 flex-1">
                <h3 className="text-slate-900 dark:text-white font-bold mb-2">เรื่องย่อ</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{novel.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            
            <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  📑 สารบัญตอน <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-full">{novel.chapters.length}</span>
                </h3>
                {isOwner && (
                  <Link href={`/novel/${novel.id}/create-chapter`} className="text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">
                    + เพิ่มตอนใหม่
                  </Link>
                )}
              </div>

              {novel.chapters.length > 0 ? (
                <ul className="space-y-3">
                  {novel.chapters.map((chapter) => {
                    // 👇 ตรวจสอบสิทธิ์ (เจ้าของ / ฟรี / ซื้อแล้ว)
                    const isUnlocked = isOwner || chapter.price === 0 || chapter.accesses.length > 0
                    
                    return (
                      <li key={chapter.id}>
                        <Link 
                          href={`/novel/${novel.id}/chapter/${chapter.id}`} 
                          // 👇 ใช้ visited:text-slate-400 เพื่อให้ตอนที่เคยอ่านแล้วเป็นสีเทา
                          className="group flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition visited:text-slate-400 dark:visited:text-slate-600"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-slate-400 dark:text-slate-500 font-mono text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-400">#{chapter.order}</span>
                            
                            {/* ชื่อตอน (สีปกติจะเป็น slate-700 แต่ถ้า visited จะโดน override เป็นเทาอ่อน) */}
                            <span className="font-medium text-slate-700 dark:text-slate-200 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition line-clamp-1 group-visited:text-slate-400 dark:group-visited:text-slate-600">
                                {chapter.title}
                            </span>
                            
                            {/* 👇 Logic แสดงผลกุญแจ */}
                            {chapter.price > 0 && (
                              isUnlocked ? (
                                // 🔓 กรณีปลดล็อคแล้ว (สีเขียว + กุญแจเปิด)
                                <span className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-900/50">
                                  🔓 ซื้อแล้ว
                                </span>
                              ) : (
                                // 🔒 กรณีล็อคอยู่ (สีเหลือง + กุญแจปิด + ราคา)
                                <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-full border border-yellow-100 dark:border-yellow-900/50">
                                  🔒 {chapter.price}
                                </span>
                              )
                            )}

                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                              {chapter.viewCount.toLocaleString()}
                            </div>
                            <span className="text-xs text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 px-2 py-1 rounded border border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-800">อ่าน</span>
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-700 rounded-xl">
                  <p className="text-slate-400 dark:text-slate-500">ยังไม่มีตอน</p>
                </div>
              )}
            </div>

            <div className="mt-10">
              <CommentSection 
                novelId={novel.id} 
                comments={novel.comments} 
                hasUser={!!session} 
                currentUserId={userId}
                authorId={novel.authorId || undefined}
              />
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-indigo-900 dark:bg-indigo-950 text-white rounded-2xl p-6 shadow-lg sticky top-24 border border-indigo-800 dark:border-indigo-900">
              <h3 className="font-bold text-lg mb-4">📢 แนะนำ</h3>
              <p className="text-indigo-200 text-sm mb-4">อ่านนิยายเรื่องนี้แล้ว อย่าลืมกดหัวใจและเพิ่มเข้าชั้นหนังสือ เพื่อเป็นกำลังใจให้นักเขียนด้วยนะครับ!</p>
              <div className="h-1 w-full bg-indigo-800 dark:bg-indigo-900 rounded-full mb-4"></div>
              <p className="text-xs text-indigo-300 text-center">© MyNovel App</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}