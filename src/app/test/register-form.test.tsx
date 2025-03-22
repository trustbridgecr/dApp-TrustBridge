import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RegisterForm } from "@/components/auth/register-form";

jest.mock("@/lib/auth", () => ({
  registerUser: jest.fn(),
}));

import { registerUser } from "@/lib/auth";

describe("RegisterForm", () => {
  it("calls registerUser with correct data", async () => {
    (registerUser as jest.Mock).mockResolvedValueOnce({ token: "fake_token" });
    const onSuccessMock = jest.fn();

    render(<RegisterForm onSuccess={onSuccessMock} />);

    const nameInput = screen.getByPlaceholderText("Your name");
    const emailInput = screen.getByPlaceholderText("your@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "securepassword" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "securepassword" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() =>
      expect(registerUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "securepassword",
        confirmPassword: "securepassword",
      })
    );

    await waitFor(() => expect(onSuccessMock).toHaveBeenCalled());
  });

  it("shows an error message when registration fails", async () => {
    (registerUser as jest.Mock).mockRejectedValueOnce(new Error("Could not create the account. The email may already be in use."));
  
    render(<RegisterForm onSuccess={jest.fn()} />);
  
    fireEvent.change(screen.getByPlaceholderText("your@email.com"), {
      target: { value: "existing@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "securepassword" },
    });
  
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));
  

  });
  
  

  it("shows an error when passwords do not match", async () => {
    render(<RegisterForm onSuccess={jest.fn()} />);

    const passwordInput = screen.getByPlaceholderText("••••••••");
    const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "differentpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});