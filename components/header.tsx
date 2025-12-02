"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function Header() {
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/images/59c603f7-dba6-4c37-9362-839b01de4091-removebg-preview.png"
            alt="GN Football"
            width={70}
            height={80}
            className="w-auto h-16"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link href="/" className="text-white hover:text-[#d4a84b] transition-colors text-sm font-medium">
            Início
          </Link>
          <Link href="/catalogo" className="text-white hover:text-[#d4a84b] transition-colors text-sm font-medium">
            Catálogo
          </Link>
          <div className="relative">
            <button
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              className="flex items-center gap-1 text-white hover:text-[#d4a84b] transition-colors text-sm font-medium"
            >
              Categorias
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            {categoriesOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link href="/categoria/brasileiros" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Times Brasileiros
                </Link>
                <Link href="/categoria/europeus" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Times Europeus
                </Link>
                <Link href="/categoria/selecoes" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Seleções
                </Link>
                <Link href="/categoria/retro" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Retrôs
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
