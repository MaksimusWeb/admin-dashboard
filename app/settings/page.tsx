'use client';
import { useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (!session) {
        router.push('/auth/signin');
        return;
      }
    };

    checkAuth();
  }, [router]);
    return (
      <div className="min-h-screen bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Настройки системы</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Общие настройки</h3>
            <p className="text-gray-400">Здесь будут настройки темы, языка, уведомлений</p>
          </div>
        </div>
      </div>
    );
  }