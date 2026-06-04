/* ═══════════════════════════════════════════════
   FRAUDSHIELD AI — SCRIPT.JS
   All interactivity and animations
═══════════════════════════════════════════════ */

'use strict';

// ─── NAVBAR ───────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNav() {
  const sections = ['hero','dashboard','verify','analysis','results','templates'];
  const scrollY = window.scrollY + 100;
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.section === current);
  });
}

// ─── SCROLL REVEAL ─────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── ANIMATED COUNTERS ─────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const dur = 1600, step = 16;
  const increments = Math.ceil(target / (dur / step));
  let current = 0;
  const timer = setInterval(() => {
    current += increments;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = current;
  }, step);
}

// ─── SCORE RING ANIMATION ──────────────────────
const ringObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateScoreRing(currentScore);
      ringObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const scoreRingEl = document.getElementById('scoreRing');
let currentScore = 0;
if (scoreRingEl) ringObserver.observe(scoreRingEl);

function animateScoreRing(score) {
  if (!scoreRingEl || !score) return;
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => { scoreRingEl.style.strokeDashoffset = offset; }, 300);
}

// ─── BOARD DROPDOWN — show/hide based on doc type ─────────────────
const docTypeSelect = document.getElementById('docType');
const boardGroup    = document.getElementById('boardGroup');

const marksheetTypes = new Set(['marksheet10', 'marksheet12']);

docTypeSelect.addEventListener('change', () => {
  const isMarksheet = marksheetTypes.has(docTypeSelect.value);
  boardGroup.style.display = isMarksheet ? 'flex' : 'none';
  // Reset board selection when hiding
  if (!isMarksheet) {
    document.querySelectorAll('input[name="board"]').forEach(r => r.checked = false);
  }
});

// ─── FILE UPLOAD ───────────────────────────────
const uploadZone      = document.getElementById('uploadZone');
const fileInput       = document.getElementById('fileInput');
const uploadInner     = document.getElementById('uploadInner');
const uploadedPreview = document.getElementById('uploadedPreview');
const previewName     = document.getElementById('previewName');
const previewSize     = document.getElementById('previewSize');
const previewRemove   = document.getElementById('previewRemove');

let uploadedFile = null;

uploadZone.addEventListener('click', (e) => {
  if (e.target === previewRemove || previewRemove.contains(e.target)) return;
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
});

uploadZone.addEventListener('dragover',  (e) => { e.preventDefault(); uploadZone.classList.add('drag-over'); });
uploadZone.addEventListener('dragleave', ()  => uploadZone.classList.remove('drag-over'));
uploadZone.addEventListener('drop', (e) => {
  e.preventDefault(); uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) { showToast('Invalid file type. Please upload PDF, JPG, or PNG.', 'danger'); return; }
  if (file.size > 10 * 1024 * 1024) { showToast('File too large. Maximum size is 10MB.', 'danger'); return; }
  uploadedFile = file;
  const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
  previewName.textContent = file.name;
  previewSize.textContent = `${sizeMB} MB · ${file.type.split('/')[1].toUpperCase()}`;
  uploadInner.style.display     = 'none';
  uploadedPreview.style.display = 'flex';
  showToast('File uploaded successfully!', 'success');
}

previewRemove.addEventListener('click', (e) => {
  e.stopPropagation();
  uploadedFile = null; fileInput.value = '';
  uploadInner.style.display     = '';
  uploadedPreview.style.display = 'none';
});

document.getElementById('uploadBtn').addEventListener('click', () => {
  if (!uploadedFile) fileInput.click();
  else showToast('File already uploaded! Click Start Analysis to proceed.', 'success');
});

// ─── BACKEND OUTPUT MOCK DATA ──────────────────
// Simulates the shape your backend returns.
// Replace runAnalysis() internals with a real fetch() call.

