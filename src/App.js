import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FrontPage from "./pages/HomePage";
import StudentsPage from "./pages/Students";
import ViewStudent from "./pages/ViewStudent";
import EditStudent from "./pages/EditStudent";
import Dashboard from "./pages/DashBoard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/signup" element={<Signup />} />
        <Route exact path="/addStudent" element={<FrontPage />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/students/:role" element={<StudentsPage />} />
        <Route exact path="/students/view/:id" element={<ViewStudent />} />
        <Route exact path="/students/edit/:id" element={<EditStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
