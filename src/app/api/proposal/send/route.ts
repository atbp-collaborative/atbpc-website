import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import * as React from 'react';
import { ProposalEmailTemplate } from '@/components/emails/ProposalEmailTemplate';
import { proposalSchema } from '@/lib/forms/proposal.schema';

import { checkRateLimit, isHoneypotTriggered } from '@/lib/security/rate-limit';

export const maxDuration = 60; // Increase timeout for large file uploads if needed

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
      console.warn('[Honeypot] Trapped automated bot submission in proposal form.');
      return NextResponse.json({ success: true, message: 'Proposal request received' });
    }
    
    // Validate the request body
    const validatedData = proposalSchema.parse(body);

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Format attachments for resend
    const emailAttachments: { filename: string; content: string }[] = [];

    const addAttachment = (key: string, file: any) => {
      if (!file) return;
      emailAttachments.push({
        filename: `${key}-${file.name}`,
        content: file.content.split(',')[1],
      });
    };

    addAttachment('tctDocument', validatedData.tctDocument);
    addAttachment('lotPlanDocument', validatedData.lotPlanDocument);
    addAttachment('dorDocument', validatedData.dorDocument);

    if (validatedData.attachments) {
      validatedData.attachments.forEach((file, index) => {
        addAttachment(`ref_${index}`, file);
      });
    }

    // Attach a JSON payload too for easy machine reading
    const payloadBuffer = Buffer.from(JSON.stringify(validatedData, null, 2), 'utf-8');
    emailAttachments.push({
      filename: 'proposal-data.json',
      content: payloadBuffer.toString('base64'),
    });

    // Send the email
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [process.env.COMPANY_EMAIL as string],
      subject: `New Request for Proposal`,
      react: React.createElement(ProposalEmailTemplate, { data: validatedData }) as React.ReactNode,
      attachments: emailAttachments.map(att => ({
        filename: att.filename,
        content: att.content,
      })),
    });

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Proposal submit error', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
