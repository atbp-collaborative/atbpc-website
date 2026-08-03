'use client';

import React from 'react';
import { ShieldCheck, FileText, UserCheck, Lock, Globe, Scale } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
}) => {
  return (
    <InfoModal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      icon={<ShieldCheck size={20} />}
      title="Privacy Policy"
      subtitle="ATBP Collaborative • Design-Build Practice"
      closeLabel="Close & Accept"
    >
      {/* Effective Date Note */}
      <div className={`p-4 border text-mini ${
        isDarkMode
          ? 'bg-white/5 border-space-sparkle/20 text-bright-gray/80'
          : 'bg-space-sparkle/5 border-space-sparkle/15 text-vintage-charcoal/80'
      }`}>
        <span className="font-semibold block uppercase tracking-wider mb-1">Effective Date: January 1, 2026</span>
        This Privacy Policy outlines how ATBP Collaborative (under the Licensed Architectural Practice of Marchie Teodoro Borja, PRC Registration No. 0054827 / SEC OPC) collects, uses, protects, and handles your data in compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) and professional guidelines governing design-build practices in the Philippines.
      </div>

      {/* Section 1 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
          <FileText size={18} className="opacity-70" />
          <h3>1. Information We Collect</h3>
        </div>
        <p className="opacity-90">
          When you interact with ATBP Collaborative—whether through our Discovery Intake form, project proposal requests, site consultation inquiries, or digital portals—we collect relevant information necessary to deliver architectural and construction services:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 opacity-85">
          <li><strong>Personal Identification:</strong> Full name, company affiliation, contact numbers, email address, and billing parameters.</li>
          <li><strong>Project & Site Coordinates:</strong> Property location, land title details, lot dimensions, topographic data, zoning constraints, budget brackets, and design preferences.</li>
          <li><strong>Technical & Media Assets:</strong> Architectural sketches, CAD/BIM models, reference images, site photos, and technical documentation uploaded during consultations.</li>
          <li><strong>Digital Usage Data:</strong> Anonymized browser metadata, device identifiers, and page interaction statistics collected via cookies to optimize website performance.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
          <UserCheck size={18} className="opacity-70" />
          <h3>2. How We Use Your Information</h3>
        </div>
        <p className="opacity-90">
          All collected data is processed strictly for legitimate architectural and design-build operations:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 opacity-85">
          <li>Formulating custom design proposals, project scopes, cost estimations, and architectural contracts.</li>
          <li>Managing Discovery Meetings, site inspections, design reviews, and construction phase coordination.</li>
          <li>Facilitating local government unit (LGU) building permit applications, zoning compliance, and regulatory submissions under Republic Act No. 9266 (The Architecture Act of 2004).</li>
          <li>Communicating project updates, milestone deliverables, and administrative invoices.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
          <Lock size={18} className="opacity-70" />
          <h3>3. Data Security & Intellectual Property Safeguards</h3>
        </div>
        <p className="opacity-90">
          We implement robust physical, technical, and organizational security measures to protect your personal and project information against unauthorized access, loss, or alteration:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 opacity-85">
          <li>Confidential project files and client blueprints are stored on encrypted cloud servers with strict role-based access controls.</li>
          <li>All architectural designs, structural calculations, and technical documentation produced by ATBP Collaborative remain protected under professional copyright and RA 9266 laws.</li>
          <li>We never sell, trade, or rent client personal or project data to external marketers or unauthorized third parties.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
          <Globe size={18} className="opacity-70" />
          <h3>4. Third-Party Disclosures & Sub-Consultants</h3>
        </div>
        <p className="opacity-90">
          To execute comprehensive design-build projects, we may share essential project specifications with authorized third parties strictly on a need-to-know basis:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 opacity-85">
          <li>Licensed engineering sub-consultants (Structural, MEPFS, Sanitary, Geotechnical specialists).</li>
          <li>Contracted construction crews, material suppliers, and specialized fabricators.</li>
          <li>Government regulatory bodies (Building Officials, Fire Marshals, Subdivision Associations) for legal permit processing.</li>
        </ul>
      </section>

      {/* Section 5 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
          <Scale size={18} className="opacity-70" />
          <h3>5. Your Rights & Retention</h3>
        </div>
        <p className="opacity-90">
          Under the Philippine Data Privacy Act of 2012, you hold the right to:
        </p>
        <ul className="list-disc pl-6 space-y-1.5 opacity-85">
          <li>Request access to the personal data we hold about you.</li>
          <li>Request correction or updates to inaccurate project details.</li>
          <li>Withdraw consent or request erasure of non-statutory records (subject to mandatory legal retention periods for building plans).</li>
        </ul>
      </section>

      {/* Section 6 - Contact */}
      <section className={`p-5 border space-y-2 text-mini ${
        isDarkMode
          ? 'bg-white/5 border-space-sparkle/20'
          : 'bg-space-sparkle/5 border-space-sparkle/15'
      }`}>
        <h4 className="font-sans font-bold text-caption uppercase tracking-wider">Contact Our Privacy Officer</h4>
        <p className="opacity-80">
          If you have questions, concerns, or requests regarding this Privacy Policy or your data, please contact ATBP Collaborative:
        </p>
        <div className="pt-2 font-mono text-mini opacity-90 space-y-0.5">
          <p>Email: <a href="mailto:enquire@atbpcollaborative.com" className="underline hover:opacity-100">enquire@atbpcollaborative.com</a></p>
          <p>Practice Principal: Marchie Teodoro Borja, Architect (PRC No. 0054827)</p>
          <p>Address: Metro Manila, Philippines</p>
        </div>
      </section>
    </InfoModal>
  );
};
