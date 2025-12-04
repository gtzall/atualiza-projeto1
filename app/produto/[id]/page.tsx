import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { products, getProductById } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  // Use seed if exists; otherwise, pass a minimal placeholder (ProductDetail hidrata do runtime/Supabase)
  const product =
    getProductById(id) ||
    ({ id, name: "Produto", category: "", subcategory: "", image: "/placeholder.svg", price: 0 } as (typeof products)[number])

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#1a1a1a]">
        <Header />
      </div>
      <div className="pt-20">
        <ProductDetail product={product} />
      </div>
      <Footer />
    </main>
  )
}
