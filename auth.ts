// auth.ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // ✅ เปลี่ยน key ที่รับค่าเป็น identifier เพื่อให้ตรงกับหน้า Form
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) return null;

        const identifier = credentials.identifier as string;
        const password = credentials.password as string;

        if (!identifier || !password) return null;

        // ✅ 🔍 ค้นหาจาก Email หรือ Username
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: identifier },
              { username: identifier }
            ]
          }
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        // คืนค่า User
        return {
            id: String(user.id),
            email: user.email,
            name: user.username,
            role: user.role // ถ้าใน type User ของ NextAuth ไม่ได้รับ field role อาจต้องไปแก้ types/next-auth.d.ts เพิ่มเติม
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        // ถ้าต้องการส่ง role ไปด้วยใน session
        // (session.user as any).role = token.role; 
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        // (token as any).role = user.role;
      }
      return token;
    }
  },
  secret: process.env.AUTH_SECRET,
});