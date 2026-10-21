import type { Metadata } from 'next';
import { getProjectById, getMembers, getProjects } from '@/services/dummy-data.service';
import WorksSlugClient from './client';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  if (slug && slug !== 'All') {
    const project = await getProjectById(slug);
    if (project) {
      const title = `${project.title} | ATBP Collaborative`;
      const description = project.description || project.fullWriteup?.slice(0, 160) || 'Architectural project by ATBP Collaborative.';
      const coverImage = project.images && project.images.length > 0 ? project.images[0] : '/charcoal-logo.png';

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `/works/${slug}`,
          type: 'article',
          images: [
            {
              url: coverImage,
              alt: project.title,
            },
          ],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: [coverImage],
        },
      };
    }

    // Category filter slug (e.g. Shelter, Livelihood, Community)
    const categoryTitle = `${slug} Works | ATBP Collaborative`;
    const categoryDesc = `Explore our curated portfolio of ${slug} architectural and interior projects.`;
    return {
      title: categoryTitle,
      description: categoryDesc,
      openGraph: {
        title: categoryTitle,
        description: categoryDesc,
        url: `/works/${slug}`,
      },
    };
  }
  
  return {
    title: 'Works Portfolio | ATBP Collaborative',
    description: 'Selected architecture, construction administration, and interior design works.',
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const [project, members, allProjects] = await Promise.all([
    getProjectById(decodedSlug),
    getMembers(),
    getProjects(),
  ]);

  return (
    <WorksSlugClient
      slug={slug}
      initialProject={project || null}
      initialMembers={members}
      initialProjects={allProjects}
    />
  );
}
