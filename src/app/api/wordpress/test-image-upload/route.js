import { NextResponse } from 'next/server';
import FormData from 'form-data';

export async function POST(req) {
    try {
        const WORDPRESS_URL = 'https://docs.techy-blog.com';
        const WORDPRESS_USERNAME = (process.env.WORDPRESS_USERNAME || '').trim();
        let WORDPRESS_PASSWORD = (process.env.WORDPRESS_APPLICATION_PASSWORD || '').trim();

        if (!WORDPRESS_USERNAME || !WORDPRESS_PASSWORD) {
            return NextResponse.json({
                success: false,
                message: 'WordPress credentials not configured'
            }, { status: 500 });
        }

        WORDPRESS_PASSWORD = WORDPRESS_PASSWORD.replace(/\s+/g, '');
        const authHeader = 'Basic ' + Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_PASSWORD}`).toString('base64');

        // Get the file from FormData
        const formData = await req.formData();
        const imageFile = formData.get('image');

        if (!imageFile) {
            return NextResponse.json({
                success: false,
                message: 'No image file received'
            }, { status: 400 });
        }

        console.log('📤 Test image upload - File details:', {
            name: imageFile.name || 'unknown',
            type: imageFile.type || 'unknown',
            size: imageFile.size || 0,
        });

        // Convert to buffer
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = `test-${Date.now()}.webp`;

        // Create FormData for WordPress
        const mediaFormData = new FormData();
        mediaFormData.append('file', imageBuffer, {
            filename: fileName,
            contentType: 'image/webp',
        });
        mediaFormData.append('title', 'Test Banner Upload');

        console.log('📤 Uploading to WordPress media library...');

        const uploadResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                ...mediaFormData.getHeaders(),
            },
            body: mediaFormData,
        });

        const responseText = await uploadResponse.text();
        console.log('Upload response status:', uploadResponse.status);

        if (uploadResponse.ok) {
            const uploadedMedia = JSON.parse(responseText);
            return NextResponse.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    mediaId: uploadedMedia.id,
                    url: uploadedMedia.source_url || uploadedMedia.link,
                }
            });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Failed to upload image',
                error: responseText.substring(0, 500),
                status: uploadResponse.status
            }, { status: uploadResponse.status });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            success: false,
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

