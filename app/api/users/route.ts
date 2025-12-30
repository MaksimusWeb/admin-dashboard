import { NextResponse, NextRequest } from 'next/server';
import { getUsers, createNewUser } from '../../lib/db';

export async function GET() {
  try {
    const users = await getUsers();
    return NextResponse.json(users, {
      status: 200,
    });
  } catch (error) {
    console.error('Ошибка получения пользователей', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Имя и email обязательны' },
        { status: 400 }
      );
    }

    const newUser = await createNewUser({
      name: body.name,
      email: body.email,
      role: body.role || 'user',
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Ошибка создания пользователя:', error);

    // Обработка дубликата email
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email уже используется' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
