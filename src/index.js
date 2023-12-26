import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  // </React.StrictMode>
  <App />
);

// const handleBeforeUnload = async () => {
//   console.log("Closing website");
//   // const id = Cookies.get("userId")
//   // await updateDoc(doc(db, "users", id), {
//   //   ["time"]: arrayUnion(new Date()),
//   // });
//   Cookies.remove("userId");
//   Cookies.remove("activityCount");
// };
// window.addEventListener("beforeunload", handleBeforeUnload);
