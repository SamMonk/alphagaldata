import type {
  PublicationEligibility,
  ModerationQueueItem,
  ModerationQueueRecord,
  ModerationQueueResponseEnvelope,
  ModerationSubmissionResponseEnvelope,
  RecordModerationDecisionRequest,
  RecordModerationDecisionResponseEnvelope,
} from '../../contracts/moderation';
import { LOCAL_SUBMISSION_STORAGE_KEY } from '../submissions/intake';

// Moderation data remains operator-only workflow state.
// It must stay separate from any future consumer account/profile model.
const API_BASE_URL = process.env.GATSBY_API_BASE_URL?.replace(/\/$/, '') ?? '';
const MODERATION_BASE_ENDPOINT =
  process.env.GATSBY_ADMIN_SUBMISSIONS_URL ??
  (API_BASE_URL ? `${API_BASE_URL}/admin/submissions` : '');

const hasBrowser = (): boolean => typeof window !== 'undefined';

const makeId = (prefix: string): string =>
  `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const makeMeta = (moderation_source: 'api' | 'local_fallback') => ({
  request_id: makeId('req'),
  moderation_source,
});

const normalizePublicationEligibility = (
  record: Partial<ModerationQueueRecord>
): PublicationEligibility => {
  if (record.publication_eligibility) return record.publication_eligibility;
  return record.moderation_status === 'approved' ? 'eligible' : 'blocked';
};

const isUnsafeForPublication = (
  request: RecordModerationDecisionRequest
): boolean =>
  request.review_criteria.unsafe_medical_claims ||
  request.review_criteria.unverified_treatment_advice ||
  request.review_criteria.dangerous_safety_assertions;

const readLocalQueue = (): ModerationQueueRecord[] => {
  if (!hasBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_SUBMISSION_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((record) => ({
      ...(record as ModerationQueueRecord),
      publication_eligibility: normalizePublicationEligibility(
        record as ModerationQueueRecord
      ),
      internal_moderation_notes:
        (record as ModerationQueueRecord).internal_moderation_notes ?? null,
    }));
  } catch {
    return [];
  }
};

const writeLocalQueue = (records: ModerationQueueRecord[]): void => {
  if (!hasBrowser()) return;
  window.localStorage.setItem(
    LOCAL_SUBMISSION_STORAGE_KEY,
    JSON.stringify(records)
  );
};

const toQueueItem = (record: ModerationQueueRecord): ModerationQueueItem => ({
  submission_id: record.submission_id,
  submission_type: record.submission_type,
  title: record.title,
  summary: record.summary,
  contributor_name: record.contributor_name,
  contributor_email: record.contributor_email,
  moderation_status: record.moderation_status,
  publication_eligibility: record.publication_eligibility,
  received_at: record.received_at,
  reviewed_at: record.reviewed_at ?? null,
});

export const isSubmissionPubliclyEligible = (
  record: Pick<ModerationQueueRecord, 'moderation_status' | 'publication_eligibility'>
): boolean =>
  record.moderation_status === 'approved' &&
  record.publication_eligibility === 'eligible';

export const listModerationQueue =
  async (): Promise<ModerationQueueResponseEnvelope> => {
    if (MODERATION_BASE_ENDPOINT) {
      try {
        const response = await fetch(MODERATION_BASE_ENDPOINT);
        if (response.ok) {
          const payload =
            (await response.json()) as ModerationQueueResponseEnvelope;
          if (payload?.meta && 'data' in payload && 'error' in payload) {
            return payload;
          }
        }
      } catch {
        // Fall through to the local moderation queue in MVP environments.
      }
    }

    return {
      data: {
        submissions: readLocalQueue()
          .sort((left, right) => right.received_at.localeCompare(left.received_at))
          .map(toQueueItem),
      },
      meta: makeMeta('local_fallback'),
      error: null,
    };
  };

export const getSubmissionForReview = async (
  submissionId: string
): Promise<ModerationSubmissionResponseEnvelope> => {
  if (MODERATION_BASE_ENDPOINT) {
    try {
      const response = await fetch(
        `${MODERATION_BASE_ENDPOINT}/${encodeURIComponent(submissionId)}`
      );
      if (response.ok) {
        const payload =
          (await response.json()) as ModerationSubmissionResponseEnvelope;
        if (payload?.meta && 'data' in payload && 'error' in payload) {
          return payload;
        }
      }
    } catch {
      // Fall through to the local moderation queue in MVP environments.
    }
  }

  const submission =
    readLocalQueue().find((record) => record.submission_id === submissionId) ??
    null;

  if (!submission) {
    return {
      data: null,
      meta: makeMeta('local_fallback'),
      error: {
        code: 'SUBMISSION_NOT_FOUND',
        message: 'The requested submission could not be found.',
        recovery_guidance: 'Return to the moderation queue and select another item.',
      },
    };
  }

  return {
    data: { submission },
    meta: makeMeta('local_fallback'),
    error: null,
  };
};

export const recordModerationDecision = async (
  request: RecordModerationDecisionRequest
): Promise<RecordModerationDecisionResponseEnvelope> => {
  if (MODERATION_BASE_ENDPOINT) {
    try {
      const response = await fetch(
        `${MODERATION_BASE_ENDPOINT}/${encodeURIComponent(
          request.submission_id
        )}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        }
      );
      if (response.ok) {
        const payload =
          (await response.json()) as RecordModerationDecisionResponseEnvelope;
        if (payload?.meta && 'data' in payload && 'error' in payload) {
          return payload;
        }
      }
    } catch {
      // Fall through to the local moderation queue in MVP environments.
    }
  }

  const queue = readLocalQueue();
  const index = queue.findIndex(
    (record) => record.submission_id === request.submission_id
  );

  if (index === -1) {
    return {
      data: null,
      meta: makeMeta('local_fallback'),
      error: {
        code: 'SUBMISSION_NOT_FOUND',
        message: 'This submission is no longer available for review.',
        recovery_guidance: 'Refresh the moderation queue and try again.',
      },
    };
  }

  const reviewedAt = new Date().toISOString();
  const publicationEligibility: PublicationEligibility =
    request.moderation_status === 'approved'
      ? isUnsafeForPublication(request)
        ? 'withheld'
        : 'eligible'
      : 'blocked';

  queue[index] = {
    ...queue[index],
    moderation_status: request.moderation_status,
    publication_eligibility: publicationEligibility,
    review_summary: request.review_summary.trim(),
    review_criteria: request.review_criteria,
    internal_moderation_notes: request.internal_moderation_notes.trim() || null,
    reviewed_at: reviewedAt,
    reviewed_by: request.reviewed_by,
  };
  writeLocalQueue(queue);

  return {
    data: {
      submission_id: request.submission_id,
      moderation_status: request.moderation_status,
      publication_eligibility: publicationEligibility,
      reviewed_at: reviewedAt,
    },
    meta: makeMeta('local_fallback'),
    error: null,
  };
};
