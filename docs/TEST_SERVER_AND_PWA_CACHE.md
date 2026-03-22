# Тестовий сервер і кеш PWA

Проєкт використовує **Vite PWA** (`vite-plugin-pwa`). У **production** (`npm run build` + статичний хост) браузер може довго тримати **старий JavaScript** (service worker кешує `*.js`).

Якщо після оновлення коду PDF / ZIP поводяться як раніше:

1. **Жорстке оновлення:** `Ctrl+Shift+R` (Windows/Linux) або `Cmd+Shift+R` (macOS).
2. **Очистити дані сайту:** DevTools → **Application** → **Storage** → *Clear site data* (або видалити лише service worker: **Service Workers** → Unregister).
3. Закрити всі вкладки з цим доменом і відкрити знову (інколи SW оновлюється після `autoUpdate` лише після перезавантаження).

У **режимі розробки** (`npm run dev`) PWA вимкнено (`devOptions.enabled: false`), тому там достатньо звичайного оновлення сторінки.

---

Після деплою нової збірки на тестовий сервер переконайся, що завантажуються **нові** імена файлів у `dist/assets/` (у них змінюється hash у назві).
