import { CareerFormData } from '../../components/CareerForm.config';

/**
 * CONFIGURATION FOR CAREER APPLICATION SUBMISSIONS
 * Same shape as MS_FORMS_CONFIG in leads.ts — paste a Power Automate /
 * Logic Apps webhook here once one exists for recruitment intake.
 */
export const CAREER_APPLICATIONS_CONFIG = {
  powerAutomateWebhookUrl: '',
};

// Backend-ready seam, mirroring submitLead in leads.ts: swap this
// implementation for a real API call later without touching CareerForm.
//
// Note: `payload.resumeFile` is a real File object (not just name/size), so
// once a webhook/endpoint exists this will need multipart/form-data instead
// of a plain JSON POST to actually upload the resume — application/json
// can't carry binary file content.
export async function submitCareerApplication(payload: CareerFormData): Promise<void> {
  if (!CAREER_APPLICATIONS_CONFIG.powerAutomateWebhookUrl) {
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

  await fetch(CAREER_APPLICATIONS_CONFIG.powerAutomateWebhookUrl, {
    method: 'POST',
    body,
  });
}
