import type { GatsbyConfig } from "gatsby";
const siteUrl = (process.env.SITE_URL || "https://alphagaldata.com").replace(/\/+$/, "");

const plugins: any[] = [
  `gatsby-plugin-postcss`,
  {
    resolve: `gatsby-plugin-sitemap`,
    options: {
      createLinkInHead: true,
    },
  },
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
  {
    resolve: `gatsby-plugin-s3`,
    options: {
      bucketName: process.env.S3_BUCKET || `alphagal`,
      region: process.env.S3_REGION || process.env.AWS_REGION || `us-east-1`,
      protocol: `https`,
      hostname: process.env.DEPLOY_HOSTNAME || `alphagaldata.com`,
      generateRedirectObjectsForPermanentRedirects: true,
      // Align S3 object Cache-Control with our deploy script
      params: {
        "**/*.html": { CacheControl: "public, max-age=0, must-revalidate" },
        "**/*.{js,css,svg,png,jpg,jpeg,webp,avif,woff,woff2,ttf,eot}": { CacheControl: "public, max-age=31536000, immutable" },
        "static/**": { CacheControl: "public, max-age=31536000, immutable" }
      }
    }
  }
];

// Only enable the offline plugin in production to avoid dev SW conflicts
if (process.env.NODE_ENV === 'production') {
  plugins.push(`gatsby-plugin-offline`);
}

const config: GatsbyConfig = {
  siteMetadata: { title: `AlphaGalData`, siteUrl, description: `Evidence-based resources, maps, and tools for the alpha-gal community.` },
  plugins,
};

export default config;
