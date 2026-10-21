import { getHomeCarouselImages } from '@/services/dummy-data.service';
import { HeroCarouselClient } from '@/components/blocks/HeroCarouselClient';

export const revalidate = 60;

export default async function HeroPage() {
  const carouselImages = await getHomeCarouselImages();
  return <HeroCarouselClient initialImages={carouselImages} />;
}
