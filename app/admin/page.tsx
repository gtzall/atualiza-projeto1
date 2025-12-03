"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AUTH_KEY } from "@/lib/admin-store"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return
    const authed = localStorage.getItem(AUTH_KEY)
    if (authed) router.replace("/admin/dashboard")
  }, [router])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password === "GN125436") {
      localStorage.setItem(AUTH_KEY, "1")
      router.replace("/admin/dashboard")
    } else {
      setError("Senha incorreta.")
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#1a1a1a]">
        <Header />
      </div>
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow p-8">
            <div className="flex flex-col items-center gap-2 mb-6">
              <img src="/images/59c603f7-dba6-4c37-9362-839b01de4091-removebg-preview.png" alt="Logo" className="h-16 w-auto" />
              <h1 className="text-2xl font-semibold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-500">Digite a senha para acessar</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha de acesso"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#d4a84b]"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                className="w-full bg-[#d4a84b] hover:bg-[#c49743] text-white font-medium rounded-lg px-4 py-2 transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
