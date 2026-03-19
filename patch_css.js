const fs = require('fs');
let code = fs.readFileSync('src/app/globals.css', 'utf8');

const lockCSS = `
/* Disable selection globally */
html, body {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
/* Re-enable for inputs if we have them */
input, textarea {
  -webkit-user-select: auto;
  user-select: auto;
}
`;

if (!code.includes('-webkit-touch-callout')) {
    fs.writeFileSync('src/app/globals.css', code + '\n' + lockCSS);
}
