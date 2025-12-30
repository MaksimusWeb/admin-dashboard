'use client';

import { error } from 'console';
import { FormEvent, ReactEventHandler, useEffect, useState } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [notification, setNotification] = useState<{
  //   type: 'success' | 'error' | null;
  //   message: string;
  // }>({type: null, message: ''})

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

  useEffect(() => {
    fetch('api/users')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.log('Ошибка получения списка пользователей', error);
        setUsers([]);
      });
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (
      !newUser.name ||
      newUser.name.trim() === '' ||
      !newUser.email ||
      newUser.email.trim() === ''
    ) {
      alert('Имя или почта не могут быть пустыми');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (response.ok) {
        const updatedUsers = await fetch('/api/users').then((res) =>
          res.json()
        );
        setUsers(updatedUsers);
        setNewUser({ name: '', email: '', role: 'user' });
        //   setNotification({ type: 'success', message: 'Пользователь добавлен!' });

        // setTimeout(() => {
        //   setNotification({ type: null, message: '' });
        // }, 3000);
        setIsSubmitting(false);
      } else {
        alert('Ошибка валидации на сервере');
        setIsSubmitting(false);
      }
    } catch (error) {
      alert('Ошибка добавления пользователя');
      console.log(error);
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (confirm('Удалить пользователя?')) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedUsers = await fetch('/api/users').then((res) =>
            res.json()
          );
          setUsers(updatedUsers);
        } else {
          alert('Ошибка удаления');
        }
      } catch (error) {
        console.log('Ошибка:', error);
        alert('Ошибка сети');
      }
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: FormEvent) => {
    setIsSubmitting(true);
    e.preventDefault();
    if (!editingUser) {
      alert('Пользователь не выбран');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          role: editRole,
        }),
      });

      if (response.ok) {
        const updatedUsers = await fetch('/api/users').then((res) =>
          res.json()
        );
        setUsers(updatedUsers);
        setShowEditModal(false);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Ошибка редактирования:', error);
      setIsSubmitting(false);
    }
  };

  const getFilteredUsers = (
    searchQuery: string,
    roleFilter: string
  ): User[] => {
    let filtered = users;

    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Потом текстовый поиск
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const filteredUsers = getFilteredUsers(searchQuery, roleFilter);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-200 mb-8">
          Управление пользователями
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-4 px-4 py-2 bg-blue-700 text-gray-200 rounded-2xl hover:bg-blue-700"
        >
          Добавить пользователя:
        </button>
        {showAddForm ? (
          <form
            onSubmit={handleSubmit}
            className="flex flex-wrap gap-4 items-center mb-8 bg-gray-700 p-6 rounded-lg border border-gray-300"
          >
            <label className="label-style" htmlFor="name">
              Имя:
            </label>
            <input
              className="input-style"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              id="name"
              placeholder="*"
              required
            ></input>
            <label className="label-style" htmlFor="email">
              @Email:
            </label>
            <input
              type="email"
              className="input-style"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              id="email"
              placeholder="*"
              required
            ></input>
            <label className="label-style" htmlFor="role">
              Роль:
            </label>
            <select
              className="input-style"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              id="role"
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
            {isSubmitting ? (
              <button disabled={isSubmitting} className="button-edit">
                Сохраняю...
              </button>
            ) : (
              <button disabled={isSubmitting} className="button-edit">
                💾 Сохранить
              </button>
            )}
            <button className="button-delete">❌ Сбросить</button>
            <div className="flex mx-auto">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="border rounded px-3 hover:bg-blue-900"
              >
                Скрыть форму
              </button>
            </div>
          </form>
        ) : (
          ''
        )}
        <hr />
        <br />
        <div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-style"
            placeholder="Поиск по имени или Email"
          ></input>
          <label
            htmlFor="role-selector"
            className="py-2 ml-10 px-2 bg-gray-900"
          >
            Фильтр по роли:
          </label>
          <select
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as 'all' | 'user' | 'admin')
            }
            id="role-selector"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Все</option>
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        <br />
        <table className="w-full bg-gray-800 table-fixed border-collapse rounded-lg overflow-hidden text-center">
          <thead>
            <tr>
              <th className="th-style">ID</th>
              <th className="th-style">Имя</th>
              <th className="th-style">Email</th>
              <th className="th-style">Роль</th>
              <th className="th-style">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: User) => (
              <tr key={user.id}>
                <td className="td-style">{user.id}</td>
                <td className="td-style">{user.name}</td>
                <td className="td-style">{user.email}</td>
                <td className="td-style">{getRoleDisplayName(user.role)}</td>
                <td className="td-style flex gap-2">
                  <button onClick={() => openEditModal(user)}>
                    ✏️ Редактировать
                  </button>
                  <button onClick={() => handleDelete(user.id)}>
                    🗑️ Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-white mb-4">
                Редактировать пользователя
              </h3>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Имя
                  </label>
                  <input
                    type="text"
                    disabled={isSubmitting}
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled={isSubmitting}
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-1">
                    Роль
                  </label>
                  <select
                    value={editRole}
                    disabled={isSubmitting}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">Пользователь</option>
                    <option value="admin">Администратор</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Сохранить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
