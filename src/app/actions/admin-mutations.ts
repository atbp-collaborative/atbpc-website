/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';
import {
  Member,
  MemberInvolvement,
  Project,
  Role,
  ProjectRole,
  SitePage,
  NavigationCardItem,
  ProcessPhilosophy,
  StageGroup,
  ProcessStageItem,
  ServiceOffering,
  ServiceAccordionItem,
  HomeSlideItem,
  HomepageSlogans,
} from '@/types';
import {
  isUuid,
  generateProjectSlug,
  normalizeCategoryId,
  normalizeTypologyId,
  normalizeContractTypeId,
} from '@/lib/projects/project-helpers';
import { getFallbackSitePages } from '@/services/supabase/cms.service';
import { optimizeImageBuffer } from '@/lib/images/server-image-optimizer';
import { mapPersonRecord } from '@/services/supabase/people.service';
import { mapProjectRecord, PROJECT_SELECT_QUERY } from '@/services/supabase/projects.service';

// ==============================================================================
// 1. PEOPLE MUTATIONS & QUERIES
// ==============================================================================

export async function fetchAdminPeopleAction(): Promise<Member[]> {
  try {
    const supabase = getAdminClient();
    const { data: people, error } = await supabase
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

    if (error || !people) {
      console.error('[fetchAdminPeopleAction] Error:', error);
      return [];
    }

    return people.map(mapPersonRecord);
  } catch (err) {
    console.error('[fetchAdminPeopleAction] Exception:', err);
    return [];
  }
}

export async function fetchAdminProjectsAction(): Promise<Project[]> {
  try {
    const supabase = getAdminClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select(PROJECT_SELECT_QUERY)
      .order('sort_order', { ascending: true });

    if (error || !projects) {
      console.error('[fetchAdminProjectsAction] Error:', error);
      return [];
    }

    return projects.map(mapProjectRecord);
  } catch (err) {
    console.error('[fetchAdminProjectsAction] Exception:', err);
    return [];
  }
}

