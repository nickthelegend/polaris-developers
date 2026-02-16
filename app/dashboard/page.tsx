
"use client"

import { useEffect, useState } from "react"
import { usePrivy } from "@privy-io/react-auth"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Plus, Copy, Check, Terminal, ExternalLink, Activity } from "lucide-react"

export default function Dashboard() {
    const { user, authenticated, ready, logout } = usePrivy()
    const router = useRouter()
    const [apps, setApps] = useState<any[]>([])
    const [bills, setBills] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [newAppName, setNewAppName] = useState("")

    useEffect(() => {
        if (ready && !authenticated) {
            router.push("/")
        } else if (user?.wallet?.address) {
            loadData()
        }
    }, [ready, authenticated, user])

    const loadData = async () => {
        if (!user?.wallet?.address) return

        // 1. Get or Create User
        const { data: userData } = await supabase
            .from('merchant_users')
            .select('id')
            .eq('wallet_address', user.wallet.address)
            .single()

        let userId = userData?.id

        if (!userId) {
            const { data: newUser } = await supabase
                .from('merchant_users')
                .insert({ wallet_address: user.wallet.address })
                .select('id')
                .single()
            userId = newUser?.id
        }

        if (!userId) return

        // 2. Load Apps
        const { data: appsData } = await supabase
            .from('merchant_apps')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        setApps(appsData || [])

        // 3. Load Bills for all apps
        if (appsData && appsData.length > 0) {
            const appIds = appsData.map(a => a.id)
            const { data: billsData } = await supabase
                .from('projects_bills')
                .select('*, merchant_apps(name)')
                .in('app_id', appIds)
                .order('created_at', { ascending: false })

            setBills(billsData || [])
        }

        setLoading(false)
    }

    const createApp = async () => {
        if (!newAppName.trim() || !user?.wallet?.address) return
        setCreating(true)

        // Get user id (optimize later)
        const { data: userData } = await supabase
            .from('merchant_users')
            .select('id')
            .eq('wallet_address', user.wallet.address)
            .single()

        if (userData) {
            await supabase.from('merchant_apps').insert({
                user_id: userData.id,
                name: newAppName,
                description: "Generated via Developer Portal",
                category: "General"
            })
            setNewAppName("")
            loadData()
        }
        setCreating(false)
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        alert("Copied to clipboard!")
    }

    if (loading) return <div className="p-8 text-zinc-400">Loading Dashboard...</div>

    return (
        <div className="min-h-screen bg-zinc-950 p-8 flex flex-col gap-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Merchant Dashboard</h1>
                    <p className="text-sm text-zinc-400">Manage your applications and settlements</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-mono bg-zinc-900 border border-zinc-800 px-3 py-1 rounded text-zinc-500">
                        {user?.wallet?.address}
                    </span>
                    <button onClick={logout} className="text-sm text-red-500 hover:text-red-400">Logout</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col gap-2">
                    <span className="text-xs uppercase font-bold text-zinc-500">Total Revenue</span>
                    <span className="text-3xl font-bold text-white">
                        ${bills.filter(b => b.status === 'paid').reduce((acc, b) => acc + Number(b.amount), 0).toFixed(2)}
                    </span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col gap-2">
                    <span className="text-xs uppercase font-bold text-zinc-500">Total Transactions</span>
                    <span className="text-3xl font-bold text-white">{bills.length}</span>
                </div>
                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl flex flex-col gap-2">
                    <span className="text-xs uppercase font-bold text-zinc-500">Active Apps</span>
                    <span className="text-3xl font-bold text-white">{apps.length}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Apps Column */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5" /> Applications
                    </h2>

                    {/* Create App */}
                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-lg flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="New App Name"
                            className="bg-black/20 border border-zinc-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                            value={newAppName}
                            onChange={e => setNewAppName(e.target.value)}
                        />
                        <button
                            onClick={createApp}
                            disabled={creating || !newAppName}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium py-2 rounded transition-colors disabled:opacity-50"
                        >
                            {creating ? "Creating..." : "Create App"}
                        </button>
                    </div>

                    {/* List Apps */}
                    <div className="flex flex-col gap-3">
                        {apps.map(app => (
                            <div key={app.id} className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg flex flex-col gap-3 group hover:border-zinc-700 transition-colors">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-white">{app.name}</h3>
                                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${app.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>{app.status}</span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase text-zinc-500 font-bold">Client ID</span>
                                        <code className="text-xs bg-black/40 p-1.5 rounded text-zinc-300 font-mono break-all flex items-center justify-between">
                                            {app.client_id}
                                            <button onClick={() => copyToClipboard(app.client_id)}><Copy className="w-3 h-3 hover:text-white" /></button>
                                        </code>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase text-zinc-500 font-bold">Client Secret</span>
                                        <code className="text-xs bg-black/40 p-1.5 rounded text-zinc-300 font-mono break-all flex items-center justify-between">
                                            <span className="blur-sm hover:blur-none transition-all duration-300 cursor-pointer">{app.client_secret}</span>
                                            <button onClick={() => copyToClipboard(app.client_secret)}><Copy className="w-3 h-3 hover:text-white" /></button>
                                        </code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bills Column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5" /> Recent Transactions
                    </h2>

                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zinc-400">
                                <thead className="bg-zinc-900 text-xs uppercase font-bold text-zinc-500">
                                    <tr>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">Amount</th>
                                        <th className="p-4">App</th>
                                        <th className="p-4">Description</th>
                                        <th className="p-4">Tx Hash</th>
                                        <th className="p-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {bills.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-zinc-600">No transactions found</td>
                                        </tr>
                                    ) : (
                                        bills.map(bill => (
                                            <tr key={bill.id} className="hover:bg-zinc-900/50 transition-colors">
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${bill.status === 'paid' ? 'bg-green-500/10 text-green-400' :
                                                            bill.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                'bg-zinc-500/10 text-zinc-400'}`}>
                                                        {bill.status === 'paid' && <Check className="w-3 h-3" />}
                                                        {bill.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-mono font-bold text-white">
                                                    ${bill.amount} <span className="text-zinc-500 text-xs ml-1">{bill.asset}</span>
                                                </td>
                                                <td className="p-4 text-white">{bill.merchant_apps?.name}</td>
                                                <td className="p-4 max-w-[200px] truncate" title={bill.description}>{bill.description}</td>
                                                <td className="p-4">
                                                    {bill.tx_hash ? (
                                                        <a href={`https://explorer.usc-testnet2.creditcoin.network/tx/${bill.tx_hash}`} target="_blank" className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                                                            {bill.tx_hash.slice(0, 6)}... <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-zinc-700">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-xs">
                                                    {new Date(bill.created_at).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
