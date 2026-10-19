import type { MetadataRoute } from 'next';
import { ROUTES } from '@/lib/navigation/routes';
import { getProjects, getMembers } from '@/services/dummy-data.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://atbpcollaborative.com';
  const currentDate = new Date();

  // Static routes configuration with priority & frequency
  const staticPaths: Array<{ path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }> = [
    { path: ROUTES.home, changeFrequency: 'weekly', priority: 1.0 },
    { path: ROUTES.works, changeFrequency: 'weekly', priority: 0.9 },
    { path: ROUTES.studio, changeFrequency: 'monthly', priority: 0.8 },
    { path: ROUTES.ourPeople, changeFrequency: 'weekly', priority: 0.8 },
    { path: ROUTES.ourServices, changeFrequency: 'monthly', priority: 0.8 },
    { path: ROUTES.services, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.comprehensiveServices, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.pieceworkServices, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.consultationRetainerServices, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.designingWithValues, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.managingWithIntegrity, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.buildingWithCulture, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.contact, changeFrequency: 'monthly', priority: 0.8 },
    { path: ROUTES.caseStudyHouse, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.contactInfo, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.discoverySession, changeFrequency: 'monthly', priority: 0.8 },
    { path: ROUTES.requestForProposal, changeFrequency: 'monthly', priority: 0.8 },
    { path: ROUTES.growWithUs, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.regularPrograms, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.apprenticeshipPrograms, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.partnerWithUs, changeFrequency: 'monthly', priority: 0.7 },
    { path: ROUTES.builder, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.consultant, changeFrequency: 'monthly', priority: 0.6 },
    { path: ROUTES.supplier, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map(({ path, changeFrequency, priority }) => ({
    url: `${baseUrl}${path}`,
    lastModified: currentDate,
    changeFrequency,
    priority,
  }));

  // Works Category filters
  const categoryFilters = ['Shelter', 'Livelihood', 'Community'].map((cat) => ({
    url: `${baseUrl}/works/${cat}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  // People category filters
  const peopleCategories = ['designers', 'managers', 'builders'].map((cat) => ({
    url: `${baseUrl}/studio/our-people/category/${cat}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // Dynamic published projects
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await getProjects(false);
    projectEntries = projects
      .filter((p) => !p.isDraft)
      .map((project) => ({
        url: `${baseUrl}/works/${project.id}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
  } catch (err) {
    console.warn('[sitemap] Failed to fetch dynamic projects for sitemap:', err);
  }

  // Dynamic published members
  let memberEntries: MetadataRoute.Sitemap = [];
  try {
    const members = await getMembers(false);
    memberEntries = members
      .filter((m) => !m.isDraft)
      .map((member) => ({
        url: `${baseUrl}/studio/our-people/${encodeURIComponent(member.id)}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
  } catch (err) {
    console.warn('[sitemap] Failed to fetch dynamic members for sitemap:', err);
  }

  return [
    ...staticEntries,
    ...categoryFilters,
    ...peopleCategories,
    ...projectEntries,
    ...memberEntries,
  ];
}
