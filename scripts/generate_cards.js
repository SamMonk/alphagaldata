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

function walletCard() {
  const file = path.join(OUT_DIR, 'ags_wallet_card_v1.pdf');
  const doc = new PDFDocument({ size: [inch(3.375), inch(2.125)], margins: { top: 12, left: 12, right: 12, bottom: 12 } });
  doc.pipe(fs.createWriteStream(file));

  // Optional icon
  try {
    const iconPath = path.join(__dirname, '..', 'static', 'icon.png');
    if (fs.existsSync(iconPath)) {
      doc.image(iconPath, 4, 6, { width: 14 });
    }
  } catch {}

  // Header
  doc.fillColor('#0f766e').fontSize(10).text('Alpha-gal Syndrome (AGS)', 22, 8, { align: 'left' });
  doc.moveDown(0.2);
  doc.fillColor('#111827').fontSize(8).text('Allergy wallet card', { align: 'left' });
  doc.moveDown(0.4);

  // Body
  doc.fontSize(8).fillColor('#111827');
  doc.text('I have a serious allergy to alpha-gal (galactose-α-1,3-galactose).');
  doc.moveDown(0.25);
  doc.text('Please avoid mammalian products in my food and medications:', { continued: false });
  const bullets = [
    'No beef, pork, lamb, venison, organ meats',
    'Avoid gelatin; check capsules, marshmallows, gummies',
    'Avoid lard/tallow/suet; use vegetable oils instead',
    'Check excipients: gelatin, glycerin, magnesium stearate (animal sources)'
  ];
  bullets.forEach((b) => { doc.text('• ' + b, { indent: 4 }); });

  doc.moveDown(0.25);
  doc.text('Emergency: treat as anaphylaxis if needed. Use epinephrine autoinjector if prescribed. Call 911.', { align: 'left' });

  doc.moveDown(0.2);
  doc.fillColor('#6b7280').text('More info: alphagaldata.com/downloads', { align: 'left' });

  doc.end();
  return file;
}

function diningCard() {
  const file = path.join(OUT_DIR, 'ags_dining_card_v1.pdf');
  const doc = new PDFDocument({ size: [inch(6), inch(4)], layout: 'landscape', margins: { top: 24, left: 28, right: 28, bottom: 24 } });
  doc.pipe(fs.createWriteStream(file));

  // Optional icon
  try {
    const iconPath = path.join(__dirname, '..', 'static', 'icon.png');
    if (fs.existsSync(iconPath)) {
      doc.image(iconPath, 12, 16, { width: 24 });
    }
  } catch {}

  // Header
  doc.fillColor('#0f766e').fontSize(18).text('Dining/Restaurant Card', 44, 16, { align: 'left' });
  doc.moveDown(0.2);
  doc.fillColor('#111827').fontSize(12).text('I have Alpha-gal Syndrome (AGS). Please help me avoid the following:', { align: 'left' });
  doc.moveDown(0.6);

  // Bullets
  doc.fontSize(12);
  const bullets = [
    'No mammalian meats: beef, pork, lamb, venison, organ meats (liver, bacon, sausage)',
    'No broths/gravies made from beef/pork bones or drippings',
    'No gelatin (desserts, capsules, some sauces/candies)',
    'No animal fats (lard, tallow, suet) — use vegetable oils',
    'Dairy only if I confirm it is acceptable today',
    'Avoid cross-contact on shared grills, fryers, knives, and cutting boards'
  ];
  bullets.forEach((b) => { doc.text('• ' + b, { width: inch(8), lineGap: 2 }); });

  doc.moveDown(0.6);
  doc.fillColor('#374151').fontSize(10).text('Thank you! If unsure about an ingredient, please ask me.', { align: 'left' });
  doc.moveDown(0.2);
  doc.fillColor('#6b7280').fontSize(9).text('Learn more: alphagaldata.com/downloads · Educational only, not medical advice', { align: 'left' });

  doc.end();
  return file;
}

const w = walletCard();
const d = diningCard();
console.log('Generated PDFs:');
console.log(' - ' + w);
console.log(' - ' + d);
