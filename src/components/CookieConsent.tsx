import React from 'react';

const STORAGE_KEY = 'agd_cookie_consent_v1';

export default function CookieConsent(){
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      if (!v) setVisible(true);
    } catch {}
  }, []);

  const accept = () => {
    try { localStorage.setItem(STORAGE_KEY, 'accepted'); } catch {}
    setVisible(false);
  };
  const decline = () => {
    try { localStorage.setItem(STORAGE_KEY, 'declined'); } catch {}
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className="fixed bottom-3 inset-x-0 z-50 px-3">
      <div className="mx-auto max-w-3xl rounded border bg-white shadow p-3 text-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          We use cookies for analytics and to improve this site. See <a className="underline" href="/ads-and-cookies">Ads & Cookies</a>.
        </div>
        <div className="flex gap-2 justify-end">
          <button className="btn" onClick={decline}>Decline</button>
          <button className="btn" onClick={accept}>Accept</button>
        </div>
      </div>
    </div>
  );
}

