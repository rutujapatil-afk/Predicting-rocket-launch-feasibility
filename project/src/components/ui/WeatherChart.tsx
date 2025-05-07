import { CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface WeatherChartProps {
  data: {
    temperature: number;
    wind: number;
    precipitation: number;
  };
}

export default function WeatherChart({ data }: WeatherChartProps) {
  const chartData = {
    labels: ['Temperature (°C)', 'Wind (km/h)', 'Precipitation (mm)'],
    datasets: [
      {
        label: 'Weather Conditions',
        data: [data.temperature, data.wind, data.precipitation],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
}
