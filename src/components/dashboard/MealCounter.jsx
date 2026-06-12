/**
 * MealCounter - Mid-day meal tracking widget
 */
import { UtensilsCrossed, TrendingUp, TrendingDown, Users } from 'lucide-react';
import { calculateMealRequirement } from '../../utils/attendanceCalculations';

const MealCounter = ({ presentCount = 0, totalEnrolled = 0, yesterdayCount = 0 }) => {
  const meal = calculateMealRequirement(presentCount);
  const diff = presentCount - yesterdayCount;
  const diffPct = yesterdayCount > 0 ? Math.round((diff / yesterdayCount) * 100) : 0;

  return (
    <div className="meal-counter">
      <div className="card-header" style={{ marginBottom: 'var(--space-md)' }}>
        <div>
          <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UtensilsCrossed size={20} style={{ color: 'var(--warning)' }} />
            Mid-Day Meal Count
          </div>
          <div className="card-subtitle">Based on today's attendance</div>
        </div>
      </div>

      <div className="meal-counter-value">
        {meal.withBuffer}
        <span className="unit">meals required</span>
      </div>

      <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
        {meal.required} based on attendance + {meal.buffer} buffer (5%)
      </div>

      <div className="meal-comparison">
        <div className="meal-comparison-item">
          <div className="meal-comparison-label">
            <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Present Today
          </div>
          <div className="meal-comparison-value">{presentCount}</div>
        </div>
        <div className="meal-comparison-item">
          <div className="meal-comparison-label">Yesterday</div>
          <div className="meal-comparison-value" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {yesterdayCount}
            {diff !== 0 && (
              <span style={{
                fontSize: 'var(--font-size-xs)',
                color: diff > 0 ? 'var(--success)' : 'var(--danger)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}>
                {diff > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {Math.abs(diffPct)}%
              </span>
            )}
          </div>
        </div>
        <div className="meal-comparison-item">
          <div className="meal-comparison-label">Total Enrolled</div>
          <div className="meal-comparison-value">{totalEnrolled}</div>
        </div>
      </div>
    </div>
  );
};

export default MealCounter;
