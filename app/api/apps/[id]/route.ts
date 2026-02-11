import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const walletAddress = req.headers.get('x-wallet-address');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    // Verify ownership
    // 1. Get User ID
    const { data: user } = await supabase
        .from('merchant_users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // 2. Get App
    const { data: app, error } = await supabase
        .from('merchant_apps')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error || !app) {
        return NextResponse.json({ error: 'App not found' }, { status: 404 });
    }

    return NextResponse.json({ app });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const walletAddress = req.headers.get('x-wallet-address');
    const body = await req.json();

    // Verify ownership
    const { data: user } = await supabase
        .from('merchant_users')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single();

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Update
    const { data: app, error } = await supabase
        .from('merchant_apps')
        .update(body) // Body can contain name, escrow_contract, etc.
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ app });
}
