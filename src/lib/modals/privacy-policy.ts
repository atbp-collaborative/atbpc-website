import { ShieldCheck, FileText, UserCheck, Lock, Globe, Scale } from 'lucide-react';
import { ModalContent } from './types';

export const privacyPolicyModalData: ModalContent = {
  name: 'Privacy Policy',
  page: 'Footer',
  type: 'Privacy',
  contents: {
    title: 'Privacy Policy',
    subtitle: 'ATBP Collaborative • Design-Build Practice',
    icon: ShieldCheck,
    closeLabel: 'Close & Accept',
    intro: {
      title: 'Effective Date: January 1, 2026',
      text: 'This Privacy Policy outlines how ATBP Collaborative (under the Licensed Architectural Practice of Marchie Teodoro Borja, PRC Registration No. 0054827 / SEC OPC) collects, uses, protects, and handles your data in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) and professional guidelines governing design-build practices in the Philippines.',
    },
    sections: [
      {
        icon: FileText,
        title: '1. Information We Collect',
        text: 'When you interact with ATBP Collaborative—whether through our Discovery Intake form, project proposal requests, site consultation inquiries, or digital portals—we collect relevant information necessary to deliver architectural and construction services:',
        list: [
          '<strong>Personal Identification:</strong> Full name, company affiliation, contact numbers, email address, and billing parameters.',
          '<strong>Project & Site Coordinates:</strong> Property location, land title details, lot dimensions, topographic data, zoning constraints, budget brackets, and design preferences.',
          '<strong>Technical & Media Assets:</strong> Architectural sketches, CAD/BIM models, reference images, site photos, and technical documentation uploaded during consultations.',
          '<strong>Digital Usage Data:</strong> Anonymized browser metadata, device identifiers, and page interaction statistics collected via cookies to optimize website performance.',
        ],
      },
      {
        icon: UserCheck,
        title: '2. How We Use Your Information',
        text: 'All collected data is processed strictly for legitimate architectural and design-build operations:',
        list: [
          'Formulating custom design proposals, project scopes, cost estimations, and architectural contracts.',
          'Managing Discovery Sessions, site inspections, design reviews, and construction phase coordination.',
          'Facilitating local government unit (LGU) building permit applications, zoning compliance, and regulatory submissions under Republic Act No. 9266 (The Architecture Act of 2004).',
          'Communicating project updates, milestone deliverables, and administrative invoices.',
        ],
      },
      {
        icon: Lock,
        title: '3. Data Security & Intellectual Property Safeguards',
        text: 'We implement robust physical, technical, and organizational security measures to protect your personal and project information against unauthorized access, loss, or alteration:',
        list: [
          'Confidential project files and client blueprints are stored on encrypted cloud servers with strict role-based access controls.',
          'All architectural designs, structural calculations, and technical documentation produced by ATBP Collaborative remain protected under professional copyright and RA 9266 laws.',
          'We never sell, trade, or rent client personal or project data to external marketers or unauthorized third parties.',
        ],
      },
      {
        icon: Globe,
        title: '4. Third-Party Disclosures & Sub-Consultants',
        text: 'To execute comprehensive design-build projects, we may share essential project specifications with authorized third parties strictly on a need-to-know basis:',
        list: [
          'Licensed engineering sub-consultants (Structural, MEPFS, Sanitary, Geotechnical specialists).',
          'Contracted construction crews, material suppliers, and specialized fabricators.',
          'Government regulatory bodies (Building Officials, Fire Marshals, Subdivision Associations) for legal permit processing.',
        ],
      },
      {
        icon: Scale,
        title: '5. Your Rights & Retention',
        text: 'Under the Philippine Data Privacy Act of 2012, you hold the right to:',
        list: [
          'Request access to the personal data we hold about you.',
          'Request correction or updates to inaccurate project details.',
          'Withdraw consent or request erasure of non-statutory records (subject to mandatory legal retention periods for building plans).',
        ],
      },
    ],
    items: [
      '<div class="p-5 border mt-4 border-space-sparkle/20 bg-space-sparkle/5 dark:bg-white/5 text-mini"><h4 class="font-sans font-bold text-caption uppercase tracking-wider mb-2">Contact Our Privacy Officer</h4><p class="opacity-80 mb-2">If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact ATBP Collaborative:</p><div class="font-mono text-mini opacity-90 space-y-0.5"><p>Email: <a href="mailto:enquire@atbpcollaborative.com" class="underline hover:opacity-100">enquire@atbpcollaborative.com</a></p><p>Practice Principal: Marchie Teodoro Borja, Architect (PRC No. 0054827)</p><p>Address: Metro Manila, Philippines</p></div></div>'
    ]
  },
};
