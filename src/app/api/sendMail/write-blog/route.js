import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { name, email, mobile, content, formName } = await req.json();

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
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Mobile:</strong> ${mobile}</p>
                <p><strong>Blog Content:</strong></p>
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