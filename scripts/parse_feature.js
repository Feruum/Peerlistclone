const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const $ = cheerio.load(html);

// Find an element containing "Proof of work is the only thing that works"
const sectionTarget = $('*:contains("Proof of work is the only thing that works")')
  .filter((i, el) => $(el).children().length > 0 && $(el).text().includes("Proof of work is the only thing that works"))
  .last()
  .closest('div.w-full.mx-auto') // Usually they are contained in a div with some padding/w-full
  .parent(); // we might need to go up to get the whole grid

if (sectionTarget.length) {
  // Let's just find the text "Proof of work is the only thing that works" and find the nearest container that siblings the Hero.
  let p = $('*:contains("Proof of work is the only thing that works")').last();
  let container = p;
  
  // traverse up until we hit a wide container
  while (container.parent().length && !container.attr('class')?.includes('max-w')) {
    container = container.parent();
    // break if we reach too high up
    if (container.attr('id') === '__next') break;
  }
  
  fs.writeFileSync('docs/research/dump/feature_grid.html', container.parent().html() || container.html());
  console.log("Feature Grid HTML dumped!");
} else {
  console.log("Could not find the target text.");
}
