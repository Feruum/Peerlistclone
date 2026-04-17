const fs = require("fs");
const file = "src/components/features/scroll/ScrollFeed.tsx";
let content = fs.readFileSync(file, "utf8");
content = content.replace(/"-GradientPositionX"/g, '"--GradientPositionX"');
content = content.replace(/"-CircleSize"/g, '"--CircleSize"');
fs.writeFileSync(file, content);
