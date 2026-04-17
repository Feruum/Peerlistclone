const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const $ = cheerio.load(html);

const mainWrap = $('#__next > div.bg-gray-00');

const firstDiv = mainWrap.children().eq(0);
console.log("first div children:");
firstDiv.children().each((i, el) => {
  console.log(`- <${el.tagName} id="${$(el).attr('id') || ''}" class="${$(el).attr('class') || ''}">`);
});

const hero = firstDiv.find('h1').closest('div').parent();
console.log("\nHero Parent HTML:");
console.log(hero.html().substring(0, 300));
