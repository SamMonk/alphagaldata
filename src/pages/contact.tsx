import React from 'react';
import Layout from '../components/Layout';

export default function ContactPage() {
  return (
    <Layout
      title='Contact AlphaGalData'
      description='How to reach the AlphaGalData team with corrections, recipe submissions, research tips, and partnership questions.'
    >
      <div className='prose max-w-none'>
        <h1>Contact us</h1>
        <p>
          AlphaGalData is run by a family living with alpha-gal syndrome. We read every message, and corrections get
          priority because people make food decisions based on what we publish.
        </p>
        <p>
          <strong>Email:</strong> info@alphagaldata.com{' '}
          <a href='mailto:info@alphagaldata.com'>(open in your mail app)</a>
        </p>
        <p>We usually reply within a few days.</p>

        <h2>What to write to us about</h2>
        <ul>
          <li>
            <strong>Corrections.</strong> If an ingredient, recipe note, or research summary looks wrong, send the page
            link and what you think should change. A source (a label photo, a manufacturer reply, a study link) helps us
            fix it faster.
          </li>
          <li>
            <strong>Recipes.</strong> Use the <a href='/submit-recipe'>recipe submission form</a>. We test and
            label-check recipes before publishing them.
          </li>
          <li>
            <strong>Research and news tips.</strong> New studies, trials, or product changes the AGS community should know
            about. See the <a href='/research'>research tracker</a> for what we already cover.
          </li>
          <li>
            <strong>Partnerships and advertising.</strong> Please read our <a href='/disclosure'>disclosure</a> and{' '}
            <a href='/ads-and-cookies'>ads policy</a> first. We do not accept paid reviews.
          </li>
        </ul>

        <h2>What we cannot help with</h2>
        <p>
          We are not clinicians and cannot give personal medical advice, interpret test results, or tell you whether a
          specific product is safe for you. Please talk with your allergist or doctor. If you are having a severe
          allergic reaction, use your epinephrine if prescribed and call 911 or your local emergency number.
        </p>
      </div>
    </Layout>
  );
}
