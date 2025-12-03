"use client"

import type { Product } from "@/lib/products"
import { products as seedProducts } from "@/lib/products"
import { getSupabase, hasSupabase } from "@/lib/supabase-client"

export type PixKeyType = "Chave Aleatória" | "Telefone" | "E-mail" | "CPF" | "CNPJ"

export interface ExtendedProduct extends Product {
  description?: string
  season?: string
  images?: string[]
  available?: boolean
  isPreSale?: boolean
  pixKey?: string
  pixKeyType?: PixKeyType
  whatsapp?: string
  linkMercadoPago?: string
  linkPayPal?: string
  linkPicPay?: string
}

// ===== Supabase integration (optional) =====
export async function loadProductsAsync(): Promise<ExtendedProduct[]> {
  if (hasSupabase()) {
    const sb = getSupabase()!
    const { data, error } = await sb
      .from("products")
      .select("id, data, created_at")
      .order("created_at", { ascending: false })
    if (error) console.error(error)
    const rows = (data as { id: string; data: any; created_at: string }[] | null) ?? []
    const arr: ExtendedProduct[] = rows.map((row) => ({ id: row.id, ...(row.data || {}) }))
    return arr.map((p) => ({
      ...p,
      images: p.images ?? (p.image ? [p.image] : []),
      available: p.available ?? true,
      isPreSale: p.isPreSale ?? false,
      pixKeyType: (p.pixKeyType as PixKeyType) ?? "Chave Aleatória",
    }))
  }
  return loadProducts()
}

export async function upsertProductAsync(
  current: ExtendedProduct[],
  product: ExtendedProduct,
): Promise<ExtendedProduct[]> {
  if (hasSupabase()) {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "GN125436", product }),
      })
      if (!res.ok) throw new Error("Falha ao salvar no banco")
      return await loadProductsAsync()
    } catch (e) {
      console.warn("API indisponível, tentando upsert local.")
    }
  }
  return upsertProduct(current, product)
}

export async function deleteProductAsync(current: ExtendedProduct[], id: string): Promise<ExtendedProduct[]> {
  if (hasSupabase()) {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: "GN125436" }),
      })
      if (!res.ok) throw new Error("Falha ao excluir no banco")
      return await loadProductsAsync()
    } catch (e) {
      console.warn("API indisponível, tentando exclusão local.")
    }
  }
  return deleteProduct(current, id)
}

const STORAGE_KEY = "gn_admin_products_v1"
export const AUTH_KEY = "gn_admin_authed"

function mapSeedToExtended(seed: Product): ExtendedProduct {
  return {
    ...seed,
    description: "",
    season: "",
    images: seed.image ? [seed.image] : [],
    available: true,
    isPreSale: false,
    pixKey: "",
    pixKeyType: "Chave Aleatória",
    whatsapp: "",
    linkMercadoPago: "",
    linkPayPal: "",
    linkPicPay: "",
  }
}

export function loadProducts(): ExtendedProduct[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedProducts.map(mapSeedToExtended)
    const parsed = JSON.parse(raw) as ExtendedProduct[]
    // Backfill defaults for new fields
    return parsed.map((p) => ({
      ...mapSeedToExtended(p as Product),
      ...p,
      images: p.images ?? (p.image ? [p.image] : []),
      available: p.available ?? true,
      isPreSale: p.isPreSale ?? false,
      pixKeyType: p.pixKeyType ?? "Chave Aleatória",
    }))
  } catch {
    return seedProducts.map(mapSeedToExtended)
  }
}

export function saveProducts(list: ExtendedProduct[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function upsertProduct(list: ExtendedProduct[], product: ExtendedProduct): ExtendedProduct[] {
  // Normalize: keep primary image in images[0] and sync product.image
  const images = product.images ?? (product.image ? [product.image] : [])
  const primary = images && images.length ? images[0] : "/placeholder.svg"
  const normalized: ExtendedProduct = { ...product, images, image: primary }
  const idx = list.findIndex((p) => p.id === product.id)
  const next = [...list]
  if (idx >= 0) next[idx] = normalized
  else next.unshift(normalized)
  saveProducts(next)
  try { if (typeof window !== "undefined") localStorage.setItem(`gn_image_primary_${String(product.id)}`, primary) } catch {}
  return next
}

export function deleteProduct(list: ExtendedProduct[], id: string): ExtendedProduct[] {
  const next = list.filter((p) => p.id !== id)
  saveProducts(next)
  return next
}

export function getCounts(list: ExtendedProduct[]) {
  return {
    total: list.length,
    available: list.filter((p) => p.available !== false).length,
    featured: list.filter((p) => p.isFeatured).length,
    hidden: list.filter((p) => p.available === false).length,
  }
}
