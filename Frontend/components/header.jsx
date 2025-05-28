"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import Image from "next/image"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/slices/authSlice"
import SignUpModal from "./signup-modal"
import SignInModal from "./signin-modal"

export default function Header() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

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

  return (
    <>
      <header
        className="flex items-center justify-between px-6 py-4 shadow-lg animate-slide-in"
        style={{ backgroundColor: "#feecce" }}
      >
        <Link href="/" className="flex items-center gap-3 group">
          {/* Логотип */}
          <div className="relative w-10 h-10 group-hover:scale-105 transition-transform">
            <Image
              src="/icon0.svg"
              alt="Book Shelf Logo"
              width={40}
              height={40}
              className="rounded-lg object-contain"
              priority
              onError={(e) => {
                // Fallback до текстового логотипу, якщо зображення не завантажилося
                e.target.style.display = "none"
                e.target.nextSibling.style.display = "flex"
              }}
            />
            {/* Fallback текстовий логотип */}
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
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.is_staff && (
                <Link
                  href="/admin"
                  className="text-brown-secondary font-medium px-4 py-2 rounded-lg hover:bg-brown-secondary hover:text-white transition-all duration-300"
                >
                  Admin
                </Link>
              )}
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
        </div>
      </header>
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />
      <SignInModal isOpen={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  )
}
