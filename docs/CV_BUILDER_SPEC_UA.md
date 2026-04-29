# Спека: Pet-CV (Haustier-Dossier) — поля, секції, шаблони, стек

Цей документ описує **всі поля**, які вже передбачені в `PetData`, як вони збираються у **Builder** (односторінковий конструктор), як відображаються в HTML/PDF, і що потрібно для розробки **CV Builder / Template Builder** (live preview).

## Ідея продукту (для чого це зроблено)

Ринок оренди житла у Швейцарії конкурентний, а наявність тварини — часта причина відмови. Pet-CV робить “ризик” для орендодавця більш контрольованим і зрозумілим, показуючи:

- **Хто власник**: контактні дані + адреса (зручно зв’язатися).
- **Хто тварина**: базові параметри (порода/вік/вага/стать/тип) + фото.
- **Низькі ризики**: вакцинація/реєстрація/кастрація/страхування/готовність до депозиту.
- **Повсякденна поведінка**: шумність, час наодинці, активні години, взаємодія з дітьми/іншими тваринами.
- **Довіра**: референс попереднього орендодавця + контакти на випадок надзвичайної ситуації.

Ключова філософія: **local-first / privacy by design** — дані не йдуть на сервер, усе формується в браузері, PDF генерується локально.

## Поточний стек і архітектура (коротко)

- **Frontend**: React 18 + Vite + TypeScript + TailwindCSS
- **State**: Zustand (`src/stores/formStore.ts`) + autosave draft
- **i18n**: lazy loading перекладів `translations/*.ts` (DE/FR/IT/RM/EN)
- **PDF**: `@react-pdf/renderer` (генерація blob локально)
- **Шаблони**:
  - HTML A4 preview: `src/components/SwissDocument.tsx` → templates registry
  - PDF templates: `src/components/pdf/templates/*Pdf.tsx`
- **Фото**: завантаження + компресія + crop (HEIC/HEIF підтримуються з фолбек-хінтом)
- **Збереження**: чернетка (без фото) у `localStorage`, фото в IndexedDB (через `simpleStorage`)

## Роути (UI flow)

У межах локалі `/{lang}/`:

- `/{lang}/` — landing (Hero)
- `/{lang}/builder` — **Builder**: форма (секції) + live A4 preview
- `/{lang}/print` — **Print**: окрема сторінка тільки з документом, яка викликає `window.print()` (відкривається лише по кнопці)

> Legacy: старий візард (step-based) може існувати як back-compat шлях (`/{lang}/wizard`), але основний сценарій — builder.

## Модель даних (всі поля PetData)

Джерело істини: `src/types/form.ts` (`PetData`).

### 1) Owner (власник)

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `ownerName` | `string` | Builder: Owner section | HTML/PDF: Owner section |
| `street` | `string` | Builder: Owner section | Owner section (address) |
| `houseNumber` | `string` | Builder: Owner section | Owner section (address) |
| `postal` | `string` | Builder: Owner section | Owner section (address) |
| `city` | `string` | Builder: Owner section | Owner section (address) |
| `phone` | `string` | Builder: Owner section | Owner section + QR vCard |
| `email` | `string` | Builder: Owner section | Owner section + QR vCard |

### 2) Pet (основні дані тварини)

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `name` | `string` | Builder: Pet section | Pet details (великий заголовок у Buddy/BuddyTest) |
| `petType` | `'dog' \| 'cat' \| 'other'` | Builder: Pet section | Photo badge + Pet details |
| `breed` | `string` | Builder: Pet section | Pet details |
| `age` | `number \| string` | Builder: Pet section | Pet details |
| `weight` | `number \| string` | Builder: Pet section | Pet details |
| `gender` | `'m' \| 'f'` | Builder: Pet section | Pet details |

### 3) Health & legal / страхування (розширений блок, керується перемикачем)

> Показ у документі (Behavior/Legal/Reference) залежить від `showAdvancedHealthInfo` (`getShowAdvancedHealthInfo()`).

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `showAdvancedHealthInfo` | `boolean` | Builder: Advanced toggle | Керує видимістю блоків |
| `insuranceProvider` | `string` | Builder: Advanced section | Legal section |
| `insuranceNumber` | `string?` | (тип є, UI може не мати) | (потенційно: Legal) |
| `chipId` | `string` | Builder: Advanced section | Legal section |
| `vetName` | `string` | Builder: Advanced section | Legal section (combined) |
| `vetPhone` | `string` | Builder: Advanced section | Legal section (combined) |
| `hasVaccination` | `boolean` | Builder: Advanced section | Legal status item |
| `isNeutered` | `boolean` | Builder: Advanced section | Legal status item |
| `hasRegistration` | `boolean` | Builder: Advanced section | Legal status item |
| `willingToPayDeposit` | `boolean?` | Builder: Advanced section | Legal status item |
| `medicalConditions` | `string` | Builder: Advanced section | Legal section (notes) |

### 4) Behavior / routine (розширений блок)

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `noiseLevel` | `'low' \| 'medium' \| 'high'` | Builder: Advanced section | Behavior section (badge) |
| `aloneTime` | `number \| string` | Builder: Advanced section | Behavior section (`xh`) |
| `activeHours` | `string` | Builder: Advanced section | Behavior section |
| `behaviorWithChildren` | `'good' \| 'neutral' \| 'bad' \| ''` | Builder: Advanced section | Behavior section (badge) |
| `behaviorWithPets` | `'good' \| 'neutral' \| 'bad' \| ''` | Builder: Advanced section | Behavior section (badge) |
| `behaviorNotes` | `string?` | (тип є, UI може не мати) | (потенційно: Behavior) |

