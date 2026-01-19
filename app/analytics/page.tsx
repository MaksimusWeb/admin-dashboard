'use client';
import { User } from '../users/page';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AnalyticsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [rolesCount, setRolesCount] = useState<{ [key: string]: number }>({}); // доступ по индексу
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/auth/signin');
        return;
      }

      // Загружаем данные только если пользователь авторизован
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
        const stats: { [key: string]: number } = {};
        data.forEach((user: User) => {
          stats[user.role] = (stats[user.role] || 0) + 1;
        });
        setRolesCount(stats);
      } catch (error) {
        console.log('Ошибка получения данных для аналитики', error);
        setUsers([]);
        setRolesCount({});
      }
    };

    checkAuth();
  }, [router]);

  const getRoleDisplayName = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'user':
        return 'Пользователь';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'user':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const totalUsers = users.length
  const roles = Object.keys(rolesCount)

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Аналитика</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">График активности</h3>
            <p className="text-gray-400">Здесь будут графики активности пользователей</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Статистика ролей</h3>
            
            {totalUsers === 0 ? (
              <p className="text-gray-400">Нет данных о пользователях</p>
            ) : (
              <div className="space-y-4">
                {roles.map((role) => {
                  const count = rolesCount[role];
                  const percentage = Math.round((count / totalUsers) * 100);
                  
                  return (
                    <div key={role} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-200 font-medium">
                          {getRoleDisplayName(role)}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {count} ({percentage}%)
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getRoleColor(role)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
                
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200 font-medium">Всего пользователей</span>
                    <span className="text-gray-400">{totalUsers}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}