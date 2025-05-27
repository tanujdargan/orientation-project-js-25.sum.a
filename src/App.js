import React, { useState, useEffect } from 'react';
import "./App.css";
import InfoForm from './InfoForm'; // Import the new form

const API_BASE_URL = 'http://localhost:5000'; // Assuming Python backend runs on port 5000

function App() {
  // Personal Information State
  const [personName, setPersonName] = useState('John Doe'); // Example
  const [personPhoneNumber, setPersonPhoneNumber] = useState('+1234567890'); // Example
  const [personEmail, setPersonEmail] = useState('john.doe@example.com'); // Example

  const [experienceList, setExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null); // null for new, object for edit
  const [educationFormData, setEducationFormData] = useState({
    course: '',
    school: '',
    start_date: '',
    end_date: '',
    grade: '',
    description: '',
    logo: 'example-logo.png' // Default or allow upload
  });

  // --- Experience State ---
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState(null); // null for new, object for edit
  const [experienceFormData, setExperienceFormData] = useState({
    title: '',
    company: '',
    start_date: '',
    end_date: '',
    description: '',
    logo: 'example-logo.png' // Default or allow upload
  });
  const [descriptionSuggestions, setDescriptionSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // --- Education State ---
  const [educationDescriptionSuggestions, setEducationDescriptionSuggestions] = useState([]);
  const [isLoadingEducationSuggestions, setIsLoadingEducationSuggestions] = useState(false);

  // --- Fetch Initial Data ---
  useEffect(() => {
    // Fetch experience
    fetch(`${API_BASE_URL}/resume/experience`)
      .then(res => res.json())
      .then(data => setExperienceList(data || []))
      .catch(err => console.error("Error fetching experience:", err));

    // Fetch education
    fetch(`${API_BASE_URL}/resume/education`)
      .then(res => res.json())
      .then(data => setEducationList(data || []))
      .catch(err => console.error("Error fetching education:", err));
  }, []);

  // --- Experience Handlers ---
  const handleOpenExperienceForm = (exp) => {
    if (exp) {
      setCurrentExperience(exp); // Assuming exp items have an 'id' or we use index
      // The backend uses list indices, so we need to find the index if not directly available
      // For simplicity, let's assume 'exp' includes its index or we can find it.
      // If 'exp' is directly from 'experienceList', its index is its position.
      // We need to be careful if 'exp' objects don't have a persistent unique ID from backend.
      // For now, let's assume 'exp' contains an 'index' property for PUT calls.
      setExperienceFormData({ ...exp });
    } else {
      setCurrentExperience(null);
      setExperienceFormData({ title: '', company: '', start_date: '', end_date: '', description: '', logo: 'example-logo.png' });
    }
    setDescriptionSuggestions([]);
    setShowExperienceForm(true);
  };

  const handleExperienceFormChange = (e) => {
    const { name, value } = e.target;
    setExperienceFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveExperience = async () => {
    const method = currentExperience && currentExperience.index !== undefined ? 'PUT' : 'POST';
    const url = currentExperience && currentExperience.index !== undefined 
                ? `${API_BASE_URL}/resume/experience/${currentExperience.index}` 
                : `${API_BASE_URL}/resume/experience`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experienceFormData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      // Refresh list
      fetch(`${API_BASE_URL}/resume/experience`)
        .then(res => res.json())
        .then(data => setExperienceList(data || []));
      setShowExperienceForm(false);
      setCurrentExperience(null);
    } catch (error) {
      console.error("Error saving experience:", error);
      alert(`Error saving experience: ${error.message}`);
    }
  };
  
  const handleGetSuggestions = async () => {
    if (!experienceFormData.description) {
      alert("Please enter a description first.");
      return;
    }
    
    let itemIndex = 0; // Default for new item, backend will use description from body
    if (currentExperience && currentExperience.index !== undefined) {
        itemIndex = currentExperience.index;
    } // No complex fallback needed if description is always sent in body.

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resume/experience/${itemIndex}/suggest-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: experienceFormData.description })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDescriptionSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      alert(`Error fetching suggestions: ${error.message}`);
      setDescriptionSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAcceptSuggestion = (suggestion) => {
    setExperienceFormData(prev => ({ ...prev, description: suggestion }));
    setDescriptionSuggestions([]);
  };

  // Helper to find index of an item in experienceList (if items don't have 'index' property)
  // This is crucial because the backend uses list indices.
  const findExperienceIndex = (expItem) => {
    // If expItem already has an index from backend (e.g. when loading), use it.
    // Otherwise, we need a robust way to map UI items to backend indices.
    // For simplicity, if items are just objects from the list, their actual index in the JS array is key.
    // This means when we load experienceList, we should augment it with indices.
    return experienceList.findIndex(item => 
        item.title === expItem.title && item.company === expItem.company // Example: simplistic comparison
    );
  };
  
  // Augment experienceList with indices when it's fetched/updated
  const augmentedExperienceList = experienceList.map((exp, index) => ({ ...exp, index }));

  // Augment educationList with indices
  const augmentedEducationList = educationList.map((edu, index) => ({ ...edu, index }));

  // --- Education Handlers ---
  const handleOpenEducationForm = (edu) => {
    if (edu) {
      setCurrentEducation(edu); 
      setEducationFormData({ ...edu });
    } else {
      setCurrentEducation(null);
      setEducationFormData({ course: '', school: '', start_date: '', end_date: '', grade: '', description: '', logo: 'example-logo.png' });
    }
    setEducationDescriptionSuggestions([]); // Reset suggestions
    setShowEducationForm(true);
  };

  const handleEducationFormChange = (e) => {
    const { name, value } = e.target;
    setEducationFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEducation = async () => {
    const method = currentEducation && currentEducation.index !== undefined ? 'PUT' : 'POST';
    const url = currentEducation && currentEducation.index !== undefined 
                ? `${API_BASE_URL}/resume/education/${currentEducation.index}` 
                : `${API_BASE_URL}/resume/education`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(educationFormData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      // Refresh list
      fetch(`${API_BASE_URL}/resume/education`)
        .then(res => res.json())
        .then(data => setEducationList(data || []));
      setShowEducationForm(false);
      setCurrentEducation(null);
    } catch (error) {
      console.error("Error saving education:", error);
      alert(`Error saving education: ${error.message}`);
    }
  };

  // --- AI Suggestion Handlers for Education ---
  const handleGetEducationSuggestions = async () => {
    if (!educationFormData.description) {
      alert("Please enter a description first.");
      return;
    }

    let itemIndex = 0; // Default for new or if index is not critical due to body a.description
    if (currentEducation && currentEducation.index !== undefined) {
        itemIndex = currentEducation.index;
    } 
    // If it's a new item, backend uses description from body. Send 0 as placeholder index.

    setIsLoadingEducationSuggestions(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resume/education/${itemIndex}/suggest-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: educationFormData.description })
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEducationDescriptionSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching education suggestions:", error);
      alert(`Error fetching education suggestions: ${error.message}`);
      setEducationDescriptionSuggestions([]);
    } finally {
      setIsLoadingEducationSuggestions(false);
    }
  };

  const handleAcceptEducationSuggestion = (suggestion) => {
    setEducationFormData(prev => ({ ...prev, description: suggestion }));
    setEducationDescriptionSuggestions([]);
  };

  return (
    <div className="App">
      <h1 className="no-print">Resume Builder</h1>

      {/* Personal Info Section */}
      <div className="resumeSection personal-info-section">
        <h2>Personal Information</h2>
        {/* Static display for printing */}
        <div className="personal-info-display print-only">
          <p><strong>Name:</strong> {personName}</p>
          <p><strong>Phone:</strong> {personPhoneNumber}</p>
          <p><strong>Email:</strong> {personEmail}</p>
        </div>
        {/* Editable Form for screen, will be hidden on print */}
        <div className="info-form-wrapper no-print">
          <InfoForm 
            name={personName}
            setName={setPersonName}
            phoneNumber={personPhoneNumber}
            setPhoneNumber={setPersonPhoneNumber}
            email={personEmail}
            setEmail={setPersonEmail}
          />
        </div>
      </div>

      {/* Experience Section */}
      <div className="resumeSection">
        <h2>Experience</h2>
        {augmentedExperienceList.map((exp, index) => (
          <div key={exp.id || index} className="resumeItem"> {/* Use a stable key */}
            <h4>{exp.title} at {exp.company}</h4>
            <p>{exp.description}</p>
            <button className="no-print" onClick={() => handleOpenExperienceForm(exp)}>Edit</button>
            {/* TODO: Add Delete Button */}
          </div>
        ))}
        <button className="no-print" onClick={() => handleOpenExperienceForm(null)}>Add Experience</button>
      </div>

      {showExperienceForm && (
        <div className="modal no-print">
          <div className="modal-content">
            <h3>{currentExperience ? 'Edit' : 'Add'} Experience</h3>
            <input type="text" name="title" value={experienceFormData.title} onChange={handleExperienceFormChange} placeholder="Title" />
            <input type="text" name="company" value={experienceFormData.company} onChange={handleExperienceFormChange} placeholder="Company" />
            <input type="text" name="start_date" value={experienceFormData.start_date} onChange={handleExperienceFormChange} placeholder="Start Date" />
            <input type="text" name="end_date" value={experienceFormData.end_date} onChange={handleExperienceFormChange} placeholder="End Date" />
            <textarea name="description" value={experienceFormData.description} onChange={handleExperienceFormChange} placeholder="Description" />
            
            <div className="suggestions-container">
              <button className="no-print" onClick={handleGetSuggestions} disabled={isLoadingSuggestions}>
                {isLoadingSuggestions ? 'Getting Suggestions...' : 'Get AI Suggestions'}
              </button>
              {descriptionSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {descriptionSuggestions.map((s, i) => (
                    <li key={i} onClick={() => handleAcceptSuggestion(s)}>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* <input type="text" name="logo" value={experienceFormData.logo} onChange={handleExperienceFormChange} placeholder="Logo URL" /> */}
            <div className="modal-buttons">
              <button className="no-print" onClick={handleSaveExperience}>Save Experience</button>
              <button className="no-print cancel-btn" onClick={() => setShowExperienceForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Education Section (TODO) */}
      <div className="resumeSection">
        <h2>Education</h2>
        {augmentedEducationList.map((edu, index) => (
          <div key={edu.id || index} className="resumeItem">
            <h4>{edu.course} at {edu.school}</h4>
            <p><i>{edu.start_date} - {edu.end_date}, Grade: {edu.grade}</i></p>
            <p>{edu.description}</p>
            <button className="no-print" onClick={() => handleOpenEducationForm(edu)}>Edit</button>
            {/* TODO: Add Delete Button */}
          </div>
        ))}
        <button className="no-print" onClick={() => handleOpenEducationForm(null)}>Add Education</button>
      </div>
      
      {showEducationForm && (
        <div className="modal no-print">
          <div className="modal-content">
            <h3>{currentEducation ? 'Edit' : 'Add'} Education</h3>
            <input type="text" name="course" value={educationFormData.course} onChange={handleEducationFormChange} placeholder="Course/Degree" />
            <input type="text" name="school" value={educationFormData.school} onChange={handleEducationFormChange} placeholder="School/University" />
            <input type="text" name="start_date" value={educationFormData.start_date} onChange={handleEducationFormChange} placeholder="Start Date" />
            <input type="text" name="end_date" value={educationFormData.end_date} onChange={handleEducationFormChange} placeholder="End Date" />
            <input type="text" name="grade" value={educationFormData.grade} onChange={handleEducationFormChange} placeholder="Grade/GPA" />
            <textarea name="description" value={educationFormData.description} onChange={handleEducationFormChange} placeholder="Description" />
            
            <div className="suggestions-container">
              <button className="no-print" onClick={handleGetEducationSuggestions} disabled={isLoadingEducationSuggestions}>
                {isLoadingEducationSuggestions ? 'Getting Suggestions...' : 'Get AI Suggestions'}
              </button>
              {educationDescriptionSuggestions.length > 0 && (
                <ul className="suggestions-list">
                  {educationDescriptionSuggestions.map((s, i) => (
                    <li key={i} onClick={() => handleAcceptEducationSuggestion(s)}>
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* <input type="text" name="logo" value={educationFormData.logo} onChange={handleEducationFormChange} placeholder="Logo URL" /> */}
            <div className="modal-buttons">
              <button className="no-print" onClick={handleSaveEducation}>Save Education</button>
              <button className="no-print cancel-btn" onClick={() => setShowEducationForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Skills Section (TODO) */}
      <div className="resumeSection">
        <h2>Skills</h2>
        <p>Skill Placeholder</p>
        <button className="no-print">Add Skill</button>
      </div>
      
      <br />
      <button className="no-print" onClick={() => window.print()}>Export as PDF</button>
    </div>
  );
}

export default App;
