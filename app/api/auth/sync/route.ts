import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: NextRequest) {
    try {
        const { wallet_address, email } = await req.json();

        if (!wallet_address) {
            return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
        }

        // Upsert user
        const { data, error } = await (supabase
            .from('merchant_users')
            .upsert({
                wallet_address,
                email,
                updated_at: new Date().toISOString()
            } as any, { onConflict: 'wallet_address' })
            .select()
            .single() as any);

        if (error) throw error;

        return NextResponse.json({ user: data });
    } catch (error: any) {
        console.error(' [AUTH_SYNC_FATAL]:', error);
        return NextResponse.json({
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
