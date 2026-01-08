// app/actions.ts
'use server'

import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs' // ต้องลง npm install bcryptjs @types/bcryptjs ก่อนนะ
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import { writeFile, mkdir } from 'fs/promises' // ใช้เขียนไฟล์ลงเครื่อง
import path from 'path'
import { auth } from '@/auth'
import twvoucher from '@fortune-inc/tw-voucher'
import QRCode from 'qrcode'

const prisma = new PrismaClient()


export async function register(prevState: any, formData: FormData) {
  const username = formData.get('username') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!username || !email || !password) {
    return { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' }
  }

  // 1. เช็คอีเมลซ้ำ
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: 'อีเมลนี้ถูกใช้งานแล้ว' }
  }

  // 2. Hash Password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. สร้าง User
  try {
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    })
  } catch (e) {
    return { error: 'เกิดข้อผิดพลาดในการสร้างบัญชี' }
  }

  // 4. ถ้าสำเร็จ ให้ redirect ไปหน้า login
  redirect('/login')
}



async function saveImageFile(file: File): Promise<string | null> {
  // เช็คว่าเป็นไฟล์รูปจริงไหม และขนาดไม่เกิน 5MB (ตัวอย่าง)
  if (!file || file.size === 0 || !file.type.startsWith('image/')) {
    return null
  }

  // แปลงไฟล์เป็น Buffer
  const buffer = Buffer.from(await file.arrayBuffer())
  
  // ตั้งชื่อไฟล์ใหม่กันซ้ำ (ใช้เวลาปัจจุบัน + นามสกุลเดิม)
  const filename = `${Date.now()}${path.extname(file.name)}`
  
  // ระบุที่อยู่ที่จะเซฟ (public/uploads)
  const uploadDir = path.join(process.cwd(), 'public/uploads')
  const filePath = path.join(uploadDir, filename)

  // เขียนไฟล์ลงเครื่อง
  await writeFile(filePath, buffer)

  // ส่งค่า path กลับไป (เพื่อให้ Database เก็บเป็น /uploads/ชื่อไฟล์.jpg)
  return `/uploads/${filename}`
}

// --- Create Novel ---
export async function createNovel(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  
  // รับค่าทั้ง 2 แบบ
  const coverUrl = formData.get('coverUrl') as string
  const coverFile = formData.get('coverFile') as File

  if (!title) return

  // Logic: ถ้ามีการอัปโหลดไฟล์ ให้ใช้ไฟล์ก่อน, ถ้าไม่มีค่อยไปใช้ URL
  let finalCoverImage = coverUrl || null
  
  // ถ้ามีการอัปโหลดไฟล์
  if (coverFile && coverFile.size > 0) {
    const savedPath = await saveImageFile(coverFile)
    if (savedPath) finalCoverImage = savedPath
  }

  await prisma.novel.create({
    data: { 
      title, 
      description,
      coverImage: finalCoverImage,
      authorId: Number(session.user.id)
    }
  })

  revalidatePath('/')
  redirect('/')
}

export async function updateNovel(id: number, formData: FormData) {
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  
  const coverUrl = formData.get('coverUrl') as string
  const coverFile = formData.get('coverFile') as File
  
  // เตรียมข้อมูลที่จะอัปเดต
  const dataToUpdate: any = { title, description }

  // เช็คเรื่องรูปภาพ
  if (coverFile && coverFile.size > 0) {
    // กรณีอัปไฟล์ใหม่
    const savedPath = await saveImageFile(coverFile)
    if (savedPath) dataToUpdate.coverImage = savedPath
  } else if (coverUrl) {
    // กรณีเปลี่ยน URL
    dataToUpdate.coverImage = coverUrl
  }
  // ถ้าไม่ทำอะไรเลย ก็จะใช้รูปเดิม (ไม่ไปยุ่งกับ field coverImage)

  await prisma.novel.update({
    where: { id },
    data: dataToUpdate
  })

  revalidatePath(`/novel/${id}`)
  redirect(`/novel/${id}`)
}



