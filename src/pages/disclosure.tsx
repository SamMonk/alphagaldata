import React from 'react';
import Layout from '../components/Layout';

export default function DisclosurePage(){
  return (
    <Layout title="Affiliate Disclosure" description="Affiliate disclosure for AlphaGalData. How we use affiliate links and our commitment to editorial independence.">
      <div className="prose max-w-none">
        <h1>Affiliate Disclosure</h1>
        <p>
          AlphaGalData is a participant in the Amazon Services LLC Associates Program, an affiliate
          advertising program designed to provide a means for sites to earn advertising fees by
          advertising and linking to Amazon.com. As an Amazon Associate, we earn from qualifying purchases.
        </p>
        <p>
          Some links on this site are affiliate links. If you click an affiliate link and make a purchase,
          we may earn a small commission at no additional cost to you. We only recommend products and
          services we believe are genuinely useful for people living with alpha-gal syndrome (AGS).
        </p>
        <h2>Our approach</h2>
        <ul>
          <li>Safety and trust come first. Core resources like wallet cards, dining cards, and medical alert designs remain free.</li>
          <li>We label affiliate links clearly so you always know when a link is an affiliate link.</li>
          <li>Affiliate status does not influence our editorial recommendations, product placement, or pricing. We recommend the same products we use ourselves.</li>
          <li>We do not accept payment for product reviews or endorsements.</li>
        </ul>
        <h2>Programs</h2>
        <p>
          We participate in the Amazon Services LLC Associates Program. We may also participate in other
          affiliate programs in the future, including retailers offering tick-prevention products, medical
          alert services, and allergy-safe food brands.
        </p>
        <h2>Privacy</h2>
        <p>
          Affiliate programs may use cookies or similar technology to track referrals. See their
          respective privacy notices for details. We do not share personal health information with
          affiliate programs.
        </p>
        <h2>Contact</h2>
        <p>
          Questions or concerns about our affiliate relationships? We welcome feedback. If you notice
          a product link that is broken or a recommendation that you believe is inaccurate, please let
          us know so we can correct it.
        </p>
        <p className="mt-6 text-sm text-slate-600">Educational content only — not medical advice.</p>
      </div>
    </Layout>
  );
}
