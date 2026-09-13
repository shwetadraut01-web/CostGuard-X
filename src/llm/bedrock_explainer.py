import os
import json
from typing import Dict, Any
from src.utils.logger import get_logger

logger = get_logger("BedrockExplainer")

class BedrockExplainer:
    def __init__(self, enabled: bool = False, region: str = "us-east-1", model_id: str = "anthropic.claude-3-haiku-20240307-v1:0"):
        self.enabled = enabled or os.getenv("ENABLE_BEDROCK", "false").lower() == "true"
        self.region = region or os.getenv("AWS_REGION", "us-east-1")
        self.model_id = model_id or os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-haiku-20240307-v1:0")
        self._boto_client = None

        if self.enabled:
            try:
                import boto3
                self._boto_client = boto3.client("bedrock-runtime", region_name=self.region)
                logger.info(f"Amazon Bedrock client initialized using model '{self.model_id}'.")
            except Exception as e:
                logger.warning(f"Could not initialize Amazon Bedrock client: {e}. Falling back to deterministic generator.")
                self.enabled = False

    def generate_explanation(self, structured_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Converts a structured analytical result into a simple business explanation.
        """
        # If Bedrock is enabled and client is ready, attempt LLM call
        if self.enabled and self._boto_client:
            try:
                explanation_text = self._call_bedrock_api(structured_result)
                return {
                    "source": "Amazon Bedrock",
                    "model_id": self.model_id,
                    "explanation": explanation_text,
                    "structured_data": structured_result
                }
            except Exception as err:
                logger.error(f"Bedrock invocation failed: {err}. Using deterministic fallback.")
                
        # Deterministic fallback generator
        fallback_text = self._generate_deterministic_explanation(structured_result)
        return {
            "source": "Deterministic Analytical Engine (Fallback)",
            "model_id": "CostGuard-X Deterministic v1.0",
            "explanation": fallback_text,
            "structured_data": structured_result
        }

    def _generate_deterministic_explanation(self, data: Dict[str, Any]) -> str:
        rid = data.get("resource_id", "Unknown")
        srv = data.get("service", "AWS Service")
        cat = data.get("category", "Cost Anomaly")
        env = data.get("environment", "Unknown")
        conf = data.get("confidence_score", 80)
        curr_c = data.get("current_daily_cost", 0.0)
        sav_m = data.get("estimated_monthly_savings", 0.0)
        ev_list = data.get("evidence", [])

        ev_str = " ".join(ev_list) if ev_list else "Utilization and cost data deviated from baseline."

        if cat == "Idle Resource":
            return (
                f"CostGuard-X identified development instance '{rid}' ({srv}) as an Idle Resource case with "
                f"{conf}% confidence. The resource generates ${curr_c:.2f}/day in cloud spend while exhibiting minimal CPU utilization "
                f"and running continuously in the '{env}' environment. {ev_str} Based on counterfactual analysis, "
                f"approximately ${sav_m:.2f}/month may be avoidable by scheduling automated shutdown outside operating hours."
            )
        elif cat == "Over-provisioning":
            return (
                f"CostGuard-X detected Over-provisioning on '{rid}' ({srv}) with {conf}% confidence. "
                f"The resource capacity is significantly oversized for its workload load ({ev_str}). "
                f"Right-sizing this instance family could save an estimated ${sav_m:.2f}/month without impacting performance."
            )
        elif cat == "Non-production Waste":
            return (
                f"CostGuard-X flagged Non-production Waste on resource '{rid}' in the '{env}' environment. "
                f"{ev_str} Shutting down non-production resources on evenings and weekends presents an estimated "
                f"avoidable cost of ${sav_m:.2f}/month."
            )
        elif cat == "Abnormal Storage Growth":
            return (
                f"CostGuard-X detected Abnormal Storage Growth on '{rid}' ({srv}). "
                f"{ev_str} Implementing lifecycle archival policies or removing stale snapshots could avoid "
                f"an estimated ${sav_m:.2f}/month."
            )
        elif cat == "Legitimate Growth":
            return (
                f"CostGuard-X evaluated resource '{rid}' ({srv}) and confirmed Legitimate Business Growth ({conf}% confidence). "
                f"{ev_str} Cost increases are directly aligned with proportional application traffic growth. No waste remediation is required."
            )
        else:
            return (
                f"CostGuard-X analyzed resource '{rid}' ({srv}) and detected a '{cat}' pattern with {conf}% confidence. "
                f"{ev_str} Estimated potential monthly avoidable cost is ${sav_m:.2f}."
            )

    def _call_bedrock_api(self, data: Dict[str, Any]) -> str:
        prompt = f"""You are a Cloud FinOps expert explaining an AWS cost anomaly to a business manager.
Do NOT invent any numbers, resources, or facts outside of the provided JSON payload.
Concisely summarize the finding in 3 clear sentences.

JSON Input:
{json.dumps(data, indent=2)}

Explanation:"""

        body = json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 250,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        })

        response = self._boto_client.invoke_model(
            modelId=self.model_id,
            body=body
        )

        response_body = json.loads(response.get("body").read())
        return response_body["content"][0]["text"].strip()
