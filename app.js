/* ==========================================================================
   NASSAR Academy — app.js
   Vanilla JS only. JavaScript runs directly in the browser.
   Python runs via Pyodide (WebAssembly) — no external code execution API.
   ========================================================================== */

// !! Paste your deployed Google Apps Script Web App URL here !!
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycby-fMsEgNr3w25yGEBS1LslnSO5d5mF6Jt-W8L4Bkv4oB4ZCKnDK3lz4IBL-JxOCkr7/exec"
};

const STORAGE_KEY = "nassar_student_code";
const LANG_KEY = "nassar_lang";

let STATE = {
  studentCode: null,
  student: null,
  currentLang: "javascript",
  pyodide: null,
  currentExam: null,
  examTimerHandle: null,
  examQuestions: [],
  examAnswers: {},
  examStartTime: null,
  loadedCode: null,
  uiLang: localStorage.getItem(LANG_KEY) || "ar"
};

/* ---------------------------------------------------------------------- */
/* i18n                                                                    */
/* ---------------------------------------------------------------------- */

const I18N = {
  ar: {
    loginHeading: "أتقن الرياضيات والبرمجة",
    studentLogin: "تسجيل دخول الطالب",
    invalidLogin: "كود الطالب أو رقم الهاتف غير صحيح",
    studentCode: "كود الطالب",
    phoneNumber: "رقم الهاتف",
    login: "دخول",
    navHome: "الرئيسية", navCode: "الكود", navExams: "الامتحانات", navProfile: "ملفي",
    navScore: "نتيجتي", navFiles: "الملفات", navVideos: "الفيديوهات", navSchedule: "الجدول", navMyCodes: "أكوادي",
    announcement: "🔥 إعلان",
    run: "تشغيل", clear: "مسح", saveCode: "حفظ الكود",
    output: "المخرجات", outputHint: "شغّل الكود عشان تشوف المخرجات هنا.",
    examRules: "قواعد الامتحان",
    rule1: "اختيار من متعدد، 4 اختيارات لكل سؤال",
    rule2: "المؤقت يبدأ فور دخولك ولا يمكن إيقافه",
    rule3: "محاولة واحدة فقط مسموح بها",
    rule4: "الامتحان يُسلَّم تلقائيًا عند انتهاء الوقت",
    startExam: "ابدأ الامتحان", submitExam: "تسليم الامتحان",
    yourScore: "نتيجتك", backHome: "العودة للرئيسية",
    qrHint: "امسح للحصول على كود الطالب",
    codeName: "اسم الكود", cancel: "إلغاء", save: "حفظ",
    welcomePrefix: "أهلاً،",
    timeLeft: "الوقت المتبقي",
    enterCodePhone: "من فضلك أدخل كود الطالب ورقم الهاتف",
    connectionError: "خطأ في الاتصال، حاول مرة أخرى",
    noExams: "لا يوجد امتحانات متاحة الآن",
    couldNotLoadExams: "تعذر تحميل الامتحانات",
    questions: "سؤال", minutes: "دقيقة",
    alreadyTaken: "تم تسليمه", completed: "مكتمل",
    alreadyTakenMsg: "لقد قمت بأداء هذا الامتحان بالفعل.",
    couldNotStartExam: "تعذر بدء الامتحان",
    timeUpMsg: "انتهى الوقت — تعذر التسليم التلقائي، برجاء المحاولة مرة أخرى.",
    couldNotSubmitExam: "تعذر تسليم الامتحان",
    questionOf: "سؤال {n} من {total}",
    noResultsYet: "لا توجد نتائج امتحانات بعد",
    couldNotLoadScore: "تعذر تحميل نتيجتك",
    latestExam: "آخر امتحان",
    couldNotLoadProfile: "تعذر تحميل الملف الشخصي",
    noFiles: "لا توجد ملفات متاحة",
    couldNotLoadFiles: "تعذر تحميل الملفات",
    open: "فتح",
    noVideos: "لا توجد فيديوهات متاحة",
    couldNotLoadVideos: "تعذر تحميل الفيديوهات",
    noSchedule: "لا يوجد جدول متاح",
    couldNotLoadSchedule: "تعذر تحميل الجدول",
    noSavedCodes: "لا يوجد أكواد محفوظة بعد",
    couldNotLoadCodes: "تعذر تحميل أكوادك",
    writeCodeFirst: "اكتب كودًا أولاً",
    enterCodeName: "أدخل اسم الكود",
    codeSaved: "تم حفظ الكود",
    couldNotSaveCode: "تعذر حفظ الكود",
    codeLoaded: "تم تحميل الكود",
    couldNotOpenCode: "تعذر فتح الكود",
    loadingPython: "جاري تحميل Python...",
    pythonReady: "Python جاهز ✓",
    pythonFailed: "فشل تحميل Python.",
    noOutput: "(لا يوجد مخرجات)",
    writeSomeCode: "اكتب كودًا أولاً.",
    mascotThinking: "بيحمّل بايثون أول مرة... لحظات وهيبقى جاهز",
    mascotShocked: "في حاجة غلط في الكود، شوف الـ Output"
  },
  en: {
    loginHeading: "Master Math & Programming",
    studentLogin: "Student Login",
    invalidLogin: "Invalid Student Code or Phone Number",
    studentCode: "Student Code",
    phoneNumber: "Phone Number",
    login: "Login",
    navHome: "Home", navCode: "Code", navExams: "Exams", navProfile: "Profile",
    navScore: "Score", navFiles: "Files", navVideos: "Videos", navSchedule: "Schedule", navMyCodes: "My Codes",
    announcement: "🔥 Announcement",
    run: "Run", clear: "Clear", saveCode: "Save Code",
    output: "Output", outputHint: "Run your code to see output here.",
    examRules: "Exam Rules",
    rule1: "Multiple choice, 4 options per question",
    rule2: "Timer starts once you begin and cannot be paused",
    rule3: "Only one attempt is allowed",
    rule4: "Exam submits automatically when time runs out",
    startExam: "Start Exam", submitExam: "Submit Exam",
    yourScore: "Your Score", backHome: "Back to Home",
    qrHint: "Scan for Student Code",
    codeName: "Code Name", cancel: "Cancel", save: "Save",
    welcomePrefix: "Welcome,",
    timeLeft: "Time Left",
    enterCodePhone: "Please enter your Student Code and Phone Number",
    connectionError: "Connection error. Please try again.",
    noExams: "No exams available right now",
    couldNotLoadExams: "Could not load exams",
    questions: "Questions", minutes: "Minutes",
    alreadyTaken: "Already taken", completed: "Completed",
    alreadyTakenMsg: "You have already taken this exam.",
    couldNotStartExam: "Could not start exam",
    timeUpMsg: "Time is up — could not submit automatically, please retry.",
    couldNotSubmitExam: "Could not submit exam",
    questionOf: "Question {n} of {total}",
    noResultsYet: "No exam results yet",
    couldNotLoadScore: "Could not load your score",
    latestExam: "Latest Exam",
    couldNotLoadProfile: "Could not load profile",
    noFiles: "No files available",
    couldNotLoadFiles: "Could not load files",
    open: "Open",
    noVideos: "No videos available",
    couldNotLoadVideos: "Could not load videos",
    noSchedule: "No schedule available",
    couldNotLoadSchedule: "Could not load schedule",
    noSavedCodes: "No saved codes yet",
    couldNotLoadCodes: "Could not load your codes",
    writeCodeFirst: "Write some code first",
    enterCodeName: "Enter a code name",
    codeSaved: "Code saved",
    couldNotSaveCode: "Could not save code",
    codeLoaded: "Code loaded",
    couldNotOpenCode: "Could not open code",
    loadingPython: "Loading Python...",
    pythonReady: "Python Ready ✓",
    pythonFailed: "Failed to load Python.",
    noOutput: "(no output)",
    writeSomeCode: "Write some code first.",
    mascotThinking: "Loading Python for the first time — hang tight",
    mascotShocked: "Something went wrong — check the output"
  }
};

