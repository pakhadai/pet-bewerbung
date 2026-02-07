#!/usr/bin/env node

/**
 * Verification script for useFormWizard refactoring
 * Checks that all hooks are properly exported and backward compatible
 */

const fs = require('fs');
const path = require('path');

const HOOKS_DIR = path.join(__dirname, 'src', 'hooks');
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const RESET = '\x1b[0m';
const YELLOW = '\x1b[33m';

console.log('\n🔍 Verifying useFormWizard Refactoring...\n');

let errors = 0;
let warnings = 0;

// Check that all TypeScript hooks exist
const requiredHooks = [
  'useDeviceId.ts',
  'useWizardNavigation.ts',
  'useFormData.ts',
  'usePremiumSession.ts',
  'useAIGeneration.ts',
  'useTranslation.ts',
  'useTheme.ts',
  'useToast.ts',
  'useFormWizard.ts',
];

console.log('✓ Checking TypeScript hooks...');
requiredHooks.forEach(hook => {
  const filePath = path.join(HOOKS_DIR, hook);
  if (fs.existsSync(filePath)) {
    console.log(`  ${GREEN}✓${RESET} ${hook}`);
  } else {
    console.log(`  ${RED}✗${RESET} ${hook} - NOT FOUND`);
    errors++;
  }
});

// Check that compatibility files exist
console.log('\n✓ Checking compatibility files...');
const compatFiles = [
  'useFormWizard.js',
  'index.ts',
];

compatFiles.forEach(file => {
  const filePath = path.join(HOOKS_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ${GREEN}✓${RESET} ${file}`);
  } else {
    console.log(`  ${RED}✗${RESET} ${file} - NOT FOUND`);
    errors++;
  }
});

// Check that backup files exist
console.log('\n✓ Checking backup files...');
const backupFiles = [
  'useFormWizard.legacy.js',
  'index.legacy.js',
];

backupFiles.forEach(file => {
  const filePath = path.join(HOOKS_DIR, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ${GREEN}✓${RESET} ${file}`);
  } else {
    console.log(`  ${YELLOW}⚠${RESET} ${file} - NOT FOUND (optional)`);
    warnings++;
  }
});

// Check documentation
console.log('\n✓ Checking documentation...');
const docs = [
  path.join(HOOKS_DIR, 'README.md'),
  path.join(HOOKS_DIR, 'ARCHITECTURE.md'),
  path.join(__dirname, 'REFACTORING_SUMMARY.md'),
];

docs.forEach(doc => {
  if (fs.existsSync(doc)) {
    console.log(`  ${GREEN}✓${RESET} ${path.basename(doc)}`);
  } else {
    console.log(`  ${YELLOW}⚠${RESET} ${path.basename(doc)} - NOT FOUND`);
    warnings++;
  }
});

// Check exports in index.ts
console.log('\n✓ Checking exports in index.ts...');
const indexPath = path.join(HOOKS_DIR, 'index.ts');
if (fs.existsSync(indexPath)) {
  const indexContent = fs.readFileSync(indexPath, 'utf8');

  const expectedExports = [
    'useFormWizard',
    'useWizardNavigation',
    'useFormData',
    'usePremiumSession',
    'useAIGeneration',
    'useTranslation',
    'useTheme',
    'useToast',
    'useDeviceId',
    'usePremium', // Alias
    'useAIGenerations', // Alias
    'useTemplateSelection',
    'usePaymentFlow',
    'useScrollVisibility',
    'useFormValidation',
  ];

  expectedExports.forEach(exportName => {
    if (indexContent.includes(exportName)) {
      console.log(`  ${GREEN}✓${RESET} ${exportName}`);
    } else {
      console.log(`  ${RED}✗${RESET} ${exportName} - NOT EXPORTED`);
      errors++;
    }
  });
}

// Check localStorage keys are preserved
console.log('\n✓ Checking localStorage keys...');
const storageKeys = [
  'pet-bewerbung-device-id',
  'pet-bewerbung-step',
  'pet-bewerbung-form-data',
  'pet-bewerbung-premium-token',
  'pet-bewerbung-premium-expiry',
  'pet-bewerbung-ai-generations',
  'pet-bewerbung-premium-ai-generations',
];

storageKeys.forEach(key => {
  // Check if key exists in any hook file
  let found = false;
  requiredHooks.forEach(hook => {
    const filePath = path.join(HOOKS_DIR, hook);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(key)) {
        found = true;
      }
    }
  });

  if (found) {
    console.log(`  ${GREEN}✓${RESET} ${key}`);
  } else {
    console.log(`  ${YELLOW}⚠${RESET} ${key} - NOT FOUND (may not be needed)`);
    warnings++;
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (errors === 0 && warnings === 0) {
  console.log(`${GREEN}✅ All checks passed! Refactoring is complete.${RESET}`);
} else if (errors === 0) {
  console.log(`${YELLOW}⚠ ${warnings} warning(s), but no critical errors.${RESET}`);
} else {
  console.log(`${RED}❌ ${errors} error(s) found. Please fix them.${RESET}`);
  if (warnings > 0) {
    console.log(`${YELLOW}⚠ ${warnings} warning(s) also found.${RESET}`);
  }
}
console.log('='.repeat(50) + '\n');

process.exit(errors > 0 ? 1 : 0);
