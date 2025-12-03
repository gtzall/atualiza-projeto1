"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import AdminEditor from "@/components/admin-editor"
import {
  AUTH_KEY,
  deleteProduct,
  deleteProductAsync,
  getCounts,
  loadProducts,
  loadProductsAsync,
  saveProducts,
  type ExtendedProduct,
  upsertProduct,
  upsertProductAsync,
} from "@/lib/admin-store"

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-700">{children}</span>
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={
        "relative h-6 w-11 rounded-full transition-colors " + (checked ? "bg-[#d4a84b]" : "bg-gray-300")
      }
    >
      <span
        className={
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform " +
          (checked ? "translate-x-5" : "")
        }
      />
    </button>
  )
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [items, setItems] = useState<ExtendedProduct[]>([])
  const [editorOpen, setEditorOpen] = useState(false)
  const [current, setCurrent] = useState<ExtendedProduct | null>(null)

  useEffect(() => {
    const authed = localStorage.getItem(AUTH_KEY)
    if (!authed) {
      router.replace("/admin")
      return
    }
    // First paint from local (seed/localStorage), then hydrate from Supabase if configurado
    setItems(loadProducts())
    ;(async () => {
      try {
        const remote = await loadProductsAsync()
        if (remote && remote.length) setItems(remote)
      } catch (e) {
        console.warn("Falha ao carregar do banco, usando localStorage.")
      }
    })()
  }, [router])

  const counts = useMemo(() => getCounts(items), [items])

  function openNew() {
    const p: ExtendedProduct = {
      id: Date.now().toString(),
      name: "",
      category: "TIMES EUROPEUS",
      subcategory: "",
      image: "/placeholder.svg",
      images: [],
      price: 0,
      originalPrice: undefined,
      discount: undefined,
      isFeatured: false,
      sizes: ["P", "M", "G", "GG"],
      available: true,
      isPreSale: false,
      description: "",
      pixKey: "",
      pixKeyType: "Chave Aleatória",
      whatsapp: "",
      linkMercadoPago: "",
      linkPayPal: "",
      linkPicPay: "",
    }
    setCurrent(p)
    setEditorOpen(true)
  }

  function openEdit(p: ExtendedProduct) {
    setCurrent(p)
    setEditorOpen(true)
  }

  async function onSave(p: ExtendedProduct) {
    try {
      const next = await upsertProductAsync(items, p)
      setItems(next)
    } finally {
      setEditorOpen(false)
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Excluir este produto?")) return
    const next = await deleteProductAsync(items, id)
    setItems(next)
  }

  async function toggleFeatured(p: ExtendedProduct) {
    const updated = { ...p, isFeatured: !p.isFeatured }
    const next = await upsertProductAsync(items, updated)
    setItems(next)
  }

  async function toggleAvailable(p: ExtendedProduct) {
    const updated = { ...p, available: !(p.available !== false) }
    const next = await upsertProductAsync(items, updated)
    setItems(next)
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a1a]">
        <Header />
      </div>

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-500">Gerencie seus produtos e anúncios</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={openNew}
                className="inline-flex items-center gap-2 bg-[#d4a84b] hover:bg-[#c49743] text-white font-medium px-4 py-2 rounded-lg"
              >
                <span>＋</span>
                <span>Novo Produto</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem(AUTH_KEY)
                  router.replace("/admin")
                }}
                className="inline-flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total de produtos</p>
              <p className="text-2xl font-semibold">{counts.total}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Disponíveis</p>
              <p className="text-2xl font-semibold">{counts.available}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Em destaque</p>
              <p className="text-2xl font-semibold">{counts.featured}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Ocultos</p>
              <p className="text-2xl font-semibold">{counts.hidden}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b text-sm text-gray-500">
              <div className="col-span-5">Produto</div>
              <div className="col-span-2">Categoria</div>
              <div className="col-span-2">Preço</div>
              <div className="col-span-1">Destaque</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1 text-right">Ações</div>
            </div>
            <ul className="divide-y">
              {items.map((p) => (
                <li key={p.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center px-4 py-3">
                  <div className="md:col-span-5 flex items-center gap-3">
                    <img src={(p.images && p.images[0]) || p.image || "/placeholder.svg"} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name || "(Sem nome)"}</p>
                      <p className="text-xs text-gray-500">{p.subcategory}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2"><Badge>{p.category}</Badge></div>
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-2">
                      {p.originalPrice ? (
                        <span className="text-gray-400 line-through text-sm">R$ {p.originalPrice.toFixed(2).replace(".", ",")}</span>
                      ) : null}
                      <span className="font-semibold">R$ {Number(p.price || 0).toFixed(2).replace(".", ",")}</span>
                    </div>
                  </div>
                  <div className="md:col-span-1"><Switch checked={!!p.isFeatured} onChange={() => toggleFeatured(p)} /></div>
                  <div className="md:col-span-1"><Switch checked={p.available !== false} onChange={() => toggleAvailable(p)} /></div>
                  <div className="md:col-span-1 flex md:justify-end gap-3">
                    <button onClick={() => openEdit(p)} className="text-gray-700 hover:text-black" title="Editar">✏️</button>
                    <button onClick={() => onDelete(p.id)} className="text-red-600 hover:text-red-700" title="Excluir">🗑️</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Footer />

      <AdminEditor open={editorOpen} product={current} onClose={() => setEditorOpen(false)} onSave={onSave} />
    </main>
  )
}
