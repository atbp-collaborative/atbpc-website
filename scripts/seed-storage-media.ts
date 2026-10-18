import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BASE_DIR = path.resolve(process.cwd(), 'supabase', 'seed-images');
const PEOPLE_DIR = path.join(BASE_DIR, 'people');
const PROJECTS_DIR = path.join(BASE_DIR, 'projects');
const CATEGORIES_DIR = path.join(BASE_DIR, 'categories');

[PEOPLE_DIR, PROJECTS_DIR, CATEGORIES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Optimizes an Unsplash URL to a lightweight web-friendly resolution (w=800, q=70)
 * to keep local repository footprint small.
 */
function optimizeUnsplashUrl(rawUrl: string): string {
  if (!rawUrl.includes('images.unsplash.com')) return rawUrl;
  try {
    const url = new URL(rawUrl);
    url.searchParams.set('w', '800');
    url.searchParams.set('q', '70');
    url.searchParams.set('auto', 'format');
    return url.toString();
  } catch {
    return rawUrl;
  }
}

/**
 * Downloads an image politely (if not already cached locally) or reads from local disk.
 */
async function getOrDownloadImage(
  sourceUrl: string,
  localFilePath: string
): Promise<Buffer | null> {
  // 1. If already saved locally in repo, reuse it!
  if (fs.existsSync(localFilePath)) {
    console.log(`  [CACHE HIT] Using local seed asset: ${path.basename(localFilePath)}`);
    return fs.readFileSync(localFilePath);
  }

  // 2. Local public file (e.g. /images/hero_modern_villa_...jpg)
  if (sourceUrl.startsWith('/')) {
    const localPublicPath = path.resolve(process.cwd(), 'public', sourceUrl.replace(/^\//, ''));
    if (fs.existsSync(localPublicPath)) {
      console.log(`  [LOCAL COPY] Copying from public: ${sourceUrl}`);
      const buffer = fs.readFileSync(localPublicPath);
      fs.writeFileSync(localFilePath, buffer);
      return buffer;
    }
  }

  // 3. Remote URL (Unsplash or external)
  try {
    const optimized = optimizeUnsplashUrl(sourceUrl);
    console.log(`  [DOWNLOADING] ${optimized.slice(0, 75)}...`);

    const res = await fetch(optimized, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ATBP-Collaborative-Seed-Bot/1.0',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
    });

    if (!res.ok) {
      console.warn(`  [FAILED] HTTP ${res.status} for ${sourceUrl}`);
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(localFilePath, buffer);

    // Polite delay to stay completely compliant with Unsplash
    await sleep(400);
    return buffer;
  } catch (err: any) {
    console.error(`  [ERROR] Downloading ${sourceUrl}:`, err.message);
    return null;
  }
}

async function uploadToSupabaseStorage(
  storagePath: string,
  buffer: Buffer,
  contentType: string = 'image/jpeg'
): Promise<string | null> {
  const { error } = await supabase.storage
    .from('portfolio-media')
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error(`  [STORAGE ERROR] ${storagePath}:`, error.message);
    return null;
  }

  const { data } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

async function main() {
  console.log('================================================================');
  console.log('ATBP Collaborative: Media Downloader & Supabase Storage Seeder');
  console.log('================================================================\n');

  // ----------------------------------------------------------------------------
  // A. PROCESS CATEGORIES
  // ----------------------------------------------------------------------------
  console.log('>>> [1/3] Processing Project Categories...');
  const { data: categories } = await supabase
    .from('project_categories')
    .select('id, hero_image_url');

  if (categories) {
    for (const cat of categories) {
      if (!cat.hero_image_url) continue;
      const fileName = `${cat.id.toLowerCase()}.jpg`;
      const localPath = path.join(CATEGORIES_DIR, fileName);
      const storagePath = `categories/${fileName}`;

      const buffer = await getOrDownloadImage(cat.hero_image_url, localPath);
      if (buffer) {
        const publicUrl = await uploadToSupabaseStorage(storagePath, buffer);
        if (publicUrl && publicUrl !== cat.hero_image_url) {
          await supabase
            .from('project_categories')
            .update({ hero_image_url: publicUrl })
            .eq('id', cat.id);
          console.log(`  [UPDATED DB] Category ${cat.id} -> ${publicUrl}`);
        }
      }
    }
  }

  // ----------------------------------------------------------------------------
  // B. PROCESS PEOPLE
  // ----------------------------------------------------------------------------
  console.log('\n>>> [2/3] Processing People Portraits...');
  const { data: people } = await supabase
    .from('people')
    .select('id, profile_photo_url');

  if (people) {
    for (const person of people) {
      if (!person.profile_photo_url) continue;
      const fileName = `${person.id}.jpg`;
      const localPath = path.join(PEOPLE_DIR, fileName);
      const storagePath = `people/${fileName}`;

      const buffer = await getOrDownloadImage(person.profile_photo_url, localPath);
      if (buffer) {
        const publicUrl = await uploadToSupabaseStorage(storagePath, buffer);
        if (publicUrl && publicUrl !== person.profile_photo_url) {
          await supabase
            .from('people')
            .update({ profile_photo_url: publicUrl })
            .eq('id', person.id);
          console.log(`  [UPDATED DB] Person ${person.id} -> ${publicUrl}`);
        }
      }
    }
  }

  // ----------------------------------------------------------------------------
  // C. PROCESS PROJECT MEDIA
  // ----------------------------------------------------------------------------
  console.log('\n>>> [3/3] Processing Project Media...');
  const { data: mediaItems } = await supabase
    .from('project_media')
    .select('id, project_id, url, media_type, sort_order')
    .eq('media_type', 'image');

  if (mediaItems) {
    // Map to deduplicate identical source URLs so we don't download the same image twice
    const urlToCdnMap = new Map<string, string>();

    for (let i = 0; i < mediaItems.length; i++) {
      const item = mediaItems[i];
      if (!item.url || item.url.startsWith('https://' + new URL(supabaseUrl!).hostname)) {
        continue; // Already migrated to Supabase CDN
      }

      // Check if we already uploaded this exact source image in this run
      if (urlToCdnMap.has(item.url)) {
        const existingCdnUrl = urlToCdnMap.get(item.url)!;
        await supabase
          .from('project_media')
          .update({ url: existingCdnUrl })
          .eq('id', item.id);
        console.log(`  [DEDUPLICATED] Media #${item.id} (${item.project_id}) reused CDN URL`);
        continue;
      }

      const fileName = `${item.project_id}-${item.sort_order / 10 + 1}.jpg`;
      const localPath = path.join(PROJECTS_DIR, fileName);
      const storagePath = `projects/${item.project_id}/${fileName}`;

      const buffer = await getOrDownloadImage(item.url, localPath);
      if (buffer) {
        const publicUrl = await uploadToSupabaseStorage(storagePath, buffer);
        if (publicUrl) {
          urlToCdnMap.set(item.url, publicUrl);
          await supabase
            .from('project_media')
            .update({ url: publicUrl })
            .eq('id', item.id);
          console.log(`  [UPDATED DB] Media #${item.id} (${item.project_id}) -> ${publicUrl}`);
        }
      }
    }
  }

  console.log('\n================================================================');
  console.log('Done! All media has been saved to supabase/seed-images/ and');
  console.log('uploaded to Supabase Storage bucket "portfolio-media".');
  console.log('================================================================');
}

main().catch((err) => {
  console.error('Fatal error in seed-storage-media:', err);
  process.exit(1);
});
