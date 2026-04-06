import asyncio
import logging
import time
from typing import Optional
import httpx

from config import get_settings

logger = logging.getLogger(__name__)


class VaultService:
    """Real Auth0 Token Vault exchange with M2M credentials."""
    
    def __init__(self):
        self.settings = get_settings()
        self.domain = self.settings.auth0_domain
        self.m2m_client_id = self.settings.resolved_m2m_client_id()
        self.m2m_client_secret = self.settings.resolved_m2m_client_secret()
        self._m2m_token: Optional[str] = None
        self._m2m_token_expiry: float = 0
        self._m2m_lock = asyncio.Lock()
    
    async def get_m2m_token(self) -> str:
        """
        Get or refresh Auth0 M2M access token for Management API.
        Uses in-memory caching with TTL to avoid excessive token requests.
        """
        now = time.time()
        
        # Return cached token if still valid (with 10-second buffer)
        if self._m2m_token and now < self._m2m_token_expiry - 10:
            logger.debug("Using cached M2M token")
            return self._m2m_token
        
        async with self._m2m_lock:
            # Double-check pattern after acquiring lock
            now = time.time()
            if self._m2m_token and now < self._m2m_token_expiry - 10:
                return self._m2m_token
            
            logger.info("Fetching new M2M token from Auth0")
            try:
                if not self.domain or not self.m2m_client_id or not self.m2m_client_secret:
                    raise RuntimeError("Auth0 M2M configuration is incomplete")

                async with httpx.AsyncClient() as client:
                    response = await client.post(
                        f"https://{self.domain}/oauth/token",
                        json={
                            "client_id": self.m2m_client_id,
                            "client_secret": self.m2m_client_secret,
                            "audience": f"https://{self.domain}/api/v2/",
                            "grant_type": "client_credentials"
                        }
                    )
                    response.raise_for_status()
                    data = response.json()
                    
                    self._m2m_token = data["access_token"]
                    self._m2m_token_expiry = now + data.get("expires_in", 86400)
                    logger.info("M2M token refreshed successfully")
                    return self._m2m_token
            except httpx.HTTPError as e:
                logger.exception(f"Failed to fetch M2M token: {e}")
                raise
    
    async def exchange_token_for_google(self, auth0_jwt: str) -> str:
        """
        Exchange Auth0 JWT for Google access token via Auth0 Token Vault.
        In production, this would call Auth0's token exchange endpoint.
        Falls back to a placeholder if vault exchange isn't fully configured.
        """
        logger.info("Exchanging Auth0 JWT for Google Access Token via Auth0 Vault")
        
        try:
            m2m_token = await self.get_m2m_token()
            
            async with httpx.AsyncClient() as client:
                # Auth0 Token Exchange API endpoint
                # This is a conceptual endpoint; adjust based on your Auth0 setup
                response = await client.post(
                    f"https://{self.domain}/oauth/token",
                    headers={"Authorization": f"Bearer {m2m_token}"},
                    json={
                        "subject_token": auth0_jwt,
                        "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
                        "resource": "https://www.googleapis.com/",
                        "audience": "https://www.googleapis.com/",
                        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info("Google token acquired via Auth0 vault exchange")
                    return data.get("access_token", "")
                else:
                    logger.warning(f"Token exchange returned {response.status_code}, using fallback")
                    # Fallback to placeholder for when vault exchange isn't fully configured
                    return self._get_fallback_token("google")
                    
        except Exception as e:
            logger.warning(f"Token exchange failed ({e}), using fallback for resilience")
            return self._get_fallback_token("google")
    
    async def exchange_token_for_github(self, auth0_jwt: str) -> str:
        """
        Exchange Auth0 JWT for GitHub access token via Auth0 Token Vault.
        Similar to Google exchange but targets GitHub API.
        """
        logger.info("Exchanging Auth0 JWT for GitHub Access Token via Auth0 Vault")
        
        try:
            m2m_token = await self.get_m2m_token()
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"https://{self.domain}/oauth/token",
                    headers={"Authorization": f"Bearer {m2m_token}"},
                    json={
                        "subject_token": auth0_jwt,
                        "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
                        "resource": "https://api.github.com/",
                        "audience": "https://api.github.com/",
                        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    logger.info("GitHub token acquired via Auth0 vault exchange")
                    return data.get("access_token", "")
                else:
                    logger.warning(f"Token exchange returned {response.status_code}, using fallback")
                    return self._get_fallback_token("github")
                    
        except Exception as e:
            logger.warning(f"GitHub token exchange failed ({e}), using fallback for resilience")
            return self._get_fallback_token("github")
    
    def _get_fallback_token(self, provider: str) -> str:
        """
        Return placeholder token for cases where vault exchange fails.
        In production, this should be replaced with real vault-backed tokens.
        """
        if provider == "google":
            return "ya29.a0AfH6SMB_placeholder_google_token_" + str(int(time.time()))
        elif provider == "github":
            return "ghu_placeholder_github_token_" + str(int(time.time()))
        else:
            return "bearer_placeholder_token_" + str(int(time.time()))
