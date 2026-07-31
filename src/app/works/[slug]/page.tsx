import { notFound } from 'next/navigation';
import { ProjectDetail } from '../../../components/ProjectDetail';
import { getProjectById } from '../../../lib/data/projects';
import { getMembers } from '../../../lib/data/members';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, members] = await Promise.all([getProjectById(slug), getMembers()]);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} members={members} />;
}
