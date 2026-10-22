import { createClient } from '@supabase/supabase-js';
import { isManagedUpload, isMediaReferenced } from '../src/lib/images/storage-cleanup.ts';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error('Supabase URL and service role key are required');

const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const bucket = client.storage.from('portfolio-media');
const apply = process.argv.includes('--apply');

async function listFiles(prefix = ''): Promise<string[]> {
  const paths: string[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await bucket.list(prefix, { limit: 1000, offset });
    if (error) throw new Error(`Could not list ${prefix || '/'}: ${error.message}`);
    for (const entry of data || []) {
      const path = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.id) paths.push(path);
      else paths.push(...await listFiles(path));
    }
    if (!data || data.length < 1000) break;
  }
  return paths;
}

const candidates = (await listFiles()).filter(isManagedUpload);
const orphaned: string[] = [];
for (const path of candidates) {
  if (!await isMediaReferenced(client, path)) orphaned.push(path);
}

console.log(`Inspected ${candidates.length} managed uploads; found ${orphaned.length} unreferenced files.`);
orphaned.forEach((path) => console.log(path));

if (apply) {
  for (const path of orphaned) {
    // Recheck immediately before deletion in case an editor saved a reference during the scan.
    if (await isMediaReferenced(client, path)) continue;
    const { error } = await bucket.remove([path]);
    if (error) throw new Error(`Could not remove ${path}: ${error.message}`);
  }
  console.log('Cleanup complete.');
} else {
  console.log('Dry run only. Pass --apply to delete the listed files.');
}
