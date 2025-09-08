import React,{useEffect,useState} from 'react';

export default function HeatMap(){
 const [ClientMap,setClientMap]=useState<React.FC|null>(null);
 useEffect(()=>{(async()=>{
  const L = (await import('leaflet')).default;
  const RL:any=await import('react-leaflet');
  const {MapContainer,TileLayer,GeoJSON,useMap} = RL;

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
    if (s.includes('establish')) return '#0f766e';
    if (s.includes('report')) return '#f59e0b';
    if (s.includes('no record')) return '#94a3b8';
    return '#64748b';
  };

  const Comp:React.FC = () => (
    <MapContainer style={{height:'70vh',width:'100%'}} zoom={4} center={[37.8,-96]}>
      <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
      <GeoJSON
        data={data}
        style={(feature:any) => ({ color: colorFor(feature?.properties?.status), weight:0.5, fillOpacity:0.35 })}
        pointToLayer={(_feature:any, latlng:any) => L.circleMarker(latlng, { radius:4, color:'#0f766e', fillColor:'#0f766e', fillOpacity:0.65, weight:0 })}
      />
      <MapInner/>
    </MapContainer>
  );
  setClientMap(()=>Comp);
 })();},[]);

 if(!ClientMap) return <div className='card'>Loading map…</div>;
 const C:any=ClientMap;return <div className='card'><C/></div>;
}
