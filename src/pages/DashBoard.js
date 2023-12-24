import PieChart from "../components/PieChart";
import TitleBar from "../components/TitleBar";

const Dashboard = () => {
  const pieChartData = {
    labels: ["Label 1", "Label 2", "Label 3"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <TitleBar />
      <div style={{ width: "20%", padding: "30px", height: "20%" }}>
        <PieChart data={pieChartData} />
      </div>
    </div>
  );
};

export default Dashboard;
