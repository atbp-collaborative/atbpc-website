'use client';

import { StudioPlaceholderPage } from '../../placeholder';
import { useDocumentTitle } from '../../../../hooks/useDocumentTitle';

export default function Page() {
  useDocumentTitle('Comprehensive Services');
  return <StudioPlaceholderPage subpageId="comprehensive-services" />;
}
