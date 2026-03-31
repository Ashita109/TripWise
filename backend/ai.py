import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

def generate_itinerary(
    destination: str,
    date_range: str,
    budget: str,
    travel_method: str,
    interests: str = "",
    travel_style: str = "moderate"
) -> str:
    """
    Uses Google Gemini to generate a structured day-by-day travel itinerary.
    Falls back to a demo itinerary if the API key is not set.
    """
    if not GEMINI_API_KEY:
        return _demo_itinerary(destination, date_range)

    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
You are an expert travel planner. Create a detailed, day-by-day travel itinerary in JSON format.

Trip details:
- Destination: {destination}
- Travel dates: {date_range}
- Total budget: {budget}
- Mode of travel: {travel_method}
- Interests: {interests if interests else "general sightseeing, food, culture"}
- Travel style: {travel_style}

Return ONLY valid JSON in this exact structure:
{{
  "destination": "{destination}",
  "date_range": "{date_range}",
  "budget_breakdown": {{
    "accommodation": "amount",
    "food": "amount",
    "transport": "amount",
    "activities": "amount",
    "total": "{budget}"
  }},
  "days": [
    {{
      "day": 1,
      "date": "Day label",
      "title": "Short day title",
      "morning": {{
        "activity": "Activity name",
        "description": "Details",
        "duration": "X hours",
        "cost": "₹amount or free"
      }},
      "afternoon": {{
        "activity": "Activity name",
        "description": "Details",
        "duration": "X hours",
        "cost": "₹amount or free"
      }},
      "evening": {{
        "activity": "Activity name",
        "description": "Details",
        "duration": "X hours",
        "cost": "₹amount or free"
      }},
      "accommodation": "Hotel/hostel name and type",
      "tips": "Local travel tip for the day"
    }}
  ],
  "highlights": ["Top 3 must-do experiences"],
  "packing_tips": ["3-4 packing suggestions"],
  "local_phrases": [{{"phrase": "phrase", "meaning": "meaning"}}]
}}

Generate 3–7 days based on the date range. Make it rich, practical, and specific.
"""

    response = model.generate_content(prompt)
    text = response.text.strip()

    # Strip markdown code fences if present
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    text = text.strip().rstrip("```").strip()

    return text


def _demo_itinerary(destination: str, date_range: str) -> str:
    """Returns a sample itinerary when no API key is configured."""
    import json
    demo = {
        "destination": destination,
        "date_range": date_range,
        "budget_breakdown": {
            "accommodation": "₹12,000",
            "food": "₹8,000",
            "transport": "₹5,000",
            "activities": "₹5,000",
            "total": "₹30,000"
        },
        "days": [
            {
                "day": 1,
                "date": "Day 1",
                "title": f"Arrival in {destination}",
                "morning": {
                    "activity": "Check-in & Freshen Up",
                    "description": "Arrive, settle in, and fuel up at a local café.",
                    "duration": "2 hours",
                    "cost": "₹500"
                },
                "afternoon": {
                    "activity": "City Orientation Walk",
                    "description": "Explore the main bazaar and get a feel for the streets.",
                    "duration": "3 hours",
                    "cost": "Free"
                },
                "evening": {
                    "activity": "Rooftop Dinner",
                    "description": "Catch a sunset view and try local specialties.",
                    "duration": "2 hours",
                    "cost": "₹800"
                },
                "accommodation": "Boutique Guesthouse — City Centre",
                "tips": "Use local auto-rickshaws for short distances — always negotiate the fare!"
            },
            {
                "day": 2,
                "date": "Day 2",
                "title": "Hidden Gems Day",
                "morning": {
                    "activity": "Local Market Tour",
                    "description": "Shop for spices, textiles, and street snacks.",
                    "duration": "2 hours",
                    "cost": "₹300"
                },
                "afternoon": {
                    "activity": "Heritage Site Visit",
                    "description": "Explore a UNESCO-listed monument or fort.",
                    "duration": "3 hours",
                    "cost": "₹200"
                },
                "evening": {
                    "activity": "Cultural Show",
                    "description": "Watch a traditional performance at a local venue.",
                    "duration": "2 hours",
                    "cost": "₹400"
                },
                "accommodation": "Boutique Guesthouse — City Centre",
                "tips": "Book heritage site tickets online to skip queues."
            }
        ],
        "highlights": [
            f"Explore {destination}'s local street food scene",
            "Visit a UNESCO heritage monument",
            "Interact with locals at the morning market"
        ],
        "packing_tips": [
            "Pack light, breathable clothes",
            "Carry a power bank",
            "Bring a reusable water bottle"
        ],
        "local_phrases": [
            {"phrase": "Namaste", "meaning": "Hello / Greetings"},
            {"phrase": "Dhanyavad", "meaning": "Thank you"}
        ]
    }
    return json.dumps(demo, ensure_ascii=False, indent=2)
