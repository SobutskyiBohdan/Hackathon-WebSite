import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { booksApi } from "./api/booksApi"
import { authApi } from "./api/authApi"
import authReducer from "./slices/authSlice"
import favoritesReducer from "./slices/favoritesSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(booksApi.middleware, authApi.middleware),
})

setupListeners(store.dispatch)
