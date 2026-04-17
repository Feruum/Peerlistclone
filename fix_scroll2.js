const fs = require('fs');
const file = 'src/components/features/scroll/ScrollFeed.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/style=\{\{\s*"--gradient-position-x":\s*"10%",\s*"--circle-size":\s*"250px"\s*\}\}/g, "style={{ '--gradient-position-x': '10%', '--circle-size': '250px' } as React.CSSProperties}");
fs.writeFileSync(file, content);