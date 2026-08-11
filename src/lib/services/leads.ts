import { SurveyResponse } from '@/types';

/**
 * CONFIGURATION FOR MICROSOFT INTEGRATION
 * Change these values to integrate Microsoft Forms or Power Automate!
 */
export const MS_FORMS_CONFIG = {
  // Direct Microsoft Forms embed links (Share > Embed > iframe src) for each contact form page.
  discoverySessionFormUrl: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__TREkBtUNFlYVkRWTFU4N0pYSFZWUEVZMjVFOEU2Qy4u&embed=true",
  requestProposalFormUrl: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAO__TREkBtUQUhFMjZQWFRNVEY0NU83NkVESzNLNEU1My4u&embed=true",

  // OPTION B: Use our custom front-end and POST payload to MS Power Automate / Logic Apps
  // This webhook can automatically write submissions to Excel, SharePoint, or trigger an email.
  // e.g., "https://prod-XX.southeastasia.logic.azure.com:443/workflows/..."
  powerAutomateWebhookUrl: ""
};

// Backend-ready seam: swap this implementation for a Supabase insert / Express+DB call /
// WordPress REST call later without touching any component that submits a lead.
export async function submitLead(payload: SurveyResponse): Promise<void> {
  if (!MS_FORMS_CONFIG.powerAutomateWebhookUrl) {
    return;
  }

  await fetch(MS_FORMS_CONFIG.powerAutomateWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}
