import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, FileText, Award, Building2, CheckCircle2 } from 'lucide-react';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-none shadow-2xl border z-10 overflow-hidden ${
              isDarkMode
                ? 'bg-vintage-charcoal border-space-sparkle/30 text-bright-gray'
                : 'bg-white border-space-sparkle/20 text-vintage-charcoal'
            }`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-5 border-b sticky top-0 z-20 backdrop-blur-md ${
              isDarkMode 
                ? 'bg-vintage-charcoal/95 border-space-sparkle/20' 
                : 'bg-white/95 border-space-sparkle/15'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-none ${
                  isDarkMode ? 'bg-white/10 text-bright-gray' : 'bg-vintage-charcoal/10 text-vintage-charcoal'
                }`}>
                  <Scale size={20} />
                </div>
                <div>
                  <h2 className="text-h3 font-sans font-bold tracking-tight">Legal & Regulatory Notices</h2>
                  <p className="text-mini opacity-60 font-sans uppercase tracking-wider">
                    ATBP Collaborative • Licensed Architectural Practice
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-2 transition-colors cursor-pointer rounded-none ${
                  isDarkMode 
                    ? 'hover:bg-white/10 text-bright-gray/80 hover:text-white' 
                    : 'hover:bg-vintage-charcoal/10 text-vintage-charcoal/80 hover:text-vintage-charcoal'
                }`}
                aria-label="Close Legal Modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-body font-light leading-relaxed">
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
                <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
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
                <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
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
                <div className="flex items-center gap-2 text-h3 font-sans font-bold tracking-tight">
                  <Building2 size={18} className="opacity-70" />
                  <h3>3. Honest & Transparent Construction Standard</h3>
                </div>
                <p className="opacity-90">
                  ATBP Collaborative upholds an absolute transparent billing model across all design-build projects. Detailed bill of quantities (BOQ), material specifications, labor breakdowns, and subcontractor pricing are disclosed openly to clients without hidden markups.
                </p>
              </section>
            </div>

            {/* Modal Footer */}
            <div className={`p-4 px-6 border-t flex justify-end sticky bottom-0 z-20 backdrop-blur-md ${
              isDarkMode 
                ? 'bg-vintage-charcoal/95 border-space-sparkle/20' 
                : 'bg-white/95 border-space-sparkle/15'
            }`}>
              <button
                onClick={onClose}
                className={`px-6 py-2 text-mini font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                  isDarkMode
                    ? 'bg-white text-vintage-charcoal hover:bg-bright-gray border-white'
                    : 'bg-vintage-charcoal text-white hover:bg-vintage-charcoal/90 border-vintage-charcoal'
                }`}
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
