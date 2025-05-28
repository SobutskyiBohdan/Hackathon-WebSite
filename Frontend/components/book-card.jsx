"use client"

import Link from "next/link"
import { Heart, Star, ShoppingCart, Eye } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { useAddToFavoritesMutation, useRemoveFromFavoritesMutation } from "@/lib/api/booksApi"
import { addToFavorites, removeFromFavorites } from "@/lib/slices/favoritesSlice"

export default function BookCard({ book }) {
  const dispatch = useAppDispatch()
  const { favoriteIds } = useAppSelector((state) => state.favorites)
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [addToFavoritesMutation] = useAddToFavoritesMutation()
  const [removeFromFavoritesMutation] = useRemoveFromFavoritesMutation()

  const isFavorite = favoriteIds.includes(book.id)

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) return

    try {
      if (isFavorite) {
        await removeFromFavoritesMutation(book.id).unwrap()
        dispatch(removeFromFavorites(book.id))
      } else {
        await addToFavoritesMutation(book.id).unwrap()
        dispatch(addToFavorites(book.id))
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
    }
  }

  const renderStars = (rating = 4) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="bg-white border-0 shadow-lg rounded-2xl overflow-hidden book-card group relative">
      {/* Book Image */}
      <div className="relative overflow-hidden">
        <Link href={`/books/${book.id}`}>
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={book.image || "/placeholder.svg?height=400&width=300"}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        </Link>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2">
            <Link
              href={`/books/${book.id}`}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
            >
              <Eye className="w-5 h-5 text-brown-primary" />
            </Link>
            <button
              onClick={handleFavoriteClick}
              disabled={!isAuthenticated}
              className={`bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all duration-300 shadow-lg ${
                !isAuthenticated ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-brown-primary"}`} />
            </button>
          </div>
        </div>

        {/* Stock badge */}
        {book.inStock && book.inStock > 0 && (
          <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            In Stock: {book.inStock}
          </div>
        )}

        {/* Rating badge */}
        {book.rating && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-medium text-black">{book.rating}</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="p-6">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-bold text-lg mb-2 text-black hover:text-brown-primary transition-colors line-clamp-2 leading-tight">
            {book.title}
          </h3>
        </Link>

        <p className="text-sm mb-2 text-brown-secondary font-medium">{book.author}</p>
        <p className="text-sm mb-3 text-brown-secondary">{book.year}</p>

        {/* Rating stars */}
        <div className="flex items-center gap-1 mb-4">
          {renderStars(book.rating)}
          <span className="text-xs text-brown-secondary ml-1">({book.rating || 4}/5)</span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-2xl text-brown-primary">{book.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              disabled={!isAuthenticated}
              className={`p-2 rounded-full transition-all duration-300 ${
                !isAuthenticated ? "opacity-50 cursor-not-allowed" : "hover:bg-red-50 hover:scale-110"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-brown-secondary hover:text-red-500"
                }`}
              />
            </button>
            <button className="bg-brown-primary text-white p-2 rounded-full hover:bg-brown-secondary transition-all duration-300 hover:scale-110">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick description preview */}
        {book.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{book.description}</p>}
      </div>
    </div>
  )
}
