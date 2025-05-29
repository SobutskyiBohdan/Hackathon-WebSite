"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { useLoginMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"
import ToastProvider from "@/components/toast-provider"

export default function SignInPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  })
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await login(formData).unwrap()
      dispatch(setCredentials(result))
      toast.success("Signed in successfully!")
      router.push("/")
    } catch (error) {
      console.error("Login failed:", error)

      // Handle specific error messages
      if (error.data) {
        if (error.data.non_field_errors) {
          toast.error("Invalid username/email or password")
        } else {
          toast.error("Login failed. Please try again.")
        }
      } else {
        toast.error("Login failed. Please check your connection.")
      }
    }
  }

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen flex items-center justify-center bg-cream py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
            <div className="flex items-center mb-8">
              <Link href="/" className="text-brown-secondary hover:text-brown-primary transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h2 className="text-3xl font-bold text-black text-center flex-1">Sign In</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-brown-secondary font-semibold mb-2">Username or Email</label>
                <input
                  type="text"
                  placeholder="Enter your username or email"
                  value={formData.usernameOrEmail}
                  onChange={(e) => setFormData((prev) => ({ ...prev, usernameOrEmail: e.target.value }))}
                  className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-brown-secondary font-semibold mb-2">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                  required
                />
              </div>
              <div className="text-center">
                <Link
                  href="/auth/reset-password"
                  className="text-brown-secondary hover:text-brown-primary btn-secondary"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 w-full"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
              <div className="text-center">
                <Link
                  href="/auth/signup"
                  className="text-brown-secondary hover:text-brown-primary text-lg btn-secondary"
                >
                  Don't have an account? Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
