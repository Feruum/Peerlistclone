const fs = require('fs');
const file = 'src/components/features/home/FeatureGrid.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/\svalue\s*\/>/g, ' defaultValue="" />');
content = content.replace(/\slabel\s+required/g, ' required');
fs.writeFileSync(file, content);