import { supabase } from './supabaseClient';
import crypto from 'crypto';

export async function sendWebhook(webhookId: string, event: string, payload: any) {
    // 1. Get Webhook Details
    const { data: webhook } = await (supabase
        .from('webhooks')
        .select('*')
        .eq('id', webhookId)
        .single() as any);

    if (!webhook || !webhook.is_active) return;

    // 2. Prepare Payload
    const timestamp = Math.floor(Date.now() / 1000);
    const body = JSON.stringify({
        event,
        created_at: timestamp,
        data: payload
    });

    // 3. Sign Payload (HMAC-SHA256)
    const signature = crypto
        .createHmac('sha256', webhook.secret)
        .update(`${timestamp}.${body}`)
        .digest('hex');

    const headers = {
        'Content-Type': 'application/json',
        'X-Polaris-Signature': `t=${timestamp},v1=${signature}`,
        'User-Agent': 'Polaris-Webhook-Service/1.0'
    };

    let responseStatus = 0;
    let responseBody = '';

    try {
        const res = await fetch(webhook.url, {
            method: 'POST',
            headers,
            body
        });
        responseStatus = res.status;
        responseBody = await res.text();
    } catch (e: any) {
        responseStatus = 500;
        responseBody = e.message;
    }

    // 4. Log the result
    await (supabase.from('webhook_logs') as any).insert({
        webhook_id: webhookId,
        event,
        payload: JSON.parse(body),
        response_status: responseStatus,
        response_body: responseBody.substring(0, 1000)
    });

    return { success: responseStatus >= 200 && responseStatus < 300, status: responseStatus };
}
