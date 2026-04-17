const fs = require('fs');
const cheerio = require('cheerio');
const path = require('path');

function convertToReact(html) {
    let $ = cheerio.load(html, { xmlMode: false, decodeEntities: false });

    let mainNode = $('.max-w-\\[1420px\\]');
    if (mainNode.length === 0) mainNode = $('body > div').first();
    if (mainNode.length === 0) mainNode = $('body');

    // Remove the blocking pixel transition overlay and portals BEFORE class to className changes
    $('.pixel-transition-container').remove();
    $('#portal').remove();
    $('#pl-tooltip-portal').remove();
    $('#__next-build-watcher').remove();
    $('.__react_component_tooltip').remove();

    $('[class]').each((i, el) => {
        $(el).attr('className', $(el).attr('class'));
        $(el).removeAttr('class');
    });
    $('[for]').each((i, el) => {
        $(el).attr('htmlFor', $(el).attr('for'));
        $(el).removeAttr('for');
    });
    
    $('[tabindex]').removeAttr('tabindex');

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

    $('number-flow-react').each((i, el) => {
        el.tagName = 'span';
        let label = $(el).attr('aria-label');
        if (label) $(el).text(label);
        $(el).removeAttr('data');
    });

    $('[xmlns\\:xlink]').each((i, el) => {
        $(el).attr('xmlnsXlink', $(el).attr('xmlns:xlink'));
        $(el).removeAttr('xmlns:xlink');
    });
    $('a').each((i, el) => {
        if ($(el).find('a').length > 0) {
            el.tagName = 'div';
            let href = $(el).attr('href');
            if (href) {
                $(el).attr('data-href', href);
                $(el).removeAttr('href');
            }
        } else {
            let href = $(el).attr('href');
            if (href && href.startsWith('/')) {
                el.tagName = 'NextLink';
            }
        }
    });


    // Remove problematic attributes
    $('[currentitem]').removeAttr('currentitem');
    $('div[type], span[type]').removeAttr('type');
    $('button[href]').removeAttr('href');
    $('button[label]').removeAttr('label');
    $('input[label]').removeAttr('label');
    
    // Strip ALL style tags to avoid TS syntax errors. We will lose inline bg-images, but layout will build.
    $('[style]').removeAttr('style');

    // Strip ALL script tags since they contain raw JS that breaks JSX and we don't need their analytics/bundle
    $('script').remove();
    $('style').remove();
    let out = $.html(mainNode);
    out = out.replace(/xmlns:xlink=/g, 'xmlnsXlink=');
    // Regex fallback just in case cheerio missed it or it was re-added somehow
    out = out.replace(/<div class="pixel-transition-container.*?<\/div><\/div><\/div>/g, '');
    out = out.replace(/<div className="pixel-transition-container.*?<\/div><\/div><\/div>/g, '');
    // Self-close void elements
    out = out.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?!\/)>([^<]*?)<\/\1>/gi, '<$1$2 />');
    out = out.replace(/<(img|input|br|hr|meta|link)([^>]*?)(?!\/)\/?>/gi, '<$1$2 />');

    // Replace unescaped { and } in text nodes outside of tags
    // First, strip all style attributes to prevent TSX object/string literal errors.
    out = out.replace(/ style="[^"]*"/g, '');
    out = out.replace(/ style='[^']*'/g, '');
    out = out.replace(/ style=\{[^}]*\}/g, '');
    // Replace HTML comments
    out = out.replace(/<!--[\s\S]*?-->/g, '');

    // A simple hack: replace { with &#123; and } with &#125;
    // We only have className="...". So replacing `{` and `}` globally is safe for this ripped HTML!
    out = out.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
    return `import Link from 'next/link';\n\nexport default function Page() {\n  return (\n    <>\n      ${out}\n    </>\n  );\n}`;
}

const routes = [
    { in: 'docs/research/dump/jobs_body.html', out: 'src/app/jobs/page.tsx' },
    { in: 'docs/research/dump/launchpad_body.html', out: 'src/app/launchpad/[[...slug]]/page.tsx' },
    { in: 'docs/research/dump/articles_body.html', out: 'src/app/articles/page.tsx' },
    { in: 'docs/research/dump/search_body.html', out: 'src/app/search/page.tsx' },
    { in: 'docs/research/dump/blog_body.html', out: 'src/app/blog/page.tsx' },
    { in: 'docs/research/dump/ads_body.html', out: 'src/app/ads/page.tsx' },
    { in: 'docs/research/dump/scroll_body.html', out: 'src/app/scroll/page.tsx' },
    { in: 'docs/research/dump/peerlist_body.html', out: 'src/app/page.tsx' }
];

routes.forEach(route => {
    try {
        fs.mkdirSync(path.dirname(route.out), { recursive: true });
        const html = fs.readFileSync(route.in, 'utf8');
        const tsx = convertToReact(html);
        let finalTsx = tsx.replace(/ class="/g, ' className="');
        finalTsx = finalTsx.replace(/<NextLink/g, '<Link');
        finalTsx = finalTsx.replace(/<\/NextLink>/g, '</Link>');
        finalTsx = finalTsx.replace(/ (disabled|required|readonly|checked|autofocus|multiple)=""/g, ' $1');
        finalTsx = finalTsx.replace(/ readonly/g, ' readOnly');
        finalTsx = finalTsx.replace(/xlink:href/g, 'xlinkHref');
        finalTsx = finalTsx.replace(/autocapitalize/g, 'autoCapitalize');
        finalTsx = finalTsx.replace(/autocomplete/g, 'autoComplete');
        finalTsx = finalTsx.replace(/autocorrect/g, 'autoCorrect');
        finalTsx = finalTsx.replace(/spellcheck/g, 'spellCheck');
        finalTsx = finalTsx.replace(/maxlength/g, 'maxLength');
        finalTsx = finalTsx.replace(/ small=""/g, ' data-small=""');
        fs.writeFileSync(route.out, finalTsx);
        console.log('Written:', route.out);
    } catch (e) {
        console.error('Failed to process ' + route.in + ':', e.message);
    }
});
