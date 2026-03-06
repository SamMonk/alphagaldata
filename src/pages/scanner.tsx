import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

type ZXingReader = any;

type Tier = 'avoid' | 'high' | 'check';

type Match = { key: string; label: string; regex: RegExp; tier: Tier; ref?: string };

const TIER_META: Record<Tier, { color: string; bg: string; border: string; text: string }> = {
  avoid:  { color: 'text-red-800',    bg: 'bg-red-100',    border: 'border-red-300',    text: 'bg-red-200' },
  high:   { color: 'text-orange-800', bg: 'bg-orange-100', border: 'border-orange-300', text: 'bg-orange-200' },
  check:  { color: 'text-amber-800',  bg: 'bg-amber-100',  border: 'border-amber-300',  text: 'bg-amber-200' },
};

const WATCHLIST: Match[] = [
  // === AVOID: contains alpha-gal directly ===
  { key: 'beef',        label: 'Beef / Bovine',         regex: /\b(beef|bovine|ox|cow)\b/i,             tier: 'avoid' },
  { key: 'pork',        label: 'Pork / Porcine',        regex: /\b(pork|porcine|swine|ham|bacon)\b/i,   tier: 'avoid' },
  { key: 'lamb',        label: 'Lamb / Mutton',         regex: /\b(lamb|mutton)\b/i,                    tier: 'avoid' },
  { key: 'venison',     label: 'Venison / Deer',        regex: /\b(venison|deer)\b/i,                   tier: 'avoid' },
  { key: 'bison',       label: 'Bison / Buffalo',       regex: /\b(bison|buffalo)\b/i,                  tier: 'avoid' },
  { key: 'goat',        label: 'Goat',                  regex: /\bgoat\b/i,                             tier: 'avoid' },
  { key: 'veal',        label: 'Veal',                  regex: /\bveal\b/i,                             tier: 'avoid' },
  { key: 'rabbit',      label: 'Rabbit',                regex: /\brabbit\b/i,                           tier: 'avoid' },
  { key: 'game-meat',   label: 'Game Meat',             regex: /\bgame\s+meat\b/i,                      tier: 'avoid' },
  { key: 'organ-meat',  label: 'Organ Meat',            regex: /\borgan\s+meat\b/i,                     tier: 'avoid' },

  // === HIGH: mammalian derivative, likely reactive ===
  { key: 'gelatin',     label: 'Gelatin / Gelatine',    regex: /\bgelatin(e)?\b/i,                      tier: 'high', ref: 'https://www.cdc.gov/ticks/alpha-gal/consumers.html' },
  { key: 'collagen',    label: 'Collagen',              regex: /\bcollagen\b/i,                         tier: 'high' },
  { key: 'lard',        label: 'Lard',                  regex: /\blard\b/i,                             tier: 'high', ref: 'https://www.cdc.gov/ticks/alpha-gal/consumers.html' },
  { key: 'tallow',      label: 'Tallow / Suet',         regex: /\b(tallow|suet)\b/i,                    tier: 'high', ref: 'https://www.cdc.gov/ticks/alpha-gal/consumers.html' },
  { key: 'dripping',    label: 'Dripping',              regex: /\bdripping\b/i,                         tier: 'high' },
  { key: 'bone-broth',  label: 'Bone Broth / Stock',    regex: /\bbone\s+(broth|stock|meal)\b/i,        tier: 'high' },
  { key: 'broth',       label: 'Broth / Bouillon',      regex: /\b(broth|bouillon)\b/i,                 tier: 'high' },
  { key: 'meat-extract',label: 'Meat Extract / Stock',   regex: /\bmeat\s+(extract|stock)\b/i,           tier: 'high' },
  { key: 'rennet',      label: 'Rennet',                regex: /\brennet\b/i,                           tier: 'high' },
  { key: 'pepsin',      label: 'Pepsin',                regex: /\bpepsin\b/i,                           tier: 'high' },

  // === CHECK: may be plant or mammal sourced — verify ===
  { key: 'glycerin',    label: 'Glycerin / Glycerol',   regex: /\bglycer(ol|in|ine)\b/i,                tier: 'check' },
  { key: 'stearate',    label: 'Stearate / Stearic acid',regex: /\b(stearate|magnesium\s+stearate|stearic\s+acid)\b/i, tier: 'check' },
  { key: 'lanolin',     label: 'Lanolin',               regex: /\blanolin\b/i,                          tier: 'check' },
  { key: 'natural-flavors', label: 'Natural Flavors',   regex: /\bnatural\s+flavou?rs?\b/i,             tier: 'check' },
  { key: 'mono-di',     label: 'Mono & Diglycerides',   regex: /\b(mono\s*(and|&)?\s*diglycerides|monoglycerides|diglycerides)\b/i, tier: 'check' },
  { key: 'carmine',     label: 'Carmine / Cochineal',   regex: /\b(carmine|cochineal)\b/i,              tier: 'check' },
  { key: 'vitamin-d3',  label: 'Vitamin D3',            regex: /\bvitamin\s*d3\b/i,                     tier: 'check' },
  { key: 'whey',        label: 'Whey',                  regex: /\bwhey\b/i,                             tier: 'check' },
  { key: 'casein',      label: 'Casein / Caseinate',    regex: /\bcasein(ate)?\b/i,                     tier: 'check' },
  { key: 'lactose',     label: 'Lactose',               regex: /\blactose\b/i,                          tier: 'check' },
  { key: 'milk',        label: 'Milk / Cream / Butter', regex: /\b(milk|cream|butter)\b/i,              tier: 'check' },
  { key: 'cheese',      label: 'Cheese',                regex: /\bcheese\b/i,                           tier: 'check' },
];

