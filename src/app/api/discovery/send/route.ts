import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import * as React from 'react';
import { NotificationEmailTemplate } from '@/components/emails/NotificationEmailTemplate';
import { discoverySchema } from '@/lib/forms/discovery.schema';

import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. IP Rate Limiting Check
    const rateCheck = checkRateLimit(request);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a few minutes before trying again.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.retryAfterSeconds),
          },
        }
      );
    }

    const body = await request.json();

    // 2. Honeypot Spam Defense Check
    if (isHoneypotTriggered(body)) {
      console.warn('[Honeypot] Trapped automated bot submission in discovery session form.');
      return NextResponse.json({ success: true, message: 'Discovery booking received' });
    }
    
    // Validate the request body
    const validatedData = discoverySchema.parse(body);

    const { firstName, lastName, email } = validatedData;
    const name = `${firstName} ${lastName}`.trim();
    const message = `A new Discovery Session has been booked by ${name}. \n\nMeeting Type: ${validatedData.meetingType}\nDate: ${validatedData.date || 'TBD'}\nTime: ${validatedData.startTime || 'TBD'}\n\nPlease find the complete details attached.`;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const payloadString = JSON.stringify(validatedData, null, 2);
    const payloadBuffer = Buffer.from(payloadString, 'utf-8');

    // Send the email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev', // Use default for testing, replace with verified domain later
      to: [process.env.COMPANY_EMAIL as string], // Send to resend testing email or company outlook
      subject: `New Discovery Session Booking from ${name}`,
      react: React.createElement(NotificationEmailTemplate, { name, email, message }) as React.ReactNode,
      replyTo: email, // This allows the company outlook to directly reply to the user
      attachments: [
        {
          filename: 'discovery-session-data.json',
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
    
    console.error('Error submitting discovery session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
