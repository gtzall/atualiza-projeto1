"use client"

import { useState } from "react"
import Link from "next/link"
import type { Product } from "@/lib/products"

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

function TruckIcon({ className }: { className?: string }) {
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
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("")

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          {product.discount ? (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#d4a84b] text-white text-xs font-bold px-3 py-1 rounded">-{product.discount}%</span>
            </div>
          ) : product.isFeatured ? (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#d4a84b] text-white text-xs font-medium px-3 py-1 rounded">Destaque</span>
            </div>
          ) : null}
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-gray-500">{product.category}</span>
            <span className="text-gray-400">•</span>
            <span className="text-[#d4a84b]">{product.subcategory}</span>
            {product.type && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{product.type}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-[#d4a84b]" />
              ))}
            </div>
            <span className="text-gray-500 text-sm">Qualidade Premium</span>
          </div>

          {/* Price */}
          <div className="mb-8">
            {product.originalPrice && (
              <p className="text-lg text-gray-400 line-through mb-1">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </p>
            )}
            <p className="text-3xl font-semibold text-[#d4a84b]">R$ {product.price.toFixed(2).replace(".", ",")}</p>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">TAMANHO</p>
            <div className="flex gap-3">
              {(product.sizes || ["P", "M", "G", "GG"]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 border-2 flex items-center justify-center text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-[#d4a84b] bg-[#d4a84b] text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">FORMAS DE PAGAMENTO</p>
            <Link
              href="https://wa.me/5511960385479"
              target="_blank"
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#25D366] transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#25D366] flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">WhatsApp</p>
                  <p className="text-sm text-gray-500">Fale com o vendedor</p>
                </div>
              </div>
              <ExternalLinkIcon className="w-5 h-5 text-gray-400 group-hover:text-[#25D366]" />
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <TruckIcon className="w-5 h-5 text-[#d4a84b]" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Envio Nacional</p>
                <p className="text-xs text-gray-500">Para todo Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-5 h-5 text-[#d4a84b]" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Garantia</p>
                <p className="text-xs text-gray-500">30 dias de troca</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
