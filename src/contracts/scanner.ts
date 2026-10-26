export type ScannerRiskTier = 'known_risk' | 'caution' | 'unknown';

export type ScannerNextAction =
  | 'avoid'
  | 'verify_before_using'
  | 'research_before_buying';

export type ScannerClassification = {
  ingredient_name: string;
  matched_text: string;
  risk_tier: ScannerRiskTier;
  next_action: ScannerNextAction;
  explanation: string;
  source_note: string | null;
};

export type ScannerClassificationSummary = {
  risk_tier: ScannerRiskTier;
  next_action: ScannerNextAction;
  message: string;
};

export type ScannerClassificationRequest = {
  input_text: string;
};

export type ScannerClassificationData = {
  input_text: string;
  ingredient_count: number;
  summary: ScannerClassificationSummary;
  results: ScannerClassification[];
};

export type ScannerResponseMeta = {
  request_id: string;
  classifier_source: 'api' | 'local_fallback';
};

export type ScannerErrorCode =
  | 'EMPTY_INPUT'
  | 'INVALID_INPUT'
  | 'CLASSIFICATION_FAILED';

export type ScannerResponseError = {
  code: ScannerErrorCode;
  message: string;
  recovery_guidance: string;
};

export type ScannerResponseEnvelope = {
  data: ScannerClassificationData | null;
  meta: ScannerResponseMeta;
  error: ScannerResponseError | null;
};
