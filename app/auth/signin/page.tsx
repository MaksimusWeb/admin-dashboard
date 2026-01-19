'use client'

import { useState, useEffect } from "react";
import { getSession, signIn } from 'next-auth/react'
import { Session } from "next-auth";
import { useRouter } from "next/navigation";

export default function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        getSession().then((session: Session | null) => {
          if (session) {
            router.push('/')
          }
        })
      }, [router])
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
    
        try {
          const result = await signIn('credentials', {
            email,
            password,
            redirect: false
          })
    
          if (result?.ok) {
            router.push('/')
          } else {
            alert('Неверный логин или пароль')
          }
        } catch (error) {
          alert('Ошибка авторизации')
        }
    
        setLoading(false)
      }
    
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="py-28 px-24 space-y-8 border rounded-2xl ">
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-300">
                Вход в админ-панель
              </h2>
            </div>
            <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-300 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Пароль</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-6 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-300 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
    
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )
    }