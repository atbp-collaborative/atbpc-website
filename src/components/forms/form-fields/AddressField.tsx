'use client';

import React, { useMemo } from 'react';
import { SelectField } from './SelectField';
import { TextField } from './TextField';
import { getFieldThemeStyles } from './fieldStyles';
import { PhAddress, FieldRenderProps } from './types';
import { getRegions, getCities, getBarangays } from '@/lib/phAddress';

type AddressFieldProps = {
  name: string;
  label: string;
  dense?: boolean;
} & FieldRenderProps<PhAddress>;

/**
 * Country -> Region -> City -> Barangay, plus a free-text Unit/Lot/Block/Subdivision
 * line. Region/City/Barangay cascade: picking a Region resets City+Barangay, picking
 * a City resets Barangay. Country is locked to Philippines (single-country scope for
 * now) so it renders as a disabled field rather than a real choice.
 */
export const AddressField: React.FC<AddressFieldProps> = ({
  name,
  label,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
  dense = false,
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);
  const subLabelClass = 'text-micro font-archivo font-semibold block opacity-70 mb-0.5';

  const regions = useMemo(() => getRegions(), []);
  const cities = useMemo(() => (value.regionCode ? getCities(value.regionCode) : []), [value.regionCode]);
  const barangays = useMemo(() => (value.cityCode ? getBarangays(value.cityCode) : []), [value.cityCode]);

  const set = (patch: Partial<PhAddress>) => onChange(name, { ...value, ...patch });

  const handleRegionChange = (_name: string, regionCode: string) => {
    const regionName = regions.find((r) => r.code === regionCode)?.name ?? '';
    set({ regionCode, regionName, cityCode: '', cityName: '', barangayCode: '', barangayName: '' });
  };

  const handleCityChange = (_name: string, cityCode: string) => {
    const cityName = cities.find((c) => c.code === cityCode)?.name ?? '';
    set({ cityCode, cityName, barangayCode: '', barangayName: '' });
  };

  const handleBarangayChange = (_name: string, barangayCode: string) => {
    const barangayName = barangays.find((b) => b.code === barangayCode)?.name ?? '';
    set({ barangayCode, barangayName });
  };

  const textInputClass = theme === 'accent'
    ? styles.input
    : `w-full text-caption ${dense ? 'py-1.5' : 'py-2'} px-3 rounded-lg border outline-none transition-all ${styles.borderColor}`;

  return (
    <div className="space-y-1.5">
      {label && <label className={styles.label}>{label}</label>}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={subLabelClass}>Country</span>
          <TextField
            name="country"
            label=""
            value={value.country}
            onChange={() => {}}
            isDarkMode={isDarkMode}
            theme={theme}
            disabled
          />
        </div>
        <div>
          <span className={subLabelClass}>Region</span>
          <SelectField
            name="regionCode"
            label=""
            placeholder="Select region"
            options={regions.map((r) => ({ value: r.code, label: r.name }))}
            value={value.regionCode}
            onChange={handleRegionChange}
            isDarkMode={isDarkMode}
            theme={theme}
            dense={dense}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className={subLabelClass}>City / Municipality</span>
          <SelectField
            name="cityCode"
            label=""
            placeholder={value.regionCode ? 'Select city / municipality' : 'Select a region first'}
            options={cities.map((c) => ({ value: c.code, label: c.name }))}
            value={value.cityCode}
            onChange={handleCityChange}
            isDarkMode={isDarkMode}
            theme={theme}
            disabled={!value.regionCode}
            dense={dense}
          />
        </div>
        <div>
          <span className={subLabelClass}>Barangay</span>
          <SelectField
            name="barangayCode"
            label=""
            placeholder={value.cityCode ? 'Select barangay' : 'Select a city first'}
            options={barangays.map((b) => ({ value: b.code, label: b.name }))}
            value={value.barangayCode}
            onChange={handleBarangayChange}
            isDarkMode={isDarkMode}
            theme={theme}
            disabled={!value.cityCode}
            dense={dense}
          />
        </div>
      </div>

      <div>
        <span className={subLabelClass}>Unit / Lot / Block / Subdivision</span>
        <TextField
          name="addressLine"
          label=""
          value={value.addressLine}
          onChange={(_name: string, val: string) => set({ addressLine: val })}
          isDarkMode={isDarkMode}
          theme={theme}
          placeholder="-"
        />
      </div>
    </div>
  );
};
