import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { products, getProductById } from "@/lib/products"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = getProductById(id) || products[0]

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
