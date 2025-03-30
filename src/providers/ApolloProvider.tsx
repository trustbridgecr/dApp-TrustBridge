import { ApolloProvider } from "@apollo/client";
import client from "@/lib/graphql-client";
import { ReactNode } from "react";

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderWrapper;
