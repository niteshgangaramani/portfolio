import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteData } from '../src/data/data.ts';
import { DEFAULT_SITE_SETTINGS } from '../src/admin/defaults.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outPath = path.join(root, 'src/data/site-data.json');

const payload = {
  ...siteData,
  settings: {
    ...DEFAULT_SITE_SETTINGS,
    ...siteData.settings,
    headings: {
      ...DEFAULT_SITE_SETTINGS.headings,
      ...siteData.settings?.headings,
    },
  },
};

await fs.writeFile(outPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outPath}`);
