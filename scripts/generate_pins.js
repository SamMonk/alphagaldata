/**
 * Generates Pinterest-optimized pin images (1000x1500) for alphagaldata content.
 * Infographic style with SVG icons, colored panels, and strong visual hierarchy.
 *
 * Usage: node scripts/generate_pins.js
 * Output: static/pins/*.png
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'static', 'pins');
const WIDTH = 1000;
const HEIGHT = 1500;

// Brand colors
const TEAL = '#0f766e';
const TEAL_DARK = '#065f5b';
const TEAL_LIGHT = '#ccfbf1';
const TEAL_MID = '#99f6e4';
const AMBER = '#92400e';
const AMBER_DARK = '#78350f';
const AMBER_LIGHT = '#fef3c7';
const AMBER_MID = '#fde68a';
const RED = '#dc2626';
const RED_LIGHT = '#fef2f2';
const SLATE = '#1e293b';
const SLATE_600 = '#475569';
const WHITE = '#ffffff';
const GRAY_50 = '#f8fafc';
const GRAY_100 = '#f1f5f9';

// ── SVG Icon paths (24x24 viewBox) ────────────────────────────────────────
const ICONS = {
  // Bug/tick icon
  tick: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 5c.55 0 1 .45 1 1v1c1.66.27 3 1.6 3 3.27 0 1.07-.83 2.08-2 2.48v1.75c0 .41-.34.75-.75.75h-.5c-.41 0-.75-.34-.75-.75v-1.75c-1.17-.4-2-1.41-2-2.48 0-1.67 1.34-3 3-3.27V8c0-.55.45-1 1-1zm-2 7.5a2 2 0 104 0 2 2 0 00-4 0z" fill="currentColor"/>`,

  // Shield/protection icon
  shield: `<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" fill="currentColor"/>`,

  // Warning triangle
  warning: `<path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>`,

  // Food/utensils
  food: `<path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 000 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" fill="currentColor"/>`,

  // Checkmark circle
  check: `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/>`,

  // Medical/heart
  medical: `<path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/>`,

  // Download/arrow
  download: `<path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>`,

  // Search/scan
  scan: `<path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>`,

  // Map/location
  map: `<path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill="currentColor"/>`,

  // People/community
  people: `<path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>`,

  // Star/essentials
  star: `<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor"/>`,

  // Pill/capsule
  pill: `<path d="M4.22 11.29l5.5-5.5c1.56-1.56 4.1-1.56 5.66 0l4.24 4.24c1.56 1.56 1.56 4.1 0 5.66l-5.5 5.5c-1.56 1.56-4.1 1.56-5.66 0l-4.24-4.24c-1.56-1.56-1.56-4.1 0-5.66zm1.41 1.41l4.24 4.24 2.83-2.83-4.24-4.24-2.83 2.83z" fill="currentColor"/>`,
};

// Icon rendered at a given size inside a colored circle
function iconCircle(iconKey, cx, cy, radius, bgColor, iconColor) {
  const icon = ICONS[iconKey] || ICONS.check;
  const iconSize = radius * 1.2;
  return `
    <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${bgColor}" opacity="0.15"/>
    <circle cx="${cx}" cy="${cy}" r="${radius - 4}" fill="${bgColor}" opacity="0.08"/>
    <g transform="translate(${cx - iconSize / 2}, ${cy - iconSize / 2}) scale(${iconSize / 24})" fill="${iconColor}">
      ${icon}
    </g>
  `;
}

// Numbered bullet with colored background
function numberedBullet(num, text, x, y, accent, accentLight) {
  return `
    <circle cx="${x + 28}" cy="${y}" r="28" fill="${accent}"/>
    <text x="${x + 28}" y="${y + 10}" font-family="system-ui, -apple-system, sans-serif" font-size="28" fill="${WHITE}" font-weight="800" text-anchor="middle">${num}</text>
    <text x="${x + 72}" y="${y + 10}" font-family="system-ui, -apple-system, sans-serif" font-size="36" fill="${SLATE}" font-weight="600">${escapeXml(text)}</text>
  `;
}

const pins = [
  {
    filename: 'what-is-alpha-gal.png',
    category: 'LEARN',
    title: 'What Is\nAlpha-Gal\nSyndrome?',
    icon: 'tick',
    bullets: [
      'Triggered by lone star tick bites',
      'Delayed reactions 3-6 hours later',
      'Allergy to mammalian meat & dairy',
      'Up to 450,000 Americans affected',
    ],
    stat: { number: '450K+', label: 'Americans affected' },
    footer: 'alphagaldata.com/learn/what-is-alpha-gal',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'symptoms-diagnosis.png',
    category: 'LEARN',
    title: 'Symptoms &\nDiagnosis',
    icon: 'medical',
    bullets: [
      'GI distress, hives, swelling',
      'Reactions 3-6 hours after eating',
      'Often misdiagnosed as IBS',
      'Blood test confirms diagnosis',
    ],
    stat: { number: '60%', label: 'have GI symptoms' },
    footer: 'alphagaldata.com/learn/symptoms-and-diagnosis',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'prevention-tips.png',
    category: 'PREVENTION',
    title: 'Tick Prevention\nfor Alpha-Gal',
    icon: 'shield',
    bullets: [
      'Treat clothing with permethrin',
      'Use picaridin on exposed skin',
      'Full body tick checks daily',
      'Keep yard trimmed & treated',
    ],
    stat: null,
    footer: 'alphagaldata.com/learn/prevention',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'foods-to-avoid.png',
    category: 'DIET',
    title: 'Alpha-Gal:\nFoods to Avoid',
    icon: 'warning',
    bullets: [
      'Beef, pork, lamb, venison',
      'Dairy products (varies by person)',
      'Gelatin in vitamins & candy',
      'Hidden sources in medications',
    ],
    stat: null,
    footer: 'alphagaldata.com/learn/alpha-gal-101',
    accent: RED,
    accentDark: '#991b1b',
    accentLight: RED_LIGHT,
    accentMid: '#fecaca',
  },
  {
    filename: 'safe-foods.png',
    category: 'DIET',
    title: 'Alpha-Gal\nSafe Foods',
    icon: 'check',
    bullets: [
      'Chicken, turkey, duck',
      'All fish & seafood',
      'Fruits, vegetables, grains',
      'Oat milk, plant-based dairy',
    ],
    stat: null,
    footer: 'alphagaldata.com/recipes',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'emergency-prep.png',
    category: 'SAFETY',
    title: 'AGS Emergency\nPreparedness',
    icon: 'medical',
    bullets: [
      'Carry an EpiPen at all times',
      'Medical alert bracelet or tattoo',
      'No heparin \u2014 tell every ER',
      'Share your action plan',
    ],
    stat: null,
    footer: 'alphagaldata.com/learn/treatment-and-management',
    accent: AMBER,
    accentDark: AMBER_DARK,
    accentLight: AMBER_LIGHT,
    accentMid: AMBER_MID,
  },
  {
    filename: 'medication-safety.png',
    category: 'SAFETY',
    title: 'Medications &\nAlpha-Gal',
    icon: 'pill',
    bullets: [
      'Avoid gelatin capsules',
      'Check magnesium stearate source',
      'NO heparin (pig-derived)',
      'Ask about vaccine ingredients',
    ],
    stat: null,
    footer: 'alphagaldata.com/learn/faq',
    accent: AMBER,
    accentDark: AMBER_DARK,
    accentLight: AMBER_LIGHT,
    accentMid: AMBER_MID,
  },
  {
    filename: 'free-wallet-cards.png',
    category: 'FREE DOWNLOAD',
    title: 'Free Alpha-Gal\nWallet &\nDining Cards',
    icon: 'download',
    bullets: [
      'Show restaurants your allergy',
      'Inform ER staff quickly',
      'Print at home or at a shop',
      'Available in multiple formats',
    ],
    stat: null,
    footer: 'alphagaldata.com/downloads',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'ingredient-scanner.png',
    category: 'FREE TOOL',
    title: 'Alpha-Gal\nIngredient\nScanner',
    icon: 'scan',
    bullets: [
      'Scan labels with your phone',
      'Flags mammalian ingredients',
      'Decode barcodes instantly',
      'Built for the AGS community',
    ],
    stat: null,
    footer: 'alphagaldata.com/scanner',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'spread-timeline.png',
    category: 'DATA',
    title: 'Alpha-Gal Spread\nAcross America',
    icon: 'map',
    bullets: [
      '12 known cases in 2009',
      '450,000+ affected by 2023',
      'Interactive year-by-year map',
      'CDC tick surveillance overlay',
    ],
    stat: { number: '5,520%', label: 'increase in diagnoses\n2015\u20132025' },
    footer: 'alphagaldata.com/heat-map',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'newly-diagnosed.png',
    category: 'START HERE',
    title: 'Just Diagnosed\nwith Alpha-Gal?',
    icon: 'people',
    bullets: [
      'Find a knowledgeable allergist',
      'Read every food label',
      'Join AGS support groups',
      'Get our free wallet card',
    ],
    stat: null,
    footer: 'alphagaldata.com/learn/alpha-gal-101',
    accent: TEAL,
    accentDark: TEAL_DARK,
    accentLight: TEAL_LIGHT,
    accentMid: TEAL_MID,
  },
  {
    filename: 'recommended-products.png',
    category: 'ESSENTIALS',
    title: 'Products AGS\nPatients\nRecommend',
    icon: 'star',
    bullets: [
      'EpiPen carriers & medical alerts',
      'Permethrin & tick removal kits',
      'Dairy-free kitchen staples',
      'Gelatin-free supplements',
    ],
    stat: null,
    footer: 'alphagaldata.com/recommended',
    accent: AMBER,
    accentDark: AMBER_DARK,
    accentLight: AMBER_LIGHT,
    accentMid: AMBER_MID,
  },
];

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSvg(pin) {
  // ── Header panel with icon (top ~420px) ──────────────────────────
  const headerHeight = 420;
  const titleLines = pin.title.split('\n');
  const titleSvg = titleLines
    .map((line, i) => {
      const dy = i === 0 ? '0' : '68';
      return `<tspan x="100" dy="${dy}">${escapeXml(line)}</tspan>`;
    })
    .join('');

  // ── Stat callout (optional, sits between header and bullets) ─────
  let statSvg = '';
  let statHeight = 0;
  if (pin.stat) {
    statHeight = 140;
    const statLines = pin.stat.label.split('\n');
    const labelSvg = statLines
      .map((line, i) => {
        const dy = i === 0 ? '0' : '28';
        return `<tspan x="500" dy="${dy}">${escapeXml(line)}</tspan>`;
      })
      .join('');
    statSvg = `
      <rect y="${headerHeight}" width="${WIDTH}" height="${statHeight}" fill="${pin.accentMid}" opacity="0.4"/>
      <text x="500" y="${headerHeight + 50}" font-family="system-ui, -apple-system, sans-serif" font-size="60" fill="${pin.accentDark}" font-weight="900" text-anchor="middle">${escapeXml(pin.stat.number)}</text>
      <text x="500" y="${headerHeight + 90}" font-family="system-ui, -apple-system, sans-serif" font-size="24" fill="${SLATE_600}" font-weight="600" text-anchor="middle">
        ${labelSvg}
      </text>
    `;
  }

  // ── Bullet section ───────────────────────────────────────────────
  const bulletStart = headerHeight + statHeight + 50;
  const bulletSpacing = 110;
  const bulletsSvg = pin.bullets
    .map((text, i) => {
      const y = bulletStart + 40 + i * bulletSpacing;
      return numberedBullet(i + 1, text, 72, y, pin.accent, pin.accentLight);
    })
    .join('');

  // ── Decorative background pattern (subtle circles) ───────────────
  const patternSvg = `
    <circle cx="870" cy="80" r="180" fill="${pin.accent}" opacity="0.06"/>
    <circle cx="920" cy="200" r="100" fill="${pin.accent}" opacity="0.04"/>
    <circle cx="50" cy="1350" r="120" fill="${pin.accent}" opacity="0.04"/>
  `;

  // ── Footer ───────────────────────────────────────────────────────
  const footerHeight = 130;
  const footerY = HEIGHT - footerHeight;

  return `<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="headerGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${pin.accent}"/>
        <stop offset="100%" stop-color="${pin.accentDark}"/>
      </linearGradient>
      <linearGradient id="footerGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${pin.accentDark}"/>
        <stop offset="100%" stop-color="${pin.accent}"/>
      </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="${GRAY_50}"/>
    ${patternSvg}

    <!-- Header panel -->
    <rect width="${WIDTH}" height="${headerHeight}" fill="url(#headerGrad)"/>

    <!-- Header decorative shapes -->
    <circle cx="880" cy="60" r="200" fill="${WHITE}" opacity="0.05"/>
    <circle cx="920" cy="180" r="120" fill="${WHITE}" opacity="0.04"/>

    <!-- Icon -->
    ${iconCircle(pin.icon, 148, 90, 50, WHITE, WHITE)}

    <!-- Category badge -->
    <rect x="210" y="68" rx="16" ry="16" width="${pin.category.length * 18 + 32}" height="40" fill="${WHITE}" opacity="0.2"/>
    <text x="226" y="95" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="${WHITE}" font-weight="700" letter-spacing="2">${escapeXml(pin.category)}</text>

    <!-- Title -->
    <text x="100" y="200" font-family="system-ui, -apple-system, sans-serif" font-size="58" fill="${WHITE}" font-weight="800" line-height="1.15">
      ${titleSvg}
    </text>

    <!-- Stat callout -->
    ${statSvg}

    <!-- Section label -->
    <rect x="72" y="${bulletStart - 10}" width="4" height="36" rx="2" fill="${pin.accent}"/>
    <text x="88" y="${bulletStart + 18}" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="${SLATE_600}" font-weight="700" letter-spacing="1.5">KEY FACTS</text>

    <!-- Bullets -->
    ${bulletsSvg}

    <!-- Footer -->
    <rect y="${footerY}" width="${WIDTH}" height="${footerHeight}" fill="url(#footerGrad)"/>
    <text x="${WIDTH / 2}" y="${footerY + 55}" font-family="system-ui, -apple-system, sans-serif" font-size="36" fill="${WHITE}" font-weight="800" text-anchor="middle">AlphaGalData</text>
    <text x="${WIDTH / 2}" y="${footerY + 95}" font-family="system-ui, -apple-system, sans-serif" font-size="22" fill="${WHITE}" opacity="0.8" text-anchor="middle">${escapeXml(pin.footer)}</text>
  </svg>`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const pin of pins) {
    const svg = buildSvg(pin);
    const outPath = path.join(OUT_DIR, pin.filename);
    await sharp(Buffer.from(svg)).png({ quality: 90 }).toFile(outPath);
    console.log(`  Created ${pin.filename}`);
  }

  console.log(`\nGenerated ${pins.length} pins in ${OUT_DIR}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