function t(key) {
  const dict = I18N[STATE.uiLang] || I18N.ar;
  return dict[key] || I18N.ar[key] || key;
}

function applyLanguage(lang) {
  STATE.uiLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  const html = $("htmlRoot");
  html.lang = lang;
  html.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });

  $("langToggleBtn").textContent = lang === "ar" ? "EN" : "AR";

  // Re-render whatever view is currently open so dynamic lists pick up the new language.
  if (STATE.currentView) showView(STATE.currentView, { skipLoad: false });
}

$("langToggleBtn").addEventListener("click", () => {
  applyLanguage(STATE.uiLang === "ar" ? "en" : "ar");
});

/* ---------------------------------------------------------------------- */
/* API helper                                                             */
/* ---------------------------------------------------------------------- */

// Uses text/plain content-type to avoid CORS preflight against Apps Script.
async function api(action, payload = {}) {
  const body = JSON.stringify({ action, ...payload });
  const res = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body
  });
  if (!res.ok) throw new Error("Network error");
  const data = await res.json();
  if (data && data.ok === false) {
    throw new Error(data.error || "Request failed");
  }
  return data;
}

/* ---------------------------------------------------------------------- */
/* Utilities                                                              */
/* ---------------------------------------------------------------------- */

function $(id) { return document.getElementById(id); }

