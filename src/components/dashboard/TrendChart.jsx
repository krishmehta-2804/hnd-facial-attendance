/**
 * TrendChart - Line chart showing attendance trends
 */
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TrendChart = ({ dailyData = [], weeklyData = [] }) => {
  const [period, setPeriod] = useState('daily');

  const currentData = period === 'daily' ? dailyData : weeklyData;

  const data = {
    labels: currentData.map((d) => d.label || d.shortLabel),
    datasets: [
      {
        label: 'Attendance %',
        data: currentData.map((d) => d.percentage),
        borderColor: '#3B82F6',
        backgroundColor: (ctx) => {
          const chart = ctx.chart;
          const { ctx: c, chartArea } = chart;
          if (!chartArea) return 'rgba(59, 130, 246, 0.1)';
          const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
          return gradient;
        },
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#0F172A',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#60A5FA',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.06)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
        },
      },
      y: {
        min: 50,
        max: 100,
        grid: {
          color: 'rgba(148, 163, 184, 0.06)',
          drawBorder: false,
        },
        ticks: {
          color: '#64748B',
          font: { family: 'Inter', size: 11 },
          callback: (value) => `${value}%`,
        },
      },
    },
    plugins: {
      legend: { display: false },
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
          label: (ctx) => ` Attendance: ${ctx.raw}%`,
        },
      },
    },
  };

  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <div>
          <div className="chart-card-title">Attendance Trend</div>
          <div className="chart-card-subtitle">
            {period === 'daily' ? 'Last 14 working days' : 'Last 4 weeks'}
          </div>
        </div>
        <div className="period-toggle">
          <button
            className={period === 'daily' ? 'active' : ''}
            onClick={() => setPeriod('daily')}
          >
            Daily
          </button>
          <button
            className={period === 'weekly' ? 'active' : ''}
            onClick={() => setPeriod('weekly')}
          >
            Weekly
          </button>
        </div>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default TrendChart;
