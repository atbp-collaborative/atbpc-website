'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, FileText, Upload, Shield, X } from 'lucide-react';
import { useTheme } from '../../../lib/theme-context';

interface FileState {
  name: string;
  size: string;
}

export default function SupplierPage() {
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    message: '',
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
    websiteLink: '',
  });

  const [catalogFile, setCatalogFile] = useState<FileState | null>(null);
  const [catalogDragOver, setCatalogDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);

  const catalogInputRef = useRef<HTMLInputElement>(null);

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

  const handleCatalogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your catalog.');
        return;
      }
      setCatalogFile({ name: file.name, size: formatFileSize(file.size) });
    }
  };

  const handleCatalogDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setCatalogDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your catalog.');
        return;
      }
      setCatalogFile({ name: file.name, size: formatFileSize(file.size) });
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
      category: '',
      message: '',
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
      websiteLink: '',
    });
    setCatalogFile(null);
    setIsSubmitted(false);
  };

  const categories = [
    'Architectural Hardware & Metals',
    'Millwork, Timber & Joinery',
    'Stone, Ceramics & Tile Assemblies',
    'Lighting & Electrical Controls',
    'Glass, Glazing & Facade Systems',
    'Sanitaryware & Plumbing Fixtures',
    'F&B Equipment & Commercial Kitchen',
    'Finishes, Paints & Wall Coverings',
    'Acoustic Panels & Insulations',
    'Landscaping & Outdoor Materials',
  ];

  const inputBorderClass = isDarkMode
    ? 'border-bright-gray/30 focus:border-bright-gray bg-vintage-charcoal/50 text-white placeholder-bright-gray/40'
    : 'border-vintage-charcoal/30 focus:border-vintage-charcoal bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40';

  return (
    <motion.div
      key="supplier-specifications"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full max-h-[calc(100vh-80px)] overflow-hidden flex flex-col px-4 sm:px-8 py-3 select-none"
    >
      {/* Header Title */}
      <div className="mb-3 shrink-0">
        <h1 className="font-sans text-h1 sm:text-hero font-bold tracking-tight leading-none lowercase">
          supply us with quality specifications
        </h1>
        <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
          we qualify all products before specifying them on projects entrusted to us by our clients
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="supplier-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-2"
          >
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-3 justify-between">
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
                  className={`w-full text-caption px-3 py-2 rounded-lg border outline-none transition-all ${inputBorderClass}`}
                />
              </div>

              {/* Brief Description / Category */}
              <div className="space-y-1">
                <label className="text-caption font-semibold block opacity-90">
                  Brief Description
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full text-caption py-2 px-3 rounded-lg border outline-none transition-all cursor-pointer ${inputBorderClass}`}
                >
                  <option value="" disabled>
                    What category?
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="bg-vintage-charcoal text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message Box */}
              <div className="flex-1 flex flex-col min-h-[120px] space-y-1">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Message (200 Word Count)"
                  className={`w-full flex-1 p-3 rounded-lg border outline-none resize-none text-caption transition-all ${inputBorderClass}`}
                />
              </div>

              {/* Bottom Row: Catalog & Website */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Catalog Upload */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Catalog <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <input
                    type="file"
                    ref={catalogInputRef}
                    onChange={handleCatalogChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setCatalogDragOver(true);
                    }}
                    onDragLeave={() => setCatalogDragOver(false)}
                    onDrop={handleCatalogDrop}
                    onClick={() => catalogInputRef.current?.click()}
                    className={`h-20 p-2 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      catalogDragOver
                        ? 'border-space-sparkle bg-space-sparkle/10'
                        : inputBorderClass
                    }`}
                  >
                    {catalogFile ? (
                      <div className="space-y-0.5 max-w-full px-1">
                        <FileText size={16} className="mx-auto text-space-sparkle" />
                        <p className="text-[10px] font-medium truncate opacity-90">{catalogFile.name}</p>
                        <p className="text-[9px] opacity-60">{catalogFile.size}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload size={14} className="mx-auto opacity-70" />
                        <p className="text-[10px] leading-tight font-medium opacity-80">
                          Click / Drag to Upload <span className="block opacity-60 text-[9px]">(PDF Only)</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Website Link */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Website <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-20 p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="websiteLink"
                      value={formData.websiteLink}
                      onChange={handleInputChange}
                      placeholder="Paste Here Link to Website"
                      className="w-full h-full bg-transparent text-[10px] leading-tight outline-none resize-none placeholder-inherit"
                    />
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
            <h2 className="text-h2 font-bold tracking-tight">Specification Request Received</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              Thank you for submitting your product specifications. Our technical procurement team will evaluate your material catalog for upcoming ATBP Collaborative projects.
            </p>
            <button
              onClick={resetForm}
              className={`py-2 px-6 rounded-xl border text-caption font-semibold cursor-pointer ${inputBorderClass}`}
            >
              Submit Another Specification
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
                <h3 className="text-h3 font-bold">General Conditions for Product Qualification</h3>
              </div>

              <div className="text-caption space-y-2 opacity-85 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  1. <strong>Quality Verification:</strong> All submitted material specifications, MSDS documents, and physical catalogs are pre-screened according to strict structural, aesthetic, and environmental sustainability standards prior to studio specification.
                </p>
                <p>
                  2. <strong>Warranty & Lead Times:</strong> Suppliers must provide verified lead times and manufacturer warranty coverage for custom millwork, finishes, and specialized hardware.
                </p>
                <p>
                  3. <strong>Data Confidentiality:</strong> Product documentation provided through this portal will be archived exclusively for internal procurement, mock-up schedules, and client bill-of-quantity estimations.
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
