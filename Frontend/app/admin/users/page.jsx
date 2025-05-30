"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, UserPlus, Edit, Trash2 } from 'lucide-react'
import { useAppSelector } from "@/lib/hooks"
import Breadcrumb from "@/components/breadcrumb"
import toast from "react-hot-toast"

export default function AdminUsersPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Перевірка доступу до адмін панелі
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
      return
    }

    if (isAuthenticated && !user?.is_staff) {
      router.push("/")
      return
    }

    // Тут буде запит до API для отримання списку користувачів
    // Поки що використовуємо моковані дані
    setTimeout(() => {
      setUsers([
        { id: 1, username: "admin", email: "admin@example.com", is_staff: true, date_joined: "2023-01-01" },
        { id: 2, username: "user1", email: "user1@example.com", is_staff: false, date_joined: "2023-02-15" },
        { id: 3, username: "user2", email: "user2@example.com", is_staff: false, date_joined: "2023-03-20" },
      ])
      setIsLoading(false)
    }, 1000)
  }, [isAuthenticated, user, router])

  const handleDeleteUser = (userId, username) => {
    if (window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      // Тут буде запит до API для видалення користувача
      toast.success(`User ${username} deleted successfully!`)
      setUsers(users.filter(u => u.id !== userId))
    }
  }

  // Показуємо завантаження поки перевіряємо права доступу
  if (!isAuthenticated || !user?.is_staff) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brown-primary mx-auto mb-4"></div>
          <p className="text-xl text-brown-secondary font-medium">Checking permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Users" }]} />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">User Management</h1>
            <p className="text-brown-secondary">Manage user accounts and permissions</p>
          </div>
          <Link href="/admin" className="text-brown-secondary hover:text-brown-primary transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Users</h2>
            <button className="btn-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-primary mx-auto"></div>
              <p className="mt-4 text-brown-secondary">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Username</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Joined</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{user.username}</td>
                      <td className="py-4 px-4 text-brown-secondary">{user.email}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs ${
                          user.is_staff ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.is_staff ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-brown-secondary">{user.date_joined}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-brown-secondary hover:text-brown-primary transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id, user.username)}
                            className="p-2 text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}