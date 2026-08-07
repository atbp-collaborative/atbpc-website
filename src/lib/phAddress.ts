import { getAllRegions, getAllMunicipalities, getBarangaysByMunicipality } from '@aivangogh/ph-address';

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
  return getAllRegions().map((r) => ({
    code: r.psgcCode,
    name: r.designation && r.designation !== r.name ? `${r.name} — ${r.designation}` : r.name,
  }));
}

export function getCities(regionCode: string): PhAddressOption[] {
  const regionPrefix = regionCode.slice(0, 2);
  return municipalities()
    .filter((m) => m.psgcCode.slice(0, 2) === regionPrefix)
    .map((m) => ({ code: m.psgcCode, name: m.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getBarangays(cityCode: string): PhAddressOption[] {
  return getBarangaysByMunicipality(cityCode)
    .map((b) => ({ code: b.psgcCode, name: b.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
