import React from 'react';
import Layout from '../components/Layout';

export default function DisclosurePage(){
  return (
    <Layout title="Affiliate Disclosure">
      <div className="prose max-w-none">
        <h1>Affiliate Disclosure</h1>
        <p>
          Some links on this site are affiliate links. If you click an affiliate link and make a purchase, we may earn a
          commission at no additional cost to you. We only link to products and services we believe are genuinely useful
          for people affected by alpha-gal syndrome (AGS).
        </p>
        <h2>Our approach</h2>
        <ul>
          <li>Safety and trust come first. Core resources like wallet/dining cards remain free.</li>
          <li>We label affiliate links clearly (e.g., “(affiliate)”) or with nearby disclosure text.</li>
          <li>Recommendations are editorial; affiliate status does not change price or placement.</li>
        </ul>
        <h2>Programs</h2>
        <p>
          We may participate in affiliate programs and networks (for example, FlexOffers, Impact, CJ, ShareASale, and
          others), including retailers offering printing services and tick-prevention products.
        </p>
        <h2>Privacy</h2>
        <p>
          Affiliate programs may use cookies or similar technology to track referrals. See their privacy notices for
          details. We do not share personal health information with affiliate programs.
        </p>
        <h2>Contact</h2>
        <p>
          Questions or concerns? Please reach out via the site’s contact channels. We welcome feedback on products or
          services we feature.
        </p>
        <p className="mt-6 text-sm text-slate-600">Educational content only — not medical advice.</p>
      </div>
    </Layout>
  );
}

