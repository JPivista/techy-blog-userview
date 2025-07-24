import { NextResponse } from 'next/server';

export async function POST(req) {
    const { name, email, message } = await req.json();

    const brevoAPI = 'https://api.brevo.com/v3/smtp/email';
    const API_KEY = process.env.BREVO_API_KEY;

    const headers = {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': API_KEY,
    };

    const sender = { name: 'Techy Blog', email: 'noreply@yourdomain.com' }; // MUST be Brevo-verified domain email

    const userMail = {
        sender,
        to: [{ email }],
        subject: 'Thank you for contacting us!',
        htmlContent: `
            <p>Hi ${name},</p>
            <p>Thank you for reaching out. We’ll contact you as soon as possible.</p>
            <br><p>— Team Techy Blog</p>
        `,
    };

    const adminMail = {
        sender,
        to: [
            { email: 'vivek@suitematrix.co' },
            { email: 'jp@ivistasolutions.com' },
            { email: 'mvivekraz@gmail.com' },
        ],
        subject: 'New Contact Form Submission',
        htmlContent: `
            <h2>New Contact Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong><br/>${message}</p>
        `,
    };

    try {
        const res1 = await fetch(brevoAPI, {
            method: 'POST',
            headers,
            body: JSON.stringify(userMail),
        });
        const json1 = await res1.json();
        console.log('User email response:', json1);

        const res2 = await fetch(brevoAPI, {
            method: 'POST',
            headers,
            body: JSON.stringify(adminMail),
        });
        const json2 = await res2.json();
        console.log('Admin email response:', json2);

        if (res1.ok && res2.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: { user: json1, admin: json2 } }, { status: 500 });
        }
    } catch (error) {
        console.error('Brevo Error:', error);
        return NextResponse.json({ success: false, error: 'Email failed' }, { status: 500 });
    }
}
