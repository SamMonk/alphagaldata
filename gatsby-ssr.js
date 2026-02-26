const React = require("react");
const AuthProviderWrapper = require("./src/components/auth-provider-wrapper").default;

exports.onRenderBody = ({ setHeadComponents, setPreBodyComponents, pathname }) => {
  if (process.env.NODE_ENV !== "production") return;

  const measurementId = process.env.GATSBY_GA4_MEASUREMENT_ID || "G-Y9DXW6X4E2";
  const gtmContainerId = process.env.GATSBY_GTM_CONTAINER_ID;
  const headComponents = [];

  if (gtmContainerId) {
    headComponents.push(
      React.createElement("script", {
        key: "gtm",
        dangerouslySetInnerHTML: {
          __html: `
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmContainerId}');
          `.replace(/\s+/g, " ").trim(),
        },
      })
    );

    setPreBodyComponents([
      React.createElement(
        "noscript",
        { key: "gtm-noscript" },
        React.createElement("iframe", {
          src: `https://www.googletagmanager.com/ns.html?id=${gtmContainerId}`,
          height: "0",
          width: "0",
          style: { display: "none", visibility: "hidden" },
        })
      )
    ]);
  } else if (measurementId) {
    headComponents.push(
      React.createElement("script", {
        key: "ga4",
        async: true,
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
      }),
      React.createElement("script", {
        key: "ga4-init",
        dangerouslySetInnerHTML: {
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          `.replace(/\s+/g, " ").trim(),
        },
      })
    );
  }

  const allowAdsense = (() => {
    if (!pathname) return false;
    return pathname.startsWith("/learn") || pathname === "/";
  })();

  if (allowAdsense) {
    headComponents.push(
      React.createElement("script", {
        key: "adsense",
        async: true,
        src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3564637720581735",
        crossOrigin: "anonymous",
      })
    );
  }

  if (headComponents.length > 0) {
    setHeadComponents(headComponents);
  }
};

exports.wrapRootElement = ({ element }) => {
  return React.createElement(AuthProviderWrapper, null, element);
};