function getMockBackendOutput(docType, board) {
  const typeLabels = {
    income:      'Income Certificate',
    caste:       'Caste Certificate',
    degree:      'Degree Certificate',
    domicile:    'Domicile Certificate',
    marksheet10: '10th Marksheet',
    marksheet12: '12th Marksheet',
  };

  const isMarksheet = marksheetTypes.has(docType);
  const label = typeLabels[docType] || 'Government Document';
  const scanId = 'FS-2024-' + Math.floor(10000 + Math.random() * 90000);

  if (isMarksheet && board === 'CBSE') {
    return {
      filename: uploadedFile ? uploadedFile.name : 'document.jpeg',
      document_type: label,
      analysis: {
        score: 100,
        risk: 'Low Risk',
        reasons: [
          'CBSE Board detected',
          'Roll Number detected',
          'Date of Birth detected',
          'Document contains sufficient information',
        ],
        roll_number: '19129027',
        dob: '12/06/2006',
      },
      scan_id: scanId,
      ai_report: `**Authenticity Assessment:**\nThe document appears to be an authentic "Marks Statement Cum Certificate" issued by the CENTRAL BOARD OF SECONDARY EDUCATION for the Secondary School Examination, 2022. It contains all expected details including student name, Roll Number (19129027), Date of Birth (12/06/2006), parent names, school details, and subject-wise scores and grades.\n\n**Suspicious Findings:**\nNo significant suspicious findings or anomalies were detected that would question the document's authenticity. Minor OCR artifacts are present but do not obscure critical information.\n\n**Risk Level Explanation:**\n**Low Risk**. The document provides sufficient and consistent information, including clear identification of the issuing board, student particulars, and academic results.`,
    };
  }

  if (isMarksheet && board === 'MP Board') {
    return {
      filename: uploadedFile ? uploadedFile.name : 'document.pdf',
      document_type: label,
      analysis: {
        score: 91,
        risk: 'Low Risk',
        reasons: [
          'MPBSE Board header detected',
          'Roll Number found in registry',
          'Date of Birth detected',
          'Madhya Pradesh board seal verified',
        ],
        roll_number: '2311045',
        dob: '05/03/2007',
      },
      scan_id: scanId,
      ai_report: `**Authenticity Assessment:**\nThe document appears to be an authentic Madhya Pradesh Board of Secondary Education (MPBSE) marksheet. Key identifiers including the board watermark, official seal, and roll number align with known MPBSE templates.\n\n**Suspicious Findings:**\nMinor compression artifacts detected around the seal area — likely due to scanning quality, not tampering. Font rendering on subject rows matches official MPBSE typography.\n\n**Risk Level Explanation:**\n**Low Risk**. The document passes all primary structural and metadata checks. The minor scan artifacts do not constitute evidence of forgery.`,
    };
  }

  // Generic certificate (non-marksheet)
  const genericOutputs = {
    income: {
      score: 63, risk: 'Medium Risk',
      reasons: ['Government letterhead detected', 'Layout matches MH-IC-2023 template', 'Font mismatch in body text', 'Metadata modified after creation'],
      ai_report: `**Authenticity Assessment:**\nThe Income Certificate shows structural similarity to official Maharashtra Tehsildar office formats. However, forensic analysis flags two anomalies.\n\n**Suspicious Findings:**\nBody text uses Helvetica instead of the mandated NotoSans-Devanagari. PDF metadata shows modification 3 days after document creation, which is atypical for official government PDFs.\n\n**Risk Level Explanation:**\n**Medium Risk**. Recommend manual review by district officer before accepting for welfare scheme enrollment.`,
    },
    caste: {
      score: 44, risk: 'High Risk',
      reasons: ['SC/ST category text found', 'Layout mismatch detected', 'Seal pixel correlation low (61%)', 'Unusual creation tool detected'],
      ai_report: `**Authenticity Assessment:**\nThe Caste Certificate deviates from official SDM-issued format in multiple ways. The Ashoka seal pixel correlation is only 61%, well below the 90% threshold.\n\n**Suspicious Findings:**\nDocument layout does not match any known state template. PDF was created using a consumer-grade tool inconsistent with official government printing systems.\n\n**Risk Level Explanation:**\n**High Risk**. Strong indicators of forgery. Recommend immediate escalation to district verification cell.`,
    },
    degree: {
      score: 94, risk: 'Low Risk',
      reasons: ['University seal verified', 'DigiLocker cross-reference passed', 'ABC ID validated', 'Official typography confirmed'],
      ai_report: `**Authenticity Assessment:**\nDegree Certificate verified against the university's DigiLocker-registered records. All fields including enrollment number, year of passing, and faculty seal are consistent.\n\n**Suspicious Findings:**\nNo anomalies detected.\n\n**Risk Level Explanation:**\n**Low Risk**. Document is authentic.`,
    },
    domicile: {
      score: 88, risk: 'Low Risk',
      reasons: ['Collector office header found', 'State seal verified', 'Domicile period valid', 'Metadata consistent'],
      ai_report: `**Authenticity Assessment:**\nDomicile Certificate matches District Collector format. Residency period and district stamps are consistent with official records.\n\n**Suspicious Findings:**\nNo suspicious findings.\n\n**Risk Level Explanation:**\n**Low Risk**. Document passes all verification checks.`,
    },
  };

  const base = genericOutputs[docType] || genericOutputs.income;
  return { filename: uploadedFile ? uploadedFile.name : 'document.pdf', document_type: label, analysis: { ...base, roll_number: null, dob: null }, scan_id: scanId, ai_report: base.ai_report };
}

