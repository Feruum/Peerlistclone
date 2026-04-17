const fs = require("fs");

let html = fs.readFileSync("docs/research/dump/scroll_body.html", "utf-8");

const match = html.match(
  /<div class="bg-gray-00 w-full[^>]*>([\s\S]*?)<next-route-announcer>/,
);
if (match) {
  let jsx = match[0];

  // Basic HTML to JSX conversions
  jsx = jsx.replace(/class=/g, "className=");
  jsx = jsx.replace(/for=/g, "htmlFor=");
  jsx = jsx.replace(/tabindex=/g, "tabIndex=");
  jsx = jsx.replace(/stroke-width=/g, "strokeWidth=");
  jsx = jsx.replace(/stroke-linecap=/g, "strokeLinecap=");
  jsx = jsx.replace(/stroke-linejoin=/g, "strokeLinejoin=");
  jsx = jsx.replace(/fill-rule=/g, "fillRule=");
  jsx = jsx.replace(/clip-rule=/g, "clipRule=");
  jsx = jsx.replace(/vector-effect=/g, "vectorEffect=");
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

  // Self-closing tags
  jsx = jsx.replace(/<img([^>]*[^\/])>/g, "<img$1 />");
  jsx = jsx.replace(/<input([^>]*[^\/])>/g, "<input$1 />");
  jsx = jsx.replace(/<br([^>]*[^\/])>/g, "<br$1 />");
  jsx = jsx.replace(/<hr([^>]*[^\/])>/g, "<hr$1 />");

  // Style attributes (very basic, might need manual fixing)
  jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    const styleObj = {};
    p1.split(";").forEach((rule) => {
      if (!rule.trim()) return;
      const [key, value] = rule.split(":");
      if (key && value) {
        let camelKey = key
          .trim()
          .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (camelKey.startsWith("--")) camelKey = key.trim(); // Keep CSS variables
        styleObj[camelKey] = value.trim();
      }
    });
    return `style={${JSON.stringify(styleObj)}}`;
  });

  fs.writeFileSync("docs/research/dump/scroll_body.jsx", jsx);
  console.log("Converted to JSX");
} else {
  console.log("Could not find main content");
}
