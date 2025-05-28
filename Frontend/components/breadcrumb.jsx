import Link from "next/link"

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 mb-8 text-brown-secondary animate-fade-in">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-brown-primary transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="text-black font-semibold">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="text-brown-secondary">{">"}</span>}
        </div>
      ))}
    </nav>
  )
}