// ─── STEP CONFIG (marksheet variant) ──────────
function getStepConfig(isMarksheet) {
  if (isMarksheet) {
    return [
      { name: 'OCR Extraction',   delay: 900,  result: 'success', msg: '> [OCR] 1,412 characters extracted · Language: English · Confidence: 98.4%' },
      { name: 'Layout Detection', delay: 1200, result: 'success', msg: '> [LAYOUT] Template match: CBSE-SSC-2022-v2.3 · Score: 0.97 · 11/11 fields located' },
      { name: 'Font Verification',delay: 1100, result: 'success', msg: '> [FONT] Typeface match: Times New Roman · Expected: Times New Roman · Confidence: 99%' },
      { name: 'Metadata Analysis',delay: 1400, result: 'success', msg: '> [META] Creation date consistent · No modification history · Document integrity: CLEAN' },
      { name: 'QR / Roll Validation', delay: 1200, result: 'success', msg: '> [ROLL] Roll No: 19129027 verified · CBSE registry: VALID · DOB match: 12/06/2006' },
      { name: 'Forgery Detection',delay: 1600, result: 'success', msg: '> [GAN] No pixel-level tampering detected · ELA score: 0.04 (threshold: 0.40) · Authenticity: 100%' },
    ];
  }
  return [
    { name: 'OCR Extraction',   delay: 1000, result: 'success', msg: '> [OCR] 1,847 characters extracted · Language: Hindi+English · Confidence: 97.2%' },
    { name: 'Layout Detection', delay: 1400, result: 'success', msg: '> [LAYOUT] Template match: MH-IC-2023-v4.1 · Score: 0.94 · 14/14 fields located' },
    { name: 'Font Verification',delay: 1400, result: 'fail',    msg: '> [FONT] ⚠ MISMATCH — Body: Helvetica detected · Expected: NotoSans-Devanagari · Confidence: 91%' },
    { name: 'Metadata Analysis',delay: 1600, result: 'fail',    msg: '> [META] ⚠ ANOMALY — Modified: 2024-11-03T14:22:11Z (3d after creation) · PDF Producer: Adobe Acrobat 23 [Unofficial]' },
    { name: 'QR / Roll Validation', delay: 1200, result: 'success', msg: '> [QR] Barcode decoded · Registry lookup: VALID · Issuer: Nashik District Office' },
    { name: 'Forgery Detection',delay: 1800, result: 'success', msg: '> [GAN] No pixel-level tampering detected · ELA score: 0.12 (threshold: 0.40) · Authenticity: 87%' },
  ];
}

// ─── AI ANALYSIS SIMULATION ────────────────────
const analyzeBtn   = document.getElementById('analyzeBtn');
const progressFill = document.getElementById('progressFill');
const progressPct  = document.getElementById('progressPct');
const apStatus     = document.getElementById('apStatus');
const terminalBody = document.getElementById('terminalBody');
const steps        = document.querySelectorAll('.astep');

let analysisRunning = false;

