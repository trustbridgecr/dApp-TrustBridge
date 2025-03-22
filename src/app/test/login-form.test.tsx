import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LoginForm } from "@/components/auth/login-form";

jest.mock("@/lib/auth", () => ({
  loginUser: jest.fn(),
}));

import { loginUser } from "@/lib/auth";

describe("LoginForm", () => {
  it("allows users to type in the email and password fields", () => {
    render(<LoginForm onSuccess={jest.fn()} />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("calls loginUser with correct credentials and triggers onSuccess", async () => {
    (loginUser as jest.Mock).mockResolvedValueOnce({ token: "fake_token" });
    const onSuccessMock = jest.fn();

    render(<LoginForm onSuccess={onSuccessMock} />);

    const emailInput = screen.getByPlaceholderText("your@email.com");
    const passwordInput = screen.getByPlaceholderText("••••••••");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() =>
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })
    );

    await waitFor(() => expect(onSuccessMock).toHaveBeenCalled());
  });

  it("shows an error message when login fails", async () => {
    (loginUser as jest.Mock).mockRejectedValueOnce(new Error("Invalid credentials"));
    render(<LoginForm onSuccess={jest.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("your@email.com"), { target: { value: "wrong@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("••••••••"), { target: { value: "wrongpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Invalid credentials");
    });
  });
});
