import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ApolloMockProvider from "@/mocks/apollo-mock-provider";
import { VERIFY_OTP } from "@/graphql/mutations";
import TwoFactorAuth from "@/components/auth/two-factor";

const successMock = {
  request: {
    query: VERIFY_OTP,
    variables: {
      email: "shantel@gmail.com",
      otp: "123456",
    },
  },
  result: {
    data: {
      verifyOTP: true,
    },
  },
};

const errorMock = {
  request: {
    query: VERIFY_OTP,
    variables: {
      email: "shantel@gmail.com",
      otp: "123456",
    },
  },
  result: {
    errors: [{ message: "Invalid OTP" }],
  },
};

describe("TwoFactorAuth Component", () => {
  it("successfully verifies OTP", async () => {
    const onLogin = jest.fn();
    
    render(
      <ApolloMockProvider mocks={[successMock]}>
        <TwoFactorAuth email="shantel@gmail.com" onLogin={onLogin} />
      </ApolloMockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Verify OTP"));

    await waitFor(() => {
      expect(onLogin).toHaveBeenCalled();
    });
  });

  it("handles OTP verification error", async () => {
    render(
      <ApolloMockProvider mocks={[errorMock]}>
        <TwoFactorAuth email="shantel@gmail.com" onLogin={jest.fn()} />
      </ApolloMockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Verify OTP"));

    await waitFor(() => {
      expect(screen.getByText(/invalid otp|an unexpected error occurred/i)).toBeInTheDocument();
    });
  });

  it("shows loading state during verification", async () => {
    render(
      <ApolloMockProvider mocks={[successMock]}>
        <TwoFactorAuth email="shantel@gmail.com" onLogin={jest.fn()} />
      </ApolloMockProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter OTP"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Verify OTP"));

    expect(screen.getByText("Verifying OTP..."));
  });
});
