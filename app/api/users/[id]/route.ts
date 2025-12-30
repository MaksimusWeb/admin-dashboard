import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    const user = await getUserById(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    const body = await request.json();
    const { name, email, role } = body;

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    if (!name || name.trim() === '' || !email || email.trim() === '') {
      return NextResponse.json(
        { error: 'Имя и email не могут быть пустыми' },
        { status: 400 }
      );
    }

    // Проверяем существование пользователя
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    await updateUser(userId, { name, email, role: role || 'user' });

    // Получаем обновленного пользователя
    const updatedUser = await getUserById(userId);

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    console.error('Ошибка обновления:', error);

    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Email уже используется' },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);

    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Неверный ID' }, { status: 400 });
    }

    // Проверяем существование пользователя
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }

    await deleteUser(userId);

    return NextResponse.json(
      { message: 'Пользователь удален' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка удаления:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
