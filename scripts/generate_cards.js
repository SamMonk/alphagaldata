#!/usr/bin/env node
/*
 Generate printable Wallet and Dining cards for Alpha-gal Syndrome (AGS).
 Outputs:
  - static/downloads/ags_wallet_card_v1.pdf  (credit-card size)
  - static/downloads/ags_dining_card_v1.pdf  (4x6 in landscape)
*/

const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUT_DIR = path.join(__dirname, '..', 'static', 'downloads');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Helpers
const inch = (n) => n * 72; // PDF points per inch

// Consistent bullet layout
const BULLET_INDENT = 10; // space from left margin to icon center
const BULLET_GAP = 6;     // base gap from icon to text start

// Simple vector icons
function drawNoIcon(doc, cx, cy, r = 4, color = '#dc2626') {
  doc.save();
  doc.lineWidth(1.5).strokeColor(color).circle(cx, cy, r).stroke();
  doc.moveTo(cx - r * 0.7, cy - r * 0.7).lineTo(cx + r * 0.7, cy + r * 0.7).stroke();
  doc.restore();
}

function drawAlertTriangle(doc, x, y, size = 10) {
  const h = (Math.sqrt(3) / 2) * size; // height of equilateral triangle
  doc.save();
  doc.fillColor('#f59e0b').strokeColor('#b45309').lineWidth(1);
  doc.moveTo(x, y - h / 2)
    .lineTo(x - size / 2, y + h / 2)
    .lineTo(x + size / 2, y + h / 2)
    .lineTo(x, y - h / 2)
    .fillAndStroke();
  // Exclamation mark
  doc.fillColor('#ffffff');
  doc.rect(x - 1, y - 3, 2, 5).fill();
  doc.circle(x, y + 4, 1.2).fill();
  doc.restore();
}

function drawMedicalCross(doc, cx, cy, size = 9, color = '#0f766e') {
  const s = size / 2;
  doc.save();
  doc.fillColor(color);
  // Simple plus sign
  doc.rect(cx - s * 0.25, cy - s, s * 0.5, size).fill();
  doc.rect(cx - s, cy - s * 0.25, size, s * 0.5).fill();
  doc.restore();
}

// Additional simple medical/food icons
function drawCheck(doc, cx, cy, size = 8, color = '#16a34a') {
  doc.save();
  doc.lineWidth(1.8).strokeColor(color);
  doc.moveTo(cx - size * 0.4, cy + size * 0.05)
    .lineTo(cx - size * 0.1, cy + size * 0.35)
    .lineTo(cx + size * 0.5, cy - size * 0.35)
    .stroke();
  doc.restore();
}

function drawLeaf(doc, cx, cy, size = 10, color = '#16a34a') {
  const w = size, h = size * 0.7;
  doc.save();
  doc.fillColor(color);
  doc.moveTo(cx, cy - h / 2)
    .bezierCurveTo(cx + w / 2, cy - h / 2, cx + w / 2, cy + h / 2, cx, cy + h / 2)
    .bezierCurveTo(cx - w / 2, cy + h / 2, cx - w / 2, cy - h / 2, cx, cy - h / 2)
    .fill();
  doc.lineWidth(0.8).strokeColor('#0f5132');
  doc.moveTo(cx, cy - h / 2 + 1).lineTo(cx, cy + h / 2 - 1).stroke();
  doc.restore();
}

function drawCowHead(doc, cx, cy, size = 10, color = '#4b5563') {
  const r = size / 2;
  doc.save();
  doc.lineWidth(1).strokeColor(color);
  doc.circle(cx, cy, r * 0.85).stroke();
  doc.moveTo(cx - r * 0.9, cy - r * 0.1).lineTo(cx - r * 1.2, cy - r * 0.6).lineTo(cx - r * 0.5, cy - r * 0.6).lineTo(cx - r * 0.9, cy - r * 0.1).stroke();
  doc.moveTo(cx + r * 0.9, cy - r * 0.1).lineTo(cx + r * 1.2, cy - r * 0.6).lineTo(cx + r * 0.5, cy - r * 0.6).lineTo(cx + r * 0.9, cy - r * 0.1).stroke();
  doc.ellipse(cx, cy + r * 0.35, r * 0.55, r * 0.32).stroke();
  doc.circle(cx - r * 0.28, cy - r * 0.05, 0.7).fill(color);
  doc.circle(cx + r * 0.28, cy - r * 0.05, 0.7).fill(color);
  doc.circle(cx - r * 0.18, cy + r * 0.35, 0.7).fill(color);
  doc.circle(cx + r * 0.18, cy + r * 0.35, 0.7).fill(color);
  doc.restore();
}

