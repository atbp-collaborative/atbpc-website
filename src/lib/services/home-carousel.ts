import { HOME_CAROUSEL_DATA, HomeCarouselImage } from '@/dummy-data/home-carousel';

// Reads from local dummy content today; swap the body for a Supabase/DB/CMS
// call later without changing any calling component.
export async function getHomeCarouselImages(): Promise<HomeCarouselImage[]> {
  return HOME_CAROUSEL_DATA;
}
