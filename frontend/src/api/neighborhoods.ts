import type { Neighborhood, NeighborhoodsResponse, SearchResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'indiranagar',
    name: 'Indiranagar',
    city: 'Bengaluru',
    region: 'East Bengaluru',
    area_km2: 8.2,
    score: 82,
    breakdown: { safety: 78, walkability: 88, transit: 74, schools: 85, greenery: 65, noise: 55 },
    coordinates: { lat: 12.9784, lng: 77.6408 },
    zone: { x: 265, y: 215, width: 180, height: 130, pinX: 355, pinY: 235 },
  },
  {
    id: 'koramangala',
    name: 'Koramangala',
    city: 'Bengaluru',
    region: 'South Bengaluru',
    area_km2: 6.8,
    score: 79,
    breakdown: { safety: 80, walkability: 82, transit: 70, schools: 78, greenery: 72, noise: 60 },
    coordinates: { lat: 12.9352, lng: 77.6245 },
    zone: { x: 265, y: 365, width: 180, height: 150, pinX: 355, pinY: 410 },
  },
  {
    id: 'jayanagar',
    name: 'Jayanagar',
    city: 'Bengaluru',
    region: 'South Bengaluru',
    area_km2: 9.1,
    score: 76,
    breakdown: { safety: 82, walkability: 75, transit: 68, schools: 80, greenery: 70, noise: 65 },
    coordinates: { lat: 12.9308, lng: 77.5831 },
    zone: { x: 65, y: 365, width: 180, height: 150, pinX: 155, pinY: 410 },
  },
  {
    id: 'hsr-layout',
    name: 'HSR Layout',
    city: 'Bengaluru',
    region: 'South East',
    area_km2: 7.3,
    score: 71,
    breakdown: { safety: 72, walkability: 70, transit: 65, schools: 74, greenery: 68, noise: 58 },
    coordinates: { lat: 12.9116, lng: 77.6473 },
    zone: { x: 465, y: 365, width: 180, height: 150, pinX: 555, pinY: 410 },
  },
  {
    id: 'whitefield',
    name: 'Whitefield',
    city: 'Bengaluru',
    region: 'East Bengaluru',
    area_km2: 12.4,
    score: 64,
    breakdown: { safety: 65, walkability: 55, transit: 60, schools: 70, greenery: 62, noise: 50 },
    coordinates: { lat: 12.9698, lng: 77.7500 },
    zone: { x: 665, y: 215, width: 220, height: 130, pinX: 755, pinY: 245 },
  },
  {
    id: 'hebbal',
    name: 'Hebbal',
    city: 'Bengaluru',
    region: 'North Bengaluru',
    area_km2: 5.2,
    score: 61,
    breakdown: { safety: 60, walkability: 55, transit: 62, schools: 65, greenery: 58, noise: 52 },
    coordinates: { lat: 13.0358, lng: 77.5970 },
    zone: { x: 465, y: 40, width: 180, height: 155, pinX: 555, pinY: 90 },
  },
  {
    id: 'kr-puram',
    name: 'KR Puram',
    city: 'Bengaluru',
    region: 'East Bengaluru',
    area_km2: 11.0,
    score: 48,
    breakdown: { safety: 45, walkability: 48, transit: 55, schools: 50, greenery: 40, noise: 38 },
    coordinates: { lat: 13.0050, lng: 77.6960 },
    zone: { x: 665, y: 365, width: 220, height: 150, pinX: 755, pinY: 410 },
  },
];

async function fetchOrMock<T>(path: string, mock: T): Promise<T> {
  if (!API_BASE) return mock;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  } catch (err) {
    console.warn('[Livabl API] falling back to mock data:', err);
    return mock;
  }
}

export async function getNeighborhoods(): Promise<NeighborhoodsResponse> {
  return fetchOrMock('/api/neighborhoods', {
    neighborhoods: MOCK_NEIGHBORHOODS,
    total: MOCK_NEIGHBORHOODS.length,
  });
}

export async function searchNeighborhoods(query: string): Promise<SearchResponse> {
  const q = query.toLowerCase();
  const results = MOCK_NEIGHBORHOODS.filter(
    (n) =>
      n.name.toLowerCase().includes(q) ||
      n.city.toLowerCase().includes(q) ||
      n.region.toLowerCase().includes(q)
  );
  return fetchOrMock(`/api/search?q=${encodeURIComponent(query)}`, { query, results });
}

export async function getNeighborhood(id: string): Promise<Neighborhood | null> {
  const found = MOCK_NEIGHBORHOODS.find((n) => n.id === id) ?? null;
  return fetchOrMock(`/api/neighborhoods/${id}`, found);
}