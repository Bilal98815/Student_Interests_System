import "../styles/dashboardStyles.css";

const InterestTile = ({ interest }) => {
  return (
    <div className="interest-tile">
      <h5>{interest}</h5>
    </div>
  );
};

export default InterestTile;
