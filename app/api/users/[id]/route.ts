import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error('Ошибка получения пользователя:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, role } = body

    if (!name || name.trim() === '' || !email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Имя и email не могут быть пустыми' },
        { status: 400 }
      )
    }

    // Проверяем существование пользователя
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role: role || 'user' }
    })

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error: any) {
    console.error('Ошибка обновления:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email уже используется' },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json(
      { message: 'Пользователь удален' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Ошибка удаления:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}