import { PartnerFormData } from '@/lib/forms/partner';

/**
 * CONFIGURATION FOR PARTNER APPLICATION SUBMISSIONS
 * Same shape as CAREER_APPLICATIONS_CONFIG — paste a Power Automate /
 * Logic Apps webhook here once one exists for partner intake.
 */
export const PARTNER_APPLICATIONS_CONFIG = {
  powerAutomateWebhookUrl: '',
};

// Backend-ready seam: swap this implementation for a real API call later 
// without touching PartnerApplicationForm.
export async function submitPartnerApplication(payload: PartnerFormData): Promise<void> {
  if (!PARTNER_APPLICATIONS_CONFIG.powerAutomateWebhookUrl) {
    return;
  }

  const body = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      body.append(key, value);
    } else if (value !== null && typeof value === 'object') {
      // e.g. `address` — flatten so each sub-field posts as its own key instead of "[object Object]".
      Object.entries(value).forEach(([subKey, subValue]) => body.append(`${key}.${subKey}`, String(subValue)));
    } else if (value !== null) {
      body.append(key, String(value));
    }
  });

  await fetch(PARTNER_APPLICATIONS_CONFIG.powerAutomateWebhookUrl, {
    method: 'POST',
    body,
  });
}
