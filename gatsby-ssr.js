const React = require("react");

exports.onRenderBody = ({ setHeadComponents }) => {
  if (process.env.NODE_ENV !== "production") return;

  setHeadComponents([
    // Google AdSense (site ownership verification)
    React.createElement("script", {
      key: "adsense",
      async: true,
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3564637720581735",
      crossOrigin: "anonymous",
    }),
    React.createElement("script", {
      key: "ga4",
      async: true,
      src: "https://www.googletagmanager.com/gtag/js?id=G-Y9DXW6X4E2",
    }),
    React.createElement("script", {
      key: "ga4-init",
      dangerouslySetInnerHTML: {
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          gtag('js', new Date());
          // Disable automatic page_view to avoid double-counting with SPA routing
          gtag('config', 'G-Y9DXW6X4E2', { send_page_view: false });
        `,
      },
    }),
  ]);
};
