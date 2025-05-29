"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ToastProvider from "./toast-provider"
import AuthInitializer from "./auth-initializer"

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        <ToastProvider />
        {children}
      </AuthInitializer>
    </Provider>
  )
}
