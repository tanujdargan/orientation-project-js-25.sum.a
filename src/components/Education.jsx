// - course
// - school
// - start_date
// - end_date
// - grade
// - logo

import React, { useEffect } from "react";
import { useState } from "react";
import { addEducation, getEducation } from "../requests/education";

const Education = () => {
  const [addEducation, setAddEducation] = useState(false);
  const [educationData, setEducationData] = useState([
    //populate the initial state with data
    {
      course: "Bachelor of Science in Computer Science",
      school: "University of Example",
      start_date: "2015-09-01",
      end_date: "2019-06-30",
      grade: "First Class",
      logo: "https://example.com/logo.png",
    },
    {
      course: "Master of Science in Software Engineering",
      school: "Example University",
      start_date: "2020-09-01",
      end_date: "2022-06-30",
      grade: "Distinction",
      logo: "https://example.com/logo2.png",
    },
  ]);

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
      {addEducation && (
        <EducationForm
          setEducationData={setEducationData}
          setAddEducation={setAddEducation}
        />
      )}
      <div className="education-wrapper">
        {!addEducation &&
          educationData.map((edu, index) => (
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
      </div>
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
    <div className="education-card">
      <div className="education-logo">
        <img src={logo} alt={`${school} logo`} />
      </div>
      <div className="education-info">
        <h3 className="education-course">{course}</h3>
        <h4 className="education-school">{school}</h4>
        <p className="education-dates">
          {start_date} - {end_date}
        </p>
        <p className="education-grade">{grade}</p>
      </div>
    </div>
  );
}

function EducationForm({ setEducationData, setAddEducation }) {
  const [initialValues, setInitialValues] = useState({
    course: "",
    school: "",
    start_date: "",
    end_date: "",
    grade: "",
    logo: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await addEducation(initialValues);
      // Reset form after successful submission
      setInitialValues({
        course: "",
        school: "",
        start_date: "",
        end_date: "",
        grade: "",
        logo: "",
      });

      setEducationData((prevData) => [
        ...prevData,
        initialValues, // Add the new education data to the existing data
      ]);

      setAddEducation(false); // Hide the form after submission

      //showing success message
      alert("Education data added successfully!");
    } catch (error) {
      console.error("Error adding education data:", error);
    }
    // Updating education.
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
