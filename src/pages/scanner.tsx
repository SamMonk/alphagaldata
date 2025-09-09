import React from 'react';
import Layout from '../components/Layout';
import SEO from '../components/SEO';

type ZXingReader = any;

type Match = { key: string; label: string; regex: RegExp; ref?: string };

const WATCHLIST: Match[] = [
  { key: 'gelatin', label: 'Gelatin / Gelatine', regex: /\bgelatin(e)?\b/i, ref: 'https://www.cdc.gov/ticks/alpha-gal/consumers.html' },
  { key: 'lard', label: 'Lard', regex: /\blard\b/i, ref: 'https://www.cdc.gov/ticks/alpha-gal/consumers.html' },
  { key: 'tallow', label: 'Tallow / Suet', regex: /\b(tallow|suet)\b/i, ref: 'https://www.cdc.gov/ticks/alpha-gal/consumers.html' },
  { key: 'bovine', label: 'Bovine / Beef-derived', regex: /\b(bovine|beef|ox|cow)\b/i },
  { key: 'porcine', label: 'Porcine / Pork-derived', regex: /\b(porcine|pork|swine)\b/i },
  { key: 'glycerin', label: 'Glycerin / Glycerine / Glycerol', regex: /\bglycer(ol|in|ine)\b/i },
  { key: 'magnesium-stearate', label: 'Magnesium stearate / Stearate', regex: /\b(stearate|magnesium\s+stearate|stearic\s+acid)\b/i },
  { key: 'lanolin', label: 'Lanolin', regex: /\blanolin\b/i },
];

function highlight(text: string, matches: Match[]) {
  if (!text) return null;
  let parts: React.ReactNode[] = [text];
  matches.forEach((m, idx) => {
    const next: React.ReactNode[] = [];
    parts.forEach((p, i) => {
      if (typeof p !== 'string') { next.push(p); return; }
      const pieces = p.split(m.regex);
      for (let j = 0; j < pieces.length; j++) {
        next.push(pieces[j]);
        if (j < pieces.length - 1) {
          next.push(<mark key={`${idx}-${i}-${j}`} className="bg-amber-200 px-0.5 rounded">{p.match(m.regex)?.[0] || ''}</mark>);
        }
      }
    });
    parts = next;
  });
  return <span>{parts}</span>;
}

export default function ScannerPage(){
  const [code, setCode] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [product, setProduct] = React.useState<any>(null);
  const [active, setActive] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const readerRef = React.useRef<ZXingReader | null>(null);

  const startScanner = async () => {
    if (typeof window === 'undefined') return;
    try {
      setError(null);
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
      // Stop all tracks to release camera
      const stream = videoRef.current?.srcObject as MediaStream | null;
      stream?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    } catch {}
  };

  const lookup = async (barcode: string) => {
    setLoading(true); setError(null); setProduct(null);
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

  const ingredientText: string = product?.ingredients_text || product?.ingredients_text_en || '';
  const combinedText = [
    ingredientText,
    (product?.ingredients || []).map((i: any) => i?.text).filter(Boolean).join(', '),
  ].filter(Boolean).join(', ');
  const matched = combinedText ? matchesFor(combinedText) : [];

  return (
    <Layout title="Scanner">
      <SEO />
      <div className="prose max-w-none">
        <h1>Ingredient & product scanner (beta)</h1>
        <p>
          Scan a package barcode to look up ingredients via Open Food Facts, then highlight ingredients that some alpha-gal
          patients watch. Educational use only — decisions should be individualized with your clinician.
        </p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">Scanner</div>
            {!active ? (
              <button className="btn" onClick={startScanner}>Start camera</button>
            ) : (
              <button className="btn" onClick={stopScanner}>Stop</button>
            )}
          </div>
          <div className="aspect-video bg-black/80 rounded overflow-hidden">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline/>
          </div>
          <form onSubmit={submitManual} className="mt-3 flex gap-2">
            <input className="input w-full" placeholder="Or enter barcode (8–14 digits)" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,''))} />
            <button className="btn" type="submit">Lookup</button>
          </form>
          {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          {loading && <div className="mt-2 text-sm">Looking up product…</div>}
        </div>

        <div className="card p-4">
          <div className="font-semibold mb-2">Result</div>
          {!product ? (
            <div className="text-sm text-slate-600">No product loaded yet.</div>
          ) : (
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

              {combinedText && (
                <div>
                  <div className="text-sm text-slate-600 mb-1">Ingredients</div>
                  <div className="text-sm">{highlight(combinedText, matched)}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-slate-600 mb-1">Watchlist matches</div>
                {matched.length === 0 ? (
                  <div className="text-sm text-slate-600">No watchlist ingredients detected. Always verify with your clinician.</div>
                ) : (
                  <ul className="text-sm list-disc pl-5">
                    {matched.map(m => (
                      <li key={m.key}>
                        <span className="font-medium">{m.label}</span>
                        {m.ref ? (
                          <>
                            {' '}· <a href={m.ref} target="_blank" rel="noreferrer" className="underline">source</a>
                          </>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-2 p-2 rounded bg-amber-50 text-amber-900 border border-amber-200 text-xs">
                Not medical advice. Some excipients are from plant/microbial sources and may be tolerated; management should be clinician-guided.
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="prose max-w-none mt-8">
        <h3>How it works</h3>
        <ul>
          <li>Barcodes are read locally on your device using the camera (ZXing).</li>
          <li>We query the Open Food Facts public API for product data and ingredients.</li>
          <li>We highlight ingredients commonly watched by some people with alpha-gal syndrome.</li>
        </ul>
        <p>
          References: <a href="https://www.cdc.gov/ticks/alpha-gal/consumers.html" target="_blank" rel="noreferrer">CDC products that may contain alpha-gal</a>,{' '}
          <a href="https://www.aaaai.org/tools-for-the-public/conditions-library/allergies/alpha-gal-syndrome" target="_blank" rel="noreferrer">AAAAI: Alpha-gal syndrome</a>.
        </p>
      </div>
    </Layout>
  );
}

