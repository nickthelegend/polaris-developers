
"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LayoutDashboard, LogIn } from "lucide-react"

export default function Home() {
  const { login, authenticated, ready } = usePrivy()
  const router = useRouter()

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard")
    }
  }, [ready, authenticated, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <header className="flex flex-col items-center gap-4 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
          <LayoutDashboard className="w-8 h-8 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Polaris Developer Portal</h1>
        <p className="text-zinc-400 max-w-md">
          Manage your payment gateway integrations, generate API keys, and track bills.
        </p>
      </header>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={login}
          disabled={!ready || authenticated}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-6 rounded-lg transition-all"
        >
          <LogIn className="w-5 h-5" />
          {authenticated ? "Entering Portal..." : "Connect Wallet"}
        </button>
      </div>

      <footer className="absolute bottom-8 text-xs text-zinc-600">
        Powered by Polaris Protocol
      </footer>
    </div>
  )
}
