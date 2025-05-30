"use client"

import { useState, useEffect } from "react"
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isOpen && !isVisible) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
      isOpen ? "opacity-100" : "opacity-0"
    }`}>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onCancel}></div>
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative z-10 transform transition-transform duration-300">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-black">{title}</h3>
        </div>
        
        <p className="text-brown-secondary mb-6">{message}</p>
        
        <div className="flex justify-end gap-4">
          <button 
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}