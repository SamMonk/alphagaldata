import React from "react";import { Helmet } from "react-helmet";import SEO from "./SEO";import CookieConsent from "./CookieConsent";
export default function Layout({ title, children }:{title?:string;children:React.ReactNode}){
 const fullTitle = title ? `${title} • AlphaGalData` : "AlphaGalData";
 return(<div className="min-h-screen bg-slate-50">
  <Helmet><title>{fullTitle}</title></Helmet>
  <div className="bg-amber-50 text-amber-900 text-xs border-b border-amber-200">
   <div className="container py-1">
    Some links are affiliate. <a href="/disclosure" className="underline">Disclosure</a>.
   </div>
  </div>
  <header className="bg-white/90 backdrop-blur sticky top-0 z-10 border-b">
   <div className="container flex items-center justify-between py-3">
    <a href="/" className="font-bold text-lg text-teal-800">AlphaGalData</a>
    <nav className="space-x-4 flex items-center">
      <a href="/testing">Testing</a>
      <a href="/scanner">Scanner</a>
      <div className="relative group inline-block">
        <a href="/learn" className="inline-flex items-center">Learn</a>
        <div className="absolute left-0 mt-2 hidden group-hover:block bg-white border rounded shadow text-sm min-w-[220px] p-2">
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/alpha-gal-101">Alpha-gal 101</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/symptoms-and-diagnosis">Symptoms & Diagnosis</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/treatment-and-management">Treatment & Management</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/prevention">Prevention</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/wallet-card-guide">Wallet Card Guide</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/dining-card-guide">Dining Card Guide</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/printing-alpha-gal-cards">Print the Cards</a>
          <a className="block px-3 py-1 hover:bg-slate-50 rounded" href="/learn/faq">FAQ</a>
        </div>
      </div>
      <a href="/downloads">Downloads</a>
      <a href="/privacy">Privacy</a>
    </nav>
   </div></header>
  <main className="container py-8">{children}</main>
  <footer className="mt-16 border-t"><div className="container py-6 text-sm text-slate-600">© {new Date().getFullYear()} AlphaGalData • Educational only, not medical advice.</div></footer>
  <footer className="border-t"><div className="container pb-8 text-xs text-slate-500 space-x-4"><a href="/about">About</a><a href="/ads-and-cookies">Ads & Cookies</a><a href="/terms">Terms</a></div></footer>
  <SEO/>
  <CookieConsent/>
 </div>);}
