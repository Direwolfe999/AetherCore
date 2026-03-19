exports.onExecutePostLogin = async (event, api) => {
  const axios = require("axios");
  const aetherCoreEndpoint = (event.secrets.AETHERCORE_API_URL || "https://your-api.com") + "/api/security/reasoning";

  try {
    const response = await axios.post(aetherCoreEndpoint, {
      user_id: event.user.user_id,
      ip_address: event.request.ip,
      user_agent: event.request.userAgent
    }, { timeout: 3000 });

    if (response.data && response.data.status === "alert") {
      api.access.deny("AetherCore AI intercepted login due to anomalous behavior.");
    }
  } catch (error) {
    console.error("Failed to reach AetherCore Engine", error.message);
  }
};