export async function savePersonAction(member: Member) {
  try {
    const supabase = getAdminClient();

    const firstName = (member.firstName || member.name.split(' ')[0] || 'Team').trim();
    const middleName = member.middleName ? member.middleName.trim() : null;
    const lastName = (member.lastName || member.name.split(' ').slice(1).join(' ') || 'Member').trim();

    const id =
      member.id ||
      `${firstName}-${lastName}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const defaultAvatar =
      'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/avatars/avatar_placeholder.jpg';

    const shortBio = member.bio || member.fullBio || 'Member of ATBP Collaborative.';
    const fullBio = member.fullBio || member.bio || 'Member of ATBP Collaborative.';
    let profilePhotoUrl =
      member.image ||
      (member as any).photoUrl ||
      (member as any).avatar ||
      defaultAvatar;

    if (profilePhotoUrl && profilePhotoUrl.startsWith('data:image/')) {
      profilePhotoUrl = await uploadBase64ToStorage(profilePhotoUrl, id, 0, 'people');
    }

    const personPayload = {
      id,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      pseudonym: member.pseudonym || null,
      pronouns: member.pronouns || null,
      titles: member.titles || null,
      primary_role_id: member.primaryRoleId || (member.roles && member.roles[0]) || null,
      other_role_ids: member.otherRoleIds || member.roles || [],
      track_id: member.trackId || null,
      categories: member.categories && member.categories.length > 0 ? member.categories : ['designers'],
      professional_license_title: member.professionalLicenseTitle || null,
      license_number: member.licenseNumber || (member.license && !isNaN(Number(member.license)) ? member.license : null),
      personal_email: member.personalEmail || null,
      contact_number: member.contactNumber || null,
      address_details: member.addressDetails || {},
      portfolio_url: member.portfolioUrl || null,
      external_url: member.externalUrl || null,
      short_bio: shortBio,
      full_bio: fullBio,
      profile_photo_url: profilePhotoUrl,
      date_of_hiring: member.dateOfHiring || new Date().toISOString().split('T')[0],
      date_of_separation: member.dateOfSeparation || null,
      is_currently_hired: member.isCurrentlyHired !== false,
      is_draft: member.isCurrentlyHired === false ? true : Boolean(member.isDraft),
      display_order: member.displayOrder ?? 99,
      updated_at: new Date().toISOString(),
    };

    const { error: personError } = await supabase.from('people').upsert(personPayload);

    if (personError) {
      console.error('[savePersonAction] Supabase people error:', personError);
      return { success: false, error: personError.message };
    }

    // Sync Credentials / Affiliations if provided
    if (member.affiliations && Array.isArray(member.affiliations)) {
      await supabase.from('person_credentials').delete().eq('person_id', id);

      if (member.affiliations.length > 0) {
        const credsToInsert = member.affiliations.map((aff, idx) => ({
          person_id: id,
          title: aff.title,
          description: aff.description || '',
          sort_order: idx + 1,
        }));
        await supabase.from('person_credentials').insert(credsToInsert);
      }
    }

    // Sync Project Involvements / Contributors if provided
    if (member.involvement && Array.isArray(member.involvement)) {
      await supabase.from('project_contributors').delete().eq('person_id', id);

      const validInvolvements = member.involvement.filter((inv) => inv.projectId);
      if (validInvolvements.length > 0) {
        const invsToInsert = validInvolvements.map((inv, idx) => ({
          person_id: id,
          project_id: inv.projectId,
          role_in_project: inv.roleInProject || 'Contributor',
          project_role_ids: inv.projectRoleIds || [],
          contribution_narrative: inv.description || '',
          sort_order: idx + 1,
        }));
        await supabase.from('project_contributors').insert(invsToInsert);
      }
    }

    // Trigger instant ISR revalidation across relevant paths
    revalidatePath('/studio/our-people');
    revalidatePath('/studio/our-people/[category]', 'page');
    revalidatePath('/studio/our-people/[category]/[slug]', 'page');
    revalidatePath('/admin/people');
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: {
        ...member,
        id,
        firstName,
        middleName: middleName || undefined,
        lastName,
        image: profilePhotoUrl,
        bio: shortBio,
        fullBio,
      },
    };
  } catch (err: any) {
    console.error('[savePersonAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save person' };
  }
}

export async function deletePersonAction(id: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('people').delete().eq('id', id);

    if (error) {
      console.error('[deletePersonAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-people');
    revalidatePath('/admin/people');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[deletePersonAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete person' };
  }
}

export async function togglePersonDraftAction(id: string, isDraft: boolean) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from('people')
      .update({ is_draft: isDraft, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[togglePersonDraftAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-people');
    revalidatePath('/admin/people');
    revalidatePath('/', 'layout');

    return { success: true, isDraft };
  } catch (err: any) {
    console.error('[togglePersonDraftAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to toggle draft status' };
  }
}

export async function updatePersonInvolvementsAction(personId: string, involvements: MemberInvolvement[]) {
  try {
    const supabase = getAdminClient();

    // 1. Delete existing contributors for this person
    const { error: deleteError } = await supabase
      .from('project_contributors')
      .delete()
      .eq('person_id', personId);

    if (deleteError) {
      console.error('[updatePersonInvolvementsAction] Delete error:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // 2. Insert new involvements if any
    const validInvolvements = (involvements || []).filter((inv) => inv.projectId);
    if (validInvolvements.length > 0) {
      const invsToInsert = validInvolvements.map((inv, idx) => ({
        person_id: personId,
        project_id: inv.projectId,
        role_in_project: inv.roleInProject || 'Contributor',
        project_role_ids: inv.projectRoleIds || [],
        contribution_narrative: inv.description || '',
        sort_order: idx + 1,
      }));

      const { error: insertError } = await supabase
        .from('project_contributors')
        .insert(invsToInsert);

      if (insertError) {
        console.error('[updatePersonInvolvementsAction] Insert error:', insertError);
        return { success: false, error: insertError.message };
      }
    }

    // 3. Revalidate paths
    revalidatePath('/studio/our-people');
    revalidatePath('/studio/our-people/[category]', 'page');
    revalidatePath('/studio/our-people/[category]/[slug]', 'page');
    revalidatePath('/admin/roles');
    revalidatePath('/admin/people');
    revalidatePath('/admin/projects');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[updatePersonInvolvementsAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to update involvements' };
  }
}

// ==============================================================================
// ==============================================================================
// 2. PROJECTS MUTATIONS & MEDIA UPLOADS
// ==============================================================================

/**
 * Uploads a file to Supabase Storage bucket 'portfolio-media' under the designated folder (default: projects/)
 * Automatically auto-orients, downscales, and optimizes images using Sharp to efficient WebP.
 */
export async function uploadProjectMediaAction(formData: FormData) {
  try {
    const file = formData.get('file') as File | null;
    if (!file) {
      return { success: false, error: 'No file provided for upload' };
    }

    const folderParam = (formData.get('folder') as string | null) || 'projects';
    const cleanFolder = ['projects', 'people', 'categories', 'cms'].includes(folderParam)
      ? folderParam
      : 'projects';

    const supabase = getAdminClient();
    const arrayBuffer = await file.arrayBuffer();
    const rawBuffer = Buffer.from(arrayBuffer);

    // Automatically optimize, downscale to max 1920x1920, and convert to WebP
    const optimized = await optimizeImageBuffer(rawBuffer, file.type);
    const storagePath = `${cleanFolder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${optimized.ext}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-media')
      .upload(storagePath, optimized.buffer, {
        contentType: optimized.contentType,
        upsert: true,
        cacheControl: '31536000, public, immutable',
      });

    if (uploadError) {
      console.error('[uploadProjectMediaAction] Supabase storage upload error:', uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath);
    return { success: true, url: data.publicUrl };
  } catch (err: any) {
    console.error('[uploadProjectMediaAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to upload media to storage' };
  }
}

/**
 * Fallback helper to automatically upload base64 image data URLs directly to Supabase Storage,
 * ensuring no base64 payloads ever get written into Postgres or localStorage.
 */
async function uploadBase64ToStorage(
  dataUrl: string,
  targetId: string,
  idx: number,
  folder: string = 'projects'
): Promise<string> {
  if (!dataUrl.startsWith('data:image/')) return dataUrl;

  try {
    const supabase = getAdminClient();
    const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) return dataUrl;

    const extRaw = matches[1].toLowerCase();
    const base64Data = matches[2];
    const rawBuffer = Buffer.from(base64Data, 'base64');
    const optimized = await optimizeImageBuffer(rawBuffer, `image/${extRaw}`);

    const cleanFolder = ['projects', 'people', 'categories', 'cms'].includes(folder)
      ? folder
      : 'projects';
    const storagePath = `${cleanFolder}/${targetId}/${Date.now()}-${idx}.${optimized.ext}`;

    const { error } = await supabase.storage.from('portfolio-media').upload(storagePath, optimized.buffer, {
        contentType: optimized.contentType,
        upsert: true,
        cacheControl: '31536000, public, immutable',
      });

    if (!error) {
      const { data } = supabase.storage.from('portfolio-media').getPublicUrl(storagePath);
      return data.publicUrl;
    }
    console.error('[uploadBase64ToStorage] Upload error:', error);
  } catch (err) {
    console.error('[uploadBase64ToStorage] Exception:', err);
  }
  return dataUrl;
}

export async function saveProjectAction(project: Project) {
  try {
    const supabase = getAdminClient();

    // 1. Maintain UUID Primary Key
    const isExistingUuid = isUuid(project.id);
    const isTempId = !project.id || project.id.startsWith('project-');
    const id = isExistingUuid ? project.id : isTempId ? crypto.randomUUID() : project.id;

    // 2. Generate or preserve a clean, human-readable slug (guaranteed never a UUID)
    const slug = generateProjectSlug(project.slug || project.title, project.year);

    // 3. Normalize Foreign Keys to match Postgres constraints
    const categoryId = normalizeCategoryId(project.categoryId || project.mainCategory);
    const typologyId = normalizeTypologyId(project.typologyId || project.subcategory || project.category);
    const contractTypeId = normalizeContractTypeId(project.contractTypeId);

    // 4. Preserve existing project_code on update to prevent unique constraint collisions
    let projectCode = project.projectCode;
    if (!projectCode) {
      const { data: existingPrj } = await supabase
        .from('projects')
        .select('project_code')
        .eq('id', id)
        .maybeSingle();

      if (existingPrj?.project_code) {
        projectCode = existingPrj.project_code;
      } else {
        const curYear = new Date().getFullYear().toString().slice(-2);
        projectCode = `PRJ-${project.year || new Date().getFullYear()}-${Math.floor(100 + Math.random() * 899)}`;
      }
    }

    const pAny = project as any;
    const projectPayload: any = {
      id,
      slug,
      project_code: projectCode,
      project_title: project.title,
      year: String(project.year || new Date().getFullYear()),
      category_id: categoryId,
      typology_id: typologyId,
      contract_type_id: contractTypeId,
      client_type: project.clientType || 'Mid-Income',
      status: project.status || 'ongoing',
      location_name: typeof project.location === 'string' ? project.location : pAny.location?.name || 'Metro Manila, Philippines',
      address_details: pAny.addressDetails || {},
      coordinates: pAny.coordinates || null,
      floor_area_sqm:
        typeof project.floorAreaSqm === 'number'
          ? project.floorAreaSqm
          : project.specs?.area
          ? parseFloat(project.specs.area) || null
          : null,
      property_area_type: pAny.propertyAreaType || 'tua',
      duration: pAny.duration || project.specs?.duration || null,
      materials: pAny.materials || project.specs?.materials || [],
      description: project.description || project.title,
      full_writeup: project.fullWriteup || project.description || project.title,
      youtube_video_url: pAny.youtubeVideoUrl || project.video || null,
      is_featured: Boolean(pAny.isFeatured),
      is_draft: Boolean(project.isDraft),
      sort_order: pAny.sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    };

    let { error: prjError } = await supabase.from('projects').upsert(projectPayload);

    // Fault-tolerance: if the Supabase database does not yet have the 'slug' column before migration, retry without it
    if (prjError && prjError.message?.includes('column "slug" of relation "projects" does not exist')) {
      const { slug: _removed, ...payloadWithoutSlug } = projectPayload;
      const retry = await supabase.from('projects').upsert(payloadWithoutSlug);
      prjError = retry.error;
    }

    if (prjError) {
      console.error('[saveProjectAction] Supabase projects error:', prjError);
      return { success: false, error: prjError.message };
    }

    // 5. Sanitize and Sync media gallery (auto-uploading any base64 images to Supabase Storage)
    let processedImages: string[] = [];
    if (project.images && Array.isArray(project.images)) {
      processedImages = await Promise.all(
        project.images.map((url, idx) => uploadBase64ToStorage(url, id, idx))
      );

      await supabase.from('project_media').delete().eq('project_id', id);

      if (processedImages.length > 0) {
        const mediaToInsert = processedImages.map((url, idx) => ({
          project_id: id,
          media_type: 'image',
          url,
          caption: `${project.title} - View ${idx + 1}`,
          is_cover: idx === 0,
          sort_order: idx + 1,
        }));
        await supabase.from('project_media').insert(mediaToInsert);
      }
    } else if (project.media && Array.isArray(project.media)) {
      await supabase.from('project_media').delete().eq('project_id', id);

      if (project.media.length > 0) {
        const sanitizedMedia = await Promise.all(
          project.media.map(async (m, idx) => {
            const rawUrl = m.mediaUrl || (m as any).url || '';
            const cleanUrl = await uploadBase64ToStorage(rawUrl, id, idx);
            return {
              project_id: id,
              media_type: (m as any).mediaType || 'image',
              url: cleanUrl,
              caption: m.caption || null,
              is_cover: Boolean(m.isCover || idx === 0),
              sort_order: m.sortOrder ?? idx + 1,
            };
          })
        );
        await supabase.from('project_media').insert(sanitizedMedia);
        processedImages = sanitizedMedia.map((m) => m.url);
      }
    }

    // 6. Sync Project Contributors into Supabase project_contributors table
    if (project.contributors && Array.isArray(project.contributors)) {
      await supabase.from('project_contributors').delete().eq('project_id', id);

      if (project.contributors.length > 0) {
        const contributorsToInsert = project.contributors.map((c, idx) => ({
          project_id: id,
          person_id: c.memberId,
          role_in_project: c.roleInProject,
          contribution_narrative: c.description || null,
          sort_order: c.sortOrder ?? idx,
        }));
        const { error: contribErr } = await supabase.from('project_contributors').insert(contributorsToInsert);
        if (contribErr) {
          console.error('[saveProjectAction] Error inserting project contributors:', contribErr);
        }
      }
    }

    revalidatePath('/works');
    revalidatePath('/works/[category]', 'page');
    revalidatePath('/works/[category]/[slug]', 'page');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/people');
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: {
        ...project,
        id,
        slug,
        projectCode,
        categoryId,
        typologyId,
        contractTypeId: contractTypeId || undefined,
        images: processedImages.length > 0 ? processedImages : project.images,
      },
    };
  } catch (err: any) {
    console.error('[saveProjectAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save project' };
  }
}

