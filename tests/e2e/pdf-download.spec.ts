import { expect, test, type Page } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9p2Xb9sAAAAASUVORK5CYII=',
  'base64'
);

async function startWizard(page: Page) {
  await page.goto('/de/');
  await page.locator('main button').first().click();
  await expect(page.locator('nav[aria-label="Form navigation"]')).toBeVisible();
}

async function completeStep1(page: Page) {
  const allInputs = page.locator('main input');
  await allInputs.first().fill('Max Muster');
  await page.locator('main input[placeholder*="Luna"], main input[placeholder*="luna"]').first().fill('Luna');
  await page.locator('button[aria-label="Go to next step"]').click();
}

async function goToThankYou(page: Page) {
  await completeStep1(page);
  await page.locator('button[aria-label="Go to next step"]').click(); // step 2
  await expect(page.locator('#pet-description')).toBeVisible();
  await page.locator('#pet-description').fill('Friendly, calm, house-trained pet with stable daily routine.');
  await page.locator('button[aria-label="Go to next step"]').click(); // step 3 -> 4
  await expect(page.locator('#step4-photo-input')).toBeVisible();
  await page.setInputFiles('#step4-photo-input', {
    name: 'pet.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });
  await page.getByRole('button', { name: 'Ganzes Bild' }).click();
  await page.locator('button[aria-label="Go to next step"]').click(); // step 4 -> 5
  await page.locator('button[aria-label="Go to next step"]').click(); // step 5 -> 6
  const navButtons = page.locator('nav[aria-label="Form navigation"] button');
  await navButtons.nth(1).click(); // finish
  await expect(page.locator('main')).toContainText(/PDF herunterladen|Download PDF/i);
}

test('PDF download: no page errors or console errors', async ({ page }) => {
  test.setTimeout(120_000);

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    pageErrors.push(`${err.name}: ${err.message}\n${err.stack ?? ''}`);
  });

  await startWizard(page);
  await goToThankYou(page);

  const downloadPromise = page.waitForEvent('download', { timeout: 60_000 }).catch(() => null);
  await page.getByRole('button', { name: /PDF herunterladen|Download PDF/i }).click();

  const download = await downloadPromise;
  if (download) {
    expect(download.suggestedFilename()).toMatch(/\.pdf$/i);
  }

  // Allow async PDF chunk + generation
  await page.waitForTimeout(3000);

  expect(
    pageErrors,
    `Uncaught page errors:\n${pageErrors.join('\n---\n')}`
  ).toEqual([]);

  const filteredConsole = consoleErrors.filter(
    (t) =>
      !t.includes('favicon') &&
      !t.includes('ResizeObserver') &&
      !t.includes('Failed to load resource') // network noise if any
  );
  expect(
    filteredConsole,
    `Console errors:\n${filteredConsole.join('\n---\n')}`
  ).toEqual([]);
});
