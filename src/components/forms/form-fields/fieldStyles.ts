export type FieldTheme = 'neutral' | 'accent';

const neutralBorderClass = (isDarkMode: boolean) =>
  isDarkMode
    ? 'border-bright-gray/30 focus:border-bright-gray bg-vintage-charcoal/50 text-white placeholder-bright-gray/40'
    : 'border-vintage-charcoal/30 focus:border-vintage-charcoal bg-white/60 text-vintage-charcoal placeholder-vintage-charcoal/40';

const accentBorderClass = (isDarkMode: boolean) =>
  isDarkMode
    ? 'bg-vintage-charcoal border-space-sparkle/30 text-white'
    : 'bg-white border-space-sparkle/25 text-slate-800';

export interface FieldThemeStyles {
  label: string;
  /** Full className for a standard input/select/textarea: padding, radius, border, text size. */
  input: string;
  /** Just the border/bg/text color part, for custom-shaped fields (file drop-zone, choice cards). */
  borderColor: string;
}

/**
 * CareerForm ("neutral") and ProposalForm ("accent") predate this shared
 * library with two different visual languages — soft rounded neutral inputs
 * vs. sharp-cornered brand-accent inputs. Rather than force one look on both
 * (which would visually regress whichever form didn't originate it), each
 * field component picks its styling from here via a `theme` prop.
 */
export function getFieldThemeStyles(theme: FieldTheme, isDarkMode: boolean): FieldThemeStyles {
  if (theme === 'accent') {
    return {
      label: 'text-caption uppercase tracking-wider block opacity-70',
      input: `w-full p-2.5 text-body rounded-none border outline-none ${accentBorderClass(isDarkMode)}`,
      borderColor: accentBorderClass(isDarkMode),
    };
  }
  return {
    label: 'text-caption font-semibold block opacity-90',
    input: `w-full text-caption px-3 py-1.5 rounded-lg border outline-none ${neutralBorderClass(isDarkMode)}`,
    borderColor: neutralBorderClass(isDarkMode),
  };
}
