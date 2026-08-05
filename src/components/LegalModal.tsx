'use client';

import React from 'react';
import { Scale, Award, FileText, Building2 } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      icon={<Scale size={20} />}
      title="Legal & Regulatory Notices"
      subtitle="ATBP Collaborative • Licensed Architectural Practice"
    >
      <div className={`p-4 border text-mini ${
        isDarkMode
          ? 'bg-white/5 border-space-sparkle/20 text-bright-gray/80'
          : 'bg-space-sparkle/5 border-space-sparkle/15 text-vintage-charcoal/80'
      }`}>
        <span className="font-semibold block uppercase tracking-wider mb-1">Professional Practice Disclaimer</span>
        ATBP Collaborative operates under the licensed architectural practice of Architect Marchie Teodoro Borja. All professional services, contract drawings, technical specifications, and construction supervisions comply with Republic Act No. 9266 and Philippine building regulations.
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h2 font-sans font-bold tracking-tight">
          <Award size={18} className="opacity-70" />
          <h3>1. Professional Registration & Accreditation</h3>
        </div>
        <div className="space-y-2 opacity-90">
          <p><strong>Professional Regulation Code (RA 9266):</strong> Sec. 37 Architectural Practice Regulations.</p>
          <p><strong>PRC Registration:</strong> Architect License No. 0054827 | Board of Architecture (PRC-BOA) Registration No. 0054827.</p>
          <p><strong>PRC-BOMP Certification:</strong> Registration No. 0012169.</p>
          <p><strong>SEC Registry:</strong> Registered One-Person Corporation (OPC) 2026.</p>
        </div>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h2 font-sans font-bold tracking-tight">
          <FileText size={18} className="opacity-70" />
          <h3>2. Architectural Ownership & Copyright</h3>
        </div>
        <p className="opacity-90">
          Under Section 33 of Republic Act No. 9266 (The Architecture Act of 2004), drawings, specifications, CAD/BIM models, render visuals, and contract documents prepared by ATBP Collaborative as instruments of service are the intellectual property and copyright of the Architect.
        </p>
        <p className="opacity-85 text-mini">
          Reproduction, modification, or re-use of design assets for other sites or projects without prior express written consent is strictly prohibited under Philippine copyright law.
        </p>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h2 font-sans font-bold tracking-tight">
          <Building2 size={18} className="opacity-70" />
          <h3>3. Honest & Transparent Construction Standard</h3>
        </div>
        <p className="opacity-90">
          ATBP Collaborative upholds an absolute transparent billing model across all design-build projects. Detailed bill of quantities (BOQ), material specifications, labor breakdowns, and subcontractor pricing are disclosed openly to clients without hidden markups.
        </p>
      </section>
    </InfoModal>
  );
};
