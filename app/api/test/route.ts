import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function GET() {
  try {
    // Проверяем подключение к БД
    const userCount = await prisma.user.count()
    return NextResponse.json({
      status: 'ok',
      userCount,
      database: 'connected'
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({
      status: 'error',
      error: error.message,
      database: 'disconnected'
    }, { status: 500 })
  }
}
