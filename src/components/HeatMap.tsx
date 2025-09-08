import React,{useEffect,useState} from 'react';
export default function HeatMap(){
 const [ClientMap,setClientMap]=useState<React.FC|null>(null);
 useEffect(()=>{(async()=>{await import('leaflet');const RL:any=await import('react-leaflet');const {MapContainer,TileLayer,GeoJSON,useMap}=RL;
 const data=await import('../data/lone_star_ticks.sample.json');
 const MapInner:React.FC=()=>{const map=useMap();map.fitBounds([[24.396308,-124.848974],[49.384358,-66.885444]]);return null;};
 const Comp:React.FC=()=>(<MapContainer style={{height:'70vh',width:'100%'}} zoom={4} center={[37.8,-96]}>
  <TileLayer attribution='&copy; OpenStreetMap contributors' url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'/>
  <GeoJSON data={(data as any).default} style={()=>({color:'#0f766e',weight:0.5,fillOpacity:0.35})}/>
  <MapInner/></MapContainer>);
 setClientMap(()=>Comp);})();},[]);
 if(!ClientMap) return <div className='card'>Loading map…</div>;
 const C:any=ClientMap;return <div className='card'><C/></div>;
}