import { supabasePublic } from '@/lib/supabase/public';
import {
  SitePage,
  NavigationCardItem,
  ServiceOffering,
  ProcessPhilosophy,
  StageGroup,
  ProcessStageItem,
  HomeSlideItem,
  HomepageSlogans,
} from '@/types';
import { OUR_SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
import {
  OUR_SERVICES_PROCESS_DATA,
  BASE_PROCESS_NODES,
  CATEGORY_GROUPS,
  OUR_PROCESS_CARDS,
} from '@/lib/dummy-data/our-process/process-data';
import {
  CASE_STUDY_HOUSE_CARDS,
  GROW_WITH_US_CARDS,
  PARTNER_WITH_US_CARDS,
} from '@/lib/dummy-data/contact/contact-cards';
import { HOME_CAROUSEL_DATA } from '@/lib/dummy-data/works/home-carousel';

// ==============================================================================
// 1. SITE PAGES (SEO-Locked Pages & Metadata)
// ==============================================================================

export async function getSitePages(includeDrafts = false): Promise<SitePage[]> {
  try {
    let query = supabasePublic.from('site_pages').select('*');
    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFallbackSitePages();
    }
    return data.map((row: any): SitePage => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      heroImageUrl: row.hero_image_url,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      isDraft: row.is_draft,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.warn('Falling back to local site pages:', err);
    return getFallbackSitePages();
  }
}

export async function getSitePageById(id: string): Promise<SitePage | null> {
  const pages = await getSitePages(true);
  return pages.find((p) => p.id === id) || null;
}

function getFallbackSitePages(): SitePage[] {
  return [
    {
      id: 'services-hub',
      title: 'our services',
      subtitle: 'Discover our flexible contract types and comprehensive architectural capabilities tailored to your project scale and scope.',
      heroImageUrl: '/images/studio_services_img_1785469964556.jpg',
      isDraft: false,
    },
    {
      id: 'process-hub',
      title: 'our process',
      subtitle: 'Purpose-built responses for one-of-a-kind briefs',
      heroImageUrl: '/images/studio_process_img_1785469980353.jpg',
      isDraft: false,
    },
    {
      id: 'contact-hub',
      title: 'contact & channels',
      subtitle: 'Inquiries, physical visits, collaborations and careers',
      heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
      isDraft: false,
    },
    {
      id: 'case-study-house',
      title: 'the case study house',
      subtitle: 'explore case study house project types and collaborative offerings',
      heroImageUrl: '/images/contact_case_study_house_img_1785469986420.jpg',
      isDraft: false,
    },
    {
      id: 'grow-with-us',
      title: 'grow with us',
      subtitle: 'careers, apprenticeships & internships',
      heroImageUrl: '/images/studio_people_img_1785469993286.jpg',
      isDraft: false,
    },
    {
      id: 'partner-with-us',
      title: 'partner with us',
      subtitle: 'trade contractors, engineering specialists & material suppliers',
      heroImageUrl: '/images/production_drawings_1783495233053.jpg',
      isDraft: false,
    },
    {
      id: 'works',
      title: 'gawâ',
      subtitle: 'a curated portfolio of shelter, livelihood, and community architecture across the Philippines.',
      heroImageUrl: '/images/hero_modern_villa_1783495183350.jpg',
      isDraft: false,
    },
  ];
}

// ==============================================================================
// 2. NAVIGATION CARDS (Hub Landing Cards)
// ==============================================================================

export async function getNavigationCards(
  hubId?: string,
  includeDrafts = false
): Promise<NavigationCardItem[]> {
  try {
    let query = supabasePublic
      .from('navigation_cards')
      .select('*')
      .order('sort_order', { ascending: true });

    if (hubId) {
      query = query.eq('hub_id', hubId);
    }
    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFallbackNavigationCards(hubId);
    }

    return data.map((row: any): NavigationCardItem => ({
      id: row.id,
      hubId: row.hub_id,
      cardKey: row.card_key,
      title: row.title,
      tagline: row.tagline,
      subtext: row.subtext,
      tags: row.tags || [],
      imageUrl: row.image_url,
      targetHref: row.target_href,
      sortOrder: row.sort_order,
      isDraft: row.is_draft,
    }));
  } catch (err) {
    console.warn('Falling back to local navigation cards:', err);
    return getFallbackNavigationCards(hubId);
  }
}

