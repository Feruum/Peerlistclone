const fs = require('fs');
const jsx = fs.readFileSync('temp.jsx', 'utf8');
const component = `import React from 'react';

export default function FeatureGrid() {
  return (
    <>
${jsx}
    </>
  );
}
`;
fs.writeFileSync('src/components/features/home/FeatureGrid.tsx', component);
console.log('Done');
