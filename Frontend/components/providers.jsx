"use client"

import { useEffect } from "react"
import { Provider } from "react-redux"
import { Toaster } from "react-hot-toast"
import { store } from "@/lib/store"
import { useAppDispatch } from "@/lib/hooks"
import { initializeAuth } from "@/lib/slices/authSlice"

// Компонент для ініціалізації auth стану
function AuthInitializer({ children }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Ініціалізуємо auth стан з localStorage після монтування компонента
    dispatch(initializeAuth())
  }, [dispatch])

  return children
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#4b2e2b",
              color: "#fff",
              fontSize: "16px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
      </AuthInitializer>
    </Provider>
  )
}