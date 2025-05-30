"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Filter, BookOpen } from "lucide-react"
import { useGetBooksQuery } from "@/lib/api/booksApi"
import { useAppSelector } from "@/lib/hooks"
import Breadcrumb from "@/components/breadcrumb"
import toast from "react-hot-toast"

export default function ExportBooksPage() {
  const router = useRouter()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [selectedGenres, setSelectedGenres] = useState([])
  const [selectedBooks, setSelectedBooks] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [exportFormat, setExportFormat] = useState("excel")
  const [isExporting, setIsExporting] = useState(false)

  const { data, isLoading, error } = useGetBooksQuery({ limit: 100 })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const genres = data?.books
    ? [...new Set(data.books.map((book) => book.genre).filter(Boolean))].filter((genre) => typeof genre === "string") // Фільтруємо тільки рядки
    : []

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedBooks([])
    } else {
      setSelectedBooks(data?.books.map((book) => book.id) || [])
    }
    setSelectAll(!selectAll)
  }

  const handleSelectBook = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId))
      setSelectAll(false)
    } else {
      setSelectedBooks([...selectedBooks, bookId])

      if (data?.books && selectedBooks.length + 1 === data.books.length) {
        setSelectAll(true)
      }
    }
  }

  const handleSelectGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre))

      const booksToRemove = data?.books.filter((book) => book.genre === genre).map((book) => book.id) || []

      setSelectedBooks(selectedBooks.filter((id) => !booksToRemove.includes(id)))
    } else {
      setSelectedGenres([...selectedGenres, genre])

      const booksToAdd =
        data?.books.filter((book) => book.genre === genre && !selectedBooks.includes(book.id)).map((book) => book.id) ||
        []

      setSelectedBooks([...selectedBooks, ...booksToAdd])
    }
  }

  const handleExport = async () => {
    if (selectedBooks.length === 0) {
      toast.error("Please select at least one book to export")
      return
    }

    setIsExporting(true)

    try {
      const booksToExport = data?.books.filter((book) => selectedBooks.includes(book.id)) || []

      if (exportFormat === "excel") {
        let csvContent = "Title,Author,Year,Price,Genre,Rating\n"

        booksToExport.forEach((book) => {
          csvContent += `"${book.title || ""}","${book.author || ""}","${book.year || ""}","${book.price || ""}","${book.genre || ""}","${book.rating || ""}"\n`
        })

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `books_export_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } else if (exportFormat === "json") {
        const jsonData = JSON.stringify(booksToExport, null, 2)
        const blob = new Blob([jsonData], { type: "application/json;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `books_export_${new Date().toISOString().slice(0, 10)}.json`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      }

      toast.success(`Successfully exported ${booksToExport.length} books`)
    } catch (error) {
      console.error("Export error:", error)
      toast.error("Failed to export books. Please try again.")
    } finally {
      setIsExporting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Profile", href: "/profile" }, { label: "Export Books" }]}
        />

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-brown-secondary hover:text-brown-primary transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-bold text-black">Export Books</h1>
            </div>
            <button
              onClick={handleExport}
              disabled={isExporting || selectedBooks.length === 0}
              className="btn-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              {isExporting ? "Exporting..." : "Export Selected"}
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4">Export Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-brown-secondary font-semibold mb-2">Format</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="excel"
                      checked={exportFormat === "excel"}
                      onChange={() => setExportFormat("excel")}
                      className="w-4 h-4 text-brown-primary"
                    />
                    <span>CSV (Excel)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="json"
                      checked={exportFormat === "json"}
                      onChange={() => setExportFormat("json")}
                      className="w-4 h-4 text-brown-primary"
                    />
                    <span>JSON</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-brown-secondary font-semibold mb-2">Selection</label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="selectAll"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-brown-primary"
                  />
                  <label htmlFor="selectAll" className="cursor-pointer">
                    Select All Books ({data?.books?.length || 0})
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter by Genre
            </h2>
            <div className="flex flex-wrap gap-3">
              {genres.map((genre, index) => (
                <button
                  key={`genre-${index}-${genre}`} // ВИПРАВЛЕНО: унікальний ключ
                  onClick={() => handleSelectGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGenres.includes(genre)
                      ? "bg-brown-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Select Books to Export
            </h2>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brown-primary mx-auto"></div>
                <p className="mt-4 text-brown-secondary">Loading books...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500">Failed to load books. Please try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 font-semibold text-brown-secondary w-16">Select</th>
                      <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Title</th>
                      <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Author</th>
                      <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Year</th>
                      <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Genre</th>
                      <th className="text-left py-4 px-4 font-semibold text-brown-secondary">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.books?.map((book) => (
                      <tr key={`book-${book.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                        {" "}
                        <td className="py-4 px-4">
                          <input
                            type="checkbox"
                            checked={selectedBooks.includes(book.id)}
                            onChange={() => handleSelectBook(book.id)}
                            className="w-5 h-5 text-brown-primary rounded"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book.image || "/placeholder.svg?height=50&width=40"}
                              alt={book.title}
                              className="w-10 h-12 object-cover rounded"
                            />
                            <span className="font-medium text-black">{book.title}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-brown-secondary">{book.author || "-"}</td>
                        <td className="py-4 px-4 text-brown-secondary">{book.year || "-"}</td>
                        <td className="py-4 px-4">
                          {book.genre && typeof book.genre === "string" ? (
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">{book.genre}</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="py-4 px-4 text-black font-medium">{book.price || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center">
              <div className="text-brown-secondary">
                Selected: <span className="font-bold">{selectedBooks.length}</span> of{" "}
                <span className="font-bold">{data?.books?.length || 0}</span> books
              </div>
              <button
                onClick={handleExport}
                disabled={isExporting || selectedBooks.length === 0}
                className="btn-primary text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                {isExporting ? "Exporting..." : "Export Selected"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
