"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { initializeAuth } from "@/lib/slices/authSlice"
import { getAuthToken, getUserData } from "@/lib/utils/cookies"

export default function AuthInitializer({ children }) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const initAuth = () => {
      const token = getAuthToken()
      const userData = getUserData()

      console.log("🔍 Auth data from storage:", {
        hasToken: !!token,
        hasUserData: !!userData,
      })

      dispatch(initializeAuth())
      console.log("🔄 Auth initialized from Redux")
    }

    initAuth()
  }, [dispatch])

  useEffect(() => {
    console.log("🔐 Auth state:", {
      isAuthenticated,
      user: user?.username || null,
    })
  }, [isAuthenticated, user])

  return children
}
