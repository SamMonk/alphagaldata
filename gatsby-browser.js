import "leaflet/dist/leaflet.css";
import "./src/styles/global.css";

export const onRouteUpdate = ({ location }) => {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;

  const page_path = location?.pathname + (location?.search || "") + (location?.hash || "");
  // Send a GA4 page_view on client-side route changes
  window.gtag('event', 'page_view', { page_path });
};
