import { notFound } from 'next/navigation';
import { MemberDetail } from '../../../components/MemberDetail';
import { getMemberById } from '../../../lib/data/members';
import { getProjects } from '../../../lib/data/projects';

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [member, projects] = await Promise.all([getMemberById(slug), getProjects()]);

  if (!member) {
    notFound();
  }

  return <MemberDetail member={member} projects={projects} />;
}
