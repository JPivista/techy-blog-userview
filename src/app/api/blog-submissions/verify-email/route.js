import { NextResponse } from 'next/server';
import verificationStore from '@/lib/verification-store';

export async function POST(req) {
    try {
        const body = await req.json();
        const { submissionId, verificationCode } = body;

        if (!submissionId || !verificationCode) {
            console.error('❌ Missing required fields:', {
                hasSubmissionId: !!submissionId,
                hasVerificationCode: !!verificationCode
            });
            return NextResponse.json({
                success: false,
                message: 'Submission ID and verification code are required'
            }, { status: 400 });
        }

        // Search for the submission in the store
        // Since we store by email but need to find by submissionId, we search through entries
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
            console.error('❌ Submission not found in store:', {
                requestedSubmissionId: submissionId,
                storeEntries: Array.from(verificationStore.entries()).map(([email, data]) => ({
                    email,
                    submissionId: data.submissionId
                }))
            });
            return NextResponse.json({
                success: false,
                message: 'Invalid submission ID or code has expired. The submission may have expired or the server was restarted. Please submit your blog again to get a new verification code.'
            }, { status: 400 });
        }

        // Check if code has expired (15 minutes = 900000 milliseconds)
        const now = Date.now();
        const codeAge = now - foundData.timestamp;
        const EXPIRY_TIME = 15 * 60 * 1000; // 15 minutes

        if (codeAge > EXPIRY_TIME) {
            // Clean up expired code
            verificationStore.delete(foundEmail);
            console.error('❌ Code expired');
            return NextResponse.json({
                success: false,
                message: 'Verification code has expired. Please request a new one.'
            }, { status: 400 });
        }

        // Check if already verified
        if (foundData.verified) {
            console.error('❌ Already verified');
            return NextResponse.json({
                success: false,
                message: 'This submission has already been verified'
            }, { status: 400 });
        }

        // Verify the code
        if (foundData.code !== verificationCode) {
            console.error('❌ Invalid verification code');
            return NextResponse.json({
                success: false,
                message: 'Invalid verification code. Please check and try again.'
            }, { status: 400 });
        }

        // Mark as verified
        foundData.verified = true;
        foundData.verifiedAt = now;
        verificationStore.set(foundEmail, foundData);

        // Send thank you email to user and acknowledgment email to admin
        const brevoAPI = 'https://api.brevo.com/v3/smtp/email';
        const API_KEY = process.env.BREVO_API_KEY;

        if (API_KEY) {
            const headers = {
                accept: 'application/json',
                'content-type': 'application/json',
                'api-key': API_KEY,
            };

            const sender = { name: 'Techy Blog', email: 'noreply@yourdomain.com' };
            const { submissionData } = foundData;

            // Thank you email to user
            const thankYouEmail = {
                sender,
                to: [{ email: foundEmail }],
                subject: 'Thank You for Your Blog Submission - Techy Blog',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Thank You for Your Submission!</h2>
                        <p>Hi ${submissionData.fullName},</p>
                        <p>Your email has been verified successfully! We've received your blog submission and our team will review it shortly.</p>
                        
                        <div style="background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0;">
                            <h3 style="color: #1e40af; margin-top: 0;">Your Blog Details:</h3>
                            <p><strong>Title:</strong> ${submissionData.title}</p>
                            <p><strong>Description:</strong> ${submissionData.description}</p>
                            <p><strong>Categories:</strong> ${Array.isArray(submissionData.categories) ? submissionData.categories.join(', ') : submissionData.categories}</p>
                            <p><strong>Tags:</strong> ${submissionData.tags}</p>
                        </div>
                        
                        <p>We'll notify you once your blog is published. This usually takes 24-48 hours.</p>
                        <p>If you have any questions, feel free to reach out to us.</p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px;">— Team Techy Blog</p>
                    </div>
                `,
            };

            // Acknowledgment email to admin
            const adminEmail = {
                sender,
                to: [
                    { email: 'jp@ivistasolutions.com' },
                    { email: 'mvivekraz@gmail.com' },
                ],
                subject: '✅ New Verified Blog Submission - Techy Blog',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">New Verified Blog Submission</h2>
                        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 10px; margin: 10px 0;">
                            <h4 style="color: #155724; margin: 0;">✅ Email Verified</h4>
                            <p style="color: #155724; margin: 5px 0 0 0; font-size: 14px;">
                                Verified at: ${new Date(now).toLocaleString()}
                            </p>
                        </div>
                        
                        <h3>Personal Information</h3>
                        <p><strong>Full Name:</strong> ${submissionData.fullName}</p>
                        <p><strong>Email:</strong> ${foundEmail}</p>
                        <p><strong>Mobile Number:</strong> ${submissionData.mobileNumber}</p>
                        
                        <h3>Blog Details</h3>
                        <p><strong>Title:</strong> ${submissionData.title}</p>
                        <p><strong>Description:</strong> ${submissionData.description}</p>
                        <p><strong>Categories:</strong> ${Array.isArray(submissionData.categories) ? submissionData.categories.join(', ') : submissionData.categories}</p>
                        <p><strong>Tags:</strong> ${submissionData.tags}</p>
                        
                        <h3>SEO Information</h3>
                        <p><strong>Meta Title:</strong> ${submissionData.metaTitle || 'Not provided'}</p>
                        <p><strong>Meta Description:</strong> ${submissionData.metaDescription || 'Not provided'}</p>
                        
                        <h3>Blog Content</h3>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                            ${(submissionData.content || '').replace(/\n/g, '<br>')}
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        <p style="color: #999; font-size: 12px;">Submission ID: ${submissionId}</p>
                    </div>
                `,
            };

            // Send emails asynchronously (don't wait for response)
            Promise.all([
                fetch(brevoAPI, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(thankYouEmail),
                }).then(res => {
                    return res.json();
                }).catch(err => {
                    console.error('Error sending thank you email:', err);
                }),
                fetch(brevoAPI, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(adminEmail),
                }).then(res => {
                    return res.json();
                }).catch(err => {
                    console.error('Error sending admin email:', err);
                })
            ]).catch(err => {
                console.error('Error sending verification emails:', err);
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
            data: {
                submissionId: submissionId,
                email: foundEmail
            }
        });

    } catch (error) {
        console.error('Verify email error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Internal server error'
        }, { status: 500 });
    }
}
