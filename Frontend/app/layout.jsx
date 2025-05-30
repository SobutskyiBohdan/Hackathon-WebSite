import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: "Book Shelf - Your Personal Library",
  description: "Discover, collect, and manage your favorite books",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Book Shelf - Your Personal Library",
    description: "Discover, collect, and manage your favorite books",
    url: "https://your-domain.com",
    siteName: "Book Shelf",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Book Shelf - Your Personal Library",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Book Shelf - Your Personal Library",
    description: "Discover, collect, and manage your favorite books",
    images: ["/og-image.png"],
  },
}

// Окремий експорт для viewport (новий спосіб Next.js 14+)
export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4b2e2b",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Додаткові favicon для кращої сумісності */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        {/* Видаляємо дублікат meta theme-color, бо тепер він в viewport */}
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-cream">
            <Header />
            <main className="animate-fade-in">{children}</main>
            <footer className="text-center py-8 bg-brown-primary mt-16">
              <p className="text-white font-medium">© 2025 Book Shelf</p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}