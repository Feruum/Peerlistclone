const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const $ = cheerio.load(html);

const topDiv = $('#__next > div > div').first();
console.log(topDiv.attr('class'));

console.log("\nChildren of main wrapper:");
topDiv.children().each((i, el) => {
  console.log(`- <${el.tagName} id="${$(el).attr('id') || ''}" class="${$(el).attr('class') || ''}">`);
});

const topHeader = topDiv.find('header, nav').first();
console.log("\nTop Header HTML:");
console.log(topHeader.html());
