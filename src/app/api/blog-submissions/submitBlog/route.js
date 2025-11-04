import { NextResponse } from 'next/server';
import verificationStore from '@/lib/verification-store';

export async function POST(req) {
    try {
        const {
            fullName,
            email,
            mobileNumber,
            title,
            description,
            content,
            mainCategory,
            subcategories,
            categories,
            tags,
            metaTitle,
            metaDescription,
            formName
        } = await req.json();

        // Generate 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Generate submission ID (using timestamp + email hash)
        const submissionId = `${Date.now()}-${email.split('@')[0]}`;

        // Store submission data with OTP in verification store
        verificationStore.set(email, {
            code: otpCode,
            timestamp: Date.now(),
            verified: false,
            submissionId: submissionId,
            submissionData: {
                fullName,
                email,
                mobileNumber,
                title,
                description,
                content,
                categories,
                tags,
                metaTitle,
                metaDescription,
                formName
            }
        });

        console.log(`📧 Generated OTP ${otpCode} for ${email}, Submission ID: ${submissionId}`);

        // Send OTP email to user
        const brevoAPI = 'https://api.brevo.com/v3/smtp/email';
        const API_KEY = process.env.BREVO_API_KEY;

        if (!API_KEY) {
            console.error('BREVO_API_KEY not configured');
            return NextResponse.json({
                success: false,
                message: 'Email service not configured'
            }, { status: 500 });
        }

        const headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': API_KEY,
        };

        const sender = { name: 'Techy Blog', email: 'noreply@yourdomain.com' };

        // OTP Email to user
        const otpEmail = {
            sender,
            to: [{ email }],
            subject: 'Verify Your Email - Techy Blog Submission',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Email Verification Required</h2>
                    <p>Hi ${fullName},</p>
                    <p>Thank you for submitting your blog to Techy Blog! Please verify your email address by entering the verification code below:</p>
                    
                    <div style="background-color: #f5f5f5; border: 2px dashed #333; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #6366f1; font-size: 36px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't submit a blog, please ignore this email.</p>
                    
                    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">— Team Techy Blog</p>
                </div>
            `,
        };

        try {
            const otpResponse = await fetch(brevoAPI, {
                method: 'POST',
                headers,
                body: JSON.stringify(otpEmail),
            });

            const otpResult = await otpResponse.json();
            console.log('📧 OTP email sent:', otpResponse.ok ? 'Success' : 'Failed', otpResult);

            if (!otpResponse.ok) {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to send verification email',
                    error: otpResult
                }, { status: 500 });
            }
        } catch (emailError) {
            console.error('Error sending OTP email:', emailError);
            return NextResponse.json({
                success: false,
                message: 'Error sending verification email',
                error: emailError.message
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email',
            data: {
                submissionId: submissionId,
                email: email
            }
        });

    } catch (error) {
        console.error('Blog submission API error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Internal server error'
        }, { status: 500 });
    }
} 