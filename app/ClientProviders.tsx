// @ts-nocheck
"use client";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { ApolloProvider } from "@apollo/client";
import client from "./lib/apolloClient";
import Toast from "./components/feedback/Toast";
import AuthProvider from "./components/HOC/AuthProvider";
import TopLoadingBar from "./components/feedback/TopLoadingBar";
import SiteNavbar from "./components/layout/SiteNavbar";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ApolloProvider client={client}>
      <TopLoadingBar />
      <Provider store={store}>
        <AuthProvider>
          <SiteNavbar />
          {children}
        </AuthProvider>
        {process.env.NODE_ENV !== "test" && <Toast />}
      </Provider>
    </ApolloProvider>
  );
}
