import type {
  SubmissionIntakeData,
  SubmissionIntakeError,
  SubmissionIntakeErrorCode,
  SubmissionIntakeRequest,
  SubmissionIntakeResponseEnvelope,
  SubmissionType,
} from '../../contracts/submissions';

// Public intake stays login-free in MVP.
// This fallback queue exists only to preserve the moderated submission boundary in
// development environments; it is not a member account system and it should not
// drift into private profile or health-record storage.
const STORAGE_KEY = 'alphagaldata:submission-intake';
export const LOCAL_SUBMISSION_STORAGE_KEY = STORAGE_KEY;
const API_BASE_URL = process.env.GATSBY_API_BASE_URL?.replace(/\/$/, '') ?? '';
const RECIPE_ENDPOINT =
  process.env.GATSBY_SUBMISSIONS_RECIPES_URL ??
  (API_BASE_URL ? `${API_BASE_URL}/submissions/recipes` : '');
const STORY_ENDPOINT =
  process.env.GATSBY_SUBMISSIONS_STORIES_URL ??
  (API_BASE_URL ? `${API_BASE_URL}/submissions/stories` : '');

/**
 * True only when both submission endpoints are configured. Without them, submissions
 * would only be saved in the visitor's browser, so the public page falls back to an
 * email-based submission guide instead of a form that silently goes nowhere.
 */
export const isSubmissionIntakeConfigured = Boolean(RECIPE_ENDPOINT && STORY_ENDPOINT);

type StoredSubmission = SubmissionIntakeRequest &
  SubmissionIntakeData & {
    stored_at: string;
    reviewed_at?: string | null;
    reviewed_by?: string | null;
    review_summary?: string | null;
    review_criteria?: {
      unsafe_medical_claims: boolean;
      unverified_treatment_advice: boolean;
      dangerous_safety_assertions: boolean;
    } | null;
  };

const hasBrowser = (): boolean => typeof window !== 'undefined';

const makeId = (prefix: string): string =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const makeError = (
  code: SubmissionIntakeErrorCode,
  message: string,
  recovery_guidance: string
): SubmissionIntakeError => ({ code, message, recovery_guidance });

const getEndpoint = (submissionType: SubmissionType): string =>
  submissionType === 'recipe' ? RECIPE_ENDPOINT : STORY_ENDPOINT;

const readStoredSubmissions = (): StoredSubmission[] => {
  if (!hasBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredSubmission[]) : [];
  } catch {
    return [];
  }
};

const writeStoredSubmissions = (records: StoredSubmission[]): void => {
  if (!hasBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

const fallbackSubmit = async (
  request: SubmissionIntakeRequest
): Promise<SubmissionIntakeResponseEnvelope> => {
  const receivedAt = new Date().toISOString();
  const data: SubmissionIntakeData = {
    submission_id: makeId('submission'),
    submission_type: request.submission_type,
    moderation_status: 'queued',
    received_at: receivedAt,
  };

  if (hasBrowser()) {
    writeStoredSubmissions([
      ...readStoredSubmissions(),
      {
        ...request,
        ...data,
        stored_at: receivedAt,
        reviewed_at: null,
        reviewed_by: null,
        review_summary: null,
        review_criteria: null,
      },
    ]);
  }

  return {
    data,
    meta: {
      request_id: makeId('req'),
      intake_source: 'local_fallback',
    },
    error: null,
  };
};

export const submitPublicSubmission = async (
  request: SubmissionIntakeRequest
): Promise<SubmissionIntakeResponseEnvelope> => {
  const endpoint = getEndpoint(request.submission_type);

  if (!request.contributor_name.trim() || !request.title.trim()) {
    return {
      data: null,
      meta: {
        request_id: makeId('req'),
        intake_source: 'local_fallback',
      },
      error: makeError(
        'INVALID_SUBMISSION',
        'The submission is missing required information.',
        'Review the highlighted fields, then submit again.'
      ),
    };
  }

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const payload =
          (await response.json()) as SubmissionIntakeResponseEnvelope;
        if (payload?.meta && 'data' in payload && 'error' in payload) {
          return payload;
        }
      }
    } catch {
      // Fall through to local queueing when the API is unavailable in MVP environments.
    }
  }

  return fallbackSubmit(request);
};

export const listStoredSubmissions = (): StoredSubmission[] => {
  return readStoredSubmissions();
};

export const writeStoredSubmissionRecords = (
  records: StoredSubmission[]
): void => {
  writeStoredSubmissions(records);
};
