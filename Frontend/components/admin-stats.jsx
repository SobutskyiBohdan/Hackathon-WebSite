"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, ShoppingCart, TrendingUp } from 'lucide-react'

export default function AdminStats() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    revenue: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Тут буде запит до API для отримання статистики
    // Поки що використовуємо моковані дані
    setTimeout(() => {
      setStats({
        totalBooks: 120,
        totalUsers: 45,
        totalOrders: 78,
        revenue: 3450
      })
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const statItems = [
    {
      title: "Total Books",
      value: stats.totalBooks,
      icon: <BookOpen className="w-6 h-6 text-white" />,
      color: "bg-brown-primary"
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6 text-white" />,
      color: "bg-brown-secondary"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingCart className="w-6 h-6 text-white" />,
      color: "bg-green-500"
    },
    {
      title: "Revenue",
      value: `£${stats.revenue}`,
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      color: "bg-blue-500"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black">{item.value}</h3>
              <p className="text-brown-secondary">{item.title}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}