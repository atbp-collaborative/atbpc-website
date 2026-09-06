import { CareerFormData } from '@/lib/forms/career.schema';
import { DiscoverySessionFormData } from '@/lib/forms/discovery.schema';
import { ProposalFormData } from '@/lib/forms/proposal.schema';

/**
 * A generic internal utility for submitting form data.
 */
async function postJSON(endpoint: string, payload: unknown, errorMessage: string): Promise<void> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(errorMessage);
  }
}

export async function submitCareerApplication(payload: CareerFormData): Promise<void> {
  return postJSON('/api/career/send', payload, 'Failed to submit application');
}

export async function submitDiscoverySession(payload: DiscoverySessionFormData): Promise<void> {
  return postJSON('/api/discovery/send', payload, 'Failed to submit discovery session');
}

export async function submitProposal(payload: ProposalFormData): Promise<void> {
  return postJSON('/api/proposal/send', payload, 'Failed to submit proposal');
}
