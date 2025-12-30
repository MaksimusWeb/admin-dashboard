import Image from 'next/image';

export default async function Home() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/users`, {
    cache: 'no-store' // Отключаем кэширование для свежих данных
  });

  const users = await response.json()
  const userCount = users.length;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-200">
            Панель управления
          </h1>
          <p className="mt-2 text-gray-200">Обзор системы и статистика</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-medium text-gray-200">Пользователи</h3>
            <p className="text-3xl font-bold text-blue-400 mt-2">{userCount}</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-medium text-gray-200">Активность</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">--</p>
          </div>

          <div className="bg-gray-700 p-6 rounded-lg border border-gray-300">
            <h3 className="text-lg font-medium text-gray-200">Настройки</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">--</p>
          </div>
        </div>

        {/* Placeholder для последних действий */}
        <div className="bg-gray-700 p-6 rounded-lg border border-gray-300">
          <h3 className="text-lg font-medium text-gray-200 mb-4">
            Последние действия
          </h3>
          <p className="text-gray-200">Здесь будут последние события системы</p>
        </div>
      </div>
    </div>
  );
}
