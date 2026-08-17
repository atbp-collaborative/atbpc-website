import type { Metadata } from 'next';
import { getProjectById } from '@/lib/services/projects';
import WorksSlugClient from './client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  
  if (slug && slug !== 'All') {
    const project = await getProjectById(slug);
    if (project) {
      const category = project.mainCategory || project.category || 'Works';
      return { title: `ATBPC | ${category}` };
    }
    // If it's a category filter slug
    return { title: `ATBPC | ${slug}` };
  }
  
  return { title: 'ATBPC | Works' };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <WorksSlugClient slug={slug} />;
}
