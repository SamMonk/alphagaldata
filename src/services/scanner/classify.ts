import type {
  ScannerClassification,
  ScannerClassificationData,
  ScannerClassificationRequest,
  ScannerNextAction,
  ScannerResponseEnvelope,
  ScannerRiskTier,
} from '../../contracts/scanner';

type WatchlistEntry = {
  key: string;
  label: string;
  regex: RegExp;
  risk_tier: ScannerRiskTier;
  next_action: ScannerNextAction;
  explanation: string;
  source_note?: string;
};

const WATCHLIST: WatchlistEntry[] = [
  {
    key: 'beef',
    label: 'Beef / Bovine',
    regex: /\b(beef|bovine|ox|cow)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Mammalian meat is a known alpha-gal risk and should be avoided.',
  },
  {
    key: 'pork',
    label: 'Pork / Porcine',
    regex: /\b(pork|porcine|swine|ham|bacon)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Porcine ingredients are mammalian-derived and should be avoided.',
  },
  {
    key: 'lamb',
    label: 'Lamb / Mutton',
    regex: /\b(lamb|mutton)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Lamb and mutton are mammalian meats and should be avoided.',
  },
  {
    key: 'venison',
    label: 'Venison / Deer',
    regex: /\b(venison|deer)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation: 'Venison is mammalian meat and should be avoided.',
  },
  {
    key: 'bison',
    label: 'Bison / Buffalo',
    regex: /\b(bison|buffalo)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Bison and buffalo ingredients are mammalian-derived and should be avoided.',
  },
  {
    key: 'goat',
    label: 'Goat',
    regex: /\bgoat\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation: 'Goat is mammalian meat and should be avoided.',
  },
  {
    key: 'veal',
    label: 'Veal',
    regex: /\bveal\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation: 'Veal is mammalian meat and should be avoided.',
  },
  {
    key: 'rabbit',
    label: 'Rabbit',
    regex: /\brabbit\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation: 'Rabbit is mammalian meat and should be avoided.',
  },
  {
    key: 'game-meat',
    label: 'Game Meat',
    regex: /\bgame\s+meat\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Generic game meat can include mammalian sources and should be avoided.',
  },
  {
    key: 'organ-meat',
    label: 'Organ Meat',
    regex: /\borgan\s+meat\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Organ meats are mammalian-derived and should be avoided.',
  },
  {
    key: 'gelatin',
    label: 'Gelatin / Gelatine',
    regex: /\bgelatin(e)?\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Gelatin is often mammalian-derived and is a known alpha-gal concern.',
    source_note: 'CDC products that may contain alpha-gal',
  },
  {
    key: 'collagen',
    label: 'Collagen',
    regex: /\bcollagen\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Collagen is commonly mammalian-derived and should be treated as known risk.',
  },
  {
    key: 'lard',
    label: 'Lard',
    regex: /\blard\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation: 'Lard is rendered pork fat and should be avoided.',
    source_note: 'CDC products that may contain alpha-gal',
  },
  {
    key: 'tallow',
    label: 'Tallow / Suet',
    regex: /\b(tallow|suet)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Tallow and suet are rendered mammalian fats and should be avoided.',
    source_note: 'CDC products that may contain alpha-gal',
  },
  {
    key: 'dripping',
    label: 'Dripping',
    regex: /\bdripping\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Dripping usually indicates rendered meat fat and should be avoided.',
  },
  {
    key: 'bone-broth',
    label: 'Bone Broth / Stock',
    regex: /\bbone\s+(broth|stock|meal)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Bone broth or stock can be mammalian-derived and should be avoided.',
  },
  {
    key: 'broth',
    label: 'Broth / Bouillon',
    regex: /\b(broth|bouillon)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Broth and bouillon may contain mammalian sources and should be treated as known risk until verified otherwise.',
  },
  {
    key: 'meat-extract',
    label: 'Meat Extract / Stock',
    regex: /\bmeat\s+(extract|stock)\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Meat extract or stock is a known mammalian-derived concern.',
  },
  {
    key: 'rennet',
    label: 'Rennet',
    regex: /\brennet\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Rennet may be animal-derived and should be treated as known risk here.',
  },
  {
    key: 'pepsin',
    label: 'Pepsin',
    regex: /\bpepsin\b/i,
    risk_tier: 'known_risk',
    next_action: 'avoid',
    explanation:
      'Pepsin can be animal-derived and should be treated as known risk.',
  },
  {
    key: 'glycerin',
    label: 'Glycerin / Glycerol',
    regex: /\bglycer(ol|in|ine)\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Glycerin can come from plant or mammalian sources, so source verification is needed.',
  },
  {
    key: 'stearate',
    label: 'Stearate / Stearic acid',
    regex: /\b(stearate|magnesium\s+stearate|stearic\s+acid)\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Stearates may be plant or mammal sourced, so verify before using.',
  },
  {
    key: 'lanolin',
    label: 'Lanolin',
    regex: /\blanolin\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Lanolin is animal-derived, so caution and source confirmation are appropriate.',
  },
  {
    key: 'natural-flavors',
    label: 'Natural Flavors',
    regex: /\bnatural\s+flavou?rs?\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Natural flavors can hide mammalian sources, so verify before using.',
  },
  {
    key: 'mono-di',
    label: 'Mono & Diglycerides',
    regex: /\b(mono\s*(and|&)?\s*diglycerides|monoglycerides|diglycerides)\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Mono- and diglycerides can be plant or mammal sourced, so verification is needed.',
  },
  {
    key: 'carmine',
    label: 'Carmine / Cochineal',
    regex: /\b(carmine|cochineal)\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Carmine is not a mammalian ingredient, but it is still a caution flag for ingredient-source review.',
  },
  {
    key: 'vitamin-d3',
    label: 'Vitamin D3',
    regex: /\bvitamin\s*d3\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Vitamin D3 can come from lanolin or other sources, so verify before using.',
  },
  {
    key: 'whey',
    label: 'Whey',
    regex: /\bwhey\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Whey is dairy-derived and may require caution depending on the person and product.',
  },
  {
    key: 'casein',
    label: 'Casein / Caseinate',
    regex: /\bcasein(ate)?\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Casein and caseinate are dairy-derived and should be verified before using.',
  },
  {
    key: 'lactose',
    label: 'Lactose',
    regex: /\blactose\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Lactose is dairy-derived and should be verified against personal tolerance and source context.',
  },
  {
    key: 'milk',
    label: 'Milk / Cream / Butter',
    regex: /\b(milk|cream|butter)\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Milk, cream, and butter are dairy ingredients that need caution and product-specific verification.',
  },
  {
    key: 'cheese',
    label: 'Cheese',
    regex: /\bcheese\b/i,
    risk_tier: 'caution',
    next_action: 'verify_before_using',
    explanation:
      'Cheese is dairy-derived and should be verified before using.',
  },
];

