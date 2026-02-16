import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const { amount, description } = await req.json();
        const clientId = req.headers.get('x-client-id');
        const clientSecret = req.headers.get('x-client-secret');

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'Missing API credentials' }, { status: 401 });
        }

        // 1. Verify App Credentials
        let app;
        let dbError;

        if (clientId === 'DEMO_KEY') {
            const { data: apps, error } = await supabase
                .from('merchant_apps')
                .select('escrow_contract, name')
                .neq('escrow_contract', null) // Prefer one with contract deployed
                .limit(1);
            app = apps?.[0];
            dbError = error;
        } else {
            const { data: dbApp, error } = await supabase
                .from('merchant_apps')
                .select('escrow_contract, name')
                .eq('client_id', clientId)
                .eq('client_secret', clientSecret)
                .single();
            app = dbApp;
            dbError = error;
        }

        if (dbError || !app) {
            return NextResponse.json({ error: 'Invalid credentials or app not found' }, { status: 401 });
        }

        if (!app.escrow_contract) {
            return NextResponse.json({ error: 'Merchant escrow not deployed' }, { status: 400 });
        }

        // 2. Generate Order ID (In a real app, save to DB here)
        const orderId = `ord_${crypto.randomUUID().replace(/-/g, '').substring(0, 12)}`;

        // 3. Construct Checkout Config
        // Return config for SDK with CORS headers
        return new NextResponse(JSON.stringify({
            orderId,
            escrowAddress: app.escrow_contract,
            merchantName: app.name,
            amount,
            currency: 'USDC',
            chainId: 102036, // Creditcoin Testnet
            instructions: 'Call settlePayment() on the escrow contract'
        }), {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-client-id, x-client-secret, x-wallet-address',
            }
        });

    } catch (error: any) {
        console.error('Create Bill Error:', error);
        return NextResponse.json({ error: error.message }, {
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}

export async function OPTIONS() {
    return new NextResponse(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-client-id, x-client-secret, x-wallet-address',
        },
    });
}
