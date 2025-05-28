"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, Star } from "lucide-react"
import Link from "next/link"
import toast from "react-hot-toast"
import { useAppSelector } from "@/lib/hooks"
import Breadcrumb from "@/components/breadcrumb"

export default function AddBookPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    year: "",
    description: "",
    price: "",
    inStock: "",
    rating: 0,
    image: null,
  })

  // Redirect if not admin
  if (!isAuthenticated || !user?.is_staff) {
    router.push("/")
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Here you would make API call to create book
      // const result = await createBook(formData)
      toast.success("Book added successfully!")
      router.push("/admin")
    } catch (error) {
      toast.error("Failed to add book. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleStarClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin" }, { label: "Add Book" }]} />

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <Link href="/admin" className="text-brown-secondary hover:text-brown-primary transition-colors mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-black">Add New Book</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Image Upload */}
              <div className="lg:col-span-1">
                <label className="block text-brown-secondary font-semibold mb-4">Book Cover</label>
                <div className="upload-area bg-cream rounded-xl p-8 text-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {formData.image ? (
                      <div>
                        <img
                          src={URL.createObjectURL(formData.image) || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full max-w-48 mx-auto rounded-lg mb-4"
                        />
                        <p className="text-brown-secondary">Click to change image</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-brown-secondary mx-auto mb-4" />
                        <p className="text-brown-secondary font-medium">Upload image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-brown-secondary font-semibold mb-2">Book Title</label>
                    <input
                      type="text"
                      placeholder="Enter book title"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-brown-secondary font-semibold mb-2">Publication Year</label>
                    <input
                      type="text"
                      placeholder="Enter publication year"
                      value={formData.year}
                      onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-brown-secondary font-semibold mb-2">Description</label>
                  <textarea
                    placeholder="Enter book description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-brown-secondary font-semibold mb-2">Number of Copies</label>
                    <input
                      type="number"
                      placeholder="Enter number of copies"
                      value={formData.inStock}
                      onChange={(e) => setFormData((prev) => ({ ...prev, inStock: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-brown-secondary font-semibold mb-2">Price (£)</label>
                    <input
                      type="text"
                      placeholder="Enter price (£)"
                      value={formData.price}
                      onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                      className="w-full border-2 border-brown-secondary rounded-lg px-4 py-3 bg-white search-input focus:outline-none focus:border-brown-primary"
                      required
                    />
                  </div>
                </div>

                {/* Star Rating */}
                <div>
                  <label className="block text-brown-secondary font-semibold mb-4">Select a star rating</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => handleStarClick(star)} className="star">
                        <Star
                          className={`w-8 h-8 ${
                            star <= formData.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary text-white px-12 py-4 rounded-lg font-semibold text-lg disabled:opacity-50"
              >
                {isLoading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
