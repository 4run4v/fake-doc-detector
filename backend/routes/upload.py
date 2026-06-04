from services.gemini_service import generate_report
from services.verifier import verify_document, detect_document_type
from fastapi import APIRouter, UploadFile, File
import os
import shutil

from services.ocr import extract_text

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):

    filepath = os.path.join(UPLOAD_DIR, file.filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted_text = extract_text(filepath)

    document_type = detect_document_type(extracted_text)

    analysis = verify_document(extracted_text)

    report = generate_report(extracted_text, analysis)

    return {
    "filename": file.filename,
    "document_type": document_type,
    "analysis": analysis,
    "ai_report": report,
    "ocr_text": extracted_text,
    "scan_id": f"FS-{os.getpid()}"
}