// 👇 แก้ไขฟังก์ชัน createChapter
export async function createChapter(prevState: any, formData: FormData) {
  const novelId = Number(formData.get('novelId'))
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const order = Number(formData.get('order'))

  if (!novelId || isNaN(novelId)) {
    return { error: 'ไม่พบรหัสอ้างอิงนิยาย (Novel ID)' }
  }

  try {
    await prisma.chapter.create({
      data: {
        title,
        content,
        order,
        novelId // ส่งค่าไปตรงนี้
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: `ลำดับตอนที่ ${order} มีอยู่แล้ว กรุณาเปลี่ยนเป็นเลขอื่น` }
    }
    return { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' }
  }

  revalidatePath(`/novel/${novelId}`)
  redirect(`/novel/${novelId}`)
}

export async function authenticate(
  prevState: string | undefined, // ต้องรับ prevState เป็น argument แรก
  formData: FormData
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false, // สำคัญ! เราจะ handle redirect เอง หรือให้ Client จัดการ
    });
    
    // ถ้าผ่าน ให้ redirect ไปหน้าแรก
    redirect('/'); 
    
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'อีเมลหรือรหัสผ่านไม่ถูกต้อง';
        default:
          return 'เกิดข้อผิดพลาดบางอย่าง';
      }
    }
    // ถ้าเป็น error จากการ redirect (Next.js redirect throws error) ให้ throw ต่อไป
    throw error;
  }
}




// --- 2. ฟังก์ชันลบนิยาย (Delete) ---
export async function deleteNovel(id: number) {
  // ลบ Chapters ที่เกี่ยวข้องก่อน (Cascade delete)
  // แต่ถ้าใน schema ไม่ได้ตั้ง cascade ไว้ ต้องลบมือแบบนี้:
  await prisma.chapter.deleteMany({
    where: { novelId: id }
  })

  // ลบตัวนิยาย
  await prisma.novel.delete({
    where: { id }
  })

  revalidatePath('/')
  redirect('/')
}


export async function updateChapter(prevState: any, formData: FormData) {
  const chapterId = Number(formData.get('chapterId'))
  const novelId = Number(formData.get('novelId'))
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const order = Number(formData.get('order'))
  const price = Number(formData.get('price') || 0)

  if (!chapterId || !novelId) return { error: 'ข้อมูลไม่ถูกต้อง' }

  try {
    await prisma.chapter.update({
      where: { id: chapterId },
      data: { title, content, order,price }
    })
  } catch (error: any) {
    // 🔴 ดักจับ Error เลขตอนซ้ำ
    if (error.code === 'P2002') {
      return { error: `ลำดับตอนที่ ${order} มีอยู่แล้ว กรุณาเปลี่ยนเป็นเลขอื่น` }
    }
    return { error: 'เกิดข้อผิดพลาดในการบันทึก' }
  }

  revalidatePath(`/novel/${novelId}/chapter/${chapterId}`)
  redirect(`/novel/${novelId}/chapter/${chapterId}`)
}

// --- 4. ลบตอน (Delete Chapter) ---
export async function deleteChapter(chapterId: number, novelId: number) {
  await prisma.chapter.delete({
    where: { id: chapterId }
  })

  // ลบเสร็จแล้ว ให้เด้งกลับไปหน้ารายชื่อตอน (Novel Detail)
  revalidatePath(`/novel/${novelId}`)
  redirect(`/novel/${novelId}`)
}


export async function addComment(novelId: number, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return // ถ้าไม่ได้ Login ห้ามคอมเมนต์

  const content = formData.get('content') as string
  if (!content) return

  await prisma.comment.create({
    data: {
      content,
      novelId,
      userId: Number(session.user.id)
    }
  })

  revalidatePath(`/novel/${novelId}`)
}

export async function deleteComment(commentId: number, novelId: number) {
  const session = await auth()
  if (!session) return

  // ลบใน Database
  await prisma.comment.delete({
    where: { id: commentId }
  })

  // รีเฟรชหน้า
  revalidatePath(`/novel/${novelId}`)
}

// --- BOOKMARK SYSTEM (Toggle) ---
export async function toggleBookmark(novelId: number) {
  const session = await auth()
  if (!session?.user?.id) return

  const userId = Number(session.user.id)

  // เช็คว่ามีอยู่แล้วไหม?
  const existing = await prisma.bookmark.findUnique({
    where: {
      userId_novelId: { userId, novelId } // ใช้ Composite Key ที่เราตั้งไว้
    }
  })

  if (existing) {
    // ถ้ามีแล้ว ให้ลบออก (Un-bookmark)
    await prisma.bookmark.delete({
      where: { id: existing.id }
    })
  } else {
    // ถ้ายังไม่มี ให้เพิ่มใหม่
    await prisma.bookmark.create({
      data: { userId, novelId }
    })
  }

  revalidatePath(`/novel/${novelId}`)
}

