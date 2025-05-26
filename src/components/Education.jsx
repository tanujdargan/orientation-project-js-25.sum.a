// - course
// - school
// - start_date
// - end_date
// - grade
// - logo

import React, { useEffect } from "react";
import { useState } from "react";
import { getEducation } from "../requests/education";

const Education = () => {
  const [addEducation, setAddEducation] = useState(false);
  const [educationData, setEducationData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getEducation();
        setEducationData(data);
      } catch (error) {
        console.error("Error fetching education data:", error);
      }
    }
    fetchData();
  }, []);
  return (
    <div className="resumeSection">
      <h2>Education</h2>

      {educationData.length === 0 && <p>No education data available.</p>}
      {addEducation && <EducationForm />}
      {educationData.map((edu, index) => (
        <DisplayEducation
          key={index}
          course={edu.course}
          school={edu.school}
          start_date={edu.start_date}
          end_date={edu.end_date}
          grade={edu.grade}
          logo={edu.logo}
        />
      ))}
      <button onClick={() => setAddEducation(!addEducation)}>
        {addEducation ? "Hide Form" : "Add Education"}
      </button>
      <br></br>
    </div>
  );
};

function DisplayEducation({
  course,
  school,
  start_date,
  end_date,
  grade,
  logo,
}) {
  return (
    <div>
      <h2>{course}</h2>
      <p>{school}</p>
      <p>
        {start_date} - {end_date}
      </p>
      <p>{grade}</p>
      <img src={logo} alt={`${school} logo`} />
    </div>
  );
}

function EducationForm() {
  const [initialValues, setInitialValues] = useState({
    course: "",
    school: "",
    start_date: "",
    end_date: "",
    grade: "",
    logo: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    // Handle input changes
    const { name, value } = event.target;
    setInitialValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  return (
    <form className="educationFormWrapper" onSubmit={handleSubmit}>
      <div className="educationForm">
        <div>
          <label htmlFor="course">Course:</label>
          <input
            type="text"
            id="course"
            name="course"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="school">School:</label>
          <input
            type="text"
            id="school"
            name="school"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="start_date">Start Date:</label>
          <input
            type="date"
            id="start_date"
            name="start_date"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="end_date">End Date:</label>
          <input
            htmlFor="end_date"
            id="end_data"
            type="date"
            name="end_date"
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="grade">Grade:</label>
          <input type="text" id="grade" name="grade" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="logo">Logo URL:</label>
          <input id="logo" type="url" name="logo" onChange={handleChange} />
        </div>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Education;
