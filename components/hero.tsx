import Link from "next/link"

function ArrowRightIcon({ className }: { className?: string }) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/fundo-20site-20gn.png')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-6 pt-24">
        <div className="max-w-2xl">
          <p className="text-[#d4a84b] text-sm tracking-[0.3em] uppercase mb-4">GN FOOTBALL - GUARULHOS SP</p>

          <h1 className="text-white mb-2">
            <span className="block text-5xl md:text-6xl lg:text-7xl font-serif font-light italic">Camisas de Time</span>
            <span className="block text-5xl md:text-6xl lg:text-7xl font-serif font-light italic text-[#d4a84b]">
              Premium
            </span>
          </h1>

          <p className="text-gray-300 text-lg mt-6 mb-10 max-w-md leading-relaxed">
            A maior seleção de camisas dos maiores clubes do mundo. Qualidade incomparável, entrega para todo Brasil.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all"
            >
              VER COLEÇÃO
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              href="/categoria/retro"
              className="inline-flex items-center gap-2 bg-[#2a2a2a] text-white px-8 py-4 text-sm tracking-wider hover:bg-[#3a3a3a] transition-all"
            >
              CAMISAS RETRÔ
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
            <p className="text-gray-400 text-xs tracking-[0.2em] mb-2">SCROLL</p>
            <div className="w-px h-12 bg-gray-400 mx-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
