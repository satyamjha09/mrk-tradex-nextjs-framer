// @ts-nocheck
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { API_BASE_URL, GRAPHQL_URL } from "./constants/config";
import { isDemoMode } from "@/app/lib/demo";
import { demoApolloLink } from "@/app/lib/demo/demoApolloLink";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const log = process.env.NODE_ENV === "development" ? console.warn : console.error;
  if (graphQLErrors) log("GraphQL Error", graphQLErrors);
  if (networkError) log("Network Error", networkError);
});
export const initializeApollo = (initialState = null) => {
  const isSameOriginApi = API_BASE_URL.startsWith("/");
  const httpLink = new HttpLink({
    uri: GRAPHQL_URL,
    credentials: isSameOriginApi ? "include" : "same-origin",
  });

  const link = isDemoMode()
    ? from([errorLink, demoApolloLink, httpLink])
    : from([errorLink, httpLink]);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Product: {
          fields: {
            variants: {
              merge: true,
            },
          },
        },
      },
    }).restore(initialState || {}),
  });

  return client;
};

export default initializeApollo(); // Default export for client-side usage
