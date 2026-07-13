/**
 * AttendanceChart - Doughnut chart showing present/absent/late distribution
 */
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const AttendanceChart = ({ present = 0, absent = 0 }) => {
  const total = present + absent;

  const data = {
    labels: ['Present', 'Absent'],
    datasets: [
      {
        data: [present, absent],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
        spacing: 3,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94A3B8',
          padding: 16,
          font: { family: 'Inter', size: 12, weight: '500' },
          usePointStyle: true,
          pointStyleWidth: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#E2E8F0',
        bodyColor: '#94A3B8',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 10,
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx) => {
            const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
            return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
          },
        },
      },
    },
  };

  const centerPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
      const { ctx, width, height } = chart;
      ctx.save();
      const pct = total > 0 ? Math.round((present / total) * 100) : 0;

      ctx.font = '800 28px Inter';
      ctx.fillStyle = '#E2E8F0';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${pct}%`, width / 2, height / 2 - 8);

      ctx.font = '500 11px Inter';
      ctx.fillStyle = '#64748B';
      ctx.fillText('Attendance', width / 2, height / 2 + 14);
      ctx.restore();
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">Today's Attendance</div>
          <div className="chart-card-subtitle">{total} students total</div>
        </div>
      </div>
      <div className="chart-wrapper doughnut">
        <Doughnut data={data} options={options} plugins={[centerPlugin]} />
      </div>
    </div>
  );
};

export default AttendanceChart;
