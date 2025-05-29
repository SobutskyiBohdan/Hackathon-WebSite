"use client"

import { Toaster } from "react-hot-toast"

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: "#fff",
          color: "#4b2e2b",
          border: "1px solid #a1866f",
          borderRadius: "8px",
          fontSize: "14px",
        },
        success: {
          style: {
            border: "1px solid #10b981",
          },
        },
        error: {
          style: {
            border: "1px solid #ef4444",
          },
        },
      }}
    />
  )
}
