"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { useLoginMutation } from "@/lib/api/authApi"
import { useAppDispatch } from "@/lib/hooks"
import { setCredentials } from "@/lib/slices/authSlice"
import Modal from "./modal"

export default function SignInModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  })
  const [login, { isLoading }] = useLoginMutation()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Валідація на клієнті
    if (!formData.usernameOrEmail.trim()) {
      toast.error("Username or email is required")
      return
    }

    if (!formData.password.trim()) {
      toast.error("Password is required")
      return
    }

    try {
      console.log("🔐 Attempting login with:", {
        usernameOrEmail: formData.usernameOrEmail,
        password: "***",
      })

      const result = await login(formData).unwrap()
      console.log("✅ Login successful:", result)

      // Зберігаємо дані в Redux та cookies
      dispatch(setCredentials(result))

      toast.success("Signed in successfully!")
      onClose()

      // Очищаємо форму
      setFormData({ usernameOrEmail: "", password: "" })

      // Перенаправляємо на головну сторінку
      router.push("/")
    } catch (error) {
      console.error("❌ Login failed:", error)

      // Детальна обробка помилок
      if (error?.status === "FETCH_ERROR") {
        console.error("🚨 FETCH_ERROR - Server connection failed")
        toast.error("Connection failed! Please check if the Django server is running on http://127.0.0.1:8000")
      } else if (error?.status === 401) {
        toast.error("Invalid username/email or password")
      } else if (error?.status === 400) {
        if (error.data?.non_field_errors) {
          toast.error(error.data.non_field_errors[0])
        } else {
          toast.error("Invalid input. Please check your credentials.")
        }
      } else if (error?.status === 500) {
        toast.error("Server error. Please try again later.")
      } else if (error?.data) {
        // Обробка специфічних помилок API
        if (error.data.non_field_errors) {
          toast.error(error.data.non_field_errors[0])
        } else if (error.data.detail) {
          toast.error(error.data.detail)
        } else {
          toast.error("Login failed. Please try again.")
        }
      } else {
        toast.error("Login failed. Please check your connection and try again.")
      }
    }
  }

  const handleSignUpClick = () => {
    onClose()
    router.push("/signup")
  }

  // Тестова функція для перевірки з'єднання
  const testConnection = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, {
        method: "OPTIONS",
      })
      console.log("✅ Connection test result:", response.status)
      toast.success(`Connection test: ${response.status === 200 ? "Success" : "Failed"}`)
    } catch (error) {
      console.error("❌ Connection test failed:", error)
      toast.error("Connection test failed! Django server might not be running.")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sign In">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-brown-secondary font-medium mb-2">Username or Email</label>
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
          <label className="block text-brown-secondary font-medium mb-2">Password</label>
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
          <Link href="/reset_password" className="text-brown-secondary hover:text-brown-primary btn-secondary">
            Forgot your password?
          </Link>
        </div>

        {/* Debug section - тільки в режимі розробки */}
        {/* {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-50 rounded-lg p-4 text-sm">
            <p className="text-gray-600 mb-2">🔧 Debug Info:</p>
            <p className="text-gray-600">API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
            <p className="text-gray-600">Test credentials: admin / admin123</p>
            <button type="button" onClick={testConnection} className="mt-2 text-blue-600 hover:text-blue-800 underline">
              Test Connection
            </button>
          </div>
        )} */}

        <div className="text-center">
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary text-white px-8 py-3 rounded-lg font-medium text-lg disabled:opacity-50 w-full"
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={handleSignUpClick}
            className="text-brown-secondary hover:text-brown-primary text-lg btn-secondary"
          >
            Don't have an account? Sign up
          </button>
        </div>
      </form>
    </Modal>
  )
}