function drawCheese(doc, cx, cy, size = 10, color = '#f59e0b') {
  // Wedge of cheese: triangle with a rounded back and a few holes
  const w = size, h = size * 0.7;
  const x = cx - w / 2, y = cy - h / 2;
  doc.save();
  doc.lineWidth(1).strokeColor('#b45309').fillColor(color);
  // Triangle wedge
  doc.moveTo(x, y)
    .lineTo(x + w, y + h * 0.2)
    .lineTo(x, y + h)
    .lineTo(x, y)
    .fillAndStroke();
  // Back curve accent
  doc.strokeColor('#d97706');
  doc.moveTo(x + w * 0.15, y + h * 0.1).lineTo(x + w * 0.15, y + h * 0.9).stroke();
  // Holes
  doc.fillColor('#fde68a');
  doc.circle(x + w * 0.35, y + h * 0.35, 0.9).fill();
  doc.circle(x + w * 0.5, y + h * 0.55, 0.8).fill();
  doc.circle(x + w * 0.25, y + h * 0.7, 0.7).fill();
  doc.restore();
}

function drawNoCheese(doc, cx, cy, size = 10) {
  drawCheese(doc, cx, cy, size);
  drawNoIcon(doc, cx, cy, size * 0.6);
}

function drawNoCow(doc, cx, cy, size = 10) {
  drawCowHead(doc, cx, cy, size);
  drawNoIcon(doc, cx, cy, size * 0.6);
}

function drawPill(doc, cx, cy, width = 12, height = 6, colorA = '#ef4444', colorB = '#ffffff', stroke = '#b91c1c') {
  const x = cx - width / 2;
  const y = cy - height / 2;
  const r = height / 2;
  doc.save();
  doc.roundedRect(x, y, width, height, r).clip();
  doc.rect(x, y, width / 2, height).fill(colorA);
  doc.rect(x + width / 2, y, width / 2, height).fill(colorB);
  doc.restore();
  doc.save();
  doc.lineWidth(1).strokeColor(stroke);
  doc.roundedRect(x, y, width, height, r).stroke();
  doc.restore();
}

function drawPhone(doc, cx, cy, size = 10, color = '#111827') {
  const w = size * 0.7, h = size * 1.2, r = 1.5;
  const x = cx - w / 2, y = cy - h / 2;
  doc.save();
  doc.lineWidth(1).strokeColor(color);
  doc.roundedRect(x, y, w, h, r).stroke();
  doc.moveTo(cx - 2, y + 2).lineTo(cx + 2, y + 2).stroke();
  doc.circle(cx, y + h - 3, 1).fill(color);
  doc.restore();
}

function drawAutoInjector(doc, cx, cy, length = 16, color = '#0f766e') {
  const w = 4, h = length;
  const x = cx - w / 2, y = cy - h / 2;
  doc.save();
  doc.lineWidth(1).strokeColor('#0b4f45').fillColor(color);
  doc.roundedRect(x, y + 2, w, h - 4, 1.2).fillAndStroke();
  doc.fillColor('#f59e0b');
  doc.rect(x, y, w, 3).fill();
  doc.fillColor('#1f2937');
  doc.rect(cx - 0.5, y + h - 2, 1, 2).fill();
  doc.restore();
}