function showToast(msg) {
  const toastEl = $("toast");
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(showToast._h);
  showToast._h = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function pad2(n) { return String(n).padStart(2, "0"); }

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${pad2(m)}:${pad2(sec)}`;
}

/* ---------------------------------------------------------------------- */
/* View / navigation management                                          */
/* ---------------------------------------------------------------------- */

const VIEW_TITLE_KEYS = {
  home: null, code: "navCode", profile: "navProfile", exams: "navExams",
  examRules: null, examTaking: null, examResult: null,
  myscore: "navScore", files: "navFiles", videos: "navVideos",
  schedule: "navSchedule", mycodes: "navMyCodes"
};

const NAV_MAIN_VIEWS = ["home", "code", "exams", "myscore", "profile"];

function showView(name, opts = {}) {
  document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
  const el = $(name + "View");
  if (el) el.classList.remove("hidden");

  const titleKey = VIEW_TITLE_KEYS[name];
  $("headerTitle").textContent = titleKey ? t(titleKey) : "NASSAR Academy";

  $("homeBtn").classList.toggle("active-glow", name === "home");

  document.querySelectorAll(".nav-item").forEach(b => {
    b.classList.toggle("active", b.dataset.nav === name && NAV_MAIN_VIEWS.includes(name));
  });

  STATE.currentView = name;

  const loaders = {
    home: loadHome,
    profile: loadProfile,
    exams: loadExams,
    myscore: loadMyScore,
    files: loadFiles,
    videos: loadVideos,
    schedule: loadSchedule,
    mycodes: loadMyCodes
  };
  if (!opts.skipLoad && loaders[name]) loaders[name]();

  window.scrollTo(0, 0);
}

document.addEventListener("click", (e) => {
  const navBtn = e.target.closest("[data-nav]");
  if (navBtn) showView(navBtn.dataset.nav);
});

/* ---------------------------------------------------------------------- */
/* Login / Logout                                                        */
/* ---------------------------------------------------------------------- */

$("loginBtn").addEventListener("click", doLogin);
$("loginPhone").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });
$("loginCode").addEventListener("keydown", e => { if (e.key === "Enter") doLogin(); });

async function doLogin() {
  const code = $("loginCode").value.trim();
  const phone = $("loginPhone").value.trim();
  $("loginError").classList.remove("show");

  if (!code || !phone) {
    $("loginError").textContent = t("enterCodePhone");
    $("loginError").classList.add("show");
    return;
  }

  $("loginBtnText").innerHTML = '<span class="spinner"></span>';
  $("loginBtn").disabled = true;

  try {
    const data = await api("login", { studentCode: code, phone });
    if (data.valid) {
      STATE.studentCode = code;
      STATE.student = data.student;
      localStorage.setItem(STORAGE_KEY, code);
      enterApp();
    } else {
      $("loginError").textContent = t("invalidLogin");
      $("loginError").classList.add("show");
    }
  } catch (err) {
    $("loginError").textContent = t("connectionError");
    $("loginError").classList.add("show");
  } finally {
    $("loginBtnText").textContent = t("login");
    $("loginBtn").disabled = false;
  }
}

$("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  STATE.studentCode = null;
  STATE.student = null;
  $("appShell").classList.add("hidden");
  $("loginView").classList.remove("hidden");
  $("loginCode").value = "";
  $("loginPhone").value = "";
  const v = $("loginVideo");
  if (v) v.play().catch(() => {});
});

function enterApp() {
  $("loginView").classList.add("hidden");
  $("appShell").classList.remove("hidden");
  showView("home");
}

async function tryAutoLogin() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;
  try {
    const data = await api("getStudent", { studentCode: saved });
    if (data.student) {
      STATE.studentCode = saved;
      STATE.student = data.student;
      enterApp();
      return;
    }
  } catch (err) {
    // fall through to login screen
  }
  localStorage.removeItem(STORAGE_KEY);
}

/* ---------------------------------------------------------------------- */
/* Home                                                                   */
/* ---------------------------------------------------------------------- */

async function loadHome() {
  const s = STATE.student || {};
  $("welcomeName").textContent = `${t("welcomePrefix")} ${s.name || ""} 👋`;
  $("welcomeMeta").textContent = [s.grade, s.center].filter(Boolean).join(" · ") || "";

  try {
    const data = await api("getAnnouncements");
    const active = (data.announcements || []).filter(a => a.active);
    if (active.length) {
      const latest = active[active.length - 1];
      $("announcementText").textContent = latest.text;
      $("announcementCard").classList.remove("hidden");
    } else {
      $("announcementCard").classList.add("hidden");
    }
  } catch (err) {
    $("announcementCard").classList.add("hidden");
  }
}

/* ---------------------------------------------------------------------- */
/* Profile                                                                */
/* ---------------------------------------------------------------------- */

async function loadProfile() {
  $("profileRows").innerHTML = spinnerBlock();
  try {
    const data = await api("getStudent", { studentCode: STATE.studentCode });
    const s = data.student;
    STATE.student = s;
    $("pName").textContent = s.name || "—";

    const rows = [
      [t("studentCode"), s.studentCode],
      [STATE.uiLang === "ar" ? "الصف" : "Grade", s.grade],
      [STATE.uiLang === "ar" ? "السنتر" : "Center", s.center],
      [STATE.uiLang === "ar" ? "رقم الطالب" : "Student Phone", s.studentPhone],
      [STATE.uiLang === "ar" ? "رقم ولي الأمر" : "Parent Phone", s.parentPhone]
    ];
    if (s.email) rows.push(["Email", s.email]);

    $("profileRows").innerHTML = rows
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `<div class="profile-row"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>`)
      .join("");

    const qrData = encodeURIComponent(s.studentCode);
    $("qrImg").src = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${qrData}`;
  } catch (err) {
    $("profileRows").innerHTML = emptyState(t("couldNotLoadProfile"));
  }
}

