
"use client"

import type React from "react"
import { PrivyProvider } from "@privy-io/react-auth"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || "cmkr3rc4i00iujs0cgnug0qzj"}
            config={{
                appearance: {
                    theme: "dark",
                    accentColor: "#676FFF",
                },
                embeddedWallets: {
                    createOnLogin: "users-without-wallets",
                },
                defaultChain: {
                    id: 102036,
                    name: "Creditcoin USC Testnet 2",
                    network: "usc-testnet-2",
                    nativeCurrency: {
                        name: "tCTC",
                        symbol: "tCTC",
                        decimals: 18,
                    },
                    rpcUrls: {
                        default: {
                            http: ["https://rpc.usc-testnet2.creditcoin.network"],
                        },
                        public: {
                            http: ["https://rpc.usc-testnet2.creditcoin.network"],
                        },
                    },
                }
            }}
        >
            {children}
        </PrivyProvider>
    )
}