// --- LIKE SYSTEM (Toggle) ---
export async function toggleLike(novelId: number) {
  const session = await auth()
  if (!session?.user?.id) return

  const userId = Number(session.user.id)

  const existing = await prisma.like.findUnique({
    where: { userId_novelId: { userId, novelId } }
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
  } else {
    await prisma.like.create({ data: { userId, novelId } })
  }

  revalidatePath(`/novel/${novelId}`)
}

// app/actions.ts (เพิ่มต่อท้ายไฟล์)



import { join } from 'path'

export async function updateAvatar(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user?.id) return { error: 'กรุณาเข้าสู่ระบบ' }

  const file = formData.get('avatarFile') as File
  if (!file || file.size === 0) return { error: 'ไม่พบไฟล์รูปภาพ' }
  
  // ⚠️ เช็คขนาดไฟล์ (Server Side Validation)
  if (file.size > 2 * 1024 * 1024) return { error: 'ไฟล์ใหญ่เกิน 2MB' }

  try {
    // 1. อ่านไฟล์และแปลงเป็น Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 2. ตั้งชื่อไฟล์ใหม่ (กันชื่อซ้ำ)
    const filename = `avatar-${session.user.id}-${Date.now()}.jpg`
    
    // 3. เตรียม Path (โฟลเดอร์ public/uploads)
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    
    // สร้างโฟลเดอร์ถ้ายังไม่มี
    try { await mkdir(uploadDir, { recursive: true }) } catch (e) {}

    // 4. บันทึกไฟล์ลงเครื่อง
    await writeFile(join(uploadDir, filename), buffer)
    const imageUrl = `/uploads/${filename}`

    // 5. อัปเดต Database
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { image: imageUrl }
    })

    // 6. รีเฟรชหน้า Profile
    revalidatePath('/profile')
    return { success: true }

  } catch (error) {
    console.error('Upload Error:', error)
    return { error: 'เกิดข้อผิดพลาดในการอัปโหลด' }
  }
}

// app/actions.ts (เพิ่มต่อท้ายไฟล์)

// 💰 1. จำลองการเติมเงิน (Mock Top-up)
export async function topUpCoins(amount: number) {
  const session = await auth()
  if (!session?.user?.id) return

  await prisma.user.update({
    where: { id: Number(session.user.id) },
    data: { coins: { increment: amount } }
  })
  
  revalidatePath('/profile')
  revalidatePath('/')
}

// 🔓 2. ระบบปลดล็อคตอน
export async function unlockChapter(chapterId: number, price: number) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'กรุณาเข้าสู่ระบบ' }

  const userId = Number(session.user.id)

  // ดึงข้อมูล User ล่าสุดเพื่อเช็คเงิน
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user || user.coins < price) {
    return { error: 'เหรียญไม่พอ! กรุณาเติมเหรียญก่อนครับ' }
  }

  // หักเงิน และ เพิ่มสิทธิ์การอ่าน (Transaction)
  try {
    await prisma.$transaction([
      // 1. หักเงินคนอ่าน
      prisma.user.update({
        where: { id: userId },
        data: { coins: { decrement: price } }
      }),
      // 2. บันทึกสิทธิ์การอ่าน
      prisma.chapterAccess.create({
        data: { userId, chapterId }
      })
      // (อนาคตสามารถเพิ่ม Logic: แบ่งเงินให้นักเขียนตรงนี้ได้)
    ])
  } catch (e) {
    return { error: 'เกิดข้อผิดพลาด หรือคุณอาจจะซื้อตอนนี้ไปแล้ว' }
  }

  revalidatePath(`/novel/[id]/chapter/${chapterId}`) // รีเฟรชหน้าอ่านนิยาย
  return { success: true }
}

/// เบอร์วอลเล็ตของคุณที่จะใช้รับเงิน (เปลี่ยนเป็นเบอร์จริงของคุณ)
const MY_WALLET_PHONE = '0945734320' 

