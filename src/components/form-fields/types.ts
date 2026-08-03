import { FieldTheme } from './fieldStyles';

/**
 * Every field config is plain data (strings/booleans/arrays only, no JSX) so a
 * form's field list can eventually be fetched from a backend/CMS instead of
 * hardcoded, without changing any component in this folder. Decorative label
 * extras use `badge`/`note` strings instead of embedding React nodes for the
 * same reason.
 */
interface BaseFieldConfig {
  name: string;
  label: string;
  required?: boolean;
  /** Small inline annotation after the label, e.g. "(!)" */
  badge?: string;
  /** Secondary label text, e.g. "(Mother's Maiden Last Name)" */
  note?: string;
  /** Escape hatch for grid placement, e.g. "col-span-1 sm:col-span-2". Layout stays the calling form's concern — this just passes a class through. */
  wrapperClassName?: string;
}

export interface TextFieldConfig extends BaseFieldConfig {
  type: 'text' | 'email' | 'tel';
  placeholder?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: 'select';
  /** Plain strings when the stored value and displayed text are the same; {value, label} pairs when they differ. */
  options: (string | SelectOption)[];
  placeholder: string;
}

export interface TextAreaFieldConfig extends BaseFieldConfig {
  type: 'textarea';
  placeholder?: string;
  /** 'compact' = small bordered box for pasting a link (CareerForm's Portfolio/Cover Video). 'default' = open-ended freeform text. */
  variant?: 'default' | 'compact';
  rows?: number;
  /** Flex-grows to fill its parent's flex-col column (CareerForm's job description box). */
  grow?: boolean;
}

export interface FileFieldConfig extends BaseFieldConfig {
  type: 'file';
  accept?: string;
  dropHint?: string;
  typeHint?: string;
}

export interface ChoiceCardOption {
  id: string;
  label: string;
  desc?: string;
  /** Prominent secondary line, e.g. a price range */
  highlight?: string;
}

export interface ChoiceCardFieldConfig extends BaseFieldConfig {
  type: 'choice-card';
  options: ChoiceCardOption[];
  columns?: 2 | 3;
}

export interface ChipMultiSelectFieldConfig extends BaseFieldConfig {
  type: 'chip-multiselect';
  options: string[];
}

export type FieldConfig =
  | TextFieldConfig
  | SelectFieldConfig
  | TextAreaFieldConfig
  | FileFieldConfig
  | ChoiceCardFieldConfig
  | ChipMultiSelectFieldConfig;

/** Common props every concrete field component receives from FormFieldRenderer. */
export interface FieldRenderProps<TValue = any> {
  value: TValue;
  onChange: (name: string, value: TValue, option?: ChoiceCardOption) => void;
  isDarkMode: boolean;
  theme?: FieldTheme;
}

export type { FieldTheme };
