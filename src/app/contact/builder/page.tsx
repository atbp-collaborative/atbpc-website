'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, FileText, Upload, Shield, X } from 'lucide-react';
import { useTheme } from '../../../lib/theme-context';

interface FileState {
  name: string;
  size: string;
}

export default function BuilderPage() {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    companyName: '',
    specialty: '',
    typology: '',
    profileLink: '',
    coverVideoLink: '',
    mapLink: '',
    licenseLink: '',
    firstName: '',
    pseudonym: '',
    middleName: '',
    lastName: '',
    pronoun: '',
    titles: '',
    address: '',
    contactNumber: '',
    landline: '',
    email: '',
    facebook: '',
    instagram: '',
  });

  const [documentFile, setDocumentFile] = useState<FileState | null>(null);
  const [documentDragOver, setDocumentDragOver] = useState(false);

  const [registrationFile, setRegistrationFile] = useState<FileState | null>(null);
  const [registrationDragOver, setRegistrationDragOver] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);

  const documentInputRef = useRef<HTMLInputElement>(null);
  const registrationInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your Sample Contract.');
        return;
      }
      setDocumentFile({ name: file.name, size: formatFileSize(file.size) });
    }
  };

  const handleDocumentDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDocumentDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your Sample Contract.');
        return;
      }
      setDocumentFile({ name: file.name, size: formatFileSize(file.size) });
    }
  };

  const handleRegistrationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your Registration Verification.');
        return;
      }
      setRegistrationFile({ name: file.name, size: formatFileSize(file.size) });
    }
  };

  const handleRegistrationDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setRegistrationDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your Registration Verification.');
        return;
      }
      setRegistrationFile({ name: file.name, size: formatFileSize(file.size) });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      specialty: '',
      typology: '',
      profileLink: '',
      coverVideoLink: '',
      mapLink: '',
      licenseLink: '',
      firstName: '',
      pseudonym: '',
      middleName: '',
      lastName: '',
      pronoun: '',
      titles: '',
      address: '',
      contactNumber: '',
      landline: '',
      email: '',
      facebook: '',
      instagram: '',
    });
    setDocumentFile(null);
    setRegistrationFile(null);
    setIsSubmitted(false);
  };

  const specialties = [
    'General Building Contractor',
    'Architectural Fit-Out & Joinery',
    'Structural Steel & Concrete Framing',
    'MEPFS (Mechanical, Electrical, Plumbing, Sanitary, Fire Protection)',
    'Specialized Modular & Pod Construction',
    'Facade, Enclosure & Curtain Wall Assemblies',
    'Civil Works & Site Infrastructure',
  ];

  const typologies = [
    'High-End Residential & Case Study Houses',
    'Commercial & F&B Retail Spaces',
    'Hospitality & Resort Developments',
    'Institutional & Cultural Buildings',
    'Industrial & High-Density Logistics',
    'Heritage Preservation & Adaptive Reuse',
  ];

  const inputBorderClass = isDarkMode
    ? 'border-bright-gray/30 focus:border-bright-gray bg-vintage-charcoal/50 text-white placeholder-bright-gray/40'
    : 'border-vintage-charcoal/30 focus:border-vintage-charcoal bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40';

  return (
    <motion.div
      key="partner-builder"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full max-h-[calc(100vh-80px)] overflow-hidden flex flex-col px-4 sm:px-8 py-3 select-none"
    >
      {/* Header Title */}
      <div className="mb-3 shrink-0">
        <h1 className="font-sans text-h1 sm:text-hero font-bold tracking-tight leading-none lowercase">
          be our partner builder
        </h1>
        <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
          we need to know if you share the same values, integrity and culture.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="builder-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-2"
          >
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-2.5 justify-between">
              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-caption font-semibold block opacity-90">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  placeholder="-"
                  className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none transition-all ${inputBorderClass}`}
                />
              </div>

              {/* Specialty */}
              <div className="space-y-1">
                <label className="text-caption font-semibold block opacity-90">
                  Specialty
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className={`w-full text-caption py-1.5 px-3 rounded-lg border outline-none transition-all cursor-pointer ${inputBorderClass}`}
                >
                  <option value="" disabled>
                    What Specialty?
                  </option>
                  {specialties.map((sp) => (
                    <option key={sp} value={sp} className="bg-vintage-charcoal text-white">
                      {sp}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialized Typology */}
              <div className="space-y-1">
                <label className="text-caption font-semibold block opacity-90">
                  Specialized Typology
                </label>
                <select
                  name="typology"
                  value={formData.typology}
                  onChange={handleInputChange}
                  className={`w-full text-caption py-1.5 px-3 rounded-lg border outline-none transition-all cursor-pointer ${inputBorderClass}`}
                >
                  <option value="" disabled>
                    What Typology?
                  </option>
                  {typologies.map((tp) => (
                    <option key={tp} value={tp} className="bg-vintage-charcoal text-white">
                      {tp}
                    </option>
                  ))}
                </select>
              </div>

              {/* 6 Boxes Grid (Row 1: Profile, Documents, Cover Video | Row 2: Map, License, Registration) */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {/* Row 1 Box 1: Profile (!) */}
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Profile <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-[72px] p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="profileLink"
                      value={formData.profileLink}
                      onChange={handleInputChange}
                      placeholder="Paste Here Link to Flipbook. (Sorry No PDF)"
                      className="w-full h-full bg-transparent text-[10px] leading-tight outline-none resize-none placeholder-inherit"
                    />
                  </div>
                </div>

                {/* Row 1 Box 2: Documents (!) */}
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Documents <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <input
                    type="file"
                    ref={documentInputRef}
                    onChange={handleDocumentChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDocumentDragOver(true);
                    }}
                    onDragLeave={() => setDocumentDragOver(false)}
                    onDrop={handleDocumentDrop}
                    onClick={() => documentInputRef.current?.click()}
                    className={`h-[72px] p-2 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      documentDragOver
                        ? 'border-space-sparkle bg-space-sparkle/10'
                        : inputBorderClass
                    }`}
                  >
                    {documentFile ? (
                      <div className="space-y-0.5 max-w-full px-1">
                        <FileText size={14} className="mx-auto text-space-sparkle" />
                        <p className="text-[10px] font-medium truncate opacity-90">{documentFile.name}</p>
                        <p className="text-[9px] opacity-60">{documentFile.size}</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <Upload size={13} className="mx-auto opacity-70" />
                        <p className="text-[10px] leading-tight font-medium opacity-80">
                          Sample Contract <span className="block opacity-60 text-[9px]">(PDF)</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 1 Box 3: Cover Video (!) */}
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Cover Video <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-[72px] p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="coverVideoLink"
                      value={formData.coverVideoLink}
                      onChange={handleInputChange}
                      placeholder="Paste Here Link to Cover Video"
                      className="w-full h-full bg-transparent text-[10px] leading-tight outline-none resize-none placeholder-inherit"
                    />
                  </div>
                </div>

                {/* Row 2 Box 1: Map (!) */}
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Map <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-[72px] p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="mapLink"
                      value={formData.mapLink}
                      onChange={handleInputChange}
                      placeholder="Map Link to Office / HQ. (Sorry No PDF)"
                      className="w-full h-full bg-transparent text-[10px] leading-tight outline-none resize-none placeholder-inherit"
                    />
                  </div>
                </div>

                {/* Row 2 Box 2: License (!) */}
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    License <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-[72px] p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="licenseLink"
                      value={formData.licenseLink}
                      onChange={handleInputChange}
                      placeholder="PCAB License Verification (Link to PCAB)"
                      className="w-full h-full bg-transparent text-[10px] leading-tight outline-none resize-none placeholder-inherit"
                    />
                  </div>
                </div>

                {/* Row 2 Box 3: Registration (!) */}
                <div className="space-y-0.5">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Registration <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <input
                    type="file"
                    ref={registrationInputRef}
                    onChange={handleRegistrationChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setRegistrationDragOver(true);
                    }}
                    onDragLeave={() => setRegistrationDragOver(false)}
                    onDrop={handleRegistrationDrop}
                    onClick={() => registrationInputRef.current?.click()}
                    className={`h-[72px] p-2 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      registrationDragOver
                        ? 'border-space-sparkle bg-space-sparkle/10'
                        : inputBorderClass
                    }`}
                  >
                    {registrationFile ? (
                      <div className="space-y-0.5 max-w-full px-1">
                        <FileText size={14} className="mx-auto text-space-sparkle" />
                        <p className="text-[10px] font-medium truncate opacity-90">{registrationFile.name}</p>
                        <p className="text-[9px] opacity-60">{registrationFile.size}</p>
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <Upload size={13} className="mx-auto opacity-70" />
                        <p className="text-[10px] leading-tight font-medium opacity-80">
                          SEC / BIR / DTI Verification <span className="block opacity-60 text-[9px]">(Consolidated PDF)</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-2.5 justify-between">
              {/* Row 1: First Name & Pseudonym */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="-"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">
                    Pseudonym <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <input
                    type="text"
                    name="pseudonym"
                    value={formData.pseudonym}
                    onChange={handleInputChange}
                    placeholder="-"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
              </div>

              {/* Row 2: Middle Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90 truncate">
                    Middle Name <span className="text-[10px] font-normal opacity-70">(Mother's Maiden Last Name)</span>
                  </label>
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    placeholder="-"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="-"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
              </div>

              {/* Row 3: Pronoun & Titles */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Pronoun</label>
                  <input
                    type="text"
                    name="pronoun"
                    value={formData.pronoun}
                    onChange={handleInputChange}
                    placeholder="-"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Titles</label>
                  <input
                    type="text"
                    name="titles"
                    value={formData.titles}
                    onChange={handleInputChange}
                    placeholder="-"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
              </div>

              {/* Row 4: Addresses */}
              <div className="space-y-0.5">
                <label className="text-caption font-semibold block opacity-90">
                  Addresses (Office / Warehouse / Facility)
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Complete Address"
                  className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                />
              </div>

              {/* Row 5: Contact Number & Landline */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    placeholder="Viber & Whatsapp Ready"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Landline</label>
                  <input
                    type="text"
                    name="landline"
                    value={formData.landline}
                    onChange={handleInputChange}
                    placeholder="Viber & Whatsapp Ready"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
              </div>

              {/* Row 6: Email Address */}
              <div className="space-y-0.5">
                <label className="text-caption font-semibold block opacity-90">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="-"
                  className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                />
              </div>

              {/* Row 7: Facebook & Instagram */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Facebook</label>
                  <input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="Paste URL / Link / Handle"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-caption font-semibold block opacity-90">Instagram</label>
                  <input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="Paste URL / Link / Handle"
                    className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConditionsModal(true)}
                  className={`py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass}`}
                >
                  General Conditions
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`my-auto p-8 rounded-2xl border text-center space-y-4 max-w-md mx-auto ${inputBorderClass}`}
          >
            <CheckCircle size={40} className="mx-auto text-space-sparkle animate-bounce" />
            <h2 className="text-h2 font-bold tracking-tight">Builder Registration Submitted</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              Thank you for applying as a partner builder with ATBP Collaborative. Our project directorate will review your PCAB credentials, sample contract, and site capabilities.
            </p>
            <button
              onClick={resetForm}
              className={`py-2 px-6 rounded-xl border text-caption font-semibold cursor-pointer ${inputBorderClass}`}
            >
              Submit Another Application
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* General Conditions Modal */}
      <AnimatePresence>
        {showConditionsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-lg p-6 rounded-2xl border space-y-4 relative ${
                isDarkMode ? 'bg-vintage-charcoal text-white border-space-sparkle/30' : 'bg-white text-vintage-charcoal border-space-sparkle/20'
              }`}
            >
              <button
                onClick={() => setShowConditionsModal(false)}
                className="absolute top-4 right-4 p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-2 text-space-sparkle">
                <Shield size={20} />
                <h3 className="text-h3 font-bold">General Conditions for Builder Partnership</h3>
              </div>

              <div className="text-caption space-y-2 opacity-85 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  1. <strong>Licensing & Integrity:</strong> Partner builders must hold valid PCAB licenses and tax registrations (BIR / SEC / DTI) matching their declared scope of work and construction category.
                </p>
                <p>
                  2. <strong>Workmanship Standards:</strong> All construction methods, site safety protocols, and material assemblies must adhere strictly to ATBP Collaborative architectural blueprints and specifications.
                </p>
                <p>
                  3. <strong>Contractual Transparency:</strong> Sample contracts and project execution methodologies are verified for cost-transparency, delay penalties, and warranty guarantees.
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowConditionsModal(false)}
                  className="px-5 py-2 bg-space-sparkle text-bright-gray text-caption font-semibold rounded-xl hover:bg-space-sparkle/90 cursor-pointer"
                >
                  Acknowledged
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