function getFallbackNavigationCards(hubId?: string): NavigationCardItem[] {
  const all: NavigationCardItem[] = [
    ...CASE_STUDY_HOUSE_CARDS.map((c, i) => ({
      id: c.id,
      hubId: 'case-study-house',
      cardKey: c.id,
      title: c.title,
      tagline: c.tagline,
      subtext: c.subtext,
      tags: c.tags,
      imageUrl: c.image,
      targetHref: c.href,
      sortOrder: (i + 1) * 10,
      isDraft: false,
    })),
    ...GROW_WITH_US_CARDS.map((c, i) => ({
      id: c.id,
      hubId: 'grow-with-us',
      cardKey: c.id,
      title: c.title,
      tagline: c.tagline,
      subtext: c.subtext,
      tags: c.tags,
      imageUrl: c.image,
      targetHref: c.href,
      sortOrder: (i + 1) * 10,
      isDraft: false,
    })),
    ...PARTNER_WITH_US_CARDS.map((c, i) => ({
      id: c.id,
      hubId: 'partner-with-us',
      cardKey: c.id,
      title: c.title,
      tagline: c.tagline,
      subtext: c.subtext,
      tags: c.tags,
      imageUrl: c.image,
      targetHref: c.href,
      sortOrder: (i + 1) * 10,
      isDraft: false,
    })),
    ...OUR_PROCESS_CARDS.map((c, i) => ({
      id: c.id,
      hubId: 'process',
      cardKey: c.id,
      title: c.title,
      tagline: c.tagline,
      subtext: c.subtext,
      tags: [],
      imageUrl: c.image,
      targetHref: c.href,
      sortOrder: (i + 1) * 10,
      isDraft: false,
    })),
  ];

  if (hubId) {
    return all.filter((card) => card.hubId === hubId);
  }
  return all;
}

// ==============================================================================
// 3. SERVICE OFFERINGS
// ==============================================================================

export async function getServiceOfferings(includeDrafts = false): Promise<ServiceOffering[]> {
  try {
    let query = supabasePublic
      .from('service_offerings')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFallbackServiceOfferings();
    }

    return data.map((row: any): ServiceOffering => ({
      id: row.id,
      title: row.title,
      sectionTag: row.section_tag,
      tagline: row.tagline,
      description: row.description,
      extraDescription: row.extra_description,
      imageUrl: row.image_url,
      subtext: row.subtext,
      pillars: row.pillars || [],
      contentColumns: row.content_columns || [],
      sortOrder: row.sort_order,
      isDraft: row.is_draft,
    }));
  } catch (err) {
    console.warn('Falling back to local service offerings:', err);
    return getFallbackServiceOfferings();
  }
}

export async function getServiceOfferingById(id: string): Promise<ServiceOffering | null> {
  const items = await getServiceOfferings(true);
  return items.find((item) => item.id === id) || null;
}

function getFallbackServiceOfferings(): ServiceOffering[] {
  return Object.values(OUR_SERVICES_DATA).map((s, idx) => ({
    id: s.id,
    title: s.title,
    sectionTag: s.section,
    tagline: s.tagline,
    description: s.description,
    extraDescription: s.extraDescription,
    imageUrl: s.image,
    subtext: s.subtext,
    pillars: s.pillars,
    contentColumns: [],
    sortOrder: (idx + 1) * 10,
    isDraft: false,
  }));
}

// ==============================================================================
// 4. PROCESS PHILOSOPHIES
// ==============================================================================

export async function getProcessPhilosophies(includeDrafts = false): Promise<ProcessPhilosophy[]> {
  try {
    let query = supabasePublic
      .from('process_philosophies')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFallbackProcessPhilosophies();
    }

    return data.map((row: any): ProcessPhilosophy => ({
      id: row.id,
      title: row.title,
      sectionTag: row.section_tag,
      tagline: row.tagline,
      description: row.description,
      extraDescription: row.extra_description,
      imageUrl: row.image_url,
      subtext: row.subtext,
      pillars: row.pillars || [],
      sortOrder: row.sort_order,
      isDraft: row.is_draft,
    }));
  } catch (err) {
    console.warn('Falling back to local process philosophies:', err);
    return getFallbackProcessPhilosophies();
  }
}

export async function getProcessPhilosophyById(id: string): Promise<ProcessPhilosophy | null> {
  const items = await getProcessPhilosophies(true);
  return items.find((item) => item.id === id) || null;
}

function getFallbackProcessPhilosophies(): ProcessPhilosophy[] {
  return Object.values(OUR_SERVICES_PROCESS_DATA).map((p, idx) => ({
    id: p.id,
    title: p.title,
    sectionTag: p.section,
    tagline: p.tagline,
    description: p.description,
    extraDescription: p.extraDescription,
    imageUrl: p.image,
    subtext: p.subtext,
    pillars: p.pillars,
    sortOrder: (idx + 1) * 10,
    isDraft: false,
  }));
}

