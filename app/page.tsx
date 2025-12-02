import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { BenefitsBar } from "@/components/benefits-bar"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <BenefitsBar />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
    </main>
  )
}