analyzeBtn.addEventListener('click', async () => {
  const docType = docTypeSelect.value;
  if (!docType) { showToast('Please select a document type first.', 'danger'); return; }

  const isMarksheet = marksheetTypes.has(docType);
  let board = '';
  if (isMarksheet) {
    const boardEl = document.querySelector('input[name="board"]:checked');
    if (!boardEl) { showToast('Please select a board (CBSE or MP Board).', 'danger'); return; }
    board = boardEl.value;
  }

  if (analysisRunning) return;
  analysisRunning = true;
  analyzeBtn.disabled = true;
  analyzeBtn.textContent = '⟳ Analyzing...';

  document.getElementById('analysis').scrollIntoView({ behavior: 'smooth', block: 'start' });

  clearTerminal(); resetSteps();
  progressFill.style.width = '0%';
  progressPct.textContent  = '0%';

  const typeLabels = { income:'Income Certificate', caste:'Caste Certificate', degree:'Degree Certificate', domicile:'Domicile Certificate', marksheet10:'10th Marksheet', marksheet12:'12th Marksheet' };
  const label  = typeLabels[docType] || 'Government Document';
  const stepConfig = getStepConfig(isMarksheet);

  addTermLine(`> FraudShield AI Neural Engine v3.7.2`, 'prompt', 0);
  addTermLine(`> Initializing forensic pipeline...`, 'muted', 200);
  addTermLine(`> Document Type: ${label}${board ? ' · Board: ' + board : ''}`, 'muted', 400);
  addTermLine(`> ─────────────────────────────────────────`, 'muted', 700);

  let cumDelay = 1000;

  stepConfig.forEach((s, i) => {
    const pct = Math.round(((i + 1) / stepConfig.length) * 100);
    setTimeout(() => {
      setStepState(i, 'running', '...');
      apStatus.textContent = `Running: ${s.name}...`;
      updateProgress(pct - Math.floor(100 / stepConfig.length / 2));
    }, cumDelay);

    cumDelay += s.delay;
    setTimeout(() => {
      setStepState(i, s.result === 'success' ? 'done' : 'fail', s.result === 'success' ? '✓' : '✗');
      updateProgress(pct);
      addTermLine(s.msg, s.result === 'success' ? 'success' : 'orange', 0);
    }, cumDelay);
    cumDelay += 200;
  });

  // Finalize
  setTimeout(async () => {
  
    apStatus.textContent = 'Uploading to backend...';
  
    try {
  
      const formData = new FormData();
      formData.append("file", uploadedFile);
  
      const response = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData
        }
      );
  
      const output = await response.json();
  
      const {
        score,
        risk,
        reasons
      } = output.analysis;
  
      // Clear fake logs
      terminalBody.innerHTML = '';
  
      addTermLine('DOCUMENT ANALYSIS COMPLETE', 'success', 0);
      addTermLine('─────────────────────────────', 'muted', 100);
  
      addTermLine(
        `Document Type : ${output.document_type}`,
        'success',
        200
      );
  
      addTermLine(
        `Roll Number : ${output.analysis.roll_number || 'Not Found'}`,
        'success',
        300
      );
  
      addTermLine(
        `Date Of Birth : ${output.analysis.dob || 'Not Found'}`,
        'success',
        400
      );
  
      addTermLine(
        `Risk Level : ${risk}`,
        riskToTermColor(risk),
        500
      );
  
      addTermLine(
        `Authenticity Score : ${score}%`,
        riskToTermColor(risk),
        600
      );
  
      addTermLine(
        '─────────────────────────────',
        'muted',
        700
      );
  
      addTermLine(
        'OCR PREVIEW',
        'prompt',
        800
      );
  
      addTermLine(
        output.ocr_text
          ? output.ocr_text.substring(0, 700)
          : 'OCR text unavailable',
        'success',
        900
      );
  
      apStatus.textContent = '✓ Analysis complete';
  
      analysisRunning = false;
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML =
        '<span>⬡</span> Start Analysis';
  
      populateResults(
        output,
        docType,
        board
      );
  
      showToast(
        'Analysis complete!',
        'success'
      );
  
      setTimeout(() => {
        document
          .getElementById('results')
          .scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
      }, 500);
  
    }
    catch (error) {
  
      console.error(error);
  
      showToast(
        'Backend connection failed',
        'danger'
      );
  
      analysisRunning = false;
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML =
        '<span>⬡</span> Start Analysis';
    }
  
  }, cumDelay);
});
function riskToTermColor(risk) {
  if (risk === 'Low Risk')    return 'success';
  if (risk === 'Medium Risk') return 'orange';
  return 'danger';
}

