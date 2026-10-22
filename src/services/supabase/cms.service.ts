import { supabasePublic } from '@/lib/supabase/public';
import {
  SitePage,
  NavigationCardItem,
  ServiceOffering,
  ServiceAccordionItem,
  ProcessPhilosophy,
  StageGroup,
  ProcessStageItem,
  HomeSlideItem,
  HomepageSlogans,
} from '@/types';
import { OUR_SERVICES_DATA, SERVICES_DATA } from '@/lib/dummy-data/our-services/services-data';
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

export async function getSitePages(includeDrafts = true): Promise<SitePage[]> {
  try {
    let query = supabasePublic.from('site_pages').select('*');
    if (!includeDrafts) {
      query = query.eq('is_draft', false);
    }
    const { data, error } = await query;
    const dbPages: SitePage[] = (!error && data) ? data.map((row: any): SitePage => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      heroImageUrl: row.hero_image_url,
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      isDraft: Boolean(row.is_draft),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })) : [];

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

    let result = Array.from(pageMap.values());
    if (!includeDrafts) {
      result = result.filter((p) => !p.isDraft);
    }
    return result;
  } catch (err) {
    console.warn('Falling back to local site pages:', err);
    return getFallbackSitePages();
  }
}

export async function getSitePageById(id: string): Promise<SitePage | null> {
  const pages = await getSitePages(true);
  return pages.find((p) => p.id === id) || null;
}