// ==============================================================================
// 5. STAGE GROUPS & PROCESS STAGES (Dynamic per page)
// ==============================================================================

export async function getStageGroupsWithStages(
  processPageId: string,
  includeDrafts = false
): Promise<StageGroup[]> {
  try {
    let groupsQuery = supabasePublic
      .from('stage_groups')
      .select('*')
      .eq('process_page_id', processPageId)
      .order('sort_order', { ascending: true });

    let stagesQuery = supabasePublic
      .from('process_stages')
      .select('*')
      .eq('process_page_id', processPageId)
      .order('sort_order', { ascending: true });

    if (!includeDrafts) {
      groupsQuery = groupsQuery.eq('is_draft', false);
      stagesQuery = stagesQuery.eq('is_draft', false);
    }

    const [groupsRes, stagesRes] = await Promise.all([groupsQuery, stagesQuery]);

    if (
      groupsRes.error ||
      stagesRes.error ||
      !groupsRes.data ||
      groupsRes.data.length === 0
    ) {
      return getFallbackStageGroups();
    }

    const stages: ProcessStageItem[] = stagesRes.data.map((row: any) => ({
      id: row.id,
      processPageId: row.process_page_id,
      stageGroupId: row.stage_group_id,
      stepNumber: row.step_number,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      deliverables: row.deliverables || [],
      duration: row.duration,
      sortOrder: row.sort_order,
      isDraft: row.is_draft,
    }));

    return groupsRes.data.map((groupRow: any): StageGroup => ({
      id: groupRow.id,
      processPageId: groupRow.process_page_id,
      name: groupRow.name,
      colSpan: groupRow.col_span,
      sortOrder: groupRow.sort_order,
      isDraft: groupRow.is_draft,
      stages: stages.filter((st) => st.stageGroupId === groupRow.id),
    }));
  } catch (err) {
    console.warn(`Falling back to local stages for ${processPageId}:`, err);
    return getFallbackStageGroups();
  }
}

function getFallbackStageGroups(): StageGroup[] {
  return CATEGORY_GROUPS.map((g, idx) => ({
    id: `fallback-group-${g.key}`,
    processPageId: 'designing-with-values',
    name: g.label,
    colSpan: g.colSpan,
    sortOrder: (idx + 1) * 10,
    isDraft: false,
    stages: BASE_PROCESS_NODES.filter((n) => n.category === g.key).map((node, sIdx) => ({
      id: node.id,
      processPageId: 'designing-with-values',
      stageGroupId: `fallback-group-${g.key}`,
      stepNumber: node.stepNumber,
      title: node.title,
      subtitle: node.subtitle,
      description: node.description,
      deliverables: node.deliverables,
      duration: node.duration,
      sortOrder: (sIdx + 1) * 10,
      isDraft: false,
    })),
  }));
}

// ==============================================================================
// 6. HOME SLIDES (Splash Carousel)
// ==============================================================================

export async function getHomeSlides(includeDrafts = false): Promise<HomeSlideItem[]> {
  try {
    let query = supabasePublic
      .from('home_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getFallbackHomeSlides();
    }

    return data.map((row: any): HomeSlideItem => ({
      id: row.id,
      title: row.title,
      imageUrl: row.image_url,
      sortOrder: row.sort_order,
      isDraft: row.is_draft,
    }));
  } catch (err) {
    console.warn('Falling back to local home slides:', err);
    return getFallbackHomeSlides();
  }
}

function getFallbackHomeSlides(): HomeSlideItem[] {
  return HOME_CAROUSEL_DATA.map((slide, idx) => ({
    id: `slide-${idx}`,
    title: slide.title,
    imageUrl: slide.url,
    sortOrder: (idx + 1) * 10,
    isDraft: false,
  }));
}

// ==============================================================================
// 7. HOMEPAGE SLOGANS & SUBTEXT
// ==============================================================================

export async function getHomepageSlogans(): Promise<HomepageSlogans> {
  try {
    const { data, error } = await supabasePublic
      .from('site_settings')
      .select('content')
      .eq('key', 'homepage_slogans')
      .single();

    if (error || !data || !data.content) {
      return getFallbackHomepageSlogans();
    }
    return data.content as HomepageSlogans;
  } catch (err) {
    return getFallbackHomepageSlogans();
  }
}

function getFallbackHomepageSlogans(): HomepageSlogans {
  return {
    slogans: [
      'designed with values.',
      'managed with integrity.',
      'built with culture.',
    ],
    heroSubtext: [
      'ATBP Collaborative delivers bespoke architectural design, master planning, and structural craft.',
      'Bridging visionary spatial concepts with honest Philippines building execution across all scales.',
    ],
  };
}
