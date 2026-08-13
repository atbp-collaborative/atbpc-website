import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import * as React from 'react';
import { CareerEmailTemplate } from '@/components/emails/CareerEmailTemplate';
import { careerSchema } from '@/lib/forms/career';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = careerSchema.parse(body);

    const { firstName, lastName, email } = validatedData;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const payloadString = JSON.stringify(validatedData, null, 2);
    const payloadBuffer = Buffer.from(payloadString, 'utf-8');

    // Send the email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use default for testing, replace with verified domain later
      to: [process.env.COMPANY_EMAIL as string], // Send to resend testing email or company outlook
      subject: `New Career Application from ${firstName} ${lastName}`,
      react: React.createElement(CareerEmailTemplate, validatedData) as React.ReactNode,
      replyTo: email, // This allows the company outlook to directly reply to the user
      attachments: [
        {
          filename: 'career-form-data.json',
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
