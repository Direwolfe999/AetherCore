const fs = require('fs');

const authRoutePath = './src/app/api/auth/[auth0]/route.ts';
let code = fs.readFileSync(authRoutePath, 'utf8');

// Revert back to just exporting handleAuth as the v3.5.0 auth handler doesn't expect wrapping like that.
code = `import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
`;

fs.writeFileSync(authRoutePath, code);
console.log('Fixed route.ts');
