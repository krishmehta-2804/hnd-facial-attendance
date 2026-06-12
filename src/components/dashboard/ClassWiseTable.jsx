/**
 * ClassWiseTable - Sortable class attendance table
 */
import { useState } from 'react';
import { ArrowUpDown, ChevronRight } from 'lucide-react';

const ClassWiseTable = ({ classData = [] }) => {
  const [sortKey, setSortKey] = useState('className');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...classData].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    const dir = sortDir === 'asc' ? 1 : -1;
    if (typeof aVal === 'number') return (aVal - bVal) * dir;
    return String(aVal).localeCompare(String(bVal)) * dir;
  });

  const getPctClass = (pct) => {
    if (pct >= 90) return 'excellent';
    if (pct >= 75) return 'good';
    return 'poor';
  };

  return (
    <div className="classwise-table">
      <div className="card-header">
        <div>
          <div className="card-title">Class-wise Attendance</div>
          <div className="card-subtitle">Today's attendance by class</div>
        </div>
      </div>
      <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
        <table>
          <thead>
            <tr>
              {[
                { key: 'className', label: 'Class' },
                { key: 'teacherName', label: 'Teacher' },
                { key: 'total', label: 'Total' },
                { key: 'present', label: 'Present' },
                { key: 'absent', label: 'Absent' },
                { key: 'late', label: 'Late' },
                { key: 'percentage', label: 'Attendance %' },
              ].map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {col.label}
                    <ArrowUpDown size={12} style={{ opacity: sortKey === col.key ? 1 : 0.3 }} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((cls) => (
              <tr key={cls.classId}>
                <td>
                  <span style={{ fontWeight: 600, color: 'var(--text)' }}>
                    Class {cls.className}
                  </span>
                </td>
                <td>{cls.teacherName}</td>
                <td>{cls.total}</td>
                <td style={{ color: 'var(--success-light)', fontWeight: 600 }}>{cls.present}</td>
                <td style={{ color: 'var(--danger-light)', fontWeight: 600 }}>{cls.absent}</td>
                <td style={{ color: 'var(--warning-light)', fontWeight: 600 }}>{cls.late}</td>
                <td>
                  <span className={`attendance-pct ${getPctClass(cls.percentage)}`}>
                    {cls.percentage}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassWiseTable;
