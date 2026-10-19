import { supabasePublic } from '@/lib/supabase/public';
import { Project } from '@/types';

export async function getProjectsFromSupabase(includeDrafts: boolean = false): Promise<Project[]> {
  let query = supabasePublic
    .from('projects')
    .select(`
      *,
      media:project_media(*),
      category:project_categories(id, name),
      typology:project_typologies(id, name),
      contract:contract_types(id, name)
    `)
    .order('sort_order', { ascending: true });

  if (!includeDrafts) {
    query = query.eq('is_draft', false);
  }

  const { data: projects, error } = await query;

  if (error || !projects) {
    console.error('Error fetching projects from Supabase:', error);
    throw error || new Error('No projects found');
  }

  return projects.map((p: any): Project => {
    const images = (p.media || [])
      .filter((m: any) => m.media_type === 'image')
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((m: any) => m.url);

    const videoMedia = (p.media || []).find((m: any) => m.media_type === 'video');
    const videoUrl = p.youtube_video_url || videoMedia?.url || undefined;

    const typologyName = p.typology?.name || p.typology_id || 'Multi-Generational';
    const categoryName = p.category?.name || p.category_id || 'Shelter';

    return {
      id: p.id,
      title: p.project_title,
      category: typologyName,
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
      specs: {
        area: p.floor_area_sqm ? `${p.floor_area_sqm} sqm` : '200 sqm',
        scope: p.contract?.name || 'Comprehensive Architectural & Interior Design',
        duration: p.duration || '12 Months',
        materials: p.materials || ['Concrete', 'Wood', 'Steel', 'Glass'],
      },
    };
  });
}

export async function getProjectByIdFromSupabase(id: string): Promise<Project | null> {
  const { data: p, error } = await supabasePublic
    .from('projects')
    .select(`
      *,
      media:project_media(*),
      category:project_categories(id, name),
      typology:project_typologies(id, name),
      contract:contract_types(id, name)
    `)
    .eq('id', id)
    .single();

  if (error || !p) {
    if (error?.code !== 'PGRST116') {
      console.error(`Error fetching project ${id} from Supabase:`, error);
    }
    return null;
  }

  const images = (p.media || [])
    .filter((m: any) => m.media_type === 'image')
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((m: any) => m.url);

  const videoMedia = (p.media || []).find((m: any) => m.media_type === 'video');
  const videoUrl = p.youtube_video_url || videoMedia?.url || undefined;

  const typologyName = p.typology?.name || p.typology_id || 'Multi-Generational';
  const categoryName = p.category?.name || p.category_id || 'Shelter';

  return {
    id: p.id,
    title: p.project_title,
    category: typologyName,
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
    specs: {
      area: p.floor_area_sqm ? `${p.floor_area_sqm} sqm` : '200 sqm',
      scope: p.contract?.name || 'Comprehensive Architectural & Interior Design',
      duration: p.duration || '12 Months',
      materials: p.materials || ['Concrete', 'Wood', 'Steel', 'Glass'],
    },
  };
}