// ─── POPULATE RESULTS FROM BACKEND OUTPUT ──────
function populateResults(output, docType, board) {
  const { score, risk, reasons, roll_number, dob } = output.analysis;

  // Score ring
  currentScore = score;
  const circumference = 314;
  const offset = circumference - (score / 100) * circumference;
  scoreRingEl.style.strokeDashoffset = offset;

  // Ring color class
  scoreRingEl.setAttribute(
  "class",
  "ring-fill"
  );

  if (risk === "Low Risk") {
    scoreRingEl.classList.add("low-risk");
  }
  else if (risk === "High Risk") {
    scoreRingEl.classList.add("high-risk");
  }
  else {
    scoreRingEl.classList.add("medium-risk");
  }

  // Score number
  animateNumber(document.getElementById('scoreNumber'), score);
  document.getElementById('scoreUnit').textContent = '%';

  // Risk badge
  const riskEl = document.getElementById('scoreRisk');
  riskEl.className = 'score-risk ' + (risk === 'Low Risk' ? 'low' : risk === 'High Risk' ? 'high' : 'medium');
  document.getElementById('scoreRiskText').textContent = risk;

  // Meta fields
  document.getElementById('resMeta-doc').textContent = output.document_type;
  document.getElementById('resMeta-id').textContent  = output.scan_id;
  document.getElementById('resMeta-time').textContent = new Date().toLocaleTimeString();

  // Board / Roll / DOB — show only for marksheets
  const isMarksheet = marksheetTypes.has(docType);
  const boardRow = document.getElementById('metaBoardRow');
  const rollRow  = document.getElementById('metaRollRow');
  const dobRow   = document.getElementById('metaDobRow');

  if (isMarksheet && board) {
    boardRow.style.display = 'flex';
    document.getElementById('resMeta-board').textContent = board;
  } else { boardRow.style.display = 'none'; }

  if (roll_number) {
    rollRow.style.display = 'flex';
    document.getElementById('resMeta-roll').textContent = roll_number;
  } else { rollRow.style.display = 'none'; }

  if (dob) {
    dobRow.style.display = 'flex';
    document.getElementById('resMeta-dob').textContent = dob;
  } else { dobRow.style.display = 'none'; }

  // Findings list from reasons[]
  const findingsList = document.getElementById('findingsList');
  findingsList.innerHTML = '';

  // Map reasons to findings (mark known-bad phrases as fail)
  const failKeywords = ['mismatch', 'anomaly', 'suspicious', 'fail', 'unusual', 'low'];
  reasons.forEach(reason => {
    const isFail = failKeywords.some(k => reason.toLowerCase().includes(k));
    const div = document.createElement('div');
    div.className = `finding ${isFail ? 'fail' : 'ok'}`;
    div.innerHTML = `
      <div class="finding-icon">${isFail ? '✗' : '✓'}</div>
      <div class="finding-info">
        <span class="finding-name">${reason}</span>
        <span class="finding-detail">${isFail ? 'Anomaly detected — manual review recommended' : 'Check passed successfully'}</span>
      </div>
      <div class="finding-badge ${isFail ? 'fail' : 'pass'}">${isFail ? 'FAIL' : 'PASS'}</div>
    `;
    findingsList.appendChild(div);
  });

  // AI Report
  const aiReportSection = document.getElementById('aiReportSection');
  const aiReportBody    = document.getElementById('aiReportBody');
  aiReportSection.style.display = 'block';
  aiReportBody.innerHTML = formatAiReport(output.ai_report);

  // Verdict
  const verdictText    = document.getElementById('verdictText');
  const verdictActions = document.getElementById('verdictActions');
  const failCount = reasons.filter(r => failKeywords.some(k => r.toLowerCase().includes(k))).length;

  if (risk === 'Low Risk') {
    verdictText.innerHTML = `Document passed all ${reasons.length} verification checks with <strong style="color:var(--success)">${score}% authenticity score</strong>. No anomalies detected. Safe to accept.`;
    document.querySelector('.ai-verdict').style.background = 'rgba(34,197,94,0.04)';
    document.querySelector('.ai-verdict').style.borderTop  = '1px solid rgba(34,197,94,0.15)';
    document.querySelector('.verdict-header').style.color  = 'var(--success)';
  } else if (risk === 'High Risk') {
    verdictText.innerHTML = `Document exhibits <strong>${failCount} critical anomal${failCount===1?'y':'ies'}</strong> suggesting potential forgery. Do NOT approve without secondary verification by authorized officer.`;
    document.querySelector('.ai-verdict').style.background = 'rgba(239,68,68,0.06)';
    document.querySelector('.ai-verdict').style.borderTop  = '1px solid rgba(239,68,68,0.2)';
    document.querySelector('.verdict-header').style.color  = 'var(--danger)';
  } else {
    verdictText.innerHTML = `Document exhibits <strong>${failCount} anomal${failCount===1?'y':'ies'}</strong> suggesting possible tampering. Recommend manual review by district-level officer before acceptance.`;
    document.querySelector('.ai-verdict').style.background = 'rgba(245,158,11,0.04)';
    document.querySelector('.ai-verdict').style.borderTop  = '1px solid rgba(245,158,11,0.15)';
    document.querySelector('.verdict-header').style.color  = 'var(--orange)';
  }
  verdictActions.style.display = 'flex';
}

