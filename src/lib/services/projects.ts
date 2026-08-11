import { Project } from '@/types';
import { PROJECTS_DATA } from '@/dummy-data/projects';

// Reads from local dummy content today; swap the body for a Supabase/DB/CMS
// call later without changing any calling component.
export async function getProjects(): Promise<Project[]> {
  return PROJECTS_DATA;
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return PROJECTS_DATA.find((project) => project.id === id);
}
