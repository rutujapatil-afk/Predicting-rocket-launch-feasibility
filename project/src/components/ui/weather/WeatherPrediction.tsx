import { Card, CardContent } from "@/components/ui/card";
import { Bar } from "react-chartjs-2";

const WeatherResult = ({ data }) => {
  const chartData = {
    labels: ["Temperature (°C)", "Wind (m/s)", "Precipitation (mm)"],
    datasets: [
      {
        label: "Conditions",
        data: [
          data.conditions.temperature,
          data.conditions.wind,
          data.conditions.precipitation
        ],
        backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"]
      }
    ]
  };

  return (
    <Card className="mt-4 shadow-xl p-4">
      <CardContent>
        <h2 className="text-xl font-semibold">Weather Prediction</h2>
        <p className="mt-2">
          <strong>Suitable:</strong> {data.suitable ? "Yes" : "No"}
        </p>
        <p>
          <strong>Confidence:</strong> {(data.confidence * 100).toFixed(1)}%
        </p>
        <div className="mt-4">
          <Bar data={chartData} />
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherResult;