/* ---------------------------------------------------------------------- */
/* Shared render helpers                                                 */
/* ---------------------------------------------------------------------- */

function spinnerBlock() {
  return `<div class="loading-block"><span class="spinner spinner-dark"></span></div>`;
}

function emptyState(msg) {
  return `<div class="empty-state">
    <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16.3" r="0.6" fill="currentColor" stroke="none"/></svg></span>
    ${esc(msg)}
  </div>`;
}

/* ---------------------------------------------------------------------- */
/* IDE — JavaScript (native) + Python (Pyodide)                          */
/* ---------------------------------------------------------------------- */

$("langJs").addEventListener("click", () => setLang("javascript"));
$("langPy").addEventListener("click", () => setLang("python"));

function setLang(lang) {
  STATE.currentLang = lang;
  $("langJs").classList.toggle("active", lang === "javascript");
  $("langPy").classList.toggle("active", lang === "python");
  $("codeEditor").placeholder = lang === "javascript"
    ? 'console.log("Hello Nassar");'
    : 'print("Hello Nassar")';

  if (lang === "python") ensurePyodideLoaded();
}

$("runBtn").addEventListener("click", runCode);
$("clearBtn").addEventListener("click", () => {
  $("codeEditor").value = "";
  $("outputPanel").textContent = t("outputHint");
  hideMascot();
});

