import { chromium } from 'playwright-core';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const url = 'file://' + join(__dirname, 'clawdbot-one-page.html');
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.screenshot({ path: join(__dirname, 'clawdbot-one-page-top.png') });
await page.screenshot({ path: join(__dirname, 'clawdbot-one-page-full.png'), fullPage: true });
console.log('captured top + full');
await browser.close();