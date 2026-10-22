import type { SupabaseClient } from '@supabase/supabase-js';
// Keep these names in sync with supabase/seed-images; seed files support database resets.
const SEED_MEDIA_NAMES = new Set([
  "Vacation Homes-6-2.jpg",
  "adrian-mores.jpg",
  "andrea-fernandez.jpg",
  "christian-alipio.jpg",
  "community.jpg",
  "condo_fitout_interior_1783495200802.jpg",
  "contact_careers_img_1785470018782.jpg",
  "contact_case_study_house_img_1785469986420.jpg",
  "contact_headquarters_img_1785470005846.jpg",
  "contact_partners_img_1785470031164.jpg",
  "ernest-bambico.jpg",
  "hannah-villanueva.jpg",
  "hero_modern_villa_1783495183350.jpg",
  "jhoanna-ramos.jpg",
  "john-dave-aquino.jpg",
  "kiosk_coffee_bar_1783495252161.jpg",
  "kristelle-del-rosario.jpg",
  "livelihood.jpg",
  "marchie-borja.jpg",
  "maria-santos.jpg",
  "mark-ramos.jpg",
  "miguel-torres.jpg",
  "nikka-oliveros.jpg",
  "patricia-yumang.jpg",
  "production_drawings_1783495233053.jpg",
  "rafael-bautista.jpg",
  "retail_boutique_1783495217375.jpg",
  "shelter.jpg",
  "studio-people-card.jpg",
  "studio-process-card.jpg",
  "studio-services-card.jpg",
  "studio_people_img_1785469993286.jpg",
  "studio_process_img_1785469980353.jpg",
  "studio_services_img_1785469964556.jpg",
  "tiny-living-3-1.jpg",
  "tiny-living-3-3.jpg",
  "tiny-living-4-2.jpg",
  "tiny-living-4-6.jpg",
  "tiny-living-5-2.jpg",
  "urban-living-1-1.jpg",
  "urban-living-1-2.jpg",
  "urban-living-1-3.jpg",
  "urban-living-1-5.jpg",
  "urban-living-2-1.jpg",
  "urban-living-2-3.jpg",
]);

const BUCKET = 'portfolio-media';
const STATIC_FALLBACK_PATHS = new Set([
  'categories/community.jpg', 'categories/livelihood.jpg', 'categories/shelter.jpg',
  'cms/contact_careers_img_1785470020165.jpg',
  'cms/contact_case_study_house_img_1785469986420.jpg',
  'cms/contact_headquarters_img_1785470005846.jpg',
  'cms/contact_partners_img_1785470031164.jpg',
  'cms/production_drawings_1783495233053.jpg',
  'cms/studio_people_img_1785469993286.jpg',
  'cms/studio_process_img_1785469980353.jpg',
  'cms/studio_services_img_1785469964556.jpg',
  'cms/studio-people-card.jpg', 'cms/studio-process-card.jpg', 'cms/studio-services-card.jpg',
]);
const IMAGE_COLUMNS = [
  ['people', 'profile_photo_url'],
  ['admin_users', 'avatar_url'],
  ['project_media', 'url'],
  ['project_categories', 'hero_image_url'],
  ['site_pages', 'hero_image_url'],
  ['navigation_cards', 'image_url'],
  ['process_philosophies', 'image_url'],
  ['service_offerings', 'image_url'],
  ['home_slides', 'image_url'],
] as const;

export function ownedMediaPath(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const origin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
    const prefix = `/storage/v1/object/public/${BUCKET}/`;
    if (url.origin !== origin.origin || !url.pathname.startsWith(prefix)) return null;
    const path = decodeURIComponent(url.pathname.slice(prefix.length));
    if (!path || path.split('/').some((part) => !part || part === '.' || part === '..')) return null;
    return path;
  } catch {
    return null;
  }
}

export function isManagedUpload(path: string): boolean {
  return /^(?:people|projects|categories|cms)\/.+\.(?:webp|png|jpe?g|gif|svg)$/i.test(path)
    && !STATIC_FALLBACK_PATHS.has(path)
    && !SEED_MEDIA_NAMES.has(path.split('/').at(-1) || '');
}

function containsMediaPath(value: unknown, path: string): boolean {
  if (typeof value === 'string') return ownedMediaPath(value) === path;
  if (Array.isArray(value)) return value.some((item) => containsMediaPath(item, path));
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => containsMediaPath(item, path));
  }
  return false;
}

export async function isMediaReferenced(client: SupabaseClient, path: string): Promise<boolean> {
  for (const [table, column] of IMAGE_COLUMNS) {
    for (let offset = 0; ; offset += 1000) {
      const { data, error } = await client.from(table).select(column).range(offset, offset + 999);
      if (error) throw new Error(`Could not inspect ${table}.${column}: ${error.message}`);
      if ((data || []).some((row: Record<string, unknown>) => ownedMediaPath(row[column] as string) === path)) {
        return true;
      }
      if (!data || data.length < 1000) break;
    }
  }
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from('site_settings').select('content').range(offset, offset + 999);
    if (error) throw new Error(`Could not inspect site settings: ${error.message}`);
    if ((data || []).some((row: { content: unknown }) => containsMediaPath(row.content, path))) return true;
    if (!data || data.length < 1000) break;
  }
  return false;
}

export async function cleanupUnreferencedMedia(client: SupabaseClient, urls: Iterable<string>): Promise<void> {
  const paths = [...new Set([...urls].map(ownedMediaPath).filter((path): path is string => Boolean(path)))];
  for (const path of paths) {
    if (!isManagedUpload(path) || await isMediaReferenced(client, path)) continue;
    const { error } = await client.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(`Could not remove ${path}: ${error.message}`);
  }
}
