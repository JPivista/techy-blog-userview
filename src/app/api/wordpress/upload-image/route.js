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

        // Validate file size (max 2MB)
        if (imageFile.size > 2 * 1024 * 1024) {
            return NextResponse.json({
                success: false,
                message: 'Image size must be less than 2MB'
            }, { status: 400 });
        }

        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
            return NextResponse.json({
                success: false,
                message: 'File must be an image'
            }, { status: 400 });
        }

        // Convert to buffer
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        const fileName = imageFile.name || `blog-image-${Date.now()}.${imageFile.type.split('/')[1]}`;

        // Create FormData for WordPress
        const mediaFormData = new FormData();
        mediaFormData.append('file', imageBuffer, {
            filename: fileName,
            contentType: imageFile.type,
        });
        mediaFormData.append('title', fileName.replace(/\.[^/.]+$/, ''));

        const uploadResponse = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/media`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                ...mediaFormData.getHeaders(),
            },
            body: mediaFormData,
        });

        if (uploadResponse.ok) {
            const uploadedMedia = await uploadResponse.json();
            return NextResponse.json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    mediaId: uploadedMedia.id,
                    url: uploadedMedia.source_url || uploadedMedia.link,
                }
            });
        } else {
            const errorText = await uploadResponse.text();
            return NextResponse.json({
                success: false,
                message: 'Failed to upload image to WordPress',
                error: errorText.substring(0, 500),
                status: uploadResponse.status
            }, { status: uploadResponse.status });
        }
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to upload image'
        }, { status: 500 });
    }
}

