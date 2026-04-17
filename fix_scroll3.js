const fs = require('fs');
const file = 'src/components/features/scroll/ScrollFeed.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/tabIndex="(\d+)"/g, 'tabIndex={$1}');
fs.writeFileSync(file, content);