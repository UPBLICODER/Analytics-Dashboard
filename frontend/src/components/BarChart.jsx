import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function BarChart({ data, onBarClick, selectedFeature }) {
  const labels = data.map((item) => item.feature_name);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Clicks",
        data: data.map((item) => item.total_clicks),
        backgroundColor: labels.map((f) =>
          f === selectedFeature ? "#2563eb" : "#3b82f6",
        ),
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    animation: { duration: 0 },
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return "Clicks: " + context.parsed.x;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: "#666",
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#666",
        },
      },
    },
    onClick: (event, elements) => {
      if (!elements.length) return;

      const index = elements[0].index;
      const feature = data[index].feature_name;

      onBarClick(feature);
    },
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
