import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'

declare module 'next-auth' {
  interface User {
    role?: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role?: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    providers: [
      CredentialsProvider({
        name: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) {
            return null
          }
        
          // Для демо - простая проверка пароля, создаем пользователя если нет
          if (credentials.password !== 'admin123') {
            return null
          }
        
          // Ищем или создаем пользователя
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
        
          if (!user) {
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.email.split('@')[0], // Имя из email
                role: 'admin'
              }
            })
          }
        
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        }
      })
    ],
    session: {
      strategy: 'jwt'
    },
    pages: {
      signIn: '/auth/signin',
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role
        }
        return token
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.sub!
          session.user.role = token.role as string
        }
        return session
      }
    }
  }