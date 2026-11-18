import { useEffect, useRef, useState, type FormEvent } from 'react';

const SCIENTIFIC_CORRECTION_CATEGORY = 'Scientific correction';
const CITATION_SOURCE_CATEGORY = 'Citation or source';
const NEW_SPECIES_CATEGORY = 'New species submission';
const CONTACT_REQUIRED_CATEGORY = 'Attribution or licence';
const OTHER_CATEGORY = 'Other';

const CATEGORIES = [
  SCIENTIFIC_CORRECTION_CATEGORY,
  CITATION_SOURCE_CATEGORY,
  CONTACT_REQUIRED_CATEGORY,
  'Technical or accessibility',
  NEW_SPECIES_CATEGORY,
  OTHER_CATEGORY,
] as const;

const CATEGORY_HELP: Record<(typeof CATEGORIES)[number], string> = {
  [SCIENTIFIC_CORRECTION_CATEGORY]:
    'For factual errors in a species profile, date, measurement, classification or interpretation. Say what is wrong and what the evidence shows.',
  [CITATION_SOURCE_CATEGORY]:
    'For a missing, incorrect or unsupported reference. Give the correct citation, DOI or source page if you have it.',
  [CONTACT_REQUIRED_CATEGORY]:
    'For image credits, copyright or licence problems. Include the page, the correct attribution or licence, and a contact for a reply.',
  'Technical or accessibility':
    'For broken links, layout problems or issues with keyboard, screen-reader or mobile use. Mention the device or browser if it helps.',
  [NEW_SPECIES_CATEGORY]:
    'To propose a species for the archive. Give its name, a short case for adding it and at least three independent sources.',
  [OTHER_CATEGORY]:
    'For anything that does not fit the other categories. Describe the issue and include a source if one is relevant.',
};

const MAX_SUBJECT = 140;
const MAX_DESCRIPTION = 4000;

/**
 * A static correction channel.
 *
 * There is no submission endpoint and no visitor-data store. When the owner
 * supplies a monitored address at build time, the form composes a mailto draft
 * in the visitor's own mail client. Until then, it explicitly says that the
 * channel is not open rather than pretending a report was delivered.
 */
