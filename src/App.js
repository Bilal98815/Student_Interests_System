import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FrontPage from "./pages/HomePage";
import StudentsPage from "./pages/Students";
import ViewStudent from "./pages/ViewStudent";
import EditStudent from "./pages/EditStudent";
import Dashboard from "./pages/DashBoard";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<FrontPage />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/students" element={<StudentsPage />} />
        <Route exact path="/students/view/:id" element={<ViewStudent />} />
        <Route exact path="/students/edit/:id" element={<EditStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
