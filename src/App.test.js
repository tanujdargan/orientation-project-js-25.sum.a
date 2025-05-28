import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders resume builder heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/Resume Builder/i);
  expect(headingElement).toBeInTheDocument();
});
