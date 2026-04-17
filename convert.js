const fs = require('fs');

let html = fs.readFileSync('docs/research/dump/feature_grid.html', 'utf8');

// Replace class= with className=
html = html.replace(/class=/g, 'className=');

// Replace for= with htmlFor=
html = html.replace(/for=/g, 'htmlFor=');

// Replace tabindex= with tabIndex=
html = html.replace(/tabindex=/g, 'tabIndex=');

// Replace stroke-width= with strokeWidth=
html = html.replace(/stroke-width=/g, 'strokeWidth=');

// Replace stroke-linecap= with strokeLinecap=
html = html.replace(/stroke-linecap=/g, 'strokeLinecap=');

// Replace stroke-linejoin= with strokeLinejoin=
html = html.replace(/stroke-linejoin=/g, 'strokeLinejoin=');

// Replace fill-rule= with fillRule=
html = html.replace(/fill-rule=/g, 'fillRule=');

// Replace clip-rule= with clipRule=
html = html.replace(/clip-rule=/g, 'clipRule=');

// Replace vector-effect= with vectorEffect=
html = html.replace(/vector-effect=/g, 'vectorEffect=');

// Replace stroke-miterlimit= with strokeMiterlimit=
html = html.replace(/stroke-miterlimit=/g, 'strokeMiterlimit=');

// Replace stop-color= with stopColor=
html = html.replace(/stop-color=/g, 'stopColor=');

// Replace stop-opacity= with stopOpacity=
html = html.replace(/stop-opacity=/g, 'stopOpacity=');

// Replace clip-path= with clipPath=
html = html.replace(/clip-path=/g, 'clipPath=');

// Close unclosed tags
html = html.replace(/<img([^>]*[^\/])>/g, '<img$1 />');
html = html.replace(/<input([^>]*[^\/])>/g, '<input$1 />');
html = html.replace(/<br([^>]*[^\/])>/g, '<br$1 />');
html = html.replace(/<hr([^>]*[^\/])>/g, '<hr$1 />');

// Convert inline styles
html = html.replace(/style="([^"]*)"/g, (match, p1) => {
  const styleObj = {};
  p1.split(';').forEach(rule => {
    if (!rule.trim()) return;
    const [key, value] = rule.split(':');
    if (key && value) {
      const camelKey = key.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      styleObj[camelKey] = value.trim();
    }
  });
  return `style={${JSON.stringify(styleObj)}}`;
});

// Replace HTML comments with JSX comments
html = html.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// Wrap in component
const jsx = `import React from 'react';

export default function FeatureGrid() {
  return (
    <>
      ${html}
    </>
  );
}
`;

fs.writeFileSync('src/components/features/home/FeatureGrid.tsx', jsx);
console.log('Done');
