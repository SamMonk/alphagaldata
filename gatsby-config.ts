import type { GatsbyConfig } from "gatsby";
const siteUrl = process.env.SITE_URL || "http://localhost:8000";
const config: GatsbyConfig = {
  siteMetadata: { title: `AlphaGalData`, siteUrl, description: `Evidence-based resources, maps, and tools for the alpha-gal community.` },
  plugins: [`gatsby-plugin-postcss`, `gatsby-plugin-sitemap`, {resolve:`gatsby-plugin-robots-txt`,options:{policy:[{userAgent:`*`,allow:`/`}]}},
    {resolve:`gatsby-plugin-mdx`,options:{extensions:[`.mdx`,`.md`]}}, {resolve:`gatsby-source-filesystem`,options:{name:`content`,path:`${__dirname}/src/pages`}}]};
export default config;
