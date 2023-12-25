import {
  Chart as ChartJS,
  PointElement,
  CategoryScale,
  LinearScale,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const LineChart = ({ data }) => {
  const options = {
    title: {
      display: true,
      text: "My Line Chart",
      fontSize: 16,
    },
    legend: {
      display: true,
      position: "bottom",
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
