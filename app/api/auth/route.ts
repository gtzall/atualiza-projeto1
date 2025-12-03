import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { password } = await req.json()
    const expected = process.env.ADMIN_PASSWORD || "GN125436"
    const ok = !!password && password === expected
    return NextResponse.json({ ok })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "error" }, { status: 500 })
  }
}
