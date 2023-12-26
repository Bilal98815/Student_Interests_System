import "../styles/styles.css";
import Logout from "../assets/logout.png";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import Cookies from "js-cookie";

const TitleBar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const activity = {
      time: new Date(),
      count: 1,
    };
    await addDoc(collection(db, "logs"), activity);
    const role = Cookies.get("role");
    if (role === "user") {
      console.log("In user if");
      await auth.signOut();
    }
    navigate("/", { replace: true });
  };

  return (
    <div className="header">
      <h1>Student Interests System</h1>
      <img
        className="logout-image"
        src={Logout}
        alt="logout"
        onClick={handleLogout}
      />
    </div>
  );
};

export default TitleBar;