function drawBandage(doc, cx, cy, size = 10, color = '#f59e0b') {
  const w = size * 1.4, h = size * 0.5, r = h / 2;
  const x = cx - w / 2, y = cy - h / 2;
  doc.save();
  doc.lineWidth(1).strokeColor('#b45309').fillColor(color);
  doc.roundedRect(x, y, w, h, r).fillAndStroke();
  const padW = w * 0.35, padH = h * 0.7;
  const px = cx - padW / 2, py = cy - padH / 2;
  doc.fillColor('#fde68a').roundedRect(px, py, padW, padH, 2).fill();
  doc.fillColor('#92400e');
  for (let i = 0; i < 3; i++) doc.circle(cx - padW / 4 + i * (padW / 4), cy, 0.6).fill();
  doc.restore();
}
function drawCheck(doc, cx, cy, size = 8, color = '#16a34a') {
  // Simple check mark
  doc.save();
  doc.lineWidth(1.8).strokeColor(color);
  doc.moveTo(cx - size * 0.4, cy + size * 0.05)
    .lineTo(cx - size * 0.1, cy + size * 0.35)
    .lineTo(cx + size * 0.5, cy - size * 0.35)
    .stroke();
  doc.restore();
}

function drawLeaf(doc, cx, cy, size = 10, color = '#16a34a') {
  // Stylized leaf using two bezier curves
  const w = size, h = size * 0.7;
  doc.save();
  doc.fillColor(color);
  doc.moveTo(cx, cy - h / 2)
    .bezierCurveTo(cx + w / 2, cy - h / 2, cx + w / 2, cy + h / 2, cx, cy + h / 2)
    .bezierCurveTo(cx - w / 2, cy + h / 2, cx - w / 2, cy - h / 2, cx, cy - h / 2)
    .fill();
  // Mid vein
  doc.lineWidth(0.8).strokeColor('#0f5132');
  doc.moveTo(cx, cy - h / 2 + 1).lineTo(cx, cy + h / 2 - 1).stroke();
  doc.restore();
}

function drawCowHead(doc, cx, cy, size = 10, color = '#4b5563') {
  // Minimal cow head
  const r = size / 2;
  doc.save();
  doc.lineWidth(1).strokeColor(color);
  // Face
  doc.circle(cx, cy, r * 0.85).stroke();
  // Ears
  doc.moveTo(cx - r * 0.9, cy - r * 0.1).lineTo(cx - r * 1.2, cy - r * 0.6).lineTo(cx - r * 0.5, cy - r * 0.6).lineTo(cx - r * 0.9, cy - r * 0.1).stroke();
  doc.moveTo(cx + r * 0.9, cy - r * 0.1).lineTo(cx + r * 1.2, cy - r * 0.6).lineTo(cx + r * 0.5, cy - r * 0.6).lineTo(cx + r * 0.9, cy - r * 0.1).stroke();
  // Snout
  doc.ellipse(cx, cy + r * 0.35, r * 0.55, r * 0.32).stroke();
  // Eyes + nostrils
  doc.circle(cx - r * 0.28, cy - r * 0.05, 0.7).fill(color);
  doc.circle(cx + r * 0.28, cy - r * 0.05, 0.7).fill(color);
  doc.circle(cx - r * 0.18, cy + r * 0.35, 0.7).fill(color);
  doc.circle(cx + r * 0.18, cy + r * 0.35, 0.7).fill(color);
  doc.restore();
}

function drawFish(doc, cx, cy, size = 12, color = '#0f766e') {
  // Simple fish: oval body + triangle tail + eye
  const bodyW = size, bodyH = size * 0.55;
  const tailW = size * 0.45, tailH = size * 0.4;
  doc.save();
  doc.lineWidth(1).strokeColor(color).fillColor(color);
  // Body
  doc.ellipse(cx, cy, bodyW / 2, bodyH / 2).stroke();
  // Tail (filled)
  doc.moveTo(cx + bodyW / 2 - 1, cy)
    .lineTo(cx + bodyW / 2 + tailW, cy - tailH / 2)
    .lineTo(cx + bodyW / 2 + tailW, cy + tailH / 2)
    .lineTo(cx + bodyW / 2 - 1, cy)
    .fill();
  // Eye
  doc.circle(cx - bodyW * 0.25, cy - bodyH * 0.05, 0.9).fill('#0b4f45');
  doc.restore();
}

