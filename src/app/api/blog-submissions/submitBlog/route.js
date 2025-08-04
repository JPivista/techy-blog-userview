import { NextResponse } from 'next/server';

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
            formName,
            emailVerified,
            verificationTimestamp
        } = await req.json();

        const brevoAPI = 'https://api.brevo.com/v3/smtp/email';
        const API_KEY = process.env.BREVO_API_KEY;

        const headers = {
            accept: 'application/json',
            'content-type': 'application/json',
            'api-key': API_KEY,
        };

        const sender = { name: 'Techy Blog', email: 'noreply@yourdomain.com' };

        const adminMail = {
            sender,
            to: [
                { email: 'jp@ivistasolutions.com' },
                { email: 'mvivekraz@gmail.com' },
            ],
            subject: `${emailVerified ? '✅ Verified' : '❓ Unverified'} Blog Submission - Write Your Blog`,
            htmlContent: `
                <h2>New Blog Submission ${emailVerified ? '(Email Verified ✅)' : '(Email Not Verified ❓)'}</h2>
                <p><strong>Form Type:</strong> ${formName}</p>
                
                ${emailVerified ? `
                <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 5px; padding: 10px; margin: 10px 0;">
                    <h4 style="color: #155724; margin: 0;">✅ Email Verified</h4>
                    <p style="color: #155724; margin: 5px 0 0 0; font-size: 14px;">
                        Verified at: ${verificationTimestamp ? new Date(verificationTimestamp).toLocaleString() : 'Unknown'}
                    </p>
                </div>
                ` : `
                <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 5px; padding: 10px; margin: 10px 0;">
                    <h4 style="color: #721c24; margin: 0;">❓ Email Not Verified</h4>
                    <p style="color: #721c24; margin: 5px 0 0 0; font-size: 14px;">
                        This submission was sent without email verification.
                    </p>
                </div>
                `}
                
                <h3>Personal Information</h3>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
                
                <h3>Blog Details</h3>
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Main Category:</strong> ${mainCategory}</p>
                <p><strong>Tags:</strong> ${tags}</p>
                
                <h3>SEO Information</h3>
                <p><strong>Meta Title:</strong> ${metaTitle || 'Not provided'}</p>
                <p><strong>Meta Description:</strong> ${metaDescription || 'Not provided'}</p>
                
                <h3>Blog Content</h3>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
                    ${content.replace(/\n/g, '<br>')}
                </div>
                
                <p><em>This is a blog submission from the "Write Your Blog" form.</em></p>
            `,
        };

        const res = await fetch(brevoAPI, {
            method: 'POST',
            headers,
            body: JSON.stringify(adminMail),
        });

        const json = await res.json();
        console.log('Blog submission email response:', json);

        if (res.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: json }, { status: 500 });
        }
    } catch (error) {
        console.error('Blog submission API error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
} 