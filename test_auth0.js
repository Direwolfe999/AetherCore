const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

async function testAuth0() {
  console.log("Testing Auth0 Configuration...");
  console.log("Domain:", process.env.AUTH0_ISSUER_BASE_URL);
  console.log("Client ID:", process.env.AUTH0_CLIENT_ID);
  
  try {
    // Attempt Client Credentials Grant
    // Note: This requires the application to be authorized for a specific API in Auth0 (M2M)
    // If it's just a web app, this might return 401/403, which is still a valid response indicating the app exists
    const response = await axios.post(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      grant_type: "client_credentials"
    });
    
    console.log("SUCCESS! Got a response from Auth0.");
    console.log("Token type:", response.data.token_type);
    console.log("Access token recieved (length):", response.data.access_token.length);
  } catch (error) {
    if (error.response) {
      console.log("Auth0 Error Response:", error.response.status, error.response.data);
      if (error.response.data.error === 'access_denied' && error.response.data.error_description.includes('Unauthorized')) {
          console.log("The client is valid, but it needs to be authorized for the Management API to get a client_credentials token.");
          console.log("This means your credentials ARE hitting Auth0 correctly!");
      }
    } else {
      console.log("Error:", error.message);
    }
  }
}

testAuth0();