function drawDrumstick(doc, cx, cy, size = 12, color = '#ea580c') {
  // Simple chicken drumstick: meat (ellipse) + small bone
  const meatW = size * 0.9, meatH = size * 0.6;
  doc.save();
  doc.lineWidth(1).strokeColor('#9a3412').fillColor(color);
  // Meat
  doc.ellipse(cx - size * 0.1, cy, meatW / 2, meatH / 2).fillAndStroke();
  // Bone
  const bx = cx + meatW * 0.35, by = cy;
  doc.fillColor('#fde68a').strokeColor('#a16207');
  doc.rect(bx, by - 1, size * 0.28, 2).fillAndStroke();
  doc.circle(bx + size * 0.32, by - 1.8, 1.4).fillAndStroke();
  doc.circle(bx + size * 0.32, by + 1.8, 1.4).fillAndStroke();
  doc.restore();
}

function bulletWithIcon(doc, text, opts = {}) {
  const { icon = 'no', iconColor = '#dc2626', iconRadius = 4, lineGap = 2 } = opts;
  const leftMargin = doc.page.margins.left;
  const rightMargin = doc.page.margins.right;
  const startY = doc.y;
  const iconX = leftMargin + BULLET_INDENT;
  // Compute additional padding based on icon visual width so text never overlaps
  const iconPad = (() => {
    const r = iconRadius;
    switch (icon) {
      case 'fish': return r * 3.2 + 3;        // long tail to the right
      case 'drumstick': return r * 3.0 + 3;   // meat + bone extends right
      case 'bandage': return r * 2.0 + 2;
      case 'pill': return r * 1.6 + 2;
      case 'epipen': return r * 2.0 + 2;
      case 'phone': return r * 1.3 + 2;
      case 'cow': return r * 1.4 + 2;
      case 'nocow': return r * 1.5 + 2;
      case 'leaf':
      case 'check':
      case 'alert':
      case 'cross': return r * 1.2 + 2;
      case 'no':
      default: return r * 1.0 + 2;
    }
  })();
  const textX = iconX + Math.max(BULLET_GAP, iconPad);
  const width = doc.page.width - rightMargin - textX;

  // Draw icon centered on first-line baseline
  const baseline = startY + 6;
  if (icon === 'no') drawNoIcon(doc, iconX, baseline - 2, iconRadius, iconColor);
  if (icon === 'cross') drawMedicalCross(doc, iconX, baseline - 2, iconRadius * 2.2, iconColor);
  if (icon === 'alert') drawAlertTriangle(doc, iconX, baseline - 3, iconRadius * 2.2);
  if (icon === 'check') drawCheck(doc, iconX, baseline - 2, iconRadius * 2.2, '#16a34a');
  if (icon === 'leaf') drawLeaf(doc, iconX, baseline - 2, iconRadius * 2.2, '#16a34a');
  if (icon === 'cow') drawCowHead(doc, iconX, baseline - 2, iconRadius * 2.5);
  if (icon === 'nocow') drawNoCow(doc, iconX, baseline - 2, iconRadius * 2.5);
  if (icon === 'pill') drawPill(doc, iconX, baseline - 2, iconRadius * 3.0, iconRadius * 1.5);
  if (icon === 'phone') drawPhone(doc, iconX, baseline - 2, iconRadius * 2.6);
  if (icon === 'epipen') drawAutoInjector(doc, iconX, baseline - 2, iconRadius * 4.0);
  if (icon === 'bandage') drawBandage(doc, iconX, baseline - 2, iconRadius * 2.8);
  if (icon === 'fish') drawFish(doc, iconX, baseline - 2, iconRadius * 3.2);
  if (icon === 'drumstick') drawDrumstick(doc, iconX, baseline - 2, iconRadius * 3.0);
  if (icon === 'nocheese') drawNoCheese(doc, iconX, baseline - 2, iconRadius * 2.6);

  // Draw text with a hanging indent (subsequent lines align to textX)
  doc.fillColor('#111827');
  doc.text(sanitizeText(text), textX, startY, { width, lineGap });
}

