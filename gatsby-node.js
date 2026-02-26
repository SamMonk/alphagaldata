const fs = require("fs");
const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const template = path.resolve(__dirname, 'src/templates/learn-article.tsx');

  const result = await graphql(`
    {
      allMdx(filter: { internal: { contentFilePath: { regex: "/content/" } } }) {
        nodes {
          id
          frontmatter {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error loading MDX content', result.errors);
    return;
  }

  const nodes = result.data?.allMdx?.nodes || [];

  nodes.forEach((node) => {
    const slug = node.frontmatter?.slug || `/content/${node.id}`;
    createPage({
      path: slug,
      component: `${template}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
      },
    });
  });
};

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
