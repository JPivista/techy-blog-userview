import { NextResponse } from 'next/server';
import verificationStore from '../../../lib/verification-store.js';

export async function GET() {
    try {
        const storeSize = verificationStore.size();
        console.log('🧪 Verification store test - size:', storeSize);

        return NextResponse.json({
            success: true,
            message: 'Verification store is working',
            storeSize: storeSize,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('🧪 Verification store test error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const { action, email } = await req.json();

        if (action === 'set') {
            verificationStore.set(email || 'test@example.com', {
                code: '123456',
                timestamp: Date.now(),
                verified: false
            });

            return NextResponse.json({
                success: true,
                message: 'Test code stored',
                storeSize: verificationStore.size()
            });
        } else if (action === 'get') {
            const data = verificationStore.get(email || 'test@example.com');

            return NextResponse.json({
                success: true,
                message: 'Retrieved data',
                data: data,
                storeSize: verificationStore.size()
            });
        } else if (action === 'cleanup') {
            verificationStore.cleanup();

            return NextResponse.json({
                success: true,
                message: 'Store cleaned up',
                storeSize: verificationStore.size()
            });
        }

        return NextResponse.json(
            { success: false, error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('🧪 Verification store POST test error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}