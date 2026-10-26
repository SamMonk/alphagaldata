import React from 'react';

// Keep in sync with CONSENT_STORAGE_KEY in gatsby-ssr.js. Bumped from v1 because the
// old banner never mentioned advertising, so earlier "accepts" don't cover it.
const STORAGE_KEY = 'agd_cookie_consent_v2';
const OPEN_EVENT = 'agd:open-cookie-settings';

type Choice = 'accepted' | 'rejected';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __agdLoadAnalytics?: () => void;
    __agdGA?: boolean;
  }
}

/** Re-open the banner so visitors can change their choice (footer "Cookie settings"). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === 'accepted' || value === 'rejected' ? value : null;
  } catch {
    return null;
  }
}

function applyChoice(choice: Choice) {
  const state = choice === 'accepted' ? 'granted' : 'denied';
  window.gtag?.('consent', 'update', {
    ad_storage: state,
    ad_user_data: state,
    ad_personalization: state,
    analytics_storage: state,
  });
  window.gtag?.('set', 'ads_data_redaction', state === 'denied');

  if (choice === 'accepted') {
    const alreadyLoaded = window.__agdGA;
    window.__agdLoadAnalytics?.();
    // The current page's view wasn't recorded before consent; send it now.
    if (!alreadyLoaded && window.__agdGA) {
      window.gtag?.('event', 'page_view', { page_path: window.location.pathname + window.location.search });
    }
  } else {
    // Clear Google Analytics cookies set before the visitor changed their mind.
    const host = window.location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      if (name === '_ga' || name.startsWith('_ga_')) {
        for (const domain of ['', `; domain=.${host}`]) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
        }
      }
    });
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = React.useState(false);
  const [current, setCurrent] = React.useState<Choice | null>(null);

  React.useEffect(() => {
    const stored = readChoice();
    setCurrent(stored);
    if (!stored) setVisible(true);
    const open = () => {
      setCurrent(readChoice());
      setVisible(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const choose = (choice: Choice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Storage blocked: the choice still applies for this page view.
    }
    applyChoice(choice);
    setCurrent(choice);
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <div className='fixed inset-x-0 bottom-3 z-50 px-3' role='dialog' aria-label='Cookie choices' aria-live='polite'>
      <div className='mx-auto flex max-w-3xl flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 text-sm text-slate-700 shadow-lg md:flex-row md:items-center md:justify-between'>
        <div>
          <p className='font-semibold text-slate-900'>Cookies on AlphaGalData</p>
          <p className='mt-1'>
            With your OK, Google Analytics measures which pages help people, and Google AdSense can use cookies for
            personalized ads. If you reject, we set no analytics or advertising cookies and any ads shown are not based
            on your browsing. We never use health information for ads.{' '}
            <a className='underline' href='/privacy'>
              Privacy policy
            </a>
            {current ? <span className='mt-1 block text-xs text-slate-500'>Current choice: {current}.</span> : null}
          </p>
        </div>
        <div className='flex shrink-0 gap-2'>
          <button className='btn' type='button' onClick={() => choose('rejected')}>
            Reject
          </button>
          <button className='btn' type='button' onClick={() => choose('accepted')}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ children = 'Open cookie settings' }: { children?: React.ReactNode }) {
  return (
    <button className='btn' type='button' onClick={openCookieSettings}>
      {children}
    </button>
  );
}
