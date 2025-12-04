"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { ExtendedProduct, PixKeyType } from "@/lib/admin-store"
import { getSupabase, hasSupabase } from "@/lib/supabase-client"

function Input({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a84b] " +
        className
      }
    />
  )
}

function Select({ className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={
        "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#d4a84b] " +
        className
      }
    />
  )
}

function Toggle({ checked, onChange, label }: { checked?: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={
          "w-10 h-6 rounded-full p-0.5 transition-colors " + (checked ? "bg-[#d4a84b]" : "bg-gray-300")
        }
      >
        <div className={"h-5 w-5 bg-white rounded-full transition-transform " + (checked ? "translate-x-4" : "")}></div>
      </div>
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  )
}

export default function AdminEditor({
  open,
  product,
  onClose,
  onSave,
}: {
  open: boolean
  product: ExtendedProduct | null
  onClose: () => void
  onSave: (p: ExtendedProduct) => void
}) {
  const [data, setData] = useState<ExtendedProduct | null>(product)
  const fileRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => setData(product), [product])

  const isNew = !product?.id

  const addImageUrl = (url: string) => {
    if (!url) return
    setData((d) => (d ? { ...d, images: [...(d.images || []), url] } : d))
  }

  const onFile = async (files: FileList | null) => {
    if (!files || !files.length) return
    const arr = Array.from(files)
    await Promise.all(
      arr.map(async (f) => {
        // 1) Secure server upload (service role) se configurado
        try {
          const fd = new FormData()
          fd.append("file", f)
          fd.append("productId", (data?.id || Date.now().toString()))
          const res = await fetch("/api/upload", { method: "POST", body: fd })
          if (res.ok) {
            const json = await res.json()
            if (json?.url) { addImageUrl(json.url); return }
          }
        } catch {}

        // 2) Client upload direto no Storage (requer bucket com escrita pública)
        if (hasSupabase()) {
          try {
            const sb = getSupabase()!
            const folder = `products/${(data?.id || Date.now()).toString()}`
            const path = `${folder}/${Date.now()}-${f.name}`
            const { error } = await sb.storage.from("product-images").upload(path, f, { upsert: true, contentType: f.type })
            if (error) throw error
            const { data: pub } = sb.storage.from("product-images").getPublicUrl(path)
            if (pub?.publicUrl) { addImageUrl(pub.publicUrl); return }
          } catch {}
        }

        // 3) Fallback base64 (local)
        await new Promise<void>((resolve) => {
          const reader = new FileReader()
          reader.onload = () => { addImageUrl(String(reader.result)); resolve() }
          reader.readAsDataURL(f)
        })
      })
    )
  }

  if (!open || !data) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative my-8 w-full max-w-3xl bg-white rounded-xl shadow-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">{isNew ? "Novo Produto" : "Editar Produto"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Nome do Produto *</label>
              <Input
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="Nome"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Time *</label>
              <Input
                value={data.subcategory || ""}
                onChange={(e) => setData({ ...data, subcategory: e.target.value })}
                placeholder="Time"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Descrição</label>
              <textarea
                value={data.description || ""}
                onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Descrição detalhada do produto..."
                className="w-full min-h-24 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#d4a84b]"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Preço (R$) *</label>
              <Input
                type="number"
                step="0.01"
                value={data.price ?? 0}
                onChange={(e) => setData({ ...data, price: Number(e.target.value) })}
                placeholder="199,90"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Preço Original (R$)</label>
              <Input
                type="number"
                step="0.01"
                value={data.originalPrice ?? 0}
                onChange={(e) => setData({ ...data, originalPrice: Number(e.target.value) })}
                placeholder="Para mostrar desconto"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Ano/Temporada</label>
              <Input
                value={data.season || ""}
                onChange={(e) => setData({ ...data, season: e.target.value })}
                placeholder="2024/25"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Categoria *</label>
              <Select
                value={data.category}
                onChange={(e) => setData({ ...data, category: e.target.value })}
              >
                <option value="TIMES EUROPEUS">Europeus</option>
                <option value="TIMES BRASILEIROS">Brasileiros</option>
                <option value="SELEÇÕES">Seleções</option>
                <option value="OUTROS CONTINENTES">Outros Continentes</option>
                <option value="RETRÔS">Retrôs</option>
              </Select>
            </div>
            <div>
              <label className="text-sm text-gray-600">Tipo da Camisa</label>
              <Select value={data.type || ""} onChange={(e) => setData({ ...data, type: e.target.value })}>
                <option value="">Selecione</option>
                <option value="CASA">Casa</option>
                <option value="FORA">Fora</option>
                <option value="TERCEIRA">Terceira</option>
                <option value="ESPECIAL">Especial</option>
                <option value="RETRÔ">Retrô</option>
              </Select>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">Tamanhos Disponíveis</p>
            <div className="flex flex-wrap gap-2">
              {["PP", "P", "M", "G", "GG", "XGG"].map((s) => {
                const active = (data.sizes || []).includes(s)
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setData({
                        ...data,
                        sizes: active ? (data.sizes || []).filter((x) => x !== s) : [...(data.sizes || []), s],
                      })
                    }
                    className={
                      "w-12 h-10 rounded border text-sm " +
                      (active ? "bg-black text-white border-black" : "border-gray-300 text-gray-700")
                    }
                  >
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-600">Imagens</p>
            <div className="flex gap-2">
              <Input placeholder="Cole a URL da imagem" onKeyDown={(e) => {
                const t = e.target as HTMLInputElement
                if (e.key === "Enter") {
                  e.preventDefault()
                  addImageUrl(t.value.trim())
                  t.value = ""
                }
              }} />
              <button
                className="shrink-0 px-3 py-2 rounded-lg bg-gray-800 text-white text-sm"
                onClick={() => fileRef.current?.click()}
              >
                Upload
              </button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFile(e.target.files)} />
            </div>
            {!!(data.images && data.images.length) && (
              <div className="grid grid-cols-5 gap-3">
                {data.images!.map((src, i) => (
                  <div key={i} className="relative">
                    <img src={src} className="w-full h-24 object-cover rounded-lg border" />
                    <button
                      onClick={() => setData({ ...data, images: data.images!.filter((_, idx) => idx !== i) })}
                      className="absolute -top-2 -right-2 bg-white border rounded-full w-6 h-6 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">Links de Pagamento</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Chave PIX</label>
                <Input value={data.pixKey || ""} onChange={(e) => setData({ ...data, pixKey: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tipo da Chave PIX</label>
                <Select
                  value={(data.pixKeyType as PixKeyType) || "Chave Aleatória"}
                  onChange={(e) => setData({ ...data, pixKeyType: e.target.value as PixKeyType })}
                >
                  <option value="Chave Aleatória">Chave Aleatória</option>
                  <option value="Telefone">Telefone</option>
                  <option value="E-mail">E-mail</option>
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-600">WhatsApp</label>
                <Input value={data.whatsapp || ""} onChange={(e) => setData({ ...data, whatsapp: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Link PayPal</label>
                <Input value={data.linkPayPal || ""} onChange={(e) => setData({ ...data, linkPayPal: e.target.value })} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Link Mercado Pago</label>
                <Input
                  value={data.linkMercadoPago || ""}
                  onChange={(e) => setData({ ...data, linkMercadoPago: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Link PicPay</label>
                <Input value={data.linkPicPay || ""} onChange={(e) => setData({ ...data, linkPicPay: e.target.value })} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <Toggle
              checked={!!data.isFeatured}
              onChange={(v) => setData({ ...data, isFeatured: v })}
              label="Produto em destaque"
            />
            <Toggle
              checked={data.available !== false}
              onChange={(v) => setData({ ...data, available: v })}
              label="Disponível para venda"
            />
            <Toggle
              checked={!!data.isPreSale}
              onChange={(v) => setData({ ...data, isPreSale: v })}
              label="Pré-venda"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border">Cancelar</button>
          <button
            onClick={async () => {
              if (!data) return
              let images = data.images || (data.image ? [data.image] : [])
              const persisted: string[] = []
              for (const img of images) {
                if (typeof img === "string" && img.startsWith("data:")) {
                  // Tenta rota server-side segura
                  try {
                    const blob = await (await fetch(img)).blob()
                    const fd = new FormData()
                    fd.append("file", new File([blob], `upload-${Date.now()}.png`, { type: blob.type || "image/png" }))
                    fd.append("productId", (data.id || Date.now().toString()))
                    const res = await fetch("/api/upload", { method: "POST", body: fd })
                    if (res.ok) {
                      const json = await res.json()
                      if (json?.url) { persisted.push(json.url); continue }
                    }
                  } catch {}
                  // Tenta client Storage (requer escrita pública)
                  try {
                    if (hasSupabase()) {
                      const sb = getSupabase()!
                      const blob = await (await fetch(img)).blob()
                      const path = `products/${(data.id || Date.now().toString())}/${Date.now()}-auto.png`
                      const { error } = await sb.storage.from("product-images").upload(path, blob, { upsert: true, contentType: blob.type || "image/png" })
                      if (!error) {
                        const { data: pub } = sb.storage.from("product-images").getPublicUrl(path)
                        if (pub?.publicUrl) { persisted.push(pub.publicUrl); continue }
                      }
                    }
                  } catch {}
                  // Último recurso: mantém base64
                  persisted.push(img)
                } else {
                  persisted.push(img)
                }
              }
              const primary = persisted.length ? persisted[0] : data.image || "/placeholder.svg"
              await onSave({ ...data, images: persisted, image: primary })
            }}
            className="px-4 py-2 rounded-lg bg-[#d4a84b] text-white"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
