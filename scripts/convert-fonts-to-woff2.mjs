/**
 * Convert public/fonts/*.ttf to .woff2 (same basename) using fontmin.
 * Run: node scripts/convert-fonts-to-woff2.mjs
 */
import Fontmin from 'fontmin';
import { readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fontsDir = join(__dirname, '..', 'public', 'fonts');

const files = (await readdir(fontsDir)).filter((f) => f.endsWith('.ttf'));
if (files.length === 0) {
  console.warn('No .ttf files in public/fonts');
  process.exit(0);
}

const fontmin = new Fontmin()
  .src(files.map((f) => join(fontsDir, f)))
  .use(Fontmin.ttf2woff2())
  .dest(fontsDir);

fontmin.run((err, outFiles) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(
    'WOFF2 written:',
    outFiles.map((f) => f.path).filter(Boolean)
  );
});
