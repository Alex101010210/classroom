import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register all chart components once
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const BAR_PALETTE = [
  '#3b82d4', '#7c5cd8', '#10b981', '#f59e0b',
  '#ef4444', '#6366f1', '#14b8a6', '#f97316',
];

export const PIE_PALETTE = [
  '#3b82d4', '#7c5cd8', '#10b981', '#f59e0b',
  '#ef4444', '#6366f1', '#14b8a6', '#f97316',
];

export const defaultBarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.parsed.y} respuesta${ctx.parsed.y !== 1 ? 's' : ''}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { precision: 0 },
    },
  },
};

export const defaultPieOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { position: 'bottom' as const },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${ctx.label}: ${ctx.parsed} (${ctx.dataset.data[ctx.dataIndex]}%)`,
      },
    },
  },
};

// Made with Bob
