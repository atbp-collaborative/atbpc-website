import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// ----------------------------------------------------------------------------
// 1. CONFIGURATION & CREDENTIAL VALIDATION
// ----------------------------------------------------------------------------
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('\n❌ ERROR: NEXT_PUBLIC_SUPABASE_URL is missing in .env.local.');
  process.exit(1);
}

if (!supabaseServiceKey || supabaseServiceKey.includes('supabase-demo')) {
  console.error('\n❌ ERROR: SUPABASE_SERVICE_ROLE_KEY is missing or set to the demo placeholder.');
  console.error('Uploading files to Supabase Storage and modifying database records requires the service_role key.');
  console.error('\nTo find your service_role key:');
  console.error('  1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/_/settings/api');
  console.error('  2. Under "Project API keys", copy the "service_role" (secret) key.');
  console.error('  3. In your .env.local file, set:');
  console.error('     SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BUCKET_NAME = 'portfolio-media';
const OLD_SUPABASE_HOST = 'https://kobptyhaxwpgujipwvbk.supabase.co';

const BASE_DIR = path.resolve(process.cwd(), 'supabase', 'seed-images');
const CATEGORIES_DIR = path.join(BASE_DIR, 'categories');
const PEOPLE_DIR = path.join(BASE_DIR, 'people');
const PROJECTS_DIR = path.join(BASE_DIR, 'projects');
const CMS_DIR = path.join(BASE_DIR, 'cms');

// ----------------------------------------------------------------------------
// 2. HELPER FUNCTIONS
// ----------------------------------------------------------------------------
async function ensureBucketExists(): Promise<boolean> {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    console.error('\n❌ ERROR: Cannot authenticate with Supabase using SUPABASE_SERVICE_ROLE_KEY.');
    console.error(`Supabase error: ${listError.message}`);
    console.error('\nThis occurs when SUPABASE_SERVICE_ROLE_KEY in .env.local is missing or using an invalid/placeholder key.');
    console.error('To retrieve your real service_role key:');
    console.error('  1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/settings/api');
    console.error('  2. Under "Project API keys", reveal and copy the "service_role" (secret) key.');
    console.error('  3. Update .env.local with:');
    console.error('     SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here\n');
    return false;
  }

  const existing = buckets?.find((b) => b.name === BUCKET_NAME);
  if (!existing) {
    console.log(`  [BUCKET] Creating public bucket "${BUCKET_NAME}"...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB
    });
    if (createError && !createError.message.includes('already exists')) {
      console.error(`❌ Failed to create bucket: ${createError.message}`);
      return false;
    }
  } else {
    console.log(`  [BUCKET] Bucket "${BUCKET_NAME}" confirmed active.`);
  }
  return true;
}

async function uploadFileToStorage(storagePath: string, localFilePath: string): Promise<string | null> {
  if (!fs.existsSync(localFilePath)) {
    console.warn(`  [MISSING FILE] Local file not found: ${localFilePath}`);
    return null;
  }

  const buffer = fs.readFileSync(localFilePath);
  const ext = path.extname(localFilePath).toLowerCase();
  const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(storagePath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error(`  [UPLOAD FAILED] ${storagePath}: ${error.message}`);
    return null;
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(storagePath);
  return data.publicUrl;
}

// ----------------------------------------------------------------------------
// 3. MAIN EXECUTION PIPELINE
// ----------------------------------------------------------------------------
async function main() {
  console.log('================================================================');
  console.log('ATBP Collaborative: Supabase Storage Seeder & URL Linker');
  console.log(`Target Supabase URL: ${supabaseUrl}`);
  console.log('================================================================\n');

  console.log('>>> [0/5] Checking Supabase Storage Bucket...');
  const bucketOk = await ensureBucketExists();
  if (!bucketOk) {
    process.exitCode = 1;
    return;
  }

  // --------------------------------------------------------------------------
  // A. PROCESS CATEGORIES
  // --------------------------------------------------------------------------
  console.log('\n>>> [1/5] Uploading Category Hero Images...');
  const categoryFiles = fs.existsSync(CATEGORIES_DIR) ? fs.readdirSync(CATEGORIES_DIR) : [];
  for (const file of categoryFiles) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.webp')) continue;
    const catSlug = path.basename(file, path.extname(file)).toLowerCase();
    const localPath = path.join(CATEGORIES_DIR, file);
    const storagePath = `categories/${file}`;

    const publicUrl = await uploadFileToStorage(storagePath, localPath);
    if (publicUrl) {
      // Find category where id ILIKE catSlug (e.g. Shelter, Livelihood, Community)
      const { data: matched } = await supabase
        .from('project_categories')
        .select('id')
        .ilike('id', catSlug);

      if (matched && matched.length > 0) {
        for (const cat of matched) {
          await supabase
            .from('project_categories')
            .update({ hero_image_url: publicUrl, updated_at: new Date().toISOString() })
            .eq('id', cat.id);
          console.log(`  [LINKED] Category "${cat.id}" -> ${storagePath}`);
        }
      }
    }
  }

  // --------------------------------------------------------------------------
  // B. PROCESS PEOPLE
  // --------------------------------------------------------------------------
  console.log('\n>>> [2/5] Uploading People Portraits...');
  const peopleFiles = fs.existsSync(PEOPLE_DIR) ? fs.readdirSync(PEOPLE_DIR) : [];
  for (const file of peopleFiles) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.webp')) continue;
    const personId = path.basename(file, path.extname(file));
    const localPath = path.join(PEOPLE_DIR, file);
    const storagePath = `people/${file}`;

    const publicUrl = await uploadFileToStorage(storagePath, localPath);
    if (publicUrl) {
      const { data: updated } = await supabase
        .from('people')
        .update({ profile_photo_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', personId)
        .select('id');

      if (updated && updated.length > 0) {
        console.log(`  [LINKED] Person "${personId}" -> ${storagePath}`);
      }
    }
  }

  // --------------------------------------------------------------------------
  // C. PROCESS PROJECT MEDIA
  // --------------------------------------------------------------------------
  console.log('\n>>> [3/5] Uploading Project Media Assets...');
  const { data: mediaItems, error: mediaError } = await supabase
    .from('project_media')
    .select('id, project_id, url')
    .eq('media_type', 'image');

  if (mediaError) {
    console.error(`  [ERROR] Could not fetch project_media: ${mediaError.message}`);
  } else if (mediaItems) {
    const uploadedMap = new Map<string, string>(); // storagePath -> publicUrl

    for (const item of mediaItems) {
      if (!item.url) continue;

      // Extract storage path from url
      const match = item.url.match(/\/portfolio-media\/(.+)$/);
      if (!match) continue;

      const storagePath = decodeURIComponent(match[1]);
      const fileName = path.basename(storagePath);
      const localPath = path.join(PROJECTS_DIR, fileName);

      if (!uploadedMap.has(storagePath)) {
        if (fs.existsSync(localPath)) {
          const publicUrl = await uploadFileToStorage(storagePath, localPath);
          if (publicUrl) {
            uploadedMap.set(storagePath, publicUrl);
          }
        } else {
          console.warn(`  [MISSING ASSET] Local file not found for project media: ${fileName}`);
        }
      }

      const activeUrl = uploadedMap.get(storagePath);
      if (activeUrl && item.url !== activeUrl) {
        await supabase
          .from('project_media')
          .update({ url: activeUrl })
          .eq('id', item.id);
      }
    }
    console.log(`  [LINKED] Updated ${mediaItems.length} project media rows across ${uploadedMap.size} unique storage objects.`);
  }

  // --------------------------------------------------------------------------
  // D. PROCESS CMS MEDIA
  // --------------------------------------------------------------------------
  console.log('\n>>> [4/5] Uploading CMS Media Assets...');
  const cmsFiles = fs.existsSync(CMS_DIR) ? fs.readdirSync(CMS_DIR) : [];
  for (const file of cmsFiles) {
    if (!file.endsWith('.jpg') && !file.endsWith('.png') && !file.endsWith('.webp')) continue;
    const localPath = path.join(CMS_DIR, file);
    const storagePath = `cms/${file}`;
    await uploadFileToStorage(storagePath, localPath);
    console.log(`  [UPLOADED] CMS asset -> ${storagePath}`);
  }

  // --------------------------------------------------------------------------
  // E. BATCH UPDATE CMS TABLES TO NEW SUPABASE URL
  // --------------------------------------------------------------------------
  console.log('\n>>> [5/5] Linking URLs in CMS Tables...');

  // Helper to replace old host in table rows
  async function replaceUrlsInTable(
    table: string,
    column: string,
    idColumn: string = 'id'
  ) {
    const { data: rows } = await supabase
      .from(table)
      .select(`${idColumn}, ${column}`)
      .like(column, `${OLD_SUPABASE_HOST}%`);

    if (rows && rows.length > 0) {
      let count = 0;
      for (const row of rows) {
        const oldVal = (row as any)[column];
        if (oldVal && typeof oldVal === 'string') {
          const newVal = oldVal.replace(OLD_SUPABASE_HOST, supabaseUrl!);
          await supabase
            .from(table)
            .update({ [column]: newVal, updated_at: new Date().toISOString() })
            .eq(idColumn, (row as any)[idColumn]);
          count++;
        }
      }
      console.log(`  [LINKED] ${table} (${column}): updated ${count} records.`);
    } else {
      console.log(`  [SKIPPED] ${table} (${column}): already pointing to current host or empty.`);
    }
  }

  await replaceUrlsInTable('site_pages', 'hero_image_url');
  await replaceUrlsInTable('navigation_cards', 'image_url');
  await replaceUrlsInTable('service_offerings', 'image_url');
  await replaceUrlsInTable('process_philosophies', 'image_url');
  await replaceUrlsInTable('home_slides', 'image_url');

  console.log('\n================================================================');
  console.log('✅ ALL DONE! All images are uploaded to bucket "portfolio-media"');
  console.log('and all database rows have been linked to your Supabase project.');
  console.log('================================================================\n');
}

main().catch((err) => {
  console.error('\n❌ Fatal error in seed-storage-media:', err);
  process.exit(1);
});
