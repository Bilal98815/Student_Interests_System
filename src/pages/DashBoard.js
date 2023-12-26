import PieChart from "../components/PieChart";
import TitleBar from "../components/TitleBar";
import LineChart from "../components/LineChart";
import DashBoardHelper from "../services/dashboardHelper";
import { subDays } from "date-fns";
import "../styles/dashboardStyles.css";
import Loader from "../components/Loader";
import InterestTile from "../components/InterestTile";
import BarChart from "../components/BarChart";
import Cookies from "js-cookie";

const Dashboard = () => {
  const {
    interestNumber,
    isLoading,
    topInterests,
    bottomInterests,
    cities,
    degrees,
    departments,
    genders,
    ages,
    dailyCounts,
    currentDate,
    studyStatusCount,
    students,
    last30DaysActiveHours,
    last30DaysLeastHours,
    last24HoursCount,
    last30DaysCount,
  } = DashBoardHelper();

  const getColor = (index) => {
    const colors = ["#c1121f", "#fb8500", "#ffd500", "#03045e", "#06d6a0"];
    return colors[index % colors.length];
  };

  const pieChartCity = {
    labels: cities.map((city) => city.city),
    datasets: [
      {
        data: cities.map((city) => city.count),
        backgroundColor: cities.map((_, index) => getColor(index)),
        hoverBackgroundColor: cities.map((_, index) => getColor(index)),
      },
    ],
  };

  const pieChartDegree = {
    labels: degrees.map((degree) => degree.degree),
    datasets: [
      {
        data: degrees.map((degree) => degree.count),
        backgroundColor: degrees.map((_, index) => getColor(index)),
        hoverBackgroundColor: degrees.map((_, index) => getColor(index)),
      },
    ],
  };

  const pieChartDepartment = {
    labels: departments.map((department) => department.department),
    datasets: [
      {
        data: departments.map((department) => department.count),
        backgroundColor: departments.map((_, index) => getColor(index)),
        hoverBackgroundColor: departments.map((_, index) => getColor(index)),
      },
    ],
  };

  const pieChartGender = {
    labels: genders.map((gender) => gender.gender),
    datasets: [
      {
        data: genders.map((gender) => gender.count),
        backgroundColor: genders.map((_, index) => getColor(index)),
        hoverBackgroundColor: genders.map((_, index) => getColor(index)),
      },
    ],
  };

  const barChartAge = {
    labels: ages.map((age) => age.age),
    datasets: [
      {
        label: "Age",
        data: ages.map((age) => age.count),
        backgroundColor: "#c1121f",
        borderColor: "#fb8500",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: Array.from({ length: 30 }, (_, index) => {
      const date = subDays(currentDate, index);
      return date.toLocaleDateString();
    }).reverse(),
    datasets: [
      {
        label: "Submission Chart",
        data: dailyCounts,
        fill: false,
        borderColor: "#36A2EB",
      },
    ],
  };

  const lineChartDataForLast24Hours = {
    labels: last24HoursCount.map((hour) => hour.hour),
    datasets: [
      {
        label: "Submission Chart",
        data: last24HoursCount.map((hour) => hour.count),
        fill: false,
        borderColor: "#36A2EB",
      },
    ],
  };

  const lineChartDataForLast30Days = {
    labels: Array.from({ length: 30 }, (_, index) => {
      const date = subDays(currentDate, index);
      return date.toLocaleDateString();
    }).reverse(),
    datasets: [
      {
        label: "Submission Chart",
        data: last30DaysCount,
        fill: false,
        borderColor: "#36A2EB",
      },
    ],
  };

  const studentsStatus = [
    "Studying",
    "Recently Enrolled",
    "About to Graduate",
    "Graduated",
  ];

  if (isLoading) {
    return (
      <div className="loader">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <TitleBar />
      <div className="background-container">
        <div className="mega-interest-container">
          <div className="interest-container">
            <p>Top 5 Interests</p>
            <div>
              {topInterests.map((interest) => (
                <InterestTile interest={interest.interest} />
              ))}
            </div>
            <p>Bottom 5 Interests</p>
            <div>
              {bottomInterests.map((interest) => (
                <InterestTile interest={interest} />
              ))}
            </div>
          </div>
          <div className="distinct-interests">
            <h1>Distinct Interests</h1>
            <p>{interestNumber}</p>
          </div>
        </div>
        <div className="content">
          <div className="pie-chart">
            <PieChart data={pieChartCity} />
            <h3>Provincial Distribution</h3>
          </div>
          <div className="pie-chart">
            <PieChart data={pieChartDegree} />
            <h3>Degree Distribution</h3>
          </div>
          <div className="pie-chart">
            <PieChart data={pieChartDepartment} />
            <h3>Department Distribution</h3>
          </div>
        </div>
        <div className="content">
          <div className="pie-chart">
            <PieChart data={pieChartGender} />
            <h3>Gender Distribution</h3>
          </div>
          <div className="pie-chart">
            <BarChart data={barChartAge} />
            <h3>Age Distribution</h3>
          </div>
        </div>
        <div className="content">
          <div className="pie-chart">
            <LineChart data={lineChartData} />
            <h3>Submission Chart</h3>
          </div>
          <table className="table-decoration">
            <thead>
              <tr>
                <th>Students Status</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {studentsStatus.map((status, index) => (
                <tr key={index}>
                  <td>{status}</td>
                  <td>{studyStatusCount[index]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="content">
          <table className="table-decoration">
            <thead>
              <tr>
                <th>Most Active Hours in Last 30 Days</th>
              </tr>
            </thead>
            <tbody>
              {last30DaysActiveHours.map((time, index) => (
                <tr key={index}>
                  <td>-{time.hour}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table className="table-decoration">
            <thead>
              <tr>
                <th>Least Active Hours in Last 30 Days</th>
              </tr>
            </thead>
            <tbody>
              {last30DaysLeastHours.map((time, index) => (
                <tr key={index}>
                  <td>-{time.hour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="content">
          <div className="pie-chart">
            <LineChart data={lineChartDataForLast24Hours} />
            <h3>Last 24 Hours Activity Chart</h3>
          </div>
          <div className="pie-chart">
            <LineChart data={lineChartDataForLast30Days} />
            <h3>Last 30 Days Activity Chart</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
