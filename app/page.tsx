'use client';

import Link from 'next/link';
import { ArrowRight, Code2, ShieldCheck, Zap, ShoppingBag } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-teal-500 selection:text-white font-sans overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative pt-32 pb-40 px-6">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Zap className="w-3 h-3" />
                        Polaris Protocol v1.0
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Accept Crypto <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-300">
                            In One Line of Code
                        </span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        The complete payment stack for web3 developers. Integrate decentralized payments,
                        generate bills, and settle on-chain instantly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                        <Link
                            href="/dashboard"
                            className="bg-teal-500 text-black font-bold px-8 py-4 rounded-xl hover:bg-teal-400 transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            Developer Portal <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/shop"
                            className="bg-white/5 border border-white/10 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2 w-full sm:w-auto justify-center"
                        >
                            <ShoppingBag className="w-4 h-4" /> Live Store Demo
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="border-t border-white/5 py-24 bg-white/[0.02]">
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Code2 className="w-6 h-6 text-teal-400" />}
                        title="Developer First SDK"
                        description="Drop-in React components. Type-safe APIs. Built for the modern stack."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="w-6 h-6 text-teal-400" />}
                        title="Non-Custodial Escrow"
                        description="Funds settle directly to your smart contract. You own the private keys."
                    />
                    <FeatureCard
                        icon={<Zap className="w-6 h-6 text-teal-400" />}
                        title="Instant Settlement"
                        description="Powered by Creditcoin's high-performance network for sub-second finality."
                    />
                </div>
            </section>

            {/* Code Snippet */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Integration is Simple</h2>
                        <p className="text-gray-400">Just import the component and pass your API credentials.</p>
                    </div>

                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 px-4 py-2 bg-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-bold rounded-bl-xl border-b border-l border-white/5">
                            React / Next.js
                        </div>
                        <pre className="font-mono text-sm md:text-base text-gray-300 overflow-x-auto">
                            <code>
                                {`import { PayWithPolaris } from '@polaris/sdk';

export function Checkout() {
  return (
    <PayWithPolaris
      apiKey="pk_live_..."
      amount={49.99}
      details="Subscription"
    />
  );
}`}
                            </code>
                        </pre>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/5 py-12 text-center text-gray-500 text-sm">
                <p>&copy; 2026 Polaris Protocol. Built on Creditcoin.</p>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-teal-500/30 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
