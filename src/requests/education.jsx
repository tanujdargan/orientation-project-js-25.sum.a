const BASE_URL = process.env.REACT_APP_API_URL || "";

export async function getEducation() {
  try {
    const response = await fetch(`${BASE_URL}/resume/education`);
    if (!response.ok) {
      throw new Error("HTTP error: status " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching education data:", error);
    throw error;
  }
}

export async function addEducation(education) {
  try {
    const response = await fetch(`${BASE_URL}/resume/education`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(education),
    });
    if (!response.ok) {
      throw new Error("HTTP error: status " + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding education data:", error);
    throw error;
  }
}
