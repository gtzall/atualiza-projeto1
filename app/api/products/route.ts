import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: Request) {
  try {
    const { password, product } = await req.json()
    const expected = process.env.ADMIN_PASSWORD || "GN125436"
    if (!password || password !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const sb = getServiceClient()
    if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    if (!product?.id) return NextResponse.json({ error: "Missing product id" }, { status: 400 })

    const { error } = await sb.from("products").upsert({ id: product.id, data: product })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 })
  }
}
