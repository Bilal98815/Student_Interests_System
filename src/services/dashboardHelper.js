import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import Cookies from "js-cookie";
import {
  subDays,
  startOfDay,
  endOfDay,
  isWithinInterval,
  differenceInDays,
  getHours,
  format,
  isAfter,
  parse,
} from "date-fns";
import Interest from "../models/InterestModel";
import CityModel from "../models/CityModel";
import AgeModel from "../models/AgeModel";
import DegreeModel from "../models/DegreeModel";
import DepartmentModel from "../models/DepartmentModel";
import GenderModel from "../models/GenderModel";

const DashBoardHelper = () => {
  const [interestNumber, setInterestsNumber] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [topInterests, setTopInterests] = useState([]);
  const [bottomInterests, setBottomInterests] = useState([]);
  const [cities, setCities] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [genders, setGenders] = useState([]);
  const [ages, setAges] = useState([]);
  const [dailyCounts, setDailyCounts] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [studyStatusCount, setStudyStatusCount] = useState([]);
  const [students, setStudents] = useState([]);
  const [last30DaysActiveHours, set30DaysActiveTime] = useState([]);
  const [last30DaysLeastHours, set30DaysLeastTime] = useState([]);
  const [last24HoursCount, setLast24HoursCount] = useState([]);
  const [last30DaysCount, setLast30DaysCount] = useState([]);

  const isFutureDate = (date) => {
    return date > currentDate;
  };

  const isPastDate = (date) => {
    return date < currentDate;
  };

  const isInSameMonth = (date) => {
    return (
      date.getMonth() === currentDate.getMonth() &&
      date.getFullYear() === currentDate.getFullYear()
    );
  };

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

  function calculateAge(dateOfBirth) {
    const dob = formatDate(dateOfBirth);

    const dateComponents = dob.split("/");
    const day = parseInt(dateComponents[1]);
    const month = dateComponents[0];
    const year = parseInt(dateComponents[2]);

    const currentDate = new Date();
    const currentDateString = formatDate(currentDate);

    const currentDateComponents = currentDateString.split("/");
    const currentDay = parseInt(currentDateComponents[1]);
    const currentMonth = currentDateComponents[0];
    const currentYear = parseInt(currentDateComponents[2]);

    const age = currentYear - year;

    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
      return age - 1;
    }

    return age;
  }

  useEffect(() => {
    const getTopAndBottomInterests = async () => {
      try {
        setLoading(true);
        let newData = [];
        // Get all interests and their counts
        await getDocs(collection(db, "interests")).then((querySnapshot) => {
          newData = querySnapshot.docs.map((doc) => doc.data().interest);
          setInterestsNumber(newData.length);
        });

        // Create a map to store interest counts
        const interestCounts = new Map();
        const cityCounts = new Map();
        const degreeCounts = new Map();
        const departmentCounts = new Map();
        const genderCounts = new Map();
        const ageCounts = new Map();
        const recentlyStudyMap = new Map();
        const recentlyEnrolledMap = new Map();
        const aboutGraduatedMap = new Map();
        const graduatedMap = new Map();
        const currentDateTemp = new Date();

        const processedStudents = [];

        // Iterate over students to count interests
        const studentsSnapshot = await getDocs(collection(db, "students"));
        studentsSnapshot.forEach((doc) => {
          const studentData = doc.data();
          if (studentData.interest) {
            const interest = studentData.interest;

            interestCounts.set(
              interest,
              (interestCounts.get(interest) || 0) + 1
            );
          }
          if (studentData.city) {
            const city = studentData.city;
            cityCounts.set(city, (cityCounts.get(city) || 0) + 1);
          }

          if (studentData.degree) {
            const degree = studentData.degree;
            degreeCounts.set(degree, (degreeCounts.get(degree) || 0) + 1);
          }

          if (studentData.gender) {
            const gender = studentData.gender;
            genderCounts.set(gender, (genderCounts.get(gender) || 0) + 1);
          }

          if (studentData.department) {
            const department = studentData.department;
            departmentCounts.set(
              department,
              (departmentCounts.get(department) || 0) + 1
            );
          }
          if (studentData.dateOfBirth) {
            const age = calculateAge(studentData.dateOfBirth);
            ageCounts.set(age, (ageCounts.get(age) || 0) + 1);
          }

          const startDate = parse(
            studentData.startDate,
            "yyyy-MM-dd",
            new Date()
          );
          const endDate = parse(studentData.endDate, "yyyy-MM-dd", new Date());

          if (isInSameMonth(startDate)) {
            recentlyEnrolledMap.set(
              "recentlyEnrolled",
              (recentlyEnrolledMap.get("recentlyEnrolled") || 0) + 1
            );
          } else if (isInSameMonth(endDate)) {
            aboutGraduatedMap.set(
              "aboutGraduate",
              (aboutGraduatedMap.get("aboutGraduate") || 0) + 1
            );
          } else if (isFutureDate(endDate)) {
            recentlyStudyMap.set(
              "studying",
              (recentlyStudyMap.get("studying") || 0) + 1
            );
          } else if (isPastDate(endDate)) {
            graduatedMap.set(
              "graduated",
              (graduatedMap.get("graduated") || 0) + 1
            );
          }

          processedStudents.push(studentData);
        });

        const studyingArray = Array.from(
          recentlyStudyMap,
          ([study, count]) => ({
            study,
            count,
          })
        );
        const recentlyEnrolledArray = Array.from(
          recentlyEnrolledMap,
          ([enrolled, count]) => ({
            enrolled,
            count,
          })
        );
        const graduatedArray = Array.from(
          graduatedMap,
          ([graduated, count]) => ({
            graduated,
            count,
          })
        );

        console.log("Map size:", graduatedMap.size);
        const aboutGraduateArray = Array.from(
          aboutGraduatedMap,
          ([aboutGraduate, count]) => ({
            aboutGraduate,
            count,
          })
        );

        const agesArray = Array.from(ageCounts, ([age, count]) => ({
          age,
          count,
        }));
        const topAges = agesArray.map((age) => {
          return new AgeModel(age.age, ageCounts.get(age.age) || 0);
        });

        setAges(topAges);

        const cititesArray = Array.from(cityCounts, ([city, count]) => ({
          city,
          count,
        }));
        const topCitites = cititesArray.map((city) => {
          return new CityModel(city.city, cityCounts.get(city.city) || 0);
        });
        setCities(topCitites);

        const degreesArray = Array.from(degreeCounts, ([degree, count]) => ({
          degree,
          count,
        }));
        const topDegrees = degreesArray.map((degree) => {
          return new DegreeModel(
            degree.degree,
            degreeCounts.get(degree.degree) || 0
          );
        });
        setDegrees(topDegrees);

        const departmentArray = Array.from(
          departmentCounts,
          ([department, count]) => ({
            department,
            count,
          })
        );
        const topDepartments = departmentArray.map((department) => {
          return new DepartmentModel(
            department.department,
            departmentCounts.get(department.department) || 0
          );
        });
        setDepartments(topDepartments);

        const genderArray = Array.from(genderCounts, ([gender, count]) => ({
          gender,
          count,
        }));
        const topGenders = genderArray.map((gender) => {
          return new GenderModel(
            gender.gender,
            genderCounts.get(gender.gender) || 0
          );
        });
        setGenders(topGenders);

        // Sort interests based on counts
        const sortedInterests = newData.sort((a, b) => {
          const countA = interestCounts.get(a) || 0;
          const countB = interestCounts.get(b) || 0;
          return countB - countA;
        });

        // Get top 5 and bottom 5 interests
        const top5Interests = sortedInterests.slice(0, 5).map((interest) => {
          return new Interest(interest, interestCounts.get(interest) || 0);
        });
        // const top5Interests = sortedInterests.slice(0, 5);
        const bottom5Interests = sortedInterests.slice(-5);

        setTopInterests(top5Interests);
        setBottomInterests(bottom5Interests);

        setCurrentDate(currentDateTemp);

        let startDate = startOfDay(subDays(currentDateTemp, 30));
        const dailyCountsArray = Array(30).fill(0);

        const querySnapshot = await getDocs(
          query(
            collection(db, "students"),
            where("time", ">=", startDate),
            where("time", "<=", currentDateTemp)
          )
        );

        // Iterate through the documents and count them for each day
        querySnapshot.forEach((doc) => {
          const timestamp = doc.data().time.toDate();
          const daysAgo = differenceInDays(currentDateTemp, timestamp);
          if (daysAgo >= 0 && daysAgo < 30) {
            dailyCountsArray[29 - daysAgo]++;
          }
        });

        console.log(dailyCountsArray.reverse());

        setDailyCounts(dailyCountsArray.reverse());

        setStudents(processedStudents);

        const startTime = subDays(currentDateTemp, 30);

        const snapShots = await getDocs(collection(db, "users"));

        const users = snapShots.docs.map((snapshot) => ({
          id: snapshot.id,
          ...snapshot.data(),
        }));

        const hoursMap = new Map();

        users.forEach((user) => {
          const timeStampArray = user.time;
          timeStampArray.forEach((timeTemp) => {
            const timeStampDate = timeTemp.toDate();
            if (isAfter(timeStampDate, startTime)) {
              const hour = getHours(timeStampDate);
              const formattedHour = format(timeStampDate, "h a");

              if (hoursMap.has(formattedHour)) {
                hoursMap.set(formattedHour, hoursMap.get(formattedHour) + 1);
              } else {
                hoursMap.set(formattedHour, 1);
              }
            }
          });
        });

        const hoursArray = Array.from(hoursMap, ([hour, count]) => ({
          hour,
          count,
        }));
        hoursArray.sort((a, b) => b.count - a.count);
        const top5Hours = hoursArray.slice(0, 5);

        hoursArray.sort((a, b) => a.count - b.count);
        const least5Hours = hoursArray.slice(0, 5);

        set30DaysActiveTime(top5Hours);
        set30DaysLeastTime(least5Hours);

        startDate = new Date(currentDateTemp);
        startDate.setHours(startDate.getHours() - 24);

        const logsCollection = collection(db, "logs");
        const q = query(
          logsCollection,
          where("time", ">=", Timestamp.fromDate(startDate)),
          where("time", "<=", Timestamp.fromDate(currentDateTemp))
        );

        const logsSnapshot = await getDocs(q);

        const countPerHour = new Map();

        for (let hour = 0; hour <= 23; hour++) {
          const formattedHourTemp = `${
            hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
          }${hour < 12 ? "AM" : "PM"}`;
          countPerHour.set(formattedHourTemp, 0);
        }

        logsSnapshot.forEach((doc) => {
          const timestamp = doc.data().time.toDate();
          const hour = timestamp.getHours();

          const hour12 = hour % 12 || 12;
          const amPm = hour < 12 ? "AM" : "PM";

          const count = doc.data().count;

          const formattedHour = hour12 + amPm;

          countPerHour.set(
            formattedHour,
            (countPerHour.get(formattedHour) || 0) + count
          );
        });

        const logHoursArray = Array.from(countPerHour, ([hour, count]) => ({
          hour,
          count,
        }));

        console.log(logHoursArray);

        setLast24HoursCount(logHoursArray);

        startDate = startOfDay(subDays(currentDateTemp, 30));

        const countsPerHourArr = Array(30).fill(0);

        const logsQuerySnapShots = await getDocs(
          query(
            collection(db, "logs"),
            where("time", ">=", startDate),
            where("time", "<=", currentDateTemp)
          )
        );

        logsQuerySnapShots.forEach((doc) => {
          const timeStamp = doc.data().time.toDate();
          const daysAgo = differenceInDays(currentDateTemp, timeStamp);

          if (daysAgo >= 0 && daysAgo < 30) {
            countsPerHourArr[daysAgo]++;
          }
        });

        setLast30DaysCount(countsPerHourArr.reverse());

        const statusCount = [
          studyingArray.length > 0 ? studyingArray[0].count : 0,
          recentlyEnrolledArray.length > 0 ? recentlyEnrolledArray[0].count : 0,
          aboutGraduateArray.length > 0 ? aboutGraduateArray[0].count : 0,
          graduatedArray.length > 0 ? graduatedArray[0].count : 0,
        ];

        setStudyStatusCount(statusCount);
        let count = Cookies.get("activityCount");
        count++;
        Cookies.set("activityCount", count);

        const activity = {
          time: new Date(),
          count: 1,
        };
        addDoc(collection(db, "logs"), activity);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("Error getting interests:", error);
      }
    };

    getTopAndBottomInterests();
  }, []);

  return {
    interestNumber,
    isLoading,
    topInterests,
    bottomInterests,
    cities,
    degrees,
    departments,
    genders,
    ages,
    dailyCounts,
    currentDate,
    studyStatusCount,
    students,
    last30DaysActiveHours,
    last30DaysLeastHours,
    last24HoursCount,
    last30DaysCount,
  };
};

export default DashBoardHelper;
