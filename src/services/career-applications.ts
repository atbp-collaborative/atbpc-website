import { CareerFormData } from '@/lib/forms/career';

export async function submitCareerApplication(payload: CareerFormData): Promise<void> {
  const response = await fetch('/api/career/send', {
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
