import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import studentImage from "../assets/graduated.png";
import "../styles/viewStudentStyles.css";
import TitleBar from "../components/TitleBar";

function ViewStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  console.log("student id is: ", id);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentDoc = await getDoc(doc(db, "students", id));
        const activity = {
          time: new Date(),
          count: 1,
        };
        addDoc(collection(db, "logs"), activity);

        if (studentDoc.exists()) {
          setStudent({ id: studentDoc.id, ...studentDoc.data() });
        } else {
          console.log("Student not found");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudent();
  }, [id]);

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

  if (!student) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div>
      <TitleBar />
      <div className="navbarDiv">
        <nav className="navbar">
          <h2>Student Detail</h2>
        </nav>
      </div>
      <div className="student-details">
        <div className="image-container">
          <img src={studentImage} />
          <p className="name-heading">{student.fullName}</p>
        </div>
        <div className="mega-container">
          <div className="details-container">
            <h3>Personal Details</h3>
            <div className="detail-item">
              <p className="detail-heading">Gender: </p>
              <p className="detail-value">{student.gender}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Email: </p>
              <p className="detail-value">{student.email}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Date of Birth: </p>
              <p className="detail-value">{formatDate(student.dateOfBirth)}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Interest: </p>
              <p className="detail-value">{student.interest}</p>
            </div>
          </div>
          <div className="details-container">
            <h3>Education Details</h3>
            <div className="detail-item">
              <p className="detail-heading">Roll Number: </p>
              <p className="detail-value">{student.rollNo}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Degree: </p>
              <p className="detail-value">{student.degree}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Department: </p>
              <p className="detail-value">{student.department}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Subject: </p>
              <p className="detail-value">{student.subject}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">Start Date: </p>
              <p className="detail-value">{formatDate(student.startDate)}</p>
            </div>
            <div className="detail-item">
              <p className="detail-heading">End Date: </p>
              <p className="detail-value">{formatDate(student.endDate)}</p>
            </div>
          </div>
        </div>
        <div className="detail-box"></div>
      </div>
    </div>
  );
}

export default ViewStudent;
