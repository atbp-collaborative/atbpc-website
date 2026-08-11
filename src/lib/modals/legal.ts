import { Scale, Award, FileText, Building2 } from 'lucide-react';
import { ModalContent } from './types';

export const legalModalData: ModalContent = {
  name: 'Legal Notices',
  page: 'Footer',
  type: 'Legal',
  contents: {
    title: 'Legal & Regulatory Notices',
    subtitle: 'ATBP Collaborative • Licensed Architectural Practice',
    icon: Scale,
    intro: {
      title: 'Professional Practice Disclaimer',
      text: 'ATBP Collaborative operates under the licensed architectural practice of Architect Marchie Teodoro Borja. All professional services, contract drawings, technical specifications, and construction supervisions comply with Republic Act No. 9266 and Philippine building regulations.',
    },
    sections: [
      {
        icon: Award,
        title: '1. Professional Registration & Accreditation',
        list: [
          '<strong>Professional Regulation Code (RA 9266):</strong> Sec. 37 Architectural Practice Regulations.',
          '<strong>PRC Registration:</strong> Architect License No. 0054827 | Board of Architecture (PRC-BOA) Registration No. 0054827.',
          '<strong>PRC-BOMP Certification:</strong> Registration No. 0012169.',
          '<strong>SEC Registry:</strong> Registered One-Person Corporation (OPC) 2026.',
        ],
      },
      {
        icon: FileText,
        title: '2. Architectural Ownership & Copyright',
        text: 'Under Section 33 of Republic Act No. 9266 (The Architecture Act of 2004), drawings, specifications, CAD/BIM models, render visuals, and contract documents prepared by ATBP Collaborative as instruments of service are the intellectual property and copyright of the Architect.<br/><br/><span class="opacity-85 text-mini">Reproduction, modification, or re-use of design assets for other sites or projects without prior express written consent is strictly prohibited under Philippine copyright law.</span>',
      },
      {
        icon: Building2,
        title: '3. Honest & Transparent Construction Standard',
        text: 'ATBP Collaborative upholds an absolute transparent billing model across all design-build projects. Detailed bill of quantities (BOQ), material specifications, labor breakdowns, and subcontractor pricing are disclosed openly to clients without hidden markups.',
      },
    ],
  },
};
