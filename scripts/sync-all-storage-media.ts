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
const CMS_DIR = path.join(BASE_DIR, 'cms');
const PEOPLE_DIR = path.join(BASE_DIR, 'people');
const PROJECTS_DIR = path.join(BASE_DIR, 'projects');
const CATEGORIES_DIR = path.join(BASE_DIR, 'categories');

[CMS_DIR, PEOPLE_DIR, PROJECTS_DIR, CATEGORIES_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function uploadToStorage(storagePath: string, buffer: Buffer, contentType = 'image/jpeg'): Promise<string> {
  const { error } = await supabase.storage.from('portfolio-media').upload(storagePath, buffer, {
    contentType,
    upsert: true,
  });

  if (error) {
    console.error(`  [STORAGE ERROR] ${storagePath}:`, error.message);
  }

  const { data } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath);
  return data.publicUrl;
}

async function downloadOrLoad(sourceUrl: string, localPath: string): Promise<Buffer | null> {
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  if (sourceUrl.startsWith('/')) {
    const localPublicPath = path.resolve(process.cwd(), 'public', sourceUrl.replace(/^\//, ''));
    if (fs.existsSync(localPublicPath)) {
      const buffer = fs.readFileSync(localPublicPath);
      fs.writeFileSync(localPath, buffer);
      return buffer;
    }
  }

  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(localPath, buffer);
    return buffer;
  } catch (err: any) {
    console.error(`Error downloading ${sourceUrl}:`, err.message);
    return null;
  }
}

async function run() {
  console.log('================================================================');
  console.log('1. Uploading CMS Images to Supabase Storage (portfolio-media/cms)');
  console.log('================================================================\n');

  const publicImages = [
    'hero_modern_villa_1783495183350.jpg',
    'condo_fitout_interior_1783495200802.jpg',
    'production_drawings_1783495233053.jpg',
    'retail_boutique_1783495217375.jpg',
    'kiosk_coffee_bar_1783495252161.jpg',
    'studio_services_img_1785469964556.jpg',
    'studio_process_img_1785469980353.jpg',
    'studio_people_img_1785469993286.jpg',
    'contact_case_study_house_img_1785469986420.jpg',
    'contact_headquarters_img_1785470005846.jpg',
    'contact_careers_img_1785470018782.jpg',
    'contact_partners_img_1785470031164.jpg',
  ];

  const cdnUrlMap = new Map<string, string>();

  // A. Upload public images
  for (const imgName of publicImages) {
    const localPublic = path.join(process.cwd(), 'public', 'images', imgName);
    const localBackup = path.join(CMS_DIR, imgName);
    if (fs.existsSync(localPublic)) {
      const buf = fs.readFileSync(localPublic);
      fs.writeFileSync(localBackup, buf);
      const storagePath = `cms/${imgName}`;
      const cdnUrl = await uploadToStorage(storagePath, buf);
      cdnUrlMap.set(`/images/${imgName}`, cdnUrl);
      console.log(`  Uploaded /images/${imgName} -> ${cdnUrl}`);
    }
  }

  // B. Upload external studio card images
  const studioCardsExternal = [
    { key: 'unsplash_studio_services', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop', file: 'studio-services-card.jpg' },
    { key: 'unsplash_studio_process', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2071&auto=format&fit=crop', file: 'studio-process-card.jpg' },
    { key: 'unsplash_studio_people', url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop', file: 'studio-people-card.jpg' },
  ];

  for (const item of studioCardsExternal) {
    const localPath = path.join(CMS_DIR, item.file);
    const buf = await downloadOrLoad(item.url, localPath);
    if (buf) {
      const storagePath = `cms/${item.file}`;
      const cdnUrl = await uploadToStorage(storagePath, buf);
      cdnUrlMap.set(item.url, cdnUrl);
      console.log(`  Uploaded ${item.file} -> ${cdnUrl}`);
    }
  }

  console.log('\n================================================================');
  console.log('2. Updating Live DB CMS Tables with Supabase CDN URLs');
  console.log('================================================================\n');

  // Update site_pages
  const { data: pages } = await supabase.from('site_pages').select('id, hero_image_url');
  for (const page of pages || []) {
    if (page.hero_image_url && cdnUrlMap.has(page.hero_image_url)) {
      const newUrl = cdnUrlMap.get(page.hero_image_url)!;
      await supabase.from('site_pages').update({ hero_image_url: newUrl }).eq('id', page.id);
      console.log(`  Updated site_page: ${page.id} -> ${newUrl}`);
    }
  }

  // Update navigation_cards
  const { data: cards } = await supabase.from('navigation_cards').select('id, card_key, image_url');
  for (const card of cards || []) {
    if (card.image_url && cdnUrlMap.has(card.image_url)) {
      const newUrl = cdnUrlMap.get(card.image_url)!;
      await supabase.from('navigation_cards').update({ image_url: newUrl }).eq('id', card.id);
      console.log(`  Updated navigation_card: ${card.card_key} -> ${newUrl}`);
    }
  }

  // Update service_offerings
  const { data: services } = await supabase.from('service_offerings').select('id, image_url');
  for (const s of services || []) {
    if (s.image_url && cdnUrlMap.has(s.image_url)) {
      const newUrl = cdnUrlMap.get(s.image_url)!;
      await supabase.from('service_offerings').update({ image_url: newUrl }).eq('id', s.id);
      console.log(`  Updated service_offering: ${s.id} -> ${newUrl}`);
    }
  }

  // Update process_philosophies
  const { data: procs } = await supabase.from('process_philosophies').select('id, image_url');
  for (const p of procs || []) {
    if (p.image_url && cdnUrlMap.has(p.image_url)) {
      const newUrl = cdnUrlMap.get(p.image_url)!;
      await supabase.from('process_philosophies').update({ image_url: newUrl }).eq('id', p.id);
      console.log(`  Updated process_philosophy: ${p.id} -> ${newUrl}`);
    }
  }

  // Update home_slides
  const { data: slides } = await supabase.from('home_slides').select('id, title, image_url');
  for (const sl of slides || []) {
    if (sl.image_url && cdnUrlMap.has(sl.image_url)) {
      const newUrl = cdnUrlMap.get(sl.image_url)!;
      await supabase.from('home_slides').update({ image_url: newUrl }).eq('id', sl.id);
      console.log(`  Updated home_slide: ${sl.id} (${sl.title}) -> ${newUrl}`);
    }
  }

  // Update project_categories
  const { data: categories } = await supabase.from('project_categories').select('id, hero_image_url');
  for (const cat of categories || []) {
    const storagePath = `categories/${cat.id.toLowerCase()}.jpg`;
    const { data: urlData } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath);
    await supabase.from('project_categories').update({ hero_image_url: urlData.publicUrl }).eq('id', cat.id);
    cdnUrlMap.set(`/images/${cat.id.toLowerCase()}.jpg`, urlData.publicUrl);
    console.log(`  Updated project_category: ${cat.id} -> ${urlData.publicUrl}`);
  }

  // Update people profile_photo_url
  const { data: people } = await supabase.from('people').select('id, profile_photo_url');
  for (const person of people || []) {
    const storagePath = `people/${person.id}.jpg`;
    const { data: urlData } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath);
    await supabase.from('people').update({ profile_photo_url: urlData.publicUrl }).eq('id', person.id);
    console.log(`  Updated person: ${person.id} -> ${urlData.publicUrl}`);
  }

  console.log('\n================================================================');
  console.log('3. Updating seed_new.sql and seed_cms.sql with Bucket URLs');
  console.log('================================================================\n');

  // Replace URLs in seed_new.sql
  const seedFiles = [
    path.join(process.cwd(), 'supabase', 'seed_new.sql'),
  ];

  // Also build mapping for all people and categories to CDN URLs
  const baseUrl = `${supabaseUrl}/storage/v1/object/public/portfolio-media`;

  for (const filePath of seedFiles) {
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Replace categories
    content = content.replace(
      "('Shelter', 'Shelter', 'for the way you live', '/images/hero_modern_villa_1783495183350.jpg', 1)",
      `('Shelter', 'Shelter', 'for the way you live', '${baseUrl}/categories/shelter.jpg', 1)`
    );
    content = content.replace(
      "('Livelihood', 'Livelihood', 'where passion takes form', '/images/retail_boutique_1783495217375.jpg', 2)",
      `('Livelihood', 'Livelihood', 'where passion takes form', '${baseUrl}/categories/livelihood.jpg', 2)`
    );
    content = content.replace(
      "('Community', 'Community', 'we share & communicate', '/images/production_drawings_1783495233053.jpg', 3)",
      `('Community', 'Community', 'we share & communicate', '${baseUrl}/categories/community.jpg', 3)`
    );

    // 2. Replace all people profile_photo_url with their bucket URLs
    const peopleIds = [
      'marchie-borja', 'jhoanna-ramos', 'adrian-mores', 'nikka-oliveros',
      'mark-ramos', 'maria-santos', 'christian-alipio', 'hannah-villanueva',
      'ernest-bambico', 'john-dave-aquino', 'rafael-bautista', 'patricia-yumang',
      'andrea-fernandez', 'miguel-torres', 'kristelle-del-rosario'
    ];
    for (const pId of peopleIds) {
      const bucketUrl = `${baseUrl}/people/${pId}.jpg`;
      // Replace old mock / unsplash url for this person
      const regex = new RegExp(`'${pId}',[^;]+?('https:\\/\\/images\\.unsplash\\.com[^']+'|'\\/images\\/[^']+')`, 'g');
      content = content.replace(regex, (match) => {
        return match.replace(/('https:\/\/images\.unsplash\.com[^']+'|'\/images\/[^']+')/, `'${bucketUrl}'`);
      });
    }

    // 3. Replace all CMS images in cdnUrlMap
    for (const [oldUrl, newUrl] of cdnUrlMap.entries()) {
      content = content.split(`'${oldUrl}'`).join(`'${newUrl}'`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  Updated URLs in ${path.basename(filePath)}!`);
  }

  // 4. Replace project_media in seed_new.sql
  const { data: mediaRows } = await supabase
    .from('project_media')
    .select('project_id, sort_order, url, caption')
    .eq('media_type', 'image');

  const seedNewPath = path.join(process.cwd(), 'supabase', 'seed_new.sql');
  let seedNewContent = fs.readFileSync(seedNewPath, 'utf8');
  let replacedMediaCount = 0;

  for (const m of mediaRows || []) {
    const escapedCaption = m.caption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `\\('${m.project_id}',\\s*'image',\\s*'https:\\/\\/images\\.unsplash\\.com[^']+',\\s*'${escapedCaption}',\\s*(TRUE|FALSE),\\s*${m.sort_order}\\)`,
      'g'
    );
    if (regex.test(seedNewContent)) {
      seedNewContent = seedNewContent.replace(
        regex,
        `('${m.project_id}', 'image', '${m.url}', '${m.caption}', $1, ${m.sort_order})`
      );
      replacedMediaCount++;
    }
  }
  fs.writeFileSync(seedNewPath, seedNewContent, 'utf8');
  console.log(`  Updated ${replacedMediaCount} project_media rows in seed_new.sql to bucket URLs!`);

  console.log('\nAll images rechecked, uploaded, and mapped to Supabase CDN URLs successfully!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
