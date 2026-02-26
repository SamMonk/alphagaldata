import React from "react";
import { AuthProvider } from "react-oidc-context";

const config = {
  authority: process.env.GATSBY_COGNITO_AUTHORITY || "",
  client_id: process.env.GATSBY_COGNITO_CLIENT_ID || "",
  redirect_uri: process.env.GATSBY_COGNITO_REDIRECT_URI || "",
  response_type: "code",
  scope: process.env.GATSBY_COGNITO_SCOPE || "openid profile email",
};

const hasRequiredConfig = config.authority && config.client_id && config.redirect_uri;

export default function AuthProviderWrapper({ children }) {
  if (typeof window === "undefined" || !hasRequiredConfig) {
    return <>{children}</>;
  }

  return <AuthProvider {...config}>{children}</AuthProvider>;
}
