import { Shield } from 'lucide-react';
import { ModalContent } from './types';

export const careerPrivacyModalData: ModalContent = {
  name: 'Career Privacy',
  page: 'Careers',
  type: 'Privacy',
  contents: {
    title: 'Privacy Statement',
    subtitle: 'ATBP Collaborative • Data Privacy',
    icon: Shield,
    closeLabel: 'Understood',
    items: [
      '<p>ATBP Collaborative is committed to safeguarding the privacy and personal credentials of all applicants in accordance with Republic Act No. 10173 (Data Privacy Act of 2012).</p>',
      '<p>Any personal identifiers, contact numbers, links, video intros, or portfolio materials provided through this application portal are collected strictly for talent recruitment, portfolio evaluation, and potential employment assessment.</p>',
      '<p>Your information will remain strictly confidential within our practice management and will never be disclosed to third parties without your explicit consent.</p>'
    ]
  },
};
