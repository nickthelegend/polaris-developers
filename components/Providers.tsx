"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
            config={{
                appearance: {
                    theme: "dark",
                    accentColor: "#14B8A6", // Teal-500
                    logo: "https://polaris-protocol.vercel.app/logo.png", // specific logo for Polaris
                },
                embeddedWallets: {
                    createOnLogin: "users-without-wallets",
                },
                defaultChain: {
                    id: 102036,
                    name: "Creditcoin USC Testnet 2",
                    network: "usc-testnet-2",
                    nativeCurrency: { name: "tCTC", symbol: "tCTC", decimals: 18 },
                    rpcUrls: {
                        default: { http: ["https://rpc.usc-testnet2.creditcoin.network"] },
                        public: { http: ["https://rpc.usc-testnet2.creditcoin.network"] },
                    },
                    blockExplorers: {
                        default: { name: "Explorer", url: "https://explorer.usc-testnet2.creditcoin.network" },
                    },
                },
                supportedChains: [
                    {
                        id: 102036,
                        name: "Creditcoin USC Testnet 2",
                        network: "usc-testnet-2",
                        nativeCurrency: { name: "tCTC", symbol: "tCTC", decimals: 18 },
                        rpcUrls: {
                            default: { http: ["https://rpc.usc-testnet2.creditcoin.network"] },
                            public: { http: ["https://rpc.usc-testnet2.creditcoin.network"] },
                        },
                        blockExplorers: {
                            default: { name: "Explorer", url: "https://explorer.usc-testnet2.creditcoin.network" },
                        },
                    },
                    {
                        id: 11155111,
                        name: "Sepolia",
                        network: "sepolia",
                        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                        rpcUrls: {
                            default: { http: ["https://1rpc.io/sepolia"] }, // Generic RPC fallback
                            public: { http: ["https://1rpc.io/sepolia"] },
                        },
                        blockExplorers: {
                            default: { name: "Etherscan", url: "https://sepolia.etherscan.io" },
                        },
                    },
                ]
            }}
        >
            {children}
        </PrivyProvider>
    )
}
