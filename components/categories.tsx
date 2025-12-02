import Link from "next/link"

const categories = [
  {
    title: "Times Brasileiros",
    subtitle: "Flamengo, Corinthians, Palmeiras...",
    image: "/red-and-black-flamengo-soccer-jersey-on-hanger.jpg",
    href: "/categoria/brasileiros",
  },
  {
    title: "Times Europeus",
    subtitle: "Real Madrid, Barcelona, Liverpool...",
    image: "/white-real-madrid-soccer-jersey-with-black-stripes.jpg",
    href: "/categoria/europeus",
  },
  {
    title: "Seleções",
    subtitle: "Brasil, Argentina, Portugal...",
    image: "/argentina-national-team-blue-and-white-striped-soc.jpg",
    href: "/categoria/selecoes",
  },
  {
    title: "Retrôs",
    subtitle: "Camisas clássicas históricas",
    image: "/yellow-brazil-national-team-retro-soccer-jersey-wi.jpg",
    href: "/categoria/retro",
  },
]

export function Categories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-[#d4a84b] text-sm tracking-[0.3em] uppercase mb-3">EXPLORE</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Categorias</h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="group relative aspect-[4/5] overflow-hidden rounded-lg">
              <img
                src={category.image || "/placeholder.svg"}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white text-xl font-semibold mb-1">{category.title}</h3>
                <p className="text-gray-300 text-sm">{category.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
