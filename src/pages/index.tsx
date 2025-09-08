import React from 'react';import Layout from '../components/Layout';import HeatMap from '../components/HeatMap';
export default function HomePage(){return(<Layout title='Lone Star Tick Heat Map'>
 <div className='space-y-6'>
  <section className='card'><h1 className='text-2xl font-bold mb-2'>Alpha-gal Syndrome (AGS): Map & Resources</h1>
  <p>Explore current distribution signals of the lone star tick and learn how to prevent bites, avoid triggers, and find qualified care. Community features coming soon.</p></section>
  <HeatMap/>
  <section className='card'><h2 className='text-xl font-semibold mb-2'>Quick Links</h2><ul className='list-disc ml-6'>
   <li><a href='/learn/what-is-alpha-gal'>What is alpha-gal?</a></li>
   <li><a href='/downloads'>Wallet & dining cards</a></li>
   <li><a href='/privacy'>Privacy & data handling</a></li>
  </ul></section>
 </div></Layout>)}