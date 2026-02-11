'use client';

import { useRouter } from 'next/navigation';
import {
  Zap,
  ShieldCheck,
  Terminal,
  ChevronRight,
  Cpu,
  Layers,
  Globe,
  Code2,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden selection:bg-teal-500/30 selection:text-teal-200">
      {/* Ambient Background Elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none opacity-50" />

      {/* Navigation */}
      <nav className="max-w-6xl mx-auto px-8 py-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Terminal className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tighter">Polaris_Protocol</span>
            <div className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Dev_Console_v0.1</div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs uppercase font-bold tracking-widest text-white/50 hover:text-white transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-white text-black px-6 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-teal-400 transition-all hover:scale-105"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 pt-24 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/5 border border-teal-500/20 text-teal-400 text-[10px] font-bold uppercase tracking-widest mb-8"
          >
            <Zap className="w-3 h-3" /> Now Live on Creditcoin Testnet
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8"
          >
            The Cross-Chain<br />
            <span className="text-white/40">BNPL Protocol for</span><br />
            Web3 Merchants.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-white/50 max-w-xl leading-relaxed mb-12"
          >
            Integrate credit-based payments in minutes. Deploy secure settlement escrows,
            manage API keys, and track cross-chain liquidity across the Creditcoin ecosystem.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-teal-500 text-black px-10 py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-teal-400 transition-all flex items-center gap-2 group shadow-[0_0_20px_-5px_rgba(20,184,166,0.5)]"
            >
              Launch Console <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded font-bold text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
              Documentation
            </button>
          </motion.div>
        </div>

        {/* Integration Preview / Code Snippet */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: ShieldCheck, title: "Segregated Escrows", desc: "One contract per merchant app." },
                { icon: Globe, title: "Cross-Chain Sync", desc: "Native Creditcoin V2 Verification." },
                { icon: Lock, title: "API Key Auth", desc: "Secure HMAC-signed requests." },
                { icon: Layers, title: "Sub-second Settlement", desc: "Instant credit to merchant balances." }
              ].map((feat, i) => (
                <div key={i} className="p-4 border border-white/5 bg-white/[0.02] rounded-xl">
                  <feat.icon className="w-5 h-5 text-teal-500 mb-3" />
                  <h3 className="text-xs font-bold mb-1 uppercase tracking-wider">{feat.title}</h3>
                  <p className="text-[10px] text-white/30 leading-normal">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-teal-500/20 blur-[60px] rounded-full group-hover:bg-teal-500/30 transition-all duration-700" />
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-white/5 px-4 py-2 flex items-center justify-between border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                </div>
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest">Polaris_Integration.js</span>
              </div>
              <div className="p-8 font-mono text-xs leading-relaxed overflow-x-auto">
                <span className="text-purple-400">const</span> <span className="text-blue-400">polaris</span> = <span className="text-purple-400">new</span> <span className="text-yellow-400">PolarisProtocol</span>({'{'}
                <br />
                &nbsp;&nbsp;apiKey: <span className="text-green-400">'pk_test_8s2v...'</span>,
                <br />
                &nbsp;&nbsp;appId: <span className="text-green-400">'APP-902-1'</span>
                <br />
                {'}'});
                <br /><br />
                <span className="text-white/40">// Trigger BNPL Payment</span>
                <br />
                <span className="text-purple-400">await</span> <span className="text-blue-400">polaris</span>.<span className="text-blue-300">pay</span>({'{'}
                <br />
                &nbsp;&nbsp;amount: <span className="text-orange-400">1250.00</span>,
                <br />
                &nbsp;&nbsp;currency: <span className="text-green-400">'USDC'</span>,
                <br />
                &nbsp;&nbsp;customer: <span className="text-green-400">'0x7a2...8b1'</span>
                <br />
                {'}'});
              </div>
              <div className="bg-teal-500/5 p-4 border-t border-white/5 text-[10px] text-center text-teal-400 uppercase font-bold tracking-widest">
                SDK Documentation coming soon
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 opacity-30">
        <div className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
          <Cpu className="w-3 h-3" /> Powered by Creditcoin USC
        </div>
        <div className="flex items-center gap-8 text-[10px] uppercase font-bold tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
