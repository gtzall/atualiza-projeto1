import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"

const categoryData: Record<
  string,
  {
    title: string
    subtitle: string
    products: Array<{
      id: string
      name: string
      category: string
      subcategory: string
      image: string
      isFeatured?: boolean
    }>
  }
> = {
  brasileiros: {
    title: "Times Brasileiros",
    subtitle: "Flamengo, Corinthians, Palmeiras e mais",
    products: [
      {
        id: "6",
        name: "Camiseta Flamengo (Premium)",
        category: "BRASIL",
        subcategory: "FLAMENGO",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: true,
      },
      {
        id: "9",
        name: "Camiseta Corinthians (Premium)",
        category: "BRASIL",
        subcategory: "CORINTHIANS",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: false,
      },
      {
        id: "10",
        name: "Camiseta Palmeiras (Premium)",
        category: "BRASIL",
        subcategory: "PALMEIRAS",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: false,
      },
      {
        id: "11",
        name: "Camiseta São Paulo (Premium)",
        category: "BRASIL",
        subcategory: "SÃO PAULO",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: false,
      },
    ],
  },
  europeus: {
    title: "Times Europeus",
    subtitle: "Real Madrid, Barcelona, Liverpool e mais",
    products: [
      {
        id: "1",
        name: "Camiseta AC Milan (Premium)",
        category: "EUROPA",
        subcategory: "AC MILAN",
        image: "/ac-milan-gray-away-jersey-with-emirates-sponsor-on.jpg",
        isFeatured: true,
      },
      {
        id: "2",
        name: "Camiseta Ajax Edição Limitada (Premium)",
        category: "EUROPA",
        subcategory: "AJAX",
        image: "/ajax-white-special-edition-jersey-with-bob-marley-.jpg",
        isFeatured: true,
      },
      {
        id: "3",
        name: "Camiseta Barcelona (Premium)",
        category: "EUROPA",
        subcategory: "BARCELONA",
        image: "/barcelona-dark-gray-third-jersey-with-spotify-spon.jpg",
        isFeatured: true,
      },
      {
        id: "4",
        name: "Camiseta Celtic (Premium)",
        category: "EUROPA",
        subcategory: "CELTIC",
        image: "/celtic-green-and-white-hooped-home-jersey-with-daf.jpg",
        isFeatured: true,
      },
      {
        id: "7",
        name: "Camiseta Real Madrid (Premium)",
        category: "EUROPA",
        subcategory: "REAL MADRID",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: false,
      },
    ],
  },
  selecoes: {
    title: "Seleções",
    subtitle: "Brasil, Argentina, Portugal e mais",
    products: [
      {
        id: "5",
        name: "Camiseta Portugal (Premium)",
        category: "SELEÇÕES",
        subcategory: "PORTUGAL",
        image: "/portugal-red-home-jersey-with-puma-logo-on-wooden-.jpg",
        isFeatured: true,
      },
      {
        id: "8",
        name: "Camiseta Argentina (Premium)",
        category: "SELEÇÕES",
        subcategory: "ARGENTINA",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: false,
      },
      {
        id: "12",
        name: "Camiseta Brasil (Premium)",
        category: "SELEÇÕES",
        subcategory: "BRASIL",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: true,
      },
    ],
  },
  retro: {
    title: "Retrôs",
    subtitle: "Camisas clássicas históricas",
    products: [
      {
        id: "13",
        name: "Camiseta Brasil 2002 Retrô",
        category: "RETRÔ",
        subcategory: "BRASIL",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: true,
      },
      {
        id: "14",
        name: "Camiseta Argentina 1986 Retrô",
        category: "RETRÔ",
        subcategory: "ARGENTINA",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: true,
      },
      {
        id: "15",
        name: "Camiseta Milan 2007 Retrô",
        category: "RETRÔ",
        subcategory: "AC MILAN",
        image: "/placeholder.svg?height=500&width=500",
        isFeatured: false,
      },
    ],
  },
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categoryData[slug] || categoryData.brasileiros

  return (
    <main className="min-h-screen bg-white">
      <div className="bg-[#1a1a1a]">
        <Header />
      </div>

      <div className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <p className="text-[#d4a84b] text-sm tracking-[0.3em] uppercase mb-3">CATEGORIA</p>
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2">{category.title}</h1>
            <p className="text-gray-500">{category.subtitle}</p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
