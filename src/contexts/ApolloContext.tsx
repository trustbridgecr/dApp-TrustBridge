"use client";

import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from "@apollo/client";

interface ApolloContextProviderProps {
  children: React.ReactNode;
}

export function ApolloContextProvider({ children }: ApolloContextProviderProps) {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "https://flyby-router-demo.herokuapp.com/",
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}