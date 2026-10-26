import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useAuth } from 'react-oidc-context';
import Layout from '../components/Layout';
import TrustNotice from '../components/TrustNotice';
import type {
  ModerationDecision,
  ModerationQueueItem,
  ModerationQueueRecord,
  ModerationReviewCriteria,
  PublicationEligibility,
} from '../contracts/moderation';
import {
  getSubmissionForReview,
  isSubmissionPubliclyEligible,
  listModerationQueue,
  recordModerationDecision,
} from '../services/moderation/review';
import {
  hasAllowedGroup,
  MODERATOR_GROUPS,
} from '../services/auth/access';

const clientId = process.env.GATSBY_COGNITO_CLIENT_ID || '';
const logoutUri =
  process.env.GATSBY_COGNITO_LOGOUT_URI ||
  process.env.GATSBY_COGNITO_REDIRECT_URI ||
  '';
const cognitoDomain = process.env.GATSBY_COGNITO_DOMAIN || '';

const initialCriteria: ModerationReviewCriteria = {
  unsafe_medical_claims: false,
  unverified_treatment_advice: false,
  dangerous_safety_assertions: false,
};

function StatusBadge({
  status,
}: {
  status: ModerationQueueRecord['moderation_status'];
}) {
  const className = {
    queued: 'bg-amber-100 text-amber-900',
    approved: 'bg-emerald-100 text-emerald-900',
    rejected: 'bg-rose-100 text-rose-900',
    revision_requested: 'bg-sky-100 text-sky-900',
  }[status];

  const label = {
    queued: 'Queued',
    approved: 'Approved',
    rejected: 'Rejected',
    revision_requested: 'Revision requested',
  }[status];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      {label}
    </span>
  );
}

function PublicationBadge({
  eligibility,
}: {
  eligibility: PublicationEligibility;
}) {
  const className = {
    blocked: 'bg-stone-200 text-stone-800',
    withheld: 'bg-rose-100 text-rose-900',
    eligible: 'bg-emerald-100 text-emerald-900',
  }[eligibility];

  const label = {
    blocked: 'Not public',
    withheld: 'Withheld',
    eligible: 'Eligible later',
  }[eligibility];

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      {label}
    </span>
  );
}

