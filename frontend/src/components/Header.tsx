import { useState } from 'react';
import type { ScoreCategory } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  activeCategory: ScoreCategory;
  onCategoryChange: (cat: ScoreCategory) => void;
}

const CATEGORIES: { key: ScoreCategory; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'safety', label: 'Safety' },
  { key: 'walkability', label: 'Walkability' },
  { key: 'transit', label: 'Transit' },
  { key: 'schools', label: 'Schools' },
  { key: 'greenery', label: 'Greenery' },
];

export default function Header({ onSearch, activeCategory, onCategoryChange }: HeaderProps) {
  const [query, setQuery] = useState('Connaught Place, New Delhi');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <header className="livabl-header">
      <div className="logo">
        <div className="logo-mark">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.24 2 3 4.24 3 7C3 10.5 8 14 8 14C8 14 13 10.5 13 7C13 4.24 10.76 2 8 2Z" fill="white" />
            <circle cx="8" cy="7" r="2" fill="#1a1a18" />
          </svg>
        </div>
        <span className="logo-name">Liv<span>abl</span></span>
      </div>

      <div className="header-center">
        <form className="search-box" onSubmit={handleSearch}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="#a0a099" strokeWidth="1.2" />
            <path d="M9.5 9.5L12 12" stroke="#a0a099" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search a neighborhood, city, or ward…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        <div className="filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              className={`pill-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => onCategoryChange(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="header-actions">
        <button className="pill-btn">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Filters
        </button>
        <div className="avatar">R</div>
      </div>
    </header>
  );
}