import type {
  ModerationStatus,
  SubmissionIntakeRequest,
  SubmissionType,
} from './submissions';

export type ModerationReviewCriteria = {
  unsafe_medical_claims: boolean;
  unverified_treatment_advice: boolean;
  dangerous_safety_assertions: boolean;
};

export type PublicationEligibility = 'blocked' | 'withheld' | 'eligible';

export type ModerationQueueRecord = SubmissionIntakeRequest & {
  submission_id: string;
  submission_type: SubmissionType;
  moderation_status: ModerationStatus;
  publication_eligibility: PublicationEligibility;
  received_at: string;
  stored_at?: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  review_summary: string | null;
  review_criteria: ModerationReviewCriteria | null;
  internal_moderation_notes: string | null;
};

export type ModerationQueueItem = {
  submission_id: string;
  submission_type: SubmissionType;
  title: string;
  summary: string;
  contributor_name: string;
  contributor_email: string;
  moderation_status: ModerationStatus;
  publication_eligibility: PublicationEligibility;
  received_at: string;
  reviewed_at: string | null;
};

export type ModerationQueueData = {
  submissions: ModerationQueueItem[];
};

export type ModerationQueueMeta = {
  request_id: string;
  moderation_source: 'api' | 'local_fallback';
};

export type ModerationQueueError = {
  code: 'UNAUTHORIZED' | 'LOAD_FAILED' | 'SUBMISSION_NOT_FOUND' | 'SAVE_FAILED';
  message: string;
  recovery_guidance: string;
};

export type ModerationQueueResponseEnvelope = {
  data: ModerationQueueData | null;
  meta: ModerationQueueMeta;
  error: ModerationQueueError | null;
};

export type ModerationSubmissionData = {
  submission: ModerationQueueRecord;
};

export type ModerationSubmissionResponseEnvelope = {
  data: ModerationSubmissionData | null;
  meta: ModerationQueueMeta;
  error: ModerationQueueError | null;
};

export type ModerationDecision = 'approved' | 'rejected' | 'revision_requested';

export type RecordModerationDecisionRequest = {
  submission_id: string;
  moderation_status: ModerationDecision;
  review_summary: string;
  review_criteria: ModerationReviewCriteria;
  internal_moderation_notes: string;
  reviewed_by: string;
};

export type RecordModerationDecisionData = {
  submission_id: string;
  moderation_status: ModerationStatus;
  publication_eligibility: PublicationEligibility;
  reviewed_at: string;
};

export type RecordModerationDecisionResponseEnvelope = {
  data: RecordModerationDecisionData | null;
  meta: ModerationQueueMeta;
  error: ModerationQueueError | null;
};
