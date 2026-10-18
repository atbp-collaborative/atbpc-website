import { MEMBERS_DATA } from '../src/lib/dummy-data/works/members';
import { PROJECTS_DATA } from '../src/lib/dummy-data/works/projects';
import { INITIAL_ROLES_DATA } from '../src/lib/dummy-data/roles/roles-data';
import { CONTACT_INFO } from '../src/lib/dummy-data/contact/contact-info';
import { privacyPolicyModalData } from '../src/lib/modals/privacy-policy';
import { legalModalData } from '../src/lib/modals/legal';
import * as fs from 'fs';
import * as path from 'path';

function escapeSql(str: string | undefined | null): string {
  if (str === null || str === undefined) return 'NULL';
  return `'` + str.replace(/'/g, `''`) + `'`;
}

function escapeJson(obj: any): string {
  if (obj === null || obj === undefined) return `'{}'::jsonb`;
  return `'` + JSON.stringify(obj).replace(/'/g, `''`) + `'::jsonb`;
}

function escapeTextArray(arr: string[] | undefined | null): string {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return `'{}'::text[]`;
  const escapedElements = arr.map(s => `"${s.replace(/"/g, '\\"')}"`).join(',');
  return `'` + `{` + escapedElements + `}` + `'::text[]`;
}

const lines: string[] = [];

lines.push(`-- ==============================================================================`);
lines.push(`-- ATBP Collaborative - Supabase Complete Normalized Seed Data (seed_new.sql)`);
lines.push(`-- Consolidates tracks, roles, categories, typologies, contract types,`);
lines.push(`-- people, credentials, projects, media, contributors, and site settings.`);
lines.push(`-- ==============================================================================`);
lines.push(``);

// 1. TRACKS
lines.push(`-- 1. TRACKS`);
lines.push(`INSERT INTO public.tracks (id, code, name, track_type, required_hours, governing_body, description, sort_order) VALUES`);
lines.push(`('PROF', 'PROF', 'Professional Practice', 'professional', NULL, 'PRC / BOA / Internal', 'Full-time licensed and experienced studio professionals directing design, engineering, and construction.', 10),`);
lines.push(`('INTERN_CHED_240', 'INT-CHED', 'Curriculum-based Architecture Intern', 'internship', 240, 'CHED CMO No. 104, Series of 2017', 'Academic internship for undergraduate architecture students completing curriculum requirements.', 20),`);
lines.push(`('INTERN_VOC', 'INT-VOC', 'Vocational Technical Intern', 'internship', 300, 'TESDA', 'Vocational technical hands-on internship for National Certificate (NC) holders.', 30),`);
lines.push(`('APPRENTICE_ALE_3840', 'APP-ALE', 'Diversified Architectural Experience (ALE)', 'apprenticeship', 3840, 'PRC-BOA', 'PRC-mandated 3,840 logbook hours under registered and licensed architects qualifying for the ALE.', 40)`);
lines.push(`ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, track_type = EXCLUDED.track_type, required_hours = EXCLUDED.required_hours, governing_body = EXCLUDED.governing_body, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;`);
lines.push(``);

// 2. PROJECT CATEGORIES
lines.push(`-- 2. PROJECT CATEGORIES (3 Core Pillars)`);
lines.push(`INSERT INTO public.project_categories (id, name, tagline, hero_image_url, sort_order) VALUES`);
lines.push(`('Shelter', 'Shelter', 'for the way you live', '/images/hero_modern_villa_1783495183350.jpg', 1),`);
lines.push(`('Livelihood', 'Livelihood', 'where passion takes form', '/images/retail_boutique_1783495217375.jpg', 2),`);
lines.push(`('Community', 'Community', 'we share & communicate', '/images/production_drawings_1783495233053.jpg', 3)`);
lines.push(`ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, tagline = EXCLUDED.tagline, hero_image_url = EXCLUDED.hero_image_url, sort_order = EXCLUDED.sort_order;`);
lines.push(``);

