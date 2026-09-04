'use client';

import React, { useMemo } from 'react';
import { SelectField } from './SelectField';
import { TextField } from './TextField';
import { getFieldThemeStyles } from './fieldStyles';
import { PhAddress, FieldRenderProps } from './types';
import { getRegions, getProvinces, getCities, getBarangays } from '@/lib/phAddress';
import { COUNTRIES } from '@/lib/countries';

type AddressFieldProps = {
  name: string;
  label?: React.ReactNode;
  dense?: boolean;
  variant?: 'full' | 'city-region-only';
  columns?: 1 | 2;
} & FieldRenderProps<PhAddress>;

/**
 * Country -> Region -> Province -> City -> Barangay, plus a free-text Unit/Lot/Block/Subdivision
 * line. For non-PH countries, sub-levels become text fields instead of dropdowns.
 */
export const AddressField: React.FC<AddressFieldProps> = ({
  name,
  label,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
  dense = false,
  variant = 'full',
  columns = 2,
}) => {
  const styles = getFieldThemeStyles(theme, isDarkMode);

  const isPH = value.country === 'Philippines';

  const regions = useMemo(() => getRegions(), []);
  const provinces = useMemo(() => (value.regionCode ? getProvinces(value.regionCode) : []), [value.regionCode]);
  const cities = useMemo(() => {
    if (value.provinceCode) return getCities(value.regionCode, value.provinceCode);
    if (value.regionCode && provinces.length === 0) return getCities(value.regionCode);
    if (value.regionCode) return getCities(value.regionCode); // fallback if province is optional/not selected
    return [];
  }, [value.regionCode, value.provinceCode, provinces.length]);
  const barangays = useMemo(() => (value.cityCode ? getBarangays(value.cityCode) : []), [value.cityCode]);

  const set = (patch: Partial<PhAddress>) => onChange(name, { ...value, ...patch });

  const handleCountryChange = (_name: string, val: string) => {
    set({
      country: val,
      regionCode: '',
      regionName: '',
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      barangayCode: '',
      barangayName: ''
    });
  };

  const handleRegionChange = (_name: string, regionCode: string) => {
    const regionName = regions.find((r) => r.code === regionCode)?.name ?? '';
    const isNCR = regionName.toUpperCase().includes('NCR') || regionName.toUpperCase() === 'NATIONAL CAPITAL REGION';
    set({ 
      regionCode, 
      regionName, 
      provinceCode: isNCR ? 'metro-manila' : '', 
      provinceName: isNCR ? 'Metro Manila' : '', 
      cityCode: '', 
      cityName: '', 
      barangayCode: '', 
      barangayName: '' 
    });
  };

  const handleProvinceChange = (_name: string, provinceCode: string) => {
    const provinceName = provinces.find((p) => p.code === provinceCode)?.name ?? '';
    set({ provinceCode, provinceName, cityCode: '', cityName: '', barangayCode: '', barangayName: '' });
  };

  const handleCityChange = (_name: string, cityCode: string) => {
    const cityName = cities.find((c) => c.code === cityCode)?.name ?? '';
    set({ cityCode, cityName, barangayCode: '', barangayName: '' });
  };

  const handleBarangayChange = (_name: string, barangayCode: string) => {
    const barangayName = barangays.find((b) => b.code === barangayCode)?.name ?? '';
    set({ barangayCode, barangayName });
  };

  return (
    <div className="space-y-1.5">
      {label && <label className={styles.label}>{label}</label>}

      <div className={`grid grid-cols-1 ${columns === 2 ? 'md:grid-cols-2' : ''} gap-3`}>
        {variant === 'full' && (
          <div className="order-1 md:order-1">
            <span className={styles.label}>Country</span>
            <SelectField
              name="country"
              label=""
              placeholder="[ Select Country ]"
              options={COUNTRIES.map(c => ({ value: c, label: c }))}
              value={value.country}
              onChange={handleCountryChange}
              isDarkMode={isDarkMode}
              theme={theme}
              dense={dense}
            />
          </div>
        )}

        <div className={variant === 'full' ? 'order-2 md:order-3' : 'order-1 md:order-1'}>
          <span className={styles.label}>Region</span>
          {isPH ? (
            <SelectField
              name="regionCode"
              label=""
              placeholder="[ Select Region ]"
              options={regions.map((r) => ({ value: r.code, label: r.name }))}
              value={value.regionCode}
              onChange={handleRegionChange}
              isDarkMode={isDarkMode}
              theme={theme}
              dense={dense}
            />
          ) : (
            <TextField
              name="regionName"
              label=""
              value={value.regionName}
              onChange={(_name: string, val: string) => set({ regionName: val })}
              isDarkMode={isDarkMode}
              theme={theme}
              placeholder="-"
            />
          )}
        </div>

        {variant === 'full' && (
          <div className="order-3 md:order-5">
            <span className={styles.label}>{isPH ? 'Province' : 'Province / State / Prefecture'}</span>
            {isPH ? (
               <SelectField
                name="provinceCode"
                label=""
                placeholder={value.regionCode ? (provinces.length > 0 ? '[ Select Province ]' : 'N/A') : '[ Select a Region First ]'}
                options={provinces.map((p) => ({ value: p.code, label: p.name }))}
                value={value.provinceCode}
                onChange={handleProvinceChange}
                isDarkMode={isDarkMode}
                theme={theme}
                disabled={!value.regionCode || provinces.length === 0 || (provinces.length === 1 && provinces[0].code === 'metro-manila')}
                dense={dense}
              />
            ) : (
              <TextField
                name="provinceName"
                label=""
                value={value.provinceName}
                onChange={(_name: string, val: string) => set({ provinceName: val })}
                isDarkMode={isDarkMode}
                theme={theme}
                placeholder="-"
              />
            )}
          </div>
        )}

        <div className={variant === 'full' ? 'order-4 md:order-2' : 'order-2 md:order-2'}>
          <span className={styles.label}>City / Municipality</span>
          {isPH ? (
            <SelectField
              name="cityCode"
              label=""
              placeholder={value.regionCode ? '[ Select City / Municipality ]' : '[ Select a Region First ]'}
              options={cities.map((c) => ({ value: c.code, label: c.name }))}
              value={value.cityCode}
              onChange={handleCityChange}
              isDarkMode={isDarkMode}
              theme={theme}
              disabled={!value.regionCode}
              dense={dense}
            />
          ) : (
            <TextField
              name="cityName"
              label=""
              value={value.cityName}
              onChange={(_name: string, val: string) => set({ cityName: val })}
              isDarkMode={isDarkMode}
              theme={theme}
              placeholder="-"
            />
          )}
        </div>

        {variant === 'full' && (
          <div className="order-5 md:order-4">
            <span className={styles.label}>{isPH ? 'Barangay' : 'District / County / Borough'}</span>
            {isPH ? (
              <SelectField
                name="barangayCode"
                label=""
                placeholder={value.cityCode ? '[ Select Barangay ]' : '[ Select a City First ]'}
                options={barangays.map((b) => ({ value: b.code, label: b.name }))}
                value={value.barangayCode}
                onChange={handleBarangayChange}
                isDarkMode={isDarkMode}
                theme={theme}
                disabled={!value.cityCode}
                dense={dense}
              />
            ) : (
              <TextField
                name="barangayName"
                label=""
                value={value.barangayName}
                onChange={(_name: string, val: string) => set({ barangayName: val })}
                isDarkMode={isDarkMode}
                theme={theme}
                placeholder="-"
              />
            )}
          </div>
        )}

        {variant === 'full' && (
          <div className="order-6 md:order-6">
            <span className={styles.label}>Phase/Blk/Lot/Unit/Subdivision</span>
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
        )}
      </div>
    </div>
  );
};