function formatAiReport(text) {
  // Convert **bold** and section titles
  return text
    .split('\n\n')
    .map(para => {
      const [first, ...rest] = para.split('\n');
      // Section heading (starts with **)
      if (first.startsWith('**') && first.endsWith('**')) {
        const title = first.replace(/\*\*/g, '');
        return `<span class="report-section-title">${title}</span>${rest.map(l => l.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')).join('<br>')}`;
      }
      return para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    })
    .join('<br><br>');
}

function animateNumber(el, target) {
  const dur = 1200, step = 16;
  const inc = Math.ceil(target / (dur / step));
  let cur = 0;
  el.textContent = '0';
  const timer = setInterval(() => {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = cur;
  }, step);
}

// ─── ANALYSIS STEP HELPERS ─────────────────────
function updateProgress(pct) {
  progressFill.style.width = `${pct}%`;
  progressPct.textContent  = `${pct}%`;
}

function setStepState(index, state, statusText) {
  const step = steps[index];
  if (!step) return;
  const icon   = step.querySelector('.astep-icon');
  const status = step.querySelector('.astep-status');
  icon.className = `astep-icon ${state}`;
  if      (state === 'running') icon.textContent = '◈';
  else if (state === 'done')    icon.textContent = '✓';
  else if (state === 'fail')    icon.textContent = '✗';
  else                          icon.textContent = '◌';
  if      (state === 'done')    { step.classList.add('complete'); status.textContent = 'PASS'; status.style.color = 'var(--success)'; }
  else if (state === 'fail')    { status.textContent = 'FAIL'; status.style.color = 'var(--danger)'; }
  else if (state === 'running') { step.classList.add('active'); status.textContent = '...'; status.style.color = 'var(--blue)'; }
}

function resetSteps() {
  steps.forEach(step => {
    step.classList.remove('active', 'complete');
    const icon   = step.querySelector('.astep-icon');
    const status = step.querySelector('.astep-status');
    icon.className    = 'astep-icon pending';
    icon.textContent  = '◌';
    status.textContent = '—';
    status.style.color = '';
  });
}

function clearTerminal() { terminalBody.innerHTML = ''; }

function addTermLine(text, cls = 'muted', delay = 0) {
  setTimeout(() => {
    const div = document.createElement('div');
    div.className   = `t-line ${cls}`;
    div.textContent = text;
    terminalBody.appendChild(div);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }, delay);
}

// ─── DOWNLOAD REPORT MOCK ──────────────────────
document.getElementById('downloadReport').addEventListener('click', () => {
  showToast('Generating forensic report PDF...', 'success');
  setTimeout(() => showToast('Report ready — downloading FS-2024-Report.pdf', 'success'), 1500);
});

// ─── VERDICT ACTION BUTTONS ───────────────────
document.getElementById('flagReviewBtn').addEventListener('click', () => {
  showToast('Document flagged for manual review by district officer.', 'danger');
});
document.getElementById('markVerifiedBtn').addEventListener('click', () => {
  showToast('Document marked as verified in the system.', 'success');
});