// 3. PROJECT TYPOLOGIES
lines.push(`-- 3. PROJECT TYPOLOGIES (9 Typologies)`);
const typologies = [
  { id: 'tiny-living', categoryId: 'Shelter', name: 'Tiny Living', description: 'Compact, high-efficiency micro-dwellings and optimized tropical living spaces.', order: 10 },
  { id: 'multi-generational', categoryId: 'Shelter', name: 'Multi-Generational', description: 'Cohesive, flexible residential compounds accommodating multi-tier family living.', order: 20 },
  { id: 'vacation-homes', categoryId: 'Shelter', name: 'Vacation Homes', description: 'Tranquil retreat residences and tropical lifestyle estates focused on nature immersion.', order: 30 },
  { id: 'food-and-beverage', categoryId: 'Livelihood', name: 'Food & Beverage', description: 'Specialty cafes, restaurants, and experiential culinary retail environments.', order: 40 },
  { id: 'retail-and-lifestyle', categoryId: 'Livelihood', name: 'Retail & Lifestyle', description: 'Bespoke brand boutiques, concept stores, and commercial lifestyle spaces.', order: 50 },
  { id: 'workspaces', categoryId: 'Livelihood', name: 'Workspaces', description: 'Collaborative corporate offices, agile production studios, and tech headquarters.', order: 60 },
  { id: 'shared-spaces', categoryId: 'Community', name: 'Shared Spaces', description: 'Civic hubs, communal pavilions, and neighborhood activity center architecture.', order: 70 },
  { id: 'shared-places', categoryId: 'Community', name: 'Shared Places', description: 'Urban parks, multi-use public grounds, and pedestrian gathering places.', order: 80 },
  { id: 'sacred-structures', categoryId: 'Community', name: 'Sacred Structures', description: 'Chapels, contemplative sanctuaries, and heritage spiritual assemblies.', order: 90 },
];
lines.push(`INSERT INTO public.project_typologies (id, category_id, name, description, sort_order) VALUES`);
lines.push(typologies.map(t => `(${escapeSql(t.id)}, ${escapeSql(t.categoryId)}, ${escapeSql(t.name)}, ${escapeSql(t.description)}, ${t.order})`).join(',\n'));
lines.push(`ON CONFLICT (id) DO UPDATE SET category_id = EXCLUDED.category_id, name = EXCLUDED.name, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;`);
lines.push(``);

// 4. CONTRACT TYPES
lines.push(`-- 4. CONTRACT TYPES`);
const contractTypes = [
  { id: 'comprehensive-design', code: 'SCOPE-COMP-DESIGN', name: 'Comprehensive Design Services', tier: 'comprehensive', model: 'Design-Build (Turnkey)', desc: 'End-to-end design covering architectural, structural, MEPFS, and statutory permits.', order: 10 },
  { id: 'comprehensive-management', code: 'SCOPE-COMP-MGMT', name: 'Comprehensive Management Services', tier: 'comprehensive', model: 'Construction Management', desc: 'Critical path oversight, procurement direction, and subcontractor supervision.', order: 20 },
  { id: 'building-construction', code: 'SCOPE-BUILD-CONST', name: 'Building Construction Services', tier: 'construction', model: 'Turnkey Construction', desc: 'Ground-up general contracting, civil works, and turn-key structural execution.', order: 30 },
  { id: 'piecework-interiors', code: 'SCOPE-PIECE-INT', name: 'Architectural Interiors & Detailing', tier: 'piecework', model: 'Unit-Rate Deliverables', desc: 'Bespoke interior fit-out, joinery detailing, and material finish schedules.', order: 40 },
  { id: 'consultation-retainer', code: 'SCOPE-CONSULT-RETAIN', name: 'Consultation & Retainer Services', tier: 'consultation', model: 'Strategic Advisory Retainer', desc: 'Ongoing architectural consulting, portfolio feasibility, and client-rep audits.', order: 50 },
];
lines.push(`INSERT INTO public.contract_types (id, code, name, service_tier, contract_model, description, sort_order) VALUES`);
lines.push(contractTypes.map(c => `(${escapeSql(c.id)}, ${escapeSql(c.code)}, ${escapeSql(c.name)}, ${escapeSql(c.tier)}, ${escapeSql(c.model)}, ${escapeSql(c.desc)}, ${c.order})`).join(',\n'));
lines.push(`ON CONFLICT (id) DO UPDATE SET code = EXCLUDED.code, name = EXCLUDED.name, service_tier = EXCLUDED.service_tier, contract_model = EXCLUDED.contract_model, description = EXCLUDED.description, sort_order = EXCLUDED.sort_order;`);
lines.push(``);