// Replace characters not supported by PDFKit standard fonts with ASCII fallbacks
function sanitizeText(s) {
  return String(s || '')
    .replace(/\u03B1/g, 'alpha')       // Greek small alpha → alpha
    .replace(/[–—]/g, '-')              // en/em dash → hyphen
    .replace(/[“”]/g, '"')             // curly quotes → straight
    .replace(/[‘’]/g, "'")             // curly apostrophes → straight
    .replace(/\u00D7/g, 'x')           // multiplication sign → x
    .replace(/\u00B7/g, '-')           // middle dot → hyphen
  ;
}

function walletCard() {
  const file = path.join(OUT_DIR, 'ags_wallet_card_v1.pdf');
  // Minimize margins to maximize usable space
  const doc = new PDFDocument({ size: [inch(3.375), inch(2.125)], margins: { top: 3, left: 3, right: 3, bottom: 3 } });
  doc.pipe(fs.createWriteStream(file));

  // Optional icon
  try {
    const iconPath = path.join(__dirname, '..', 'static', 'icon.png');
    if (fs.existsSync(iconPath)) {
      doc.image(iconPath, 4, 6, { width: 14 });
    }
  } catch {}

  // Header
  doc.fillColor('#0f766e').fontSize(9).text('Alpha-gal Syndrome (AGS)', 22, 8, { align: 'left' });
  
  // Add a small medical cross icon next to subtitle
  drawMedicalCross(doc, 16-5, doc.y + 5.5, 9, '#0f766e');
  doc.moveDown(0.15);
  //doc.fillColor('#111827').fontSize(7.5).text('Allergy wallet card', 22, doc.y, { align: 'left' });
  //doc.moveDown(0.25);

  // Body
  doc.fontSize(7.0).fillColor('#111827');
  const innerWidthWallet = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  doc.text(sanitizeText('I have a serious allergy to alpha-gal (galactose-α-1,3-galactose).'), { width: innerWidthWallet, lineGap: 1 });
  doc.moveDown(0.15);
  doc.text(sanitizeText('Please avoid mammalian products in my food and medications:'), { width: innerWidthWallet, lineGap: 1 });
  const bullets = [
    'No beef, pork, lamb, venison, organ meats',
    'No milk, butter, cheese or creams',
    'Avoid gelatin; check capsules, marshmallows, gummies',
    'Check excipients: gelatin, glycerin, magnesium stearate, carageenan'
  ];
  bullets.forEach((b, i) => {
    let icon = 'no';
    if (i === 0 || /beef|pork|lamb|venison|organ/i.test(b)) icon = 'nocow';
    else if (/milk|butter|cheese|cream/i.test(b)) icon = 'nocheese';
    else if (/gelatin/i.test(b)) icon = 'pill';
    else if (/excipients/i.test(b)) icon = 'pill';
    bulletWithIcon(doc, b, { icon, iconRadius: 3.0, lineGap: 1 });
  });

  // Space-efficient positive suggestions (wallet has limited room)
  doc.moveDown(0.1);
  doc.fillColor('#111827').fontSize(7.2).text('Preferred alternatives:', { continued: false });
  bulletWithIcon(doc, 'Vegetable oils (olive, canola, avocado)', { icon: 'check', iconRadius: 2.8, lineGap: 1 });
  bulletWithIcon(doc, 'Plant-based butter; non-dairy milks if tolerated', { icon: 'leaf', iconRadius: 2.8, lineGap: 1 });
  bulletWithIcon(doc, 'Poultry (chicken, turkey)', { icon: 'drumstick', iconRadius: 2.8, lineGap: 1 });
  bulletWithIcon(doc, 'Fish/seafood (if otherwise tolerated)', { icon: 'fish', iconRadius: 2.8, lineGap: 1 });

  doc.moveDown(0.15);
  // Emergency line with alert icon
  const emergencyText = sanitizeText('Emergency: treat as anaphylaxis if needed. Use epinephrine if prescribed. Call 911.');
  const ex = doc.x; const ey = doc.y;
  drawAlertTriangle(doc, ex - 5, ey + 7, 9);
  // Swap phone for epinephrine auto-injector to reinforce message, keep compact
  drawAutoInjector(doc, ex + 6, ey + 7, 12);
  doc.text(emergencyText, ex + 16, ey, { width: innerWidthWallet - 16, lineGap: 1 });

  // Compact footer to keep within one page
  //doc.moveDown(0.08);
  doc.fillColor('#6b7280').fontSize(6.5).text(sanitizeText('More info: alphagaldata.com'), { width: innerWidthWallet, lineGap: 0.8, align: 'left' });

  doc.end();
  return file;
}

