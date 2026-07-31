import { Suspense } from 'react';
import { WorksPage } from '../../views/WorksPage';
import { getProjects } from '../../lib/data/projects';

export default async function Page() {
  const projects = await getProjects();
  return (
    <Suspense fallback={null}>
      <WorksPage projects={projects} />
    </Suspense>
  );
}
