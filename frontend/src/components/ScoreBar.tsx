import { useEffect, useState } from 'react';
import { getBarColor } from '../utils';

interface ScoreBarProps {
  label: string;
  value: number;
  delay?: number;
}

export default function ScoreBar({ label, value, delay = 0 }: ScoreBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div className="bar-item">
      <div className="bar-name">{label}</div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{
            width: `${width}%`,
            background: getBarColor(value),
            transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
      <div className="bar-val">{value}</div>
    </div>
  );
}