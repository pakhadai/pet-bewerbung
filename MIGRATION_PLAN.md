# ПЛАН МІГРАЦІЇ НОВОГО ДИЗАЙНУ

## 📋 ЗАГАЛЬНИЙ ОГЛЯД

**Що міняємо:**
- ✅ `index.html` → новий з новими шрифтами та стилями
- ✅ `main.jsx` → `index.tsx` (TypeScript)
- ✅ `App.jsx` → `App.tsx` (але зберігаємо всю логіку wizard!)
- ✅ `Header.jsx` → `Header.tsx` (новий дизайн + i18n)
- ✅ `LandingPage.jsx` → `Hero.tsx` (новий дизайн + i18n)
- ✅ Додаємо `Steps.tsx` (новий компонент + i18n)
- ✅ `Footer.jsx` → `Footer.tsx` (новий дизайн + i18n)
- ✅ Система тем: 3 теми → 2 теми (light/dark)

**Що НЕ міняємо:**
- ❌ Всю логіку wizard (кроки 1-9)
- ❌ Систему перекладів (структуру i18n)
- ❌ Всі інші компоненти (steps, modals, тощо)

---

## 🔍 ВИЯВЛЕНІ ХАРДКОД ТЕКСТИ

### Header.tsx:
- "PetCV.io" (назва)
- "EN", "UA", "DE", "FR", "IT" (мови)
- "Donate" (кнопка)

### Hero.tsx:
- "100% Free & No Signup" (бейдж)
- "Free Pet CV Creator" (заголовок)
- "Data Privacy Shield" (заголовок)
- "Your data is never stored. Everything happens in your browser." (опис)
- "Build a professional resume for your furry friend in minutes. Simple, fast, and completely private." (підзаголовок)
- "Start Securely" (кнопка CTA)

### Steps.tsx:
- "Add Details" / "Owner & Pet Info" (крок 1)
- "Emergency Info" / "Vet & Contacts" (крок 2)
- "Upload & Select" / "Photo & Template" (крок 3)
- "Get PDF" / "Download Resume" (крок 4)
- "Local" (бейдж на кроці 3)

### Footer.tsx:
- "© 2023 PetCV.io. Made with ❤️ for pets everywhere." (текст)
- "Impressum" (посилання)
- "Privacy Policy" (посилання)

---

## 📝 НОВІ КЛЮЧІ ПЕРЕКЛАДІВ

Додати до всіх файлів перекладів (`de.js`, `fr.js`, `it.js`, `rm.js`, `en.js`, `ua.js`):

```javascript
header: {
  title: "PetCV.io",
  donate: "Donate"
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

---

## 🎨 ЗМІНИ В СИСТЕМІ ТЕМ

**Було:** 3 теми (light, dark, sepia)
**Стало:** 2 теми (light, dark)

**Дії:**
1. Оновити `ThemeToggle.jsx` - прибрати sepia
2. Оновити `GlobalStyles.jsx` - прибрати sepia змінні
3. Оновити `App.jsx` - прибрати sepia логіку

---

## 📦 НЕОБХІДНІ ЗАЛЕЖНОСТІ

Новий дизайн використовує:
- Material Symbols (шрифт) - додати до index.html
- TypeScript - потрібно налаштувати tsconfig

**Дії:**
1. Перевірити чи є `tsconfig.json` (є в проекті)
2. Додати Material Symbols шрифт до index.html
3. Можливо потрібно встановити `@types/react` та `@types/react-dom`

---

## ⚠️ ВАЖЛИВІ МОМЕНТИ

1. **App.tsx** - НЕ видаляти всю логіку wizard! Тільки замінити Header/Hero/Steps/Footer
2. **Теми** - новий дизайн використовує `darkMode` boolean, а не `theme` string
3. **Tailwind** - новий дизайн використовує CDN, але ми залишаємо PostCSS версію
4. **Шрифти** - новий дизайн використовує Amatic SC та Quicksand
5. **Іконки** - новий дизайн використовує Material Symbols, а не lucide-react

---

## ✅ ПОРЯДОК ВИКОНАННЯ

1. **КРОК 1:** Оновити index.html
2. **КРОК 2:** Налаштувати TypeScript (якщо потрібно)
3. **КРОК 3:** Додати нові ключі перекладів до всіх мов
4. **КРОК 4:** Оновити index.tsx (з main.jsx)
5. **КРОК 5:** Мігрувати Header.tsx з i18n
6. **КРОК 6:** Мігрувати Hero.tsx з i18n
7. **КРОК 7:** Додати Steps.tsx з i18n
8. **КРОК 8:** Мігрувати Footer.tsx з i18n
9. **КРОК 9:** Оновити App.tsx (інтегрувати нові компоненти, зберегти wizard)
10. **КРОК 10:** Оновити систему тем (2 теми)
11. **КРОК 11:** Оновити GlobalStyles.jsx для нових кольорів
12. **КРОК 12:** Тестування

---

## 🔧 ТЕХНІЧНІ ДЕТАЛІ

### Нові кольори в Tailwind:
- `mint: "#e0f2f1"`
- `peach: "#fff3e0"`
- `lavender: "#f3e5f5"`
- `primary: "#b39ddb"`
- `primary-dark: "#9575cd"`
- `accent-pink: "#f8bbd0"`
- `text-main: "#4a4a4a"`
- `text-secondary: "#6a6a6a"`
- `trust-green: "#c8e6c9"`
- `dark-bg: "#111827"`
- `dark-text-main: "#f3f4f6"`
- `dark-text-secondary: "#9ca3af"`

### Нові шрифти:
- Display: "Amatic SC"
- Sans: "Quicksand"

### Нові утиліти Tailwind:
- `hand-drawn-border` - рукописні границі
- `hand-drawn-button` - рукописні кнопки
- `sketch-icon` - стиль іконок
- `blob-shape` - форма блоба

---

## 📌 ПРИМІТКИ

- Всі нові компоненти мають TypeScript інтерфейси
- Новий дизайн використовує `darkMode` boolean замість `theme` string
- Потрібно адаптувати передачу пропсів в App.tsx
- Зберегти всю функціональність wizard (кроки 1-9)
