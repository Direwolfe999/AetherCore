import logging
from typing import List, Dict, Any, Optional

import httpx

logger = logging.getLogger(__name__)


class GitHubClient:
    """GitHub OAuth API client for syncing repository and organization data."""
    
    BASE_URL = "https://api.github.com"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.session: Optional[httpx.AsyncClient] = None
    
    async def __aenter__(self):
        self.session = httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {self.access_token}",
                "Accept": "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28"
            },
            timeout=10.0
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.aclose()
    
    async def get_user_info(self) -> Optional[Dict[str, Any]]:
        """
        Fetch authenticated user information.
        
        Returns:
            Dictionary with user login, name, company, bio, etc.
        """
        if not self.session:
            logger.error("GitHub client not in async context")
            return None
        
        try:
            logger.info("Fetching GitHub user info")
            response = await self.session.get(f"{self.BASE_URL}/user")
            response.raise_for_status()
            data = response.json()
            
            user_info = {
                "login": data.get("login"),
                "id": data.get("id"),
                "name": data.get("name"),
                "company": data.get("company"),
                "location": data.get("location"),
                "bio": data.get("bio"),
                "public_repos": data.get("public_repos"),
                "followers": data.get("followers"),
                "following": data.get("following"),
                "created_at": data.get("created_at")
            }
            
            logger.info(f"Retrieved user info for {user_info.get('login')}")
            return user_info
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch user info: {e}")
            return None
    
    async def get_repositories(self, max_results: int = 30) -> List[Dict[str, Any]]:
        """
        Fetch user repositories.
        
        Args:
            max_results: Maximum number of repositories to return
        
        Returns:
            List of repositories with name, description, stars, language, etc.
        """
        if not self.session:
            logger.error("GitHub client not in async context")
            return []
        
        params = {
            "type": "owner",
            "sort": "updated",
            "direction": "desc",
            "per_page": max_results
        }
        
        try:
            logger.info("Fetching GitHub repositories")
            response = await self.session.get(
                f"{self.BASE_URL}/user/repos",
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            repos = []
            for repo in data:
                r = {
                    "id": repo.get("id"),
                    "name": repo.get("name"),
                    "full_name": repo.get("full_name"),
                    "description": repo.get("description"),
                    "url": repo.get("html_url"),
                    "stars": repo.get("stargazers_count"),
                    "forks": repo.get("forks_count"),
                    "language": repo.get("language"),
                    "is_private": repo.get("private"),
                    "updated_at": repo.get("updated_at"),
                    "topics": repo.get("topics", [])
                }
                repos.append(r)
            
            logger.info(f"Retrieved {len(repos)} repositories")
            return repos
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch repositories: {e}")
            return []
    
    async def get_organizations(self) -> List[Dict[str, Any]]:
        """
        Fetch organizations the user is a member of.
        
        Returns:
            List of organizations with login, name, type, etc.
        """
        if not self.session:
            logger.error("GitHub client not in async context")
            return []
        
        try:
            logger.info("Fetching GitHub organizations")
            response = await self.session.get(f"{self.BASE_URL}/user/orgs")
            response.raise_for_status()
            data = response.json()
            
            orgs = []
            for org in data:
                o = {
                    "id": org.get("id"),
                    "login": org.get("login"),
                    "type": org.get("type"),
                    "avatar_url": org.get("avatar_url"),
                    "url": org.get("html_url")
                }
                orgs.append(o)
            
            logger.info(f"Retrieved {len(orgs)} organizations")
            return orgs
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch organizations: {e}")
            return []
    
    async def get_pull_requests(self, state: str = "open", max_results: int = 20) -> List[Dict[str, Any]]:
        """
        Fetch pull requests for user's repositories.
        
        Args:
            state: PR state filter ("open", "closed", "all")
            max_results: Maximum number of PRs to return
        
        Returns:
            List of pull requests with title, state, created_at, etc.
        """
        if not self.session:
            logger.error("GitHub client not in async context")
            return []
        
        params = {
            "state": state,
            "per_page": max_results,
            "sort": "updated",
            "direction": "desc"
        }
        
        try:
            logger.info(f"Fetching GitHub {state} pull requests")
            response = await self.session.get(
                f"{self.BASE_URL}/user/pulls",
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            prs = []
            for pr in data:
                p = {
                    "id": pr.get("id"),
                    "number": pr.get("number"),
                    "title": pr.get("title"),
                    "state": pr.get("state"),
                    "url": pr.get("html_url"),
                    "created_at": pr.get("created_at"),
                    "updated_at": pr.get("updated_at"),
                    "repository": pr.get("head", {}).get("repo", {}).get("full_name"),
                    "author": pr.get("user", {}).get("login")
                }
                prs.append(p)
            
            logger.info(f"Retrieved {len(prs)} pull requests")
            return prs
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch pull requests: {e}")
            return []
    
    async def verify_token(self) -> bool:
        """
        Verify the access token is valid by making a simple API call.
        
        Returns:
            True if token is valid, False otherwise
        """
        if not self.session:
            logger.error("GitHub client not in async context")
            return False
        
        try:
            response = await self.session.get(f"{self.BASE_URL}/user")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return False
