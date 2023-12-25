import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/studentsTable.css";
import { Link } from "react-router-dom";
import TitleBar from "../components/TitleBar";
import { useParams } from "react-router-dom";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [studentsLength, setStudentsLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("fullName");

  const { role } = useParams();

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

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const formattedDate = `${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
    return formattedDate;
  }

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

  const handleSort = (field) => {
    setSortField(field);
    setSortOrder((prevSortOrder) => (prevSortOrder === "asc" ? "desc" : "asc"));
  };

  const sortedStudents = [...students].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

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
            {role != "user" ? <Link to="/addStudent">Add Student</Link> : null}
          </div>
        </nav>
        <div className="top-items-container">
          <div className="page-navigation">
            <button
              className="sorting-button"
              onClick={() => handleSort("fullName")}
            >
              {sortOrder}ending
            </button>
          </div>
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
          {sortedStudents.slice(startIndex, endIndex).map((student, index) => (
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
                {role != "user" ? " | " : null}
                {role != "user" ? (
                  <Link
                    to={`/students/edit/${student.id}`}
                    className="action-link"
                  >
                    Edit
                  </Link>
                ) : null}
                {role != "user" ? " | " : null}
                {role != "user" ? (
                  <button
                    className="action-link"
                    onClick={() => handleDelete(student.id)}
                  >
                    Delete
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
