/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { getAdminClient } from '@/lib/supabase/admin';
import {
  Member,
  Project,
  Role,
  SitePage,
  NavigationCardItem,
  ProcessPhilosophy,
  StageGroup,
  ProcessStageItem,
  ServiceOffering,
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

// ==============================================================================
// 1. PEOPLE MUTATIONS
// ==============================================================================

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
    const profilePhotoUrl = member.image || defaultAvatar;

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
      is_draft: Boolean(member.isDraft),
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

// ==============================================================================
// 2. PROJECTS MUTATIONS
// ==============================================================================

export async function saveProjectAction(project: Project) {
  try {
    const supabase = getAdminClient();

    // 1. Maintain UUID Primary Key
    // If it's already a valid UUID, preserve it.
    // If it's a temporary client ID (e.g. 'project-1234') or empty, generate a new UUID.
    // If it's a legacy non-UUID text ID, keep it to avoid breaking pre-migration tables.
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

    // Sync media gallery if present
    if (project.media && Array.isArray(project.media)) {
      await supabase.from('project_media').delete().eq('project_id', id);

      if (project.media.length > 0) {
        const mediaToInsert = project.media.map((m, idx) => ({
          project_id: id,
          media_type: (m as any).mediaType || 'image',
          url: m.mediaUrl || (m as any).url,
          caption: m.caption || null,
          is_cover: Boolean(m.isCover || idx === 0),
          sort_order: m.sortOrder ?? idx + 1,
        }));
        await supabase.from('project_media').insert(mediaToInsert);
      }
    } else if (project.images && Array.isArray(project.images)) {
      await supabase.from('project_media').delete().eq('project_id', id);

      if (project.images.length > 0) {
        const mediaToInsert = project.images.map((url, idx) => ({
          project_id: id,
          media_type: 'image',
          url,
          caption: `${project.title} - View ${idx + 1}`,
          is_cover: idx === 0,
          sort_order: idx + 1,
        }));
        await supabase.from('project_media').insert(mediaToInsert);
      }
    }

    revalidatePath('/works');
    revalidatePath('/works/[category]', 'page');
    revalidatePath('/works/[category]/[slug]', 'page');
    revalidatePath('/admin/projects');
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
      },
    };
  } catch (err: any) {
    console.error('[saveProjectAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save project' };
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

    revalidatePath('/studio/our-process');
    revalidatePath('/studio/designing-with-values');
    revalidatePath('/studio/managing-with-integrity');
    revalidatePath('/studio/building-with-culture');
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

    const { error } = await supabase.from('stage_groups').upsert({
      id: group.id,
      process_page_id: group.processPageId,
      name: group.name,
      col_span: group.colSpan,
      sort_order: group.sortOrder,
      is_draft: Boolean(group.isDraft),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[saveStageGroupAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-process');
    revalidatePath(`/studio/${group.processPageId}`);
    revalidatePath('/', 'layout');

    return { success: true, data: group };
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

    const { error } = await supabase.from('process_stages').upsert({
      id: stage.id,
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
    });

    if (error) {
      console.error('[saveProcessStageAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/studio/our-process');
    revalidatePath(`/studio/${stage.processPageId}`);
    revalidatePath('/', 'layout');

    return { success: true, data: stage };
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

    revalidatePath('/studio/our-services');
    revalidatePath('/studio/comprehensive-services');
    revalidatePath('/studio/piecework-services');
    revalidatePath('/studio/consultation-retainer-services');
    revalidatePath('/', 'layout');

    return { success: true, data: offering };
  } catch (err: any) {
    console.error('[saveServiceOfferingAction] Exception:', err);
    return { success: false, error: err?.message || 'Failed to save service offering' };
  }
}

export async function saveHomeSlideAction(slide: HomeSlideItem) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase.from('home_slides').upsert({
      id: slide.id,
      title: slide.title,
      image_url: slide.imageUrl,
      sort_order: slide.sortOrder,
      is_draft: Boolean(slide.isDraft),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[saveHomeSlideAction] Error:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/');

    return { success: true, data: slide };
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
