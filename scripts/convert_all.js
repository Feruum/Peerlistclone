const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

function convertToReact(html) {
    let $ = cheerio.load(html, { xmlMode: false, decodeEntities: false });

    // Try to find the main container, otherwise use body
    let mainNode = $('.max-w-\\[1420px\\]');
    if (mainNode.length === 0) mainNode = $('body > div').first();
    if (mainNode.length === 0) mainNode = $('body');

    // Rename class -> className, for -> htmlFor
    $('[class]').each((i, el) => {
        $(el).attr('className', $(el).attr('class'));
        $(el).removeAttr('class');
    });
    $('[for]').each((i, el) => {
        $(el).attr('htmlFor', $(el).attr('for'));
        $(el).removeAttr('for');
    });
    
    // Fix tabindex
    $('[tabindex]').each((i, el) => {
        $(el).attr('tabIndex', $(el).attr('tabindex'));
        $(el).removeAttr('tabindex');
    });

    // Replace SVG camelCase props
    const svgProps = [
        'stop-color', 'stop-opacity', 'fill-rule', 'clip-rule', 
        'stroke-width', 'stroke-linecap', 'stroke-linejoin', 
        'stroke-miterlimit', 'stroke-dasharray', 'vector-effect', 'clip-path'
    ];
    svgProps.forEach(prop => {
        let camel = prop.split('-').map((w, i) => i === 0 ? w : w[0].toUpperCase() + w.slice(1)).join('');
        $('[' + prop + ']').each((i, el) => {
            $(el).attr(camel, $(el).attr(prop));
            $(el).removeAttr(prop);
        });
    });

    // Fix nested a tags: find all a tags that have a tags inside them, make the outer a div
    $('a').each((i, el) => {
        if ($(el).find('a').length > 0) {
            el.tagName = 'div';
            let href = $(el).attr('href');
            if (href) {
                $(el).attr('data-href', href);
                $(el).removeAttr('href');
            }
        }
    });

    // Convert inline styles crudely to objects (if they exist)
    $('[style]').each((i, el) => {
        let styleStr = $(el).attr('style');
        if (styleStr) {
            // A crude parser for style="color: red; opacity: 1;" -> {{ color: "red", opacity: "1" }}
            let rules = styleStr.split(';').filter(Boolean);
            let objStr = rules.map(rule => {
                let parts = rule.split(':');
                if (parts.length < 2) return '';
                let k = parts[0].trim();
                let v = parts.slice(1).join(':').trim();
                
                // Convert to camelCase unless it's a CSS variable
                if (!k.startsWith('--')) {
                    k = k.replace(/-([a-z])/g, g => g[1].toUpperCase());
                } else {
                    k = `'${k}'`; // wrap css vars in quotes
                }
                v = v.replace(/"/g, "'"); // replace double quotes with single
                return `${k}: "${v}"`;
            }).filter(Boolean).join(', ');
            
            if (objStr) {
                $(el).removeAttr('style');
                $(el).attr('style', `{{ ${objStr} }}`); // Note: Cheerio escapes brackets in attrs usually? Wait.
                // We'll fix `{` and `}` later in the raw string. Let's just use a special placeholder.
                $(el).attr('__react_style', `{ ${objStr} }`);
            }
        }
    });

    // Dump outer HTML of the main node
    let out = $.html(mainNode);
    
    // Cheerio converts empty tags to paired sometimes or escapes differently.
    // Ensure void elements are properly self-closed for JSX.
    out = out.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?!\/)>([^<]*?)<\/\1>/gi, '<$1$2 />');
    out = out.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?!\/)\/?>/gi, '<$1$2 />');

    // Fix the __react_style placeholder
    out = out.replace(/__react_style="\{([^}]+)\}"/g, 'style={{$1}}');
    
    // Decode entities like &amp; inside standard text, but JSX often requires fixing them anyway
    // For simplicity, we wrap everything in the page component.

    return `export default function Page() {\n  return (\n    <>\n      ${out}\n    </>\n  );\n}`;
}

const routes = [
    { in: 'docs/research/dump/jobs_body.html', out: 'src/app/jobs/page.tsx' },
    { in: 'docs/research/dump/launchpad_body.html', out: 'src/app/launchpad/[[...slug]]/page.tsx' },
    { in: 'docs/research/dump/articles_body.html', out: 'src/app/articles/page.tsx' },
    { in: 'docs/research/dump/search_body.html', out: 'src/app/search/page.tsx' },
    { in: 'docs/research/dump/blog_body.html', out: 'src/app/blog/page.tsx' },
    { in: 'docs/research/dump/ads_body.html', out: 'src/app/ads/page.tsx' }
];

routes.forEach(route => {
    try {
        fs.mkdirSync(path.dirname(route.out), { recursive: true });
        const html = fs.readFileSync(route.in, 'utf8');
        const tsx = convertToReact(html);
        
        // Final cleanup for class -> className that cheerio might miss in some forms
        let finalTsx = tsx.replace(/ class="/g, ' className="');
        fs.writeFileSync(route.out, finalTsx);
        console.log('Written:', route.out);
    } catch (e) {
        console.error('Failed to process ' + route.in + ':', e.message);
    }
});
