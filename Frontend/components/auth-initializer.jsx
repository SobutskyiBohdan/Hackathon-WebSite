"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setAuth } from "@/lib/slices/authSlice"
import { getCookie } from "@/lib/utils/cookies"

const AuthInitializer = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Функція для ініціалізації стану авторизації
    const initializeAuth = () => {
      try {
        // Спочатку перевіряємо localStorage
        const token = localStorage.getItem("token") || getCookie("token")
        const userStr = localStorage.getItem("user")

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            dispatch(setAuth({ token, user }))
            console.log("Auth initialized from localStorage/cookies")
          } catch (e) {
            console.error("Error parsing user from localStorage:", e)
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      }
    }

    // Невелика затримка для правильної ініціалізації
    const timer = setTimeout(() => {
      initializeAuth()
    }, 100)

    return () => clearTimeout(timer)
  }, [dispatch])

  return null
}

export default AuthInitializer
