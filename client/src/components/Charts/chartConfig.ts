import { Doughnut, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const chartOptions = {
  maintainAspectRatio: false,
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'right' as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const colors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FFCD56', '#4BC0C0', '#C9CBCF', '#36A2EB',
  '#B6B6B6', '#8B8B8B', '#6B6B6B', '#4B4B4B', '#2B2B2B',
  '#FFD700', '#ADFF2F', '#00CED1', '#9400D3', '#FF4500'
];


export {
  colors, 
  chartOptions, 
  Bar, 
  Pie, 
  Doughnut
}