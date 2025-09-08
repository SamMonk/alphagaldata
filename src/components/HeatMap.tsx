import React,{useEffect,useState} from 'react';

export default function HeatMap(){
 const [ClientMap,setClientMap]=useState<React.FC|null>(null);
 useEffect(()=>{(async()=>{
  const L = (await import('leaflet')).default;
  const RL:any=await import('react-leaflet');
  const {MapContainer,TileLayer,GeoJSON,useMap,ZoomControl} = RL;

  // Try runtime dataset from /data/ to avoid bundling large JSON; fall back to sample
  let data:any = null;
  try {
    const res = await fetch('/data/lone_star_ticks.geojson', { cache: 'no-store' });
    if (res.ok) data = await res.json();
  } catch {}
  if (!data) {
    data = (await import('../data/lone_star_ticks.sample.json')).default;
  }

  const MapInner:React.FC=()=>{const map=useMap();map.fitBounds([[24.396308,-124.848974],[49.384358,-66.885444]]);return null;};

  const colorFor = (status?: string|null) => {
    const s = (status||'').toLowerCase();
    if (s.includes('establish')) return '#0f766e'; // teal
    if (s.includes('report')) return '#f59e0b';    // amber
    if (s.includes('no record')) return '#94a3b8'; // slate-400
    return '#64748b';                               // slate-500 unknown
  };

  const Comp:React.FC = () => {
    const [selected, setSelected] = React.useState<any|null>(null);
    const [filters, setFilters] = React.useState({ established: true, reported: true, noRecords: false, unknown: false });
    const canonical = (status?: string|null) => {
      const s = (status||'').toLowerCase();
      if (s.includes('establish')) return 'established';
      if (s.includes('report')) return 'reported';
      if (s.includes('no record')) return 'noRecords';
      return 'unknown';
    };
    const counts = React.useMemo(() => {
      const c = { established:0, reported:0, noRecords:0, unknown:0 } as any;
      try {
        for (const f of (data?.features||[])) c[canonical(f?.properties?.status)]++;
      } catch {}
      return c;
    }, []);
    const selectedId = selected?.GEOID || null;
    const onEachFeature = (feature:any, layer:any) => {
      layer.on({
        click: () => {
          const props = feature?.properties || {};
          setSelected({ ...props });
        },
        mouseover: () => {
          try { layer.setStyle({ weight: 1.5 }); } catch {}
        },
        mouseout: () => {
          try { layer.setStyle({ weight: 0.5 }); } catch {}
        }
      });
    };
    const style = (feature:any) => {
      const id = feature?.properties?.GEOID;
      const base = { color: colorFor(feature?.properties?.status), weight: 0.5, fillOpacity: 0.35 } as any;
      if (selectedId && id === selectedId) {
        base.weight = 2.0; base.fillOpacity = 0.5;
      }
      return base;
    };
    const filter = (feature:any) => {
      const k = canonical(feature?.properties?.status);
      return (filters as any)[k] === true;
    };

    const InfoPanel = () => (
      <div className="absolute top-3 left-3 z-[1000] max-w-sm">
        <div className="bg-white/95 backdrop-blur rounded-lg shadow p-3 text-sm">
          {!selected ? (
            <div>
              <div className="font-semibold mb-1">County Info</div>
              <div>Click a county to view details.</div>
            </div>
          ) : (
            <div>
              <div className="font-semibold mb-1">{selected.county || 'County'}, {selected.state || ''}</div>
              <div><span className="text-slate-500">Status:</span> {selected.status || 'Unknown'}</div>
              {selected.source ? (<div><span className="text-slate-500">Source:</span> {String(selected.source)}</div>) : null}
              {selected.GEOID ? (<div className="text-slate-500">FIPS: {selected.GEOID}</div>) : null}
              <div className="mt-2 flex gap-2">
                <button className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200" onClick={()=>setSelected(null)}>Clear</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );

    const LegendPanel = () => (
      <div className="absolute top-3 right-3 z-[1000] max-w-sm">
        <div className="bg-white/95 backdrop-blur rounded-lg shadow p-3 text-sm">
          <div className="font-semibold mb-2">Legend & Filters</div>
          <div className="space-y-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.established} onChange={e=>setFilters(v=>({...v, established:e.target.checked}))} />
              <span className="inline-flex items-center gap-2"><span style={{background:'#0f766e', width:12, height:12, display:'inline-block', borderRadius:2}}/> Established ({counts.established})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.reported} onChange={e=>setFilters(v=>({...v, reported:e.target.checked}))} />
              <span className="inline-flex items-center gap-2"><span style={{background:'#f59e0b', width:12, height:12, display:'inline-block', borderRadius:2}}/> Reported ({counts.reported})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.noRecords} onChange={e=>setFilters(v=>({...v, noRecords:e.target.checked}))} />
              <span className="inline-flex items-center gap-2"><span style={{background:'#94a3b8', width:12, height:12, display:'inline-block', borderRadius:2}}/> No records ({counts.noRecords})</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={filters.unknown} onChange={e=>setFilters(v=>({...v, unknown:e.target.checked}))} />
              <span className="inline-flex items-center gap-2"><span style={{background:'#64748b', width:12, height:12, display:'inline-block', borderRadius:2}}/> Unknown ({counts.unknown})</span>
            </label>
          </div>
        </div>
      </div>
    );

    return (
      <div style={{ position:'relative' }}>
        <InfoPanel />
        <LegendPanel />
        <MapContainer style={{height:'70vh',width:'100%'}} zoom={4} center={[37.8,-96]} zoomControl={false}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
          <GeoJSON data={data} style={style} filter={filter} onEachFeature={onEachFeature}
            pointToLayer={(_feature:any, latlng:any) => L.circleMarker(latlng, { radius:4, color:'#0f766e', fillColor:'#0f766e', fillOpacity:0.65, weight:0 })}
          />
          <ZoomControl position="bottomright" />
          <MapInner/>
        </MapContainer>
      </div>
    );
  };
  setClientMap(()=>Comp);
 })();},[]);

 if(!ClientMap) return <div className='card'>Loading map…</div>;
 const C:any=ClientMap;return <div className='card'><C/></div>;
}