function highlight(text: string, matches: Match[]) {
  if (!text) return null;
  let parts: React.ReactNode[] = [text];
  matches.forEach((m, idx) => {
    const style = TIER_META[m.tier];
    const next: React.ReactNode[] = [];
    parts.forEach((p, i) => {
      if (typeof p !== 'string') { next.push(p); return; }
      const pieces = p.split(m.regex);
      for (let j = 0; j < pieces.length; j++) {
        next.push(pieces[j]);
        if (j < pieces.length - 1) {
          next.push(<mark key={`${idx}-${i}-${j}`} className={`${style.text} px-0.5 rounded`}>{p.match(m.regex)?.[0] || ''}</mark>);
        }
      }
    });
    parts = next;
  });
  return <span>{parts}</span>;
}

function getVerdict(matched: Match[]): { tier: Tier | 'clean'; message: string } {
  if (matched.some(m => m.tier === 'avoid')) return { tier: 'avoid', message: 'Alpha-gal triggers found' };
  if (matched.some(m => m.tier === 'high'))  return { tier: 'high', message: 'Mammalian derivatives detected — verify source' };
  if (matched.some(m => m.tier === 'check')) return { tier: 'check', message: 'Ingredients need source verification' };
  return { tier: 'clean', message: 'No known alpha-gal triggers detected' };
}

function VerdictBanner({ matched, ingredientCount }: { matched: Match[]; ingredientCount: number }) {
  const verdict = getVerdict(matched);

  if (verdict.tier === 'clean') {
    return (
      <div className="p-3 rounded border border-green-300 bg-green-50 text-green-800">
        <div className="font-semibold">{verdict.message}</div>
        <div className="text-xs mt-1">
          Scanned {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''} against {WATCHLIST.length} watchlist entries.
          This scan checks for common mammalian-derived ingredients. It cannot detect all possible sources of alpha-gal.
          Always verify with manufacturers and your healthcare provider.
        </div>
      </div>
    );
  }

  const style = TIER_META[verdict.tier as Tier];
  return (
    <div className={`p-3 rounded border ${style.border} ${style.bg} ${style.color}`}>
      <div className="font-semibold">{verdict.message}</div>
      <div className="text-xs mt-1">{matched.length} match{matched.length !== 1 ? 'es' : ''} found in {ingredientCount} ingredient{ingredientCount !== 1 ? 's' : ''}</div>
    </div>
  );
}

