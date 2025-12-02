"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { CatalogFilters } from "@/components/catalog-filters"
import { products, priceRanges } from "@/lib/products"

export default function CatalogoPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPriceRange, setSelectedPriceRange] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryMap: Record<string, string> = {
        "times-europeus": "TIMES EUROPEUS",
        "times-brasileiros": "TIMES BRASILEIROS",
        selecoes: "SELEÇÕES",
        "outros-continentes": "OUTROS CONTINENTES",
        retros: "RETRÔS",
      }
      filtered = filtered.filter((p) => p.category === categoryMap[selectedCategory])
    }

    // Filter by price range
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.id === selectedPriceRange)
      if (range) {
        filtered = filtered.filter((p) => p.price >= range.min && p.price <= range.max)
      }
    }

    return filtered
  }, [selectedCategory, selectedPriceRange])

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#1a1a1a]">
        <Header />
      </div>

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[#d4a84b] text-sm tracking-[0.3em] uppercase mb-3">NOSSA COLEÇÃO</p>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900">Catálogo Completo</h1>
          </div>

          {/* Category Tabs (Mobile/Desktop) */}
          <div className="flex flex-wrap justify-center gap-2 mb-8 lg:hidden">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "all" ? "bg-[#1a1a1a] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => setSelectedCategory("times-europeus")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "times-europeus"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              TIMES EUROPEUS
            </button>
            <button
              onClick={() => setSelectedCategory("times-brasileiros")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "times-brasileiros"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              TIMES BRASILEIROS
            </button>
            <button
              onClick={() => setSelectedCategory("selecoes")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "selecoes"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              SELEÇÕES
            </button>
            <button
              onClick={() => setSelectedCategory("outros-continentes")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "outros-continentes"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              OUTROS CONTINENTES
            </button>
            <button
              onClick={() => setSelectedCategory("retros")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === "retros"
                  ? "bg-[#1a1a1a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              RETRÔS
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters (Desktop) */}
            <div className="hidden lg:block">
              <CatalogFilters
                selectedCategory={selectedCategory}
                selectedPriceRange={selectedPriceRange}
                onCategoryChange={setSelectedCategory}
                onPriceRangeChange={setSelectedPriceRange}
              />
            </div>

            {/* Products */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">{filteredProducts.length}</span> produtos encontrados
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <line x1="3" y1="12" x2="21" y2="12" />
                      <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Products Grid/List */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="text-gray-500 text-xs tracking-wider">
                          {product.category} • <span className="text-[#d4a84b]">{product.subcategory}</span>
                        </p>
                        <h3 className="text-gray-900 font-medium mt-1">{product.name}</h3>
                        <div className="mt-2 flex items-center gap-2">
                          {product.originalPrice && (
                            <span className="text-gray-400 text-sm line-through">
                              R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                            </span>
                          )}
                          <span className="text-[#d4a84b] font-bold text-lg">
                            R$ {product.price.toFixed(2).replace(".", ",")}
                          </span>
                          {product.discount && (
                            <span className="bg-[#d4a84b] text-white text-xs px-2 py-0.5 rounded">
                              -{product.discount}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado com os filtros selecionados.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
