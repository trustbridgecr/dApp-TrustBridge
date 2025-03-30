"use client";

import React, { useMemo } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

interface ApolloContextProviderProps {
  children: React.ReactNode;
}

export function ApolloContextProvider({ children }: ApolloContextProviderProps) {
  const client = useMemo(() => {
    // Error handling link
    const errorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
          console.error(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      if (networkError) console.error(`[Network error]: ${networkError}`);
    });

    // HTTP link
    const httpLink = new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "https://flyby-router-demo.herokuapp.com/",
      // Add auth headers if needed
      credentials: 'include',
    });

    return new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              // Example of cache field policy for pagination
              loanRequests: {
                // Merge function for lists
                merge(existing = [], incoming) {
                  return [...existing, ...incoming];
                }
              }
            }
          }
        }
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          nextFetchPolicy: 'cache-first',
        },
        query: {
          fetchPolicy: 'cache-first',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
      ssrMode: typeof window === 'undefined',
    });
  }, []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}