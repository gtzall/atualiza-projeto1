import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get("file") as File | null
    const productId = String(form.get("productId") || "misc")
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !serviceKey) {
      return NextResponse.json({ error: "Storage not configured" }, { status: 501 })
    }

    const supabase = createClient(url, serviceKey)

    const arrayBuffer = await file.arrayBuffer()
    const ext = (file.name.split(".").pop() || "bin").toLowerCase()
    const path = `products/${productId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: upErr } = await supabase.storage
      .from("product-images")
      .upload(path, new Blob([arrayBuffer], { type: file.type || "application/octet-stream" }), {
        upsert: true,
        contentType: file.type || "application/octet-stream",
      })
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 })

    const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path)
    return NextResponse.json({ url: pub?.publicUrl }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Upload failed" }, { status: 500 })
  }
}
