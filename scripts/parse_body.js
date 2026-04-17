const fs = require('fs');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');

// I'll just write a quick regex parser to find the hero section.
// The hero has "The Professional Network" in it.
const heroIdx = html.indexOf('The Professional Network');
if (heroIdx !== -1) {
  // Get 1000 characters before and 2000 after
  const start = Math.max(0, heroIdx - 1000);
  const excerpt = html.substring(start, heroIdx + 2000);
  fs.writeFileSync('docs/research/dump/hero_excerpt.html', excerpt);
  console.log("Hero excerpt saved.");
}