/**
 * Ingredients that are not mammalian but that some people with alpha-gal report reacting
 * to. They never change the alpha-gal risk summary; the scanner page shows them separately
 * and lets each reader mark them as their own trigger.
 */
export type PersonalTrigger = {
  key: string;
  label: string;
  regex: RegExp;
  explanation: string;
  learn_more: string;
};

export const PERSONAL_TRIGGERS: PersonalTrigger[] = [
  {
    key: 'carrageenan',
    label: 'Carrageenan',
    // E407 / E407a are the EU additive numbers for carrageenan and processed eucheuma seaweed.
    regex: /\b(carrageenan|carrageenin|E\s?-?407a?)\b(?!\s*-?\s*free)/i,
    explanation:
      'Carrageenan is a seaweed thickener, not a mammal product, but it can carry the alpha-gal sugar and some people with alpha-gal syndrome report reacting to it.',
    learn_more: '/learn/carrageenan-and-alpha-gal',
  },
];

export const findPersonalTriggers = (
  text: string
): Array<{ trigger: PersonalTrigger; matched_text: string }> =>
  PERSONAL_TRIGGERS.flatMap((trigger) => {
    const match = text.match(trigger.regex);
    return match ? [{ trigger, matched_text: match[0] }] : [];
  });

const API_ENDPOINT = process.env.GATSBY_SCANNER_CLASSIFY_URL ?? '';

const makeRequestId = (): string =>
  `scanner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const countIngredients = (text: string): number =>
  text.split(/[,;]/).filter((part) => part.trim()).length;

const summaryFromResults = (
  results: ScannerClassification[]
): ScannerClassificationData['summary'] => {
  if (results.some((result) => result.risk_tier === 'known_risk')) {
    return {
      risk_tier: 'known_risk',
      next_action: 'avoid',
      message: 'Known risk ingredients found.',
    };
  }

  if (results.some((result) => result.risk_tier === 'caution')) {
    return {
      risk_tier: 'caution',
      next_action: 'verify_before_using',
      message: 'Caution: verify ingredient sources before using.',
    };
  }

  return {
    risk_tier: 'unknown',
    next_action: 'research_before_buying',
    message:
      'No watchlist matches were found. Continue reviewing the label and research unclear ingredients before buying.',
  };
};

const fallbackClassify = (
  request: ScannerClassificationRequest
): ScannerResponseEnvelope => {
  const results = WATCHLIST.flatMap((entry) => {
    const match = request.input_text.match(entry.regex);
    if (!match) return [];

    return [
      {
        ingredient_name: entry.label,
        matched_text: match[0],
        risk_tier: entry.risk_tier,
        next_action: entry.next_action,
        explanation: entry.explanation,
        source_note: entry.source_note ?? null,
      },
    ];
  });

  return {
    data: {
      input_text: request.input_text,
      ingredient_count: countIngredients(request.input_text),
      summary: summaryFromResults(results),
      results,
    },
    meta: {
      request_id: makeRequestId(),
      classifier_source: 'local_fallback',
    },
    error: null,
  };
};

export const getScannerWatchlistCount = (): number => WATCHLIST.length;

export const classifyIngredients = async (
  input_text: string
): Promise<ScannerResponseEnvelope> => {
  const normalized = input_text.trim();

  if (!normalized) {
    return {
      data: null,
      meta: {
        request_id: makeRequestId(),
        classifier_source: 'local_fallback',
      },
      error: {
        code: 'EMPTY_INPUT',
        message: 'Paste an ingredient list before checking.',
        recovery_guidance:
          'Paste the ingredient text from a label or product page, then try again.',
      },
    };
  }

  const request: ScannerClassificationRequest = {
    input_text: normalized,
  };

  if (API_ENDPOINT) {
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (response.ok) {
        const payload = (await response.json()) as ScannerResponseEnvelope;
        if (payload?.meta && 'data' in payload && 'error' in payload) {
          return payload;
        }
      }
    } catch {
      // Fall back to the local adapter when the API is unavailable in MVP environments.
    }
  }

  return fallbackClassify(request);
};
