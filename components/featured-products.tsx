"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ProductCard } from "./product-card"
import { getRuntimeProducts, getRuntimeProductsAsync } from "@/lib/runtime-products"

function ArrowRightIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export function FeaturedProducts() {
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    // Hydrate client-side (localStorage / Supabase)
    getRuntimeProductsAsync()
      .then((r) => setList(r))
      .catch(() => setList(getRuntimeProducts()))
  }, [])
  const featuredProducts = useMemo(
    () => list.filter((p: any) => p.isFeatured && (p.available ?? true) !== false).slice(0, 4),
    [list],
  )

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#d4a84b] text-sm tracking-[0.3em] uppercase mb-3">SELEÇÃO ESPECIAL</p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Em Destaque</h2>
          </div>
          <Link
            href="/catalogo"
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-[#d4a84b] transition-colors"
          >
            Ver todos os produtos
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Mobile link */}
        <Link
          href="/catalogo"
          className="mt-8 flex md:hidden items-center justify-center gap-2 text-gray-600 hover:text-[#d4a84b] transition-colors"
        >
          Ver todos os produtos
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
