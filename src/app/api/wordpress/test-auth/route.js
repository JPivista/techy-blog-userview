import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const WORDPRESS_URL = 'https://docs.techy-blog.com';
        const WORDPRESS_USERNAME = (process.env.WORDPRESS_USERNAME || '').trim();
        let WORDPRESS_PASSWORD = (process.env.WORDPRESS_APPLICATION_PASSWORD || '').trim();

        if (!WORDPRESS_USERNAME || !WORDPRESS_PASSWORD) {
            return NextResponse.json({
                success: false,
                message: 'Credentials not found in environment variables',
                hasUsername: !!WORDPRESS_USERNAME,
                hasPassword: !!WORDPRESS_PASSWORD,
            }, { status: 500 });
        }

        // Remove spaces from password
        WORDPRESS_PASSWORD = WORDPRESS_PASSWORD.replace(/\s+/g, '');

        const authHeader = 'Basic ' + Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');

        // Test 1: Try to get current user
        console.log('Testing authentication...');
        const testResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/users/me`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader,
                'Accept': 'application/json',
            },
        });

        const responseText = await testResponse.text();
        let responseData = {};

        try {
            responseData = JSON.parse(responseText);
        } catch (e) {
            responseData = { raw: responseText };
        }

        return NextResponse.json({
            success: testResponse.ok,
            status: testResponse.status,
            statusText: testResponse.statusText,
            username: WORDPRESS_USERNAME,
            passwordLength: WORDPRESS_PASSWORD.length,
            response: responseData,
            headers: Object.fromEntries(testResponse.headers.entries()),
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error.message,
            stack: error.stack,
        }, { status: 500 });
    }
}

