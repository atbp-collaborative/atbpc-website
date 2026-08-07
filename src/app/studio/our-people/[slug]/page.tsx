import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MemberDetail } from '../../../../components/MemberDetail';
import { getMemberById } from '../../../../lib/data/members';
import { getProjects } from '../../../../lib/data/projects';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const member = await getMemberById(slug);
  return { title: member?.name };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [member, projects] = await Promise.all([getMemberById(slug), getProjects()]);

  if (!member) {
    notFound();
  }

  return <MemberDetail member={member} projects={projects} />;
}
