import React from 'react';
import type { DecodeHintType, Result } from '@zxing/library';
import PreparednessResourcePanel from '../components/PreparednessResourcePanel';
import ScannerClassificationList from '../components/scanner/ScannerClassificationList';
import ScannerEducationGuidance from '../components/scanner/ScannerEducationGuidance';
import ScannerResultSummaryCard from '../components/scanner/ScannerResultSummaryCard';
import Layout from '../components/Layout';
import TrustNotice from '../components/TrustNotice';
import type {
  ScannerClassification,
  ScannerClassificationSummary,
  ScannerRiskTier,
} from '../contracts/scanner';
import {
  classifyIngredients,
  getScannerWatchlistCount,
} from '../services/scanner/classify';

type ZXingReader = unknown;

type ScannerProduct = {
  product_name?: string;
  brands?: string;
  brand_owner?: string;
  code?: string;
  image_small_url?: string;
  ingredients_text?: string;
  ingredients_text_en?: string;
  ingredients?: Array<{ text?: string }>;
};

const TIER_META: Record<
  ScannerRiskTier,
  { color: string; bg: string; border: string; text: string }
> = {
  known_risk: {
    color: 'text-red-800',
    bg: 'bg-red-100',
    border: 'border-red-300',
    text: 'bg-red-200',
  },
  caution: {
    color: 'text-amber-800',
    bg: 'bg-amber-100',
    border: 'border-amber-300',
    text: 'bg-amber-200',
  },
  unknown: {
    color: 'text-blue-800',
    bg: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'bg-blue-200',
  },
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight(text: string, matches: ScannerClassification[]) {
  if (!text || matches.length === 0) return <span>{text}</span>;

  let rendered: React.ReactNode[] = [text];

  matches.forEach((match, matchIndex) => {
    const style = TIER_META[match.risk_tier];
    const pattern = new RegExp(`(${escapeRegExp(match.matched_text)})`, 'gi');
    const next: React.ReactNode[] = [];

    rendered.forEach((part, partIndex) => {
      if (typeof part !== 'string') {
        next.push(part);
        return;
      }

      const pieces = part.split(pattern);
      pieces.forEach((piece, pieceIndex) => {
        if (!piece) return;
        if (piece.toLowerCase() === match.matched_text.toLowerCase()) {
          next.push(
            <mark
              key={`${matchIndex}-${partIndex}-${pieceIndex}`}
              className={`${style.text} rounded px-0.5`}
            >
              {piece}
            </mark>
          );
          return;
        }
        next.push(piece);
      });
    });

    rendered = next;
  });

  return <span>{rendered}</span>;
}

function fallbackSummaryFromMatches(
  matches: ScannerClassification[]
): ScannerClassificationSummary {
  if (matches.some((item) => item.risk_tier === 'known_risk')) {
    return {
      risk_tier: 'known_risk',
      next_action: 'avoid',
      message: 'Known risk ingredients found.',
    };
  }

  if (matches.some((item) => item.risk_tier === 'caution')) {
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
}

function estimateIngredientCount(text: string): number {
  return text.split(/[,;]/).filter((segment) => segment.trim()).length;
}

function hasUsableProductIngredients(text: string): boolean {
  const normalized = text.trim().toLowerCase();
  if (!normalized) return false;

  const stripped = normalized.replace(/[^a-z,\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!stripped) return false;

  const placeholderPatterns = [
    /^test(?:,\s*test)*$/,
    /^sample(?:,\s*sample)*$/,
    /^ingredients?$/,
    /^n\/a$/,
    /^unknown$/,
  ];

  if (placeholderPatterns.some((pattern) => pattern.test(stripped))) {
    return false;
  }

  const tokens = stripped
    .split(/[, ]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  if (tokens.length === 0) return false;

  const uniqueTokens = new Set(tokens);
  if (tokens.length >= 2 && uniqueTokens.size === 1) {
    return false;
  }

  if (uniqueTokens.size < 2 && stripped.length < 20) {
    return false;
  }

  return true;
}

export default function ScannerPage() {
  const [code, setCode] = React.useState<string>('');
  const [barcodeLoading, setBarcodeLoading] = React.useState<boolean>(false);
  const [lookupError, setLookupError] = React.useState<string | null>(null);
  const [pasteError, setPasteError] = React.useState<string | null>(null);
  const [product, setProduct] = React.useState<ScannerProduct | null>(null);
  const [active, setActive] = React.useState<boolean>(false);
  const [pasteText, setPasteText] = React.useState<string>('');
  const [pasteResult, setPasteResult] = React.useState<string | null>(null);
  const [pasteMatches, setPasteMatches] = React.useState<
    ScannerClassification[]
  >([]);
  const [pasteSummary, setPasteSummary] =
    React.useState<ScannerClassificationSummary | null>(null);
  const [pasteSubmitting, setPasteSubmitting] = React.useState<boolean>(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const readerRef = React.useRef<ZXingReader | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const startScanner = async () => {
    if (typeof window === 'undefined') return;

    try {
      setLookupError(null);
      setCapturedImage(null);

      const ZX = await import('@zxing/browser');
      const codeReader = new ZX.BrowserMultiFormatReader();
      readerRef.current = codeReader as ZXingReader;
      setActive(true);

      await codeReader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result: Result | undefined, _err: unknown) => {
          if (!result?.getText) return;
          const text = result.getText();
          if (!/^\d{8,14}$/.test(text)) return;

          setCode(text);
          void lookup(text);
          void stopScanner();
        }
      );
    } catch (error: unknown) {
      setLookupError(
        error instanceof Error ? error.message : 'Unable to start camera'
      );
    }
  };

  const stopScanner = async () => {
    try {
      setActive(false);
      const resettableReader = readerRef.current as { reset?: () => Promise<void> } | null;
      await resettableReader?.reset?.();
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch {
      // Ignore cleanup failures while stopping the camera.
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/png'));
    void stopScanner();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      setLookupError(null);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const decodeBarcode = async () => {
    if (!capturedImage) return;

    setLookupError(null);
    setBarcodeLoading(true);

    try {
      const ZX = await import('@zxing/browser');
      const ZXLib = await import('@zxing/library');

      const image = new Image();
      image.src = capturedImage;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('Failed to load image'));
      });

      const hints = new Map<DecodeHintType, unknown>();
      hints.set(ZXLib.DecodeHintType.TRY_HARDER, true);

      const canvases: HTMLCanvasElement[] = [];

      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = image.width;
      fullCanvas.height = image.height;
      fullCanvas.getContext('2d')!.drawImage(image, 0, 0);
      canvases.push(fullCanvas);

      const grayscaleCanvas = document.createElement('canvas');
      grayscaleCanvas.width = image.width;
      grayscaleCanvas.height = image.height;
      const grayscaleContext = grayscaleCanvas.getContext('2d')!;
      grayscaleContext.filter = 'grayscale(1) contrast(2)';
      grayscaleContext.drawImage(image, 0, 0);
      canvases.push(grayscaleCanvas);

      const cropWidth = Math.floor(image.width * 0.7);
      const cropHeight = Math.floor(image.height * 0.7);
      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropWidth;
      cropCanvas.height = cropHeight;
      cropCanvas.getContext('2d')!.drawImage(
        image,
        (image.width - cropWidth) / 2,
        (image.height - cropHeight) / 2,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );
      canvases.push(cropCanvas);

      const stripHeight = Math.floor(image.height * 0.3);
      const stripCanvas = document.createElement('canvas');
      stripCanvas.width = image.width;
      stripCanvas.height = stripHeight;
      stripCanvas.getContext('2d')!.drawImage(
        image,
        0,
        (image.height - stripHeight) / 2,
        image.width,
        stripHeight,
        0,
        0,
        image.width,
        stripHeight
      );
      canvases.push(stripCanvas);

      const upscaledCanvas = document.createElement('canvas');
      upscaledCanvas.width = image.width * 2;
      upscaledCanvas.height = image.height * 2;
      const upscaledContext = upscaledCanvas.getContext('2d')!;
      upscaledContext.imageSmoothingEnabled = false;
      upscaledContext.drawImage(image, 0, 0, upscaledCanvas.width, upscaledCanvas.height);
      canvases.push(upscaledCanvas);

      let decoded: string | null = null;

      for (const canvas of canvases) {
        try {
          const codeReader = new ZX.BrowserMultiFormatReader(hints);
          const result = codeReader.decodeFromCanvas(canvas);
          const text = result?.getText?.();
          if (text) {
            decoded = text;
            break;
          }
        } catch {
          // Keep trying alternate decode strategies.
        }
      }

      if (decoded && /^\d{8,14}$/.test(decoded)) {
        setCode(decoded);
        await lookup(decoded);
        return;
      }

      if (decoded) {
        setCode(decoded);
        setLookupError(
          `Barcode found ("${decoded}") but it doesn't look like a product barcode (expected 8–14 digits).`
        );
        return;
      }

      setLookupError(
        'No barcode detected. Tips: crop to just the barcode area, ensure good lighting, and avoid glare or blur.'
      );
    } catch {
      setLookupError(
        'No barcode detected. Tips: crop to just the barcode area, ensure good lighting, and avoid glare or blur.'
      );
    } finally {
      setBarcodeLoading(false);
    }
  };

  const extractIngredients = (
    raw: string
  ): { extracted: string; wasFiltered: boolean } => {
    const text = raw.replace(/\r\n/g, '\n').replace(/[ \t]+/g, ' ');
    const patterns = [/ingredients\s*[:\-—]\s*/i, /ingredients\s*\n/i];

    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (!match) continue;

      const start = match.index + match[0].length;
      let section = text.slice(start);

      const stopPatterns = [
        /\n\s*(nutrition|manufactured|distributed|produced|allergen|allergy|warning|caution|storage|directions|best before|use by|serving|contains|may contain|for allergens|net w[te])/i,
        /\n\s*(calories|total fat|sodium|protein|vitamin|iron|calcium)/i,
      ];

      for (const stopPattern of stopPatterns) {
        const stopMatch = stopPattern.exec(section);
        if (!stopMatch) continue;
        section = section.slice(0, stopMatch.index);
        break;
      }

      const cleaned = section.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleaned.length > 10) {
        return { extracted: cleaned, wasFiltered: true };
      }
    }

    return {
      extracted: text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(),
      wasFiltered: false,
    };
  };

  const readIngredients = async () => {
    if (!capturedImage) return;

    setOcrStatus('Initializing OCR…');
    setLookupError(null);
    setPasteError(null);

    try {
      const Tesseract = await import('tesseract.js');
      setOcrStatus('Reading text…');
      const { data } = await Tesseract.recognize(capturedImage, 'eng');
      const text = data.text?.trim();

      if (!text) {
        setLookupError(
          'No text detected in this image. Try a clearer photo of the ingredient label.'
        );
        setOcrStatus(null);
        return;
      }

      const { extracted, wasFiltered } = extractIngredients(text);
      setPasteText(extracted);
      setOcrStatus(null);

      if (!wasFiltered) {
        setLookupError(
          'Could not isolate the ingredients section — showing all detected text. You can edit it below before checking.'
        );
      }
    } catch (error: unknown) {
      setOcrStatus(null);
      setLookupError(
        `OCR failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const clearCapture = () => {
    setCapturedImage(null);
    setOcrStatus(null);
  };

  const lookup = async (barcode: string) => {
    setBarcodeLoading(true);
    setLookupError(null);
    setProduct(null);
    setPasteResult(null);
    setPasteMatches([]);
    setPasteSummary(null);

    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = (await response.json()) as {
        status?: number;
        product?: ScannerProduct;
      };

      if (data.status !== 1 || !data.product) {
        setLookupError('Product not found in Open Food Facts');
        return;
      }

      setProduct(data.product);
    } catch {
      setLookupError('Lookup failed. Check your network connection.');
    } finally {
      setBarcodeLoading(false);
    }
  };

  const submitManual = (event: React.FormEvent) => {
    event.preventDefault();
    if (code && /^\d{8,14}$/.test(code)) {
      void lookup(code);
    }
  };

  const validatePasteInput = (value: string): string | null => {
    const trimmed = value.trim();

    if (!trimmed) {
      return 'Paste an ingredient list before checking.';
    }

    if (!/[a-zA-Z]/.test(trimmed) || trimmed.length < 8) {
      return 'Add more readable ingredient text before checking so the scanner has something useful to interpret.';
    }

    return null;
  };

  const checkPastedIngredients = async () => {
    const validationError = validatePasteInput(pasteText);
    if (validationError) {
      setPasteError(validationError);
      return;
    }

    setPasteSubmitting(true);
    setPasteError(null);
    setLookupError(null);
    setProduct(null);

    const response = await classifyIngredients(pasteText);

    setPasteSubmitting(false);

    if (response.error) {
      setPasteMatches([]);
      setPasteResult(null);
      setPasteSummary(null);
      setPasteError(response.error.message);
      return;
    }

    setPasteResult(response.data?.input_text ?? pasteText.trim());
    setPasteMatches(response.data?.results ?? []);
    setPasteSummary(
      response.data?.summary ?? fallbackSummaryFromMatches(response.data?.results ?? [])
    );
  };

  const ingredientText =
    product?.ingredients_text || product?.ingredients_text_en || '';
  const combinedText = [
    ingredientText,
    (product?.ingredients ?? [])
      .map((ingredient) => ingredient.text)
      .filter(Boolean)
      .join(', '),
  ]
    .filter(Boolean)
    .join(', ');
  const hasTrustedProductIngredients = hasUsableProductIngredients(combinedText);

  return (
    <Layout
      title="Scanner"
      description="Scan barcodes or paste ingredient lists to check for alpha-gal triggers. Color-coded risk tiers help identify mammalian-derived ingredients."
      noindex
    >
      <div className="prose max-w-none">
        <h1>Ingredient & product scanner (beta)</h1>
        <p>
          Scan a package barcode or paste an ingredient list to check for
          ingredients that some alpha-gal patients watch. This tool is designed
          to be conservative and practical, not to diagnose or guarantee safety.
        </p>
      </div>

      <TrustNotice title="Educational decision support" tone="teal">
        The scanner helps you spot <strong>known risk</strong>,{' '}
        <strong>caution</strong>, and <strong>unclear</strong> ingredients so
        you can choose the safest next step. It cannot confirm that a product is
        safe for every person, and it should not replace manufacturer
        verification or clinician guidance when the stakes are high.
      </TrustNotice>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-4">
          <div className="card p-4">
            <h2 className="mb-2 text-lg font-semibold">Camera or photo</h2>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              {!active ? (
                <button className="btn" onClick={startScanner}>
                  Start Camera
                </button>
              ) : (
                <>
                  <button className="btn" onClick={() => void stopScanner()}>
                    Stop
                  </button>
                  <button className="btn" onClick={captureFrame}>
                    Capture
                  </button>
                </>
              )}
              <button
                className="btn"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
                aria-label="Upload a barcode or ingredient photo"
              />
            </div>

            {active && !capturedImage ? (
              <div className="aspect-video overflow-hidden rounded bg-black/80">
                <video
                  ref={videoRef}
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                />
              </div>
            ) : null}

            {!active ? (
              <video ref={videoRef} className="hidden" muted playsInline />
            ) : null}

            {capturedImage ? (
              <div className="mt-2">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full rounded border"
                  />
                  <button
                    className="absolute right-2 top-2 inline-flex min-h-10 min-w-10 items-center justify-center rounded-full bg-white/90 px-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    onClick={clearCapture}
                    title="Clear photo"
                    aria-label="Clear photo"
                  >
                    ✕
                  </button>
                </div>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  <button
                    className="btn flex-1"
                    onClick={() => void decodeBarcode()}
                    disabled={!!ocrStatus || barcodeLoading || pasteSubmitting}
                  >
                    Decode Barcode
                  </button>
                  <button
                    className="btn flex-1"
                    onClick={() => void readIngredients()}
                    disabled={!!ocrStatus || barcodeLoading || pasteSubmitting}
                  >
                    Read Ingredients (OCR)
                  </button>
                </div>
              </div>
            ) : null}

            {ocrStatus ? (
              <div
                className="mt-2 flex items-center gap-2 text-sm text-blue-700"
                role="status"
                aria-live="polite"
              >
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                {ocrStatus}
              </div>
            ) : null}

            <form
              onSubmit={submitManual}
              className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]"
            >
              <label className="sr-only" htmlFor="barcode-input">
                Enter barcode
              </label>
              <input
                id="barcode-input"
                className="input w-full"
                placeholder="Or enter barcode (8-14 digits)"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value.replace(/\D/g, ''))
                }
                inputMode="numeric"
              />
              <button
                className="btn"
                type="submit"
                disabled={barcodeLoading || pasteSubmitting}
              >
                Lookup
              </button>
            </form>

            {lookupError ? (
              <div
                className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {lookupError}
              </div>
            ) : null}

            {barcodeLoading ? (
              <div className="mt-2 text-sm" role="status" aria-live="polite">
                Looking up product...
              </div>
            ) : null}
          </div>

          <div className="card p-4">
            <h2 className="mb-2 text-lg font-semibold">Paste ingredients</h2>
            <p className="mb-2 text-sm leading-6 text-slate-600">
              Paste the ingredient panel from a label or product page, then
              review or edit it before you check.
            </p>
            <label
              className="text-sm font-medium text-slate-900"
              htmlFor="paste-ingredients"
            >
              Ingredient list
            </label>
            <textarea
              id="paste-ingredients"
              className="input mt-2 h-32 w-full resize-y"
              placeholder="Paste ingredient list here..."
              value={pasteText}
              onChange={(event) => {
                setPasteText(event.target.value);
                if (pasteError) setPasteError(null);
              }}
              aria-describedby="paste-ingredients-help"
            />
            <p id="paste-ingredients-help" className="mt-2 text-sm text-slate-600">
              Conservative educational guidance only. If the source is unclear,
              verify before buying or using.
            </p>
            <button
              className="btn mt-3"
              onClick={() => void checkPastedIngredients()}
              disabled={pasteSubmitting || barcodeLoading}
            >
              {pasteSubmitting ? 'Checking ingredients…' : 'Check Ingredients'}
            </button>

            {pasteError ? (
              <div
                className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                role="alert"
              >
                {pasteError}
              </div>
            ) : null}

            {pasteSubmitting ? (
              <div
                className="mt-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800"
                role="status"
                aria-live="polite"
              >
                Ingredient interpretation is in progress. Keep reviewing the
                label while the scanner checks the text.
              </div>
            ) : null}
          </div>
        </div>

        <section className="card p-4" aria-labelledby="scanner-result-heading">
          <h2 id="scanner-result-heading" className="mb-2 text-lg font-semibold">
            Result
          </h2>

          {product ? (
            <div className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                {product.image_small_url ? (
                  <img
                    src={product.image_small_url}
                    alt={product.product_name || 'Product'}
                    className="h-20 w-20 rounded border object-cover"
                  />
                ) : null}
                <div>
                  <div className="font-medium">
                    {product.product_name || 'Unnamed product'}
                  </div>
                  <div className="text-sm text-slate-600">
                    {product.brands || product.brand_owner || ''}
                  </div>
                  <div className="text-xs text-slate-500">
                    Barcode: {product.code}
                  </div>
                </div>
              </div>

              {hasTrustedProductIngredients ? (
                <>
                  <div className="rounded border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
                    Barcode product review still uses the existing browser-side
                    watchlist on this page. Paste-first submission now routes
                    through the shared scanner service boundary introduced in
                    this story.
                  </div>
                  <div aria-label="Scanned ingredients">
                    <div className="mb-1 text-sm font-medium text-slate-700">
                      Ingredients reviewed
                    </div>
                    <div className="text-sm">{combinedText}</div>
                  </div>
                </>
              ) : (
                <div className="rounded border border-slate-300 bg-slate-50 p-3 text-sm text-slate-700">
                  Ingredient data from Open Food Facts looks incomplete or unreliable for this barcode, so the scanner is not treating it as reviewed. Upload a clear photo of the actual ingredient panel with <strong>Read Ingredients (OCR)</strong> or paste the ingredient list manually.
                </div>
              )}

              <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                This result is educational support, not a diagnosis. Some
                excipients may be plant, microbial, or mammal-sourced, so
                unclear cases still need verification.
              </div>
            </div>
          ) : null}

          {pasteResult && !product ? (
            <div className="space-y-3">
              <ScannerResultSummaryCard
                summary={pasteSummary ?? fallbackSummaryFromMatches(pasteMatches)}
                ingredientCount={estimateIngredientCount(pasteResult)}
                watchlistCount={getScannerWatchlistCount()}
                resultCount={pasteMatches.length}
              />
              <div>
                <div className="mb-1 text-sm font-medium text-slate-700">
                  Ingredients reviewed
                </div>
                <div className="text-sm">{highlight(pasteResult, pasteMatches)}</div>
              </div>
              <ScannerClassificationList items={pasteMatches} />
              <ScannerEducationGuidance
                summary={pasteSummary ?? fallbackSummaryFromMatches(pasteMatches)}
                items={pasteMatches}
              />
              <div className="mt-2 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                This result is educational support, not a diagnosis. Use
                caution when ingredient sources are unclear and verify before
                buying or using.
              </div>
            </div>
          ) : null}

          {!product && !pasteResult ? (
            <div className="text-sm text-slate-600">
              Scan a barcode or paste ingredients to get started.
            </div>
          ) : null}
        </section>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="prose mt-8 max-w-none">
        <h3>How it works</h3>
        <ul>
          <li>
            Barcodes are read locally on your device using the camera (ZXing).
          </li>
          <li>
            You can capture a photo to decode a barcode or read ingredient text
            via OCR (Tesseract.js runs entirely in your browser).
          </li>
          <li>
            We query the Open Food Facts public API for product data and
            ingredients.
          </li>
          <li>
            You can also paste an ingredient list directly from a label or
            website.
          </li>
          <li>
            Paste-first scanner submission now runs through a shared scanner
            service boundary, with a local fallback adapter when no backend
            endpoint is configured yet.
          </li>
          <li>
            Ingredients are checked against {getScannerWatchlistCount()} known
            alpha-gal-related watchlist entries using text labels, not color
            alone:
            <span className="ml-1 inline-block rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-800">
              known risk / avoid
            </span>{' '}
            <span className="inline-block rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
              caution / verify before using
            </span>{' '}
            <span className="inline-block rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800">
              unknown / research before buying
            </span>
          </li>
        </ul>
        <p>
          References:{' '}
          <a
            href="https://www.cdc.gov/ticks/alpha-gal/consumers.html"
            target="_blank"
            rel="noreferrer"
          >
            CDC products that may contain alpha-gal
          </a>
          ,{' '}
          <a
            href="https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/alpha-gal-syndrome"
            target="_blank"
            rel="noreferrer"
          >
            AAAAI: Alpha-gal syndrome
          </a>
          .
        </p>
      </div>

      <div className="mt-8">
        <PreparednessResourcePanel
          eyebrow='After the ingredient check'
          title='Keep follow-on tools close when the answer affects meals or emergencies'
          description='Scanner results can tell you whether to pause, verify, or avoid. When that leads into restaurant planning, printable backups, or emergency visibility, the next step should stay within reach from the same page.'
          links={[
            {
              href: '/downloads',
              label: 'Preparedness downloads',
              description:
                'Open the printable dining and wallet tools when the ingredient decision needs a practical backup for restaurants, travel, or intake.',
            },
            {
              href: '/learn/dining-card-guide',
              label: 'Get dining cards',
              description:
                'Use the dining card when kitchen communication or cross-contact concerns matter more than the packaged ingredient list alone.',
            },
            {
              href: '/learn/medical-alert-tattoo',
              label: 'Medical alert guide',
              description:
                'Review visibility-focused preparedness options if the ingredient question connects to broader emergency planning.',
            },
          ]}
        />
      </div>
    </Layout>
  );
}
