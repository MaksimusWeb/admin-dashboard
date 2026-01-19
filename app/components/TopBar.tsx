'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react'

const TopBar = () => {
  const currentPath = usePathname();

  const navigation = [
    { name: 'Панель управления', href: '/' },
    { name: 'Пользователи', href: '/users' },
    { name: 'Аналитика', href: '/analytics' },
    { name: 'Настройки', href: '/settings' },
  ];

  const isActive = (href: string) => currentPath === href;

  return (
    <nav className='h-16 bg-gray-700 border-b border-gray-200 flex items-center px-4'>
        <Link href='/'><Image src='/logo.png' alt='Admin Dashboard Logo' width={32} height={32} className='mr-16'/></Link>
      {navigation.map((item) => (
        <Link
          className={`px-3 py-2 rounded-2xl text-gray-200 hover:bg-gray-600 mr-4 ${isActive(item.href) ? 'bg-blue-900 text-blue-900' : ''}`}
          href={item.href}
          key={item.href}
        >
          {item.name}
        </Link>
      ))}
      {/* Блок авторизации */}
    <div className="ml-auto flex items-center space-x-4">
      <SessionStatus />
    </div>
    </nav>
  );
};

function SessionStatus() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <span className="text-gray-200">Загрузка...</span>
  }

  if (session) {
    return (
      <>
        <span className="text-gray-200">Привет, {session.user?.name || session.user?.email}</span>
        <button 
          onClick={() => signOut()}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white ml-4"
        >
          Выйти
        </button>
      </>
    )
  }

  return (
    <Link href="/auth/signin" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white">
      Войти
    </Link>
  )
}

export default TopBar;