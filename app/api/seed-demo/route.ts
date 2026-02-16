import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

export async function GET() {
    try {
        const wallet = "0xDemoMerchant" + crypto.randomBytes(4).toString('hex');

        // 1. Create User
        const { data: user, error: userError } = await (supabase
            .from('merchant_users')
            .insert({ wallet_address: wallet } as any)
            .select()
            .single() as any);

        if (userError) throw userError;

        // 2. Create App
        const client_id = `prod_${crypto.randomBytes(12).toString('hex')}`;
        const client_secret = `sk_${crypto.randomBytes(24).toString('hex')}`;

        const { data: app, error: appError } = await (supabase
            .from('merchant_apps')
            .insert({
                user_id: user.id,
                name: 'Polaris Demo Shop',
                category: 'E-commerce',
                client_id,
                client_secret,
                network: 'creditcoin_testnet',
                status: 'active',
                escrow_contract: '0x0000000000000000000000000000000000000000' // Use fake address so app is created, but payment will revert on-chain if used. But DEMO_KEY logic prefers an app with contract.
            } as any)
            .select()
            .single() as any);

        if (appError) throw appError;

        return NextResponse.json({
            wallet,
            app_id: app.id,
            client_id,
            client_secret
        });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
