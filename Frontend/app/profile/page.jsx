"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Edit3, Heart } from "lucide-react"
import toast from "react-hot-toast"
import { useAppSelector } from "@/lib/hooks"
import { useGetProfileQuery, useUpdateProfileMutation } from "@/lib/api/authApi"
import { useGetFavoritesQuery } from "@/lib/api/booksApi"
import BookCard from "@/components/book-card"
import Breadcrumb from "@/components/breadcrumb"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const { data: profile } = useGetProfileQuery(undefined, { skip: !isAuthenticated })
  const { data: favorites } = useGetFavoritesQuery(undefined, { skip: !isAuthenticated })

  // Перевірка авторизації
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to access your profile")
      router.push("/")
    }
  }, [isAuthenticated, router])

  // Показуємо завантаження поки перевіряємо авторизацію
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brown-primary mx-auto mb-4"></div>
          <p className="text-xl text-brown-secondary font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return <EditProfileForm onCancel={() => setIsEditing(false)} />
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
              <h1 className="text-3xl font-bold text-black mb-8 text-center">Profile</h1>

              <div className="bg-gradient-to-br from-gray-200 to-gray-400 w-48 h-48 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg">
                <User className="w-24 h-24 text-white" />
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">Username</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-black font-medium">
                    {profile?.username || user?.username || "Username"}
                  </div>
                </div>
                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">Email</label>
                  <div className="bg-gray-50 rounded-lg p-3 text-black font-medium">
                    {profile?.email || user?.email || "Email"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary text-white px-6 py-3 rounded-lg font-medium w-full flex items-center justify-center gap-2"
              >
                <Edit3 className="w-5 h-5" />
                Edit profile
              </button>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-black mb-8">Favorites</h2>

              {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((book, index) => (
                    <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <BookCard book={book} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No favorite books yet</p>
                  <p className="text-gray-400">Start exploring and add books to your favorites!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditProfileForm({ onCancel }) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [updateProfile, { isLoading }] = useUpdateProfileMutation()
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  })

  // Перевірка авторизації для форми редагування
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to edit your profile")
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfile(formData).unwrap()
      toast.success("Profile updated successfully!")
      onCancel()
    } catch (error) {
      console.error("Profile update failed:", error)
      toast.error("Failed to update profile. Please try again.")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brown-primary mx-auto mb-4"></div>
          <p className="text-xl text-brown-secondary font-medium">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Profile" }]} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Profile Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
              <h1 className="text-3xl font-bold text-black mb-8 text-center">Edit Profile</h1>

              <div className="bg-gradient-to-br from-gray-200 to-gray-400 w-48 h-48 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg">
                <User className="w-24 h-24 text-white" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                    className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                  />
                </div>
                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                  />
                </div>
                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Your current password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                  />
                </div>
                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="New password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                  />
                </div>
                <button type="button" className="text-brown-secondary hover:text-brown-primary btn-secondary">
                  Forgot your password?
                </button>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary text-white px-6 py-3 rounded-lg font-medium flex-1 disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={onCancel}
                    className="border-2 border-brown-secondary text-brown-secondary px-6 py-3 rounded-lg font-medium flex-1 hover:bg-brown-secondary hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Favorites Section */}
          <div className="lg:col-span-3">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-black mb-8">Favorites</h2>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <p className="text-gray-500 text-center">Your favorite books will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
