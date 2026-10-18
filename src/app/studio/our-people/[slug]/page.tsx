import type { Metadata } from 'next';
import { getMemberById } from '@/services/dummy-data.service';
import { PeopleSlugClient } from './client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const member = await getMemberById(decodedSlug);

  if (member) {
    const title = `${member.name} - ${member.role} | ATBP Collaborative`;
    const description =
      member.bio || member.fullBio?.slice(0, 160) || `${member.name} at ATBP Collaborative.`;
    const avatar = member.image || '/charcoal-logo.png';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `/studio/our-people/${encodeURIComponent(slug)}`,
        type: 'profile',
        images: [
          {
            url: avatar,
            alt: member.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [avatar],
      },
    };
  }

  return {
    title: 'Team Member | ATBP Collaborative',
    description: 'Architecture and construction administration professionals at ATBP Collaborative.',
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <PeopleSlugClient slug={slug} />;
}