// 5. ROLES
lines.push(`-- 5. ROLES`);
lines.push(`INSERT INTO public.roles (id, role_code, role_title, category, track_id, department, role_description, is_active, sort_order) VALUES`);
const roleValues = INITIAL_ROLES_DATA.map((r, idx) => {
  let trackId = 'PROF';
  if (r.id === 'role-int-ched') trackId = 'INTERN_CHED_240';
  else if (r.id === 'role-int-voc') trackId = 'INTERN_VOC';
  else if (r.id === 'role-app-ale') trackId = 'APPRENTICE_ALE_3840';
  else if (r.track === 'internship') trackId = 'INTERN_CHED_240';

  return `(${escapeSql(r.id)}, ${escapeSql(r.code || r.id)}, ${escapeSql(r.title)}, ${escapeSql(r.category)}, ${escapeSql(trackId)}, ${escapeSql(r.department || 'Studio General')}, ${escapeSql(r.description || '')}, ${r.isDraft ? 'FALSE' : 'TRUE'}, ${idx * 10})`;
}).join(',\n');
lines.push(roleValues);
lines.push(`ON CONFLICT (id) DO UPDATE SET role_code = EXCLUDED.role_code, role_title = EXCLUDED.role_title, category = EXCLUDED.category, track_id = EXCLUDED.track_id, department = EXCLUDED.department, role_description = EXCLUDED.role_description, is_active = EXCLUDED.is_active, sort_order = EXCLUDED.sort_order;`);
lines.push(``);

// Helper for splitting name into parts
function parseName(fullName: string): { first: string; middle: string | null; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], middle: null, last: '' };
  if (parts.length === 2) return { first: parts[0], middle: null, last: parts[1] };
  if (parts.length === 3) return { first: parts[0], middle: parts[1], last: parts[2] };
  // 4 or more parts, e.g. "Marchie Teodoro Borja", "John Dave Lacaba Aquino"
  return {
    first: parts.slice(0, parts.length - 2).join(' '),
    middle: parts[parts.length - 2],
    last: parts[parts.length - 1]
  };
}

// 6. PEOPLE
lines.push(`-- 6. PEOPLE (Studio Personnel & Directory)`);
lines.push(`INSERT INTO public.people (`);
lines.push(`    id, first_name, middle_name, last_name, pseudonym, pronouns, titles,`);
lines.push(`    primary_role_id, track_id, categories, professional_license_title, license_number,`);
lines.push(`    personal_email, contact_number, portfolio_url, short_bio, full_bio, profile_photo_url,`);
lines.push(`    date_of_hiring, date_of_separation, is_currently_hired, is_draft, display_order`);
lines.push(`) VALUES`);

