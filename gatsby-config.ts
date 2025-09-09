import type { GatsbyConfig } from "gatsby";
const siteUrl = process.env.SITE_URL || "http://localhost:8000";
const config: GatsbyConfig = {
  siteMetadata: { title: `AlphaGalData`, siteUrl, description: `Evidence-based resources, maps, and tools for the alpha-gal community.` },
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sitemap`,
    { resolve: `gatsby-plugin-robots-txt`, options: { policy: [{ userAgent: `*`, allow: `/` }] } },
    { resolve: `gatsby-plugin-mdx`, options: { extensions: [`.mdx`, `.md`] } },
    { resolve: `gatsby-source-filesystem`, options: { name: `content`, path: `${__dirname}/src/pages` } },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `AlphaGalData`,
        short_name: `AlphaGalData`,
        start_url: `/`,
        background_color: `#0f766e`,
        theme_color: `#0f766e`,
        display: `standalone`,
        icon: `static/favicon.svg`,
        icon_options: { purpose: `any maskable` },
      },
    },
    // Keep offline plugin after manifest
    `gatsby-plugin-offline`,
  ],
};
export default config;
