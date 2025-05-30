"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/slices/authSlice"
import { useGetProfileQuery } from "@/lib/api/authApi"
import SignUpModal from "./signup-modal"
import SignInModal from "./signin-modal"

export default function Header() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, token, isInitialized } = useAppSelector((state) => state.auth)

  // Використовуємо RTK Query тільки якщо авторизовані та стан ініціалізований
  const { 
    data: profileData, 
    error: profileError, 
    isLoading: profileLoading,
    refetch: refetchProfile 
  } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !token || !isInitialized,
  })

  // Обробляємо помилки профілю
  useEffect(() => {
    if (profileError) {
      console.error("🚨 Profile fetch error:", profileError)
      
      if (profileError.status === 401) {
        console.log("🚨 Profile fetch failed with 401, token invalid - logging out...")
        dispatch(logout())
        router.push("/")
      } else if (profileError.status === "FETCH_ERROR") {
        console.error("🚨 Server connection failed")
      }
    }
  }, [profileError, dispatch, router])

  // Логуємо дані профілю для дебагу
  useEffect(() => {
    if (profileData) {
      console.log("👤 Profile data loaded:", profileData)
    }
  }, [profileData])

  // Дебаг стану авторизації
  useEffect(() => {
    console.log("🔍 Header auth state:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      isInitialized,
      username: user?.username,
      tokenLength: token?.length,
    })
  }, [isAuthenticated, user, token, isInitialized])

  const handleSignOut = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      dispatch(logout())
      router.push("/")
    }
  }

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      router.push("/profile")
    } else {
      setIsSignInModalOpen(true)
    }
  }

  // Функція для закриття modals та відкриття іншого
  const handleSwitchModals = (fromSignUp = false) => {
    if (fromSignUp) {
      setIsSignUpModalOpen(false)
      setTimeout(() => setIsSignInModalOpen(true), 100)
    } else {
      setIsSignInModalOpen(false)
      setTimeout(() => setIsSignUpModalOpen(true), 100)
    }
  }

  return (
    <>
      <header
        className="flex items-center justify-between px-6 py-4 shadow-lg animate-slide-in"
        style={{ backgroundColor: "#feecce" }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
            <Image
              src="/icon0.svg"
              alt="Book Shelf Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain"
              priority
              onError={(e) => {
                e.target.style.display = "none"
                e.target.nextSibling.style.display = "flex"
              }}
            />
            <div
              className="absolute inset-0 items-center justify-center w-10 h-10 text-white font-bold text-lg bg-brown-secondary rounded-lg hidden"
              style={{ display: "none" }}
            >
              BS
            </div>
          </div>
          <span className="text-brown-primary font-semibold text-xl group-hover:text-brown-secondary transition-colors">
            Book Shelf
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <button onClick={handleUserIconClick} className="group">
            <User className="w-7 h-7 text-brown-secondary group-hover:text-brown-primary transition-colors" />
          </button>
          
          {/* Показуємо контент тільки після ініціалізації */}
          {isInitialized && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  {/* Показуємо admin link якщо користувач є staff */}
                  {(user?.is_staff || profileData?.is_staff) && (
                    <Link
                      href="/admin"
                      className="text-brown-secondary font-medium px-4 py-2 rounded-lg hover:bg-brown-secondary hover:text-white transition-all duration-300"
                    >
                      Admin
                    </Link>
                  )}
                  <span className="text-brown-secondary text-sm">
                    Welcome, {user?.username || profileData?.username}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="text-brown-secondary font-medium px-6 py-2 rounded-lg hover:bg-brown-secondary hover:text-white transition-all duration-300"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSignUpModalOpen(true)}
                  className="btn-primary text-white font-medium px-6 py-2 rounded-lg"
                >
                  Sign up
                </button>
              )}
            </>
          )}

          {/* Показуємо індикатор завантаження під час ініціалізації */}
          {!isInitialized && (
            <div className="text-brown-secondary text-sm">Loading...</div>
          )}
        </div>
      </header>

      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)}
        onSwitchToSignIn={() => handleSwitchModals(true)}
      />
      <SignInModal 
        isOpen={isSignInModalOpen} 
        onClose={() => setIsSignInModalOpen(false)}
        onSwitchToSignUp={() => handleSwitchModals(false)}
      />
    </>
  )
}