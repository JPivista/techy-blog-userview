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
            formName
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
            subject: 'New Blog Submission - Write Your Blog',
            htmlContent: `
                <h2>New Blog Submission</h2>
                <p><strong>Form Type:</strong> ${formName}</p>
                
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