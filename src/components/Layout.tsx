import React from "react";import { Helmet } from "react-helmet";import SEO from "./SEO";
export default function Layout({ title, children }:{title?:string;children:React.ReactNode}){
 const fullTitle = title ? `${title} • AlphaGalData` : "AlphaGalData";
 return(<div className="min-h-screen bg-slate-50">
  <Helmet><title>{fullTitle}</title></Helmet>
  <header className="bg-white/90 backdrop-blur sticky top-0 z-10 border-b">
   <div className="container flex items-center justify-between py-3">
    <a href="/" className="font-bold text-lg text-teal-800">AlphaGalData</a>
    <nav className="space-x-4"><a href="/testing">Testing</a><a href="/scanner">Scanner</a><a href="/learn/what-is-alpha-gal">Learn</a><a href="/downloads">Downloads</a><a href="/privacy">Privacy</a></nav>
   </div></header>
  <main className="container py-8">{children}</main>
  <footer className="mt-16 border-t"><div className="container py-6 text-sm text-slate-600">© {new Date().getFullYear()} AlphaGalData • Educational only, not medical advice.</div></footer>
  <SEO/></div>);}
