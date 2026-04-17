const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const url = process.argv[2];
  const name = process.argv[3];
  
  if (!url || !name) {
    console.error('Usage: node extract_one.js <url> <name>');
    process.exit(1);
  }

  console.log(`Launching browser to extract ${url}...`);
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  const page = await context.newPage();
  try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      console.log('Waiting 15 seconds to bypass Cloudflare and render...');
      await page.waitForTimeout(15000);
      const body = await page.innerHTML('body');
      fs.writeFileSync('docs/research/dump/' + name + '_body.html', body);
      console.log(`Saved to docs/research/dump/${name}_body.html`);
  } catch(e) {
      console.error('Error on ' + url, e.message);
  }
  await browser.close();
})().catch(console.error);
