const fs = require("fs");

const layoutJsx = fs.readFileSync(
  "docs/research/dump/layout_content.jsx",
  "utf-8",
);
const feedJsx = fs.readFileSync("docs/research/dump/feed_content.jsx", "utf-8");

// Clean up layoutJsx
let cleanLayout = layoutJsx
  .replace(/<script[\s\S]*?<\/script>/g, "")
  .replace(/<iframe[\s\S]*?<\/iframe>/g, "")
  .replace(/<style[\s\S]*?<\/style>/g, "")
  .replace(/<next-route-announcer>[\s\S]*?<\/next-route-announcer>/g, "")
  .replace(
    /<div id="pl-tooltip-portal">[\s\S]*?<\/div><\/div><\/div><\/div>/g,
    "",
  );

// Fix any remaining style attributes
cleanLayout = cleanLayout.replace(/style="([^"]*)"/g, "style={{}}");
const cleanFeed = feedJsx.replace(/style="([^"]*)"/g, "style={{}}");

const pageTsx = `import { ScrollFeed } from '@/components/features/scroll/ScrollFeed';

export default function ScrollPage() {
  return (
    ${cleanLayout}
  );
}
`;

const feedTsx = `export function ScrollFeed() {
  return (
    ${cleanFeed}
  );
}
`;

fs.writeFileSync("src/app/scroll/page.tsx", pageTsx);
fs.writeFileSync("src/components/features/scroll/ScrollFeed.tsx", feedTsx);
console.log("Files generated");
