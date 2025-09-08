
// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": preferDefault(require("/home/shawnmonk/monk/alphagaldata/.cache/dev-404-page.js")),
  "component---src-pages-downloads-tsx": preferDefault(require("/home/shawnmonk/monk/alphagaldata/src/pages/downloads.tsx")),
  "component---src-pages-index-tsx": preferDefault(require("/home/shawnmonk/monk/alphagaldata/src/pages/index.tsx")),
  "component---src-pages-learn-what-is-alpha-gal-mdx": preferDefault(require("/home/shawnmonk/monk/alphagaldata/src/pages/learn/what-is-alpha-gal.mdx")),
  "component---src-pages-privacy-tsx": preferDefault(require("/home/shawnmonk/monk/alphagaldata/src/pages/privacy.tsx"))
}

