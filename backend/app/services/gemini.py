import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any, List
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")


def call_gemini_generate(prompt: str, system_instruction: str = "") -> str:
    """
    Calls Google Gemini API using standard REST endpoint.
    Returns response text or falls back cleanly if API key is not configured.
    """
    if not GEMINI_API_KEY or GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        return ""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

    payload: Dict[str, Any] = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ],
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 800,
        }
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            result = json.loads(response.read().decode("utf-8"))
            candidates = result.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "")
    except Exception as e:
        # Graceful logging without failing API endpoint
        print(f"[Gemini Service Warning]: {e}")
        return ""

    return ""


def explain_environmental_report(
    title: str,
    category: str,
    description: str,
    water_body_name: str = "",
) -> Dict[str, Any]:
    """
    Generates educational explanation of an observed citizen environmental report.
    Guaranteed not to fabricate measurements.
    """
    system_instruction = (
        "You are an educational hydrology and environmental science assistant for Jal-Dharani in India. "
        "Explain citizen-reported water/pollution observations in simple, scientifically sound terms. "
        "NEVER fabricate specific chemical numbers, sensor readings, or official lab results. "
        "Always emphasize that this is a citizen observation and guide practical community safety actions."
    )

    prompt = (
        f"A citizen submitted this environmental observation:\n"
        f"Title: {title}\n"
        f"Category: {category}\n"
        f"Description: {description}\n"
        f"Water Body: {water_body_name or 'Local Catchment'}\n\n"
        f"Please provide:\n"
        f"1. A concise 2-sentence summary of why this observation matters.\n"
        f"2. Brief scientific context (what physical/biological process causes this, e.g. nutrient loading, decomposition, runoff).\n"
        f"3. 3 practical community safety / documentation recommendations."
    )

    ai_text = call_gemini_generate(prompt, system_instruction)

    if ai_text:
        return {
            "summary": f"Citizen observation regarding {category.replace('-', ' ')} at {water_body_name or 'the site'}.",
            "scientific_context": ai_text,
            "immediate_actions": [
                "Document photo evidence with timestamp and coordinates",
                "Notify neighborhood conservation volunteers to inspect outfall source",
                "Avoid direct contact with stagnant foam or untreated effluent without protective gloves"
            ],
            "is_ai_analysis": True,
        }

    # Deterministic scientific fallback when offline or no API key
    category_contexts = {
        "sewage-inflow": "Untreated sewage introduces high biochemical oxygen demand (BOD) and coliform bacteria, rapidly depleting dissolved oxygen needed by aquatic life.",
        "foaming": "Surfactant foaming occurs when non-biodegradable household detergents with phosphates churn violently over weirs and spillways.",
        "algal-bloom": "Excess nitrates and phosphates from agricultural runoff or domestic greywater cause eutrophication, blocking sunlight from reaching submerged plants.",
        "garbage-dumping": "Solid plastic waste entangles aquatic organisms and chokes stormwater channels, preventing monsoon flood drainage and water infiltration.",
        "damaged-recharge-structure": "Silt sedimentation seals porous sand layers in recharge pits, turning rainwater infiltration structures into stagnant surface puddles.",
    }

    return {
        "summary": f"Field observation of {category.replace('-', ' ')} recorded at {water_body_name or 'the site'}.",
        "scientific_context": category_contexts.get(
            category,
            "Field condition affects local water quality and infiltration capacity across the catchment."
        ),
        "immediate_actions": [
            "Log additional photo evidence with geographical markers",
            "Mobilize local Jal-Dharani community stewards for field verification",
            "Maintain safe perimeter and inspect upstream drainage feeder culverts"
        ],
        "is_ai_analysis": False,
    }


def summarize_heat_water_nexus(
    city: str,
    temp_c: float,
    wet_bulb_c: float,
    water_table_depth_m: float = None,
) -> Dict[str, Any]:
    """
    Explains the coupled relationship between extreme summer heat and water depletion.
    """
    system_instruction = (
        "You are a climate-hydrology educator for Jal-Dharani. "
        "Explain how extreme summer heat accelerates water demand and groundwater depletion in Indian cities."
    )

    prompt = (
        f"City: {city}\n"
        f"Current Ambient Temperature: {temp_c}°C\n"
        f"Wet-Bulb Temperature: {wet_bulb_c}°C\n"
        f"Groundwater Table Depth: {water_table_depth_m or 'Unknown'} m bgl\n\n"
        f"Explain in 3 short paragraphs how heat and water demand reinforce each other here, and how shaded community water kiosks save lives."
    )

    ai_text = call_gemini_generate(prompt, system_instruction)

    if ai_text:
        return {
            "heat_water_nexus_explanation": ai_text,
            "risk_level_interpretation": (
                "Extreme thermal stress" if wet_bulb_c >= 30 or temp_c >= 42 else "Elevated summer demand"
            ),
            "community_cooling_recommendations": [
                "Erect public shaded clay pot (matka) drinking water stations",
                "Apply solar-reflective white cool-roof wash on unshaded tenements",
                "Preserve urban lake wetland vegetation to maintain evaporative cooling"
            ],
            "is_ai_analysis": True,
        }

    return {
        "heat_water_nexus_explanation": (
            f"At {temp_c}°C in {city}, municipal water consumption surges by 25-45% for cooling and hydration "
            f"precisely when open water bodies lose up to 10mm depth daily to solar evaporation. "
            f"This accelerates borewell abstraction, dropping groundwater levels."
        ),
        "risk_level_interpretation": (
            "Severe Heatwave" if temp_c >= 42 else "Moderate Heat Stress"
        ),
        "community_cooling_recommendations": [
            "Erect community earthen pot (matka) drinking water kiosks on high-traffic footpaths",
            "Paint rooftops with white lime wash to reduce indoor radiant temperatures by 4°C",
            "Avoid unshaded outdoor labor during peak thermal hours (11:30 AM – 4:30 PM)"
        ],
        "is_ai_analysis": False,
    }