export function CorrectionForm() {
  const email = __CORRECTION_EMAIL__;
  const [page, setPage] = useState('');
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>(
    SCIENTIFIC_CORRECTION_CATEGORY,
  );
  const [description, setDescription] = useState('');
  const [source, setSource] = useState('');
  const [contact, setContact] = useState('');
  const [speciesName, setSpeciesName] = useState('');
  const [classification, setClassification] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [source1, setSource1] = useState('');
  const [source2, setSource2] = useState('');
  const [source3, setSource3] = useState('');
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [submitCount, setSubmitCount] = useState(0);
  const formRef = useRef<HTMLFormElement>(null);
  const invalidFieldsRef = useRef<string[]>([]);

  useEffect(() => {
    if (submitCount === 0 || invalidFieldsRef.current.length === 0) return;
    const form = formRef.current;
    if (!form) return;

    const fields = form.querySelectorAll<HTMLElement>('.correction-form__field.is-invalid');
    fields.forEach((field) => {
      field.classList.remove('is-shaking');
      void field.offsetWidth;
      field.classList.add('is-shaking');
    });

    form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [submitCount]);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    let timer: number | undefined;

    const keepFieldVisible = (field: HTMLElement) => {
      const group = field.closest<HTMLElement>('label') ?? field;
      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportHeight = viewport?.height ?? window.innerHeight;
      const headerHeight =
        document.querySelector<HTMLElement>('.header')?.getBoundingClientRect().height ?? 0;
      const topLimit = viewportTop + headerHeight + 12;
      const bottomLimit = viewportTop + viewportHeight - 20;
      const rect = group.getBoundingClientRect();

      let delta = 0;
      if (rect.bottom > bottomLimit) {
        delta = rect.bottom - bottomLimit + 16;
      } else if (rect.top < topLimit) {
        delta = rect.top - topLimit - 12;
      }

      if (delta !== 0) {
        window.scrollBy({ top: delta, behavior: 'auto' });
      }
    };

    const scheduleKeepVisible = (field: HTMLElement) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (document.activeElement === field) keepFieldVisible(field);
      }, 300);
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && target.matches('input, select, textarea')) {
        scheduleKeepVisible(target);
      }
    };

    const onFocusOut = () => {
      window.clearTimeout(timer);
    };

    const onViewportChange = () => {
      const active = document.activeElement;
      if (
        active instanceof HTMLElement &&
        active.matches('input, select, textarea') &&
        form.contains(active)
      ) {
        scheduleKeepVisible(active);
      }
    };

    form.addEventListener('focusin', onFocusIn);
    form.addEventListener('focusout', onFocusOut);
    window.addEventListener('resize', onViewportChange);
    window.visualViewport?.addEventListener('resize', onViewportChange);

    return () => {
      form.removeEventListener('focusin', onFocusIn);
      form.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('resize', onViewportChange);
      window.visualViewport?.removeEventListener('resize', onViewportChange);
      window.clearTimeout(timer);
    };
  }, []);

  if (!email) {
    return (
      <div className="correction-pending" role="note">
        <p className="label">Channel not open in this release candidate</p>
        <p>
          No monitored correction address has been configured. This page cannot send or store a
          report, and nothing entered here would be delivered. The project owner must supply{' '}
          <code>CORRECTION_EMAIL</code> and rebuild with <code>npm run build:release</code> before
          this channel is activated.
        </p>
      </div>
    );
  }

  const isNewSpecies = category === NEW_SPECIES_CATEGORY;
  const contactRequired = category === CONTACT_REQUIRED_CATEGORY;
  const sourceRequired =
    category === SCIENTIFIC_CORRECTION_CATEGORY || category === CITATION_SOURCE_CATEGORY;
  const isOther = category === OTHER_CATEGORY;

  function clearInvalid(name: string) {
    setInvalidFields((fields) => fields.filter((field) => field !== name));
  }

  function fieldClass(name: string) {
    return `correction-form__field${invalidFields.includes(name) ? ' is-invalid' : ''}`;
  }

  function handleCategoryChange(nextCategory: (typeof CATEGORIES)[number]) {
    setCategory(nextCategory);
    setInvalidFields([]);
    invalidFieldsRef.current = [];
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const missing: string[] = [];
    if (!isNewSpecies && !page.trim()) missing.push('page');
    if (isNewSpecies && !speciesName.trim()) missing.push('species');
    if (!category) missing.push('category');
    if (!description.trim()) missing.push('description');
    if (sourceRequired && !source.trim()) missing.push('source');
    if (isNewSpecies) {
      if (!source1.trim()) missing.push('source1');
      if (!source2.trim()) missing.push('source2');
      if (!source3.trim()) missing.push('source3');
    }
    if (contactRequired && !contact.trim()) missing.push('contact');

    if (missing.length > 0) {
      invalidFieldsRef.current = missing;
      setInvalidFields(missing);
      setSubmitCount((count) => count + 1);
      return;
    }

    invalidFieldsRef.current = [];
    setInvalidFields([]);

    const subject = (
      isNewSpecies
        ? `MESOZO new species submission: ${speciesName.trim().slice(0, 100)}`
        : `MESOZO correction: ${category}`
    ).slice(0, MAX_SUBJECT);

    const details = isNewSpecies
      ? [
          `Category: ${category}`,
          `Species: ${speciesName.trim().slice(0, 200)}`,
          `Proposed classification: ${classification.trim().slice(0, 200) || 'Not supplied'}`,
          `Image URL or source page: ${imageUrl.trim().slice(0, 500) || 'Not supplied'}`,
          '',
          'Species information:',
          description.trim().slice(0, MAX_DESCRIPTION),
          '',
          'Sources:',
          `1. ${source1.trim().slice(0, 500)}`,
          `2. ${source2.trim().slice(0, 500)}`,
          `3. ${source3.trim().slice(0, 500)}`,
        ]
      : [
          `${isOther ? 'Subject' : 'Page'}: ${page.trim().slice(0, 200) || 'Not specified'}`,
          `Category: ${category}`,
          '',
          'Description:',
          description.trim().slice(0, MAX_DESCRIPTION),
          '',
          source
            ? `Supporting source or DOI: ${source.trim().slice(0, 500)}`
            : 'Supporting source or DOI: Not supplied',
        ];

    const body = [
      ...details,
      '',
      contact
        ? `Reply contact: ${contact.trim().slice(0, 254)}`
        : 'Reply contact: Not supplied',
      '',
      isNewSpecies
        ? 'Sent from the MESOZO new species submission form. This submission is not automatically published.'
        : 'Sent from the MESOZO correction form. This report is not automatically published.',
    ].join('\n');

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form ref={formRef} className="correction-form" onSubmit={submit} noValidate>
      <p className="correction-form__note">
        {isNewSpecies
          ? 'This form prepares a new species submission in your own mail app. Nothing is sent until you send it, and MESOZO does not store the draft. Submissions are reviewed before any change is published.'
          : 'This form prepares an email in your own mail app. Nothing is sent until you send it, and MESOZO does not store the draft. Corrections are reviewed before any public change; a submission is not automatically published.'}
      </p>

      <p className="correction-form__required-note">* = required</p>
      <p
        id="correction-category-help"
        className="correction-form__category-help"
        aria-live="polite"
        aria-atomic="true"
      >
        {CATEGORY_HELP[category]}
      </p>
      <p className="visually-hidden" role="status" aria-live="polite">
        {invalidFields.length > 0
          ? 'Please complete the required fields marked with an asterisk.'
          : ''}
      </p>

      <div className="correction-form__row">
        {isNewSpecies ? (
          <label className={fieldClass('species')}>
            <span className="label">Species name *</span>
            <input
              name="species"
              value={speciesName}
              onChange={(event) => {
                setSpeciesName(event.target.value);
                clearInvalid('species');
              }}
              aria-invalid={invalidFields.includes('species')}
              placeholder="Genus species"
              maxLength={200}
              required
            />
          </label>
        ) : (
          <label className={fieldClass('page')}>
            <span className="label">{isOther ? 'Subject *' : 'Page being reported *'}</span>
            <input
              name="page"
              value={page}
              onChange={(event) => {
                setPage(event.target.value);
                clearInvalid('page');
              }}
              aria-invalid={invalidFields.includes('page')}
              placeholder={isOther ? 'A short title for your report' : '/species/spinosaurus'}
              maxLength={200}
              required
            />
          </label>
        )}

        <label className={fieldClass('category')}>
          <span className="label">Category *</span>
          <select
            name="category"
            value={category}
            required
            aria-invalid={invalidFields.includes('category')}
            aria-describedby="correction-category-help"
            onChange={(event) =>
              handleCategoryChange(event.target.value as (typeof CATEGORIES)[number])
            }
          >
            {CATEGORIES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isNewSpecies ? (
        <div className="correction-form__row">
          <label>
            <span className="label">Proposed classification</span>
            <input
              name="classification"
              value={classification}
              onChange={(event) => setClassification(event.target.value)}
              placeholder="Clade, family or informal group"
              maxLength={200}
            />
          </label>
          <label>
            <span className="label">Image URL or source page</span>
            <input
              name="image"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://…"
              maxLength={500}
            />
            <span className="correction-form__hint">
              Link only; this form cannot attach image files.
            </span>
          </label>
        </div>
      ) : null}

      <label className={fieldClass('description')}>
        <span className="label">
          {isNewSpecies
            ? 'Species information *'
            : isOther
              ? 'Description *'
              : 'Description of the issue *'}
        </span>
        <textarea
          name="description"
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            clearInvalid('description');
          }}
          aria-invalid={invalidFields.includes('description')}
          rows={6}
          maxLength={MAX_DESCRIPTION}
          required
          placeholder={
            isNewSpecies
              ? 'What is known about this species, and why should it be added?'
              : 'What is incorrect, unclear, missing or out of date? Please be specific.'
          }
        />
      </label>

      {isNewSpecies ? (
        <>
          <div className="correction-form__sources">
            <p className="label">Sources</p>
            <p className="correction-form__hint">
              Provide at least three independent sources: a DOI, paper, museum record or reference
              page.
            </p>
            <label className={fieldClass('source1')}>
              <span className="label">Source 1 *</span>
              <input
                name="source1"
                value={source1}
                onChange={(event) => {
                  setSource1(event.target.value);
                  clearInvalid('source1');
                }}
                aria-invalid={invalidFields.includes('source1')}
                placeholder="DOI, URL or full citation"
                maxLength={500}
                required
              />
            </label>
            <label className={fieldClass('source2')}>
              <span className="label">Source 2 *</span>
              <input
                name="source2"
                value={source2}
                onChange={(event) => {
                  setSource2(event.target.value);
                  clearInvalid('source2');
                }}
                aria-invalid={invalidFields.includes('source2')}
                placeholder="DOI, URL or full citation"
                maxLength={500}
                required
              />
            </label>
            <label className={fieldClass('source3')}>
              <span className="label">Source 3 *</span>
              <input
                name="source3"
                value={source3}
                onChange={(event) => {
                  setSource3(event.target.value);
                  clearInvalid('source3');
                }}
                aria-invalid={invalidFields.includes('source3')}
                placeholder="DOI, URL or full citation"
                maxLength={500}
                required
              />
            </label>
          </div>

          <label className={fieldClass('contact')}>
            <span className="label">Your contact (optional)</span>
            <input
              name="contact"
              type="email"
              value={contact}
              maxLength={254}
              onChange={(event) => {
                setContact(event.target.value);
                clearInvalid('contact');
              }}
              aria-invalid={invalidFields.includes('contact')}
              placeholder="For a reply, if you want one"
            />
          </label>
        </>
      ) : (
        <div className="correction-form__row">
          <label className={fieldClass('source')}>
            <span className="label">
              Supporting source or DOI{sourceRequired ? ' *' : ''}
            </span>
            <input
              name="source"
              value={source}
              onChange={(event) => {
                setSource(event.target.value);
                clearInvalid('source');
              }}
              aria-invalid={invalidFields.includes('source')}
              placeholder="https://doi.org/…"
              maxLength={500}
              required={sourceRequired}
            />
          </label>
          <label className={fieldClass('contact')}>
            <span className="label">
              Your contact {contactRequired ? '*' : '(optional)'}
            </span>
            <input
              name="contact"
              type="email"
              value={contact}
              maxLength={254}
              onChange={(event) => {
                setContact(event.target.value);
                clearInvalid('contact');
              }}
              aria-invalid={invalidFields.includes('contact')}
              required={contactRequired}
              placeholder="For a reply, if you want one"
            />
          </label>
        </div>
      )}

      <div className="correction-form__actions">
        <button className="correction-form__submit" type="submit">
          Prepare email <span aria-hidden="true">↗</span>
        </button>
      </div>
    </form>
  );
}
