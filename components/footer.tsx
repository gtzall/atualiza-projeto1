import Link from "next/link"
import Image from "next/image"

function InstagramIcon({ className }: { className?: string }) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function MessageCircleIcon({ className }: { className?: string }) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}

function MapPinIcon({ className }: { className?: string }) {
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
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function CameraIcon({ className }: { className?: string }) {
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
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] border-t border-[#2a2a2a]">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo and description */}
          <div>
            <div className="mb-4">
              <Image
                src="/images/59c603f7-dba6-4c37-9362-839b01de4091-removebg-preview.png"
                alt="GN Football"
                width={70}
                height={80}
                className="w-auto h-16"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              Camisas de time premium em Guarulhos-SP. Qualidade incomparável, entrega para todo Brasil.
            </p>
            <div className="flex gap-3">
              <Link
                href="https://instagram.com/gn.football"
                target="_blank"
                className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors"
              >
                <InstagramIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://wa.me/5511960385479"
                target="_blank"
                className="w-10 h-10 rounded-lg bg-[#2a2a2a] flex items-center justify-center text-white hover:bg-[#3a3a3a] transition-colors"
              >
                <MessageCircleIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider">CATEGORIAS</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/categoria/brasileiros" className="text-gray-400 hover:text-white transition-colors">
                  Brasileiros
                </Link>
              </li>
              <li>
                <Link href="/categoria/europeus" className="text-gray-400 hover:text-white transition-colors">
                  Europeus
                </Link>
              </li>
              <li>
                <Link href="/categoria/selecoes" className="text-gray-400 hover:text-white transition-colors">
                  Seleções
                </Link>
              </li>
              <li>
                <Link href="/categoria/retro" className="text-gray-400 hover:text-white transition-colors">
                  Retrô
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wider">CONTATO</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <MapPinIcon className="w-4 h-4 text-[#d4a84b]" />
                <span className="text-gray-400">Guarulhos-SP</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-[#d4a84b]" />
                <span className="text-gray-400">+55 (11) 96038-5479</span>
              </li>
              <li className="flex items-center gap-3">
                <CameraIcon className="w-4 h-4 text-[#d4a84b]" />
                <span className="text-gray-400">@Gn.football</span>
              </li>
            </ul>
            <Link
              href="https://wa.me/5511960385479"
              target="_blank"
              className="inline-block mt-6 text-[#d4a84b] hover:text-[#c49a40] transition-colors"
            >
              Fale pelo WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
