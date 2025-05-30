// lib/utils/cookies.js

// Функція для встановлення cookie
export const setCookie = (name, value, days = 7) => {
  if (typeof window === "undefined") return

  try {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure=${window.location.protocol === 'https:'}`
    
    console.log(`🍪 Cookie ${name} saved successfully`)
  } catch (error) {
    console.error(`❌ Failed to save cookie ${name}:`, error)
  }
}

// Функція для отримання cookie
export const getCookie = (name) => {
  if (typeof window === "undefined") return null

  try {
    const nameEQ = name + "="
    const ca = document.cookie.split(';')
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length))
        console.log(`🍪 Cookie ${name} retrieved successfully`)
        return value
      }
    }
    return null
  } catch (error) {
    console.error(`❌ Failed to get cookie ${name}:`, error)
    return null
  }
}

// Функція для видалення cookie
export const deleteCookie = (name) => {
  if (typeof window === "undefined") return

  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`
    console.log(`🗑️ Cookie ${name} deleted successfully`)
  } catch (error) {
    console.error(`❌ Failed to delete cookie ${name}:`, error)
  }
}

// Спеціальні функції для аутентифікації
export const setAuthToken = (token) => {
  setCookie('authToken', token, 7) // зберігаємо на 7 днів
  
  // Також зберігаємо в localStorage як fallback
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem('authToken', token)
    } catch (error) {
      console.error("❌ Failed to save token to localStorage:", error)
    }
  }
}

export const getAuthToken = () => {
  // Спочатку пробуємо отримати з cookies
  let token = getCookie('authToken')
  
  // Якщо в cookies немає, пробуємо localStorage
  if (!token && typeof window !== "undefined") {
    try {
      token = localStorage.getItem('authToken')
      // Якщо знайшли в localStorage, зберігаємо в cookies
      if (token) {
        setCookie('authToken', token, 7)
      }
    } catch (error) {
      console.error("❌ Failed to get token from localStorage:", error)
    }
  }
  
  return token
}

export const setUserData = (user) => {
  const userData = JSON.stringify(user)
  setCookie('userData', userData, 7)
  
  // Також зберігаємо в localStorage як fallback
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem('userData', userData)
    } catch (error) {
      console.error("❌ Failed to save user data to localStorage:", error)
    }
  }
}

export const getUserData = () => {
  // Спочатку пробуємо отримати з cookies
  let userData = getCookie('userData')
  
  if (userData) {
    try {
      return JSON.parse(userData)
    } catch (error) {
      console.error("❌ Failed to parse user data from cookies:", error)
    }
  }
  
  // Якщо в cookies немає, пробуємо localStorage
  if (typeof window !== "undefined") {
    try {
      userData = localStorage.getItem('userData')
      if (userData) {
        const parsedData = JSON.parse(userData)
        // Якщо знайшли в localStorage, зберігаємо в cookies
        setCookie('userData', userData, 7)
        return parsedData
      }
    } catch (error) {
      console.error("❌ Failed to get user data from localStorage:", error)
    }
  }
  
  return null
}

export const clearAuthData = () => {
  // Видаляємо з cookies
  deleteCookie('authToken')
  deleteCookie('userData')
  
  // Видаляємо з localStorage
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
    } catch (error) {
      console.error("❌ Failed to clear auth data from localStorage:", error)
    }
  }
  
  console.log("🗑️ All auth data cleared")
}