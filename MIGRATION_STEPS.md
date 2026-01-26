# 📋 ПОКРОКОВІ ІНСТРУКЦІЇ МІГРАЦІЇ

## КРОК 1: ОНОВИТИ index.html

**Файл:** `index.html`

**Що робити:**
1. Відкрити файл `index.html`
2. Замінити весь вміст на новий код з новим дизайном
3. Зберегти файл

**Важливо:** 
- Залишити `<div id="root"></div>` (він потрібен для React)
- Залишити `<script type="module" src="/main.jsx"></script>` (поки що, пізніше змінимо на index.tsx)

---

## КРОК 2: ДОДАТИ НОВІ КЛЮЧІ ПЕРЕКЛАДІВ

**Файли:** 
- `src/translations/de.js`
- `src/translations/fr.js`
- `src/translations/it.js`
- `src/translations/rm.js`
- `src/translations/en.js`
- `src/translations/ua.js`

**Що робити:**
Для КОЖНОГО файлу перекладів:

1. Відкрити файл
2. Знайти об'єкт з перекладами (наприклад, після `landing: { ... }`)
3. Додати нові ключі після існуючих:

```javascript
header: {
  title: "PetCV.io",  // або переклад для кожної мови
  donate: "Donate"    // або переклад для кожної мови
},
hero: {
  badge: "100% Free & No Signup",
  title: "Free Pet CV Creator",
  privacyTitle: "Data Privacy Shield",
  privacyDesc: "Your data is never stored. Everything happens in your browser.",
  subtitle: "Build a professional resume for your furry friend in minutes. Simple, fast, and completely private.",
  cta: "Start Securely"
},
steps: {
  step1: {
    title: "Add Details",
    subtitle: "Owner & Pet Info"
  },
  step2: {
    title: "Emergency Info",
    subtitle: "Vet & Contacts"
  },
  step3: {
    title: "Upload & Select",
    subtitle: "Photo & Template",
    badge: "Local"
  },
  step4: {
    title: "Get PDF",
    subtitle: "Download Resume"
  }
},
footer: {
  copyright: "© 2023 PetCV.io. Made with ❤️ for pets everywhere.",
  impressum: "Impressum",
  privacy: "Privacy Policy"
}
```

**Примітка:** Для кожної мови потрібно перекласти тексти на відповідну мову!

---

## КРОК 3: ОНОВИТИ tailwind.config.js

**Файл:** `tailwind.config.js`

