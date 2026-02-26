#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const defaultSource = path.resolve(projectRoot, '../data-bot/datasets/alphagal/ingredients.json');
const source = process.env.INGREDIENTS_SOURCE || defaultSource;
const target = path.resolve(projectRoot, 'src/data/ingredients.json');

function copyDataset() {
  if (!fs.existsSync(source)) {
    console.warn(`[sync-ingredients] Source dataset not found at ${source}. Skipping copy.`);
    return;
  }

  const payload = fs.readFileSync(source, 'utf-8');
  try {
    JSON.parse(payload);
  } catch (err) {
    console.error('[sync-ingredients] Dataset is not valid JSON; aborting copy.');
    throw err;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, payload);
  console.log(`[sync-ingredients] Copied ingredient dataset from ${source} -> ${target}`);
}

copyDataset();
