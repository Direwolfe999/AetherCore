import asyncio
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

import httpx

logger = logging.getLogger(__name__)


class GoogleClient:
    """Google OAuth API client for syncing calendar and contacts data."""
    
    BASE_URL = "https://www.googleapis.com"
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.session: Optional[httpx.AsyncClient] = None
    
    async def __aenter__(self):
        self.session = httpx.AsyncClient(
            headers={"Authorization": f"Bearer {self.access_token}"},
            timeout=10.0
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.aclose()
    
    async def get_calendar_events(
        self,
        max_results: int = 10,
        time_min: Optional[datetime] = None,
        time_max: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch upcoming calendar events from Google Calendar.
        
        Args:
            max_results: Maximum number of events to return
            time_min: Start time filter (defaults to now)
            time_max: End time filter (defaults to now + 7 days)
        
        Returns:
            List of calendar events with title, start time, end time, attendees
        """
        if not self.session:
            logger.error("Google client not in async context")
            return []
        
        now = datetime.utcnow()
        time_min = time_min or now
        time_max = time_max or (now + timedelta(days=7))
        
        params = {
            "maxResults": max_results,
            "timeMin": time_min.isoformat() + "Z",
            "timeMax": time_max.isoformat() + "Z",
            "orderBy": "startTime",
            "singleEvents": "true"
        }
        
        try:
            logger.info("Fetching Google Calendar events")
            response = await self.session.get(
                f"{self.BASE_URL}/calendar/v3/calendars/primary/events",
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            events = []
            for item in data.get("items", []):
                event = {
                    "id": item.get("id"),
                    "summary": item.get("summary", "(No title)"),
                    "start": item.get("start", {}).get("dateTime") or item.get("start", {}).get("date"),
                    "end": item.get("end", {}).get("dateTime") or item.get("end", {}).get("date"),
                    "attendees": [a.get("email") for a in item.get("attendees", [])],
                    "organizer": item.get("organizer", {}).get("email"),
                    "description": item.get("description", "")
                }
                events.append(event)
            
            logger.info(f"Retrieved {len(events)} calendar events")
            return events
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch calendar events: {e}")
            return []
    
    async def get_contacts(self, max_results: int = 50) -> List[Dict[str, Any]]:
        """
        Fetch contacts from Google People API.
        
        Args:
            max_results: Maximum number of contacts to return
        
        Returns:
            List of contacts with name, email, phone number
        """
        if not self.session:
            logger.error("Google client not in async context")
            return []
        
        params = {
            "pageSize": max_results,
            "personFields": "names,emailAddresses,phoneNumbers,organizations"
        }
        
        try:
            logger.info("Fetching Google Contacts")
            response = await self.session.get(
                f"{self.BASE_URL}/people/v1/people/me/connections",
                params=params
            )
            response.raise_for_status()
            data = response.json()
            
            contacts = []
            for person in data.get("connections", []):
                contact = {
                    "id": person.get("resourceName"),
                    "name": person.get("names", [{}])[0].get("displayName", ""),
                    "emails": [e.get("value") for e in person.get("emailAddresses", [])],
                    "phones": [p.get("value") for p in person.get("phoneNumbers", [])],
                    "organization": person.get("organizations", [{}])[0].get("name", "") if person.get("organizations") else ""
                }
                contacts.append(contact)
            
            logger.info(f"Retrieved {len(contacts)} contacts")
            return contacts
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch contacts: {e}")
            return []
    
    async def get_gmail_labels(self) -> List[Dict[str, Any]]:
        """
        Fetch Gmail labels to understand mailbox structure.
        
        Returns:
            List of labels with id, name, message/thread counts
        """
        if not self.session:
            logger.error("Google client not in async context")
            return []
        
        try:
            logger.info("Fetching Gmail labels")
            response = await self.session.get(
                f"{self.BASE_URL}/gmail/v1/users/me/labels"
            )
            response.raise_for_status()
            data = response.json()
            
            labels = []
            for label in data.get("labels", []):
                lb = {
                    "id": label.get("id"),
                    "name": label.get("name"),
                    "message_count": label.get("messagesTotal", 0),
                    "unread_count": label.get("messagesUnread", 0),
                    "thread_count": label.get("threadsTotal", 0)
                }
                labels.append(lb)
            
            logger.info(f"Retrieved {len(labels)} Gmail labels")
            return labels
            
        except httpx.HTTPError as e:
            logger.error(f"Failed to fetch Gmail labels: {e}")
            return []
    
    async def verify_token(self) -> bool:
        """
        Verify the access token is valid by making a simple API call.
        
        Returns:
            True if token is valid, False otherwise
        """
        if not self.session:
            logger.error("Google client not in async context")
            return False
        
        try:
            response = await self.session.get(
                f"{self.BASE_URL}/oauth2/v2/userinfo"
            )
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return False
