import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { name, company, email, phone, message, services } = await req.json();

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
                { email: 'vivek@suitematrix.co' },
                { email: 'jp@ivistasolutions.com' },
                { email: 'mvivekraz@gmail.com' },
            ],
            subject: 'New Work Together Request',
            htmlContent: `
        <h2>New Work Together Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Selected Services:</strong> ${services && services.length > 0 ? services.join(', ') : 'No options selected'
                }</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
        };

        const res = await fetch(brevoAPI, {
            method: 'POST',
            headers,
            body: JSON.stringify(adminMail),
        });

        const json = await res.json();
        console.log('Admin mail response:', json);

        if (res.ok) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: json }, { status: 500 });
        }
    } catch (error) {
        console.error('Email API error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
