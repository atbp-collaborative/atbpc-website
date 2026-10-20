import { supabasePublic } from '@/lib/supabase/public';
import { Project } from '@/types';
import { isUuid, generateProjectSlug, getTypologyName } from '@/lib/projects/project-helpers';

/**
 * Transforms a raw Supabase project row into a strongly typed Project entity.
 * Centralized mapping ensures consistency across all queries (DRY).
 */
export function mapProjectRecord(p: any): Project {
  const images = (p.media || [])
    .filter((m: any) => m.media_type === 'image')
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((m: any) => m.url);

  const videoMedia = (p.media || []).find((m: any) => m.media_type === 'video');
  const videoUrl = p.youtube_video_url || videoMedia?.url || undefined;

  const typologyName = p.typology?.name || (p.typology_id ? getTypologyName(p.typology_id) : 'Multi-Generational');
  const categoryName = p.category?.name || p.category_id || 'Shelter';

  // Ensure slug is human-readable and never a UUID
  const slug = p.slug || (!isUuid(p.id) ? p.id : generateProjectSlug(p.project_title, p.year));

  const contributors = (p.contributors || []).map((c: any) => ({
    id: c.id,
    projectId: c.project_id || p.id,
    memberId: c.person_id,
    memberName: c.person ? `${c.person.first_name || ''} ${c.person.last_name || ''}`.trim() : c.person_id,
    memberRole: c.role_in_project,
    memberImage: c.person?.profile_photo_url || '',
    roleInProject: c.role_in_project,
    description: c.contribution_narrative || '',
    sortOrder: c.sort_order ?? 0,
  }));

  return {
    id: p.id,
    slug,
    projectCode: p.project_code || undefined,
    title: p.project_title,
    category: typologyName,
    categoryId: p.category_id || undefined,
    typologyId: p.typology_id || undefined,
    contractTypeId: p.contract_type_id || undefined,
    mainCategory: categoryName,
    subcategory: typologyName,
    location: p.location_name,
    year: p.year,
    clientType: p.client_type,
    description: p.description,
    fullWriteup: p.full_writeup,
    images: images.length > 0 ? images : ['/images/hero_modern_villa_1783495183350.jpg'],
    video: videoUrl,
    status: p.status,
    isDraft: p.is_draft,
    floorAreaSqm: p.floor_area_sqm != null ? Number(p.floor_area_sqm) : undefined,
    specs: {
      area: p.floor_area_sqm ? `${p.floor_area_sqm} sqm` : '200 sqm',
      scope: p.contract?.name || 'Comprehensive Architectural & Interior Design',
      duration: p.duration || '12 Months',
      materials: p.materials || ['Concrete', 'Wood', 'Steel', 'Glass'],
    },
    contributors,
  };
}

export const PROJECT_SELECT_QUERY = `
  *,
  media:project_media(*),
  category:project_categories(id, name),
  typology:project_typologies(id, name),
  contract:contract_types(id, name),
  contributors:project_contributors(
    id,
    project_id,
    person_id,
    role_in_project,
    contribution_narrative,
    sort_order,
    person:people(id, first_name, last_name, profile_photo_url, primary_role_id)
  )
`;

export async function getProjectsFromSupabase(includeDrafts: boolean = false): Promise<Project[]> {
  let query = supabasePublic
    .from('projects')
    .select(PROJECT_SELECT_QUERY)
    .order('sort_order', { ascending: true });

  if (!includeDrafts) {
    query = query.eq('is_draft', false);
  }

  const { data: projects, error } = await query;

  if (error || !projects) {
    console.error('Error fetching projects from Supabase:', error?.message || error?.details || error || 'No projects found');
    throw error || new Error('No projects found');
  }

  return projects.map(mapProjectRecord);
}

export async function getProjectByIdFromSupabase(identifier: string): Promise<Project | null> {
  const isInputUuid = isUuid(identifier);

  let p: any = null;

  if (isInputUuid) {
    // Direct UUID lookup on primary key
    const { data, error } = await supabasePublic
      .from('projects')
      .select(PROJECT_SELECT_QUERY)
      .eq('id', identifier)
      .maybeSingle();

    if (!error && data) {
      p = data;
    }
  }

  // If not found yet, query by slug column (or fallback to id if legacy text ID)
  if (!p) {
    // 1. Try slug query
    const { data: bySlug, error: slugErr } = await supabasePublic
      .from('projects')
      .select(PROJECT_SELECT_QUERY)
      .eq('slug', identifier)
      .maybeSingle();

    if (!slugErr && bySlug) {
      p = bySlug;
    } else {
      // 2. Fallback to id query (handles database where slug column is not yet present, or legacy text primary key)
      const { data: byId } = await supabasePublic
        .from('projects')
        .select(PROJECT_SELECT_QUERY)
        .eq('id', identifier)
        .maybeSingle();

      if (byId) {
        p = byId;
      }
    }
  }

  if (!p) {
    return null;
  }

  return mapProjectRecord(p);
}
