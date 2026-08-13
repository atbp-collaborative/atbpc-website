import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import * as React from 'react';
import { PartnerEmailTemplate } from '@/components/emails/PartnerEmailTemplate';
import { partnerSchema } from '@/lib/forms/partner';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = partnerSchema.parse(body);

    const { companyName, emails } = validatedData;
    const primaryEmail = emails?.[0]?.email || '';

    const resend = new Resend(process.env.RESEND_API_KEY);

    const payloadString = JSON.stringify(validatedData, null, 2);
    const payloadBuffer = Buffer.from(payloadString, 'utf-8');

    // Send the email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use default for testing, replace with verified domain later
      to: [process.env.COMPANY_EMAIL as string], // Send to resend testing email or company outlook
      subject: `New Partner Application from ${companyName}`,
      react: React.createElement(PartnerEmailTemplate, validatedData) as React.ReactNode,
      replyTo: primaryEmail, 
      attachments: [
        {
          filename: 'partner-form-data.json',
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
