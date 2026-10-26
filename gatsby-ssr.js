const React = require("react");
const AuthProviderWrapper = require("./src/components/auth-provider-wrapper").default;

// Keep in sync with STORAGE_KEY in src/components/CookieConsent.tsx
const CONSENT_STORAGE_KEY = "agd_cookie_consent_v2";

const ADSENSE_CLIENT = "ca-pub-3564637720581735";

// Pages that must not carry ads (AdSense "inventory value" policy): tools, forms,
// account/admin screens, policy pages, and error pages. Everything else is content.
// Ownership verification uses the google-adsense-account meta tag, which is on every
// page, so verification no longer depends on where the ad script loads.
const NO_AD_PATHS = new Set([
  "/auth",
  "/editorial",
  "/moderation",
  "/saved-recipes",
  "/submit-recipe",
  "/scanner",
  "/contact",
  "/privacy",
  "/terms",
  "/ads-and-cookies",
  "/disclosure",
  "/editorial-policy",
  "/404",
  "/404.html",
  "/dev-404-page",
  "/offline-plugin-app-shell-fallback",
  // Thin or mostly-affiliate pages; revisit once they have more original content.
  "/recommended",
  "/caregivers",
  "/research",
]);

const pageAllowsAds = (pathname = "/") => {
  const path = pathname.replace(/\/+$/, "") || "/";
  return !NO_AD_PATHS.has(path);
};

exports.onRenderBody = ({ setHeadComponents, setPreBodyComponents, pathname }) => {
  if (process.env.NODE_ENV !== "production") return;

  const measurementId = process.env.GATSBY_GA4_MEASUREMENT_ID || "G-Y9DXW6X4E2";
  const gtmContainerId = process.env.GATSBY_GTM_CONTAINER_ID;
  // With GTM configured, GA4 is expected to be a GTM tag instead of direct gtag.js.
  const useGtag = Boolean(measurementId && !gtmContainerId);
  const headComponents = [];

  // Google Consent Mode v2, opt-in: nothing sets analytics or ad cookies until the
  // visitor accepts in CookieConsent (choice stored in localStorage). This must run
  // before the AdSense/GTM tags so they start in the denied state. GA4 itself is only
  // loaded after consent (window.__agdLoadAnalytics), not just put in consent mode.
  headComponents.push(
    React.createElement("script", {
      key: "consent-default",
      dangerouslySetInnerHTML: {
        __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          var agdConsent = null;
          try { agdConsent = localStorage.getItem('${CONSENT_STORAGE_KEY}'); } catch (e) {}
          var agdState = agdConsent === 'accepted' ? 'granted' : 'denied';
          gtag('consent', 'default', {
            ad_storage: agdState, ad_user_data: agdState, ad_personalization: agdState,
            analytics_storage: agdState, wait_for_update: 500
          });
          gtag('set', 'ads_data_redaction', agdState === 'denied');
          window.__agdLoadAnalytics = function () {
            if (window.__agdGA || !${useGtag}) return;
            window.__agdGA = true;
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://www.googletagmanager.com/gtag/js?id=${measurementId}';
            document.head.appendChild(s);
            gtag('js', new Date());
            gtag('config', '${measurementId}', { send_page_view: false });
          };
          if (agdConsent === 'accepted') window.__agdLoadAnalytics();
        `.replace(/\s+/g, " ").trim(),
      },
    })
  );

  if (gtmContainerId) {
    // GTM tags must be configured to respect Consent Mode (built-in consent checks).
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
  }

  headComponents.push(
    React.createElement("meta", { key: "adsense-account", name: "google-adsense-account", content: ADSENSE_CLIENT })
  );

  if (pageAllowsAds(pathname)) {
    headComponents.push(
      React.createElement("script", {
        key: "adsense",
        async: true,
        src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`,
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
