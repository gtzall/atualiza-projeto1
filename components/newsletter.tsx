"use client"

import type React from "react"

import { useState } from "react"

export function Newsletter() {
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", email)
    setEmail("")
  }

  return (
    <section className="py-20 bg-[#1a1a1a]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[#d4a84b] text-sm tracking-[0.3em] uppercase mb-3">FIQUE POR DENTRO</p>
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">Novidades em Primeira Mão</h2>
          <p className="text-gray-400 mb-8">
            Cadastre-se e receba ofertas exclusivas, lançamentos e promoções especiais.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="flex-1 px-6 py-4 bg-[#2a2a2a] border border-[#3a3a3a] text-white placeholder-gray-500 focus:outline-none focus:border-[#d4a84b] transition-colors"
              required
            />
            <button
              type="submit"
              className="px-8 py-4 bg-[#d4a84b] text-black font-medium tracking-wider hover:bg-[#c49a40] transition-colors"
            >
              INSCREVER
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
