import React, { useMemo, useState } from 'react';
import Layout from '../components/Layout';
import TrustNotice from '../components/TrustNotice';
import type {
  SubmissionIntakeRequest,
  SubmissionIntakeResponseEnvelope,
  SubmissionType,
} from '../contracts/submissions';
import { isSubmissionIntakeConfigured, submitPublicSubmission } from '../services/submissions/intake';

type FormErrors = Partial<Record<keyof SubmissionIntakeRequest, string>>;

const initialForm: SubmissionIntakeRequest = {
  submission_type: 'recipe',
  contributor_name: '',
  contributor_email: '',
  title: '',
  summary: '',
  ingredients_text: '',
  instructions_text: '',
  story_text: '',
  safety_notes: '',
  source_notes: '',
  photo_url: '',
  consent_to_review: false,
  consent_to_contact: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeOptional = (value: string): string | null => {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const validateForm = (form: SubmissionIntakeRequest): FormErrors => {
  const errors: FormErrors = {};

  if (!form.contributor_name.trim()) {
    errors.contributor_name = 'Add your name so moderators know who submitted this.';
  }
  if (!form.contributor_email.trim()) {
    errors.contributor_email = 'Add an email so we can follow up if something needs clarification.';
  } else if (!emailPattern.test(form.contributor_email.trim())) {
    errors.contributor_email = 'Enter a valid email address.';
  }
  if (!form.title.trim()) {
    errors.title = 'Add a title for the recipe or story.';
  }
  if (!form.summary.trim()) {
    errors.summary = 'Add a short summary to help moderators review the submission quickly.';
  }
  if (form.submission_type === 'recipe') {
    if (!form.ingredients_text?.trim()) {
      errors.ingredients_text = 'List the ingredients with brand notes when they matter for safety.';
    }
    if (!form.instructions_text?.trim()) {
      errors.instructions_text = 'Add the preparation steps so the recipe can be reviewed completely.';
    }
  }
  if (form.submission_type === 'story' && !form.story_text?.trim()) {
    errors.story_text = 'Add the story or experience you want reviewed.';
  }
  if (!form.consent_to_review) {
    errors.consent_to_review = 'Confirm that you understand the submission will be reviewed before any public release.';
  }

  return errors;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className='mt-2 text-sm font-medium text-red-700'>{message}</p>;
}

export default function SubmitRecipePage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] =
    useState<SubmissionIntakeResponseEnvelope | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const errorCount = useMemo(
    () => Object.values(errors).filter(Boolean).length,
    [errors]
  );

  const setField = <K extends keyof SubmissionIntakeRequest>(
    key: K,
    value: SubmissionIntakeRequest[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      return { ...current, [key]: undefined };
    });
  };

  const handleTypeChange = (submissionType: SubmissionType) => {
    setField('submission_type', submissionType);
    setFormError(null);
    setSubmitResult(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setSubmitResult(null);

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    const payload: SubmissionIntakeRequest = {
      ...form,
      contributor_name: form.contributor_name.trim(),
      contributor_email: form.contributor_email.trim(),
      title: form.title.trim(),
      summary: form.summary.trim(),
      ingredients_text: normalizeOptional(form.ingredients_text ?? ''),
      instructions_text: normalizeOptional(form.instructions_text ?? ''),
      story_text: normalizeOptional(form.story_text ?? ''),
      safety_notes: normalizeOptional(form.safety_notes ?? ''),
      source_notes: normalizeOptional(form.source_notes ?? ''),
      photo_url: normalizeOptional(form.photo_url ?? ''),
    };

    try {
      const response = await submitPublicSubmission(payload);
      setSubmitResult(response);

      if (response.error) {
        setFormError(response.error.recovery_guidance);
        return;
      }

      setForm(initialForm);
      setErrors({});
    } catch {
      setFormError(
        'The submission could not be queued right now. Try again in a moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isRecipe = form.submission_type === 'recipe';

  if (!isSubmissionIntakeConfigured) return <EmailSubmissionGuide />;

  return (
    <Layout title='Submit a Recipe or Story' noindex>
      <div className='space-y-8'>
        <section className='card'>
          <h1 className='mb-3 text-3xl font-bold'>
            Submit a recipe or story for review
          </h1>
          <p className='max-w-3xl text-slate-700'>
            Public submissions are moderated before anything can appear on the
            site. Use this form to send a recipe or personal story to the review
            queue with the context moderators need to check safety language,
            ingredient claims, and publication readiness.
          </p>
        </section>

        <TrustNotice title='Moderated Review' tone='teal'>
          <p>
            Submission success means your content entered review intake. It does
            not mean the content is published, approved, or medically verified.
            This public submission flow also does not create a member account or
            grant broader publishing rights.
          </p>
        </TrustNotice>

        <TrustNotice title='What Will Not Be Published' tone='amber'>
          <p>
            Do not submit unsafe medical claims, unverified treatment advice, or
            ingredient assertions that present uncertain products as definitely
            safe. Moderators may edit, reject, or request clarification before
            any public release.
          </p>
        </TrustNotice>

        {submitResult?.data && !submitResult.error ? (
          <section
            aria-live='polite'
            className='rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950 shadow-sm'
          >
            <h2 className='text-xl font-semibold'>Submission queued for review</h2>
            <p className='mt-2 text-sm leading-7 text-emerald-900'>
              Your {submitResult.data.submission_type} was received on{' '}
              {new Date(submitResult.data.received_at).toLocaleString()}. The
              moderation status is <strong>{submitResult.data.moderation_status}</strong>.
            </p>
            <p className='mt-2 text-sm text-emerald-900'>
              Reference ID: <span className='font-semibold'>{submitResult.data.submission_id}</span>
            </p>
            <p className='mt-2 text-sm text-emerald-900'>
              Review source: {submitResult.meta.intake_source === 'api' ? 'submission API' : 'local moderation intake fallback'}
            </p>
          </section>
        ) : null}

        <section className='card'>
          <form className='space-y-8' noValidate onSubmit={handleSubmit}>
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Choose what you are submitting</h2>
              <div className='grid gap-3 sm:grid-cols-2'>
                <label
                  className={`rounded-2xl border p-4 transition ${
                    isRecipe
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <input
                    checked={isRecipe}
                    className='mr-3'
                    name='submission_type'
                    onChange={() => handleTypeChange('recipe')}
                    type='radio'
                    value='recipe'
                  />
                  <span className='font-semibold text-slate-900'>Recipe</span>
                  <span className='mt-1 block text-sm text-slate-600'>
                    Ingredient list, instructions, and optional safety notes.
                  </span>
                </label>

                <label
                  className={`rounded-2xl border p-4 transition ${
                    !isRecipe
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-stone-200 bg-white'
                  }`}
                >
                  <input
                    checked={!isRecipe}
                    className='mr-3'
                    name='submission_type'
                    onChange={() => handleTypeChange('story')}
                    type='radio'
                    value='story'
                  />
                  <span className='font-semibold text-slate-900'>Story</span>
                  <span className='mt-1 block text-sm text-slate-600'>
                    Practical experience, context, and lessons for moderator review.
                  </span>
                </label>
              </div>
            </div>

            {errorCount > 0 || formError ? (
              <section
                aria-live='polite'
                className='rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900'
              >
                <h3 className='text-sm font-semibold uppercase tracking-[0.18em]'>
                  Fix before submitting
                </h3>
                <p className='mt-2 text-sm'>
                  {formError ??
                    `${errorCount} field${errorCount === 1 ? '' : 's'} still need attention.`}
                </p>
              </section>
            ) : null}

            <div className='grid gap-6 md:grid-cols-2'>
              <label className='block'>
                <span className='text-sm font-semibold text-slate-900'>
                  Your name
                </span>
                <input
                  aria-invalid={Boolean(errors.contributor_name)}
                  className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) =>
                    setField('contributor_name', event.target.value)
                  }
                  type='text'
                  value={form.contributor_name}
                />
                <FieldError message={errors.contributor_name} />
              </label>

              <label className='block'>
                <span className='text-sm font-semibold text-slate-900'>
                  Email for follow-up
                </span>
                <input
                  aria-invalid={Boolean(errors.contributor_email)}
                  className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) =>
                    setField('contributor_email', event.target.value)
                  }
                  type='email'
                  value={form.contributor_email}
                />
                <FieldError message={errors.contributor_email} />
              </label>

              <label className='block md:col-span-2'>
                <span className='text-sm font-semibold text-slate-900'>
                  {isRecipe ? 'Recipe title' : 'Story title'}
                </span>
                <input
                  aria-invalid={Boolean(errors.title)}
                  className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) => setField('title', event.target.value)}
                  type='text'
                  value={form.title}
                />
                <FieldError message={errors.title} />
              </label>

              <label className='block md:col-span-2'>
                <span className='text-sm font-semibold text-slate-900'>
                  Short summary
                </span>
                <textarea
                  aria-invalid={Boolean(errors.summary)}
                  className='mt-2 min-h-28 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) => setField('summary', event.target.value)}
                  value={form.summary}
                />
                <p className='mt-2 text-sm text-slate-600'>
                  Give moderators the short version first: what it is, why it
                  matters, and any review sensitivities.
                </p>
                <FieldError message={errors.summary} />
              </label>

              {isRecipe ? (
                <>
                  <label className='block md:col-span-2'>
                    <span className='text-sm font-semibold text-slate-900'>
                      Ingredients
                    </span>
                    <textarea
                      aria-invalid={Boolean(errors.ingredients_text)}
                      className='mt-2 min-h-40 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                      onChange={(event) =>
                        setField('ingredients_text', event.target.value)
                      }
                      value={form.ingredients_text ?? ''}
                    />
                    <p className='mt-2 text-sm text-slate-600'>
                      Include brand names, substitutions, and ingredient source
                      concerns when they affect alpha-gal safety.
                    </p>
                    <FieldError message={errors.ingredients_text} />
                  </label>

                  <label className='block md:col-span-2'>
                    <span className='text-sm font-semibold text-slate-900'>
                      Instructions
                    </span>
                    <textarea
                      aria-invalid={Boolean(errors.instructions_text)}
                      className='mt-2 min-h-40 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                      onChange={(event) =>
                        setField('instructions_text', event.target.value)
                      }
                      value={form.instructions_text ?? ''}
                    />
                    <FieldError message={errors.instructions_text} />
                  </label>
                </>
              ) : (
                <label className='block md:col-span-2'>
                  <span className='text-sm font-semibold text-slate-900'>
                    Story details
                  </span>
                  <textarea
                    aria-invalid={Boolean(errors.story_text)}
                    className='mt-2 min-h-48 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                    onChange={(event) => setField('story_text', event.target.value)}
                    value={form.story_text ?? ''}
                  />
                  <p className='mt-2 text-sm text-slate-600'>
                    Focus on lived experience, practical context, and what a
                    moderator should verify before sharing the story.
                  </p>
                  <FieldError message={errors.story_text} />
                </label>
              )}

              <label className='block md:col-span-2'>
                <span className='text-sm font-semibold text-slate-900'>
                  Safety notes for moderators
                </span>
                <textarea
                  className='mt-2 min-h-28 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) => setField('safety_notes', event.target.value)}
                  value={form.safety_notes ?? ''}
                />
                <p className='mt-2 text-sm text-slate-600'>
                  Optional: flag unclear ingredients, cross-contact concerns, or
                  claims that should be checked before publication.
                </p>
              </label>

              <label className='block'>
                <span className='text-sm font-semibold text-slate-900'>
                  Source notes or references
                </span>
                <input
                  className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) => setField('source_notes', event.target.value)}
                  type='text'
                  value={form.source_notes ?? ''}
                />
              </label>

              <label className='block'>
                <span className='text-sm font-semibold text-slate-900'>
                  Photo URL
                </span>
                <input
                  className='mt-2 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                  onChange={(event) => setField('photo_url', event.target.value)}
                  placeholder='https://'
                  type='url'
                  value={form.photo_url ?? ''}
                />
              </label>
            </div>

            <div className='space-y-3 rounded-2xl border border-stone-200 bg-stone-50 p-4'>
              <label className='flex items-start gap-3'>
                <input
                  checked={form.consent_to_review}
                  className='mt-1'
                  onChange={(event) =>
                    setField('consent_to_review', event.target.checked)
                  }
                  type='checkbox'
                />
                <span className='text-sm text-slate-700'>
                  I understand this submission goes into moderated review and is
                  not published automatically.
                </span>
              </label>
              <FieldError message={errors.consent_to_review} />

              <label className='flex items-start gap-3'>
                <input
                  checked={form.consent_to_contact}
                  className='mt-1'
                  onChange={(event) =>
                    setField('consent_to_contact', event.target.checked)
                  }
                  type='checkbox'
                />
                <span className='text-sm text-slate-700'>
                  Moderators may contact me if they need clarification before
                  deciding whether this can be published.
                </span>
              </label>
            </div>

            <div className='flex flex-col gap-3 border-t border-stone-200 pt-6 sm:flex-row sm:items-center sm:justify-between'>
              <p className='max-w-2xl text-sm text-slate-600'>
                Keep claims specific and sourced. If a product, ingredient, or
                treatment claim is uncertain, say that clearly so moderators can
                verify it.
              </p>
              <button
                className='inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400'
                disabled={isSubmitting}
                type='submit'
              >
                {isSubmitting ? 'Queueing submission...' : 'Submit for review'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Layout>
  );
}

function EmailSubmissionGuide() {
  return (
    <Layout title='Submit a Recipe or Story' noindex>
      <div className='prose max-w-3xl'>
        <h1>Share a recipe or your AGS story</h1>
        <p>
          We love hearing from other alpha-gal households. Email your recipe or story to{' '}
          <strong>info@alphagaldata.com</strong>{' '}
          <a href='mailto:info@alphagaldata.com?subject=Recipe%20submission'>(open in your mail app)</a>. Shawn reads
          every submission. Nothing is published until we have cooked or checked it, and we will ask before crediting
          you by name.
        </p>

        <h2>For a recipe, please include</h2>
        <ul>
          <li>The recipe name, how many it serves, and prep and cook times.</li>
          <li>
            The ingredients with amounts. Name the brand for anything packaged (broth, seasoning blends, sausage,
            baking mixes) so we can check the label.
          </li>
          <li>The steps, in order.</li>
          <li>Any swaps you made to avoid mammal products, and anything you tolerate that others might not, such as dairy.</li>
          <li>A photo, if you have one you took yourself.</li>
          <li>How you would like to be credited (full name, first name only, or anonymous).</li>
        </ul>

        <h2>For a story, please include</h2>
        <ul>
          <li>What happened, in your own words: a reaction, a diagnosis, a restaurant win or miss, a hidden ingredient you found.</li>
          <li>What you wish you had known sooner.</li>
          <li>How you would like to be credited.</li>
        </ul>

        <h2>What we will not publish</h2>
        <p>
          We do not publish treatment advice, claims that a product is definitely safe for everyone, or anything that
          identifies other people without their permission. We may edit for length and clarity and will check facts
          against reliable sources. See our <a href='/editorial-policy/'>editorial policy</a> and{' '}
          <a href='/privacy/'>privacy policy</a> for how we handle what you send.
        </p>
      </div>
    </Layout>
  );
}
