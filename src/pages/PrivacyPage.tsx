import { Link } from 'react-router-dom';
import { LegalPage, type LegalSection } from '../components/legal/LegalPage';
import { usePageTitle } from '../lib/usePageTitle';

const CONTACT_EMAIL = __CORRECTION_EMAIL__;

const SECTIONS: LegalSection[] = [
  {
    id: 'who-operates-mesozo',
    title: 'Who operates MESOZO',
    body: (
      <>
        <p>
          MESOZO is an independent educational and scientific reference project about non-avian
          dinosaurs, the Mesozoic world and the evidence behind its reconstructions. It is not a
          company, museum, university or government service.
        </p>
        <p>
          This version of the site does not publish a registered legal entity, business address or
          registration number. “MESOZO” is the name of the project; it is not a claim to a
          particular corporate or institutional status. This policy covers the public MESOZO
          website only. It does not govern external websites reached through links.
        </p>
      </>
    ),
  },
  {
    id: 'what-mesozo-does-not-collect',
    title: 'What MESOZO does not collect',
    body: (
      <>
        <p>
          MESOZO does not provide accounts, public profiles, comments, uploads, newsletters, saved
          collections or payments. Its application code includes no advertising, analytics,
          tracking pixels, session recording, cross-site tracking or visitor profiling. There is no
          MESOZO application backend or visitor database that receives browsing activity.
        </p>
        <p>
          You do not need to give a name, email address, postal address or payment details to read
          the archive. The correction form is the only place with an email field. It is optional
          for most reports, but required for attribution or licence reports so the project can
          follow up.
        </p>
        <ul>
          <li>No cookies are set by MESOZO&rsquo;s application code.</li>
          <li>No MESOZO analytics, advertising identifiers or tracking pixels are present.</li>
          <li>No account, marketing or behavioural profile is created by MESOZO.</li>
          <li>No visitor information is sold, rented or shared by MESOZO for advertising.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'browser-storage-and-urls',
    title: 'Storage in your browser',
    body: (
      <>
        <p>
          When browser storage is available, one value is kept in session storage:{' '}
          <code>mesozo_preloader_seen</code>. It records that the opening sequence has played in
          this tab, so the sequence does not replay on route changes or reloads. The value is a
          timestamp. It is not sent to MESOZO and is cleared when the tab or browser session ends.
        </p>
        <p>
          MESOZO&rsquo;s application code does not set or read cookies, and it does not use local
          storage or IndexedDB. Archive filters and view settings are kept in the page URL query
          string so a view can be restored or shared; this applies, for example, to the species
          archive, anatomy atlas and deep time pages. They are read in your browser and are not
          sent to a MESOZO server. The requested URL may still appear in your browser history or in
          ordinary request data processed by the hosting provider.
        </p>
      </>
    ),
  },
  {
    id: 'hosting-and-request-data',
    title: 'Hosting and ordinary request data',
    body: (
      <>
        <p>
          MESOZO is built as a static site for Cloudflare Pages. When the site is served through
          Cloudflare Pages, Cloudflare may process standard technical information in order to
          deliver, cache and protect a request. That can include an IP address, browser or
          user-agent information, the requested URL, a referring page, the time of the request and
          security signals associated with it.
        </p>
        <p>
          This is infrastructure processing by the hosting provider. MESOZO&rsquo;s application
          does not receive visitor-level analytics reports or create a MESOZO profile from this
          data. Cloudflare&rsquo;s own privacy policy explains its role and practices:
          {' '}
          <a
            href="https://www.cloudflare.com/privacypolicy/"
            target="_blank"
            rel="noreferrer"
          >
            Cloudflare Privacy Policy <span aria-hidden="true">↗</span>
          </a>
          .
        </p>
        <p>
          Cloudflare may use strictly necessary security cookies at the edge, depending on its
          configuration. Those cookies are controlled by Cloudflare and are not set or read by
          MESOZO&rsquo;s application. MESOZO does not set a separate retention period for this
          request data; Cloudflare&rsquo;s terms and the project&rsquo;s hosting configuration
          govern it. If the site is served by a different hosting provider, that provider&rsquo;s
          terms and privacy policy apply to its request data.
        </p>
      </>
    ),
  },
  {
    id: 'corrections-and-email',
    title: 'Corrections and email',
    body: (
      <>
        <p>
          The <Link to="/about#corrections">corrections section on the About page</Link> has no
          submission endpoint and does not store reports. Its form prepares a{' '}
          <code>mailto:</code> draft addressed to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> in your own email application.
          Nothing is sent until you choose to send it. You can also write to that address directly.
        </p>
        <p>
          Your email provider, the recipient&rsquo;s provider and any mail infrastructure between
          them may process the message under their own policies. The reply field is optional for
          most reports, but required for attribution or licence reports so the project can follow
          up. Corrections and species submissions are reviewed before any public change and are not
          published automatically.
        </p>
        <p>
          Email is not a secure messaging channel. Please do not include sensitive personal
          information unless it is necessary for the correction you are reporting.
        </p>
      </>
    ),
  },
  {
    id: 'external-links-and-services',
    title: 'External links and third-party services',
    body: (
      <>
        <p>
          MESOZO links to journals, DOI records, museums, Wikimedia, image sources and other
          reference material. These links are provided for research and attribution. The site does
          not embed third-party videos, maps, social posts, comment systems, advertising or remote
          fonts. Its fonts, images and 3D model are served from the same MESOZO site.
        </p>
        <p>
          Following an external link leaves MESOZO. The operator of that site may collect technical
          information, set cookies or ask you to accept its own terms. MESOZO does not control and
          is not responsible for the content, availability or privacy practices of external sites.
          Check the policy of each service you use.
        </p>
      </>
    ),
  },
  {
    id: 'retention',
    title: 'How long information is kept',
    body: (
      <>
        <p>
          MESOZO does not operate a server-side visitor database, account system or mailing list.
          The preloader value stored for this tab disappears when the browser session ends. Archive
          filters remain only in the page URL and your browser&rsquo;s own history.
        </p>
        <p>
                    If the site is served through Cloudflare Pages, Cloudflare controls the retention of
          ordinary edge logs and security data under its own terms and configuration. MESOZO does
          not hold those records, so it cannot state a separate retention period for them. Email
          sent to the correction address is processed by the relevant email providers, and MESOZO
          keeps the correspondence only as long as needed to review and respond.
        </p>
      </>
    ),
  },
  {
    id: 'privacy-questions',
    title: 'Privacy questions',
    body: (
      <>
        <p>
          Privacy questions can be sent by email to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. This is the same address used
          for corrections. Include enough context to identify the page or issue, and do not include
          account credentials, payment details or other sensitive information.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-this-policy',
    title: 'Changes to this policy',
    body: (
      <>
        <p>
          This policy describes the current version of the site. If the site&rsquo;s data handling,
          hosting or correction channel changes, the policy will be revised and the date at the top
          and bottom of this page will be updated. The latest version is always the one published
          here.
        </p>
        <p>
          MESOZO does not have user accounts or a mailing list, so it cannot send individual notice
          of a policy change. Please check this page if privacy practices matter to your use of the
          site.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  usePageTitle('Privacy Policy', {
    description:
      'How MESOZO handles information: no accounts, analytics or advertising, one tab-local browser value, hosting request data and email corrections.',
  });

  return (
    <LegalPage
      index="P"
      kicker="Reference / Privacy"
      title={
        <>
          Privacy <em>Policy</em>
        </>
      }
      intro="What this site keeps, what it does not collect, how to send a correction or privacy question, and what happens when you follow a source elsewhere."
      meta={[
        { label: 'Scope', value: 'Public website' },
        { label: 'Cookies set by MESOZO', value: 'None' },
        { label: 'Privacy contact', value: CONTACT_EMAIL },
      ]}
      summary={`MESOZO is a static reference site with no accounts, advertising, analytics or tracking. One tab-local browser value remembers that the opening sequence has played. If the site is served through Cloudflare Pages, Cloudflare may process ordinary request data under its own policy. Corrections and privacy questions can be emailed to ${CONTACT_EMAIL}; the correction form only prepares a draft in your own mail app.`}
      sections={SECTIONS}
      related={[
        { label: 'Terms of Use', to: '/terms' },
        { label: 'Corrections', to: '/about#corrections' },
        { label: 'Sources & licences', to: '/about#credits' },
      ]}
    />
  );
}
