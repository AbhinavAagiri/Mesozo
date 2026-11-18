import { Link } from 'react-router-dom';
import { LegalPage, type LegalSection } from '../components/legal/LegalPage';
import { usePageTitle } from '../lib/usePageTitle';

const CONTACT_EMAIL = __CORRECTION_EMAIL__;

const SECTIONS: LegalSection[] = [
  {
    id: 'about-these-terms',
    title: 'About these terms',
    body: (
      <>
        <p>
          These terms describe the basis on which MESOZO makes its public website available.
          MESOZO is an independent educational and scientific reference project. It is not a
          company, museum, university or government service, and this version of the site does not
          publish a registered legal entity or business address.
        </p>
        <p>
          By using the site, you agree to these terms. If you do not agree, please do not use the
          site. Where material carries its own licence, that licence may add conditions to the
          permissions described here.
        </p>
      </>
    ),
  },
  {
    id: 'permitted-use',
    title: 'Permitted use',
    body: (
      <>
        <p>
          You may browse the site, read its entries, follow links to public pages and use
          MESOZO&rsquo;s original material for personal, educational and research purposes. You may
          save or print a
          reasonable part of a page for private study, and you may link to public MESOZO pages.
        </p>
        <p>
          These permissions do not transfer ownership of the site or its content. They do not grant
          a right to republish, redistribute or commercially exploit MESOZO&rsquo;s original pages
          or third-party assets. Quotation, criticism and other uses permitted by applicable law
          are not restricted by these terms. Where you quote MESOZO, cite the page and the source it
          identifies.
        </p>
      </>
    ),
  },
  {
    id: 'prohibited-use',
    title: 'Prohibited use',
    body: (
      <>
        <p>You must not use MESOZO to:</p>
        <ul>
          <li>break the law, defraud another person or facilitate unlawful activity;</li>
          <li>
            attempt to access accounts, servers or systems without authorisation, probe for
            vulnerabilities, bypass security controls or interfere with the site&rsquo;s operation;
          </li>
          <li>
            introduce malware, overload the service, or run systematic automated copying that
            disregards access controls or impairs availability for other visitors;
          </li>
          <li>
            misrepresent an affiliation with MESOZO or imply that MESOZO endorses you, your
            organisation or a product;
          </li>
          <li>
            remove, obscure or falsify attribution, licence notices or source information; or
          </li>
          <li>reuse a third-party image, model, reconstruction or other asset outside its licence.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'original-content-and-branding',
    title: 'Original content and branding',
    body: (
      <>
        <p>
          MESOZO&rsquo;s original written content, editorial selection and arrangement, visual
          design, interface and code are protected by copyright, subject to rights held by
          contributors and licensors. The MESOZO name and visual identity identify the project and
          may not be used in a way that suggests endorsement or affiliation without permission.
        </p>
        <p>
          No licence is granted to reproduce MESOZO&rsquo;s original pages, branding or original
          assets for commercial use. This paragraph does not claim ownership of third-party
          material or override a licence attached to a particular asset.
        </p>
      </>
    ),
  },
  {
    id: 'third-party-assets',
    title: 'Images, models and third-party material',
    body: (
      <>
        <p>
          Images, illustrations, fossil photographs, life reconstructions, 3D models, diagrams,
          quotations and bibliographic records may belong to their respective creators, museums,
          publishers or other rights holders. MESOZO does not claim ownership of every asset on the
          site. A work&rsquo;s presence here does not give visitors permission to reuse it.
        </p>
        <p>
          The <Link to="/about#credits">sources and licences register</Link> records the creator,
          source and licence for each registered visual asset. Some works are released under
          Creative Commons licences that require attribution, share-alike treatment or other
          conditions. The licence shown with the work governs its reuse. Do not remove credits or
          licence notices. If a licence conflicts with these terms, the asset licence and
          applicable law take precedence for that asset.
        </p>
      </>
    ),
  },
  {
    id: 'scientific-information',
    title: 'Scientific information and uncertainty',
    body: (
      <>
        <p>
          Palaeontology is an evolving scientific discipline. MESOZO labels direct fossil evidence,
          inference, reconstruction, scientific debate and open questions separately. A life
          reconstruction is an authored representation, not a specimen. Dates, classifications,
          body reconstructions and ecological interpretations can change when new material or
          research is published.
        </p>
        <p>
          MESOZO is an educational reference, not a substitute for the primary literature, direct
          examination of a specimen or advice from a qualified specialist. It aims to cite sources,
          state uncertainty and correct errors, but it does not warrant that every entry is complete
          or current. Where evidence is thin or disputed, the page says so.
        </p>
      </>
    ),
  },
  {
    id: 'external-resources',
    title: 'External resources',
    body: (
      <>
        <p>
          MESOZO links to journals, DOI records, museums, image sources and other external
          resources for reference and attribution. A link is not an endorsement of everything on
          the destination site. External websites are controlled by their own operators, who may
          change their content, availability, terms or privacy practices without notice.
        </p>
        <p>
          MESOZO is not responsible for external content or for the way an external service
          handles your information. Check the destination&rsquo;s terms and privacy policy before
          relying on it or submitting information to it.
        </p>
      </>
    ),
  },
  {
    id: 'availability-and-limitations',
    title: 'Availability and limitations',
    body: (
      <>
        <p>
          MESOZO is provided as a free educational resource. Entries may be corrected, expanded or
          removed, and access may be interrupted for maintenance, hosting changes or reasons
          outside the project&rsquo;s control. MESOZO does not guarantee uninterrupted availability
          or error-free operation, and external links may stop working. Verify important scientific
          or educational claims against the cited primary sources.
        </p>
        <p>
          To the extent permitted by law, the operator of MESOZO is not liable for indirect or
          consequential loss arising from use of the site or inability to use it. Nothing in these
          terms excludes liability or rights that cannot be excluded or limited under applicable
          law.
        </p>
      </>
    ),
  },
  {
    id: 'corrections-and-contact',
    title: 'Corrections and contact',
    body: (
      <>
        <p>
          Questions, corrections, species submissions and reports of broken links or accessibility
          barriers can be sent to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. The{' '}
          <Link to="/about#corrections">correction form on the About page</Link> prepares an email
          draft in your own mail application; nothing is sent until you send it.
        </p>
        <p>
          The same address is the legal contact for these terms. Email is not a secure channel, so
          do not include sensitive personal information unless it is needed for the report.
        </p>
      </>
    ),
  },
  {
    id: 'changes-to-these-terms',
    title: 'Changes to these terms',
    body: (
      <>
        <p>
          These terms may be revised as the site, its content or its hosting arrangements change.
          The latest version will be published on this page with an updated date. The version shown
          here applies from the date at the top and bottom of the page.
        </p>
        <p>
          MESOZO does not have user accounts, so it cannot give individual notice of changes. If
          you plan to rely on a permission or limitation in these terms, check the current version
          first.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  usePageTitle('Terms of Use', {
    description:
      'The terms for using MESOZO’s educational dinosaur reference: permitted use, third-party asset licences, scientific uncertainty and corrections.',
  });

  return (
    <LegalPage
      index="T"
      kicker="Reference / Terms"
      title={
        <>
          Terms <em>of Use</em>
        </>
      }
      intro="The basis on which this reference work is made available: what you may do, what the licences require, and where the record stops."
      meta={[
        { label: 'Scope', value: 'Public website' },
        { label: 'Third-party assets', value: 'Licensed separately' },
        { label: 'Legal contact', value: CONTACT_EMAIL },
      ]}
      summary={`MESOZO is a free educational and scientific reference. You may read, study and link to it. Its original text and design are protected; third-party images and models remain under their own licences. Palaeontology changes, so claims are labelled by evidence and may be revised. Corrections, species submissions and legal questions can be emailed to ${CONTACT_EMAIL}.`}
      sections={SECTIONS}
      related={[
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Sources & licences', to: '/about#credits' },
        { label: 'Corrections', to: '/about#corrections' },
      ]}
    />
  );
}