function MatchList({ matched }: { matched: Match[] }) {
  const grouped: Record<Tier, Match[]> = { avoid: [], high: [], check: [] };
  matched.forEach(m => grouped[m.tier].push(m));
  const tierLabels: Record<Tier, string> = { avoid: 'Avoid — contains alpha-gal', high: 'High risk — mammalian derivative', check: 'Check source — may be plant-derived' };

  return (
    <div className="space-y-2">
      {(['avoid', 'high', 'check'] as Tier[]).map(tier => {
        if (grouped[tier].length === 0) return null;
        const style = TIER_META[tier];
        return (
          <div key={tier}>
            <div className={`text-xs font-semibold ${style.color} mb-0.5`}>{tierLabels[tier]}</div>
            <ul className="text-sm list-disc pl-5">
              {grouped[tier].map(m => (
                <li key={m.key}>
                  <span className={`font-medium ${style.color}`}>{m.label}</span>
                  {m.ref ? (
                    <> · <a href={m.ref} target="_blank" rel="noreferrer" className="underline text-xs">source</a></>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export default function ScannerPage(){
  const [code, setCode] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [product, setProduct] = React.useState<any>(null);
  const [active, setActive] = React.useState<boolean>(false);
  const [pasteText, setPasteText] = React.useState<string>('');
  const [pasteResult, setPasteResult] = React.useState<string | null>(null);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [ocrStatus, setOcrStatus] = React.useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const readerRef = React.useRef<ZXingReader | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const startScanner = async () => {
    if (typeof window === 'undefined') return;
    try {
      setError(null);
      setCapturedImage(null);
      const ZX = await import('@zxing/browser');
      const codeReader = new ZX.BrowserMultiFormatReader();
      readerRef.current = codeReader;
      setActive(true);
      await codeReader.decodeFromVideoDevice(undefined, videoRef.current!, (result: any, err: any) => {
        if (result?.getText) {
          const txt = result.getText();
          if (/^\d{8,14}$/.test(txt)) {
            setCode(txt);
            lookup(txt);
            stopScanner();
          }
        }
      });
    } catch (e: any) {
      setError(e?.message || 'Unable to start camera');
    }
  };

  const stopScanner = async () => {
    try {
      setActive(false);
      await readerRef.current?.reset();
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch {}
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);
    stopScanner();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCapturedImage(reader.result as string);
      setError(null);
    };
    reader.readAsDataURL(file);
    // Reset file input so the same file can be re-selected
    e.target.value = '';
  };

  const decodeBarcode = async () => {
    if (!capturedImage) return;
    setError(null);
    setLoading(true);
    try {
      const ZX = await import('@zxing/browser');
      const codeReader = new ZX.BrowserMultiFormatReader();
      const img = new Image();
      img.src = capturedImage;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      // Create a canvas to pass to ZXing
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const result = await codeReader.decodeFromCanvas(c);
      const txt = result?.getText?.();
      if (txt && /^\d{8,14}$/.test(txt)) {
        setCode(txt);
        lookup(txt);
      } else if (txt) {
        setCode(txt);
        setError(`Barcode found ("${txt}") but it doesn't look like a product barcode (expected 8–14 digits).`);
        setLoading(false);
      } else {
        setError('No barcode detected in this image. Try capturing a clearer photo.');
        setLoading(false);
      }
    } catch (e: any) {
      setError('No barcode detected in this image. Try capturing a clearer photo.');
      setLoading(false);
    }
  };

  const readIngredients = async () => {
    if (!capturedImage) return;
    setOcrStatus('Initializing OCR…');
    setError(null);
    try {
      const Tesseract = await import('tesseract.js');
      setOcrStatus('Reading text…');
      const { data } = await Tesseract.recognize(capturedImage, 'eng');
      const text = data.text?.trim();
      if (!text) {
        setOcrStatus(null);
        setError('No text detected in this image. Try a clearer photo of the ingredient label.');
        return;
      }
      setPasteText(text);
      setOcrStatus(null);
      // Auto-trigger watchlist check
      setProduct(null);
      setPasteResult(text);
    } catch (e: any) {
      setOcrStatus(null);
      setError('OCR failed: ' + (e?.message || 'Unknown error'));
    }
  };

  const clearCapture = () => {
    setCapturedImage(null);
    setOcrStatus(null);
  };

  const lookup = async (barcode: string) => {
    setLoading(true); setError(null); setProduct(null);
    setPasteResult(null);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await res.json();
      if (data?.status !== 1) {
        setError('Product not found in Open Food Facts');
        setLoading(false);
        return;
      }
      setProduct(data.product);
    } catch (e: any) {
      setError('Lookup failed. Check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  const matchesFor = (text: string) => WATCHLIST.filter(m => m.regex.test(text));

  const submitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (code && /^\d{8,14}$/.test(code)) lookup(code);
  };

  const checkPastedIngredients = () => {
    if (!pasteText.trim()) return;
    setProduct(null);
    setError(null);
    setPasteResult(pasteText.trim());
  };

  // Barcode product results
  const ingredientText: string = product?.ingredients_text || product?.ingredients_text_en || '';
  const combinedText = [
    ingredientText,
    (product?.ingredients || []).map((i: any) => i?.text).filter(Boolean).join(', '),
  ].filter(Boolean).join(', ');
  const barcodeMatched = combinedText ? matchesFor(combinedText) : [];

  // Paste results
  const pasteMatched = pasteResult ? matchesFor(pasteResult) : [];

  const estimateIngredientCount = (text: string) => text.split(/[,;]/).filter(s => s.trim()).length;

  return (
    <Layout title="Scanner">
      <SEO />
      <Helmet>
        <meta name="description" content="Scan barcodes or paste ingredient lists to check for alpha-gal triggers. Color-coded risk tiers help identify mammalian-derived ingredients." />
      </Helmet>
      <div className="prose max-w-none">
        <h1>Ingredient & product scanner (beta)</h1>
        <p>
          Scan a package barcode or paste an ingredient list to check for ingredients that some alpha-gal
          patients watch. Educational use only — decisions should be individualized with your clinician.
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {/* Left column: inputs */}
        <div className="space-y-4">
          {/* Camera / Photo card */}
          <div className="card p-4">
            <div className="font-semibold mb-2">Camera / Photo</div>

            {/* Camera controls */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {!active ? (
                <button className="btn" onClick={startScanner}>Start Camera</button>
              ) : (
                <>
                  <button className="btn" onClick={stopScanner}>Stop</button>
                  <button className="btn" onClick={captureFrame}>Capture</button>
                </>
              )}
              <button className="btn" onClick={() => fileInputRef.current?.click()}>Upload Photo</button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Camera view */}
            {active && !capturedImage && (
              <div className="aspect-video bg-black/80 rounded overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline/>
              </div>
            )}

            {/* Hidden video element when camera not active (needed for ref) */}
            {!active && <video ref={videoRef} className="hidden" muted playsInline/>}

            {/* Captured image preview */}
            {capturedImage && (
              <div className="mt-2">
                <div className="relative">
                  <img src={capturedImage} alt="Captured" className="w-full rounded border" />
                  <button
                    className="absolute top-1 right-1 bg-white/80 hover:bg-white rounded-full px-2 py-0.5 text-xs font-medium"
                    onClick={clearCapture}
                    title="Clear photo"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  <button className="btn flex-1" onClick={decodeBarcode} disabled={!!ocrStatus || loading}>
                    Decode Barcode
                  </button>
                  <button className="btn flex-1" onClick={readIngredients} disabled={!!ocrStatus || loading}>
                    Read Ingredients (OCR)
                  </button>
                </div>
              </div>
            )}

            {/* OCR progress */}
            {ocrStatus && (
              <div className="mt-2 text-sm text-blue-700 flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
                {ocrStatus}
              </div>
            )}

            {/* Manual barcode input */}
            <form onSubmit={submitManual} className="mt-3 flex gap-2">
              <input className="input w-full" placeholder="Or enter barcode (8–14 digits)" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} />
              <button className="btn" type="submit">Lookup</button>
            </form>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            {loading && <div className="mt-2 text-sm">Looking up product…</div>}
          </div>

          {/* Paste ingredients */}
          <div className="card p-4">
            <div className="font-semibold mb-2">Paste Ingredients</div>
            <textarea
              className="input w-full h-28 resize-y"
              placeholder="Paste ingredient list here..."
              value={pasteText}
              onChange={e => setPasteText(e.target.value)}
            />
            <button
              className="btn mt-2"
              onClick={checkPastedIngredients}
              disabled={!pasteText.trim()}
            >
              Check Ingredients
            </button>
          </div>
        </div>

        {/* Right column: results */}
        <div className="card p-4">
          <div className="font-semibold mb-2">Result</div>

          {/* Barcode product result */}
          {product && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {product?.image_small_url ? (
                  <img src={product.image_small_url} alt={product.product_name || 'Product'} className="w-20 h-20 object-cover rounded border"/>
                ) : null}
                <div>
                  <div className="font-medium">{product.product_name || 'Unnamed product'}</div>
                  <div className="text-sm text-slate-600">{product.brands || product.brand_owner || ''}</div>
                  <div className="text-xs text-slate-500">Barcode: {product.code}</div>
                </div>
              </div>

              {combinedText ? (
                <>
                  <VerdictBanner matched={barcodeMatched} ingredientCount={estimateIngredientCount(combinedText)} />
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Ingredients</div>
                    <div className="text-sm">{highlight(combinedText, barcodeMatched)}</div>
                  </div>
                  {barcodeMatched.length > 0 && (
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Watchlist matches</div>
                      <MatchList matched={barcodeMatched} />
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 rounded border border-slate-300 bg-slate-50 text-slate-700 text-sm">
                  No ingredient data available for this product in Open Food Facts. Try pasting the ingredient list manually using the "Paste Ingredients" box.
                </div>
              )}

              <div className="mt-2 p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                Not medical advice. Some excipients are from plant/microbial sources and may be tolerated; management should be clinician-guided.
              </div>
            </div>
          )}

          {/* Paste result */}
          {pasteResult && !product && (
            <div className="space-y-3">
              <VerdictBanner matched={pasteMatched} ingredientCount={estimateIngredientCount(pasteResult)} />
              <div>
                <div className="text-sm text-slate-600 mb-1">Ingredients</div>
                <div className="text-sm">{highlight(pasteResult, pasteMatched)}</div>
              </div>
              {pasteMatched.length > 0 && (
                <div>
                  <div className="text-sm text-slate-600 mb-1">Watchlist matches</div>
                  <MatchList matched={pasteMatched} />
                </div>
              )}
              <div className="mt-2 p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                Not medical advice. Some excipients are from plant/microbial sources and may be tolerated; management should be clinician-guided.
              </div>
            </div>
          )}

          {/* Empty state */}
          {!product && !pasteResult && (
            <div className="text-sm text-slate-600">Scan a barcode or paste ingredients to get started.</div>
          )}
        </div>
      </div>

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="prose max-w-none mt-8">
        <h3>How it works</h3>
        <ul>
          <li>Barcodes are read locally on your device using the camera (ZXing).</li>
          <li>You can capture a photo to decode a barcode or read ingredient text via OCR (Tesseract.js — runs entirely in your browser).</li>
          <li>We query the Open Food Facts public API for product data and ingredients.</li>
          <li>You can also paste an ingredient list directly from a label or website.</li>
          <li>Ingredients are checked against {WATCHLIST.length} known alpha-gal-related items across three risk tiers:
            <span className="inline-block ml-1 px-1.5 py-0.5 rounded bg-red-100 text-red-800 text-xs font-medium">avoid</span>{' '}
            <span className="inline-block px-1.5 py-0.5 rounded bg-orange-100 text-orange-800 text-xs font-medium">high risk</span>{' '}
            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-medium">check source</span>
          </li>
        </ul>
        <p>
          References: <a href="https://www.cdc.gov/ticks/alpha-gal/consumers.html" target="_blank" rel="noreferrer">CDC products that may contain alpha-gal</a>,{' '}
          <a href="https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/alpha-gal-syndrome" target="_blank" rel="noreferrer">AAAAI: Alpha-gal syndrome</a>.
        </p>
      </div>
    </Layout>
  );
}
