import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const demos = [
  ['A-terminal-deck.html', 'A-terminal-deck.png'],
  ['B-command-deck.html', 'B-command-deck.png'],
  ['C-night-journal.html', 'C-night-journal.png'],
];

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
for (const [file, out] of demos) {
  const url = 'file://' + join(__dirname, 'design-demos', file);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(__dirname, 'design-demos', out) });
  console.log('captured', out);
}
await browser.close();