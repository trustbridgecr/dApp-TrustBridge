import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "https://api.example.com/graphql";

const httpLink = new HttpLink({
  uri: API_URL,
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;

// import { GraphQLClient } from "graphql-request"

// const API_URL = process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "https://api.example.com/graphql"

// export const graphqlClient = new GraphQLClient(API_URL, {
//     headers: (): HeadersInit => {
//       const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
//       return token ? { Authorization: `Bearer ${token}` } : {};
//     },
//   });
  

