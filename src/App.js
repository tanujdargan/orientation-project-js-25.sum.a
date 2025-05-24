import React, { useState, useEffect } from 'react';
import "./App.css";

const API_BASE_URL = 'http://localhost:5000'; // Assuming Python backend runs on port 5000

function App() {
  const [experienceList, setExperienceList] = useState([]);
  const [educationList, setEducationList] = useState([]);
  // ... (similar state for education)

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

  // --- Fetch Initial Data ---
  useEffect(() => {
    // Fetch experience
    fetch(`${API_BASE_URL}/resume/experience`)
      .then(res => res.json())
      .then(data => setExperienceList(data || []))
      .catch(err => console.error("Error fetching experience:", err));

    // TODO: Fetch education similarly
    // fetch(`${API_BASE_URL}/resume/education`)
    //   .then(res => res.json())
    //   .then(data => setEducationList(data || []))
    //   .catch(err => console.error("Error fetching education:", err));
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
    // This requires the index of the item if it's an existing one.
    // If it's a new item, we can't get suggestions based on an index.
    // The backend endpoint /suggest-description is currently /<int:index>/suggest-description
    // For a new item, we might need a different endpoint or pass description in body.
    // The current backend takes description from body if provided, otherwise from stored item.
    // Let's assume for now if it's a new item (currentExperience is null or has no index),
    // we can still call with a dummy index like -1, and rely on description in body.
    // OR, the backend could be enhanced to allow POST /resume/experience/suggest-description (no index)
    // For now, let's proceed assuming an index is available or the backend handles it.
    // If currentExperience is null (new item), this specific endpoint won't work as designed.
    // We will call it using the current description from the form.
    
    let itemIndex = -1; // Placeholder for new item
    if (currentExperience && currentExperience.index !== undefined) {
        itemIndex = currentExperience.index;
    } else {
        // For a truly new item not yet saved, it has no index.
        // The backend suggestion endpoint expects an index.
        // One solution: allow a special index (e.g. 0 and send description) or a different route.
        // For this example, we'll show an alert if trying to get suggestions for a truly new, unsaved item.
        // Or, we can allow getting suggestions based purely on the typed text without an existing item context.
        // The python backend was modified to take description from request body if present.
        // So, we can technically call it with any valid index, even for a "new" item concept,
        // as long as we send the description. Let's use index 0 as a placeholder if no item selected.
        // This assumes that the backend's data['experience'][0] exists or the check for
        // request_data['description'] in the backend will save us.
        if (itemIndex === -1 && experienceList.length > 0) itemIndex = 0; // Fallback for safety, not ideal
        else if (itemIndex === -1 && experienceList.length === 0) {
            alert("Cannot get suggestions without at least one existing experience item as context for the backend endpoint structure, or save the item first.");
            // Alternatively, the backend could have a POST /resume/suggest-description route
            // that doesn't require an index and only takes a description.
            return;
        }
    }


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


  return (
    <div className="App">
      <h1>Resume Builder</h1>

      {/* --- Experience Section --- */}
      <div className="resumeSection">
        <h2>Experience</h2>
        {augmentedExperienceList.map((exp, index) => (
          <div key={exp.id || index} className="resumeItem"> {/* Use a stable key */}
            <h4>{exp.title} at {exp.company}</h4>
            <p>{exp.description}</p>
            <button onClick={() => handleOpenExperienceForm(exp)}>Edit</button>
            {/* TODO: Add Delete Button */}
          </div>
        ))}
        <button onClick={() => handleOpenExperienceForm(null)}>Add Experience</button>
      </div>

      {showExperienceForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{currentExperience ? 'Edit' : 'Add'} Experience</h3>
            <input type="text" name="title" value={experienceFormData.title} onChange={handleExperienceFormChange} placeholder="Title" />
            <input type="text" name="company" value={experienceFormData.company} onChange={handleExperienceFormChange} placeholder="Company" />
            <input type="text" name="start_date" value={experienceFormData.start_date} onChange={handleExperienceFormChange} placeholder="Start Date" />
            <input type="text" name="end_date" value={experienceFormData.end_date} onChange={handleExperienceFormChange} placeholder="End Date" />
            <textarea name="description" value={experienceFormData.description} onChange={handleExperienceFormChange} placeholder="Description" />
            
            <div className="suggestions-container">
              <button onClick={handleGetSuggestions} disabled={isLoadingSuggestions}>
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
            <button onClick={handleSaveExperience}>Save Experience</button>
            <button onClick={() => setShowExperienceForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* --- Education Section (TODO) --- */}
      <div className="resumeSection">
        <h2>Education</h2>
        {/* TODO: Map educationList and implement form similar to Experience */}
        <p>Education Placeholder</p>
        <button>Add Education</button>
      </div>
      
      {/* --- Skills Section (TODO) --- */}
      <div className="resumeSection">
        <h2>Skills</h2>
        <p>Skill Placeholder</p>
        <button>Add Skill</button>
      </div>
      
      <br />
      <button>Export</button>
    </div>
  );
}

export default App;
