const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const $ = cheerio.load(html);

const mainWrap = $('#__next > div.bg-gray-00');

console.log("Children of main wrapper:");
mainWrap.children().each((i, el) => {
  console.log(`- <${el.tagName} class="${$(el).attr('class') || ''}">`);
});

// Dump the first main child (probably header)
if (mainWrap.children().length > 0) {
  const header = mainWrap.children().eq(0);
  console.log("\nHeader classes:", header.attr('class'));
  
  const mainCont = mainWrap.children().eq(1);
  console.log("\nMain content classes:", mainCont.attr('class'));
}