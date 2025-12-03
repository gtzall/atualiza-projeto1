"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  category: string
  subcategory: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
  isFeatured?: boolean
  [key: string]: any
}

export function ProductCard({
  id,
  name,
  category,
  subcategory,
  image,
  price,
  originalPrice,
  discount,
  isFeatured,
  ...rest
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  // Precompute URL with snapshot query (supports abrir em nova guia / compartilhar)
  let hrefUrl = `/produto/${encodeURIComponent(id)}`
  try {
    const firstAnyImg = (Array.isArray(rest?.images) && rest.images.length ? rest.images[0] : image) as string | undefined
    let firstImgForUrl = ""
    if (typeof firstAnyImg === "string" && firstAnyImg) {
      if (firstAnyImg.startsWith("data:")) {
        if (firstAnyImg.length <= 8000) firstImgForUrl = firstAnyImg
      } else {
        firstImgForUrl = firstAnyImg
      }
    }
    const snapshot = {
      id,
      name,
      category,
      subcategory,
      image: firstImgForUrl || undefined,
      price,
      originalPrice,
      discount,
      isFeatured,
      available: rest?.available,
      isPreSale: rest?.isPreSale,
      pixKey: rest?.pixKey,
      pixKeyType: rest?.pixKeyType,
      whatsapp: rest?.whatsapp,
      linkMercadoPago: rest?.linkMercadoPago,
      linkPayPal: rest?.linkPayPal,
      linkPicPay: rest?.linkPicPay,
      images: firstImgForUrl ? [firstImgForUrl] : [],
    }
    const json = JSON.stringify(snapshot)
    let b64 = ""
    try {
      b64 = btoa(
        encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)))
      )
    } catch {
      b64 = ""
    }
    if (b64) hrefUrl = `/produto/${encodeURIComponent(id)}?s=${encodeURIComponent(b64)}`
  } catch {}

  return (
    <Link
      href={hrefUrl}
      className="group block"
      onClick={() => {
        try {
          if (typeof window !== "undefined") {
            const snapshot = {
              id,
              name,
              category,
              subcategory,
              image,
              price,
              originalPrice,
              discount,
              isFeatured,
              sizes: rest?.sizes,
              images: rest?.images || (image ? [image] : []),
              available: rest?.available,
              isPreSale: rest?.isPreSale,
              pixKey: rest?.pixKey,
              pixKeyType: rest?.pixKeyType,
              whatsapp: rest?.whatsapp,
              linkMercadoPago: rest?.linkMercadoPago,
              linkPayPal: rest?.linkPayPal,
              linkPicPay: rest?.linkPicPay,
            }
            sessionStorage.setItem(`gn_product_snapshot_${String(id)}`, JSON.stringify(snapshot))
            try { localStorage.setItem(`gn_product_snapshot_${String(id)}`, JSON.stringify(snapshot)) } catch {}
          }
        } catch {}
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#d4a84b] text-white text-xs font-bold px-3 py-1 rounded">-{discount}%</span>
          </div>
        )}

        {/* Featured Badge (only if no discount) */}
        {isFeatured && !discount && (
          <div className="absolute top-4 left-4">
            <span className="bg-[#d4a84b] text-white text-xs font-medium px-3 py-1 rounded">DESTAQUE</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <span className="text-white text-sm tracking-wider border-b border-white pb-1">VER DETALHES</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <p className="text-gray-500 text-xs tracking-wider">
          {category} • <span className="text-[#d4a84b]">{subcategory}</span>
        </p>
        <h3 className="text-gray-900 font-medium mt-1">{name}</h3>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          {originalPrice && (
            <span className="text-gray-400 text-sm line-through">R$ {originalPrice.toFixed(2).replace(".", ",")}</span>
          )}
          <span className="text-[#d4a84b] font-bold text-lg">R$ {price.toFixed(2).replace(".", ",")}</span>
        </div>
      </div>
    </Link>
  )
}
