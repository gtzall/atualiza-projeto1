"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import type { Product } from "@/lib/products"
import { getRuntimeProductById, getRuntimeProductByIdAsync } from "@/lib/runtime-products"

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
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
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  )
}

function TruckIcon({ className }: { className?: string }) {
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
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("")
  const [p, setP] = useState<any>(null)
  const searchParams = useSearchParams()
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  useEffect(() => {
    let current: any = null

    // 1) Snapshot do clique (mantém imagens base64)
    try {
      if (typeof window !== "undefined") {
        const raw = sessionStorage.getItem(`gn_product_snapshot_${String(product.id)}`)
        if (raw) {
          const snap = JSON.parse(raw)
          const firstSnapImg = snap?.images?.[0] || snap?.image || product.image
          current = { ...product, ...snap, image: firstSnapImg }
          if (firstSnapImg) setImgSrc(firstSnapImg)
          try { sessionStorage.removeItem(`gn_product_snapshot_${String(product.id)}`) } catch {}
        }
        // Fallback: snapshot também salvo em localStorage para casos de navegação edge
        if (!current) {
          const rawLs = localStorage.getItem(`gn_product_snapshot_${String(product.id)}`)
          if (rawLs) {
            const snap = JSON.parse(rawLs)
            const firstSnapImg = snap?.images?.[0] || snap?.image || product.image
            current = { ...product, ...snap, image: firstSnapImg }
            if (firstSnapImg && !imgSrc) setImgSrc(firstSnapImg)
          }
        }
      }
    } catch {}

    // 2) Snapshot da URL (?s=)
    if (!current) {
      try {
        const s = searchParams?.get("s")
        if (s) {
          let json = ""
          try {
            const b64 = decodeURIComponent(s)
            const bin = atob(b64)
            json = decodeURIComponent(
              Array.prototype
                .map
                .call(bin, (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            )
          } catch {}
          if (json) {
            const snap = JSON.parse(json)
            const firstSnapImg = snap?.images?.[0] || snap?.image || product.image
            current = { ...product, ...snap, image: firstSnapImg }
            if (firstSnapImg && !imgSrc) setImgSrc(firstSnapImg)
          }
        }
      } catch {}
    }

    // 2.5) Forçar leitura de chave primária salva e lista bruta
    try {
      if (typeof window !== "undefined") {
        const prim = localStorage.getItem(`gn_image_primary_${String(product.id)}`)
        if (prim && (!current || !current.image)) {
          current = { ...(current || product), image: prim, images: (current?.images?.length ? current.images : [prim]) }
          if (!imgSrc) setImgSrc(prim)
        }
        if (!current || !current.image || !(current.images && current.images.length)) {
          const rawList = localStorage.getItem('gn_admin_products_v1')
          if (rawList) {
            try {
              const arr = JSON.parse(rawList) as any[]
              const found = arr.find((x) => String(x?.id) === String(product.id))
              const first = found?.images?.[0] || found?.image
              if (first) {
                current = { ...(current || product), ...found, image: first, images: found.images || (first ? [first] : []) }
                if (!imgSrc) setImgSrc(first)
              }
            } catch {}
          }
        }
      }
    } catch {}

    // 3) Local runtime (preenche imagens se ainda faltarem)
    const local = getRuntimeProductById(product.id)
    if (local) {
      const firstLocalImg = (local as any)?.images?.[0] || (local as any)?.image || product.image
      const localMerged = { ...product, ...local, image: firstLocalImg }
      if (!current || !current.image) current = localMerged
      if (firstLocalImg && !imgSrc) setImgSrc(firstLocalImg)
    }

    // Set parcial (snapshot/local) antes do async
    if (current) setP(current)

    // 4) Async (Supabase/local) para garantir dados finais
    ;(async () => {
      const r = await getRuntimeProductByIdAsync(product.id)
      if (r) {
        const firstRemoteImg = (r as any)?.images?.[0] || (r as any)?.image || product.image
        const remoteMerged = { ...product, ...r, image: firstRemoteImg }
        let finalMerged = remoteMerged
        if (current) {
          const currImg = (current as any)?.images?.[0] || (current as any)?.image
          const remImg = (remoteMerged as any)?.images?.[0] || (remoteMerged as any)?.image
          const isRemPlaceholder = !remImg || remImg === "/placeholder.svg"
          if (currImg && isRemPlaceholder) {
            finalMerged = {
              ...remoteMerged,
              image: currImg,
              images: (remoteMerged as any)?.images?.length ? (remoteMerged as any).images : (current as any)?.images,
            }
          }
        }
        setP(finalMerged)
        const finalImg = (finalMerged as any)?.images?.[0] || (finalMerged as any)?.image
        if (finalImg) setImgSrc(finalImg)
      } else if (!current) {
        setP(product)
      }
    })()
  }, [product.id, searchParams])
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [method, setMethod] = useState<"PIX" | "MercadoPago" | "PayPal" | "PicPay" | null>(null)
  const [copied, setCopied] = useState(false)

  if (!p) {
    return (
      <div className="container mx-auto px-6 py-12">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-[4/5] rounded-lg bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 rounded" />
            <div className="h-6 w-1/3 bg-gray-200 rounded" />
            <div className="h-10 w-1/2 bg-gray-200 rounded" />
            <div className="h-14 w-full bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }
  const whatsappNumber = (p.whatsapp || "5511960385479").replace(/\D/g, "")
  const waMsg = encodeURIComponent(
    `Olá! Paguei via PIX.\nProduto: ${p.name}\nTamanho: ${selectedSize || "-"}\nValor: R$ ${Number(p.price || 0)
      .toFixed(2)
      .replace(".", ",")}\nChave PIX usada: ${p.pixKey || "-"}`,
  )
  async function copyPix() {
    if (!p.pixKey) return
    try {
      await navigator.clipboard.writeText(p.pixKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }
  async function copyLink(url?: string) {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative">
          {p.discount ? (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#d4a84b] text-white text-xs font-bold px-3 py-1 rounded">-{p.discount}%</span>
            </div>
          ) : p.isFeatured ? (
            <div className="absolute top-4 left-4 z-10">
              <span className="bg-[#d4a84b] text-white text-xs font-medium px-3 py-1 rounded">Destaque</span>
            </div>
          ) : null}
          <div className="aspect-[4/5] rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imgSrc || (p as any).images?.[0] || p.image || "/placeholder.svg"}
              alt={p.name}
              className="w-full h-full object-cover"
              onError={() => {
                const fallback = (p as any)?.image || "/placeholder.svg"
                if (fallback !== imgSrc) setImgSrc(fallback)
              }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-gray-500">{p.category}</span>
            <span className="text-gray-400">•</span>
            <span className="text-[#d4a84b]">{p.subcategory}</span>
            {p.type && (
              <>
                <span className="text-gray-400">•</span>
                <span className="text-gray-500">{p.type}</span>
              </>
            )}
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-900">{p.name}</h1>
            {p.isPreSale && (
              <span className="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800">Pré-venda</span>
            )}
            {p.available === false && (
              <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">Indisponível</span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-4 h-4 text-[#d4a84b]" />
              ))}
            </div>
            <span className="text-gray-500 text-sm">Qualidade Premium</span>
          </div>

          {/* Price */}
          <div className="mb-8">
            {p.originalPrice && (
              <p className="text-lg text-gray-400 line-through mb-1">
                R$ {p.originalPrice.toFixed(2).replace(".", ",")}
              </p>
            )}
            <p className="text-3xl font-semibold text-[#d4a84b]">R$ {p.price.toFixed(2).replace(".", ",")}</p>
          </div>

          {/* Size Selector */}
          <div className="mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">TAMANHO</p>
            <div className="flex gap-3">
              {(p.sizes || ["P", "M", "G", "GG"]).map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-14 border-2 flex items-center justify-center text-sm font-medium transition-all ${
                    selectedSize === size
                      ? "border-[#d4a84b] bg-[#d4a84b] text-white"
                      : "border-gray-200 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">FORMAS DE PAGAMENTO</p>
            <div className="mb-4">
              <button
                onClick={() => {
                  setCheckoutOpen(true)
                  const defaultMethod = p.pixKey
                    ? "PIX"
                    : p.linkMercadoPago
                    ? "MercadoPago"
                    : p.linkPayPal
                    ? "PayPal"
                    : p.linkPicPay
                    ? "PicPay"
                    : null
                  setMethod(defaultMethod)
                }}
                className="px-4 py-2 rounded-lg bg-[#d4a84b] text-white hover:bg-[#c49743]"
              >
                Comprar agora
              </button>
            </div>

            {checkoutOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/50" onClick={() => setCheckoutOpen(false)} />
                <div className="relative bg-white rounded-xl shadow-lg w-full max-w-lg mx-4">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-lg font-medium">Escolha a forma de pagamento</h3>
                    <button onClick={() => setCheckoutOpen(false)} className="text-gray-500 hover:text-gray-800">✕</button>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {p.pixKey && (
                        <button
                          onClick={() => setMethod("PIX")}
                          className={`px-3 py-2 rounded border ${method === "PIX" ? "bg-black text-white border-black" : "border-gray-300"}`}
                        >PIX</button>
                      )}
                      {p.linkMercadoPago && (
                        <button
                          onClick={() => setMethod("MercadoPago")}
                          className={`px-3 py-2 rounded border ${method === "MercadoPago" ? "bg-black text-white border-black" : "border-gray-300"}`}
                        >Mercado Pago</button>
                      )}
                      {p.linkPayPal && (
                        <button
                          onClick={() => setMethod("PayPal")}
                          className={`px-3 py-2 rounded border ${method === "PayPal" ? "bg-black text-white border-black" : "border-gray-300"}`}
                        >PayPal</button>
                      )}
                      {p.linkPicPay && (
                        <button
                          onClick={() => setMethod("PicPay")}
                          className={`px-3 py-2 rounded border ${method === "PicPay" ? "bg-black text-white border-black" : "border-gray-300"}`}
                        >PicPay</button>
                      )}
                      {!p.pixKey && !p.linkMercadoPago && !p.linkPayPal && !p.linkPicPay && (
                        <span className="text-sm text-gray-600">Nenhum método configurado.</span>
                      )}
                    </div>

                    {method === "PIX" && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-sm text-gray-700">
                            <div className="font-medium">Chave PIX ({p.pixKeyType || "Chave"})</div>
                            <div className="break-all">{p.pixKey}</div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={copyPix} className="px-3 py-2 rounded-lg border">
                              {copied ? "Copiado!" : "Copiar chave"}
                            </button>
                            <Link
                              href={`https://wa.me/${whatsappNumber}?text=${waMsg}`}
                              target="_blank"
                              className="px-3 py-2 rounded-lg bg-[#25D366] text-white"
                            >
                              Enviar comprovante no WhatsApp
                            </Link>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                          Após o pagamento via PIX, envie o comprovante pelo WhatsApp para confirmar o pedido e combinar a entrega.
                        </p>
                      </div>
                    )}

                    {method === "MercadoPago" && (
                      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">Mercado Pago</p>
                          <p className="text-sm text-gray-500">Link de pagamento</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={p.linkMercadoPago!} target="_blank" className="px-3 py-2 rounded-lg border">
                            Abrir pagamento
                          </Link>
                          <button onClick={() => copyLink(p.linkMercadoPago)} className="px-3 py-2 rounded-lg border">Copiar link</button>
                        </div>
                      </div>
                    )}

                    {method === "PayPal" && (
                      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">PayPal</p>
                          <p className="text-sm text-gray-500">Link de pagamento</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={p.linkPayPal!} target="_blank" className="px-3 py-2 rounded-lg border">
                            Abrir pagamento
                          </Link>
                          <button onClick={() => copyLink(p.linkPayPal)} className="px-3 py-2 rounded-lg border">Copiar link</button>
                        </div>
                      </div>
                    )}

                    {method === "PicPay" && (
                      <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-gray-900">PicPay</p>
                          <p className="text-sm text-gray-500">Link de pagamento</p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={p.linkPicPay!} target="_blank" className="px-3 py-2 rounded-lg border">
                            Abrir pagamento
                          </Link>
                          <button onClick={() => copyLink(p.linkPicPay)} className="px-3 py-2 rounded-lg border">Copiar link</button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 border-t flex justify-end">
                    <button onClick={() => setCheckoutOpen(false)} className="px-4 py-2 rounded-lg border">Fechar</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <TruckIcon className="w-5 h-5 text-[#d4a84b]" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Envio Nacional</p>
                <p className="text-xs text-gray-500">Para todo Brasil</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldIcon className="w-5 h-5 text-[#d4a84b]" />
              <div>
                <p className="font-medium text-gray-900 text-sm">Garantia</p>
                <p className="text-xs text-gray-500">30 dias de troca</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
