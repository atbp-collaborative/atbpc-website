'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPinFieldConfig, FieldRenderProps } from './types';
import { getFieldThemeStyles } from './fieldStyles';

type MapPinFieldProps = Omit<MapPinFieldConfig, 'type'> & { type?: MapPinFieldConfig['type']; disabled?: boolean } & FieldRenderProps<{ lat: number, lng: number, address?: string } | null>;

export const MapPinField: React.FC<MapPinFieldProps> = ({
  name,
  label,
  value,
  onChange,
  isDarkMode,
  theme = 'neutral',
  required,
  badge,
  note,
  disabled
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const styles = getFieldThemeStyles(theme, isDarkMode);

  // Default to Philippines coordinates if no value
  const initialPos: [number, number] = value ? [value.lat, value.lng] : [14.5995, 120.9842]; // Manila

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: initialPos,
      zoom: value ? 16 : 10,
      zoomControl: false,
    });
    mapRef.current = map;

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    L.tileLayer(
      isDarkMode
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        subdomains: 'abcd',
        maxZoom: 20,
      }
    ).addTo(map);

    const customIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="relative flex h-5 w-5 items-center justify-center rounded-full shadow-lg border-2 border-white" style="background-color: ${isDarkMode ? '#ffffff' : '#1e293b'};">
          </div>
        </div>
      `,
      className: 'custom-pin-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    if (value) {
      markerRef.current = L.marker([value.lat, value.lng], { icon: customIcon }).addTo(map);
    }

    map.on('click', (e) => {
      if (disabled) return;
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }
      onChange(name, { lat, lng, address: value?.address });
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className={`flex flex-col space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {label && (
        <label className="text-caption font-sans font-medium text-space-sparkle flex items-baseline">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {badge && <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-space-sparkle/10 text-space-sparkle">{badge}</span>}
          {note && <span className="ml-2 text-micro opacity-60 font-normal">{note}</span>}
        </label>
      )}
      <div 
        className={`w-full h-64 rounded-md overflow-hidden border ${styles.borderColor} shadow-sm transition-colors`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-0" />
      </div>
      <p className="text-micro opacity-60">Click on the map to place a pin.</p>
    </div>
  );
};
