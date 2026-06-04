# 🛡️ FraudShield AI

AI-Powered Government Document Verification & Forgery Detection System

FraudShield AI is an intelligent document verification platform that analyzes government-issued documents using OCR, rule-based forensic checks, and AI-generated authenticity reports.

The system extracts text from uploaded documents, identifies document types, performs verification checks, calculates an authenticity score, and generates a detailed AI forensic report.

---

## 🚀 Features

### 📄 OCR-Based Text Extraction

* Extracts text from uploaded document images
* Powered by Tesseract OCR
* Supports scanned government documents

### 🔍 Document Type Detection

Automatically identifies:

* CBSE Marksheet
* Aadhaar Card (planned)
* PAN Card (planned)
* Passport (planned)
* Other Government Documents

### 🛡️ Authenticity Verification

Performs:

* Board detection
* Roll number validation
* Date of birth extraction
* Information completeness checks
* Risk scoring

### 🤖 AI Forensic Report Generation

Generates:

* Authenticity assessment
* Suspicious findings
* Risk level explanation
* Detailed document analysis

### 📊 Interactive Dashboard

* Real-time analysis pipeline
* Authenticity score visualization
* Forensic findings panel
* AI-generated report display

---

## 🏗️ Tech Stack

### Frontend

* HTML
* CSS
* JavaScript

### Backend

* FastAPI
* Python

### OCR Engine

* Tesseract OCR
* Pillow

### AI

* Google Gemini API

### Version Control

* Git
* GitHub

---

## 📂 Project Structure

```text
fake-doc-detector/
│
├── backend/
│   ├── routes/
│   │   └── upload.py
│   │
│   ├── services/
│   │   ├── ocr.py
│   │   ├── verifier.py
│   │   └── gemini_service.py
│   │
│   ├── uploads/
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/4run4v/fake-doc-detector.git
cd fake-doc-detector
```

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv
```

### 3. Activate Virtual Environment

Windows:

```bash
.\venv\Scripts\Activate.ps1
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables

Create `.env`

```env
GEMINI_API_KEY=YOUR_API_KEY
```

### 6. Run Backend

```bash
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

### 7. Run Frontend

Open frontend folder using VS Code Live Server.

Frontend runs at:

```text
http://127.0.0.1:5500
```

---

## 🔄 Workflow

1. Upload document
2. OCR extracts text
3. Document type detected
4. Verification checks executed
5. Authenticity score generated
6. Gemini AI creates forensic report
7. Results displayed on dashboard

---

## 📸 Demo

### Input

Government document image upload

### Processing

* OCR Extraction
* Verification Checks
* AI Analysis

### Output

* Authenticity Score
* Risk Level
* Forensic Findings
* AI Generated Report

---

## 🔮 Future Enhancements

* Aadhaar verification
* PAN card verification
* QR code validation
* Digital signature analysis
* Template matching
* Forgery detection using ML models
* Database verification APIs
* PDF report generation

---

## 👨‍💻 Team

Developed as a document verification and fraud detection project for hackathon participation.

---

## 📜 License

This project is developed for educational and research purposes.