// ─── TOAST NOTIFICATIONS ───────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast-notification');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : '⚠'}</span> ${message}`;
  toast.style.cssText = `
    position:fixed; bottom:28px; right:28px; z-index:999;
    background:${type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'};
    border:1px solid ${type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'};
    color:${type === 'success' ? '#22C55E' : '#EF4444'};
    padding:12px 20px; border-radius:10px;
    font-family:'Exo 2',sans-serif; font-size:14px; font-weight:500;
    backdrop-filter:blur(12px); display:flex; align-items:center; gap:8px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:toast-in 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
  `;

  if (!document.getElementById('toast-style')) {
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
      @keyframes toast-in  { from{opacity:0;transform:translateY(16px);} to{opacity:1;transform:translateY(0);} }
      @keyframes toast-out { from{opacity:1;transform:translateY(0);}    to{opacity:0;transform:translateY(16px);} }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── TEMPLATE CARDS ───────────────────────────
document.querySelectorAll('.template-card').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;
    if (type && docTypeSelect) {
      docTypeSelect.value = type;
      // Trigger change event to show/hide board dropdown
      docTypeSelect.dispatchEvent(new Event('change'));
      document.getElementById('verify').scrollIntoView({ behavior: 'smooth' });
      showToast(`Template selected: ${card.querySelector('.tc-title').textContent}`, 'success');
    }
  });
  card.style.cursor = 'pointer';
});

// ─── INITIAL TERMINAL ─────────────────────────
(function initTerminal() {
  const lines = [
    { t: '> FraudShield AI Neural Engine v3.7.2',       c: 'prompt',  d: 100  },
    { t: '> Forensic Analysis Module Ready',             c: 'muted',   d: 400  },
    { t: '> Template Database Loaded — 14 templates',    c: 'muted',   d: 700  },
    { t: '> Neural weights loaded (conv6_fraud_v3.pt)',  c: 'muted',   d: 1000 },
    { t: '> Board Registry API Connected (CBSE, MPBSE)', c: 'muted',   d: 1300 },
    { t: '> All systems operational',                    c: 'success', d: 1700 },
    { t: '> Awaiting document upload...',                c: 'muted',   d: 2100 },
  ];
  clearTerminal();
  lines.forEach(l => { if (!analysisRunning) addTermLine(l.t, l.c, l.d); });
})();

// ─── HERO BADGE TICKER ────────────────────────
const heroBadgeTexts = [
  'Government Grade · AI Forensics · v3.7.2',
  'Neural Network · 99.2% Accuracy · Real-Time',
  'CBSE & MPBSE Registry · Roll Validation · LIVE',
  '124 Documents Verified · 18 Frauds Detected',
];
let tickIdx = 0;
const heroBadge = document.querySelector('.hero-badge');
if (heroBadge) {
  setInterval(() => {
    tickIdx = (tickIdx + 1) % heroBadgeTexts.length;
    heroBadge.style.opacity = '0';
    setTimeout(() => {
      heroBadge.childNodes[heroBadge.childNodes.length - 1].textContent = heroBadgeTexts[tickIdx];
      heroBadge.style.opacity = '1';
    }, 300);
    heroBadge.style.transition = 'opacity 0.3s ease';
  }, 4000);
}

// ─── SMOOTH SCROLL ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// ─── ANIMATE CHART BARS ON REVEAL ─────────────
window.addEventListener('load', () => {
  if (scoreRingEl) scoreRingEl.style.strokeDashoffset = '314';

  const tcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.tc-risk-fill').forEach(bar => { bar.style.animation = 'bar-fill 1s ease forwards'; });
        entry.target.querySelectorAll('.ft-fill').forEach(bar => { bar.style.animation = 'bar-fill 1.2s ease backwards'; });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.templates-grid, .analytics-card').forEach(el => tcObserver.observe(el));
});

// ─── KONAMI CODE ──────────────────────────────
let konamiBuffer = [];
const konamiCode = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
document.addEventListener('keydown', (e) => {
  konamiBuffer.push(e.key);
  if (konamiBuffer.length > 10) konamiBuffer.shift();
  if (konamiBuffer.join(',') === konamiCode.join(',')) {
    showToast('🎉 CHEAT CODE ACTIVATED — Expert Mode Unlocked!', 'success');
    document.body.style.setProperty('--blue', '#7C3AED');
    setTimeout(() => document.body.style.setProperty('--blue', '#3B82F6'), 4000);
  }
});
