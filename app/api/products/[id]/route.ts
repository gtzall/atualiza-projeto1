import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await req.json().catch(() => ({}))
    const expected = process.env.ADMIN_PASSWORD || "GN125436"
    if (!body?.password || body.password !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 })
    }

    const sb = getServiceClient()
    if (!sb) return NextResponse.json({ error: "Supabase not configured" }, { status: 500 })

    const { error } = await sb.from("products").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "error" }, { status: 500 })
  }
}
