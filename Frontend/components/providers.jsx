"use client"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import ToastProvider from "./toast-provider"

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <ToastProvider />
      {children}
    </Provider>
  )
}