const memberRows = MEMBERS_DATA.map((m, idx) => {
  const nameParts = parseName(m.name);
  let title = 'Arch.';
  let licenseTitle = 'RLA';
  let licenseNo = m.license || null;
  let pronouns = 'He/Him';

  if (m.id === 'marchie-borja') {
    title = 'Arch.';
    licenseTitle = 'RLA';
    pronouns = 'He/Him';
  } else if (m.id === 'jhoanna-ramos') {
    title = 'Ms.';
    licenseTitle = 'Corporate Treasurer & Partner';
    pronouns = 'She/Her';
  } else if (m.id === 'adrian-mores') {
    title = 'Arch. / RMP';
    licenseTitle = 'RLA / RMP';
    pronouns = 'He/Him';
  } else if (m.id === 'nikka-oliveros' || m.id === 'patricia-yumang' || m.id === 'andrea-fernandez') {
    title = 'Arch.';
    licenseTitle = 'RLA';
    pronouns = 'She/Her';
  } else if (m.id === 'maria-santos') {
    title = 'IDr.';
    licenseTitle = 'LID';
    pronouns = 'She/Her';
  } else if (m.id === 'christian-alipio' || m.id === 'rafael-bautista') {
    title = 'Engr.';
    licenseTitle = 'RCE';
    pronouns = 'He/Him';
  } else if (m.id === 'mark-ramos' || m.id === 'miguel-torres') {
    title = 'Mr.';
    pronouns = 'He/Him';
  } else if (m.id === 'hannah-villanueva' || m.id === 'kristelle-del-rosario') {
    title = 'Ms.';
    pronouns = 'She/Her';
  }

  // Find a matching primary role
  const primaryRole = INITIAL_ROLES_DATA.find(r => r.title.toLowerCase().includes(m.role.toLowerCase()) || m.role.toLowerCase().includes(r.title.toLowerCase()));
  const primaryRoleId = primaryRole ? primaryRole.id : 'role-hrdt-07';

  // Hiring date stagger for realism
  const hireYear = 2020 + (idx % 4);
  const hireDate = `${hireYear}-0${(idx % 9) + 1}-15`;

  return `(` +
    `${escapeSql(m.id)}, ` +
    `${escapeSql(nameParts.first)}, ` +
    `${escapeSql(nameParts.middle)}, ` +
    `${escapeSql(nameParts.last)}, ` +
    `${escapeSql(nameParts.first)}, ` +
    `${escapeSql(pronouns)}, ` +
    `${escapeSql(title)}, ` +
    `${escapeSql(primaryRoleId)}, ` +
    `'PROF', ` +
    `${escapeTextArray(m.categories)}, ` +
    `${escapeSql(licenseTitle)}, ` +
    `${escapeSql(licenseNo)}, ` +
    `${escapeSql(`${m.id}@atbpcollaborative.com`)}, ` +
    `'+63 917 123 4567', ` +
    `${escapeSql(`https://portfolio.atbpcollaborative.com/${m.id}`)}, ` +
    `${escapeSql(m.bio)}, ` +
    `${escapeSql(m.fullBio)}, ` +
    `${escapeSql(m.image)}, ` +
    `'${hireDate}'::date, ` +
    `NULL, ` +
    `TRUE, ` +
    `${m.isDraft ? 'TRUE' : 'FALSE'}, ` +
    `${idx * 10}` +
  `)`;
}).join(',\n');

lines.push(memberRows);
lines.push(`ON CONFLICT (id) DO UPDATE SET `);
lines.push(`    first_name = EXCLUDED.first_name, middle_name = EXCLUDED.middle_name, last_name = EXCLUDED.last_name,`);
lines.push(`    pseudonym = EXCLUDED.pseudonym, pronouns = EXCLUDED.pronouns, titles = EXCLUDED.titles,`);
lines.push(`    primary_role_id = EXCLUDED.primary_role_id, track_id = EXCLUDED.track_id, categories = EXCLUDED.categories,`);
lines.push(`    professional_license_title = EXCLUDED.professional_license_title, license_number = EXCLUDED.license_number,`);
lines.push(`    personal_email = EXCLUDED.personal_email, contact_number = EXCLUDED.contact_number, portfolio_url = EXCLUDED.portfolio_url,`);
lines.push(`    short_bio = EXCLUDED.short_bio, full_bio = EXCLUDED.full_bio, profile_photo_url = EXCLUDED.profile_photo_url,`);
lines.push(`    date_of_hiring = EXCLUDED.date_of_hiring, is_currently_hired = EXCLUDED.is_currently_hired, is_draft = EXCLUDED.is_draft, display_order = EXCLUDED.display_order, updated_at = NOW();`);
lines.push(``);

// 7. PERSON CREDENTIALS
lines.push(`-- 7. PERSON CREDENTIALS`);
const credentialRows: string[] = [];
MEMBERS_DATA.forEach(m => {
  if (m.affiliations && m.affiliations.length > 0) {
    m.affiliations.forEach((aff, aIdx) => {
      credentialRows.push(`(${escapeSql(m.id)}, ${escapeSql(aff.title)}, ${escapeSql(aff.description)}, ${aIdx * 10})`);
    });
  }
});
if (credentialRows.length > 0) {
  lines.push(`INSERT INTO public.person_credentials (person_id, title, description, sort_order) VALUES`);
  lines.push(credentialRows.join(',\n') + ';');
}
lines.push(``);

