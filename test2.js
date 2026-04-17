const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/scroll_body.html', 'utf8');
let $ = cheerio.load(html, { xmlMode: false, decodeEntities: false });
let mainNode = $('.max-w-\\[1420px\\]');
if (mainNode.length === 0) {
    mainNode = $('body > div').first();
    console.log("Using body > div first");
}
if (mainNode.length === 0) {
    mainNode = $('body');
    console.log("Using body");
}

console.log("Found pixel containers:", $('.pixel-transition-container').length);
$('.pixel-transition-container').remove();
console.log("After remove:", $('.pixel-transition-container').length);

let out = $.html(mainNode);
console.log("In output string:", out.includes('pixel-transition-container'));