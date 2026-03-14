import { useState } from 'react';
import type { Neighborhood, MapLayer, ScoreCategory } from '../types';
import { getScoreColor, getZoneFill } from '../utils';

interface MapPanelProps {
    neighborhoods: Neighborhood[];
    selected: Neighborhood | null;
    onSelect: (n: Neighborhood) => void;
    activeCategory: ScoreCategory;
}

interface TooltipState {
    visible: boolean;
    x: number;
    y: number;
    neighborhood: Neighborhood | null;
}

export default function MapPanel({ neighborhoods, selected, onSelect, activeCategory }: MapPanelProps) {
    const [layer, setLayer] = useState<MapLayer>('livability');
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false, x: 0, y: 0, neighborhood: null,
    });

    function getDisplayScore(n: Neighborhood): number {
        if (activeCategory === 'all' || layer === 'livability') return n.score;
        if (activeCategory in n.breakdown) return n.breakdown[activeCategory as keyof Neighborhood['breakdown']];
        return n.score;
    }

    function handleZoneEnter(e: React.MouseEvent, n: Neighborhood) {
        const rect = (e.currentTarget as SVGElement).closest('svg')!.getBoundingClientRect();
        setTooltip({ visible: true, x: e.clientX - rect.left + 12, y: e.clientY - rect.top - 10, neighborhood: n });
    }

    function handleZoneLeave() {
        setTooltip((t) => ({ ...t, visible: false }));
    }

    return (
        <div className="map-area">
            <div className="map-bg" style={{ position: 'relative', width: '100%', height: '100%' }}>
                <svg
                    className="map-svg"
                    viewBox="0 0 900 700"
                    preserveAspectRatio="xMidYMid slice"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'block', width: '100%', height: '100%' }}
                >
                    {/* Road grid */}
                    <rect width="900" height="700" fill="#ede9e1" />
                    {[350, 200, 520].map((y) => (
                        <line key={`mh${y}`} x1="0" y1={y} x2="900" y2={y} stroke="#d6d1c7" strokeWidth={y === 350 ? 14 : 10} />
                    ))}
                    {[450, 250, 650].map((x) => (
                        <line key={`mv${x}`} x1={x} y1="0" x2={x} y2="700" stroke="#d6d1c7" strokeWidth={x === 450 ? 14 : 10} />
                    ))}
                    {[120, 280, 430, 600].map((y) => (
                        <line key={`sh${y}`} x1="0" y1={y} x2="900" y2={y} stroke="#dbd7cf" strokeWidth={4} />
                    ))}
                    {[150, 350, 550, 750].map((x) => (
                        <line key={`sv${x}`} x1={x} y1="0" x2={x} y2="700" stroke="#dbd7cf" strokeWidth={4} />
                    ))}

                    {/* Parks */}
                    <rect x="310" y="260" width="60" height="40" rx="4" fill="#86efac" fillOpacity="0.6" />
                    <rect x="110" y="420" width="50" height="35" rx="4" fill="#86efac" fillOpacity="0.5" />
                    <rect x="510" y="420" width="50" height="35" rx="4" fill="#86efac" fillOpacity="0.4" />
                    <rect x="710" y="260" width="60" height="40" rx="4" fill="#86efac" fillOpacity="0.4" />

                    {/* Water */}
                    <ellipse cx="720" cy="120" rx="55" ry="35" fill="#93c5fd" fillOpacity="0.45" />

                    {/* Zones */}
                    {neighborhoods.map((n) => {
                        if (!n.zone) return null;
                        const { x, y, width, height } = n.zone;
                        const score = getDisplayScore(n);
                        const color = getScoreColor(score);
                        const isSelected = selected?.id === n.id;
                        return (
                            <g key={n.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(n)}
                                onMouseMove={(e) => handleZoneEnter(e, n)} onMouseLeave={handleZoneLeave}>
                                <rect x={x} y={y} width={width} height={height} rx={6}
                                    fill={getZoneFill(score, isSelected ? 0.22 : 0.14)} />
                                <rect x={x} y={y} width={width} height={height} rx={6}
                                    fill="none" stroke={color} strokeWidth={isSelected ? 2.5 : 1.5}
                                    strokeOpacity={isSelected ? 1 : 0.6} />
                                <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle"
                                    fontFamily="'DM Sans', sans-serif" fontSize={11} fontWeight={600} fill={color}>
                                    {n.name}
                                </text>
                                <text x={x + width / 2} y={y + height / 2 + 8} textAnchor="middle"
                                    fontFamily="'DM Sans', sans-serif" fontSize={9} fill={color} opacity={0.7}>
                                    Score: {score}
                                </text>
                            </g>
                        );
                    })}

                    {/* Pins */}
                    {neighborhoods.map((n) => {
                        if (!n.zone) return null;
                        const { pinX, pinY } = n.zone;
                        const score = getDisplayScore(n);
                        const color = getScoreColor(score);
                        const isSelected = selected?.id === n.id;
                        return (
                            <g key={`pin-${n.id}`} style={{ cursor: 'pointer' }} onClick={() => onSelect(n)}>
                                <circle cx={pinX} cy={pinY} r={isSelected ? 15 : 11}
                                    fill={isSelected ? '#1a1a18' : color}
                                    style={{ transition: 'r 0.2s, fill 0.2s' }} />
                                <text x={pinX} y={pinY + 1} textAnchor="middle" dominantBaseline="central"
                                    fontFamily="'DM Mono', monospace" fontSize={isSelected ? 10 : 9} fontWeight={500} fill="white">
                                    {score}
                                </text>
                            </g>
                        );
                    })}

                    {/* Scale bar */}
                    <line x1="30" y1="668" x2="130" y2="668" stroke="#b0aa9e" strokeWidth={1.5} />
                    <line x1="30" y1="663" x2="30" y2="673" stroke="#b0aa9e" strokeWidth={1.5} />
                    <line x1="130" y1="663" x2="130" y2="673" stroke="#b0aa9e" strokeWidth={1.5} />
                    <text x="80" y="660" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize={9} fill="#a0a099">
                        2 km
                    </text>
                </svg>

                {/* Tooltip */}
                {tooltip.visible && tooltip.neighborhood && (
                    <div className="zone-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
                        <div className="zt-name">{tooltip.neighborhood.name}</div>
                        <div className="zt-row"><span>Livability</span><span className="zt-val">{tooltip.neighborhood.score}</span></div>
                        <div className="zt-row"><span>Safety</span><span className="zt-val">{tooltip.neighborhood.breakdown.safety}</span></div>
                        <div className="zt-row"><span>Walkability</span><span className="zt-val">{tooltip.neighborhood.breakdown.walkability}</span></div>
                        <div className="zt-row"><span>Transit</span><span className="zt-val">{tooltip.neighborhood.breakdown.transit}</span></div>
                    </div>
                )}

                {/* Legend + Layer switcher */}
                <div className="map-overlay">
                    <div className="map-card">
                        <div className="map-card-title">Score Legend</div>
                        {[{ label: 'Excellent (75–100)', color: '#16a34a' },
                        { label: 'Average (55–74)', color: '#d97706' },
                        { label: 'Poor (0–54)', color: '#dc2626' }].map(({ label, color }) => (
                            <div key={label} className="legend-item">
                                <div className="legend-dot" style={{ background: color }} />{label}
                            </div>
                        ))}
                    </div>
                    <div className="map-card">
                        <div className="map-card-title">Map Layer</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {(['livability', 'safety', 'transit'] as MapLayer[]).map((l) => (
                                <label key={l} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, color: 'var(--text-2)', cursor: 'pointer' }}>
                                    <input type="radio" name="layer" checked={layer === l}
                                        onChange={() => setLayer(l)} style={{ accentColor: '#2563eb' }} />
                                    {l.charAt(0).toUpperCase() + l.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Zoom */}
                <div className="map-zoom">
                    <button className="zoom-btn">+</button>
                    <div className="zoom-divider" />
                    <button className="zoom-btn">−</button>
                </div>

                {/* Bottom bar */}
                <div className="map-bottom">
                    <span>Delhi NCR Metropolitan Area</span>
                    <span className="map-coord">28.6139° N, 77.2090° E</span>
                    <span>·</span>
                    <span style={{ color: 'var(--text-3)' }}>{neighborhoods.length} zones loaded</span>
                </div>
            </div>
        </div>
    );
}