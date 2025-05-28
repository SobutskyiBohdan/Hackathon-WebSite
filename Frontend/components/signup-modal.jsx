"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { useRegisterMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"
import Modal from "./modal"

export default function SignUpModal({ isOpen, onClose }) {
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

    // Client-side validation
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    if (!formData.username.trim()) {
      toast.error("Username is required")
      return
    }

    if (!formData.email.trim()) {
      toast.error("Email is required")
      return
    }

    // Debug information
    console.log("🔍 Registration Debug Info:")
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL)
    console.log("Form Data:", formData)
    console.log("Full API URL:", `${process.env.NEXT_PUBLIC_API_URL}/api/register/`)

    try {
      const result = await register(formData).unwrap()
      dispatch(setCredentials(result))
      toast.success("Account created successfully!")
      onClose()
      router.push("/")
    } catch (error) {
      console.error("❌ Registration failed:", error)

      // Detailed error handling
      if (error.status === "FETCH_ERROR") {
        console.error("🚨 FETCH_ERROR Details:")
        console.error("- Check if Django server is running on:", process.env.NEXT_PUBLIC_API_URL)
        console.error("- Check if endpoint exists: /api/register/")
        console.error("- Check network connectivity")

        toast.error(
          `Connection failed! Please check:\n` +
            `1. Django server is running on ${process.env.NEXT_PUBLIC_API_URL}\n` +
            `2. Endpoint /api/register/ exists\n` +
            `3. Network connection is working`,
        )
      } else if (error.data) {
        // Handle specific API errors
        if (error.data.username) {
          toast.error(`Username error: ${error.data.username[0]}`)
        } else if (error.data.email) {
          toast.error(`Email error: ${error.data.email[0]}`)
        } else if (error.data.password) {
          toast.error(`Password error: ${error.data.password[0]}`)
        } else if (error.data.non_field_errors) {
          toast.error(`Error: ${error.data.non_field_errors[0]}`)
        } else {
          toast.error("Registration failed. Please check your input.")
        }
      } else if (error.status) {
        // Handle HTTP status errors
        switch (error.status) {
          case 400:
            toast.error("Invalid data provided. Please check your input.")
            break
          case 404:
            toast.error("Registration endpoint not found. Please contact support.")
            break
          case 500:
            toast.error("Server error. Please try again later.")
            break
          default:
            toast.error(`Registration failed with status: ${error.status}`)
        }
      } else {
        toast.error("Registration failed. Please try again.")
      }
    }
  }

  const handleSignInClick = () => {
    onClose()
    router.push("/signin")
  }

  // Test connection function
  const testConnection = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, {
        method: "OPTIONS",
      })
      console.log("✅ Connection test result:", response.status)
      toast.success(`Connection test: ${response.status === 200 ? "Success" : "Failed"}`)
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      toast.error("Connection test failed!")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-brown-secondary font-medium mb-2">Username</label>
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
          <label className="block text-brown-secondary font-medium mb-2">Email Address</label>
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
          <label className="block text-brown-secondary font-medium mb-2">Password</label>
          <input
            type="password"
            placeholder="Create a password (min 8 characters)"
            value={formData.password}
            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
            className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
            required
            minLength={8}
          />
        </div>

        {/* Debug section - only show in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p className="text-gray-600 mb-2">🔧 Debug Info:</p>
            <p className="text-gray-600">API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
            <button type="button" onClick={testConnection} className="mt-2 text-blue-600 hover:text-blue-800 underline">
              Test Connection
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary text-white px-8 py-3 rounded-lg font-medium text-lg disabled:opacity-50 w-full"
          >
            {isLoading ? "Creating Account..." : "Sign up"}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={handleSignInClick}
            className="text-brown-secondary hover:text-brown-primary text-lg btn-secondary"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </Modal>
  )
}
