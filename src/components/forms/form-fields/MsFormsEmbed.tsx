'use client';

import React, { useState } from 'react';
import { Button } from '@/components/primitives/Button';

interface MsFormsEmbedProps {
  /** Microsoft Forms share URL. When falsy, this renders `children` directly with no toggle — there's nothing to switch to. */
  formsUrl?: string;
  isDarkMode: boolean;
  onBackToHome: () => void;
  embedTitle?: string;
  /** The custom front-end form, rendered when the viewer picks "Custom Front-End" (or always, if formsUrl is unset). */
  children: React.ReactNode;
}

/**
 * Lets a lead-gen form offer either a native Microsoft Forms embed or this
 * site's own custom front-end, toggled by the viewer. Self-contained: owns
 * its own mode state, so any form can drop this in around its own fields
 * without wiring a toggle itself.
 */
export const MsFormsEmbed: React.FC<MsFormsEmbedProps> = ({
  formsUrl,
  isDarkMode,
  onBackToHome,
  embedTitle = 'Microsoft Forms',
  children,
}) => {
  const [mode, setMode] = useState<'custom' | 'direct'>(formsUrl ? 'direct' : 'custom');

  if (!formsUrl) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex justify-center mb-8">
        <div className={`p-1 rounded-none border flex space-x-2 ${
          isDarkMode ? 'bg-vintage-charcoal/60 border-white/10' : 'bg-slate-50 border-slate-200'
        }`}>
          <button
            onClick={() => setMode('direct')}
            className={`px-4 py-1.5 rounded-none text-caption uppercase tracking-wider font-semibold transition-all ${
              mode === 'direct'
                ? 'bg-space-sparkle text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Direct MS Forms
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-4 py-1.5 rounded-none text-caption uppercase tracking-wider font-semibold transition-all ${
              mode === 'custom'
                ? 'bg-space-sparkle text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            Custom Front-End
          </button>
        </div>
      </div>

      {mode === 'direct' ? (
        <div className="space-y-6">
          <div className={`p-6 rounded-none border text-center space-y-6 ${
            isDarkMode ? 'bg-vintage-charcoal/40 border-space-sparkle/20' : 'bg-white border-space-sparkle/10'
          }`}>
            <div className="space-y-2">
              <h3 className="font-sans text-h2 font-bold">Open via Microsoft Forms</h3>
              <p className="text-body font-light opacity-80 max-w-xl mx-auto leading-relaxed">
                We have integrated our official <strong>Microsoft Forms</strong> questionnaire to let you input details securely within the Microsoft ecosystem.
              </p>
            </div>

            {/* Embedded Microsoft Forms iFrame Container */}
            <div className="w-full h-[600px] overflow-hidden rounded-none border border-space-sparkle/10 shadow-inner bg-white">
              <iframe
                src={formsUrl}
                className="w-full h-full border-0"
                allowFullScreen
                title={embedTitle}
              />
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button
                type="filled"
                label="Open in New Tab"
                href={formsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              />
              <Button
                type="outline"
                label="Back to Home"
                onClick={onBackToHome}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};
