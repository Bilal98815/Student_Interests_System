import "../styles/main.css";
import "../styles/util.css";
import image from "../assets/img-01.png";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import ButtonLoader from "../components/ButtonLoader";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleNaviagte = () => {
    navigate("/");
  };

  const handleCreate = async (event) => {
    event.preventDefault();

    setLoading(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const activity = {
          time: new Date(),
          count: 1,
        };
        await addDoc(collection(db, "logs"), activity);
        const docId = await addDoc(collection(db, "users"), {
          email: email,
          uid: userCredential.user.uid,
          time: [],
        });
        setLoading(false);
        navigate("/");
      })
      .catch((e) => {
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 2000);
        setError(e.message);
      });
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
              <span className="login100-form-title">User Register</span>

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
                  {loading ? <ButtonLoader /> : "Signup"}
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
                <a className="txt2" href="/" onClick={handleNaviagte}>
                  Already have an account? Login
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

export default Signup;
