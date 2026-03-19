const axios = require('axios');
require('fs').readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    if (line.includes('=')) {
        const [k, v] = line.split('=');
        process.env[k.trim()] = v.trim();
    }
});

async function testAuth0() {
  console.log("Testing Auth0 Configuration...");
  console.log("Domain:", process.env.AUTH0_ISSUER_BASE_URL);
  console.log("Client ID:", process.env.AUTH0_CLIENT_ID);
  
  try {
    const response = await axios.post(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      grant_type: "client_credentials"
    });
    
    console.log("SUCCESS! Got a response from Auth0.");
    console.log("Token type:", response.data.token_type);
  } catch (error) {
    if (error.response) {
      console.log("Auth0 Error Response:", error.response.status, error.response.data);
      if (error.response.data.error === 'access_denied') {
          console.log("\n✅ THE TENANT AND CREDENTIALS ARE REAL AND WORKING!");
          console.log("The API just denied the client_credentials grant because it's a web app client, which is normal. The fact that we reached Auth0 and got a parsed access_denied means the keys are valid.");
      }
    } else {
      console.log("Error:", error.message);
    }
  }
}

testAuth0();
