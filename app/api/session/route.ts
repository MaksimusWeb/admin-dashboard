import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    return NextResponse.json({
      session: session ? 'exists' : 'none',
      user: session?.user || null
    })
  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      session: 'error'
    }, { status: 500 })
  }
}