// Helper for mapping typology ID
function getTypologyId(catName: string): string {
  const norm = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  if (norm.includes('tiny')) return 'tiny-living';
  if (norm.includes('multi') || norm.includes('generational')) return 'multi-generational';
  if (norm.includes('vacation')) return 'vacation-homes';
  if (norm.includes('food') || norm.includes('beverage')) return 'food-and-beverage';
  if (norm.includes('retail') || norm.includes('lifestyle')) return 'retail-and-lifestyle';
  if (norm.includes('workspaces') || norm.includes('workspace')) return 'workspaces';
  if (norm.includes('shared-spaces') || norm.includes('space')) return 'shared-spaces';
  if (norm.includes('shared-places') || norm.includes('place')) return 'shared-places';
  if (norm.includes('sacred')) return 'sacred-structures';
  return 'multi-generational';
}

function parseAreaSqm(areaStr: string | undefined): number {
  if (!areaStr) return 200;
  const match = areaStr.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 200;
}

// 8. PROJECTS
lines.push(`-- 8. PROJECTS (Works Portfolio)`);
lines.push(`INSERT INTO public.projects (`);
lines.push(`    id, project_code, project_title, year, category_id, typology_id, contract_type_id,`);
lines.push(`    client_type, status, location_name, address_details, coordinates, floor_area_sqm,`);
lines.push(`    property_area_type, duration, materials, description, full_writeup, youtube_video_url,`);
lines.push(`    is_featured, is_draft, sort_order`);
lines.push(`) VALUES`);

const projectRows = PROJECTS_DATA.map((p, idx) => {
  const code = `PRJ-${p.year || '2024'}-${String(idx + 1).padStart(3, '0')}`;
  const categoryId = p.mainCategory || 'Shelter';
  const typologyId = getTypologyId(p.subcategory || p.category || '');
  const areaSqm = parseAreaSqm(p.specs?.area);
  const materials = p.specs?.materials || ['Concrete', 'Wood', 'Steel', 'Glass'];
  const duration = p.specs?.duration || '12 Months';

  return `(` +
    `${escapeSql(p.id)}, ` +
    `${escapeSql(code)}, ` +
    `${escapeSql(p.title)}, ` +
    `${escapeSql(p.year || '2024')}, ` +
    `${escapeSql(categoryId)}, ` +
    `${escapeSql(typologyId)}, ` +
    `'comprehensive-design', ` +
    `${escapeSql(p.clientType || 'Mid-Income')}, ` +
    `${escapeSql(p.status || 'ongoing')}, ` +
    `${escapeSql(p.location || 'Metro Manila, Philippines')}, ` +
    `'{"regionName":"National Capital Region","cityName":"Metro Manila","country":"Philippines"}'::jsonb, ` +
    `'{"lat": 14.5995, "lng": 120.9842}'::jsonb, ` +
    `${areaSqm}, ` +
    `'tua', ` +
    `${escapeSql(duration)}, ` +
    `${escapeTextArray(materials)}, ` +
    `${escapeSql(p.description)}, ` +
    `${escapeSql(p.fullWriteup)}, ` +
    `${escapeSql(p.video || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ')}, ` +
    `${idx < 5 ? 'TRUE' : 'FALSE'}, ` +
    `${p.isDraft ? 'TRUE' : 'FALSE'}, ` +
    `${idx * 10}` +
  `)`;
}).join(',\n');

lines.push(projectRows);
lines.push(`ON CONFLICT (id) DO UPDATE SET `);
lines.push(`    project_code = EXCLUDED.project_code, project_title = EXCLUDED.project_title, year = EXCLUDED.year,`);
lines.push(`    category_id = EXCLUDED.category_id, typology_id = EXCLUDED.typology_id, contract_type_id = EXCLUDED.contract_type_id,`);
lines.push(`    client_type = EXCLUDED.client_type, status = EXCLUDED.status, location_name = EXCLUDED.location_name,`);
lines.push(`    floor_area_sqm = EXCLUDED.floor_area_sqm, property_area_type = EXCLUDED.property_area_type, duration = EXCLUDED.duration,`);
lines.push(`    materials = EXCLUDED.materials, description = EXCLUDED.description, full_writeup = EXCLUDED.full_writeup,`);
lines.push(`    youtube_video_url = EXCLUDED.youtube_video_url, is_featured = EXCLUDED.is_featured, is_draft = EXCLUDED.is_draft, sort_order = EXCLUDED.sort_order, updated_at = NOW();`);
lines.push(``);

