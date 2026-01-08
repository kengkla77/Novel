// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth"; // เรียกใช้จากไฟล์ auth.ts ที่เพิ่งสร้าง

export const { GET, POST } = handlers;