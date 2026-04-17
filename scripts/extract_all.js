const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  
  async function rip(url, name) {
    const page = await context.newPage();
    console.log('Extracting', url);
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        console.log('Waiting 15 seconds to bypass Cloudflare and render...');
        await page.waitForTimeout(15000);
        const body = await page.innerHTML('body');
        fs.writeFileSync('docs/research/dump/' + name + '_body.html', body);
        console.log('Saved to docs/research/dump/' + name + '_body.html');
    } catch(e) {
        console.error('Error on ' + url, e.message);
    }
    await page.close();
  }

  await rip('https://peerlist.io/jobs', 'jobs');
  await rip('https://peerlist.io/launchpad/2026/week/16', 'launchpad');
  await rip('https://peerlist.io/articles', 'articles');
  await rip('https://peerlist.io/search', 'search');
  await rip('https://peerlist.io/blog', 'blog');
  await rip('https://peerlist.io/ads?utm_source=left_panel', 'ads');
  
  await browser.close();
})().catch(console.error);