function ModerationInner() {
  const auth = useAuth();
  const [queue, setQueue] = useState<ModerationQueueItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ModerationQueueRecord | null>(null);
  const [decision, setDecision] = useState<ModerationDecision>('approved');
  const [reviewSummary, setReviewSummary] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [criteria, setCriteria] = useState(initialCriteria);
  const [isLoadingQueue, setIsLoadingQueue] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const groups =
    (auth.user?.profile?.['cognito:groups'] as string[] | undefined) ?? [];
  const isAuthorized =
    auth.isAuthenticated && hasAllowedGroup(groups, MODERATOR_GROUPS);

  const signOutRedirect = () => {
    if (!clientId || !logoutUri || !cognitoDomain) return;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const pendingCount = useMemo(
    () => queue.filter((item) => item.moderation_status === 'queued').length,
    [queue]
  );

  const loadQueue = useCallback(async () => {
    setIsLoadingQueue(true);
    setErrorMessage(null);
    const response = await listModerationQueue();
    if (response.error) {
      setErrorMessage(response.error.recovery_guidance);
      setQueue([]);
      setSelectedId(null);
      setSelectedSubmission(null);
      setIsLoadingQueue(false);
      return;
    }

    const submissions = response.data?.submissions ?? [];
    setQueue(submissions);
    const nextSelectedId =
      submissions.find((item) => item.submission_id === selectedId)
        ?.submission_id ??
      submissions[0]?.submission_id ??
      null;
    setSelectedId(nextSelectedId);
    setIsLoadingQueue(false);
  }, [selectedId]);

  useEffect(() => {
    if (!isAuthorized) return;
    void loadQueue();
  }, [isAuthorized, loadQueue]);

  useEffect(() => {
    if (!isAuthorized || !selectedId) {
      setSelectedSubmission(null);
      return;
    }

    let cancelled = false;

    const loadSubmission = async () => {
      setErrorMessage(null);
      const response = await getSubmissionForReview(selectedId);
      if (cancelled) return;
      if (response.error) {
        setErrorMessage(response.error.recovery_guidance);
        setSelectedSubmission(null);
        return;
      }

      const submission = response.data?.submission ?? null;
      setSelectedSubmission(submission);
      setDecision(
        submission?.moderation_status === 'queued'
          ? 'approved'
          : submission?.moderation_status === 'approved'
            ? 'approved'
            : submission?.moderation_status === 'rejected'
              ? 'rejected'
              : 'revision_requested'
      );
      setReviewSummary(submission?.review_summary ?? '');
      setInternalNotes(submission?.internal_moderation_notes ?? '');
      setCriteria(submission?.review_criteria ?? initialCriteria);
    };

    void loadSubmission();

    return () => {
      cancelled = true;
    };
  }, [isAuthorized, selectedId]);

  if (!clientId || !cognitoDomain) {
    return (
      <section className='card'>
        <h1 className='mb-2 text-2xl font-semibold'>Moderation is not configured</h1>
        <p className='text-slate-700'>
          Set the Cognito environment variables used by the existing auth test
          route before exposing protected moderation access.
        </p>
      </section>
    );
  }

  if (auth.isLoading) {
    return <section className='card'>Loading moderation access…</section>;
  }

  if (auth.error) {
    return (
      <section className='card'>
        <h1 className='mb-2 text-2xl font-semibold'>Authentication error</h1>
        <p className='text-slate-700'>{auth.error.message}</p>
      </section>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <section className='card space-y-4'>
        <div>
          <h1 className='mb-2 text-2xl font-semibold'>Protected moderation access</h1>
          <p className='text-slate-700'>
            This route is reserved for authorized operators reviewing submitted
            community content before any public release.
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <button
            className='inline-flex items-center rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white'
            onClick={() => auth.signinRedirect()}
          >
            Sign in to moderate
          </button>
          <a
            className='inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-slate-700'
            href='/submit-recipe'
          >
            Return to public submission flow
          </a>
        </div>
      </section>
    );
  }

  if (!isAuthorized) {
    return (
      <section className='card space-y-4'>
        <div>
          <h1 className='mb-2 text-2xl font-semibold'>You do not have moderation access</h1>
          <p className='text-slate-700'>
            Your account is signed in, but it is not assigned to a moderation
            group. Queue details stay blocked unless the account belongs to
            `moderators` or `editors`. Future member accounts, if added later,
            will use separate protected flows rather than this operator route.
          </p>
        </div>
        <div className='flex flex-wrap gap-3'>
          <button
            className='inline-flex items-center rounded-full border border-emerald-700 px-4 py-2 text-sm font-semibold text-emerald-700'
            onClick={signOutRedirect}
          >
            Sign out
          </button>
        </div>
      </section>
    );
  }

  const handleSubmitDecision = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!selectedSubmission) {
      setErrorMessage('Select a submission before recording a moderation decision.');
      return;
    }

    if (!reviewSummary.trim()) {
      setErrorMessage(
        'Add a short moderation summary so the recorded decision is understandable.'
      );
      return;
    }

    setIsSaving(true);

    const response = await recordModerationDecision({
      submission_id: selectedSubmission.submission_id,
      moderation_status: decision,
      review_summary: reviewSummary.trim(),
      review_criteria: criteria,
      internal_moderation_notes: internalNotes,
      reviewed_by:
        auth.user?.profile?.email?.toString() ??
        auth.user?.profile?.sub?.toString() ??
        'authorized-moderator',
    });

    if (response.error) {
      setErrorMessage(response.error.recovery_guidance);
      setIsSaving(false);
      return;
    }

    setSuccessMessage(
      `Moderation status recorded as ${response.data?.moderation_status.replace(
        '_',
        ' '
      )}. Publication eligibility is ${response.data?.publication_eligibility.replace(
        '_',
        ' '
      )}.`
    );
    await loadQueue();
    if (selectedSubmission.submission_id) {
      const refreshed = await getSubmissionForReview(selectedSubmission.submission_id);
      if (!refreshed.error && refreshed.data?.submission) {
        setSelectedSubmission(refreshed.data.submission);
      }
    }
    setIsSaving(false);
  };

  return (
    <div className='space-y-8'>
      <section className='card'>
        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div>
            <h1 className='mb-2 text-3xl font-bold'>Moderation review queue</h1>
            <p className='max-w-3xl text-slate-700'>
              Review submitted recipes and stories before they become eligible
              for any later editorial use. Recording a decision changes
              moderation state only. It does not publish content.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            <span className='inline-flex rounded-full bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900'>
              {pendingCount} queued
            </span>
            <button
              className='inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-slate-700'
              onClick={signOutRedirect}
            >
              Sign out
            </button>
          </div>
        </div>
      </section>

      <TrustNotice title='Moderation Criteria' tone='amber'>
        <p>
          Reject or request revision when submissions contain unsafe medical
          claims, unverified treatment advice, or dangerous ingredient or safety
          assertions. Approval records review completion only; public eligibility
          stays blocked or withheld unless the moderation record explicitly makes
          the submission eligible for later editorial use.
        </p>
      </TrustNotice>

      {errorMessage ? (
        <section className='rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900'>
          {errorMessage}
        </section>
      ) : null}

      {successMessage ? (
        <section
          aria-live='polite'
          className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900'
        >
          {successMessage}
        </section>
      ) : null}

      <div className='grid gap-6 xl:grid-cols-[0.9fr_1.35fr]'>
        <section className='card space-y-4'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-xl font-semibold'>Submission queue</h2>
            <button
              className='text-sm font-semibold text-emerald-700'
              onClick={() => void loadQueue()}
              type='button'
            >
              Refresh
            </button>
          </div>

          {isLoadingQueue ? (
            <p className='text-slate-600'>Loading queued submissions…</p>
          ) : queue.length === 0 ? (
            <p className='text-slate-600'>
              No submissions are available in the moderation queue yet.
            </p>
          ) : (
            <div className='space-y-3'>
              {queue.map((item) => {
                const active = item.submission_id === selectedId;

                return (
                  <button
                    key={item.submission_id}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      active
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                    onClick={() => {
                      setSelectedId(item.submission_id);
                      setSuccessMessage(null);
                    }}
                    type='button'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                          {item.submission_type}
                        </p>
                        <h3 className='mt-1 text-base font-semibold text-slate-900'>
                          {item.title}
                        </h3>
                      </div>
                      <div className='flex flex-col items-end gap-2'>
                        <StatusBadge status={item.moderation_status} />
                        <PublicationBadge
                          eligibility={item.publication_eligibility}
                        />
                      </div>
                    </div>
                    <p className='mt-2 line-clamp-3 text-sm leading-6 text-slate-600'>
                      {item.summary}
                    </p>
                    <div className='mt-3 flex flex-wrap gap-2 text-xs text-slate-500'>
                      <span>From {item.contributor_name}</span>
                      <span>Received {new Date(item.received_at).toLocaleString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className='card'>
          {!selectedSubmission ? (
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Select a submission</h2>
              <p className='text-slate-600'>
                Choose a queued recipe or story to inspect its details and
                record a moderation decision.
              </p>
            </div>
          ) : (
            <div className='space-y-8'>
              <div className='flex flex-col gap-4 border-b border-stone-200 pb-6 lg:flex-row lg:items-start lg:justify-between'>
                <div>
                  <p className='text-xs font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    {selectedSubmission.submission_type}
                  </p>
                  <h2 className='mt-1 text-2xl font-semibold text-slate-900'>
                    {selectedSubmission.title}
                  </h2>
                  <p className='mt-2 max-w-3xl text-slate-700'>
                    {selectedSubmission.summary}
                  </p>
                </div>
                <div className='flex flex-col items-start gap-2 lg:items-end'>
                  <StatusBadge status={selectedSubmission.moderation_status} />
                  <PublicationBadge
                    eligibility={selectedSubmission.publication_eligibility}
                  />
                </div>
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
                  <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Contributor
                  </h3>
                  <p className='mt-3 font-medium text-slate-900'>
                    {selectedSubmission.contributor_name}
                  </p>
                  <p className='text-sm text-slate-600'>
                    {selectedSubmission.contributor_email}
                  </p>
                </div>
                <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
                  <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Intake timing
                  </h3>
                  <p className='mt-3 text-sm text-slate-700'>
                    Received {new Date(selectedSubmission.received_at).toLocaleString()}
                  </p>
                  <p className='mt-1 text-sm text-slate-700'>
                    Last reviewed:{' '}
                    {selectedSubmission.reviewed_at
                      ? new Date(selectedSubmission.reviewed_at).toLocaleString()
                      : 'Not reviewed yet'}
                  </p>
                </div>
              </div>

              <section className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
                <h3 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                  Publication safety
                </h3>
                <p className='mt-3 text-sm text-slate-700'>
                  Public eligibility is currently{' '}
                  <strong>
                    {selectedSubmission.publication_eligibility.replace('_', ' ')}
                  </strong>
                  .{' '}
                  {isSubmissionPubliclyEligible(selectedSubmission)
                    ? 'This submission is eligible for later editorial use, but it is still not auto-published.'
                    : 'This submission must stay out of public listings, featured areas, and resource surfaces.'}
                </p>
              </section>

              {selectedSubmission.submission_type === 'recipe' ? (
                <div className='grid gap-6 lg:grid-cols-2'>
                  <div>
                    <h3 className='text-lg font-semibold'>Ingredients</h3>
                    <div className='mt-3 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-7 text-slate-700'>
                      {selectedSubmission.ingredients_text || 'No ingredient list provided.'}
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-semibold'>Instructions</h3>
                    <div className='mt-3 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-7 text-slate-700'>
                      {selectedSubmission.instructions_text ||
                        'No preparation steps provided.'}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className='text-lg font-semibold'>Story details</h3>
                  <div className='mt-3 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-7 text-slate-700'>
                    {selectedSubmission.story_text || 'No story details provided.'}
                  </div>
                </div>
              )}

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <h3 className='text-lg font-semibold'>Safety notes from submitter</h3>
                  <div className='mt-3 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-7 text-slate-700'>
                    {selectedSubmission.safety_notes || 'No safety notes provided.'}
                  </div>
                </div>
                <div>
                  <h3 className='text-lg font-semibold'>Source notes</h3>
                  <div className='mt-3 whitespace-pre-wrap rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-7 text-slate-700'>
                    {selectedSubmission.source_notes || 'No source notes provided.'}
                  </div>
                </div>
              </div>

              <form className='space-y-6 border-t border-stone-200 pt-6' onSubmit={handleSubmitDecision}>
                <div className='space-y-3'>
                  <h3 className='text-lg font-semibold'>Record moderation decision</h3>
                  <p className='text-sm text-slate-600'>
                    Save a moderation state change only after checking the
                    submission against AlphaGalData trust criteria.
                  </p>
                </div>

                <div className='grid gap-3 sm:grid-cols-3'>
                  {[
                    ['approved', 'Approve'],
                    ['rejected', 'Reject'],
                    ['revision_requested', 'Request revision'],
                  ].map(([value, label]) => (
                    <label
                      key={value}
                      className={`rounded-2xl border p-4 ${
                        decision === value
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <input
                        checked={decision === value}
                        className='mr-3'
                        name='moderation_status'
                        onChange={() => setDecision(value as ModerationDecision)}
                        type='radio'
                        value={value}
                      />
                      <span className='font-semibold text-slate-900'>{label}</span>
                    </label>
                  ))}
                </div>

                <div className='rounded-2xl border border-stone-200 bg-stone-50 p-4'>
                  <h4 className='text-sm font-semibold uppercase tracking-[0.18em] text-slate-500'>
                    Trust criteria checks
                  </h4>
                  <div className='mt-4 space-y-3'>
                    {[
                      [
                        'unsafe_medical_claims',
                        'Unsafe medical claims are present or need escalation.',
                      ],
                      [
                        'unverified_treatment_advice',
                        'Unverified treatment advice is present or needs revision.',
                      ],
                      [
                        'dangerous_safety_assertions',
                        'Dangerous ingredient or safety assertions are present.',
                      ],
                    ].map(([key, label]) => (
                      <label key={key} className='flex items-start gap-3 text-sm text-slate-700'>
                        <input
                          checked={criteria[key as keyof ModerationReviewCriteria]}
                          className='mt-1'
                          onChange={(event) =>
                            setCriteria((current) => ({
                              ...current,
                              [key]: event.target.checked,
                            }))
                          }
                          type='checkbox'
                        />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className='block'>
                  <span className='text-sm font-semibold text-slate-900'>
                    Moderation summary
                  </span>
                  <textarea
                    className='mt-2 min-h-32 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                    onChange={(event) => setReviewSummary(event.target.value)}
                    value={reviewSummary}
                  />
                  <p className='mt-2 text-sm text-slate-600'>
                    Summarize the decision in operational terms. This records
                    moderation state, not public editorial copy.
                  </p>
                </label>

                <label className='block'>
                  <span className='text-sm font-semibold text-slate-900'>
                    Internal moderation notes
                  </span>
                  <textarea
                    className='mt-2 min-h-32 w-full rounded-xl border border-stone-300 px-4 py-3 text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'
                    onChange={(event) => setInternalNotes(event.target.value)}
                    value={internalNotes}
                  />
                  <p className='mt-2 text-sm text-slate-600'>
                    Internal only. Use this for editorial reasoning, follow-up,
                    or audit notes. This text must never appear on public pages.
                  </p>
                </label>

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                  <p className='max-w-2xl text-sm text-slate-600'>
                    Approval does not publish the submission automatically. If
                    unsafe criteria are flagged, the record stays withheld from
                    public eligibility even after review is complete.
                  </p>
                  <button
                    className='inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-400'
                    disabled={isSaving}
                    type='submit'
                  >
                    {isSaving ? 'Saving decision...' : 'Record moderation decision'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function ModerationPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout title='Moderation Review'>
      <Helmet>
        <meta content='noindex, nofollow' name='robots' />
      </Helmet>
      {mounted ? <ModerationInner /> : <section className='card'>Loading moderation workflow…</section>}
    </Layout>
  );
}
