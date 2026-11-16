export function parse(src) {
if (!src) return '';
let lines = src.replace(/\r\n?/g, '\n').split('\n');
if (lines.length && lines[lines.length - 1] === '') lines.pop();
let refs = {};
let out = [];
// Parse link reference definitions in first pass (simplified or collected)
// Block parsing
for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  if (!line.trim()) continue;
  // ATX headings
  let m = line.match(/^(#{1,6})(?:\s+(.+))?$/);
  if (m) {
    let hashes = m[1].length;
    let text = (m[2] || '').trim().replace(/#+$/, '').trim();
    out.push(`<h${hashes}>${parseInline(text, refs)}</h${hashes}>\n`);
    continue;
  }
  // Thematic break
  if (/^(?:[*\-_]\s*){3,}$/.test(line)) {
    out.push('<hr>\n');
    continue;
  }
  // Paragraph fallback
  out.push(`<p>${parseInline(line, refs)}</p>\n`);
}
return out.join('');
}

function isAsciiPunctuation(code) {
  return (code >= 0x21 && code <= 0x2F) ||
         (code >= 0x3A && code <= 0x40) ||
         (code >= 0x5B && code <= 0x60) ||
         (code >= 0x7B && code <= 0x7E);
}

function escapeHtml(str) {
  let res = '';
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code === 38) res += '&amp;';
    else if (code === 60) res += '&lt;';
    else if (code === 62) res += '&gt;';
    else if (code === 34) res += '&quot;';
    else if (code === 39) res += '&#39;';
    else res += str[i];
  }
  return res;
}

function parseInline(str, refs) {
  let res = '';
  let i = 0;
  let len = str.length;
  while (i < len) {
    let code = str.charCodeAt(i);
    if (code === 92 && i + 1 < len) {
      let nextCode = str.charCodeAt(i + 1);
      if (isAsciiPunctuation(nextCode)) {
        res += str[i + 1];
        i += 2;
        continue;
      } else {
        res += '\\';
        i += 1;
        continue;
      }
    }
    if (code === 96) {
      let startTicks = i;
      while (i < len && str.charCodeAt(i) === 96) {
        i++;
      }
      let numTicks = i - startTicks;
      let closingIdx = -1;
      let searchIdx = i;
      while (searchIdx < len) {
        if (str.charCodeAt(searchIdx) === 96) {
          let runStart = searchIdx;
          while (searchIdx < len && str.charCodeAt(searchIdx) === 96) {
            searchIdx++;
          }
          if (searchIdx - runStart === numTicks) {
            closingIdx = runStart;
            break;
          }
        } else {
          searchIdx++;
        }
      }
      if (closingIdx === -1) {
        res += escapeHtml(str.slice(startTicks, i));
      } else {
        let rawContent = str.slice(i, closingIdx);
        let content = rawContent.replace(/\r\n|\n/g, ' ');
        if (content.length >= 2 && content.charCodeAt(0) === 32 && content.charCodeAt(content.length - 1) === 32) {
          let allSpaces = true;
          for (let k = 0; k < content.length; k++) {
            if (content.charCodeAt(k) !== 32) {
              allSpaces = false;
              break;
            }
          }
          if (!allSpaces) {
            content = content.slice(1, content.length - 1);
          }
        }
        res += '<code>' + escapeHtml(content) + '</code>';
        i = searchIdx;
      }
      continue;
    }
    if (code === 38) {
      res += '&amp;';
    } else if (code === 60) {
      res += '&lt;';
    } else if (code === 62) {
      res += '&gt;';
    } else if (code === 34) {
      res += '&quot;';
    } else if (code === 39) {
      res += '&#39;';
    } else {
      res += str[i];
    }
    i++;
  }
  return res;
}
