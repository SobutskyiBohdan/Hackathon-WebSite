import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getAuthToken } from "../utils/cookies"

// Debug function
const debugRequest = (url, options) => {
  console.log("🌐 API Request Debug:")
  console.log("URL:", url)
  console.log("Method:", options.method)
  console.log("Headers:", options.headers)
  console.log("Body:", options.body)
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
    prepareHeaders: (headers, { getState }) => {
      // Спочатку пробуємо отримати токен з Redux
      let token = getState().auth.token

      // Якщо в Redux немає токена, пробуємо з cookies
      if (!token) {
        token = getAuthToken()
      }

      if (token) {
        headers.set("authorization", `Bearer ${token}`)
        console.log("🔑 Using auth token from:", getState().auth.token ? "Redux" : "Cookies")
      }

      headers.set("Content-Type", "application/json")
      headers.set("Accept", "application/json")
      return headers
    },
    // Додаємо mode для CORS
    mode: "cors",
    // ВАЖЛИВО: credentials для автоматичної роботи з кукі
    credentials: "include",
    // Додаємо timeout
    timeout: 15000,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        // ВИПРАВЛЕННЯ: Трансформуємо usernameOrEmail в username
        const transformedCredentials = {
          username: credentials.usernameOrEmail || credentials.username,
          password: credentials.password,
        }

        const requestConfig = {
          url: "/api/login/",
          method: "POST",
          body: transformedCredentials,
        }

        // Debug в режимі розробки
        if (process.env.NODE_ENV === "development") {
          console.log("🔧 Original credentials:", credentials)
          console.log("🔧 Transformed credentials:", transformedCredentials)
          debugRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, requestConfig)
        }

        return requestConfig
      },
      transformResponse: (response) => {
        console.log("🔐 Login response:", response)
        return response
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("🚨 Login API Error:", response)
        console.error("🚨 Request data that failed:", arg)
        return response
      },
      // Додаємо invalidatesTags для оновлення кешу після логіну
      invalidatesTags: ["User"],
    }),
    register: builder.mutation({
      query: (userData) => {
        const requestConfig = {
          url: "/api/register/",
          method: "POST",
          body: userData,
        }

        // Debug в режимі розробки
        if (process.env.NODE_ENV === "development") {
          debugRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/register/`, requestConfig)
        }

        return requestConfig
      },
      transformResponse: (response) => {
        console.log("📝 Register response:", response)
        return response
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("🚨 Register API Error:", response)
        console.error("🚨 Meta:", meta)
        return response
      },
    }),
    // Додаємо logout endpoint
    logout: builder.mutation({
      query: () => ({
        url: "/api/logout/",
        method: "POST",
      }),
      transformResponse: (response) => {
        console.log("🚪 Logout response:", response)
        return response
      },
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query({
      query: () => "/api/profile/",
      transformResponse: (response) => {
        console.log("👤 Profile response:", response)
        return response
      },
      providesTags: ["User"],
      // Автоматично рефетчимо профіль якщо токен змінився
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg
      },
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/api/profile/",
        method: "PUT",
        body: data,
      }),
      transformResponse: (response) => {
        console.log("✏️ Profile update response:", response)
        return response
      },
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/api/reset-password/",
        method: "POST",
        body: data,
      }),
      transformResponse: (response) => {
        console.log("🔄 Reset password response:", response)
        return response
      },
    }),
    // Додаємо endpoint для перевірки валідності токена
    verifyToken: builder.query({
      query: () => "/api/verify-token/",
      transformResponse: (response) => {
        console.log("✅ Token verification response:", response)
        return response
      },
      providesTags: ["User"],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useResetPasswordMutation,
  useVerifyTokenQuery,
} = authApi