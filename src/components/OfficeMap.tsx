import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface OfficeMapProps {
  isDarkMode: boolean;
}

export const OfficeMap: React.FC<OfficeMapProps> = ({ isDarkMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Coordinates for F2QH+G6 Parañaque, Countryside Village, Sun Valley, Parañaque, Philippines
  const position: [number, number] = [14.4891, 121.0396];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: position,
      zoom: 16,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // avoids scrolling zoom high-jack
    });

    mapRef.current = map;

    // Add Zoom Control to the bottom right for premium appearance
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Custom CSS DivIcon Marker matching branding colors
    const customIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full opacity-75" style="background-color: var(--space-sparkle-color); opacity: 0.3;"></span>
          <div class="relative flex h-4 w-4 items-center justify-center rounded-full shadow-lg border border-white" style="background-color: var(--space-sparkle-color);">
            <div class="h-1.5 w-1.5 rounded-full bg-white"></div>
          </div>
        </div>
      `,
      className: 'custom-office-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Add custom marker
    const marker = L.marker(position, { icon: customIcon }).addTo(map);
    
    // Bind elegant minimalist popup
    marker.bindPopup(`
      <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2px; text-align: center;">
        <h5 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700; color: #1e293b;">ATBP Collaborative</h5>
        <p style="margin: 0; font-size: 10px; color: #64748b; line-height: 1.3;">Countryside Village Studio</p>
      </div>
    `, {
      closeButton: false,
    });

    // Handle initial sizing layout issues and window resizes
    const handleResize = () => {
      map.invalidateSize();
    };

    const resizeTimeout = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Map Theme / Tile Layer dynamically
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    // CartoDB Tile URL to match our themes
    const tileUrl = isDarkMode
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const attribution = isDarkMode
      ? '&copy; <a href="https://www.openstreetmap.org/copyright" style="color: #475569;">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" style="color: #475569;">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright" style="color: #94a3b8;">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" style="color: #94a3b8;">CARTO</a>';

    const newTileLayer = L.tileLayer(tileUrl, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [isDarkMode]);

  return (
    <div 
      className="relative w-full h-full rounded-none overflow-hidden border border-space-sparkle/10 shadow-sm min-h-[350px]"
      style={{ backgroundColor: isDarkMode ? 'rgb(51, 52, 54)' : 'white' }}
    >
      <style>{`
        ${isDarkMode ? `
          .dark-map-tiles .leaflet-tile {
            filter: invert(19%) sepia(6%) saturate(110%) brightness(112%) contrast(128%) !important;
          }
          .dark-map-tiles {
            background: rgb(51, 52, 54) !important;
          }
        ` : ''}
      `}</style>
      <div ref={mapContainerRef} className={`w-full h-full min-h-[350px] z-0 ${isDarkMode ? 'dark-map-tiles' : ''}`} />
    </div>
  );
};
