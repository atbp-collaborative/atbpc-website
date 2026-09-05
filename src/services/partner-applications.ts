import { PartnerFormData } from '@/lib/forms/partner';

export async function submitPartnerApplication(payload: PartnerFormData): Promise<void> {
  const response = await fetch('/api/partner/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to submit application');
  }
}
