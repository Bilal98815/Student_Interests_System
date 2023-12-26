import "../styles/main.css";
import "../styles/util.css";
import image from "../assets/img-01.png";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import Cookies from "js-cookie";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  doc,
  addDoc,
  where,
  updateFieldValue,
  arrayUnion,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ButtonLoader from "../components/ButtonLoader";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNaviagte = () => {
    navigate("/signup");
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setLoading(true);

    if (email !== "" && password !== "") {
      const admins = await getDocs(collection(db, "admin"));

      var isAdminFound = false;

      admins.forEach(async (admin) => {
        if (admin.data().email == email && admin.data().password == password) {
          isAdminFound = true;
          console.log("Login Successful!");
          Cookies.set("role", "admin", { expires: 1 });
          setEmail("");
          setPassword("");
          const activity = {
            time: new Date(),
            count: 1,
          };
          await addDoc(collection(db, "logs"), activity);
          Cookies.set("userId", "1", { expires: 1 });
          Cookies.set("activityCount", 1, { expires: 1 });
          setLoading(false);
          navigate("/addStudent");
        }
      });
      if (!isAdminFound) {
        setLoading(true);
        await signInWithEmailAndPassword(auth, email, password)
          .then(async (userCredential) => {
            console.log(userCredential.user.uid);

            const q = query(
              collection(db, "users"),
              where("uid", "==", userCredential.user.uid)
            );

            const snapShots = await getDocs(q);

            if (snapShots.size != 0) {
              const document = snapShots.docs[0];
              console.log("doc id: ", document.id);
              await updateDoc(doc(db, "users", document.id), {
                ["time"]: arrayUnion(new Date()),
              });
              const activity = {
                time: new Date(),
                count: 1,
              };
              await addDoc(collection(db, "logs"), activity);
              Cookies.set("role", "user", { expires: 1 });
              Cookies.set("userId", document.id, { expires: 1 });
              Cookies.set("activityCount", 1, { expires: 1 });
              const user = "user";
              setEmail("");
              setPassword("");
              setLoading(false);
              navigate(`/students/${user}`);
            } else {
              setLoading(false);
              setTimeout(() => {
                setError("");
              }, 2000);
              setError("Something went wrong!");
            }
          })
          .catch((e) => {
            setLoading(false);
            setTimeout(() => {
              setError("");
            }, 2000);
            setError(e.message);
          });
      }
    } else {
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 2000);
      setError("Please Enter Email and Password!");
    }
  };

  return (
    <div>
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <div className="login100-pic js-tilt" data-tilt>
              <img src={image} alt="IMG" />
            </div>
            <form className="login100-form validate-form">
              <span className="login100-form-title">Member Login</span>

              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  type="text"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </span>
              </div>

              <div className="wrap-input100 validate-input">
                <input
                  className="input100"
                  type="password"
                  name="pass"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="focus-input100"></span>
                <span className="symbol-input100">
                  <i className="fa fa-lock" aria-hidden="true"></i>
                </span>
              </div>

              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? <ButtonLoader /> : "Login"}
                </button>
              </div>
              {error && (
                <p
                  style={{
                    color: "#9d0208",
                    justifyContent: "center",
                    display: "flex",
                  }}
                >
                  {error}
                </p>
              )}

              <div className="text-center p-t-136">
                <a className="txt2" href="/signup" onClick={handleNaviagte}>
                  Create your Account
                  <i
                    className="fa fa-long-arrow-right m-l-5"
                    aria-hidden="true"
                  ></i>
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
