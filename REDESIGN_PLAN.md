# План розробки та редизайну — Pet-Bewerbung (Wuff-Bewerbung)

## Поточний стан (після міграції 4-крокового візарда)

### Що зроблено

- **Entry:** `index.tsx` → `App.tsx`, лендінг (Hero + Steps), градієнти light/dark у `index.html`.
- **Header:** логотип `/logo.png`, перемикач мов (`font-sans`), темна/світла тема, кнопка «Spenden».
- **Footer:** © 2026 pet-bewerbung.ch, Impressum, Datenschutz, AGB, FAQ (заглушка); `font-display` / `font-sans`.
- **4-кроковий прогрес:** StepProgress (1 Details → 2 Emergency → 3 Template → 4 Finish), крок 5 = Preview (Finish).
- **Кроки з новим hand-drawn дизайном:**
  - **Step 1 — Details:** `Step1Details` (Halter + Tier в одному екрані), `hand-drawn-border`, `font-display` заголовки, privacy‑badge.
  - **Step 3 — Photo + Template:** `Step3UploadSelect` (фото + вибір шаблону в одному екрані), hand-drawn картки, прев’ю шаблонів.
- **Навігація:** 4-кроковий прогрес знизу, Prev/Next, Download на Preview.
- **i18n:** оновлені ключі (footer.terms, footer.faq, step1Details, stepsNew тощо) у всіх мовах.
- **Nginx:** `Cache-Control: no-cache` для `/index.html`, щоб після деплою завжди підхоплювалась нова збірка.

---

## Список сторінок / екранів

| # | Екран | Компонент | Статус редизайну | Примітки |
|---|--------|-----------|------------------|----------|
| 0 | Лендінг | Hero + Steps | ✅ Готово | Hand-drawn, градієнти |
| 1 | Details | Step1Details | ✅ Готово | Hand-drawn, об’єднаний Owner+Pet |
| 2 | Emergency (Health & Insurance) | Step3HealthInsurance | ⏳ TODO | Ще `theme-card` / `theme-border` |
| 3 | Photo + Template | Step3UploadSelect | ✅ Готово | Hand-drawn |
| 4 | Summary | Step6Summary | ⏳ TODO | Ще `theme-card` |
| 5 | Preview | Step8Preview | ⏳ TODO | Ще `theme-card` |
| 6 | Thank You | Step9ThankYou | ⏳ TODO | Частково theme-card |
| — | Payment Success | PaymentSuccess | ⏳ TODO | Footer є, картки/стилі — старий стиль |
| — | Legal (Impressum / Datenschutz / AGB) | LegalPages | ⏳ TODO | Модалки, `theme-card` |
| — | Donate Modal | DonateModal | ⏳ TODO | `theme-card` |
| — | Payment Modal | PaymentModal | ⏳ TODO | `theme-card` |
| — | Cookie Banner | CookieBanner | ⏳ TODO | `theme-card` |
| — | Error Boundary | ErrorBoundary | ⏳ TODO | `theme-card` |
| — | Image Cropper | ImageCropper | ⏳ TODO | Модалка, `theme-card` |
| — | Language Selector | LanguageSelector | ⏳ TODO | Dropdown, `theme-card` |
| — | Theme Toggle | ThemeToggle | ⏳ TODO | `theme-card` |

---

## TODO — Редизайн (hand-drawn стиль)

### Пріоритет 1 — кроки візарда

- [ ] **Step 2 — Emergency (Step3HealthInsurance):** замінити `theme-card` / `theme-border` на `hand-drawn-border`, `font-display` для заголовків, `cardCl`/`titleCl`/`mutedCl` з `darkMode`, privacy‑badge при потребі.
- [ ] **Step 4 — Summary (Step6Summary):** аналогічно — hand-drawn картки, типографіка, підтримка dark mode.
- [ ] **Step 5 — Preview (Step8Preview):** обгорнути прев’ю документа в hand-drawn контейнер, вирівняти з іншими кроками.
- [ ] **Step 6 — Thank You (Step9ThankYou):** замінити кнопки/картки з `theme-card` на `hand-drawn-button` / hand-drawn контейнери.

