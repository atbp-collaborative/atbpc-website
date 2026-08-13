import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import * as React from 'react';
import { NotificationEmailTemplate } from '@/components/emails/NotificationEmailTemplate';



const emailSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = emailSchema.parse(body);

    const { name, email, message } = validatedData;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const payloadString = JSON.stringify(validatedData, null, 2);
    const payloadBuffer = Buffer.from(payloadString, 'utf-8');

    // Send the email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use default for testing, replace with verified domain later
      to: [process.env.COMPANY_EMAIL as string], // Send to resend testing email or company outlook
      subject: `New Contact Form Submission from ${name}`,
      react: React.createElement(NotificationEmailTemplate, { name, email, message }) as React.ReactNode,
      replyTo: email, // This allows the company outlook to directly reply to the user
      attachments: [
        {
          filename: 'contact-form-data.json',
          content: payloadBuffer,
        },
      ],
    });

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
