import React, { useEffect, useState, useCallback, useRef } from 'react';
import timelineData from '../data/ags-timeline.json';

const YEARS = Object.keys(timelineData.stateAwareness.data)
  .map(Number)
  .sort((a, b) => a - b);
const MIN_YEAR = YEARS[0];
const MAX_YEAR = YEARS[YEARS.length - 1];

// Color scale: 0 = gray, 100 = deep red-orange
function awarenessColor(value: number): string {
  if (!value || value <= 0) return '#e2e8f0'; // slate-200
  if (value < 10) return '#fef3c7';  // amber-100
  if (value < 25) return '#fde68a';  // amber-200
  if (value < 40) return '#fbbf24';  // amber-400
  if (value < 55) return '#f59e0b';  // amber-500
  if (value < 70) return '#d97706';  // amber-600
  if (value < 85) return '#b45309';  // amber-700
  return '#92400e';                   // amber-800
}

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K';
  return String(n);
}

function getCaseData(year: number) {
  const entries = timelineData.nationalCaseCounts.data;
  return entries.find(e => e.year === year) || null;
}

function getMilestone(year: number) {
  return timelineData.milestones.find(m => m.year === year) || null;
}

export default function TimelineMap() {
  const [ClientMap, setClientMap] = useState<React.FC | null>(null);

  useEffect(() => {
    (async () => {
      const L = (await import('leaflet')).default;
      const RL: any = await import('react-leaflet');
      const { MapContainer, TileLayer, GeoJSON, ZoomControl } = RL;

      // Load state boundaries
      const statesGeo = (await import('../data/us_states.json')).default as any;

      // Try loading county tick data
      let tickData: any = null;
      try {
        const res = await fetch('/data/lone_star_ticks.geojson', { cache: 'no-store' });
        if (res.ok) tickData = await res.json();
      } catch {}

      const Comp: React.FC = () => {
        const [year, setYear] = useState(MAX_YEAR);
        const [playing, setPlaying] = useState(false);
        const [showTicks, setShowTicks] = useState(false);
        const [hoveredState, setHoveredState] = useState<any>(null);
        const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
        const geoJsonRef = useRef<any>(null);

        const yearData = (timelineData.stateAwareness.data as any)[String(year)] || {};
        const caseData = getCaseData(year);
        const milestone = getMilestone(year);

        // Cumulative cases up to this year
        const cumulativeCases = timelineData.nationalCaseCounts.data
          .filter(e => e.year <= year)
          .reduce((sum, e) => sum + e.cases, 0);

        // Play/pause animation
        const togglePlay = useCallback(() => {
          if (playing) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = null;
            setPlaying(false);
          } else {
            setPlaying(true);
            setYear(prev => (prev >= MAX_YEAR ? MIN_YEAR : prev));
          }
        }, [playing]);

        useEffect(() => {
          if (!playing) return;
          intervalRef.current = setInterval(() => {
            setYear(prev => {
              if (prev >= MAX_YEAR) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                intervalRef.current = null;
                setPlaying(false);
                return MAX_YEAR;
              }
              return prev + 1;
            });
          }, 1200);
          return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
          };
        }, [playing]);

        // Update styles when year changes without re-mounting GeoJSON
        useEffect(() => {
          if (!geoJsonRef.current) return;
          const layer = geoJsonRef.current;
          layer.eachLayer((l: any) => {
            const abbr = l.feature?.properties?.abbr;
            const val = yearData[abbr] || 0;
            l.setStyle({
              fillColor: awarenessColor(val),
              fillOpacity: val > 0 ? 0.7 : 0.2,
              color: '#475569',
              weight: 1,
            });
          });
        }, [year, yearData]);

        const statesWithData = Object.keys(yearData).length;

        const style = (feature: any) => {
          const abbr = feature?.properties?.abbr;
          const val = yearData[abbr] || 0;
          return {
            fillColor: awarenessColor(val),
            fillOpacity: val > 0 ? 0.7 : 0.2,
            color: '#475569',
            weight: 1,
          };
        };

        const onEachFeature = (feature: any, layer: any) => {
          layer.on({
            mouseover: () => {
              const abbr = feature?.properties?.abbr;
              const val = yearData[abbr] || 0;
              setHoveredState({
                name: feature?.properties?.name,
                abbr,
                value: val,
              });
              layer.setStyle({ weight: 2.5, color: '#1e293b' });
            },
            mouseout: () => {
              setHoveredState(null);
              layer.setStyle({ weight: 1, color: '#475569' });
            },
          });
        };

        const tickColorFor = (status?: string | null) => {
          const s = (status || '').toLowerCase();
          if (s.includes('establish')) return '#0f766e';
          if (s.includes('report')) return '#f59e0b';
          return '#94a3b8';
        };

        const tickStyle = (feature: any) => ({
          color: tickColorFor(feature?.properties?.status),
          weight: 0.3,
          fillOpacity: 0.3,
        });

        return (
          <div>
            {/* Year display + case counter */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-slate-900 tabular-nums">{year}</span>
                {milestone && (
                  <span className="text-sm text-slate-600 max-w-md">{milestone.text}</span>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Suspected cases this year</div>
                <div className="text-2xl font-bold text-amber-700 tabular-nums">
                  {caseData ? '~' + formatNumber(caseData.cases) : '—'}
                </div>
                <div className="text-xs text-slate-400">
                  ~{formatNumber(cumulativeCases)} cumulative since 2009
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-lg bg-teal-700 text-white font-medium hover:bg-teal-800 transition-colors text-sm"
              >
                {playing ? 'Pause' : year >= MAX_YEAR ? 'Replay' : 'Play'}
              </button>
              <input
                type="range"
                min={MIN_YEAR}
                max={MAX_YEAR}
                value={year}
                onChange={e => {
                  setYear(Number(e.target.value));
                  if (playing) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    intervalRef.current = null;
                    setPlaying(false);
                  }
                }}
                className="flex-1 min-w-[200px] accent-teal-700"
              />
              <span className="text-sm text-slate-500 tabular-nums w-24 text-right">
                {statesWithData} state{statesWithData !== 1 ? 's' : ''} affected
              </span>
            </div>

            {/* Tick layer toggle */}
            {tickData && (
              <label className="flex items-center gap-2 mb-4 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTicks}
                  onChange={e => setShowTicks(e.target.checked)}
                />
                Show CDC lone star tick surveillance overlay (county-level)
              </label>
            )}

            {/* Map */}
            <div style={{ position: 'relative' }}>
              {/* Hover info */}
              {hoveredState && (
                <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow p-3 text-sm pointer-events-none">
                  <div className="font-semibold">{hoveredState.name}</div>
                  <div>
                    Awareness index:{' '}
                    <span className="font-medium">
                      {hoveredState.value > 0 ? hoveredState.value : 'No data'}
                    </span>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow p-3 text-sm">
                <div className="font-semibold mb-2">Alpha-gal awareness</div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-500">Low</span>
                  {[
                    '#fef3c7', '#fde68a', '#fbbf24', '#f59e0b',
                    '#d97706', '#b45309', '#92400e',
                  ].map(c => (
                    <span
                      key={c}
                      style={{ background: c, width: 18, height: 14, display: 'inline-block' }}
                    />
                  ))}
                  <span className="text-xs text-slate-500">High</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Based on search interest &amp; diagnosis rates
                </div>
                {showTicks && (
                  <div className="mt-2 pt-2 border-t">
                    <div className="font-semibold mb-1">Tick surveillance</div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#0f766e', width: 12, height: 12, display: 'inline-block', borderRadius: 2 }} />
                      <span>Established</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: '#f59e0b', width: 12, height: 12, display: 'inline-block', borderRadius: 2 }} />
                      <span>Reported</span>
                    </div>
                  </div>
                )}
              </div>

              <MapContainer
                style={{ height: '70vh', width: '100%', borderRadius: '0.5rem' }}
                zoom={4}
                center={[37.8, -96]}
                zoomControl={false}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
                />
                {/* Tick county layer (behind states) */}
                {showTicks && tickData && (
                  <GeoJSON data={tickData} style={tickStyle} />
                )}
                {/* State awareness layer */}
                <GeoJSON
                  ref={geoJsonRef}
                  data={statesGeo}
                  style={style}
                  onEachFeature={onEachFeature}
                />
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
                  pane="shadowPane"
                />
                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>

            {/* Case count chart (sparkline bar chart) */}
            <div className="mt-6">
              <h3 className="font-semibold text-sm text-slate-700 mb-2">
                Suspected AGS cases per year
              </h3>
              <div className="flex items-end gap-[2px] h-24">
                {timelineData.nationalCaseCounts.data.map(entry => {
                  const maxCases = Math.max(
                    ...timelineData.nationalCaseCounts.data.map(e => e.cases)
                  );
                  const pct = (entry.cases / maxCases) * 100;
                  const isActive = entry.year === year;
                  return (
                    <button
                      key={entry.year}
                      onClick={() => setYear(entry.year)}
                      className="flex-1 relative group"
                      style={{ height: '100%' }}
                      title={`${entry.year}: ~${formatNumber(entry.cases)} cases`}
                    >
                      <div
                        className={`absolute bottom-0 left-0 right-0 rounded-t transition-colors ${
                          isActive ? 'bg-amber-600' : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                        style={{ height: `${Math.max(pct, 2)}%` }}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>2009</span>
                <span>2025</span>
              </div>
            </div>
          </div>
        );
      };

      setClientMap(() => Comp);
    })();
  }, []);

  if (!ClientMap) return <div className="card p-8 text-center text-slate-500">Loading map...</div>;
  const C: any = ClientMap;
  return <C />;
}
