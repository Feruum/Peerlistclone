const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log("Navigating to https://peerlist.io/");
  await page.goto('https://peerlist.io/', { waitUntil: 'domcontentloaded' });

  // Add a small delay for lazy-loaded assets
  await page.waitForTimeout(3000);

  console.log("Extracting assets and computed styles...");
  const data = await page.evaluate(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const bodyStyle = getComputedStyle(document.body);
    
    const colors = {};
    for (const sheet of document.styleSheets) {
        try {
            for (const rule of sheet.cssRules) {
                if (rule.selectorText === ':root' || rule.selectorText === 'html') {
                    const cssText = rule.style.cssText;
                    cssText.split(';').forEach(p => {
                        const [key, val] = p.split(':');
                        if (key && (key.trim().startsWith('--color') || key.trim().startsWith('--'))) {
                            colors[key.trim()] = val ? val.trim() : '';
                        }
                    });
                }
            }
        } catch(e) {}
    }

    const images = [...document.querySelectorAll('img')].map(img => ({
      src: img.src || img.currentSrc,
      alt: img.alt || '',
      width: img.naturalWidth || img.width,
      height: img.naturalHeight || img.height
    }));
    
    const svgs = [...document.querySelectorAll('svg')].length;
    const fonts = [...new Set([...document.querySelectorAll('*')].map(el => getComputedStyle(el).fontFamily))].filter(f => f && f !== 'none' && f !== '""');

    return {
      title: document.title,
      bodyStyles: {
        backgroundColor: bodyStyle.backgroundColor,
        color: bodyStyle.color,
        fontFamily: bodyStyle.fontFamily
      },
      colors,
      images: images.slice(0, 20), // just top 20 for preview
      svgCount: svgs,
      fonts
    };
  });

  // Ensure directories exist
  if (!fs.existsSync('docs/research')) fs.mkdirSync('docs/research', { recursive: true });
  if (!fs.existsSync('docs/design-references')) fs.mkdirSync('docs/design-references', { recursive: true });

  fs.writeFileSync('docs/research/global_tokens.json', JSON.stringify(data, null, 2));
  console.log("Extraction saved to docs/research/global_tokens.json");
  
  await page.screenshot({ path: 'docs/design-references/home-desktop.png', fullPage: true });
  console.log("Screenshot saved.");

  await browser.close();
})();