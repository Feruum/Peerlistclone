const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('docs/research/dump/feature_grid.html', 'utf8');
const $ = cheerio.load(html, { xmlMode: false });

function camelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

function styleToObject(styleStr) {
  const obj = {};
  if (!styleStr) return obj;
  styleStr.split(';').forEach(rule => {
    if (!rule.trim()) return;
    const parts = rule.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join(':').trim();
      let camelKey = camelCase(key);
      if (camelKey === 'mask') camelKey = 'WebkitMask'; // Just in case, or keep mask
      obj[camelKey] = value;
    }
  });
  return obj;
}

const reactAttributes = {
  'class': 'className',
  'for': 'htmlFor',
  'tabindex': 'tabIndex',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'vector-effect': 'vectorEffect',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
  'clip-path': 'clipPath',
  'viewbox': 'viewBox',
  'xmlns:xlink': 'xmlnsXlink',
  'xml:space': 'xmlSpace',
  'charset': 'charSet',
  'autocomplete': 'autoComplete',
  'autofocus': 'autoFocus',
  'readonly': 'readOnly',
  'maxlength': 'maxLength',
  'minlength': 'minLength',
  'colspan': 'colSpan',
  'rowspan': 'rowSpan',
  'srcdoc': 'srcDoc',
  'srcset': 'srcSet',
  'crossorigin': 'crossOrigin',
  'enctype': 'encType',
  'spellcheck': 'spellCheck',
  'datetime': 'dateTime',
};

function nodeToJsx(node) {
  if (node.type === 'text') {
    let text = node.data;
    // Escape { and }
    text = text.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    // Escape < and >
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return text;
  }
  if (node.type === 'comment') {
    return `{/* ${node.data} */}`;
  }
  if (node.type === 'tag' || node.type === 'script' || node.type === 'style') {
    let tagName = node.name;
    let attrs = '';
    for (const [key, value] of Object.entries(node.attribs)) {
      let jsxKey = reactAttributes[key.toLowerCase()] || key;
      if (jsxKey.includes('-') && !jsxKey.startsWith('data-') && !jsxKey.startsWith('aria-')) {
        jsxKey = camelCase(jsxKey);
      }
      
      if (jsxKey === 'style') {
        attrs += ` style={${JSON.stringify(styleToObject(value))}}`;
      } else if (value === '') {
        attrs += ` ${jsxKey}`;
      } else {
        // Escape quotes
        const escapedValue = value.replace(/"/g, '&quot;');
        attrs += ` ${jsxKey}="${escapedValue}"`;
      }
    }

    const selfClosingTags = ['img', 'input', 'br', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'stop', 'use'];
    if (selfClosingTags.includes(tagName)) {
      return `<${tagName}${attrs} />`;
    }

    let childrenJsx = '';
    for (const child of node.children) {
      childrenJsx += nodeToJsx(child);
    }

    return `<${tagName}${attrs}>${childrenJsx}</${tagName}>`;
  }
  return '';
}

let jsxContent = '';
$('body').children().each((i, el) => {
  jsxContent += nodeToJsx(el);
});

const component = `import React from 'react';

export default function FeatureGrid() {
  return (
    <>
      ${jsxContent}
    </>
  );
}
`;

fs.writeFileSync('src/components/features/home/FeatureGrid.tsx', component);
console.log('Done');
