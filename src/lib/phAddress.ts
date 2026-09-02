import { getAllRegions, getAllMunicipalities, getBarangaysByMunicipality, getProvincesByRegion, getMunicipalitiesByProvince } from '@aivangogh/ph-address';

/**
 * Thin wrapper around @aivangogh/ph-address so the rest of the app deals in
 * a single {code,name} shape instead of the package's own PHRegion/PHMunicipality/
 * PHBarangay types.
 *
 * Cities are looked up directly by region (skipping a Province/District selector):
 * @aivangogh/ph-address doesn't expose provinces for NCR (getProvincesByRegion
 * returns none — Metro Manila's cities/districts sit directly under the region),
 * so instead we filter the full municipality list by matching the shared 2-digit
 * PSGC region prefix, which holds for every region including NCR.
 */
export interface PhAddressOption {
  code: string;
  name: string;
}

let allMunicipalities: ReturnType<typeof getAllMunicipalities> | null = null;
function municipalities() {
  if (!allMunicipalities) allMunicipalities = getAllMunicipalities();
  return allMunicipalities;
}

export function getRegions(): PhAddressOption[] {
  const regions = getAllRegions().map((r) => {
    let displayName = r.name;
    if (r.designation && r.designation !== r.name) {
      if (r.name.startsWith('Region')) {
        displayName = `${r.name} : ${r.designation}`;
      } else {
        displayName = `${r.designation} : ${r.name}`;
      }
    }

    if (r.name.toUpperCase().includes('MIMAROPA') || (r.designation && r.designation.toUpperCase().includes('MIMAROPA'))) {
      displayName = 'Region IV-B : MIMAROPA';
    }

    return {
      code: r.psgcCode,
      name: displayName,
      originalName: r.name,
    };
  });

  const isNCR = (name: string, originalName: string) =>
    originalName === 'National Capital Region' || name.toUpperCase().includes('NCR');

  regions.sort((a, b) => {
    const aNCR = isNCR(a.name, a.originalName);
    const bNCR = isNCR(b.name, b.originalName);
    if (aNCR && !bNCR) return -1;
    if (!aNCR && bNCR) return 1;

    const aStartsWithRegion = a.name.startsWith('Region');
    const bStartsWithRegion = b.name.startsWith('Region');

    if (!aStartsWithRegion && bStartsWithRegion) return -1;
    if (aStartsWithRegion && !bStartsWithRegion) return 1;

    return a.name.localeCompare(b.name);
  });

  return regions.map((r) => ({ code: r.code, name: r.name }));
}

export function getProvinces(regionCode: string): PhAddressOption[] {
  const ncrRegion = getAllRegions().find(r => r.name === 'National Capital Region' || r.name.toUpperCase().includes('NCR'));
  if (ncrRegion && regionCode === ncrRegion.psgcCode) {
    return [{ code: 'metro-manila', name: 'Metro Manila' }];
  }

  return getProvincesByRegion(regionCode)
    .map((p) => ({ code: p.psgcCode, name: p.name }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
}

export function getCities(regionCode: string, provinceCode?: string): PhAddressOption[] {
  let list: PhAddressOption[] = [];
  if (provinceCode && provinceCode !== 'metro-manila') {
    list = getMunicipalitiesByProvince(provinceCode)
      .map((m) => ({ code: m.psgcCode, name: m.name }));
  } else {
    const regionPrefix = regionCode.slice(0, 2);
    list = municipalities()
      .filter((m) => m.psgcCode.slice(0, 2) === regionPrefix)
      .map((m) => ({ code: m.psgcCode, name: m.name }));
  }

  const ncrRegion = getAllRegions().find(r => r.name === 'National Capital Region' || r.name.toUpperCase().includes('NCR'));
  if (ncrRegion && regionCode === ncrRegion.psgcCode) {
    list = list.filter(m => m.name.toUpperCase().includes('CITY') || m.name.toUpperCase().includes('PATEROS'));
  }

  return list.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
}

export function getBarangays(cityCode: string): PhAddressOption[] {
  let bList = getBarangaysByMunicipality(cityCode);

  // Fix for Manila City whose barangays are nested under its districts in the dataset
  if (bList.length === 0 && cityCode === '1380600000') {
    const districts = municipalities().filter(m => m.provinceCode === cityCode);
    for (const d of districts) {
      bList = bList.concat(getBarangaysByMunicipality(d.psgcCode));
    }
  }

  return bList
    .map((b) => ({ code: b.psgcCode, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));
}
