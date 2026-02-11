'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Plus, Copy, Terminal, Box, ShieldCheck, Zap } from 'lucide-react';
import { useUserSync } from '@/hooks/useUserSync';
import CreateAppModal from './components/CreateAppModal';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Dashboard() {
    const { user, authenticated, login } = usePrivy();
    useUserSync(); // Sync user on load

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch apps
    const { data, error, mutate } = useSWR(
        authenticated && user?.wallet?.address ? `/api/apps?wallet=${user.wallet.address}` : null,
        async (url) => {
            const res = await fetch(url.split('?')[0], {
                headers: { 'x-wallet-address': user?.wallet?.address || '' }
            });
            return res.json();
        }
    );

    const apps = data?.apps || [];



    if (!authenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <button onClick={login} className="bg-teal-500 hover:bg-teal-400 text-black px-8 py-3 rounded font-bold">
                    Connect Wallet to Access Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono p-8 selection:bg-teal-900 selection:text-white">
            <header className="max-w-6xl mx-auto flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-500/10 border border-teal-500/20 rounded-lg flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Polaris_Console</h1>
                        <p className="text-xs text-white/40 uppercase tracking-widest">Developer Dashboard</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-xs text-white/40 font-mono">
                        {user?.wallet?.address.slice(0, 6)}...{user?.wallet?.address.slice(-4)}
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New App
                    </button>
                </div>
            </header>

            <main className="max-w-6xl mx-auto">
                <h2 className="text-sm font-bold uppercase tracking-widest text-white/50 mb-6">My Applications</h2>

                {apps.length === 0 ? (
                    <div className="border border-dashed border-white/10 rounded-xl p-12 text-center text-white/30">
                        <Box className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No applications found.</p>
                        <button onClick={() => setIsModalOpen(true)} className="text-teal-400 mt-2 hover:underline">Create your first app</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apps.map((app: any) => (
                            <Link key={app.id} href={`/dashboard/${app.id}`} className="block group relative bg-white/[0.02] border border-white/10 hover:border-teal-500/30 rounded-xl p-6 transition-all hover:bg-white/[0.04]">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                                        <Zap className="w-5 h-5 text-teal-500" />
                                    </div>
                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${app.escrow_contract ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10'}`}>
                                        {app.escrow_contract ? 'Live' : 'Pending Setup'}
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold mb-1">{app.name}</h3>
                                <p className="text-xs text-white/40 mb-6 font-mono truncate">{app.id}</p>

                                <div className="space-y-3 bg-black/40 rounded p-3 text-xs font-mono">
                                    <div>
                                        <span className="text-white/30 block mb-1">Client ID</span>
                                        <div className="flex justify-between items-center text-white/70">
                                            <span className="truncate w-full">{app.client_id}</span>
                                            <Copy className="w-3 h-3 hover:text-white cursor-pointer ml-2 flex-shrink-0" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button className="text-xs font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors flex items-center gap-1">
                                        Manage <Terminal className="w-3 h-3" />
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && user?.wallet?.address && (
                <CreateAppModal
                    walletAddress={user.wallet.address}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
