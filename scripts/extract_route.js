const { chromium } = require('playwright');
const fs = require('fs');
const url = process.argv[2];
const name = process.argv[3];
(async () => {
  console.log('Extracting', url);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  const body = await page.innerHTML('body');
  fs.writeFileSync('docs/research/dump/' + name + '_body.html', body);
  await browser.close();
  console.log('Saved to docs/research/dump/' + name + '_body.html');
})();
