import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import db from "../firebase";
import "../styles/studentsTable.css";
import { Link } from "react-router-dom";
import TitleBar from "../components/TitleBar";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [studentsLength, setStudentsLength] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const getStudents = onSnapshot(
      collection(db, "students"),
      (querySnapshot) => {
        const studentsList = [];
        querySnapshot.forEach((doc) => {
          studentsList.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setStudents(studentsList);
        setStudentsLength(studentsList.length);
        updateTotalPages(studentsList.length, 10);
        setLoading(false);
        console.log("Students added!!:");
        return;
      }
    );
    return () => getStudents();
  }, []);

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    console.log("Date of Birth is ", date.toLocaleDateString());
    return date.toLocaleDateString();
  };

  const updateTotalPages = (dataLength, page) => {
    console.log("Students list length ----->>>> ", dataLength);
    console.log("Page size ----->>>> ", page);
    const ceilValue = dataLength / page;
    console.log("Value to be ceil ----->>>> ", ceilValue);
    const pages = Math.ceil(ceilValue);
    console.log("Total pages ----->>>> ", pages);
    setTotalPages(pages);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    updateTotalPages(studentsLength, Number(e.target.value));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, "students", id));
      console.log("Student deleted successfully!");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error deleting student:", error);
    }
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div>
      <TitleBar />
      <div className="navbarDiv">
        <nav className="navbar">
          <h2>Students</h2>
          <div className="links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/">Add Student</Link>
          </div>
        </nav>
        <div className="dropdown">
          <label htmlFor="pageSize">Page Size:</label>
          <select
            id="pageSize"
            value={pageSize}
            className="page-size-dropdown"
            // onChange={(e) => setPageSize(Number(e.target.value))}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </select>
          <div className="page-navigation">
            <button onClick={() => handlePageChange(1)}>&lt;&lt;</button>
            <button onClick={() => handlePageChange(currentPage - 1)}>
              &lt;
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={() => handlePageChange(currentPage + 1)}>
              &gt;
            </button>
            <button onClick={() => handlePageChange(totalPages)}>
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
      <table className="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Department</th>
            <th>Date of Birth</th>
            <th>City</th>
            <th>Interest</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.slice(startIndex, endIndex).map((student, index) => (
            <tr key={student.id}>
              <td>{index + 1}</td>
              <td>{student.fullName}</td>
              <td>{student.rollNo}</td>
              <td>{student.department}</td>
              <td>{formatDate(student.dateOfBirth)}</td>
              <td>{student.city}</td>
              <td>{student.interest}</td>
              <td>
                <Link
                  to={`/students/view/${student.id}`}
                  className="action-link"
                >
                  View
                </Link>{" "}
                |{" "}
                <Link
                  to={`/students/edit/${student.id}`}
                  className="action-link"
                >
                  Edit
                </Link>{" "}
                |{" "}
                <button
                  className="action-link"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
