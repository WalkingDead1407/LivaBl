import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Neighborhood } from '../types';
import { getScoreColor } from '../utils';

interface LiveMapProps {
  neighborhoods: Neighborhood[];
  selected: Neighborhood | null;
  onSelect: (n: Neighborhood) => void;
}

export default function LiveMap({ neighborhoods, selected, onSelect }: LiveMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.CircleMarker>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [28.6139, 77.2090],
      zoom: 11,
      zoomControl: false,
    });

    // OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Add/update markers when neighborhoods load
  useEffect(() => {
    const map = mapRef.current;
    if (!map || neighborhoods.length === 0) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    neighborhoods.forEach((n) => {
      const color = getScoreColor(n.score);
      const isSelected = selected?.id === n.id;

      const marker = L.circleMarker([n.coordinates.lat, n.coordinates.lng], {
        radius: isSelected ? 18 : 14,
        fillColor: isSelected ? '#1a1a18' : color,
        color: 'white',
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      });

      // Score label using divIcon
      const icon = L.divIcon({
        className: '',
        html: `<div style="
          width: ${isSelected ? 36 : 28}px;
          height: ${isSelected ? 36 : 28}px;
          border-radius: 50%;
          background: ${isSelected ? '#1a1a18' : color};
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Mono', monospace;
          font-size: ${isSelected ? 11 : 10}px;
          font-weight: 500;
          color: white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          cursor: pointer;
          transition: all 0.2s;
        ">${n.score}</div>`,
        iconSize: [isSelected ? 36 : 28, isSelected ? 36 : 28],
        iconAnchor: [isSelected ? 18 : 14, isSelected ? 18 : 14],
      });

      const pinMarker = L.marker([n.coordinates.lat, n.coordinates.lng], { icon });

      // Popup on hover
      const popup = L.popup({
        closeButton: false,
        offset: [0, -10],
        className: 'livabl-popup',
      }).setContent(`
        <div style="font-family: 'DM Sans', sans-serif; padding: 4px;">
          <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px;">${n.name}</div>
          <div style="font-size: 11px; color: #6b6b64; margin-bottom: 4px;">${n.region}</div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:2px;">
            <span style="color:#6b6b64;">Safety</span><span style="font-family:'DM Mono',monospace;">${n.breakdown.safety}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:2px;">
            <span style="color:#6b6b64;">Walkability</span><span style="font-family:'DM Mono',monospace;">${n.breakdown.walkability}</span>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11px;">
            <span style="color:#6b6b64;">Transit</span><span style="font-family:'DM Mono',monospace;">${n.breakdown.transit}</span>
          </div>
        </div>
      `);

      pinMarker.bindPopup(popup);
      pinMarker.on('mouseover', () => pinMarker.openPopup());
      pinMarker.on('mouseout', () => pinMarker.closePopup());
      pinMarker.on('click', () => onSelect(n));

      pinMarker.addTo(map);
      markersRef.current[n.id] = marker;
    });
  }, [neighborhoods, selected, onSelect]);

  // Pan to selected neighborhood
  useEffect(() => {
    if (!mapRef.current || !selected) return;
    mapRef.current.flyTo(
      [selected.coordinates.lat, selected.coordinates.lng],
      13,
      { duration: 1 }
    );
  }, [selected]);

  return (
    <div className="map-area">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}