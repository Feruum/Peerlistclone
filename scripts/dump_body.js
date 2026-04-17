const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://peerlist.io/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    return document.body.innerHTML;
  });

  fs.writeFileSync('docs/research/dump/peerlist_body.html', data);
  console.log("Body HTML dumped.");
  await browser.close();
})();