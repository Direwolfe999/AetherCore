const fs = require('fs');
let code = fs.existsSync('.env.local') ? fs.readFileSync('.env.local', 'utf8') : '';

const newEnv = `
AUTH0_SECRET='use-a-long-random-string-here-minimum-32-chars-long-lol12345'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://aethercore.uk.auth0.com'
AUTH0_CLIENT_ID='YOUR_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_CLIENT_SECRET'
`;

if (!code.includes('AUTH0_SECRET')) {
    fs.writeFileSync('.env.local', code + '\n' + newEnv);
}
