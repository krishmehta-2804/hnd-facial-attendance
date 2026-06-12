/**
 * StatsCard - Animated stat card with glassmorphism
 */
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend = 'neutral', trendValue = 0, color = 'accent', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numValue = typeof value === 'number' ? value : parseInt(value) || 0;
    if (numValue === 0) { setDisplayValue(0); return; }

    const duration = 1000;
    const steps = 30;
    const increment = numValue / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.round(increment * step), numValue);
      setDisplayValue(current);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}>
          {Icon && <Icon size={24} />}
        </div>
        {trendValue > 0 && (
          <div className={`stat-card-trend ${trend}`}>
            <TrendIcon size={12} />
            {trendValue}%
          </div>
        )}
      </div>
      <div className="stat-card-value">
        {displayValue}{suffix}
      </div>
      <div className="stat-card-label">{title}</div>
    </div>
  );
};

export default StatsCard;