// 9. PROJECT MEDIA
lines.push(`-- 9. PROJECT MEDIA`);
const mediaRows: string[] = [];
PROJECTS_DATA.forEach(p => {
  if (p.images && p.images.length > 0) {
    p.images.forEach((imgUrl, mIdx) => {
      mediaRows.push(`(${escapeSql(p.id)}, 'image', ${escapeSql(imgUrl)}, ${escapeSql(`${p.title} - View ${mIdx + 1}`)}, ${mIdx === 0 ? 'TRUE' : 'FALSE'}, ${mIdx * 10})`);
    });
  }
  if (p.video) {
    mediaRows.push(`(${escapeSql(p.id)}, 'video', ${escapeSql(p.video)}, ${escapeSql(`${p.title} - Video Tour`)}, FALSE, 999)`);
  }
});
if (mediaRows.length > 0) {
  lines.push(`INSERT INTO public.project_media (project_id, media_type, url, caption, is_cover, sort_order) VALUES`);
  lines.push(mediaRows.join(',\n') + ';');
}
lines.push(``);

// 10. PROJECT CONTRIBUTORS (Involvements)
lines.push(`-- 10. PROJECT CONTRIBUTORS`);
const contributorRows: string[] = [];
const seenPairs = new Set<string>();

MEMBERS_DATA.forEach(m => {
  if (m.involvement && m.involvement.length > 0) {
    m.involvement.forEach(inv => {
      // Find matching project
      const matchedProject = PROJECTS_DATA.find(p => p.id === inv.projectId || p.title.toLowerCase() === inv.projectTitle.toLowerCase());
      const targetProjectId = matchedProject ? matchedProject.id : inv.projectId;
      const pairKey = `${targetProjectId}_${m.id}`;

      // Check if project exists in PROJECTS_DATA
      const projectExists = PROJECTS_DATA.some(p => p.id === targetProjectId);
      if (projectExists && !seenPairs.has(pairKey)) {
        seenPairs.add(pairKey);
        contributorRows.push(`(${escapeSql(targetProjectId)}, ${escapeSql(m.id)}, ${escapeSql(inv.roleInProject)}, ${escapeSql(inv.description)}, 0)`);
      }
    });
  }
});

if (contributorRows.length > 0) {
  lines.push(`INSERT INTO public.project_contributors (project_id, person_id, role_in_project, contribution_narrative, sort_order) VALUES`);
  lines.push(contributorRows.join(',\n'));
  lines.push(`ON CONFLICT (project_id, person_id) DO UPDATE SET `);
  lines.push(`    role_in_project = EXCLUDED.role_in_project, contribution_narrative = EXCLUDED.contribution_narrative;`);
}
lines.push(``);

// 11. SITE SETTINGS
lines.push(`-- 11. SITE SETTINGS`);
lines.push(`INSERT INTO public.site_settings (key, content) VALUES`);
lines.push(`('contact_info', ${escapeJson(CONTACT_INFO)}),`);
lines.push(`('privacy_policy', ${escapeJson(privacyPolicyModalData.contents)}),`);
lines.push(`('legal_notices', ${escapeJson(legalModalData.contents)}),`);
lines.push(`('studio_writeups', ${escapeJson({
  tagline: 'Designing with Values. Building with Culture. Managing with Integrity.',
  subSlogan: 'A Philippine architectural and design-build practice dedicated to cultural truth, spatial poetry, and structural honesty.',
  philosophy: 'ATBP Collaborative operates under the licensed architectural practice of Architect Marchie Teodoro Borja. We champion honest construction standards, non-hidden markups, and contextual architecture suited to the Philippine climate and socio-economic landscape.',
  cultureStatement: 'From indigenous vernacular tectonics to contemporary tropical minimalism, our works celebrate local craftsmanship, passive cooling, and enduring craftsmanship.'
})})`);
lines.push(`ON CONFLICT (key) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW();`);

const outPath = path.resolve(process.cwd(), 'supabase', 'seed_new.sql');
fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
console.log('Successfully generated seed_new.sql at:', outPath);