function showMascot(imgSrc, msg) {
  $("mascotImg").src = imgSrc;
  $("mascotMsg").textContent = msg;
  $("mascotPop").classList.remove("hidden");
}

function hideMascot() {
  $("mascotPop").classList.add("hidden");
}

async function runCode() {
  const code = $("codeEditor").value;
  const out = $("outputPanel");
  out.innerHTML = "";
  hideMascot();

  if (!code.trim()) {
    out.textContent = t("writeSomeCode");
    return;
  }

  if (STATE.currentLang === "javascript") {
    runJavaScript(code, out);
  } else {
    await runPython(code, out);
  }
}

function runJavaScript(code, out) {
  const logs = [];
  const originalLog = console.log;
  const originalErr = console.error;
  console.log = (...args) => logs.push(args.map(a => stringifyArg(a)).join(" "));
  console.error = (...args) => logs.push(args.map(a => stringifyArg(a)).join(" "));

  try {
    // Direct in-browser execution — no external API involved.
    const fn = new Function(code);
    fn();
    out.textContent = logs.length ? logs.join("\n") : t("noOutput");
  } catch (err) {
    const errLine = `Error: ${err.message}`;
    out.innerHTML = (logs.length ? esc(logs.join("\n")) + "\n" : "") + `<span class="err">${esc(errLine)}</span>`;
    showMascot("assets/mascot-shocked.png", t("mascotShocked"));
  } finally {
    console.log = originalLog;
    console.error = originalErr;
  }
}

function stringifyArg(a) {
  if (typeof a === "object") {
    try { return JSON.stringify(a); } catch { return String(a); }
  }
  return String(a);
}

let pyodideLoadPromise = null;

function ensurePyodideLoaded() {
  if (STATE.pyodide || pyodideLoadPromise) return pyodideLoadPromise;
  const out = $("outputPanel");
  out.innerHTML = `<span class="status">${esc(t("loadingPython"))}</span>`;
  showMascot("assets/mascot-thinking.png", t("mascotThinking"));

  pyodideLoadPromise = (async () => {
    if (!window.loadPyodide) {
      await loadScript("https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js");
    }
    STATE.pyodide = await window.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
    });
    out.innerHTML = `<span class="status">${esc(t("pythonReady"))}</span>`;
    hideMascot();
  })().catch(err => {
    out.innerHTML = `<span class="err">${esc(t("pythonFailed"))}</span>`;
    showMascot("assets/mascot-shocked.png", t("mascotShocked"));
    pyodideLoadPromise = null;
  });

  return pyodideLoadPromise;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = resolve;
    s.onerror = () => reject(new Error("Could not load script: " + src));
    document.head.appendChild(s);
  });
}

async function runPython(code, out) {
  out.innerHTML = `<span class="status">${esc(t("loadingPython"))}</span>`;
  try {
    await ensurePyodideLoaded();
  } catch (err) {
    out.innerHTML = `<span class="err">${esc(t("pythonFailed"))}</span>`;
    return;
  }

  const py = STATE.pyodide;
  try {
    py.runPython(`
import sys, io
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()
    `);
    await py.runPythonAsync(code);
    const stdout = py.runPython("sys.stdout.getvalue()");
    const stderr = py.runPython("sys.stderr.getvalue()");
    let html = "";
    if (stdout) html += esc(stdout);
    if (stderr) {
      html += `<span class="err">${esc(stderr)}</span>`;
      showMascot("assets/mascot-shocked.png", t("mascotShocked"));
    }
    out.innerHTML = html || t("noOutput");
  } catch (err) {
    out.innerHTML = `<span class="err">${esc(err.message)}</span>`;
    showMascot("assets/mascot-shocked.png", t("mascotShocked"));
  } finally {
    py.runPython(`
sys.stdout = sys.__stdout__
sys.stderr = sys.__stderr__
    `);
  }
}

/* ---------------------------------------------------------------------- */
/* Save Code / My Codes                                                  */
/* ---------------------------------------------------------------------- */

