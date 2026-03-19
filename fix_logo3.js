const fs = require('fs');
let code = fs.readFileSync('src/components/layout/navbar.tsx', 'utf8');

// The code contains <Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:opacity-80">
// Change this to use a standard HTML <a> tag to force a true hard-reload to the landing page.
code = code.replace(
    '<Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:opacity-80">',
    '<a href="/" className="flex items-center gap-3 transition-all duration-300 hover:opacity-80 cursor-pointer">'
);

// We need to match the closing tag. The previous code had </Link> but replacing it specifically in that block can be tricky.
code = code.replace(
    /<\/p>\s*<\/div>\s*<\/Link>/m,
    '</p>\n                        </div>\n                    </a>'
);

fs.writeFileSync('src/components/layout/navbar.tsx', code);
