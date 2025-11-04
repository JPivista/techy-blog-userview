import { NextResponse } from 'next/server';
import verificationStore from '@/lib/verification-store';

export async function POST(req) {
    try {
        const { submissionId } = await req.json();

        if (!submissionId) {
            return NextResponse.json({
                success: false,
                message: 'Submission ID is required'
            }, { status: 400 });
        }

        // Search for the submission in the store
        let foundEmail = null;
        let foundData = null;

        for (const [email, data] of verificationStore.entries()) {
            if (data.submissionId === submissionId) {
                foundEmail = email;
                foundData = data;
                break;
            }
        }

        if (!foundData) {
            return NextResponse.json({
                success: false,
                message: 'Invalid submission ID'
            }, { status: 400 });
        }

        // Generate new 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Update the stored data with new OTP and timestamp
        foundData.code = otpCode;
        foundData.timestamp = Date.now();
        verificationStore.set(foundEmail, foundData);

        console.log(`📧 Resent OTP ${otpCode} for ${foundEmail}, Submission ID: ${submissionId}`);

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
            to: [{ email: foundEmail }],
            subject: 'New Verification Code - Techy Blog Submission',
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Verification Code</h2>
                    <p>Hi ${foundData.submissionData.fullName},</p>
                    <p>You requested a new verification code for your blog submission. Please enter the code below:</p>
                    
                    <div style="background-color: #f5f5f5; border: 2px dashed #333; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #6366f1; font-size: 36px; letter-spacing: 8px; margin: 0;">${otpCode}</h1>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">This code will expire in 15 minutes.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
                    
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
            console.log('📧 Resend OTP email sent:', otpResponse.ok ? 'Success' : 'Failed', otpResult);

            if (!otpResponse.ok) {
                return NextResponse.json({ 
                    success: false, 
                    message: 'Failed to send verification email',
                    error: otpResult
                }, { status: 500 });
            }

            return NextResponse.json({ 
                success: true,
                message: 'New verification code sent to your email',
                data: {
                    submissionId: submissionId,
                    email: foundEmail
                }
            });
        } catch (emailError) {
            console.error('Error sending resend OTP email:', emailError);
            return NextResponse.json({ 
                success: false, 
                message: 'Error sending verification email',
                error: emailError.message
            }, { status: 500 });
        }

    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
