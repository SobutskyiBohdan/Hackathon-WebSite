import { createSlice } from "@reduxjs/toolkit"
import { getAuthToken, getUserData, clearAuthData } from "@/lib/utils/cookies"

// Update the getInitialState function to be more robust - БЕЗ REFRESH TOKEN
const getInitialState = () => {
  // Server-side rendering check
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    }
  }

  try {
    const token = getAuthToken()
    const user = getUserData()

    console.log("🔄 Initial auth state from cookies:", {
      hasToken: !!token,
      hasUser: !!user,
      user: user ? user.username : null,
    })

    return {
      user: user,
      token: token,
      isAuthenticated: !!(token && user),
    }
  } catch (error) {
    console.error("❌ Error initializing auth state from cookies:", error)
    // Clear potentially corrupted cookies
    clearAuthData()
    return {
      user: null,
      token: null,
      isAuthenticated: false,
    }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    // Update the setCredentials reducer - БЕЗ REFRESH TOKEN
    setCredentials: (state, action) => {
      const { user, token } = action.payload

      state.user = user
      state.token = token
      state.isAuthenticated = true

      // Ensure we have valid data before saving to cookies
      if (token) {
        setAuthToken(token)
        console.log("✅ Auth token saved to cookies")
      }

      if (user) {
        setUserData(user)
        console.log("✅ User data saved to cookies:", user.username)
      }

      console.log("✅ Auth state updated in Redux")
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }

      // Оновлюємо cookies
      if (state.user) setUserData(state.user)
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      // Очищаємо cookies
      clearAuthData()

      console.log("🚪 User logged out, cookies cleared")
    },
    // Дія для ініціалізації стану з cookies - БЕЗ REFRESH TOKEN
    initializeAuth: (state) => {
      const token = getAuthToken()
      const user = getUserData()

      if (token && user) {
        state.user = user
        state.token = token
        state.isAuthenticated = true
        console.log("🔄 Auth state initialized from cookies:", { user: user?.username })
      } else {
        // Якщо даних немає або вони неповні, очищаємо все
        state.user = null
        state.token = null
        state.isAuthenticated = false
        clearAuthData()
      }
    },
  },
})

export const { setCredentials, updateUser, logout, initializeAuth } = authSlice.actions
export default authSlice.reducer