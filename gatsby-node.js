const fs = require("fs");
const path = require("path");

exports.onPostBuild = async ({ reporter }) => {
  const publicDir = path.join(__dirname, "public");
  const sitemapIndexPath = path.join(publicDir, "sitemap-index.xml");
  const targetPath = path.join(publicDir, "sitemap.xml");

  if (!fs.existsSync(sitemapIndexPath)) {
    reporter.warn(`gatsby-plugin-sitemap did not generate sitemap-index.xml; skipping sitemap.xml copy.`);
    return;
  }

  try {
    if (fs.existsSync(targetPath)) {
      const stat = fs.statSync(targetPath);
      if (stat.isDirectory()) {
        fs.rmSync(targetPath, { recursive: true, force: true });
      }
    }
    fs.copyFileSync(sitemapIndexPath, targetPath);
    reporter.info(`Copied sitemap-index.xml to sitemap.xml for Search Console.`);
  } catch (error) {
    reporter.warn(`Unable to copy sitemap-index.xml to sitemap.xml: ${error.message}`);
  }
};
