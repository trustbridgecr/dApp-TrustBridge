import { useQuery, gql } from "@apollo/client";

const GET_LOAN_REQUESTS = gql`
  query GetLoanRequests {
    loanRequests {
      id
      borrower
      amount
      purpose
      creditScore
      status
    }
  }
`;

export function useLoanRequests() {
  const { loading, error, data } = useQuery(GET_LOAN_REQUESTS);
  
  return {
    loading,
    error,
    loanRequests: data?.loanRequests || []
  };
}