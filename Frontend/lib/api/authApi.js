import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

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
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      headers.set("Content-Type", "application/json")
      headers.set("Accept", "application/json")
      return headers
    },
    // Додаємо mode для CORS
    mode: "cors",
    // Додаємо credentials
    credentials: "include",
    // Додаємо timeout
    timeout: 15000,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => {
        const requestConfig = {
          url: "/api/login/",
          method: "POST",
          body: credentials,
        }

        // Debug в режимі розробки
        if (process.env.NODE_ENV === "development") {
          debugRequest(`${process.env.NEXT_PUBLIC_API_URL}/api/login/`, requestConfig)
        }

        return requestConfig
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("🚨 Login API Error:", response)
        return response
      },
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
      transformErrorResponse: (response, meta, arg) => {
        console.error("🚨 Register API Error:", response)
        console.error("🚨 Meta:", meta)
        return response
      },
    }),
    getProfile: builder.query({
      query: () => "/api/profile/",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/api/profile/",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/api/reset-password/",
        method: "POST",
        body: data,
      }),
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useResetPasswordMutation,
} = authApi
