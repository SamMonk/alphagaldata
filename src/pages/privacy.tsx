import React from 'react';
import Layout from '../components/Layout';
import { openCookieSettings } from '../components/CookieConsent';

// Keep this page in step with what the site actually loads. If you add a tracker,
// API, embed, or form endpoint, update the relevant section and LAST_UPDATED.
const LAST_UPDATED = 'October 26, 2026';

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} rel='noopener noreferrer' target='_blank'>
      {children}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <Layout
      title='Privacy Policy'
      description='What AlphaGalData collects, how Google Analytics and Google AdSense cookies are used, your choices, and how to reach us about your data.'
    >
      <div className='prose max-w-3xl'>
        <h1>Privacy policy</h1>
        <p>
          <em>Last updated {LAST_UPDATED}</em>
        </p>
        <p>
          AlphaGalData (alphagaldata.com) publishes free information, recipes, and tools for people living with alpha-gal
          syndrome. Health topics are sensitive, so we collect as little as we can. This page explains what is collected
          when you use the site, who else receives it, and the choices you have.
        </p>

        <h2>The short version</h2>
        <ul>
          <li>You do not need an account to use anything on this site.</li>
          <li>
            We do not ask about your diagnosis or symptoms, and we never use health information for advertising.
          </li>
          <li>
            Analytics and advertising cookies are only set if you choose <strong>Accept</strong> in our cookie banner.
            You can change your choice at any time.
          </li>
          <li>We do not sell your personal information.</li>
        </ul>

        <h2>Information you give us</h2>
        <ul>
          <li>
            <strong>Email.</strong> If you write to info@alphagaldata.com, we receive your email address and message.
            Incoming mail is received and stored by Amazon Web Services (Amazon SES and S3) and forwarded to our inbox.
          </li>
          <li>
            <strong>Recipe and story submissions.</strong> If you submit a recipe or story, we collect the name, email
            address, and content you enter so we can review it and contact you about it. We never publish your email
            address, and we will check with you before crediting you by name.
          </li>
          <li>
            <strong>Email updates.</strong> If you sign up for email updates, we use your address only to send those
            updates. Every message has a way to unsubscribe.
          </li>
          <li>
            <strong>Editor accounts.</strong> Our editors sign in through Amazon Cognito. Visitors do not have or need
            accounts.
          </li>
        </ul>

        <h2>Information stored only on your device</h2>
        <p>
          Some features save small amounts of data in your browser&apos;s local storage. It stays on your device, and we
          cannot see it:
        </p>
        <ul>
          <li>your cookie choice;</li>
          <li>recipes you save with the &quot;Save recipe&quot; button;</li>
          <li>drafts of recipe or story submissions.</li>
        </ul>
        <p>You can delete this data at any time by clearing site data for alphagaldata.com in your browser.</p>

        <h2>The ingredient scanner</h2>
        <p>
          The scanner uses your camera only while it is open and only after your browser asks for permission. Label photos
          and pasted ingredient lists are processed in your browser; we do not receive or keep them. When you scan or type
          a barcode, that barcode number is sent to{' '}
          <ExternalLink href='https://world.openfoodfacts.org/privacy'>Open Food Facts</ExternalLink> to look up the
          product. The text-recognition (OCR) engine is downloaded from the jsDelivr content network the first time you
          use it.
        </p>

        <h2>Information collected automatically</h2>
        <ul>
          <li>
            <strong>Hosting.</strong> The site is served by Amazon Web Services (S3 and CloudFront). Like any web server,
            these services process your IP address, browser type, and the page requested in order to deliver the page
            and protect against abuse.
          </li>
          <li>
            <strong>Maps.</strong> The tick maps load map images from{' '}
            <ExternalLink href='https://osmfoundation.org/wiki/Privacy_Policy'>OpenStreetMap</ExternalLink> and{' '}
            <ExternalLink href='https://carto.com/privacy'>CARTO</ExternalLink>, which receive your IP address when
            they send those images.
          </li>
          <li>
            <strong>Google Analytics</strong> (only if you accept cookies). Google Analytics 4 tells us which pages are
            visited, roughly where visitors are (country or region), and what kind of device they use. It sets cookies
            named <code>_ga</code> and <code>_ga_*</code>. Google Analytics 4 does not log or store IP addresses. We use
            this to decide what to write and fix next. You can also block it in any browser with the{' '}
            <ExternalLink href='https://tools.google.com/dlpage/gaoptout'>Google Analytics opt-out add-on</ExternalLink>.
          </li>
        </ul>

        <h2>Advertising</h2>
        <p>
          We use Google AdSense to show ads, which helps cover the cost of running the site and keeping the cards and
          guides free.
        </p>
        <ul>
          <li>
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this
            website or other websites.
          </li>
          <li>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on your visit
            to this site and/or other sites on the internet. Ad providers may also use web beacons and receive your IP
            address and device information when an ad is requested.
          </li>
          <li>
            If you <strong>reject</strong> cookies in our banner, we tell Google not to use advertising cookies or
            personalize ads for you. Ads you see are then based on the page you are reading, not on your browsing.
          </li>
          <li>
            You can opt out of personalized advertising from Google at any time in{' '}
            <ExternalLink href='https://myadcenter.google.com/'>Google&apos;s My Ad Center</ExternalLink>, and from
            other participating vendors at{' '}
            <ExternalLink href='https://optout.aboutads.info/'>aboutads.info</ExternalLink>.
          </li>
          <li>
            Learn{' '}
            <ExternalLink href='https://policies.google.com/technologies/partner-sites'>
              how Google uses information from sites that use its services
            </ExternalLink>
            .
          </li>
        </ul>
        <p>
          We do not pass anything you do on this site, such as scanner results, saved recipes, or the pages you read, to
          advertisers as health information, and we do not ask Google to target ads based on health conditions.
        </p>

        <h2>Affiliate links</h2>
        <p>
          Some product links are Amazon Associates affiliate links (see our <a href='/disclosure'>disclosure</a>). If you
          click one, Amazon may set its own cookies to credit the referral. Amazon&apos;s{' '}
          <ExternalLink href='https://www.amazon.com/gp/help/customer/display.html?nodeId=GX7NJQ4ZB8MHFRNJ'>
            privacy notice
          </ExternalLink>{' '}
          applies on Amazon&apos;s site.
        </p>

        <h2>Your choices</h2>
        <ul>
          <li>
            <strong>Cookies:</strong>{' '}
            <button className='underline' type='button' onClick={openCookieSettings}>
              open cookie settings
            </button>{' '}
            (also linked in every page footer). Rejecting also clears Google Analytics cookies already set on this site.
          </li>
          <li>
            <strong>Browser controls:</strong> you can block or delete cookies and site data in your browser settings.
          </li>
          <li>
            <strong>Your information:</strong> email info@alphagaldata.com to ask what we hold about you (for example,
            your emails or submissions), to correct it, or to delete it. We will respond promptly and within the time
            required by law.
          </li>
        </ul>

        <h2>Sharing and sale of information</h2>
        <p>
          We do not sell personal information for money. We share information only with the service providers named on
          this page so they can run the site, ads, and analytics, or when required by law. Under some U.S. state privacy
          laws, allowing advertising cookies for personalized ads can count as &quot;sharing.&quot; Choosing{' '}
          <strong>Reject</strong> in cookie settings opts you out of that.
        </p>

        <h2>Visitors in the EU, UK, and Switzerland</h2>
        <p>
          We rely on your consent for analytics and advertising cookies, and on our legitimate interest in running and
          securing the site for hosting data. You have the right to access, correct, delete, or restrict use of your
          personal data, to object to processing, to data portability, to withdraw consent at any time, and to complain
          to your local data protection authority. Some of the providers above process data in the United States.
        </p>

        <h2>How long we keep information</h2>
        <p>
          We keep emails and submissions for as long as we need them to reply, review content, or keep a record of what we
          published, and delete them on request. Google Analytics data is kept according to the retention setting on our
          Analytics property.
        </p>

        <h2>Children</h2>
        <p>
          This site is written for adults managing alpha-gal syndrome for themselves or their families. It is not directed
          to children under 13, and we do not knowingly collect personal information from them. If you believe a child has
          sent us personal information, email us and we will delete it.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          When we change what the site collects, we update this page and the date at the top. Significant changes will
          also be noted on the home page.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy: info@alphagaldata.com, or see our <a href='/contact'>contact page</a>.
        </p>
      </div>
    </Layout>
  );
}
