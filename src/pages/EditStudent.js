import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import db from "../firebase";
import "../styles/styles.css";
import TitleBar from "../components/TitleBar";

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState({});
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [dateOfBirth, setDob] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [city, setCity] = useState("");
  const [interest, setInterest] = useState("");
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const cities = [
    "Select City",
    "Lahore",
    "Islamabad",
    "Rawalpindi",
    "Faisalabad",
    "Multan",
    "Karachi",
    "Quetta",
    "Peshawar",
    "Other",
  ];

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const getInterests = async () => {
      await getDocs(collection(db, "interests")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => doc.data().interest);
        setInterests(newData);
      });
    };

    getInterests();
  }, []);

  useEffect(() => {
    setLoading(true);
    const getStudent = async () => {
      try {
        const studentDoc = await getDoc(doc(db, "students", id));
        if (studentDoc.exists()) {
          setStudent(studentDoc.data());
          setFullName(studentDoc.data().fullName);
          setRollNo(studentDoc.data().rollNo);
          setCity(studentDoc.data().city);
          setDegree(studentDoc.data().degree);
          setDepartment(studentDoc.data().department);
          setSubject(studentDoc.data().subject);
          setGender(studentDoc.data().gender);
          setEmail(studentDoc.data().email);
          setDob(new Date(studentDoc.data().dateOfBirth.toMillis()));
          setStartDate(new Date(studentDoc.data().startDate.toMillis()));
          setEndDate(new Date(studentDoc.data().endDate.toMillis()));
          setInterest(studentDoc.data().interest);

          console.log("Student found!!");
          setLoading(false);
        } else {
          setLoading(false);
          console.error("Student not found");
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching student:", error);
      }
    };

    getStudent();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "students", id), {
        fullName,
        rollNo,
        gender,
        email,
        startDate,
        endDate,
        dateOfBirth,
        degree,
        department,
        subject,
        interest,
        city,
      });
      console.log("Student updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div>
      <TitleBar />
      <div className="navbarDiv">
        <nav className="navbar">
          <h2>Edit Student</h2>
        </nav>
      </div>
      <div className="container">
        <div className="form-group">
          <div>
            <label className="label" htmlFor="fullName">
              Full Name:
            </label>
            <input
              type="text"
              id="fullName"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="rollNo">
              Roll Number:
            </label>
            <input
              type="text"
              id="rollNo"
              className="input-field"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="email">
              Email:
            </label>
            <input
              type="text"
              id="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="select-field">
            <label className="label" htmlFor="gender">
              Gender:
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="select-field">
            <label className="label" htmlFor="dob">
              Date of Birth:
            </label>
            <DatePicker
              id="dob"
              selected={dateOfBirth}
              onChange={(date) => setDob(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
            />
          </div>
          <div className="select-field">
            <label className="label" htmlFor="city">
              City:
            </label>
            <select
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="select-field">
            <label className="label" htmlFor="interests">
              Interest:
            </label>
            <select
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            >
              <option value="">Select an Option</option>
              {interests.map((tempInterest, index) => (
                <option key={index} value={tempInterest}>
                  {tempInterest}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <div className="select-field">
            <label className="label" htmlFor="department">
              Department:
            </label>
            <select
              id="department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select an Option</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">
                Information Technology
              </option>
              <option value="Data Science">Data Science</option>
            </select>
          </div>
          <div className="select-field">
            <label className="label" htmlFor="degree">
              Degree Title:
            </label>
            <select
              id="degree"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
            >
              <option value="">Select an Option</option>
              <option value="Associate Degree">Associate Degree</option>
              <option value="Bachelors Degree">Bachelors Degree</option>
              <option value="M.Phil Degree">M.Phil Degree</option>
              <option value="Post-Graduate Degree">Post-Graduate Degree</option>
              <option value="Doctorate">Doctorate</option>
              <option value="Post-Doctorate">Post-Doctorate</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="subject">
              Subject:
            </label>
            <input
              className="input-field"
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <div className="date-picker">
            <label className="label" htmlFor="startDate">
              Start Date:
            </label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
            />
          </div>
          <div className="date-picker">
            <label className="label" htmlFor="endDate">
              End Date:
            </label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="DD/MM/YYYY"
            />
          </div>
        </div>
        <div className="button-container">
          <button className="button" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
