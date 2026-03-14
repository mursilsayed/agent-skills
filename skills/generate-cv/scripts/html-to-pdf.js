#!/usr/bin/env node
/**
 * html-to-pdf.js
 * Converts an HTML file to PDF using Puppeteer.
 *
 * Usage:
 *   node html-to-pdf.js --input <path> --output <path> [--browser <path>]
 *
 * Options:
 *   --input    Path to the input HTML file
 *   --output   Path for the output PDF file
 *   --browser  Path to Chromium-based browser executable (optional)
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const get = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };

const inputPath  = get('--input');
const outputPath = get('--output');
const browserPath = get('--browser');

if (!inputPath || !outputPath) {
  console.error('Usage: node html-to-pdf.js --input <path> --output <path> [--browser <path>]');
  process.exit(1);
}

const BROWSER_CANDIDATES = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
];

function findBrowser() {
  if (browserPath && fs.existsSync(browserPath)) return browserPath;
  for (const candidate of BROWSER_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null; // let puppeteer use its bundled browser
}

(async () => {
  const absInput  = path.resolve(inputPath);
  const absOutput = path.resolve(outputPath);

  if (!fs.existsSync(absInput)) {
    console.error(`Input file not found: ${absInput}`);
    process.exit(1);
  }

  fs.mkdirSync(path.dirname(absOutput), { recursive: true });

  const executablePath = findBrowser();
  const launchOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ...(executablePath && { executablePath }),
  };

  const browser = await puppeteer.launch(launchOptions);
  const page = await browser.newPage();
  await page.goto(`file://${absInput}`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: absOutput,
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
  });
  await browser.close();

  console.log(`PDF generated: ${absOutput}`);
})();
