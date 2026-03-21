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

async function goToStep3(page: Page) {
  await completeStep1(page);
  await page.locator('button[aria-label="Go to next step"]').click();
  await expect(page.locator('#pet-description')).toBeVisible();
}

async function goToStep4(page: Page) {
  await goToStep3(page);
  await page.locator('#pet-description').fill('Friendly, calm, house-trained pet with stable daily routine.');
  await page.locator('button[aria-label="Go to next step"]').click();
  await expect(page.locator('#step4-photo-input')).toBeVisible();
}

async function goToThankYou(page: Page) {
  await goToStep4(page);
  await page.locator('button[aria-label="Go to next step"]').click(); // step 4 -> step 5
  await page.locator('button[aria-label="Go to next step"]').click(); // step 5 -> step 6
  const navButtons = page.locator('nav[aria-label="Form navigation"] button');
  await navButtons.nth(1).click(); // finish
  await expect(page.locator('main')).toContainText(/set|fertig|thank/i);
}

test('smoke: full wizard flow reaches thank-you page', async ({ page }) => {
  await startWizard(page);
  await goToThankYou(page);
});

test('smoke: photo upload via input and drag-drop works', async ({ page }) => {
  await startWizard(page);
  await goToStep4(page);

  await page.setInputFiles('#step4-photo-input', {
    name: 'pet.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });
  await page.getByRole('button', { name: 'Ganzes Bild' }).click();
  await expect(page.locator('img[alt="Pet"]')).toBeVisible();

  const dropZone = page.locator('#step4-photo-input').locator('xpath=..');
  const dataTransfer = await page.evaluateHandle((bytes) => {
    const dt = new DataTransfer();
    const file = new File([new Uint8Array(bytes)], 'pet-drop.png', { type: 'image/png' });
    dt.items.add(file);
    return dt;
  }, [...tinyPng]);

  await dropZone.dispatchEvent('drop', { dataTransfer });
  await page.getByRole('button', { name: 'Ganzes Bild' }).click();
  await expect(page.locator('img[alt="Pet"]')).toBeVisible();
});

test('smoke: PDF and ZIP download actions are available', async ({ page }) => {
  await startWizard(page);
  await goToThankYou(page);

  const downloadButtons = page.locator('main .max-w-xl button');
  await expect(downloadButtons).toHaveCount(2);
});
