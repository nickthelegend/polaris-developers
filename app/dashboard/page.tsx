'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import { Plus, Loader2, LayoutGrid, ArrowRight, Zap, Code2 } from 'lucide-react';

export default function Dashboard() {
    const { user, authenticated, login, ready } = usePrivy();
    const router = useRouter();
    const [isCreating, setIsCreating] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppCategory, setNewAppCategory] = useState('');

    // 1. Sync User on Auth
    useEffect(() => {
        if (authenticated && user?.wallet?.address) {
            fetch('/api/auth/sync', {
                method: 'POST',
                body: JSON.stringify({
                    wallet_address: user.wallet.address,
                    email: user.email?.address
                })
            }).catch(console.error);
        }
    }, [authenticated, user]);

    // 2. Fetch Apps
    const { data: appsData, error, isLoading } = useSWR(
        authenticated && user?.wallet?.address ? '/api/apps' : null,
        async (url) => {
            const res = await fetch(url, {
                headers: { 'x-wallet-address': user?.wallet?.address || '' }
            });
            return res.json();
        }
    );

    const handleCreateApp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAppName) return;
        setIsCreating(true);

        try {
            const res = await fetch('/api/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet_address: user?.wallet?.address,
                    name: newAppName,
                    category: newAppCategory || 'General'
                })
            });

            if (!res.ok) throw new Error('Failed to create app');

            mutate('/api/apps'); // Refresh list
            setNewAppName('');
            setNewAppCategory('');
            // Close modal if we had one, for now just inline form reset
        } catch (err) {
            console.error(err);
            alert('Failed to create application');
        } finally {
            setIsCreating(false);
        }
    };

    if (!ready) return null;

    if (!authenticated) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Zap className="w-8 h-8 text-teal-400" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Developer Dashboard</h1>
                    <p className="text-white/60 mb-10 leading-relaxed">
                        Sign in to manage your applications, view transaction streams, and configure your payment settings.
                    </p>
                    <button
                        onClick={login}
                        className="w-full bg-white text-black px-8 py-4 rounded-xl font-bold uppercase text-sm tracking-widest hover:bg-teal-400 transition-all flex items-center justify-center gap-3"
                    >
                        Connect Wallet <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-mono p-8 selection:bg-teal-900 selection:text-white">
            <header className="max-w-6xl mx-auto mb-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-900/20">
                        <Code2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Polaris Console</h1>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">
                            {user?.wallet?.address.slice(0, 6)}...{user?.wallet?.address.slice(-4)}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="text-xs text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                    Back to Home
                </button>
            </header>

            <main className="max-w-6xl mx-auto">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Your Applications</h2>
                        <p className="text-sm text-white/40">Manage integration keys and view analytics.</p>
                    </div>

                    {/* Simple Create Form */}
                    <form onSubmit={handleCreateApp} className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New App Name"
                            value={newAppName}
                            onChange={(e) => setNewAppName(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:border-teal-500 focus:outline-none transition-colors w-48"
                        />
                        <button
                            type="submit"
                            disabled={isCreating || !newAppName}
                            className="bg-teal-500 text-black px-4 py-2 rounded-lg font-bold text-sm hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                            Create
                        </button>
                    </form>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : appsData?.apps?.length === 0 ? (
                    <div className="text-center py-24 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <LayoutGrid className="w-6 h-6 text-white/20" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">No Applications Yet</h3>
                        <p className="text-white/40 text-sm max-w-sm mx-auto mb-8">
                            Create your first application to get your API keys and start accepting crypto payments.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {appsData?.apps?.map((app: any) => (
                            <div
                                key={app.id}
                                onClick={() => router.push(`/dashboard/${app.id}`)}
                                className="group bg-white/[0.03] border border-white/10 hover:border-teal-500/50 hover:bg-white/[0.06] rounded-2xl p-6 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight className="w-5 h-5 -rotate-45 text-white/40 group-hover:text-teal-400 transition-colors" />
                                </div>

                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-6 flex items-center justify-center text-xl font-bold">
                                    {app.name.charAt(0)}
                                </div>

                                <h3 className="text-lg font-bold mb-1 group-hover:text-teal-400 transition-colors">{app.name}</h3>
                                <p className="text-xs text-white/40 uppercase tracking-widest mb-6">{app.category || 'General'}</p>

                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${app.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                    <span className="text-[10px] text-white/60 font-mono uppercase">
                                        {app.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
