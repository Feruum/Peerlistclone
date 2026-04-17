const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('docs/research/dump/feature_grid.html', 'utf-8');
const $ = cheerio.load(html);

// the dump might contain the whole page or just the main content
// Let's grab just the direct child element containing the features
const proof = $('*:contains("Proof of work is the only thing that works")')
  .filter((i, el) => $(el).children().length === 0)
  .closest('.flex.flex-col');

console.log(proof.parent().html().substring(0, 1000));
fs.writeFileSync('docs/research/dump/feature_grid_inner.html', proof.parent().html());