$("saveCodeBtn").addEventListener("click", () => {
  if (!$("codeEditor").value.trim()) {
    showToast(t("writeCodeFirst"));
    return;
  }
  $("codeNameInput").value = STATE.loadedCode ? STATE.loadedCode.codeName : "";
  $("saveCodeModal").classList.remove("hidden");
});

$("cancelSaveCodeBtn").addEventListener("click", () => {
  $("saveCodeModal").classList.add("hidden");
});

$("confirmSaveCodeBtn").addEventListener("click", async () => {
  const name = $("codeNameInput").value.trim();
  if (!name) { showToast(t("enterCodeName")); return; }

  $("confirmSaveCodeBtn").disabled = true;
  try {
    await api("saveCode", {
      studentCode: STATE.studentCode,
      codeName: name,
      language: STATE.currentLang,
      code: $("codeEditor").value
    });
    $("saveCodeModal").classList.add("hidden");
    showToast(t("codeSaved"));
    STATE.loadedCode = { codeName: name };
  } catch (err) {
    showToast(t("couldNotSaveCode"));
  } finally {
    $("confirmSaveCodeBtn").disabled = false;
  }
});

async function loadMyCodes() {
  const list = $("mycodesList");
  list.innerHTML = spinnerBlock();
  try {
    const data = await api("getSavedCodes", { studentCode: STATE.studentCode });
    const codes = data.codes || [];
    if (!codes.length) {
      list.innerHTML = emptyState(t("noSavedCodes"));
      return;
    }
    const ext = lang => lang === "python" ? ".py" : ".js";
    list.innerHTML = codes.map(c => `
      <div class="card" data-open-code="${esc(c.codeName)}" style="cursor:pointer;">
        <div class="card-title">${esc(c.codeName)}${ext(c.language)}</div>
        <div class="card-meta">${esc(c.language)} · ${esc(c.createdAt || "")}</div>
      </div>
    `).join("");

    list.querySelectorAll("[data-open-code]").forEach(card => {
      card.addEventListener("click", () => openSavedCode(card.dataset.openCode));
    });
  } catch (err) {
    list.innerHTML = emptyState(t("couldNotLoadCodes"));
  }
}

async function openSavedCode(codeName) {
  try {
    const data = await api("getSavedCode", { studentCode: STATE.studentCode, codeName });
    const c = data.code;
    setLang(c.language === "python" ? "python" : "javascript");
    $("codeEditor").value = c.code;
    STATE.loadedCode = { codeName: c.codeName };
    showView("code");
    showToast(t("codeLoaded"));
  } catch (err) {
    showToast(t("couldNotOpenCode"));
  }
}

/* ---------------------------------------------------------------------- */
/* Exams                                                                  */
/* ---------------------------------------------------------------------- */

async function loadExams() {
  const list = $("examsList");
  list.innerHTML = spinnerBlock();
  try {
    const data = await api("getExams", { studentCode: STATE.studentCode });
    const exams = data.exams || [];
    if (!exams.length) {
      list.innerHTML = emptyState(t("noExams"));
      return;
    }
    list.innerHTML = exams.map(ex => `
      <div class="card" data-exam-open="${esc(ex.examId)}" style="cursor:pointer;">
        <div class="card-title">${esc(ex.title)}</div>
        <div class="card-meta">${esc(ex.questionCount ?? "—")} ${esc(t("questions"))} · ${esc(ex.duration)} ${esc(t("minutes"))}${ex.taken ? " · " + esc(t("alreadyTaken")) : ""}</div>
        ${ex.taken ? `<span class="btn btn-outline btn-sm" style="pointer-events:none;">${esc(t("completed"))}</span>` : `<span class="btn btn-primary btn-sm" style="pointer-events:none;">${esc(t("startExam"))}</span>`}
      </div>
    `).join("");

    list.querySelectorAll("[data-exam-open]").forEach(card => {
      card.addEventListener("click", () => openExamRules(card.dataset.examOpen, exams));
    });
  } catch (err) {
    list.innerHTML = emptyState(t("couldNotLoadExams"));
  }
}

