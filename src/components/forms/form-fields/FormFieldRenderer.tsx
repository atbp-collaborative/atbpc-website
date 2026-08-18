import React from 'react';
import { FieldConfig, ChoiceCardOption } from './types';
import { FieldTheme } from './fieldStyles';
import { TextField } from './TextField';
import { SelectField } from './SelectField';
import { TextAreaField } from './TextAreaField';
import { FileUploadField } from './FileUploadField';
import { ChoiceCardField } from './ChoiceCardField';
import { ChipMultiSelectField } from './ChipMultiSelectField';
import { AddressField } from './AddressField';
import { DivField } from './DivField';
import { EMPTY_PH_ADDRESS } from './types';

interface FormFieldRendererProps {
  config: FieldConfig;
  /** The current value for config.name — string, string[], or File | null depending on config.type. */
  value: any;
  onChange: (name: string, value: any, option?: ChoiceCardOption) => void;
  isDarkMode: boolean;
  theme?: FieldTheme;
}

/**
 * Dispatches one FieldConfig to its matching field component. This is the
 * only place that needs to know every field type exists — forms just loop
 * over a config array and call this once per field. `value`/`onChange` are
 * intentionally typed loosely (`any`) at this boundary since the shape
 * genuinely varies by field type; each concrete field component re-asserts
 * its own precise type.
 */
export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  config,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
}) => {
  const wrapper = (node: React.ReactNode) =>
    config.wrapperClassName ? <div className={config.wrapperClassName}>{node}</div> : node;

  switch (config.type) {
    case 'text':
    case 'email':
    case 'tel':
      return wrapper(
        <TextField {...config} value={value ?? ''} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'select':
      return wrapper(
        <SelectField {...config} value={value ?? ''} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'textarea':
      return wrapper(
        <TextAreaField {...config} value={value ?? ''} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'file':
      return wrapper(
        <FileUploadField {...config} value={value ?? null} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'choice-card':
      return wrapper(
        <ChoiceCardField {...config} value={value ?? ''} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'chip-multiselect':
      return wrapper(
        <ChipMultiSelectField {...config} value={value ?? []} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'address':
      return wrapper(
        <AddressField {...config} value={value ?? EMPTY_PH_ADDRESS} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
    case 'div':
      return wrapper(
        <DivField {...config} value={value ?? ''} onChange={onChange} isDarkMode={isDarkMode} theme={theme} />
      );
  }
};
