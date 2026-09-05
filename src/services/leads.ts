import { SurveyResponse } from '@/types';

export const MS_FORMS_CONFIG = {
  // Direct Microsoft Forms embed links (Share > Embed > iframe src) for each contact form page.
  discoverySessionFormUrl: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__TREkBtUNFlYVkRWTFU4N0pYSFZWUEVZMjVFOEU2Qy4u&embed=true",
  requestProposalFormUrl: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__TREkBtUQUhFMjZQWFRNVEY0NU83NkVESzNLNEU1My4u&embed=true",
};

export async function submitLead(payload: SurveyResponse): Promise<void> {
  const response = await fetch('/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to submit lead');
  }
}
