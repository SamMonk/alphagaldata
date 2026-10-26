import React from "react";
import { AuthProvider } from "react-oidc-context";

const config = {
  authority: process.env.GATSBY_COGNITO_AUTHORITY || "",
  client_id: process.env.GATSBY_COGNITO_CLIENT_ID || "",
  redirect_uri: process.env.GATSBY_COGNITO_REDIRECT_URI || "",
  response_type: "code",
  scope: process.env.GATSBY_COGNITO_SCOPE || "openid profile email",
};

export default function AuthProviderWrapper({ children }) {
  // Skip provider during SSR — AuthProvider requires a browser environment
  if (typeof window === "undefined") {
    return <>{children}</>;
  }

  return <AuthProvider {...config}>{children}</AuthProvider>;
}
