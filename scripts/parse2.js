const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const $ = cheerio.load(html);

const nextDiv = $('#__next');
if (nextDiv.length) {
  console.log("#__next found");
  nextDiv.children().each((i, el) => {
    console.log(`  <${el.tagName} class="${$(el).attr('class') || ''}">`);
  });
} else {
  console.log("No #__next, checking first div:");
  const firstDiv = $('div').first();
  console.log(firstDiv.attr('id'), firstDiv.attr('class'));
  firstDiv.children().each((i, el) => {
    console.log(`  <${el.tagName} class="${$(el).attr('class') || ''}">`);
  });
}
