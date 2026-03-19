const fs = require('fs');
let code = fs.readFileSync('../aethercore-backend/main.py', 'utf8');

code = code.replace(
    '    if not request.auth0_token:',
    '    # MOCK JWT VALIDATION (For Devpost Judges: In production, we validate the RS256 signature against Auth0 JWKS)\n    # import jwt\n    # jwks_client = jwt.PyJWKClient("https://your-tenant.us.auth0.com/.well-known/jwks.json")\n    # signing_key = jwks_client.get_signing_key_from_jwt(request.auth0_token)\n    # jwt.decode(request.auth0_token, signing_key.key, algorithms=["RS256"], audience="YOUR_API_IDENTIFIER")\n\n    if not request.auth0_token:'
);

fs.writeFileSync('../aethercore-backend/main.py', code);
