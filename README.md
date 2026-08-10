# NASSAR Academy — دليل التشغيل السريع

مشروع بسيط: HTML + CSS + Vanilla JS + Pyodide (Client-Side فقط) + Google Sheets + Google Apps Script.
لا يوجد أي Backend آخر ولا أي API مدفوع لتشغيل الكود.

---

## 1) إعداد Google Sheet

أنشئ Google Sheet جديد باسم `NASSAR Academy DB`، وأضف بداخله الـSheets التالية بالضبط بهذه الأسماء وهذه الأعمدة (الصف الأول = أسماء الأعمدة):

**Students**
`studentCode | name | grade | center | studentPhone | parentPhone | email | qr | active`

**Exams**
`examId | title | description | duration | active`
(duration بالدقائق، active = TRUE/FALSE)

**Questions**
`examId | question | optionA | optionB | optionC | optionD | correctAnswer`
(correctAnswer تكون A أو B أو C أو D)

**Results**
`studentCode | examId | score | total | percentage | startTime | submitTime`
(تُملأ تلقائيًا من الكود — لا تكتب فيها يدويًا)

**Attempts**
`studentCode | examId | started | submitted | startTime`
(تُملأ تلقائيًا من الكود)

**Announcements**
`id | text | active | date`

**Files**
`title | type | url | active`

**Videos**
`title | youtubeUrl | active`

**Schedule**
`day | class | details | active`

**SavedCodes**
`studentCode | codeName | language | code | createdAt`
(تُملأ تلقائيًا من الكود)

> مهم: أسماء الأعمدة يجب أن تكون مطابقة تمامًا (بنفس الحروف) لأن الكود يقرأها بالاسم.

أضف بيانات تجريبية في `Students` و `Exams` و `Questions` لتجربة المشروع.

---

## 2) Deploy لـ Google Apps Script

1. من داخل الـ Google Sheet: **Extensions → Apps Script**.
2. احذف أي كود موجود، والصق محتوى ملف `google-apps-script/Code.gs`.
3. احفظ (Ctrl+S).
4. من أعلى يمين الصفحة: **Deploy → New deployment**.
5. اختر النوع (Type): **Web app**.
6. الإعدادات:
   - **Execute as:** Me
   - **Who has access:** Anyone
7. اضغط **Deploy**، ووافق على صلاحيات الوصول لحسابك (Authorize access).
8. انسخ الرابط الذي يظهر لك، يكون شكله تقريبًا:
   `https://script.google.com/macros/s/XXXXXXXXXXXX/exec`

> عند أي تعديل مستقبلي في `Code.gs`، لازم تعمل **New deployment** جديد (أو Manage deployments → Edit → Deploy) عشان التعديلات تنعكس على الرابط.

---

## 3) وضع الرابط داخل المشروع

افتح ملف `app.js`، أول سطر فيه تقريبًا:

```js
const CONFIG = {
  API_URL: "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE"
};
```

استبدل القيمة برابط الـWeb App اللي نسخته في الخطوة السابقة:

```js
const CONFIG = {
  API_URL: "https://script.google.com/macros/s/XXXXXXXXXXXX/exec"
};
```

احفظ الملف.

---

## 4) رفع الشعار (Logo)

استبدل ملف `assets/logo.png` بشعار NASSAR الحقيقي (بنفس الاسم `logo.png`)، ويفضل أن يكون مربعًا (مثلاً 256×256).

---

## 5) رفع المشروع على GitHub Pages

1. أنشئ Repository جديد على GitHub (مثلاً `nassar-academy`).
2. ارفع كل الملفات:
   ```
   index.html
   style.css
   app.js
   assets/logo.png
   google-apps-script/Code.gs   (اختياري، للأرشفة فقط)
   ```
3. من داخل الـ Repository: **Settings → Pages**.
4. تحت **Branch** اختر `main` والمجلد `/ (root)`، ثم **Save**.
5. بعد دقيقة أو دقيقتين، هيظهرلك رابط الموقع تحت شكل:
   `https://your-username.github.io/nassar-academy/`

---

## 🆕 التحديثات الجديدة

- **الألوان**: التصميم بقى بالكامل أسود + أحمر Vivid مطابق للوجو والبوسترات بتاعتك.
- **اللوجو**: شغال في كل الصفحات، وخلفيته بقت شفافة (مقتطع من الشعار اللي بعتهولي).
- **رقم الهاتف**: تسجيل الدخول بقى يقبل الرقم بأي صيغة: `1234567891` أو `01234567891` أو `201234567891` أو `+201234567891` — كلهم بيتطابقوا مع نفس الرقم المسجل، من غير ما تغيّر حاجة في الـSheet.
- **محرر الأكواد**: بقى دايمًا من الشمال لليمين (LTR) زي أي IDE عادي، حتى لو الموقع نفسه بالعربي.
- **زرار Home**: بقى ثابت في الـHeader في كل صفحة (أيقونة بيت)، بالإضافة لتبويب Home في الشريط السفلي على الموبايل.
- **ترجمة عربي/إنجليزي**: زرار AR/EN في أعلى الصفحة يبدّل لغة الواجهة كاملة فورًا (ومحفوظة في localStorage).
- **أيقونات جديدة**: كل الإيموجي اتبدلت بأيقونات SVG نضيفة متناسقة مع هوية الموقع.
- **فيديو خلفية في صفحة الدخول**: استخدمت الفيديو اللي بعتهولي (`assets/hero.mp4`) كخلفية متحركة في صفحة الـLogin.
- **شخصيات تفاعلية (Mascots)**: في صفحة الكود، لما Python بيحمّل أول مرة أو لما يحصل Error في الكود، بتظهر شخصية (تفكير / صدمة) مقتطعة من الصور اللي بعتهولي.
- **أنيميشن عام**: دخول الصفحات، الكروت في الـHome، والـTimer في الامتحان كلهم بقى فيهم حركة بسيطة تدي حس "حي" للموقع.

> فيديو الخلفية حجمه ~1MB بعد الضغط، فمش هيأثر على سرعة الموقع، وGitHub Pages بيقبل ملفات لحد 100MB بدون مشاكل.

## ملاحظات سريعة

- Python يعمل داخل المتصفح عن طريق **Pyodide** — أول مرة يختار الطالب Python هيظهر "Loading Python..." ثم "Python Ready ✓"، وده طبيعي ومرة واحدة فقط لكل جلسة.
- JavaScript يعمل مباشرة داخل المتصفح، بدون أي API خارجي.
- لو ظهرت مشكلة اتصال بالـ API، تأكد إن رابط الـDeployment صحيح وإن **Who has access = Anyone**.
- Student Code يُحفظ في `localStorage` بعد أول تسجيل دخول، فمفيش داعي لتسجيل الدخول كل مرة — وفيه زرار Logout لو حبيت تمسحه.
