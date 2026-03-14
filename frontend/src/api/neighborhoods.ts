import type { Neighborhood, NeighborhoodsResponse, SearchResponse } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || '';

const MOCK_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'connaught-place',
    name: 'Connaught Place',
    city: 'New Delhi',
    region: 'Central Delhi',
    area_km2: 1.8,
    score: 84,
    breakdown: { safety: 80, walkability: 90, transit: 95, schools: 78, greenery: 60, noise: 45 },
    coordinates: { lat: 28.6315, lng: 77.2167 },
    zone: { x: 265, y: 215, width: 180, height: 130, pinX: 355, pinY: 235 },
  },
  {
    id: 'dwarka',
    name: 'Dwarka',
    city: 'New Delhi',
    region: 'South West Delhi',
    area_km2: 56.0,
    score: 78,
    breakdown: { safety: 78, walkability: 72, transit: 80, schools: 85, greenery: 70, noise: 62 },
    coordinates: { lat: 28.5921, lng: 77.0460 },
    zone: { x: 65, y: 215, width: 180, height: 130, pinX: 155, pinY: 235 },
  },
  {
    id: 'rohini',
    name: 'Rohini',
    city: 'New Delhi',
    region: 'North West Delhi',
    area_km2: 36.0,
    score: 74,
    breakdown: { safety: 72, walkability: 70, transit: 78, schools: 80, greenery: 65, noise: 58 },
    coordinates: { lat: 28.7041, lng: 77.1025 },
    zone: { x: 65, y: 40, width: 180, height: 155, pinX: 155, pinY: 90 },
  },
  {
    id: 'noida-sector-18',
    name: 'Noida Sector 18',
    city: 'Noida',
    region: 'Gautam Buddha Nagar',
    area_km2: 3.2,
    score: 71,
    breakdown: { safety: 70, walkability: 75, transit: 68, schools: 72, greenery: 60, noise: 55 },
    coordinates: { lat: 28.5700, lng: 77.3219 },
    zone: { x: 465, y: 215, width: 180, height: 130, pinX: 555, pinY: 235 },
  },
  {
    id: 'gurgaon-cyber-city',
    name: 'Cyber City',
    city: 'Gurugram',
    region: 'Haryana',
    area_km2: 2.5,
    score: 68,
    breakdown: { safety: 72, walkability: 60, transit: 65, schools: 70, greenery: 55, noise: 50 },
    coordinates: { lat: 28.4947, lng: 77.0890 },
    zone: { x: 65, y: 365, width: 180, height: 150, pinX: 155, pinY: 410 },
  },
  {
    id: 'ghaziabad-indirapuram',
    name: 'Indirapuram',
    city: 'Ghaziabad',
    region: 'Uttar Pradesh',
    area_km2: 8.4,
    score: 63,
    breakdown: { safety: 62, walkability: 60, transit: 65, schools: 68, greenery: 55, noise: 52 },
    coordinates: { lat: 28.6412, lng: 77.3675 },
    zone: { x: 465, y: 365, width: 180, height: 150, pinX: 555, pinY: 410 },
  },
  {
    id: 'faridabad',
    name: 'Faridabad',
    city: 'Faridabad',
    region: 'Haryana',
    area_km2: 214.0,
    score: 48,
    breakdown: { safety: 48, walkability: 45, transit: 52, schools: 55, greenery: 40, noise: 38 },
    coordinates: { lat: 28.4089, lng: 77.3178 },
    zone: { x: 265, y: 365, width: 180, height: 150, pinX: 355, pinY: 410 },
  },
  {
    id: 'east-delhi-preet-vihar',
    name: 'Preet Vihar',
    city: 'New Delhi',
    region: 'East Delhi',
    area_km2: 4.1,
    score: 58,
    breakdown: { safety: 60, walkability: 62, transit: 70, schools: 58, greenery: 42, noise: 44 },
    coordinates: { lat: 28.6442, lng: 77.2964 },
    zone: { x: 665, y: 215, width: 200, height: 130, pinX: 755, pinY: 245 },
  },
  {
    id: 'vasant-kunj',
    name: 'Vasant Kunj',
    city: 'New Delhi',
    region: 'South Delhi',
    area_km2: 10.2,
    score: 76,
    breakdown: { safety: 78, walkability: 68, transit: 70, schools: 82, greenery: 80, noise: 68 },
    coordinates: { lat: 28.5200, lng: 77.1500 },
    zone: { x: 665, y: 365, width: 200, height: 150, pinX: 755, pinY: 410 },
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