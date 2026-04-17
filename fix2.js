const fs = require('fs');
const file = 'src/components/features/home/FeatureGrid.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<div type="button"/g, '<div');
content = content.replace(/<a type="button"/g, '<a');
fs.writeFileSync(file, content);