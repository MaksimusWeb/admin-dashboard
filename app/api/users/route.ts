import { NextResponse, NextRequest } from 'next/server';
import { getUsers, createNewUser } from '../../lib/db';
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { prisma } from '../../lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await prisma.user.findMany()
  return Response.json(users)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Имя и email обязательны' },
        { status: 400 }
      )
    }

    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: body.role || 'user',
      }
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error: any) {
    console.error('Ошибка создания пользователя:', error)

    // Обработка дубликата email
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email уже используется' },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
