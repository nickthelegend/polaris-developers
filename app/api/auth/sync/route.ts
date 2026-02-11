import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
    try {
        const { wallet_address, email } = await req.json();

        if (!wallet_address) {
            return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
        }

        // Upsert user
        const { data, error } = await supabase
            .from('merchant_users')
            .upsert({
                wallet_address,
                email,
                updated_at: new Date().toISOString()
            }, { onConflict: 'wallet_address' })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ user: data });
    } catch (error: any) {
        console.error('Sync Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
