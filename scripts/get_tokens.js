JSON.stringify({
  colors: [...new Set([...document.querySelectorAll('*')].slice(0, 200).map(el => getComputedStyle(el).backgroundColor).filter(c => c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent'))],
  fonts: [...new Set([...document.querySelectorAll('*')].slice(0, 200).map(el => getComputedStyle(el).fontFamily))]
});