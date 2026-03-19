const fs = require('fs');
let code = fs.readFileSync('src/components/layout/navbar.tsx', 'utf8');

// The code already wraps the logo in a <Link href="/dashboard" ...>. 
// We want to change the href to "/" which is the baseUrl.
code = code.replace(
    '<Link href="/dashboard" className="flex items-center gap-3">',
    '<Link href="/" className="flex items-center gap-3">'
);

fs.writeFileSync('src/components/layout/navbar.tsx', code);
