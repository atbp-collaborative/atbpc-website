import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, FileText, Upload, Shield, X } from 'lucide-react';

interface CareerPageProps {
  isDarkMode: boolean;
}

interface FileState {
  name: string;
  size: string;
}

export const CareerPage: React.FC<CareerPageProps> = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({
    department: '',
    structure: '',
    jobDescription: '',
    firstName: '',
    pseudonym: '',
    middleName: '',
    lastName: '',
    pronoun: '',
    titles: '',
    location: '',
    contactNumber: '',
    email: '',
    facebook: '',
    instagram: '',
    portfolioLink: '',
    coverVideoLink: '',
  });

  const [resumeFile, setResumeFile] = useState<FileState | null>(null);
  const [resumeDragOver, setResumeDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const resumeInputRef = useRef<HTMLInputElement>(null);

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

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your resume.');
        return;
      }
      setResumeFile({ name: file.name, size: formatFileSize(file.size) });
    }
  };

  const handleResumeDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setResumeDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file for your resume.');
        return;
      }
      setResumeFile({ name: file.name, size: formatFileSize(file.size) });
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
      department: '',
      structure: '',
      jobDescription: '',
      firstName: '',
      pseudonym: '',
      middleName: '',
      lastName: '',
      pronoun: '',
      titles: '',
      location: '',
      contactNumber: '',
      email: '',
      facebook: '',
      instagram: '',
      portfolioLink: '',
      coverVideoLink: '',
    });
    setResumeFile(null);
    setIsSubmitted(false);
  };

  const departments = [
    'Architectural Design & Research',
    'Interior & Spatial Design',
    'Engineering & Construction Support',
    'Modular & F&B Practice',
    'Studio Operations & Administration',
  ];

  const structures = [
    'Full-Time Practice',
    'Apprenticeship / Junior Architect',
    'Project-Based Consultancy',
    'Internship Fellowship',
  ];

  const inputBorderClass = isDarkMode
    ? 'border-bright-gray/30 focus:border-bright-gray bg-vintage-charcoal/50 text-white placeholder-bright-gray/40'
    : 'border-vintage-charcoal/30 focus:border-vintage-charcoal bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40';

  return (
    <motion.div
      key="grow-with-us"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-full max-h-[calc(100vh-80px)] overflow-hidden flex flex-col px-4 sm:px-8 py-3 select-none"
    >
      {/* Title Header */}
      <div className="mb-3 shrink-0">
        <h1 className="font-sans text-h1 sm:text-hero font-bold tracking-tight leading-none lowercase">
          grow with us
        </h1>
        <p className="text-caption sm:text-body font-light opacity-80 mt-1 lowercase">
          are you currently in search of a practice that could support your future?
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.form
            key="grow-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="w-full flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-y-auto lg:overflow-hidden pb-2"
          >
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-3 justify-between">
              {/* Department */}
              <div className="space-y-1">
                <label className="text-caption font-semibold block opacity-90">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`w-full text-caption py-2 px-3 rounded-lg border outline-none transition-all cursor-pointer ${inputBorderClass}`}
                >
                  <option value="" disabled>
                    In which department do you see your growth?
                  </option>
                  {departments.map((dep) => (
                    <option key={dep} value={dep} className="bg-vintage-charcoal text-white">
                      {dep}
                    </option>
                  ))}
                </select>
              </div>

              {/* Structure */}
              <div className="space-y-1">
                <label className="text-caption font-semibold block opacity-90">
                  Structure
                </label>
                <select
                  name="structure"
                  value={formData.structure}
                  onChange={handleInputChange}
                  className={`w-full text-caption py-2 px-3 rounded-lg border outline-none transition-all cursor-pointer ${inputBorderClass}`}
                >
                  <option value="" disabled>
                    What kind of role are you exploring?
                  </option>
                  {structures.map((st) => (
                    <option key={st} value={st} className="bg-vintage-charcoal text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Description Box */}
              <div className="flex-1 flex flex-col min-h-[120px] space-y-1">
                <textarea
                  name="jobDescription"
                  value={formData.jobDescription}
                  onChange={handleInputChange}
                  placeholder="Job Description Here"
                  className={`w-full flex-1 p-3 rounded-lg border outline-none resize-none text-caption transition-all ${inputBorderClass}`}
                />
              </div>

              {/* Bottom Row: Resume, Portfolio, Cover Video */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {/* Resume Upload */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Resume <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={handleResumeChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setResumeDragOver(true);
                    }}
                    onDragLeave={() => setResumeDragOver(false)}
                    onDrop={handleResumeDrop}
                    onClick={() => resumeInputRef.current?.click()}
                    className={`h-20 p-2 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      resumeDragOver
                        ? 'border-space-sparkle bg-space-sparkle/10'
                        : inputBorderClass
                    }`}
                  >
                    {resumeFile ? (
                      <div className="space-y-0.5 max-w-full px-1">
                        <FileText size={16} className="mx-auto text-space-sparkle" />
                        <p className="text-[10px] font-medium truncate opacity-90">{resumeFile.name}</p>
                        <p className="text-[9px] opacity-60">{resumeFile.size}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload size={14} className="mx-auto opacity-70" />
                        <p className="text-[10px] leading-tight font-medium opacity-80">
                          Click / Drag to Upload Resume <span className="block opacity-60 text-[9px]">(PDF Only)</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Portfolio Link */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Portfolio <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-20 p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleInputChange}
                      placeholder="Paste Here Link to Flipbook. (Sorry No PDF)"
                      className="w-full h-full bg-transparent text-[10px] leading-tight outline-none resize-none placeholder-inherit"
                    />
                  </div>
                </div>

                {/* Cover Video Link */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold block opacity-90 truncate">
                    Cover Video <span className="text-space-sparkle font-normal">(!)</span>
                  </label>
                  <div className={`h-20 p-2 border rounded-xl flex flex-col justify-center ${inputBorderClass}`}>
                    <textarea
                      name="coverVideoLink"
                      value={formData.coverVideoLink}
                      onChange={handleInputChange}
                      placeholder="Paste Here Link to Cover Video"
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

              {/* Row 4: Location */}
              <div className="space-y-0.5">
                <label className="text-caption font-semibold block opacity-90">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Complete Address"
                  className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                />
              </div>

              {/* Row 5: Contact Number */}
              <div className="space-y-0.5">
                <label className="text-caption font-semibold block opacity-90">Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Must be Viber & Whatsapp Ready"
                  className={`w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${inputBorderClass}`}
                />
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
                  onClick={() => setShowPrivacyModal(true)}
                  className={`py-2 px-4 rounded-xl border text-caption font-medium transition-all hover:opacity-80 cursor-pointer ${inputBorderClass}`}
                >
                  Privacy Statement
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
            <h2 className="text-h2 font-bold tracking-tight">Application Submitted</h2>
            <p className="text-caption opacity-80 leading-relaxed">
              Thank you for expressing interest in growing with ATBP Collaborative. Our talent team will carefully review your credentials and contact you directly.
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

      {/* Privacy Statement Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
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
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-4 right-4 p-1 opacity-60 hover:opacity-100 cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="flex items-center space-x-2 text-space-sparkle">
                <Shield size={20} />
                <h3 className="text-h3 font-bold">Privacy Statement</h3>
              </div>

              <div className="text-caption space-y-2 opacity-85 leading-relaxed max-h-[60vh] overflow-y-auto pr-2">
                <p>
                  ATBP Collaborative is committed to safeguarding the privacy and personal credentials of all applicants in accordance with Republic Act No. 10173 (Data Privacy Act of 2012).
                </p>
                <p>
                  Any personal identifiers, contact numbers, links, video intros, or portfolio materials provided through this application portal are collected strictly for talent recruitment, portfolio evaluation, and potential employment assessment.
                </p>
                <p>
                  Your information will remain strictly confidential within our practice management and will never be disclosed to third parties without your explicit consent.
                </p>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-5 py-2 bg-space-sparkle text-bright-gray text-caption font-semibold rounded-xl hover:bg-space-sparkle/90 cursor-pointer"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