export async function getProjectContributorsAction(projectId: string) {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('project_contributors')
      .select(`
        id,
        person_id,
        role_in_project,
        contribution_narrative,
        sort_order,
        person:people(id, first_name, last_name, profile_photo_url, primary_role_id)
      `)
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('[getProjectContributorsAction] Error:', error);
      return { success: false, error: error.message, data: [] };
    }

    const contributors = (data || []).map((row: any) => ({
      id: row.id,
      memberId: row.person_id,
      memberName: row.person ? `${row.person.first_name || ''} ${row.person.last_name || ''}`.trim() : row.person_id,
      memberRole: row.role_in_project,
      memberImage: row.person?.profile_photo_url || '',
      roleInProject: row.role_in_project,
      description: row.contribution_narrative || '',
      sortOrder: row.sort_order,
    }));

    return { success: true, data: contributors };
  } catch (err: any) {
    console.error('[getProjectContributorsAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to load contributors', data: [] };
  }
}

export async function deleteProjectAction(id: string) {
  try {
    const supabase = getAdminClient();
    let { error } = await supabase.from('projects').delete().eq('id', id);

    if (error && !isUuid(id)) {
      const retry = await supabase.from('projects').delete().eq('slug', id);
      error = retry.error;
    }

    if (error) {
      console.error('[deleteProjectAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/works');
    revalidatePath('/admin/projects');
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteProjectAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete project' };
  }
}

export async function toggleProjectDraftAction(id: string, isDraft: boolean) {
  try {
    const supabase = getAdminClient();
    let { error } = await supabase
      .from('projects')
      .update({ is_draft: isDraft, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error && !isUuid(id)) {
      const retry = await supabase
        .from('projects')
        .update({ is_draft: isDraft, updated_at: new Date().toISOString() })
        .eq('slug', id);
      error = retry.error;
    }

    if (error) {
      console.error('[toggleProjectDraftAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/works');
    revalidatePath('/admin/projects');
    revalidatePath('/', 'layout');

    return { success: true, isDraft };
  } catch (err: any) {
    console.error('[toggleProjectDraftAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to toggle draft status' };
  }
}

// ==============================================================================
// 3. ROLES MUTATIONS
// ==============================================================================

export async function saveRoleAction(role: Role) {
  try {
    const supabase = getAdminClient();

    const code = (role.code || role.title || 'ROLE')
      .toUpperCase()
      .replace(/[^A-Z0-9_-]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const id =
      role.id ||
      `role-${code.toLowerCase()}`;

    const rolePayload = {
      id,
      role_code: code,
      role_title: role.title.trim(),
      category: role.category,
      track_id: role.trackId || (role.track === 'internship' ? 'INTERN_CHED_240' : 'PROF'),
      department: role.department || 'Production Team',
      role_description: role.description || null,
      is_active: role.isActive !== false && !role.isDraft,
      sort_order: (role as any).sortOrder ?? 0,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('roles').upsert(rolePayload);

    if (error) {
      console.error('[saveRoleAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/roles');
    revalidatePath('/admin/people');

    return { success: true, data: { ...role, id } };
  } catch (err: any) {
    console.error('[saveRoleAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save role' };
  }
}

export async function deleteRoleAction(id: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('roles').delete().eq('id', id);

    if (error) {
      console.error('[deleteRoleAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/roles');
    revalidatePath('/admin/people');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteRoleAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete role' };
  }
}

export async function saveProjectRoleAction(projectRole: ProjectRole) {
  try {
    const supabase = getAdminClient();

    const code = (projectRole.code || projectRole.name || 'PR')
      .toUpperCase()
      .replace(/[^A-Z0-9_-]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const id =
      projectRole.id ||
      `proj-role-${code.toLowerCase()}`;

    const payload = {
      id,
      code,
      name: projectRole.name.trim(),
      description: projectRole.description || null,
      is_active: projectRole.isActive !== false,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('project_roles').upsert(payload);

    if (error) {
      console.error('[saveProjectRoleAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/roles');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/people');

    return { success: true, data: { ...projectRole, id, code } };
  } catch (err: any) {
    console.error('[saveProjectRoleAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save project role' };
  }
}

export async function deleteProjectRoleAction(id: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('project_roles').delete().eq('id', id);

    if (error) {
      console.error('[deleteProjectRoleAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/roles');
    revalidatePath('/admin/projects');
    revalidatePath('/admin/people');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteProjectRoleAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete project role' };
  }
}

export async function updatePersonRolesAction(personId: string, roleIds: string[]) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from('people')
      .update({
        other_role_ids: roleIds,
        primary_role_id: roleIds[0] || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', personId);

    if (error) {
      console.error('[updatePersonRolesAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/admin/roles');
    revalidatePath('/admin/people');
    return { success: true };
  } catch (err: any) {
    console.error('[updatePersonRolesAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to update person roles' };
  }
}

// ==============================================================================
// 4. CMS & PAGE MANAGEMENT MUTATIONS
// ==============================================================================

export async function fetchAdminSitePagesAction(): Promise<SitePage[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase.from('site_pages').select('*');
    const dbPages: SitePage[] = (!error && data)
      ? data.map((row: any): SitePage => ({
          id: row.id,
          title: row.title,
          subtitle: row.subtitle,
          heroImageUrl: row.hero_image_url,
          metaTitle: row.meta_title,
          metaDescription: row.meta_description,
          isDraft: Boolean(row.is_draft),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }))
      : [];

    const fallbackPages = getFallbackSitePages();
    const pageMap = new Map<string, SitePage>();

    fallbackPages.forEach((p) => {
      pageMap.set(p.id.toLowerCase().replace(/^\/+|\/+$/g, ''), p);
    });

    dbPages.forEach((dbP) => {
      const normDbId = dbP.id.toLowerCase().replace(/^\/+|\/+$/g, '');
      const lastSeg = normDbId.split('/').pop();
      let matchedKey: string | null = null;
      for (const key of pageMap.keys()) {
        if (key === normDbId || (lastSeg && key.split('/').pop() === lastSeg)) {
          matchedKey = key;
          break;
        }
      }
      if (matchedKey) {
        const existing = pageMap.get(matchedKey)!;
        pageMap.set(matchedKey, {
          ...existing,
          ...dbP,
          id: existing.id,
        });
      } else {
        pageMap.set(normDbId, dbP);
      }
    });

    return Array.from(pageMap.values());
  } catch (err) {
    console.warn('[fetchAdminSitePagesAction] Exception:', err);
    return getFallbackSitePages();
  }
}

export async function saveSitePageAction(page: SitePage) {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('site_pages')
      .upsert({
        id: page.id,
        title: page.title,
        subtitle: page.subtitle,
        hero_image_url: page.heroImageUrl,
        meta_title: page.metaTitle || null,
        meta_description: page.metaDescription || null,
        is_draft: Boolean(page.isDraft),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[saveSitePageAction] Error:', error);
      return { success: false, error: error.message };
    }

    // Revalidate navigation and all pages depending on site_pages
    const targetRoute = page.id.startsWith('/') ? page.id : `/${page.id}`;
    revalidatePath(targetRoute);
    revalidatePath('/', 'layout');
    revalidateTag('site-pages');
    revalidateTag('navigation');

    return {
      success: true,
      data: {
        ...page,
        ...(data
          ? {
              id: data.id,
              title: data.title,
              subtitle: data.subtitle,
              heroImageUrl: data.hero_image_url,
              metaTitle: data.meta_title,
              metaDescription: data.meta_description,
              isDraft: Boolean(data.is_draft),
            }
          : {}),
      },
    };
  } catch (err: any) {
    console.error('[saveSitePageAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save site page' };
  }
}

export async function saveNavigationCardAction(card: NavigationCardItem) {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('navigation_cards')
      .upsert({
        id: card.id,
        hub_id: card.hubId,
        card_key: card.cardKey,
        title: card.title,
        tagline: card.tagline,
        subtext: card.subtext,
        tags: card.tags,
        image_url: card.imageUrl,
        target_href: card.targetHref,
        sort_order: card.sortOrder,
        is_draft: Boolean(card.isDraft),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[saveNavigationCardAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');
    revalidateTag('navigation');

    return {
      success: true,
      data: {
        ...card,
        ...(data
          ? {
              id: data.id,
              hubId: data.hub_id,
              cardKey: data.card_key,
              title: data.title,
              tagline: data.tagline,
              subtext: data.subtext,
              tags: data.tags,
              imageUrl: data.image_url,
              targetHref: data.target_href,
              sortOrder: data.sort_order,
              isDraft: Boolean(data.is_draft),
            }
          : {}),
      },
    };
  } catch (err: any) {
    console.error('[saveNavigationCardAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save navigation card' };
  }
}

export async function saveProcessPhilosophyAction(item: ProcessPhilosophy) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase
      .from('process_philosophies')
      .update({
        tagline: item.tagline,
        description: item.description,
        extra_description: item.extraDescription,
        image_url: item.imageUrl,
        subtext: item.subtext,
        pillars: item.pillars,
        is_draft: Boolean(item.isDraft),
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (error) {
      console.error('[saveProcessPhilosophyAction] Error:', error);
      return { success: false, error: error.message };
    }

    const pageId = `studio/our-process/${item.id}`;
    await supabase
      .from('site_pages')
      .update({ is_draft: Boolean(item.isDraft), updated_at: new Date().toISOString() })
      .or(`id.eq.${pageId},id.eq./${pageId},id.eq.${item.id}`);

    revalidatePath('/studio/our-process');
    revalidatePath('/studio/our-process/designing-with-values');
    revalidatePath('/studio/our-process/managing-with-integrity');
    revalidatePath('/studio/our-process/building-with-culture');
    revalidatePath('/', 'layout');

    return { success: true, data: item };
  } catch (err: any) {
    console.error('[saveProcessPhilosophyAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save process philosophy' };
  }
}

export async function saveStageGroupAction(group: StageGroup) {
  try {
    const supabase = getAdminClient();
    const hasValidUuid = isUuid(group.id);

    const payload: any = {
      process_page_id: group.processPageId,
      name: group.name,
      col_span: group.colSpan,
      sort_order: group.sortOrder,
      is_draft: Boolean(group.isDraft),
      updated_at: new Date().toISOString(),
    };

    let resultData: any = null;

    if (hasValidUuid) {
      payload.id = group.id;
      const { data, error } = await supabase
        .from('stage_groups')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveStageGroupAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('stage_groups')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveStageGroupAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    }

    revalidatePath('/studio/our-process');
    revalidatePath(`/studio/${group.processPageId}`);
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: resultData
        ? {
            id: resultData.id,
            processPageId: resultData.process_page_id,
            name: resultData.name,
            colSpan: resultData.col_span,
            sortOrder: resultData.sort_order,
            isDraft: Boolean(resultData.is_draft),
            stages: group.stages || [],
          }
        : group,
    };
  } catch (err: any) {
    console.error('[saveStageGroupAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save stage group' };
  }
}

export async function deleteStageGroupAction(groupId: string, processPageId: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('stage_groups').delete().eq('id', groupId);

    if (error) {
      console.error('[deleteStageGroupAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-process');
    revalidatePath(`/studio/${processPageId}`);
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteStageGroupAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete stage group' };
  }
}

export async function saveProcessStageAction(stage: ProcessStageItem) {
  try {
    const supabase = getAdminClient();
    const hasValidUuid = isUuid(stage.id);

    const payload: any = {
      process_page_id: stage.processPageId,
      stage_group_id: stage.stageGroupId,
      step_number: stage.stepNumber,
      title: stage.title,
      subtitle: stage.subtitle,
      description: stage.description,
      deliverables: stage.deliverables,
      duration: stage.duration,
      sort_order: stage.sortOrder,
      is_draft: Boolean(stage.isDraft),
      updated_at: new Date().toISOString(),
    };

    let resultData: any = null;

    if (hasValidUuid) {
      payload.id = stage.id;
      const { data, error } = await supabase
        .from('process_stages')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveProcessStageAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('process_stages')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveProcessStageAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    }

    revalidatePath('/studio/our-process');
    revalidatePath(`/studio/${stage.processPageId}`);
    revalidatePath('/', 'layout');

    return {
      success: true,
      data: resultData
        ? {
            id: resultData.id,
            processPageId: resultData.process_page_id,
            stageGroupId: resultData.stage_group_id,
            stepNumber: resultData.step_number,
            title: resultData.title,
            subtitle: resultData.subtitle,
            description: resultData.description,
            deliverables: resultData.deliverables,
            duration: resultData.duration,
            sortOrder: resultData.sort_order,
            isDraft: Boolean(resultData.is_draft),
          }
        : stage,
    };
  } catch (err: any) {
    console.error('[saveProcessStageAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save process stage' };
  }
}

export async function deleteProcessStageAction(stageId: string, processPageId: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('process_stages').delete().eq('id', stageId);

    if (error) {
      console.error('[deleteProcessStageAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-process');
    revalidatePath(`/studio/${processPageId}`);
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteProcessStageAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete process stage' };
  }
}

export async function saveServiceOfferingAction(offering: ServiceOffering) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase
      .from('service_offerings')
      .update({
        title: offering.title,
        tagline: offering.tagline,
        description: offering.description,
        extra_description: offering.extraDescription,
        image_url: offering.imageUrl,
        subtext: offering.subtext,
        pillars: offering.pillars,
        content_columns: offering.contentColumns,
        sort_order: offering.sortOrder,
        is_draft: Boolean(offering.isDraft),
        updated_at: new Date().toISOString(),
      })
      .eq('id', offering.id);

    if (error) {
      console.error('[saveServiceOfferingAction] Error:', error);
      return { success: false, error: error.message };
    }

    const pageId = `studio/our-services/${offering.id}`;
    await supabase
      .from('site_pages')
      .update({ is_draft: Boolean(offering.isDraft), updated_at: new Date().toISOString() })
      .or(`id.eq.${pageId},id.eq./${pageId},id.eq.${offering.id}`);

    revalidatePath('/studio/our-services');
    revalidatePath('/studio/our-services/comprehensive-services');
    revalidatePath('/studio/our-services/piecework-services');
    revalidatePath('/studio/our-services/consultation-retainer-services');
    revalidatePath('/', 'layout');

    return { success: true, data: offering };
  } catch (err: any) {
    console.error('[saveServiceOfferingAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save service offering' };
  }
}

export async function saveServiceAccordionAction(item: ServiceAccordionItem) {
  try {
    const supabase = getAdminClient();
    const isNew = !item.id || item.id.startsWith('acc-') || item.id.startsWith('comp-') || item.id.startsWith('piece-') || item.id.startsWith('consult-');
    const hasValidUuid = isUuid(item.id);

    const payload: any = {
      service_id: item.serviceId,
      column_index: item.columnIndex,
      title: item.title,
      content: item.content,
      link_text: item.linkText || null,
      link_href: item.linkHref || null,
      sort_order: item.sortOrder,
      is_draft: Boolean(item.isDraft),
      updated_at: new Date().toISOString(),
    };

    let resultData: any = null;

    if (!isNew && hasValidUuid) {
      payload.id = item.id;
      const { data, error } = await supabase
        .from('service_accordions')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveServiceAccordionAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('service_accordions')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveServiceAccordionAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    }

    const saved: ServiceAccordionItem = {
      id: resultData.id,
      serviceId: resultData.service_id,
      columnIndex: resultData.column_index,
      title: resultData.title,
      content: resultData.content,
      linkText: resultData.link_text,
      linkHref: resultData.link_href,
      sortOrder: resultData.sort_order,
      isDraft: Boolean(resultData.is_draft),
      createdAt: resultData.created_at,
      updatedAt: resultData.updated_at,
    };

    revalidatePath('/studio/our-services');
    revalidatePath(`/studio/our-services/${item.serviceId}`);
    revalidatePath('/', 'layout');

    return { success: true, data: saved };
  } catch (err: any) {
    console.error('[saveServiceAccordionAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save service accordion' };
  }
}

export async function deleteServiceAccordionAction(itemId: string, serviceId: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase
      .from('service_accordions')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('[deleteServiceAccordionAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-services');
    revalidatePath(`/studio/our-services/${serviceId}`);
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteServiceAccordionAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete service accordion' };
  }
}

export async function saveHomeSlideAction(slide: HomeSlideItem) {
  try {
    const supabase = getAdminClient();
    const hasValidUuid = isUuid(slide.id);

    const payload: any = {
      title: slide.title,
      image_url: slide.imageUrl,
      sort_order: slide.sortOrder,
      is_draft: Boolean(slide.isDraft),
      updated_at: new Date().toISOString(),
    };

    let resultData: any = null;

    if (hasValidUuid) {
      payload.id = slide.id;
      const { data, error } = await supabase
        .from('home_slides')
        .upsert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveHomeSlideAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    } else {
      const { data, error } = await supabase
        .from('home_slides')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('[saveHomeSlideAction] Error:', error);
        return { success: false, error: error.message };
      }
      resultData = data;
    }

    revalidatePath('/');

    return {
      success: true,
      data: resultData
        ? {
            id: resultData.id,
            title: resultData.title,
            imageUrl: resultData.image_url,
            sortOrder: resultData.sort_order,
            isDraft: Boolean(resultData.is_draft),
          }
        : slide,
    };
  } catch (err: any) {
    console.error('[saveHomeSlideAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save home slide' };
  }
}

export async function deleteHomeSlideAction(slideId: string) {
  try {
    const supabase = getAdminClient();
    const { error } = await supabase.from('home_slides').delete().eq('id', slideId);

    if (error) {
      console.error('[deleteHomeSlideAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('[deleteHomeSlideAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to delete home slide' };
  }
}

export async function reorderHomeSlidesAction(items: { id: string; sortOrder: number }[]) {
  try {
    const supabase = getAdminClient();
    const updates = items.map((item) =>
      supabase
        .from('home_slides')
        .update({ sort_order: item.sortOrder, updated_at: new Date().toISOString() })
        .eq('id', item.id)
    );

    const results = await Promise.all(updates);
    const failedResult = results.find((r) => r.error);
    if (failedResult?.error) {
      console.error('[reorderHomeSlidesAction] Error:', failedResult.error);
      return { success: false, error: failedResult.error.message };
    }

    revalidatePath('/');

    return { success: true };
  } catch (err: any) {
    console.error('[reorderHomeSlidesAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to reorder home slides' };
  }
}

export async function saveHomepageSlogansAction(slogans: HomepageSlogans) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase.from('site_settings').upsert({
      key: 'homepage_slogans',
      content: slogans,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[saveHomepageSlogansAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');

    return { success: true, data: slogans };
  } catch (err: any) {
    console.error('[saveHomepageSlogansAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save slogans' };
  }
}

// ==============================================================================
// 7. SITE SETTINGS (General Info)
// ==============================================================================

export async function saveSiteSettingAction<T = any>(key: string, content: T) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase.from('site_settings').upsert({
      key,
      content,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`[saveSiteSettingAction:${key}] Error:`, error);
      return { success: false, error: error.message };
    }

    revalidatePath('/', 'layout');

    return { success: true, data: content };
  } catch (err: any) {
    console.error(`[saveSiteSettingAction:${key}] Exception:`, err);
    return { success: false, error: err?.message || `Failed to save site setting ${key}` };
  }
}

export async function fetchSiteSettingAction<T = any>(key: string): Promise<T | null> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('content')
      .eq('key', key)
      .single();

    if (error || !data) {
      if (error?.code !== 'PGRST116') {
        console.error(`[fetchSiteSettingAction:${key}] Error:`, error);
      }
      return null;
    }

    return data.content as T;
  } catch (err: any) {
    console.error(`[fetchSiteSettingAction:${key}] Exception:`, err);
    return null;
  }
}
