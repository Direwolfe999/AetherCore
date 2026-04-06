import asyncio
import json
import os
import logging
from datetime import datetime
from typing import Optional, Dict, Any, List

from engine.models import ThreatAnalysisResponse
from integrations.google_client import GoogleClient
from integrations.github_client import GitHubClient

logger = logging.getLogger(__name__)


class SyncEngine:
    """
    Real-time data syncing and threat analysis engine.
    Fetches live data from Google and GitHub, then runs Mojo analysis.
    """
    
    def __init__(self):
        self.mojo_binary_path = os.path.join(os.path.dirname(__file__), "..", "engine", "analyzer.mojo")
    
    async def run_mojo_analysis(self, data_summary: Dict[str, Any]) -> ThreatAnalysisResponse:
        """
        Run Mojo analyzer on synced data for threat detection.
        Falls back to analysis without Mojo if binary unavailable.
        
        Args:
            data_summary: Summary of synced data for analysis context
        
        Returns:
            ThreatAnalysisResponse with confidence score and recommendations
        """
        logger.info("Triggering Mojo Scanner for threat analysis")
        
        try:
            # Prepare JSON input for Mojo analyzer
            analysis_input = json.dumps({
                "calendar_event_count": data_summary.get("calendar_events", 0),
                "unknown_attendee_count": data_summary.get("unknown_attendees", 0),
                "suspicious_domains": data_summary.get("suspicious_domains", []),
                "repo_count": data_summary.get("repos", 0),
                "recent_deployments": data_summary.get("recent_deployments", 0),
                "access_pattern_anomalies": data_summary.get("access_anomalies", [])
            }).encode()
            
            # Attempt to spawn Mojo process
            process = await asyncio.create_subprocess_exec(
                "mojo", "run", self.mojo_binary_path,
                stdin=asyncio.subprocess.PIPE,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await asyncio.wait_for(
                process.communicate(input=analysis_input),
                timeout=30.0
            )
            
            if process.returncode == 0:
                try:
                    output_json = json.loads(stdout.decode().strip())
                    logger.info("Mojo analysis completed successfully")
                    return ThreatAnalysisResponse(**output_json)
                except (json.JSONDecodeError, ValueError) as e:
                    logger.warning(f"Failed to parse Mojo output: {e}, using fallback")
                    return self._fallback_analysis(data_summary)
            else:
                logger.warning(f"Mojo process failed: {stderr.decode()}, using fallback")
                return self._fallback_analysis(data_summary)
                
        except asyncio.TimeoutError:
            logger.warning("Mojo analysis timeout, using fallback")
            return self._fallback_analysis(data_summary)
        except Exception as e:
            logger.warning(f"Error running Mojo: {e}, using fallback")
            return self._fallback_analysis(data_summary)
    
    def _fallback_analysis(self, data_summary: Dict[str, Any]) -> ThreatAnalysisResponse:
        """
        Fallback threat analysis when Mojo is unavailable.
        Uses heuristics based on synced data characteristics.
        """
        # Build threat assessment from data patterns
        threats = []
        confidence_base = 45.0
        
        # Check for suspicious patterns
        unknown_attendees = data_summary.get("unknown_attendees", 0)
        if unknown_attendees > 5:
            threats.append("Multiple unknown attendees in calendar events detected")
            confidence_base += 15
        
        suspicious_domains = data_summary.get("suspicious_domains", [])
        if suspicious_domains:
            threats.append(f"Suspicious domains detected: {', '.join(suspicious_domains[:3])}")
            confidence_base += 20
        
        access_anomalies = data_summary.get("access_anomalies", [])
        if access_anomalies:
            threats.append(f"Access pattern anomalies: {', '.join(access_anomalies[:2])}")
            confidence_base += 10
        
        # Ensure confidence is bounded
        confidence_score = min(confidence_base, 98.5)
        
        action_taken = (
            "Enabled enhanced monitoring" if confidence_score > 70
            else "Flagged for review" if confidence_score > 50
            else "Routine monitoring"
        )
        
        return ThreatAnalysisResponse(
            chain_of_thought=[
                f"Analyzed {data_summary.get('calendar_events', 0)} calendar events",
                f"Reviewed {data_summary.get('repos', 0)} repositories",
                f"Detected {len(threats)} risk indicators"
            ] + threats,
            confidence_score=confidence_score,
            action_taken=action_taken
        )
    
    async def sync_google_data(self, google_token: str) -> Dict[str, Any]:
        """
        Fetch live data from Google APIs using provided access token.
        
        Args:
            google_token: Valid Google access token from vault exchange
        
        Returns:
            Dictionary with calendar events, contacts, and summary data
        """
        logger.info("Starting Google data synchronization")
        google_data = {
            "calendar_events": [],
            "contacts": [],
            "gmail_labels": [],
            "unknown_attendees": 0,
            "suspicious_domains": []
        }
        
        try:
            async with GoogleClient(google_token) as client:
                # Verify token is valid before making requests
                if not await client.verify_token():
                    logger.error("Google token verification failed")
                    return google_data
                
                # Fetch calendar events
                events = await client.get_calendar_events(max_results=20)
                google_data["calendar_events"] = events
                logger.info(f"Synced {len(events)} calendar events from Google")
                
                # Analyze attendees for suspicious patterns
                all_attendees = []
                for event in events:
                    all_attendees.extend(event.get("attendees", []))
                
                # Count unknown/external attendees
                known_domains = ["@yourcompany.com", "@gmail.com", "@google.com"]  # Update with real domains
                unknown = sum(1 for a in all_attendees if not any(a.endswith(d) for d in known_domains))
                google_data["unknown_attendees"] = unknown
                
                if unknown > 5:
                    google_data["suspicious_domains"] = list(set(
                        a.split("@")[1] for a in all_attendees
                        if not any(a.endswith(d) for d in known_domains)
                    ))
                
                # Fetch contacts
                contacts = await client.get_contacts(max_results=100)
                google_data["contacts"] = contacts
                logger.info(f"Synced {len(contacts)} contacts from Google")
                
                # Fetch Gmail labels for mailbox assessment
                labels = await client.get_gmail_labels()
                google_data["gmail_labels"] = labels
                logger.info(f"Synced {len(labels)} Gmail labels")
                
        except Exception as e:
            logger.exception(f"Error syncing Google data: {e}")
        
        return google_data
    
    async def sync_github_data(self, github_token: str) -> Dict[str, Any]:
        """
        Fetch live data from GitHub APIs using provided access token.
        
        Args:
            github_token: Valid GitHub access token from vault exchange
        
        Returns:
            Dictionary with repositories, organizations, and activity data
        """
        logger.info("Starting GitHub data synchronization")
        github_data = {
            "user": None,
            "repositories": [],
            "organizations": [],
            "pull_requests": [],
            "repos": 0,
            "recent_deployments": 0,
            "access_anomalies": []
        }
        
        try:
            async with GitHubClient(github_token) as client:
                # Verify token is valid
                if not await client.verify_token():
                    logger.error("GitHub token verification failed")
                    return github_data
                
                # Fetch user info
                user = await client.get_user_info()
                github_data["user"] = user
                logger.info(f"Synced user info for {user.get('login') if user else 'unknown'}")
                
                # Fetch repositories
                repos = await client.get_repositories(max_results=50)
                github_data["repositories"] = repos
                github_data["repos"] = len(repos)
                logger.info(f"Synced {len(repos)} repositories from GitHub")
                
                # Fetch organizations
                orgs = await client.get_organizations()
                github_data["organizations"] = orgs
                logger.info(f"Synced {len(orgs)} organizations from GitHub")
                
                # Fetch pull requests
                prs = await client.get_pull_requests(state="all", max_results=50)
                github_data["pull_requests"] = prs
                logger.info(f"Synced {len(prs)} pull requests from GitHub")
                
                # Analyze for access anomalies (example: unusual commit times)
                if repos:
                    total_stars = sum(r.get("stars", 0) for r in repos)
                    if total_stars > 5000:
                        github_data["access_anomalies"].append("High-profile repositories detected")
                
        except Exception as e:
            logger.exception(f"Error syncing GitHub data: {e}")
        
        return github_data
    
    async def run_full_sync_and_analysis(self, google_token: str, github_token: str) -> Dict[str, Any]:
        """
        Execute complete data sync from all providers and run threat analysis.
        
        Args:
            google_token: Valid Google access token
            github_token: Valid GitHub access token
        
        Returns:
            Complete analysis result with synced data and threat assessment
        """
        logger.info("Starting full sync and analysis pipeline")
        start_time = datetime.utcnow()
        
        # Sync both providers in parallel
        google_task = asyncio.create_task(self.sync_google_data(google_token))
        github_task = asyncio.create_task(self.sync_github_data(github_token))
        
        google_data, github_data = await asyncio.gather(google_task, github_task)
        
        # Prepare combined summary for Mojo
        data_summary = {
            "calendar_events": len(google_data.get("calendar_events", [])),
            "unknown_attendees": google_data.get("unknown_attendees", 0),
            "suspicious_domains": google_data.get("suspicious_domains", []),
            "repos": github_data.get("repos", 0),
            "recent_deployments": github_data.get("recent_deployments", 0),
            "access_anomalies": github_data.get("access_anomalies", [])
        }
        
        # Run threat analysis
        analysis = await self.run_mojo_analysis(data_summary)
        
        duration = (datetime.utcnow() - start_time).total_seconds()
        
        return {
            "timestamp": start_time.isoformat(),
            "duration_seconds": duration,
            "google_data": google_data,
            "github_data": github_data,
            "analysis": analysis,
            "status": "completed"
        }
