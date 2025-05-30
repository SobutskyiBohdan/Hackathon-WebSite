import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getAuthToken } from "../utils/cookies"

export const booksApi = createApi({
  reducerPath: "booksApi",
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
  tagTypes: ["Book", "Favorites"],
  endpoints: (builder) => ({
    getBooks: builder.query({
      query: (params) => {
        const requestConfig = {
          url: "/scraping/book_list/",
          params: {
            ...params,
            // Видаляємо пусті параметри
            ...(params?.title && { title: params.title }),
            ...(params?.genre && { genre: params.genre }),
            ...(params?.fromYear && { fromYear: params.fromYear }),
            ...(params?.toYear && { toYear: params.toYear }),
          },
        }

        // Debug в режимі розробки
        if (process.env.NODE_ENV === "development") {
          console.log("📚 Books API Request:", requestConfig)
          console.log("🌐 Full URL:", `${process.env.NEXT_PUBLIC_API_URL}/scraping/book_list/`)
        }

        return requestConfig
      },
      transformResponse: (response, meta, arg) => {
        console.log("📚 Books API Response:", response)

        // Якщо відповідь має структуру Django REST framework pagination
        if (response && typeof response === "object" && response.results) {
          return {
            books: response.results || [],
            total: response.count || 0,
            page: arg?.page || 1,
            limit: arg?.limit || 12,
          }
        }

        // Якщо відповідь - це просто масив книг
        if (Array.isArray(response)) {
          return {
            books: response,
            total: response.length,
            page: arg?.page || 1,
            limit: arg?.limit || 12,
          }
        }

        // Якщо відповідь вже в очікуваному форматі
        return {
          books: response?.books || response || [],
          total: response?.total || response?.count || 0,
          page: arg?.page || 1,
          limit: arg?.limit || 12,
        }
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error("🚨 Books API Error:", response)
        console.error("🚨 Meta:", meta)
        console.error("🚨 Args:", arg)
        return response
      },
      providesTags: ["Book"],
    }),
    getBookById: builder.query({
      query: (id) => `/scraping/book_detail/${id}/`,
      providesTags: (result, error, id) => [{ type: "Book", id }],
    }),
    getRecommendedBooks: builder.query({
      query: (bookId) => `/scraping/book_detail/${bookId}/recommended/`,
      providesTags: ["Book"],
    }),
    getFavorites: builder.query({
      query: () => "/api/favorites/", // Update to match your actual backend endpoint
      providesTags: ["Favorites"],
      transformErrorResponse: (response) => {
        console.error("❌ Get Favorites API Error:", response)
        return response
      },
    }),
    addToFavorites: builder.mutation({
      query: (bookId) => ({
        url: `/api/favorites/add/${bookId}/`, // Update to match your actual backend endpoint
        method: "POST",
      }),
      invalidatesTags: ["Favorites"],
      transformErrorResponse: (response) => {
        console.error("❌ Add to Favorites API Error:", response)
        return response
      },
    }),
    removeFromFavorites: builder.mutation({
      query: (bookId) => ({
        url: `/api/favorites/remove/${bookId}/`, // Update to match your actual backend endpoint
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"],
      transformErrorResponse: (response) => {
        console.error("❌ Remove from Favorites API Error:", response)
        return response
      },
    }),
  }),
})

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useGetRecommendedBooksQuery,
  useGetFavoritesQuery,
  useAddToFavoritesMutation,
  useRemoveFromFavoritesMutation,
} = booksApi
