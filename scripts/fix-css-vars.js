const fs = require("fs");
[
  "src/app/scroll/page.tsx",
  "src/components/features/scroll/ScrollFeed.tsx",
].forEach((file) => {
  let content = fs.readFileSync(file, "utf-8");
  content = content.replace(/"-GradientPositionX"/g, '"--gradient-position-x"');
  content = content.replace(/"-CircleSize"/g, '"--circle-size"');
  fs.writeFileSync(file, content);
});
console.log("Fixed CSS variables");
