'use client';

import { usePrivy } from '@privy-io/react-auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wallet, LogOut, LayoutDashboard, LayoutGrid, Zap } from 'lucide-react';

export default function Header() {
    const { login, logout, authenticated, user } = usePrivy();
    const pathname = usePathname();

    if (pathname === '/shop') return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(166,242,74,0.4)]">
                            <Zap className="w-7 h-7 text-black fill-current" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-black tracking-tighter uppercase italic neon-text leading-none">
                                POLARIS
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.45em] text-white/40 uppercase pl-1 leading-none mt-1">
                                PROTOCOL
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
                        <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Console
                        </Link>
                        <Link href="/shop" className="hover:text-primary transition-colors flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            Live Demo
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {authenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden lg:flex flex-col items-end">
                                <span className="text-[10px] text-white/30 font-mono uppercase tracking-widest">
                                    {user?.wallet?.address?.slice(0, 6)}...{user?.wallet?.address?.slice(-4)}
                                </span>
                            </div>
                            <button
                                onClick={() => logout()}
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-400 transition-all group"
                                title="Disconnect"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => login()}
                            className="flex items-center gap-2 bg-primary text-black font-bold px-6 py-2.5 rounded-xl hover:scale-105 transition-all active:scale-95 shadow-[0_4px_20px_rgba(166,242,74,0.2)]"
                        >
                            <Wallet className="w-4 h-4" />
                            Connect
                        </button>
                    )
                    }
                </div>
            </div>
        </header>
    );
}
