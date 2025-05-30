"use client"

import { useState } from "react"
import { Search } from 'lucide-react'

export default function AdminSearchFilter({ onSearch }) {
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    yearFrom: "",
    yearTo: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(filters)
  }

  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-brown-secondary mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Search by title or description"
                className="w-full border-2 border-brown-secondary rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-brown-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-brown-secondary" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-secondary mb-1">Genre</label>
            <input
              type="text"
              name="genre"
              value={filters.genre}
              onChange={handleChange}
              placeholder="Filter by genre"
              className="w-full border-2 border-brown-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brown-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-secondary mb-1">Year From</label>
            <input
              type="number"
              name="yearFrom"
              value={filters.yearFrom}
              onChange={handleChange}
              placeholder="From year"
              className="w-full border-2 border-brown-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brown-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-brown-secondary mb-1">Year To</label>
            <input
              type="number"
              name="yearTo"
              value={filters.yearTo}
              onChange={handleChange}
              placeholder="To year"
              className="w-full border-2 border-brown-secondary rounded-lg px-4 py-2 focus:outline-none focus:border-brown-primary"
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-brown-primary text-white px-6 py-2 rounded-lg hover:bg-brown-secondary transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  )
}