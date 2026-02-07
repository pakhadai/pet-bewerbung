# 🔧 Quick Fix for PDF Build Error

## Error

```
"INITIAL_DATA" is not exported by "src/components/pdf/PdfBase.jsx"
```

## Solution (Option 1 - Recommended)

Add `INITIAL_DATA` import and export to `PdfBase.jsx`:

```javascript
// At the top of src/components/pdf/PdfBase.jsx
import { INITIAL_DATA } from '../../constants';

// At the bottom, add to exports
export {
  // ... existing exports
  INITIAL_DATA  // Add this
};
```

## Solution (Option 2)

Remove `INITIAL_DATA` from imports in PDF templates and pass it as prop instead.

In `src/components/pdf/templates/ClassicPdf.jsx`:
```javascript
// REMOVE this line:
import { ... INITIAL_DATA } from '../PdfBase';

// ADD to component props:
const ClassicPdf = ({ data, t, initialData, ... }) => {
  // Use initialData instead of INITIAL_DATA
}
```

## Test

After fix:
```bash
npm run build
```

Should complete successfully.

---

**Estimated Time:** 5 minutes
**Priority:** CRITICAL
