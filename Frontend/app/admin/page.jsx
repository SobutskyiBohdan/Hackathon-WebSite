"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Users, BookOpen } from "lucide-react"
import { useAppSelector } from "@/lib/hooks"
import { useGetBooksQuery } from "@/lib/api/booksApi"
import Breadcrumb from "@/components/breadcrumb"

export default function AdminPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const { data: booksData, isLoading } = useGetBooksQuery({ page: currentPage, limit: 10 })

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
  }, [isAuthenticated, user, router])

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
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Admin Panel" }]} />

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">Admin Panel</h1>
          <p className="text-brown-secondary text-lg">Manage your book collection and users</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brown-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">{booksData?.total || 0}</h3>
                <p className="text-brown-secondary">Total Books</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brown-secondary rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">0</h3>
                <p className="text-brown-secondary">Total Users</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black">New</h3>
                <p className="text-brown-secondary">Add Content</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-black mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/books/add"
              className="flex items-center gap-4 p-4 border-2 border-brown-secondary rounded-lg hover:bg-brown-secondary hover:text-white transition-all duration-300"
            >
              <Plus className="w-6 h-6" />
              <span className="font-medium">Add New Book</span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-4 p-4 border-2 border-brown-secondary rounded-lg hover:bg-brown-secondary hover:text-white transition-all duration-300"
            >
              <Users className="w-6 h-6" />
              <span className="font-medium">Manage Users</span>
            </Link>
          </div>
        </div>

        {/* Books Management */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Manage Books</h2>
            <Link
              href="/admin/books/add"
              className="btn-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Book
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-primary mx-auto"></div>
              <p className="mt-4 text-brown-secondary">Loading books...</p>
            </div>
          ) : booksData?.books && booksData.books.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Title</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Year</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Price</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Stock</th>
                    <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {booksData.books.map((book) => (
                    <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.image || "/placeholder.svg?height=50&width=40"}
                            alt={book.title}
                            className="w-10 h-12 object-cover rounded"
                          />
                          <span className="font-medium text-black">{book.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-brown-secondary">{book.year}</td>
                      <td className="py-4 px-4 text-black font-medium">{book.price}</td>
                      <td className="py-4 px-4 text-brown-secondary">{book.inStock}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/books/${book.id}/edit`}
                            className="p-2 text-brown-secondary hover:text-brown-primary transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button className="p-2 text-red-500 hover:text-red-700 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-black mb-2">No books found</h3>
              <p className="text-brown-secondary mb-6">Start by adding your first book to the collection</p>
              <Link
                href="/admin/books/add"
                className="btn-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add First Book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
