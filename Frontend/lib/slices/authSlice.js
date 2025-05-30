import { createSlice } from "@reduxjs/toolkit"
import { setAuthToken, getAuthToken, setUserData, getUserData, clearAuthData } from "@/lib/utils/cookies"

// Отримання початкового стану
const getInitialState = () => {
  // Server-side rendering check
  if (typeof window === "undefined") {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
    }
  }

  try {
    const token = getAuthToken()
    const user = getUserData()

    console.log("🔄 Initial auth state from storage:", {
      hasToken: !!token,
      hasUser: !!user,
      user: user ? user.username : null,
    })

    return {
      user: user,
      token: token,
      isAuthenticated: !!(token && user),
      isInitialized: false, // Буде встановлено в true після ініціалізації
    }
  } catch (error) {
    console.error("❌ Error initializing auth state from storage:", error)
    clearAuthData()
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,
    }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    setCredentials: (state, action) => {
      console.log("🔧 setCredentials called with payload:", action.payload)
      
      const { user, access, token, access_token } = action.payload
      
      // Використовуємо access, access_token або token (залежно від того, що приходить з API)
      const authToken = access || access_token || token

      if (!authToken) {
        console.error("❌ No auth token found in payload:", action.payload)
        return
      }

      console.log("🔧 Setting credentials:", {
        user: user,
        tokenLength: authToken?.length,
        hasUser: !!user
      })

      state.user = user
      state.token = authToken
      state.isAuthenticated = true
      state.isInitialized = true

      // Зберігаємо в cookies та localStorage
      setAuthToken(authToken)
      if (user) {
        setUserData(user)
      }

      console.log("✅ Auth credentials set:", {
        username: user?.username || user?.email,
        hasToken: !!authToken,
        tokenLength: authToken?.length,
        isAuthenticated: state.isAuthenticated
      })
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        setUserData(state.user)
        console.log("✅ User data updated:", action.payload)
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.isInitialized = true

      clearAuthData()
      console.log("🚪 User logged out")
    },
    initializeAuth: (state) => {
      if (typeof window === "undefined") {
        state.isInitialized = true
        return
      }

      try {
        const token = getAuthToken()
        const user = getUserData()

        console.log("🔄 Initializing auth state:", {
          hasToken: !!token,
          hasUser: !!user,
          tokenLength: token?.length,
          user: user?.username || user?.email,
        })

        if (token && user) {
          state.user = user
          state.token = token
          state.isAuthenticated = true
          console.log("✅ Auth state initialized from storage")
        } else {
          state.user = null
          state.token = null
          state.isAuthenticated = false
          clearAuthData()
          console.log("🔄 Auth state cleared - incomplete data")
        }
      } catch (error) {
        console.error("❌ Error during auth initialization:", error)
        state.user = null
        state.token = null
        state.isAuthenticated = false
        clearAuthData()
      } finally {
        state.isInitialized = true
      }
    },
    // Новий action для очистки помилок токена
    clearAuthErrors: (state) => {
      console.log("🧹 Auth errors cleared")
    },
  },
})

export const { 
  setCredentials, 
  updateUser, 
  logout, 
  initializeAuth, 
  clearAuthErrors 
} = authSlice.actions

export default authSlice.reducer

// Селектори
export const selectAuth = (state) => state.auth
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsInitialized = (state) => state.auth.isInitialized