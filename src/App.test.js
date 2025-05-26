import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

describe("App Component", () => {
  test("renders main headings of the application", () => {
    render(<App />);
    
    // Check for the main application title
    expect(screen.getByRole("heading", { name: /Resume Builder/i, level: 1 })).toBeInTheDocument();
    
    // Check for section titles (assuming they are h2)
    expect(screen.getByRole("heading", { name: /Experience/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Education/i, level: 2 })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Skills/i, level: 2 })).toBeInTheDocument();
  });

  test("opens and closes the Add Skill modal", () => {
    render(<App />);

    // Find and click the "Add Skill" button
    const addSkillButton = screen.getByRole("button", { name: /Add Skill/i });
    expect(addSkillButton).toBeInTheDocument();
    fireEvent.click(addSkillButton);

    // Check if the modal title is visible
    expect(screen.getByRole("heading", { name: /Add Skill/i, level: 3 })).toBeInTheDocument();

    // Check for form fields within the modal
    // Note: The modal itself doesn't have a role that contains these directly for getByRole queries easily.
    // We query for them generally, assuming they are unique enough or become unique once modal is open.
    expect(screen.getByPlaceholderText(/Skill Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Proficiency/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Logo URL/i)).toBeInTheDocument();

    // Find and click the "Cancel" button within the modal
    // Since there might be other cancel buttons, we try to be more specific if possible
    // or rely on the fact that this one becomes visible/available.
    const cancelButton = screen.getByRole("button", { name: /Cancel/i });
    fireEvent.click(cancelButton);

    // Check if the modal title is no longer visible
    expect(screen.queryByRole("heading", { name: /Add Skill/i, level: 3 })).not.toBeInTheDocument();
  });

  // We can add more tests here later for button presence, modal opening, etc.
});
