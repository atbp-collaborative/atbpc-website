import { SurveyResponse } from '../../types';

/**
 * CONFIGURATION FOR MICROSOFT INTEGRATION
 * Change these values to integrate Microsoft Forms or Power Automate!
 */
export const MS_FORMS_CONFIG = {
  // OPTION A: Direct Microsoft Forms Link / Embed
  // If you want to use the native MS Forms interface, paste your link here:
  // e.g., "https://forms.office.com/r/xxxxxxxx"
  microsoftFormsUrl: "https://forms.office.com/r/3bB1c2D3eF", // Placeholder, user can customize

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