export function getFallbackSitePages(): SitePage[] {
  return [
    // 0. Parent Hubs
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

    // 1. studio/our-services subpages
    {
      id: 'studio/our-services/comprehensive-services',
      title: 'comprehensive services',
      subtitle: 'full-lifecycle architectural design, technical engineering, & turnkey delivery',
      heroImageUrl: '/images/hero_modern_villa_1783495183350.jpg',
      isDraft: false,
    },
    {
      id: 'studio/our-services/piecework-services',
      title: 'piecework services',
      subtitle: 'targeted architectural, engineering, or modular consulting scopes',
      heroImageUrl: '/images/studio_services_img_1785469964556.jpg',
      isDraft: false,
    },
    {
      id: 'studio/our-services/consultation-retainer-services',
      title: 'consultation & retainer services',
      subtitle: 'on-call technical advisory, peer reviews, and ongoing design management',
      heroImageUrl: '/images/production_drawings_1783495233053.jpg',
      isDraft: false,
    },

    // 2. studio/our-process subpages
    {
      id: 'studio/our-process/designing-with-values',
      title: 'designing with values',
      subtitle: 'purpose-driven spatial concepts anchored in environmental & social context',
      heroImageUrl: '/images/contact_case_study_house_img_1785469986420.jpg',
      isDraft: false,
    },
    {
      id: 'studio/our-process/managing-with-integrity',
      title: 'managing with integrity',
      subtitle: 'uncompromising fiscal clarity, transparent procurement & rigorous oversight',
      heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
      isDraft: false,
    },
    {
      id: 'studio/our-process/building-with-culture',
      title: 'building with culture',
      subtitle: 'synthesizing regional craftsmanship with modern architectural technology',
      heroImageUrl: '/images/studio_process_img_1785469980353.jpg',
      isDraft: false,
    },

    // 3. contact/case-study-house subpages
    {
      id: 'contact/case-study-house/discovery-session',
      title: 'schedule a discovery session',
      subtitle: 'for project intake, site feasibility & spatial planning consultations',
      heroImageUrl: '/images/studio_services_img_1785469964556.jpg',
      isDraft: false,
    },
    {
      id: 'contact/case-study-house/request-a-proposal',
      title: 'request a proposal',
      subtitle: 'for official cost estimates and formal project proposals',
      heroImageUrl: '/images/production_drawings_1783495233053.jpg',
      isDraft: false,
    },
    {
      id: 'contact/case-study-house/contact-info',
      title: 'studio hours & location',
      subtitle: 'headquarters, physical visits, interactive map & contact coordinates',
      heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
      isDraft: false,
    },

    // 4. contact/grow-with-us subpages
    {
      id: 'contact/grow-with-us/apprenticeship-programs',
      title: 'apprenticeship programs',
      subtitle: 'for on-the-job training requirements & licensure mentorship',
      heroImageUrl: '/images/studio_people_img_1785469993286.jpg',
      isDraft: false,
    },
    {
      id: 'contact/grow-with-us/regular-programs',
      title: 'regular programs',
      subtitle: 'for licensed architects, project directors & design practitioners',
      heroImageUrl: '/images/production_drawings_1783495233053.jpg',
      isDraft: false,
    },

    // 5. contact/partner-with-us subpages
    {
      id: 'contact/partner-with-us/supplier',
      title: 'suppliers',
      subtitle: 'for material suppliers & trade product specifications',
      heroImageUrl: '/images/kiosk_coffee_bar_1783495252161.jpg',
      isDraft: false,
    },
    {
      id: 'contact/partner-with-us/consultant',
      title: 'consultants',
      subtitle: 'for engineering & specialty technical consultants',
      heroImageUrl: '/images/contact_headquarters_img_1785470005846.jpg',
      isDraft: false,
    },
    {
      id: 'contact/partner-with-us/builder',
      title: 'builders',
      subtitle: 'for trade contractors & specialty builders',
      heroImageUrl: '/images/studio_process_img_1785469980353.jpg',
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

    const mapped: NavigationCardItem[] = data.map((row: any): NavigationCardItem => ({
      id: row.id,
      hubId: row.hub_id,
      cardKey: row.card_key,
      title: row.title,
      tagline: row.tagline,
      subtext: row.subtext,
      pageSubtitle: row.page_subtitle || undefined,
      footerText: row.footer_text || undefined,
      tags: row.tags || [],
      imageUrl: row.image_url,
      targetHref:
        row.target_href === '/contact/case-study-house/request-for-proposal'
          ? '/contact/case-study-house/request-a-proposal'
          : row.target_href === '/contact/contact-info'
          ? '/contact/case-study-house/contact-info'
          : row.target_href,
      sortOrder: row.sort_order,
      isDraft: row.is_draft,
    }));

    if (!hubId) {
      const hasContactCards = mapped.some((c) => c.hubId.toLowerCase() === 'contact');
      if (!hasContactCards) {
        mapped.push(...getFallbackNavigationCards('contact'));
      }
    }

    return mapped;
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
    ...SERVICES_DATA.map((c, i) => {
      let targetHref = '/studio/our-services';
      let cardKey = 'comprehensive-services';
      if (c.title === 'comprehensive design' || c.title.includes('comprehensive')) {
        targetHref = '/studio/our-services/comprehensive-services';
        cardKey = 'comprehensive-services';
      } else if (c.title === 'piecework services' || c.title.includes('piecework')) {
        targetHref = '/studio/our-services/piecework-services';
        cardKey = 'piecework-services';
      } else {
        targetHref = '/studio/our-services/consultation-retainer-services';
        cardKey = 'consultation-retainer-services';
      }
      return {
        id: cardKey,
        hubId: 'services',
        cardKey: cardKey,
        title: c.title,
        tagline: c.desc,
        subtext: c.desc,
        tags: [],
        imageUrl: c.image,
        targetHref: targetHref,
        sortOrder: (i + 1) * 10,
        isDraft: false,
      };
    }),
    {
      id: 'studio-services',
      hubId: 'studio',
      cardKey: 'services',
      title: 'services',
      tagline: 'comprehensive & piecework services',
      subtext: 'explore our flexible contract types and architectural scopes',
      pageSubtitle: 'discover our flexible contract types and comprehensive architectural capabilities tailored to your project scale and scope.',
      tags: ['Full Architecture', 'Engineering', 'Modular Detailing'],
      imageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-services-card.jpg',
      targetHref: '/studio/our-services',
      sortOrder: 10,
      isDraft: false,
    },
    {
      id: 'studio-process',
      hubId: 'studio',
      cardKey: 'process',
      title: 'process',
      tagline: 'design, manage, build with integrity',
      subtext: 'learn how we design, manage, and build with purpose',
      pageSubtitle: 'purpose-built responses for one-of-a-kind briefs',
      tags: ['Double Diamond', 'Values', 'Culture'],
      imageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-process-card.jpg',
      targetHref: '/studio/our-process',
      sortOrder: 20,
      isDraft: false,
    },
    {
      id: 'studio-people',
      hubId: 'studio',
      cardKey: 'people',
      title: 'people',
      tagline: 'our designers, managers & builders',
      subtext: 'meet the multidisciplinary team behind ATBP Collaborative',
      pageSubtitle: 'our multidisciplinary team of designers, managers, and builders',
      tags: ['Designers', 'Managers', 'Builders'],
      imageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/studio-people-card.jpg',
      targetHref: '/studio/our-people',
      sortOrder: 30,
      isDraft: false,
    },
    {
      id: 'contact-case-study-house',
      hubId: 'contact',
      cardKey: 'contact-case-study-house',
      title: 'case study house',
      tagline: 'private houses, interiors, & bespoke typologies',
      subtext: 'private houses, interiors, & bespoke typologies',
      pageSubtitle: 'explore case study house project types and collaborative offerings',
      tags: ['Residential', 'Interiors', 'Bespoke'],
      imageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_case_study_house_img_1785469986420.jpg',
      targetHref: '/contact/case-study-house',
      sortOrder: 10,
      isDraft: false,
    },
    {
      id: 'contact-grow-with-us',
      hubId: 'contact',
      cardKey: 'contact-grow-with-us',
      title: 'grow with us',
      tagline: 'internship, apprenticeship & studio regulars',
      subtext: 'internship, apprenticeship & studio regulars',
      pageSubtitle: 'career and mentorship opportunities at ATBP Collaborative',
      tags: ['Apprenticeship', 'Careers', 'Regulars'],
      imageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_careers_img_1785470020165.jpg',
      targetHref: '/contact/grow-with-us',
      sortOrder: 20,
      isDraft: false,
    },
    {
      id: 'contact-partner-with-us',
      hubId: 'contact',
      cardKey: 'contact-partner-with-us',
      title: 'partner with us',
      tagline: 'material suppliers, engineering consultants, & builders',
      subtext: 'material suppliers, engineering consultants, & builders',
      pageSubtitle: 'collaborate with us as a supplier, builder, or consultant',
      tags: ['Suppliers', 'Consultants', 'Builders'],
      imageUrl: 'https://kobptyhaxwpgujipwvbk.supabase.co/storage/v1/object/public/portfolio-media/cms/contact_partners_img_1785470031164.jpg',
      targetHref: '/contact/partner-with-us',
      sortOrder: 30,
      isDraft: false,
    },
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

    const { data: offeringsData, error: offeringsError } = await query;
    if (offeringsError || !offeringsData || offeringsData.length === 0) {
      return getFallbackServiceOfferings();
    }

    // Also fetch service accordions
    let accordionsQuery = supabasePublic
      .from('service_accordions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!includeDrafts) {
      accordionsQuery = accordionsQuery.eq('is_draft', false);
    }

    const { data: accordionsData } = await accordionsQuery;
    const accordionsByService = new Map<string, ServiceAccordionItem[]>();
    if (accordionsData) {
      accordionsData.forEach((row: any) => {
        const item: ServiceAccordionItem = {
          id: row.id,
          serviceId: row.service_id,
          columnIndex: row.column_index ?? 0,
          title: row.title,
          content: row.content,
          linkText: row.link_text,
          linkHref: row.link_href,
          sortOrder: row.sort_order ?? 0,
          isDraft: Boolean(row.is_draft),
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
        const list = accordionsByService.get(item.serviceId) || [];
        list.push(item);
        accordionsByService.set(item.serviceId, list);
      });
    }

    return offeringsData.map((row: any): ServiceOffering => {
      const sAccordions = accordionsByService.get(row.id) || getFallbackServiceAccordions(row.id);
      return {
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
        accordions: sAccordions,
        sortOrder: row.sort_order,
        isDraft: row.is_draft,
      };
    });
  } catch (err) {
    console.warn('Falling back to local service offerings:', err);
    return getFallbackServiceOfferings();
  }
}

export async function getServiceOfferingById(id: string): Promise<ServiceOffering | null> {
  const items = await getServiceOfferings(true);
  return items.find((item) => item.id === id) || null;
}

export function getFallbackServiceAccordions(serviceId: string): ServiceAccordionItem[] {
  if (serviceId === 'comprehensive-services') {
    return [
      {
        id: 'comp-acc-1',
        serviceId: 'comprehensive-services',
        columnIndex: 0,
        title: 'Comprehensive Design Services',
        content: `Our design process is rooted in a deep understanding of your vision, lifestyle, and the unique characteristics of your site.

We integrate architectural planning, interior design, and engineering to create cohesive spaces that are both beautiful and functional.

As a design-build studio, we prioritize constructability and material intelligence from the very beginning, ensuring that every design decision aligns with your budget and timeline.

We navigate the complexities of local zoning, building codes, and environmental regulations, streamlining the path to construction.`,
        linkText: 'Learn more about our process in designing',
        linkHref: '/studio/our-process/designing-with-values',
        sortOrder: 10,
        isDraft: false,
      },
      {
        id: 'comp-acc-2',
        serviceId: 'comprehensive-services',
        columnIndex: 1,
        title: 'Comprehensive Management Services',
        content: `Effective project management is the bridge between a great design and a successful build.

We oversee every phase of the project, from initial cost estimation and value engineering to procurement and scheduling.

Our team acts as your single point of contact, coordinating with specialized consultants, suppliers, and local authorities to keep the project on track.

By maintaining rigorous quality control and transparent communication, we mitigate risks and ensure that the final result exceeds expectations.`,
        linkText: 'Understand how we manage projects',
        linkHref: '/studio/our-process/managing-with-integrity',
        sortOrder: 20,
        isDraft: false,
      },
      {
        id: 'comp-acc-3',
        serviceId: 'comprehensive-services',
        columnIndex: 2,
        title: 'Building Construction Services',
        content: `Construction is where our designs come to life. We bring decades of hands-on experience and a network of trusted craftsmen to every project.

Our build teams work in tandem with our designers, fostering a collaborative environment that quickly resolves on-site challenges without compromising the design intent.

We employ advanced construction methodologies and sustainable practices to deliver structures of enduring quality and performance.

From groundbreaking to final handover, we are committed to safety, efficiency, and unparalleled craftsmanship in every detail.`,
        linkText: 'Validate our capabilities as Builder',
        linkHref: '/studio/our-process/building-with-culture',
        sortOrder: 30,
        isDraft: false,
      },
    ];
  }

  if (serviceId === 'piecework-services') {
    return [
      {
        id: 'piece-acc-1',
        serviceId: 'piecework-services',
        columnIndex: 0,
        title: 'Architectural Interiors',
        content: 'Custom interior spatial design focusing on finishes, millwork detailing, ceiling layout, and built-in furniture coordination. We bridge shell design with internal tactility.',
        sortOrder: 10,
        isDraft: false,
      },
      {
        id: 'piece-acc-2',
        serviceId: 'piecework-services',
        columnIndex: 0,
        title: 'Lighting Design',
        content: 'Fixture specification, reflected ceiling plans, lux level calculations, and circuit zoning. Crafted to amplify space utility, mood, and material textures.',
        sortOrder: 20,
        isDraft: false,
      },
      {
        id: 'piece-acc-3',
        serviceId: 'piecework-services',
        columnIndex: 0,
        title: 'Site Planning',
        content: 'Analyzing solar pathing, typography setbacks, accessibility routing, and easement compliance to optimize building footprint placement on your specific land.',
        sortOrder: 30,
        isDraft: false,
      },
      {
        id: 'piece-acc-4',
        serviceId: 'piecework-services',
        columnIndex: 1,
        title: 'Document & Assessment',
        content: 'Comprehensive auditing of existing blueprints, structural condition reports, spatial efficiency analysis, and code compliance assessments for pre-construction.',
        sortOrder: 10,
        isDraft: false,
      },
      {
        id: 'piece-acc-5',
        serviceId: 'piecework-services',
        columnIndex: 1,
        title: 'Code Compliance',
        content: 'Rigorous validation of design plans against building codes, zoning regulations, fire safety policies, and local city ordinances to guarantee permit approvals.',
        sortOrder: 20,
        isDraft: false,
      },
      {
        id: 'piece-acc-6',
        serviceId: 'piecework-services',
        columnIndex: 1,
        title: 'Permit Processing',
        content: 'End-to-end administration of governmental approvals, environmental clearances, utility permits, and barangay/city hall certifications.',
        sortOrder: 30,
        isDraft: false,
      },
      {
        id: 'piece-acc-7',
        serviceId: 'piecework-services',
        columnIndex: 2,
        title: 'Masonry',
        content: 'Detailed specifications for stone cladding, brick bonding, retaining wall structures, load-bearing concrete blocks, and external masonry finishes.',
        sortOrder: 10,
        isDraft: false,
      },
      {
        id: 'piece-acc-8',
        serviceId: 'piecework-services',
        columnIndex: 2,
        title: 'Paint Jobs',
        content: 'Specification of coating schedules, primer selections, anti-microbial interior paints, weatherproofing exterior paint systems, and custom color swatches.',
        sortOrder: 20,
        isDraft: false,
      },
    ];
  }

  if (serviceId === 'consultation-retainer-services') {
    return [
      {
        id: 'consult-acc-1',
        serviceId: 'consultation-retainer-services',
        columnIndex: 0,
        title: 'Consultation',
        content: 'Flexible, on-demand advisory sessions covering project feasibility, site evaluations, budget estimation, layout advice, and design critiques. Perfect for resolving specific design crossroads without long-term commitments.',
        sortOrder: 10,
        isDraft: false,
      },
      {
        id: 'consult-acc-2',
        serviceId: 'consultation-retainer-services',
        columnIndex: 1,
        title: 'Retainer',
        content: 'Continuous architectural partner support for phased developments, multi-property portfolios, and long-term asset management. Ensures ongoing design control, contractor alignment, and quality supervision over extended timelines.',
        sortOrder: 20,
        isDraft: false,
      },
    ];
  }

  return [];
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
    accordions: getFallbackServiceAccordions(s.id),
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
