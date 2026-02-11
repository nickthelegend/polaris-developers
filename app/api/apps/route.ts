import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
    const walletAddress = req.headers.get('x-wallet-address');

    if (!walletAddress) {
        return NextResponse.json({ error: 'Missing wallet address header' }, { status: 400 });
    }

    // 1. Get User ID
    const { data: user } = await (supabase
        .from('merchant_users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single() as any);

    if (!user) {
        return NextResponse.json({ apps: [] }); // User not found, so no apps
    }

    // 2. Get Apps
    const { data: apps, error } = await supabase
        .from('merchant_apps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ apps });
}

export async function POST(req: NextRequest) {
    try {
        const { wallet_address, name, category } = await req.json();

        if (!wallet_address || !name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get User ID (or fail)
        const { data: user } = await (supabase
            .from('merchant_users')
            .select('id')
            .eq('wallet_address', wallet_address)
            .single() as any);

        if (!user) {
            return NextResponse.json({ error: 'User not registered. Please refresh.' }, { status: 404 });
        }

        // 2. Create App with explicitly generated credentials
        const client_id = `prod_${crypto.randomBytes(12).toString('hex')}`;
        const client_secret = `sk_${crypto.randomBytes(24).toString('hex')}`;

        const { data: app, error } = await (supabase
            .from('merchant_apps')
            .insert({
                user_id: user.id,
                name,
                category,
                client_id,
                client_secret,
                network: 'creditcoin_testnet',
                status: 'pending'
            } as any)
            .select()
            .single() as any);

        if (error) throw error;

        return NextResponse.json({ app });
    } catch (error: any) {
        console.error('Create App Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
