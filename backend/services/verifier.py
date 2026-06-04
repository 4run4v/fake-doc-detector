import re

def verify_document(text):

    score = 0
    reasons = []

    board_found = "CENTRAL BOARD OF SECONDARY EDUCATION" in text.upper()

    roll_match = re.search(r'(\d{8})', text)

    dob_match = re.search(r'(\d{2}/\d{2}/\d{4})', text)

    if board_found:
        score += 30
        reasons.append("CBSE Board detected")

    if roll_match:
        score += 30
        reasons.append("Roll Number detected")

    if dob_match:
        score += 20
        reasons.append("Date of Birth detected")

    if len(text) > 500:
        score += 20
        reasons.append("Document contains sufficient information")

    score = min(score, 100)

    if score >= 80:
        risk = "Low Risk"
    elif score >= 40:
        risk = "Medium Risk"
    else:
        risk = "High Risk"

    return {
        "score": score,
        "risk": risk,
        "reasons": reasons,
        "roll_number": roll_match.group(1) if roll_match else None,
        "dob": dob_match.group(1) if dob_match else None
    }


def detect_document_type(text):

    text = text.upper()

    if "CENTRAL BOARD OF SECONDARY EDUCATION" in text:
        return "CBSE Marksheet"

    return "Unknown Document"