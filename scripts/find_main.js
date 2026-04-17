const fs = require('fs');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const mainMatch = html.match(/<main[^>]*>/);
if (mainMatch) {
  console.log("Main element found:", mainMatch[0]);
  const start = mainMatch.index;
  console.log(html.substring(start, start + 500));
} else {
  console.log("No <main> found.");
}