### 5) References & emergency (розширений блок)

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `previousLandlordName` | `string` | Builder: Advanced section | Reference section |
| `previousLandlordPhone` | `string` | Builder: Advanced section | Reference section |
| `previousLandlordEmail` | `string?` | Builder: Advanced section | Reference section |
| `previousDuration` | `string` | Builder: Advanced section | Reference section |
| `emergencyContactName` | `string` | Builder: Advanced section | Reference section |
| `emergencyContactPhone` | `string` | Builder: Advanced section | Reference section |
| `emergencyContactRelation` | `string` | Builder: Advanced section | Reference section |
| `secondaryEmergencyContact` | `string?` | Builder: Advanced section | Reference section (footer line) |

### 6) Description (текст “про тварину”)

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `generatedText` | `string` | Builder: Description section | Description section (HTML/PDF) |
| `keywords` | `string?` | (тип є, UI може не мати) | (потенційно: генератор) |

### 7) Photo & template

| Поле | Тип | Де вводиться | Де показується |
|---|---|---|---|
| `photo` | `string \| null` | Builder: Photo section | Photo section |
| `selectedTemplate` | `'classic' \| 'modern' \| 'compact' \| 'buddy' \| 'buddyTest'` | Builder: Template section | HTML/PDF rendering |

### 8) Метадані

| Поле | Тип | Примітка |
|---|---|---|
| `lang` | `'de' \| 'en' \| 'fr' \| 'it' \| 'rm'` | активна мова UI + URL (`/{lang}/`) |
| `createdAt` | `string?` | може використовуватись для історії/експорту |
| `updatedAt` | `string?` | autosave у draft |

## Валідація (що є “мінімально необхідним”)

Джерело: `src/hooks/useFormValidation.ts` (`validateStep`).

- **Step 1** (мінімум для старту CV):
  - `ownerName` (мін. 2 символи)
  - `name` (мін. 2 символи)
  - `petType` (обраний)
  - якщо введено `email` → має бути валідний
  - якщо введено `phone` → Swiss phone валідний
  - якщо введено `postal` → Swiss postal валідний
- **Step 3**:
  - `generatedText` має бути непорожній (можна ввести вручну або згенерувати)
- Фото/розширені поля/шаблон — **не обовʼязкові**

## Документ (секції) — як будується CV зараз

У HTML-превʼю документ ділиться на секції (див. `src/components/templates/TemplateBase.tsx`):

- **Sidebar (ліва колонка)**:
  - `photo` (PetPhoto)
  - `owner` (OwnerInfo)
  - `behavior` (BehaviorSection) — тільки якщо `showAdvancedHealthInfo === true`
- **Main (права колонка)**:
  - `details` (PetDetails)
  - `description` (DescriptionSection)
  - `legal` (LegalSection) — тільки якщо `showAdvancedHealthInfo === true`
  - `reference` (ReferenceSection) — тільки якщо `showAdvancedHealthInfo === true` і є хоча б частина даних

PDF використовує окремі шаблон-компоненти (`src/components/pdf/templates/*Pdf.tsx`) але концептуально секції відповідають тим самим групам полів.

## Template Builder (що потрібно для нового CV Builder)

### Ціль

Зробити інструмент, в якому:

- зліва/зверху **форма** (або JSON редактор полів),
- справа **live-preview A4** (поточний `SwissDocument`),
- зміна полів миттєво відображається в превʼю,
- вибір/налаштування шаблону (typography, spacing, colors) теж одразу видно.

### Мінімальна схема для білдера

1. **Дані (PetData)**: один state-обʼєкт, який відповідає полям вище.
2. **Рендер**: `SwissDocument` як “canvas” A4 (HTML), який приймає `data`, `t`, `templateType`.
3. **Секційність**:
   - builder має показувати/ховати секції за умовами:
     - `showAdvancedHealthInfo` + наявність значень (для Reference)
4. **Експорт**:
   - HTML export (для друку/скріншотів)
   - PDF export (через `generatePdfBlob`)

## Модернізація шаблону (напрямок “сучасно і красиво”)

Нинішні варіанти вже є: `classic`, `modern`, `compact`, `buddy`, `buddyTest`.
Для нового “сучасного” шаблону рекомендовано:

- **Більше повітря** (spacing) та чітка сітка для A4
- **Сучасна типографіка**: 1 display font + 1 text font, стабільна ієрархія заголовків
- **Мʼякі контейнери** (rounded, subtle shadows) але **друк-friendly** (не занадто темні фони)
- **Акуратні бейджі** для статусів (vaccinated/registered/etc.) і noise/behavior
- **Кращий hero-блок**: імʼя тварини + порода + стать + ключові метрики (вік/вага/тип) як cards
- **QR-блок** (vCard) — компактний, але читабельний

## Додаткові нотатки (важливо для реалізації)

- `photo` може бути `blob:` URL або `data:` URL. Для PDF треба проганяти `preparePdfData()` (blob→dataURL, webp→jpeg).
- `showAdvancedHealthInfo` — ключовий перемикач, від якого залежить обсяг документу.
- `selectedTemplate` збережений у draft (постійний вибір дизайну).
- Усі тексти UI/PDF беруться з перекладів (i18n), тому template builder має працювати незалежно від мови.

