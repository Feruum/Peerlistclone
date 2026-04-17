const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://peerlist.io/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    // Attempt to extract the primary layout elements: Header/Nav, Main, Footer
    const header = document.querySelector('header')?.outerHTML || document.querySelector('nav')?.outerHTML || '';
    const main = document.querySelector('main')?.outerHTML || '';
    
    // Get all text content that is visible to structure the site
    const allText = document.body.innerText;
    
    return {
      headerHTML: header,
      mainHTML: main,
      allText: allText
    };
  });

  if (!fs.existsSync('docs/research/dump')) fs.mkdirSync('docs/research/dump', { recursive: true });
  
  fs.writeFileSync('docs/research/dump/peerlist_header.html', data.headerHTML);
  fs.writeFileSync('docs/research/dump/peerlist_main.html', data.mainHTML);
  fs.writeFileSync('docs/research/dump/peerlist_text.txt', data.allText);

  console.log("HTML Dumped to docs/research/dump/");
  await browser.close();
})();