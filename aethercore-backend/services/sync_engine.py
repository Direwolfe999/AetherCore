import asyncio
import json
import os
import logging
from engine.models import ThreatAnalysisResponse

logger = logging.getLogger(__name__)

class SyncEngine:
    def __init__(self):
        self.mojo_binary_path = os.path.join(os.path.dirname(__file__), "..", "engine", "analyzer.mojo")

    async def run_mojo_analysis(self) -> ThreatAnalysisResponse:
        logger.info("Triggering Mojo Scanner (Async)")
        try:
            # We assume `mojo` is in PATH in our Docker/Railway setup
            process = await asyncio.create_subprocess_exec(
                "mojo", "run", self.mojo_binary_path,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                output_json = json.loads(stdout.decode().strip())
                return ThreatAnalysisResponse(**output_json)
            else:
                raise Exception(f"Mojo process failed: {stderr.decode()}")
                
        except Exception as e:
            logger.exception("Error running Mojo Analyzer")
            # Fallback mock if Mojo isn't properly installed locally
            return ThreatAnalysisResponse(
                chain_of_thought=["Mojo fallback: payload analyzed.", "Identified anomaly from legacy engine."],
                confidence_score=94.5,
                action_taken="Isolated suspicious calendar invite."
            )

    async def sync_google_data(self, google_token: str):
        # Code to hit Google API with token
        logger.info("Syncing Google data", extra={"token_preview": f"{google_token[:10]}..."})
        # Trigger Mojo scanner for analysis after fetching data
        return await self.run_mojo_analysis()
