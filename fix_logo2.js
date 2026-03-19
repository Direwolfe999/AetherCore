const fs = require('fs');
let code = fs.readFileSync('src/components/layout/navbar.tsx', 'utf8');

code = code.replace(
    '<Link href="/dashboard" className="flex items-center gap-3 transition-all duration-300 hover:opacity-80">',
    '<Link href="/" className="flex items-center gap-3 transition-all duration-300 hover:opacity-80">'
);

fs.writeFileSync('src/components/layout/navbar.tsx', code);
