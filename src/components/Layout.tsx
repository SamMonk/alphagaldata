import React from "react";
import { Helmet } from "react-helmet";
import CookieConsent from "./CookieConsent";
import SEO from "./SEO";

type LayoutProps = {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  children: React.ReactNode;
};

const primaryNavigation = [
  { href: "/recipes", label: "What can I eat?" },
  { href: "/scanner", label: "Check ingredients" },
  { href: "/learn", label: "Learn to stay safe" },
  { href: "/downloads", label: "Dining cards & prep" },
];

const secondaryNavigation = [
  { href: "/testing", label: "Testing guide" },
  { href: "/heat-map", label: "Tick heat map" },
];

const footerNavigation = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/ads-and-cookies", label: "Ads & Cookies" },
  { href: "/terms", label: "Terms" },
  { href: "/disclosure", label: "Disclosure" },
];

const allNavigation = [...primaryNavigation, ...secondaryNavigation];

function NavLink({
  href,
  label,
  emphasis = "secondary",
}: {
  href: string;
  label: string;
  emphasis?: "primary" | "secondary";
}) {
  const className =
    emphasis === "primary"
      ? "inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 transition hover:border-emerald-300 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      : "inline-flex rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-white hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700";

  return (
    <a className={className} href={href}>
      {label}
    </a>
  );
}

export default function Layout({
  title,
  description,
  image,
  noindex,
  children,
}: LayoutProps) {
  const fullTitle = title ? `${title} • AlphaGalData` : "AlphaGalData";

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <Helmet>
        <title>{fullTitle}</title>
      </Helmet>

      <a
        className="sr-only absolute left-4 top-4 z-50 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow focus:not-sr-only focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-emerald-700"
        href="#main-content"
      >
        Skip to main content
      </a>

      <div className="border-b border-amber-200 bg-amber-50 text-xs text-amber-950">
        <div className="container flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p>Some links are affiliate-supported.</p>
          <a
            className="font-semibold underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
            href="/disclosure"
          >
            Read the disclosure
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="container py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="max-w-md">
              <a
                className="inline-flex items-center text-lg font-bold tracking-tight text-emerald-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                href="/"
              >
                AlphaGalData
              </a>
              <p className="mt-1 text-sm text-slate-600">
                Trusted recipes, ingredient guidance, and preparedness tools for
                everyday decisions.
              </p>
            </div>

            <nav
              aria-label="Primary"
              className="hidden items-center gap-2 lg:flex"
            >
              {primaryNavigation.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  emphasis="primary"
                />
              ))}
            </nav>

            <details className="w-full max-w-xs lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-center rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-stone-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">
                Menu
              </summary>
              <nav
                aria-label="Mobile primary"
                className="mt-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-lg"
              >
                <p className="px-2 pb-3 text-sm text-slate-600">
                  Start with food, ingredient checks, or preparedness support.
                </p>
                <div className="flex flex-col gap-2">
                  {allNavigation.map((item, index) => (
                    <a
                      key={item.href}
                      className={`rounded-xl px-3 py-3 text-sm font-medium text-slate-900 transition hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
                        index < primaryNavigation.length
                          ? "border border-emerald-200 bg-emerald-50"
                          : "border border-stone-200 bg-white"
                      }`}
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </nav>
            </details>
          </div>

          <div className="mt-4 hidden items-center justify-between gap-4 border-t border-stone-200 pt-4 lg:flex">
            <nav
              aria-label="Secondary"
              className="flex flex-wrap items-center gap-2"
            >
              {secondaryNavigation.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                />
              ))}
            </nav>
            <p className="max-w-xl text-right text-sm text-slate-600">
              Conservative educational guidance for recipes, ingredient
              decisions, and preparedness. Not medical advice.
            </p>
          </div>
        </div>
      </header>

      <div className="border-b border-emerald-100 bg-emerald-50/80">
        <div className="container flex flex-col gap-2 py-3 text-sm text-emerald-950 md:flex-row md:items-center md:justify-between">
          <p className="font-medium">
            Conservative guidance for real-life decisions.
          </p>
          <p className="text-emerald-900/90">
            Educational support only. Use these tools to prepare, ask better
            questions, and choose safer next steps.
          </p>
        </div>
      </div>

      <main className="container py-8" id="main-content" tabIndex={-1}>
        {children}
      </main>

      <footer className="mt-16 border-t border-stone-200 bg-white">
        <div className="container grid gap-8 py-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold text-emerald-900">
              AlphaGalData
            </p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Food-first support for alpha-gal households, with clear ingredient
              guidance and practical preparedness resources.
            </p>
            <p className="mt-4 text-sm text-slate-700">
              Educational only. AlphaGalData does not diagnose, treat, or
              replace clinician guidance.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              Start here
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {primaryNavigation.map((item) => (
                <li key={item.href}>
                  <a
                    className="font-medium text-slate-800 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
              More
            </h2>
            <ul className="mt-4 space-y-3 text-sm">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <a
                    className="text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                    href={item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-200">
          <div className="container flex flex-col gap-2 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>© {new Date().getFullYear()} AlphaGalData</p>
            <p>Public guides and tools stay available without an account.</p>
          </div>
        </div>
      </footer>

      <SEO description={description} image={image} title={fullTitle} noindex={noindex} />
      <CookieConsent />
    </div>
  );
}
