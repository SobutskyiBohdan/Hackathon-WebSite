"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { useRegisterMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [register, { isLoading }] = useRegisterMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await register(formData).unwrap()
      dispatch(setCredentials(result))
      router.push("/")
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
          <div className="flex items-center mb-8">
            <Link href="/" className="text-brown-secondary hover:text-brown-primary transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h2 className="text-3xl font-bold text-black text-center flex-1">Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-brown-secondary font-semibold mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                required
              />
            </div>
            <div>
              <label className="block text-brown-secondary font-semibold mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                required
              />
            </div>
            <div>
              <label className="block text-brown-secondary font-semibold mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                required
              />
            </div>
            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 w-full"
              >
                {isLoading ? "Creating Account..." : "Sign up"}
              </button>
            </div>
            <div className="text-center">
              <Link href="/" className="text-brown-secondary hover:text-brown-primary text-lg btn-secondary">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
