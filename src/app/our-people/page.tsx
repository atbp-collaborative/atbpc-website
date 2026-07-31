import { Suspense } from 'react';
import { OurPeoplePage } from '../../views/OurPeoplePage';
import { getMembers } from '../../lib/data/members';

export default async function Page() {
  const members = await getMembers();
  return (
    <Suspense fallback={null}>
      <OurPeoplePage members={members} />
    </Suspense>
  );
}
