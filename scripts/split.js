const fs = require("fs");
const jsx = fs.readFileSync("docs/research/dump/scroll_body.jsx", "utf-8");

// Find the feed content
const match = jsx.match(/<div className="lg:w-\[640px\] w-full h-full   pt-14 pb-20\s*">/);
if (match) {
  const feedStart = match.index;
  // We need to find the matching closing div
  let depth = 0;
  let feedEnd = -1;
  for (let i = feedStart; i < jsx.length; i++) {
    if (jsx.substr(i, 4) === "<div") depth++;
    if (jsx.substr(i, 5) === "</div") {
      depth--;
      if (depth === 0) {
        feedEnd = i + 6;
        break;
      }
    }
  }

  if (feedEnd !== -1) {
    const feedContent = jsx.substring(feedStart, feedEnd);
    fs.writeFileSync("docs/research/dump/feed_content.jsx", feedContent);

    const layoutContent =
      jsx.substring(0, feedStart) + "<ScrollFeed />" + jsx.substring(feedEnd);
    fs.writeFileSync("docs/research/dump/layout_content.jsx", layoutContent);
    console.log("Split successful");
  } else {
    console.log("Could not find end of feed content");
  }
} else {
  console.log("Could not find feed content start");
}