function openExamRules(examId, exams) {
  const exam = exams.find(e => String(e.examId) === String(examId));
  if (!exam) return;

  if (exam.taken) {
    showToast(t("alreadyTakenMsg"));
    return;
  }

  STATE.currentExam = exam;
  $("examRulesTitle").textContent = exam.title;
  $("examRulesMeta").textContent = `${exam.questionCount ?? "—"} ${t("questions")} · ${exam.duration} ${t("minutes")}`;
  showView("examRules", { skipLoad: true });
}

$("startExamBtn").addEventListener("click", startExam);

async function startExam() {
  const exam = STATE.currentExam;
  if (!exam) return;
  $("startExamBtn").disabled = true;
  $("startExamBtn").innerHTML = '<span class="spinner"></span>';

  try {
    const started = await api("startExam", { studentCode: STATE.studentCode, examId: exam.examId });

    if (started.alreadyTaken) {
      showToast(t("alreadyTakenMsg"));
      showView("exams");
      return;
    }

    STATE.examStartTime = started.startTime; // server epoch ms
    const qData = await api("getExamQuestions", { studentCode: STATE.studentCode, examId: exam.examId });
    STATE.examQuestions = qData.questions || [];
    STATE.examAnswers = {};

    renderExamQuestions();
    showView("examTaking", { skipLoad: true });
    startExamTimer(exam.duration, STATE.examStartTime);
  } catch (err) {
    showToast(t("couldNotStartExam"));
  } finally {
    $("startExamBtn").disabled = false;
    $("startExamBtn").textContent = t("startExam");
  }
}

function renderExamQuestions() {
  const container = $("examQuestions");
  container.innerHTML = STATE.examQuestions.map((q, i) => `
    <div class="q-block">
      <div class="q-num">${esc(t("questionOf").replace("{n}", i + 1).replace("{total}", STATE.examQuestions.length))}</div>
      <div class="q-text">${esc(q.question)}</div>
      ${["A", "B", "C", "D"].map(letter => `
        <button class="option-btn" data-qidx="${i}" data-letter="${letter}">
          ${letter}. ${esc(q["option" + letter])}
        </button>
      `).join("")}
    </div>
  `).join("");

  container.querySelectorAll(".option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const qi = btn.dataset.qidx;
      const letter = btn.dataset.letter;
      STATE.examAnswers[qi] = letter;
      container.querySelectorAll(`.option-btn[data-qidx="${qi}"]`).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
  });
}

function startExamTimer(durationMinutes, startTimeMs) {
  clearInterval(STATE.examTimerHandle);
  const endTime = Number(startTimeMs) + durationMinutes * 60 * 1000;

  function tick() {
    const remainingMs = endTime - Date.now();
    const remainingSec = remainingMs / 1000;
    const el = $("examTimer");
    el.textContent = `${t("timeLeft")} ${formatTime(remainingSec)}`;
    el.classList.toggle("low", remainingSec <= 60);

    if (remainingSec <= 0) {
      clearInterval(STATE.examTimerHandle);
      submitExam(true);
    }
  }
  tick();
  STATE.examTimerHandle = setInterval(tick, 1000);
}

$("submitExamBtn").addEventListener("click", () => submitExam(false));

async function submitExam(auto) {
  clearInterval(STATE.examTimerHandle);
  const exam = STATE.currentExam;
  if (!exam) return;

  $("submitExamBtn").disabled = true;
  $("submitExamBtn").innerHTML = '<span class="spinner"></span>';

  const answers = STATE.examQuestions.map((q, i) => ({
    question: q.question,
    answer: STATE.examAnswers[i] || null
  }));

  try {
    const result = await api("submitExam", {
      studentCode: STATE.studentCode,
      examId: exam.examId,
      answers
    });

    $("resultExamTitle").textContent = exam.title;
    $("resultScore").textContent = `${result.score} / ${result.total}`;
    $("resultPct").textContent = `${result.percentage}%`;
    showView("examResult", { skipLoad: true });
  } catch (err) {
    showToast(auto ? t("timeUpMsg") : t("couldNotSubmitExam"));
  } finally {
    $("submitExamBtn").disabled = false;
    $("submitExamBtn").textContent = t("submitExam");
  }
}

/* ---------------------------------------------------------------------- */
/* My Score                                                               */
/* ---------------------------------------------------------------------- */

