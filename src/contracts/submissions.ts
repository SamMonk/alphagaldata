export type SubmissionType = 'recipe' | 'story';

export type ModerationStatus =
  | 'queued'
  | 'approved'
  | 'rejected'
  | 'revision_requested';

export type SubmissionIntakeRequest = {
  submission_type: SubmissionType;
  contributor_name: string;
  contributor_email: string;
  title: string;
  summary: string;
  ingredients_text: string | null;
  instructions_text: string | null;
  story_text: string | null;
  safety_notes: string | null;
  source_notes: string | null;
  photo_url: string | null;
  consent_to_review: boolean;
  consent_to_contact: boolean;
};

export type SubmissionIntakeData = {
  submission_id: string;
  submission_type: SubmissionType;
  moderation_status: ModerationStatus;
  received_at: string;
};

export type SubmissionIntakeMeta = {
  request_id: string;
  intake_source: 'api' | 'local_fallback';
};

export type SubmissionIntakeErrorCode =
  | 'EMPTY_INPUT'
  | 'INVALID_SUBMISSION'
  | 'SUBMISSION_FAILED';

export type SubmissionIntakeError = {
  code: SubmissionIntakeErrorCode;
  message: string;
  recovery_guidance: string;
};

export type SubmissionIntakeResponseEnvelope = {
  data: SubmissionIntakeData | null;
  meta: SubmissionIntakeMeta;
  error: SubmissionIntakeError | null;
};
