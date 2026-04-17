const fs = require('fs');
const html = fs.readFileSync('docs/research/dump/peerlist_body.html', 'utf-8');
const cheerio = require('cheerio'); // wait, do I have cheerio?
// let me check. If not, I'll use simple JS parsing