function diningCard() {
  const file = path.join(OUT_DIR, 'ags_dining_card_v1.pdf');
  // Use explicit 6in x 4in page size (landscape) with tighter margins to avoid overflow
  const doc = new PDFDocument({ size: [inch(6), inch(4)], margins: { top: 18, left: 18, right: 18, bottom: 18 } });
  doc.pipe(fs.createWriteStream(file));

  // Optional icon
  try {
    const iconPath = path.join(__dirname, '..', 'static', 'icon.png');
    if (fs.existsSync(iconPath)) {
      // Small icon near title (removed watermark to avoid any faded appearance)
      doc.image(iconPath, 12, 16, { width: 24 });
    }
  } catch {}

  // Header (slightly smaller to fit on one page)
  doc.fillColor('#0f766e').fontSize(16).text('Dining/Restaurant Card', 44, 14, { align: 'left' });
  doc.moveDown(0.15);
  doc.fillColor('#111827').fontSize(11).text(sanitizeText('I have Alpha-gal Syndrome (AGS). Please help me avoid the following:'), { align: 'left' });
  doc.moveDown(0.4);

  // Bullets (reduced font size and tighter line gap)
  doc.fontSize(10.25);
  const innerWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const bullets = [
    'No mammalian meats: beef, pork, lamb, venison, organ meats (liver, bacon, sausage)',
    'No broths/gravies made from beef/pork bones or drippings',
    'No milk, butter, cheese or creams',
    'No gelatin (desserts, capsules, some sauces/candies)',
    'No animal fats (lard, tallow, suet)',
    'Avoid cross-contact on shared grills, fryers, knives, and cutting boards'
  ];
  bullets.forEach((b, idx) => {
    let icon = 'no';
    if (idx === 0 || /mammalian|beef|pork|lamb|venison|organ/i.test(b)) icon = 'nocow';
    else if (/milk|butter|cheese|cream/i.test(b)) icon = 'nocheese';
    else if (/gelatin/i.test(b)) icon = 'pill';
    bulletWithIcon(doc, b, { icon, iconRadius: 3.8, width: innerWidth, lineGap: 1.5 });
    if (idx < bullets.length - 1) doc.moveDown(0.06);
  });

  doc.moveDown(0.3);
  doc.fillColor('#111827').fontSize(10.5).text('Suggested alternatives:', { align: 'left' });
  const positives = [
    { text: 'Use vegetable oils or plant-based butter/spreads', icon: 'leaf' },
    { text: 'Non-dairy milks if tolerated (oat, almond, soy)', icon: 'check' },
    { text: 'Poultry (chicken, turkey)', icon: 'drumstick' },
    { text: 'Fish/seafood (if otherwise tolerated)', icon: 'fish' }
  ];
  positives.forEach((p, idx) => { bulletWithIcon(doc, p.text, { icon: p.icon, iconRadius: 3.6, width: innerWidth, lineGap: 1.4 }); if (idx < positives.length - 1) doc.moveDown(0.06); });

  doc.moveDown(0.35);
  // Thank-you with medical cross accent
  const tx = doc.x; const ty = doc.y;
  drawMedicalCross(doc, tx + 6, ty + 6, 10, '#0f766e');
  doc.fillColor('#374151').fontSize(9).text(sanitizeText('Thank you! If unsure about an ingredient, please ask me.'), tx + 14, ty, { align: 'left' });
  doc.moveDown(0.15);
  doc.fillColor('#6b7280').fontSize(8).text(sanitizeText('Learn more: alphagaldata.com · Educational only, not medical advice'), { align: 'left' });

  doc.end();
  return file;
}

const w = walletCard();
const d = diningCard();
console.log('Generated PDFs:');
console.log(' - ' + w);
console.log(' - ' + d);
