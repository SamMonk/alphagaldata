import "leaflet/dist/leaflet.css";
import "./src/styles/global.css";
import React from "react";
import AuthProviderWrapper from "./src/components/auth-provider-wrapper";

const MEASUREMENT_ID = process.env.GATSBY_GA4_MEASUREMENT_ID || "G-Y9DXW6X4E2";

export const onRouteUpdate = ({ location }) => {
  if (typeof window === "undefined") return;

  const page_path = location?.pathname + (location?.search || "") + (location?.hash || "");

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "page_view",
      page_path,
    });
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", { page_path, send_to: MEASUREMENT_ID });
  }
};

export const wrapRootElement = ({ element }) => (
  <AuthProviderWrapper>{element}</AuthProviderWrapper>
);