async function loadMyScore() {
  const el = $("myscoreContent");
  el.innerHTML = spinnerBlock();
  try {
    const data = await api("getMyScore", { studentCode: STATE.studentCode });
    if (!data.latest) {
      el.innerHTML = emptyState(t("noResultsYet"));
      return;
    }
    const r = data.latest;
    el.innerHTML = `
      <div class="result-hero">
        <div class="label">${esc(t("latestExam"))}</div>
        <div class="card-title" style="font-size:16px;margin-bottom:12px;">${esc(r.examTitle)}</div>
        <div class="score">${esc(r.score)} / ${esc(r.total)}</div>
        <div class="pct">${esc(r.percentage)}%</div>
      </div>
    `;
  } catch (err) {
    el.innerHTML = emptyState(t("couldNotLoadScore"));
  }
}

/* ---------------------------------------------------------------------- */
/* Files                                                                  */
/* ---------------------------------------------------------------------- */

const FILE_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

async function loadFiles() {
  const list = $("filesList");
  list.innerHTML = spinnerBlock();
  try {
    const data = await api("getFiles");
    const files = (data.files || []).filter(f => f.active);
    if (!files.length) {
      list.innerHTML = emptyState(t("noFiles"));
      return;
    }
    list.innerHTML = files.map(f => `
      <div class="card">
        <div class="resource-row">
          <div class="info">
            <span class="row-ic">${FILE_ICON}</span>
            <div>
              <div class="title">${esc(f.title)}</div>
              <div class="type">${esc(f.type || "")}</div>
            </div>
          </div>
          <a class="btn btn-outline btn-sm" href="${esc(f.url)}" target="_blank" rel="noopener">${esc(t("open"))}</a>
        </div>
      </div>
    `).join("");
  } catch (err) {
    list.innerHTML = emptyState(t("couldNotLoadFiles"));
  }
}

/* ---------------------------------------------------------------------- */
/* Videos                                                                 */
/* ---------------------------------------------------------------------- */

function youtubeId(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

async function loadVideos() {
  const list = $("videosList");
  list.innerHTML = spinnerBlock();
  try {
    const data = await api("getVideos");
    const videos = (data.videos || []).filter(v => v.active);
    if (!videos.length) {
      list.innerHTML = emptyState(t("noVideos"));
      return;
    }
    list.innerHTML = videos.map(v => {
      const id = youtubeId(v.youtubeUrl);
      const thumb = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "";
      return `
        <a class="card" style="display:block;text-decoration:none;color:inherit;" href="${esc(v.youtubeUrl)}" target="_blank" rel="noopener">
          ${thumb ? `<img class="video-thumb" src="${thumb}" alt="${esc(v.title)}">` : ""}
          <div class="title">▶ ${esc(v.title)}</div>
        </a>
      `;
    }).join("");
  } catch (err) {
    list.innerHTML = emptyState(t("couldNotLoadVideos"));
  }
}

/* ---------------------------------------------------------------------- */
/* Schedule                                                                */
/* ---------------------------------------------------------------------- */

async function loadSchedule() {
  const list = $("scheduleList");
  list.innerHTML = spinnerBlock();
  try {
    const data = await api("getSchedule");
    const rows = (data.schedule || []).filter(r => r.active);
    if (!rows.length) {
      list.innerHTML = emptyState(t("noSchedule"));
      return;
    }
    const byDay = {};
    rows.forEach(r => {
      byDay[r.day] = byDay[r.day] || [];
      byDay[r.day].push(r);
    });
    list.innerHTML = Object.keys(byDay).map(day => `
      <div class="day-group">
        <div class="day-name">${esc(day)}</div>
        ${byDay[day].map(r => `
          <div class="slot-row">
            <span class="cls">${esc(r.class)}</span>
            <span class="meta">${esc(r.details)}</span>
          </div>
        `).join("")}
      </div>
    `).join("");
  } catch (err) {
    list.innerHTML = emptyState(t("couldNotLoadSchedule"));
  }
}

/* ---------------------------------------------------------------------- */
/* Boot                                                                    */
/* ---------------------------------------------------------------------- */

applyLanguage(STATE.uiLang);
tryAutoLogin();
