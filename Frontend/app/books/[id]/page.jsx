"use client"

import { useParams } from "next/navigation"
import { Heart, Star } from "lucide-react"
import { useGetBookByIdQuery, useGetRecommendedBooksQuery } from "@/lib/api/booksApi"
import BookCard from "@/components/book-card"
import Breadcrumb from "@/components/breadcrumb"

export default function BookDetailsPage() {
  const params = useParams()
  const bookId = params.id

  const { data: book, isLoading, error } = useGetBookByIdQuery(bookId)
  const { data: recommendedBooks } = useGetRecommendedBooksQuery(bookId)

  if (isLoading)
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-primary mx-auto"></div>
        <p className="mt-4 text-brown-secondary">Loading book details...</p>
      </div>
    )

  if (error || !book)
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Book not found</p>
      </div>
    )

  const renderStars = (rating = 4) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-6 h-6 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: book.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Book Image and Details */}
          <div className="animate-slide-in">
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <img
                  src={book.image || "/placeholder.svg?height=500&width=350"}
                  alt={book.title}
                  className="w-full rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="mt-8 text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">{renderStars(book.rating)}</div>
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-black font-medium">In stock: {book.inStock || 19} copies</span>
              </div>
              <div className="flex items-center gap-6 justify-center lg:justify-start">
                <span className="text-4xl font-bold text-brown-primary">{book.price}</span>
                <button className="p-3 rounded-full bg-red-50 hover:bg-red-100 transition-colors">
                  <Heart className="w-8 h-8 text-red-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="animate-fade-in">
            <h1 className="text-5xl font-bold text-black mb-6 leading-tight">{book.title}</h1>
            <p className="text-2xl text-brown-secondary mb-8 font-medium">{book.year}</p>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-black mb-4">Description</h3>
              <div className="text-black leading-relaxed text-lg">
                <p>
                  {book.description ||
                    "Aaron Ledbetter's future had been planned out for him since before he was born. Each year, the Ledbetter family vacation on Tybee Island gave Aaron a chance to briefly free himself from his family's expectations. When he meets Jonas \"Lucky\" Luckett, a caricature artist in town with the traveling carnival, he must choose between the life that's been mapped out for him, and the chance at true love."}
                </p>
                <button className="text-brown-primary hover:text-brown-secondary mt-4 font-medium">...read more</button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Books */}
        {recommendedBooks && recommendedBooks.length > 0 && (
          <div className="animate-fade-in">
            <h2 className="text-3xl font-bold text-black mb-8">Recommended Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {recommendedBooks.map((book, index) => (
                <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-12">
          <div className="w-12 h-12 rounded-full bg-brown-primary text-white font-bold flex items-center justify-center shadow-lg">
            1
          </div>
        </div>
      </div>
    </div>
  )
}