export async function redeemAngpao(link: string) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'กรุณาเข้าสู่ระบบ' }

  // ตรวจสอบว่าเป็นลิงก์ TrueMoney จริงไหม
  if (!link.includes('gift.truemoney.com')) {
    return { error: 'ลิงก์ไม่ถูกต้อง กรุณาใช้ลิงก์ซองของขวัญจาก TrueMoney' }
  }

  try {
    // 🚀 2. สั่งให้ไลบรารีไปกดรับซองเข้าเบอร์เรา
    const result = await twvoucher(MY_WALLET_PHONE, link) 
    
    // ถ้าสำเร็จ ไลบรารีจะคืนค่ากลับมาประมาณนี้:
    // { amount: 100, owner_full_name: 'Somchai', ... }

    const amountReceived = parseFloat(result.amount)

    // ✅ 3. บันทึกเหรียญให้ User
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { coins: { increment: amountReceived } }
    })

    revalidatePath('/profile')
    return { success: true, amount: amountReceived }

  } catch (error: any) {
    console.error('Redeem Error:', error)
    // กรณีรับไม่ได้ (ลิงก์ผิด, ซองหมดอายุ, หรือมีคนรับไปแล้ว)
    return { error: 'เติมเงินไม่สำเร็จ: ซองนี้อาจถูกรับไปแล้ว หรือลิงก์หมดอายุ' }
  }
}





export async function uploadSlip(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) return { error: 'กรุณาเข้าสู่ระบบ' }

  const amount = Number(formData.get('amount'))
  const file = formData.get('slip') as File

  if (!file || file.size === 0) {
    return { error: 'กรุณาอัปโหลดรูปสลิป' }
  }

  try {
    // 1. แปลงไฟล์เป็น Buffer เพื่อบันทึก
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // 2. ตั้งชื่อไฟล์ใหม่ไม่ให้ซ้ำ (เช่น slip-123456789.png)
    const filename = `slip-${Date.now()}-${file.name.replaceAll(' ', '_')}`
    
    // 3. ตรวจสอบว่ามีโฟลเดอร์ public/slips หรือยัง (ถ้าไม่มีให้สร้าง)
    const uploadDir = path.join(process.cwd(), 'public/slips')
    await mkdir(uploadDir, { recursive: true })
    
    // 4. บันทึกไฟล์ลงเครื่อง
    await writeFile(path.join(uploadDir, filename), buffer)
    
    // 5. บันทึกลง Database (สถานะ PENDING)
    await prisma.topUpRequest.create({
      data: {
        amount: amount,
        proofImage: `/slips/${filename}`, // เก็บ path เพื่อไปเรียกใช้ใน img src
        userId: Number(session.user.id),
        status: 'PENDING'
      }
    })

    return { success: true }

  } catch (error) {
    console.error(error)
    return { error: 'เกิดข้อผิดพลาดในการอัปโหลด' }
  }
}




const generatePayload = require('promptpay-qr')

// ⚠️ แก้เป็นเบอร์พร้อมเพย์ของคุณ (เบอร์มือถือ หรือ รหัสประชาชน)
const MY_PROMPTPAY_ID = '0945734320' 

export async function generatePromptPayQR(amount: number) {
  // ฟังก์ชันนี้ทำงานฝั่ง Server
  try {
    // 1. สร้าง Payload (รหัสข้อความยาวๆ ตามมาตรฐานธนาคาร)
    const payload = generatePayload(MY_PROMPTPAY_ID, { amount })
    
    // 2. แปลงรหัสนั้นเป็นรูปภาพ QR Code (แบบ Base64)
    const qrImage = await QRCode.toDataURL(payload)
    
    return { success: true, qrImage }
  } catch (err) {
    console.error('QR Gen Error:', err)
    return { error: 'ไม่สามารถสร้าง QR Code ได้' }
  }
}



export async function approveTopUp(requestId: number, formData: FormData) {
  const session = await auth()
  
  const me = await prisma.user.findUnique({ where: { id: Number(session?.user?.id) } })
  if (me?.role !== 'ADMIN') return // ❌ ไม่ต้อง return object error

  const request = await prisma.topUpRequest.findUnique({ where: { id: requestId } })
  if (!request || request.status !== 'PENDING') return // ❌ ไม่ต้อง return

  await prisma.$transaction([
    prisma.topUpRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED' }
    }),
    prisma.user.update({
      where: { id: request.userId },
      data: { coins: { increment: request.amount } }
    })
  ])

  revalidatePath('/admin/topup')
  // ❌ ลบบรรทัด return { success: true } ทิ้งไปเลยครับ
}

export async function rejectTopUp(requestId: number, formData: FormData) {
  const session = await auth()
  const me = await prisma.user.findUnique({ where: { id: Number(session?.user?.id) } })
  
  if (me?.role !== 'ADMIN') return

  await prisma.topUpRequest.update({
    where: { id: requestId },
    data: { status: 'REJECTED' }
  })

  revalidatePath('/admin/topup')
  // ❌ ลบบรรทัด return { success: true } ทิ้งเหมือนกัน
}