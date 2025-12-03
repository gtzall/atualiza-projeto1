"use client"

import type { Product } from "@/lib/products"
import { products as seedProducts, getProductById as getSeedById } from "@/lib/products"
import { loadProducts, loadProductsAsync, type ExtendedProduct } from "@/lib/admin-store"
import { hasSupabase } from "@/lib/supabase-client"

export function getRuntimeProducts(): (Product & { images?: string[] })[] {
  try {
    const list = loadProducts() as ExtendedProduct[]
    return list.map((p) => ({ ...p, id: String((p as any).id), image: p.images?.[0] || p.image }))
  } catch {
    return seedProducts
  }
}

export function getRuntimeProductById(id: string): (Product & { images?: string[] }) | undefined {
  try {
    const list = getRuntimeProducts()
    return list.find((p) => String((p as any).id) === String(id)) || getSeedById(id)
  } catch {
    return getSeedById(id)
  }
}

export async function getRuntimeProductsAsync(): Promise<(Product & { images?: string[] })[]> {
  if (hasSupabase()) {
    const list = await loadProductsAsync()
    return list.map((p) => ({ ...p, id: String((p as any).id), image: (p as any).images?.[0] || p.image }))
  }
  return getRuntimeProducts()
}

export async function getRuntimeProductByIdAsync(
  id: string,
): Promise<(Product & { images?: string[] }) | undefined> {
  if (hasSupabase()) {
    const list = await getRuntimeProductsAsync()
    return list.find((p) => String((p as any).id) === String(id)) || getSeedById(id)
  }
  return getRuntimeProductById(id)
}
