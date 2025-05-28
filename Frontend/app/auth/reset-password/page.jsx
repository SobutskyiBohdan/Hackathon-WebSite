"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from 'lucide-react'
import toast from "react-hot-toast"
import { useResetPasswordMutation } from "@/lib/api/authApi"
import PasswordResetConfirmModal from "@/components/password-reset-confirm"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await resetPassword({ email }).unwrap()
      setIsConfirmModalOpen(true)
    } catch (error) {
      console.error("Password reset failed:", error)
      
      if (error.data?.email) {
        toast.error("User with this email does not exist")
      } else if (error.status === "FETCH_ERROR") {
        toast.error("Connection error. Please check if the backend server is running.")
      } else {
        toast.error("Password reset failed. Please try again.")
      }
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
            <div className="flex items-center mb-8">
              <Link href="/" className="text-brown-secondary hover:text-brown-primary transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h2 className="text-3xl font-bold text-black text-center flex-1">Reset Password</h2>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-black mb-2">Forgot your password?</h3>
              <p className="text-brown-secondary">Enter your email to reset your password</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-brown-secondary font-semibold mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                  required
                />
              </div>
              <div className="text-center">
                <Link href="/" className="text-brown-secondary hover:text-brown-primary btn-secondary">
                  Remembered your password?
                </Link>
              </div>
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary text-white px-8 py-4 rounded-lg font-semibold text-lg disabled:opacity-50 w-full"
                >
                  {isLoading ? "Sending..." : "Reset password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <PasswordResetConfirmModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        email={email}
      />
    </>
  )
}
