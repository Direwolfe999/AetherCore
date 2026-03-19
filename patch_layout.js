const fs = require('fs');
let code = fs.readFileSync('src/app/layout.tsx', 'utf8');

code = code.replace(
    "import { Auth0Provider as UserProvider } from '@auth0/nextjs-auth0';",
    "import { UserProvider } from '@auth0/nextjs-auth0/client';"
);

fs.writeFileSync('src/app/layout.tsx', code);
