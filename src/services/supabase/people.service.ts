import { supabasePublic } from '@/lib/supabase/public';
import { Member } from '@/types';

function formatFullName(first: string, middle: string | null | undefined, last: string): string {
  if (middle && middle.trim().length > 0) {
    return `${first.trim()} ${middle.trim()} ${last.trim()}`;
  }
  return `${first.trim()} ${last.trim()}`;
}

export async function getPeopleFromSupabase(includeDrafts: boolean = false): Promise<Member[]> {
  let query = supabasePublic
    .from('people')
    .select(`
      *,
      credentials:person_credentials(*),
      involvements:project_contributors(
        *,
        project:projects(id, slug, project_title)
      )
    `)
    .order('display_order', { ascending: true });

  if (!includeDrafts) {
    query = query.eq('is_draft', false);
  }

  const { data: people, error } = await query;

  if (error || !people) {
    console.error('Error fetching people from Supabase:', error?.message || error?.details || error || 'No people found');
    throw error || new Error('No people found');
  }

  return people.map((p: any): Member => {
    const affiliations = (p.credentials || [])
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
      .map((c: any) => ({
        title: c.title,
        description: c.description || '',
      }));

    const involvement = (p.involvements || []).map((inv: any) => ({
      projectId: inv.project_id,
      projectSlug: inv.project?.slug || inv.project_id,
      projectTitle: inv.project?.project_title || inv.project_id,
      roleInProject: inv.role_in_project,
      projectRoleIds: inv.project_role_ids || [],
      description: inv.contribution_narrative || '',
    }));

    return {
      id: p.id,
      name: formatFullName(p.first_name, p.middle_name, p.last_name),
      firstName: p.first_name,
      middleName: p.middle_name,
      lastName: p.last_name,
      pseudonym: p.pseudonym,
      pronouns: p.pronouns,
      titles: p.titles,
      role: p.titles ? `${p.titles} ${p.last_name}` : p.last_name,
      roles: p.other_role_ids || [],
      otherRoleIds: p.other_role_ids || [],
      primaryRoleId: p.primary_role_id || undefined,
      trackId: p.track_id || 'PROF',
      license: p.license_number || p.professional_license_title || undefined,
      professionalLicenseTitle: p.professional_license_title,
      licenseNumber: p.license_number,
      image: p.profile_photo_url,
      bio: p.short_bio,
      fullBio: p.full_bio,
      personalEmail: p.personal_email,
      contactNumber: p.contact_number,
      addressDetails: p.address_details || undefined,
      portfolioUrl: p.portfolio_url,
      externalUrl: p.external_url || undefined,
      dateOfHiring: p.date_of_hiring,
      dateOfSeparation: p.date_of_separation,
      isCurrentlyHired: p.is_currently_hired,
      affiliations,
      categories: p.categories || [],
      involvement,
      isDraft: p.is_draft,
      displayOrder: p.display_order,
    };
  });
}

export async function getPersonByIdFromSupabase(id: string): Promise<Member | null> {
    const { data: p, error } = await supabasePublic
    .from('people')
    .select(`
      *,
      credentials:person_credentials(*),
      involvements:project_contributors(
        *,
        project:projects(id, slug, project_title)
      )
    `)
    .eq('id', id)
    .single();

  if (error || !p) {
    if (error?.code !== 'PGRST116') {
      console.error(`Error fetching person ${id} from Supabase:`, error);
    }
    return null;
  }

  const affiliations = (p.credentials || [])
    .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
    .map((c: any) => ({
      title: c.title,
      description: c.description || '',
    }));

  const involvement = (p.involvements || []).map((inv: any) => ({
    projectId: inv.project_id,
    projectSlug: inv.project?.slug || inv.project_id,
    projectTitle: inv.project?.project_title || inv.project_id,
    roleInProject: inv.role_in_project,
    projectRoleIds: inv.project_role_ids || [],
    description: inv.contribution_narrative || '',
  }));

  return {
    id: p.id,
    name: formatFullName(p.first_name, p.middle_name, p.last_name),
    firstName: p.first_name,
    middleName: p.middle_name,
    lastName: p.last_name,
    pseudonym: p.pseudonym,
    pronouns: p.pronouns,
    titles: p.titles,
    role: p.titles ? `${p.titles} ${p.last_name}` : p.last_name,
    roles: p.other_role_ids || [],
    otherRoleIds: p.other_role_ids || [],
    primaryRoleId: p.primary_role_id || undefined,
    trackId: p.track_id || 'PROF',
    license: p.license_number || p.professional_license_title || undefined,
    professionalLicenseTitle: p.professional_license_title,
    licenseNumber: p.license_number,
    image: p.profile_photo_url,
    bio: p.short_bio,
    fullBio: p.full_bio,
    personalEmail: p.personal_email,
    contactNumber: p.contact_number,
    addressDetails: p.address_details || undefined,
    portfolioUrl: p.portfolio_url,
    externalUrl: p.external_url || undefined,
    dateOfHiring: p.date_of_hiring,
    dateOfSeparation: p.date_of_separation,
    isCurrentlyHired: p.is_currently_hired,
    affiliations,
    categories: p.categories || [],
    involvement,
    isDraft: p.is_draft,
    displayOrder: p.display_order,
  };
}