### Пріоритет 2 — модалки та глобальні UI

- [ ] **LegalPages:** модалки Impressum / Datenschutz / AGB — hand-drawn контейнер замість `theme-card`.
- [ ] **DonateModal:** hand-drawn картки для варіантів донату, кнопки — `hand-drawn-button`.
- [ ] **PaymentModal:** обгортка Stripe Elements у hand-drawn стиль.
- [ ] **CookieBanner:** hand-drawn картка, кнопки в новому стилі.
- [ ] **ImageCropper:** модалка з hand-drawn контейнером.

### Пріоритет 3 — допоміжні компоненти

- [ ] **PaymentSuccess:** окрема сторінка після Stripe Checkout — привести до hand-drawn (картки, типографіка).
- [ ] **ErrorBoundary:** fallback UI з hand-drawn стилем.
- [ ] **LanguageSelector:** dropdown з hand-drawn обводкою / кнопками.
- [ ] **ThemeToggle:** перемикач у hand-drawn стилі.

### Загальні правила редизайну

- Картки: `hand-drawn-border border-2 rounded-2xl`, `cardCl` = `darkMode ? 'bg-gray-800/60 border-gray-600' : 'bg-white/80 border-gray-300'`.
- Заголовки: `font-display font-bold`, `titleCl` / `mutedCl` залежно від теми.
- Кнопки: `hand-drawn-button`, `font-display` де доречно.
- Privacy‑badge: `hand-drawn-border`, зелений акцент (`bg-green-50` / `bg-green-900/20`), іконка `verified_user`.

---

## TODO — Функціональні виправлення

- [ ] **FAQ:** зараз заглушка (toast «coming soon»). Згодом — окрема сторінка або розділ з контентом.
- [ ] **Опис характеру (Description):** старий Step 4 (Description) прибрано з візарда. Якщо потрібно повернути — визначити місце (наприклад, після Emergency або окремий підкрок) і адаптувати під 4 кроки.
- [ ] **Валідація:** переконатись, що `useFormWizard` / `useFormValidation` коректно покривають об’єднані кроки (Details, Photo+Template) і всі обов’язкові поля.
- [ ] **Збереження кроку (localStorage):** зараз зберігаються кроки 1–5. При зміні структури кроків — перевірити поведінку при поверненні на сайт.
- [ ] **E2E / ручні тести:** перевірка повного флоу (Landing → Details → Emergency → Photo+Template → Summary → Preview → Download / Thank You, донат, оплата).

---

## TODO — Технічне та DevOps

- [ ] **Docker:** після змін завжди перезбирати frontend (`docker-compose build --no-cache frontend`) і перезапускати контейнер.
- [ ] **Кеш:** переконатись, що `index.html` не кешується довго (у nginx вже додано `no-cache` для `/index.html`).
- [ ] **Типи (TypeScript):** поступово переводити ключові компоненти на `.tsx` та строгі типи (App, кроки, модалки).
- [ ] **Видалити старі файли:** після повного переходу на новий дизайн — прибрати `*.old`, `*.backup`, непотрібні старі кроки (наприклад `Step1OwnerInfo`, `Step2PetInfo`, `Step4Description`, `Step5Photo`, `Step7TemplateSelect`), якщо вони більше не використовуються.

---

## Рекомендований порядок робіт

1. **Кроки 2, 4, 5, 6** — редизайн Step3HealthInsurance, Step6Summary, Step8Preview, Step9ThankYou.
2. **Модалки** — Legal, Donate, Payment, Cookie, ImageCropper.
3. **PaymentSuccess, ErrorBoundary** — окремі сторінки / fallback.
4. **LanguageSelector, ThemeToggle** — дрібні, але помітні елементи.
5. **FAQ, Description (якщо потрібно), валідація, очищення старих файлів** — по можливості.

---

*Останнє оновлення: січень 2026*