**Що робити:**
1. Відкрити файл
2. Замінити весь вміст на:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: "#e0f2f1",
        peach: "#fff3e0",
        lavender: "#f3e5f5",
        primary: "#b39ddb",
        "primary-dark": "#9575cd",
        "accent-pink": "#f8bbd0",
        "text-main": "#4a4a4a",
        "text-secondary": "#6a6a6a",
        "trust-green": "#c8e6c9",
        "dark-bg": "#111827",
        "dark-text-main": "#f3f4f6",
        "dark-text-secondary": "#9ca3af",
      },
      fontFamily: {
        "display": ["Amatic SC", "cursive"],
        "sans": ["Quicksand", "sans-serif"]
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
```

3. Зберегти файл

---

## КРОК 4: СТВОРИТИ index.tsx (ЗАМІСТЬ main.jsx)

**Файл:** `index.tsx` (новий файл в корені проекту)

**Що робити:**
1. Створити новий файл `index.tsx` в корені проекту
2. Скопіювати код з нового дизайну (index.tsx)
3. Змінити імпорт: `import App from './App'` → `import App from './src/App'`
4. Зберегти файл

**Після цього:**
- Оновити `index.html`: змінити `<script type="module" src="/main.jsx"></script>` на `<script type="module" src="/index.tsx"></script>`
- Старий `main.jsx` можна видалити (але не зараз, після перевірки)

---

## КРОК 5: СТВОРИТИ Header.tsx

**Файл:** `src/components/Header.tsx` (новий файл)

**Що робити:**
1. Створити новий файл `src/components/Header.tsx`
2. Скопіювати код з нового дизайну
3. **ВАЖЛИВО:** Замінити всі хардкод тексти на переклади:

**Замінити:**
- `"PetCV.io"` → `{t?.header?.title || "PetCV.io"}`
- `"Donate"` → `{t?.header?.donate || "Donate"}`
- Мови залишити як є (EN, UA, DE, FR, IT) - це коди мов

4. Додати пропси для перекладів:
   - Додати `t` в інтерфейс `HeaderProps`
   - Передавати `t` з App.jsx

5. Зберегти файл

---

## КРОК 6: СТВОРИТИ Hero.tsx

**Файл:** `src/components/Hero.tsx` (новий файл)

**Що робити:**
1. Створити новий файл `src/components/Hero.tsx`
2. Скопіювати код з нового дизайну
3. **ВАЖЛИВО:** Замінити всі хардкод тексти на переклади:

**Замінити:**
- `"100% Free & No Signup"` → `{t?.hero?.badge || "100% Free & No Signup"}`
- `"Free Pet CV Creator"` → `{t?.hero?.title || "Free Pet CV Creator"}`
- `"Data Privacy Shield"` → `{t?.hero?.privacyTitle || "Data Privacy Shield"}`
- `"Your data is never stored..."` → `{t?.hero?.privacyDesc || "Your data is never stored..."}`
- `"Build a professional resume..."` → `{t?.hero?.subtitle || "Build a professional resume..."}`
- `"Start Securely"` → `{t?.hero?.cta || "Start Securely"}`

4. Додати пропси:
   - Додати `t` в інтерфейс `HeroProps`
   - Додати `onStartClick` або `setStep` для кнопки CTA

5. Зберегти файл

---

## КРОК 7: СТВОРИТИ Steps.tsx

**Файл:** `src/components/Steps.tsx` (новий файл)

**Що робити:**
1. Створити новий файл `src/components/Steps.tsx`
2. Скопіювати код з нового дизайну
3. **ВАЖЛИВО:** Замінити всі хардкод тексти на переклади:

**Замінити в StepCard:**
- `title` → `{t?.steps?.step1?.title || "Add Details"}`
- `subtitle` → `{t?.steps?.step1?.subtitle || "Owner & Pet Info"}`
- `badge?.text` → `{t?.steps?.step3?.badge || "Local"}`

**Для кожного кроку:**
- step1: `t?.steps?.step1?.title` та `t?.steps?.step1?.subtitle`
- step2: `t?.steps?.step2?.title` та `t?.steps?.step2?.subtitle`
- step3: `t?.steps?.step3?.title`, `t?.steps?.step3?.subtitle`, `t?.steps?.step3?.badge`
- step4: `t?.steps?.step4?.title` та `t?.steps?.step4?.subtitle`

4. Додати пропси:
   - Додати `t` в інтерфейси

5. Зберегти файл

---

## КРОК 8: СТВОРИТИ Footer.tsx

**Файл:** `src/components/Footer.tsx` (новий файл)

**Що робити:**
1. Створити новий файл `src/components/Footer.tsx`
2. Скопіювати код з нового дизайну
3. **ВАЖЛИВО:** Замінити всі хардкод тексти на переклади:

**Замінити:**
- `"© 2023 PetCV.io. Made with ❤️ for pets everywhere."` → `{t?.footer?.copyright || "© 2023 PetCV.io..."}`
- `"Impressum"` → `{t?.footer?.impressum || "Impressum"}`
- `"Privacy Policy"` → `{t?.footer?.privacy || "Privacy Policy"}`

4. Додати пропси:
   - Додати `t` в інтерфейс `FooterProps`
   - Додати `onOpenLegal` для посилань (якщо потрібно)

5. Зберегти файл

---

## КРОК 9: ОНОВИТИ App.jsx → App.tsx

**Файл:** `src/App.jsx` → перейменувати на `src/App.tsx`

**Що робити:**

1. **Перейменувати файл:** `App.jsx` → `App.tsx`

2. **Інтегрувати нові компоненти:**
   - Замінити імпорт `Header` на новий `Header.tsx`
   - Замінити імпорт `LandingPage` на новий `Hero.tsx`
   - Додати імпорт `Steps.tsx`
   - Замінити імпорт `Footer` на новий `Footer.tsx`

3. **Оновити рендер:**
   - В `renderStep()` для step 0: замінити `<LandingPage />` на `<Hero />` + `<Steps />`
   - В основному рендері: замінити `<Header />` на новий
   - В основному рендері: замінити `<Footer />` на новий

4. **Адаптувати теми:**
   - Новий дизайн використовує `darkMode: boolean` замість `theme: string`
   - Створити функцію конвертації або змінити логіку

5. **Передати пропси:**
   - Передати `t` (переклади) до всіх нових компонентів
   - Передати `darkMode` та `toggleDarkMode` до Header
   - Передати `setStep` до Hero (для кнопки CTA)

6. **Зберегти файл**

**ВАЖЛИВО:** НЕ видаляти всю логіку wizard! Тільки замінити компоненти Header, Hero, Steps, Footer.

---

## КРОК 10: ОНОВИТИ СИСТЕМУ ТЕМ

**Файли:**
- `src/components/ThemeToggle.jsx`
- `src/components/GlobalStyles.jsx`

**Що робити:**

### ThemeToggle.jsx:
1. Відкрити файл
2. Прибрати тему `sepia` з масиву `themes`
3. Залишити тільки `light` та `dark`
4. Оновити логіку перемикання

### GlobalStyles.jsx:
1. Відкрити файл
2. Прибрати об'єкт `sepia` з `themeVars`
3. Оновити CSS змінні для нових кольорів (mint, peach, lavender, тощо)
4. Додати підтримку нових кольорів

---

## КРОК 11: ОНОВИТИ CSS СТИЛІ

**Файл:** `src/index.css` або додати до `GlobalStyles.jsx`

**Що робити:**
1. Додати нові утиліти Tailwind:
   - `.hand-drawn-border`
   - `.hand-drawn-button`
   - `.sketch-icon`
   - `.blob-shape`

2. Додати стилі для фону (як в новому index.html):
   - Light mode background
   - Dark mode background

---

## КРОК 12: ПЕРЕВІРКА ТА ТЕСТУВАННЯ

**Що перевірити:**
1. ✅ Проект компілюється без помилок
2. ✅ Всі компоненти відображаються
3. ✅ Переклади працюють (перемикання мов)
4. ✅ Темна тема працює
5. ✅ Кнопка "Start Securely" переходить на step 1
6. ✅ Всі кроки wizard працюють як раніше
7. ✅ Footer відображається правильно

---

## ⚠️ ВАЖЛИВІ ПРИМІТКИ

1. **НЕ видаляти старі файли** поки не перевірите що все працює
2. **Зберегти всю логіку wizard** - це найважливіше!
3. **Переклади** - переконайтеся що додали переклади для ВСІХ мов
4. **TypeScript** - якщо є помилки типів, можна тимчасово використати `// @ts-ignore`
5. **Тести** - після кожного кроку перевіряйте що проект запускається

---

## 🆘 ЯКЩО ЩОСЬ НЕ ПРАЦЮЄ

1. Перевірте консоль браузера на помилки
2. Перевірте що всі імпорти правильні
3. Перевірте що всі переклади додані
4. Перевірте що TypeScript компілюється
5. Перевірте що Tailwind класи правильні

---

**ГОТОВО!** Після виконання всіх кроків у вас буде новий дизайн зі збереженою функціональністю! 🎉
