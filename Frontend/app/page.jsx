"use client"

import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { useGetBooksQuery } from "@/lib/api/booksApi"
import BookCard from "@/components/book-card"
import Pagination from "@/components/pagination"

export default function HomePage() {
  const [searchParams, setSearchParams] = useState({
    title: "",
    genre: "",
    fromYear: "",
    toYear: "",
    page: 1,
    limit: 12,
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, error } = useGetBooksQuery(searchParams)

  const handleSearch = () => {
    setSearchParams((prev) => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => ({ ...prev, page: newPage }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const clearFilters = () => {
    setSearchParams({
      title: "",
      genre: "",
      fromYear: "",
      toYear: "",
      page: 1,
      limit: 12,
    })
  }

  // Розрахунок загальної кількості сторінок
  const totalPages = Math.ceil((data?.total || 0) / searchParams.limit)

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brown-primary mx-auto mb-4"></div>
          <p className="text-xl text-brown-secondary font-medium">Loading amazing books...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-black mb-2">Oops! Something went wrong</h2>
          <p className="text-brown-secondary mb-4">We couldn't load the books. Please try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary text-white px-6 py-3 rounded-lg font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brown-primary via-brown-secondary to-light-cream overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Discover Your Next
              <span className="block text-light-cream">Great Read</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 animate-slide-in">
              Explore thousands of books from every genre. Find your perfect story today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-medium">
                📚 {data?.total || 0}+ Books
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-medium">
                ⭐ Top Rated
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 text-white font-medium">
                🚚 Fast Delivery
              </div>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 animate-slide-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Find Your Perfect Book</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-brown-secondary hover:text-brown-primary transition-colors"
              >
                <Filter className="w-5 h-5" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {/* Main Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for books, authors, or genres..."
                  value={searchParams.title}
                  onChange={(e) => setSearchParams((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border-2 border-brown-secondary rounded-xl px-6 py-4 bg-white text-lg search-input focus:outline-none focus:border-brown-primary"
                />
              </div>
              <button
                onClick={handleSearch}
                className="btn-primary text-white font-medium rounded-xl px-8 py-4 flex items-center gap-3 whitespace-nowrap"
              >
                <Search className="w-5 h-5" />
                Search Books
              </button>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t border-gray-200 pt-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-brown-secondary font-medium mb-2">Genre</label>
                    <select
                      value={searchParams.genre}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, genre: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white text-brown-secondary search-input focus:outline-none focus:border-brown-primary"
                    >
                      <option value="">All Genres</option>
                      <option value="fiction">Fiction</option>
                      <option value="non-fiction">Non-Fiction</option>
                      <option value="romance">Romance</option>
                      <option value="mystery">Mystery</option>
                      <option value="fantasy">Fantasy</option>
                      <option value="science-fiction">Science Fiction</option>
                      <option value="biography">Biography</option>
                      <option value="history">History</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-brown-secondary font-medium mb-2">From Year</label>
                    <input
                      type="number"
                      placeholder="2000"
                      value={searchParams.fromYear}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, fromYear: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                      min="1900"
                      max="2024"
                    />
                  </div>
                  <div>
                    <label className="block text-brown-secondary font-medium mb-2">To Year</label>
                    <input
                      type="number"
                      placeholder="2024"
                      value={searchParams.toYear}
                      onChange={(e) => setSearchParams((prev) => ({ ...prev, toYear: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                      min="1900"
                      max="2024"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full border-2 border-brown-secondary text-brown-secondary px-4 py-3 rounded-lg font-medium hover:bg-brown-secondary hover:text-white transition-all duration-300"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold text-black">
                {searchParams.title || searchParams.genre || searchParams.fromYear || searchParams.toYear
                  ? "Search Results"
                  : "All Books"}
              </h3>
              <p className="text-brown-secondary">
                {data?.total ? `${data.total} books found` : "No books found"}
                {searchParams.title && ` for "${searchParams.title}"`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-brown-secondary">Sort by:</span>
              <select className="border-2 border-brown-secondary rounded-lg px-4 py-2 bg-white text-brown-secondary focus:outline-none focus:border-brown-primary">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {/* Books Grid */}
          {data?.books && data.books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
                {data.books.map((book, index) => (
                  <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <BookCard book={book} />
                  </div>
                ))}
              </div>

              {/* Використання компонента Pagination */}
              <Pagination 
                currentPage={searchParams.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            /* No Results */
            <div className="text-center py-16 animate-fade-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">No books found</h3>
              <p className="text-brown-secondary mb-8 max-w-md mx-auto">
                We couldn't find any books matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button onClick={clearFilters} className="btn-primary text-white px-8 py-3 rounded-lg font-medium">
                Clear All Filters
              </button>
            </div>
          )}

          {/* Featured Categories */}
          <div className="mt-20 animate-fade-in">
            <h2 className="text-3xl font-bold text-black mb-8 text-center">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Fiction", icon: "📖", color: "bg-blue-100 text-blue-600" },
                { name: "Romance", icon: "💕", color: "bg-pink-100 text-pink-600" },
                { name: "Mystery", icon: "🔍", color: "bg-purple-100 text-purple-600" },
                { name: "Fantasy", icon: "🧙‍♂️", color: "bg-green-100 text-green-600" },
                { name: "Science Fiction", icon: "🚀", color: "bg-indigo-100 text-indigo-600" },
                { name: "Biography", icon: "👤", color: "bg-yellow-100 text-yellow-600" },
                { name: "History", icon: "🏛️", color: "bg-red-100 text-red-600" },
                { name: "Non-Fiction", icon: "📚", color: "bg-gray-100 text-gray-600" },
              ].map((category, index) => (
                <button
                  key={category.name}
                  onClick={() =>
                    setSearchParams((prev) => ({
                      ...prev,
                      genre: category.name.toLowerCase().replace(" ", "-"),
                      page: 1,
                    }))
                  }
                  className={`${category.color} rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="font-semibold">{category.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}