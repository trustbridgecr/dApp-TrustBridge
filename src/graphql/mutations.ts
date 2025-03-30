import { gql } from "@apollo/client";

export const VERIFY_OTP = gql`
    mutation VerifyOTP($email: String!, $otp: String!){
        verifyOTP(email: $email, otp: $otp)
    }
`;