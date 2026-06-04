import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

def generate_report(text, analysis):

    prompt = f"""
    You are a government document verification officer.

    OCR Extracted Text:
    {text}

    Analysis:
    {analysis}

    Generate:
    1. Authenticity Assessment
    2. Suspicious Findings
    3. Risk Level Explanation

    Keep it under 150 words.
    """

    response = model.generate_content(prompt)

    return response.text