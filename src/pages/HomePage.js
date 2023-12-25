import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/styles.css";
import { Link } from "react-router-dom";
import TitleBar from "../components/TitleBar";

const FrontPage = () => {
  const [fullName, setFullName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [gender, setGender] = useState("");
  const [department, setDepartment] = useState("");
  const [degree, setDegree] = useState("");
  const [dob, setDob] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [interests, setInterests] = useState([]);
  const [interest, setInterest] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [admin, setAdmin] = useState("admin");

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

  useEffect(() => {
    const getInterests = async () => {
      await getDocs(collection(db, "interests")).then((querySnapshot) => {
        const newData = querySnapshot.docs.map((doc) => doc.data().interest);
        setInterests(newData);
      });
    };

    getInterests();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      if (newInterest !== "") {
        const docRef = await addDoc(collection(db, "interests"), {
          interest: newInterest,
        });
        console.log("New Interest Added:", newInterest);
        if (
          fullName !== "" &&
          email !== "" &&
          rollNo !== "" &&
          subject !== "" &&
          gender !== "" &&
          department !== "" &&
          degree !== "" &&
          dob !== "" &&
          startDate !== "" &&
          endDate !== "" &&
          selectedCity !== ""
        ) {
          const docId = await addDoc(collection(db, "students"), {
            fullName: fullName,
            email: email,
            rollNo: rollNo,
            subject: subject,
            gender: gender,
            department: department,
            degree: degree,
            dateOfBirth: dob,
            startDate: startDate,
            endDate: endDate,
            city: selectedCity,
            time: new Date(),
            interest: newInterest,
          });

          setFullName("");
          setEmail("");
          setRollNo("");
          setSelectedCity("");
          setDob("");
          setEndDate("");
          setStartDate("");
          setGender("");
          setDegree("");
          setDepartment("");
          setSubject("");
          setError("");
          setInterest("");
          setNewInterest("");

          setMessage("Student added successfully!");
          setTimeout(() => {
            setMessage("");
          }, 3000);

          console.log("Student Added:", docId);
        } else {
          setError("Please Fill All fields!");
          console.error("Please fill fields");
        }
      } else if (interest !== "") {
        if (
          fullName !== "" &&
          email !== "" &&
          rollNo !== "" &&
          subject !== "" &&
          gender !== "" &&
          department !== "" &&
          degree !== "" &&
          dob !== "" &&
          startDate !== "" &&
          endDate !== "" &&
          selectedCity !== ""
        ) {
          const docId = await addDoc(collection(db, "students"), {
            fullName: fullName,
            email: email,
            rollNo: rollNo,
            subject: subject,
            gender: gender,
            department: department,
            degree: degree,
            dateOfBirth: dob,
            startDate: startDate,
            endDate: endDate,
            city: selectedCity,
            time: new Date(),
            interest: interest,
          });

          setFullName("");
          setEmail("");
          setRollNo("");
          setSelectedCity("");
          setDob("");
          setEndDate("");
          setStartDate("");
          setGender("");
          setDegree("");
          setDepartment("");
          setSubject("");
          setError("");
          setInterest("");
          setNewInterest("");

          setMessage("Student added successfully!");
          setTimeout(() => {
            setMessage("");
          }, 3000);

          console.log("Student Added:", docId);
        } else {
          setError("Please Fill All fields!");
          console.error("Please fill fields");
        }
      } else {
        setError("Please Fill All fields!");
        console.error("Please fill fields");
      }
    } catch (e) {
      // setError("Error While Adding Student!");
      setMessage("Error While Adding Student!");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      console.error("Error adding student:", e);
    }
  };

  const handleCancel = () => {
    console.log("Cancel button clicked!");
  };

  return (
    <div>
      <TitleBar />
      <div className="navbarDiv">
        <nav className="navbar">
          <h2>Add Student</h2>
          <div className="links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to={`/students/${admin}`}>Students List</Link>
          </div>
        </nav>
      </div>

      <div className="container">
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
        <form className="form-container">
          <div className="container">
            <div className="form-group">
              {/* Full Name */}
              <div>
                <label className="label" htmlFor="fullName">
                  Full Name:
                </label>
                <input
                  className="input-field"
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Roll No */}
              <div>
                <label className="label" htmlFor="rollNo">
                  Roll No:
                </label>
                <input
                  className="input-field"
                  type="text"
                  id="rollNo"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="label" htmlFor="email">
                  Email:
                </label>
                <input
                  className="input-field"
                  type="text"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              {/* Gender Dropdown */}
              <div className="select-field">
                <label className="label" htmlFor="gender">
                  Gender:
                </label>
                <select
                  id="gender"
                  required
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="date-picker">
                <label className="label" htmlFor="dob">
                  Date of Birth:
                </label>
                <input
                  type="date"
                  id="dob"
                  value={dob}
                  onChange={(date) => setDob(date.target.value)}
                  required
                />
              </div>

              <div className="select-field">
                <label className="label" htmlFor="city">
                  City:
                </label>
                <select
                  id="city"
                  required
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
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
                  required
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
              <div className="select-field">
                <label className="label" htmlFor="newInterest">
                  New Interest:
                </label>
                <input
                  type="text"
                  id="newInterest"
                  required
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  disabled={!!interest} // Disable input field if an interest is selected from the dropdown
                />
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
                  required
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="">Select an Option</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">
                    Software Engineering
                  </option>
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
                  required
                  onChange={(e) => setDegree(e.target.value)}
                >
                  <option value="">Select an Option</option>
                  <option value="Associate Degree">Associate Degree</option>
                  <option value="Bachelors Degree">Bachelors Degree</option>
                  <option value="M.Phil Degree">M.Phil Degree</option>
                  <option value="Post-Graduate Degree">
                    Post-Graduate Degree
                  </option>
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
                  required
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
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(date) => setStartDate(date.target.value)}
                  required
                />
              </div>
              <div className="date-picker">
                <label className="label" htmlFor="endDate">
                  End Date:
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(date) => setEndDate(date.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="button-container">
            <button className="button" onClick={handleCreate}>
              Create
            </button>
            <button className="button button-cancel" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FrontPage;
