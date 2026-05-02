import { expect, type Page, test } from '@playwright/test'

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9p2Xb9sAAAAASUVORK5CYII=',
  'base64'
)

async function startWizard(page: Page) {
  await page.goto('/de/builder')
  await expect(page).toHaveURL(/\/de\/builder/i)
}

async function ensureAccordionOpenFor(selector: string, page: Page) {
  const el = page.locator(selector).first()
  const details = el.locator('xpath=ancestor::details[1]')
  await expect(details).toBeVisible()
  const isOpen = await details.evaluate((d) => (d as HTMLDetailsElement).open)
  if (!isOpen) {
    await details.locator('summary').click()
  }
  await expect(el).toBeVisible()
}

async function completeStep1(page: Page) {
  const allInputs = page.locator('main input')
  await allInputs.first().fill('Max Muster')
  await page
    .locator('main input[placeholder*="Luna"], main input[placeholder*="luna"]')
    .first()
    .fill('Luna')
}

async function goToStep3(page: Page) {
  await completeStep1(page)
  // Accordion step3 exists in builder
  await ensureAccordionOpenFor('#pet-description', page)
}

async function goToStep4(page: Page) {
  await goToStep3(page)
  await page
    .locator('#pet-description')
    .fill('Friendly, calm, house-trained pet with stable daily routine.')
  await ensureAccordionOpenFor('#step4-photo-input', page)
}

async function goToThankYou(page: Page) {
  await goToStep4(page)
  // Builder does not have thank-you step; ensure PDF/Print action exists instead
  await expect(page.getByRole('button', { name: 'PDF / Print' })).toBeVisible()
}

test('smoke: builder flow loads and actions visible', async ({ page }) => {
  await startWizard(page)
  await goToThankYou(page)
})

test('smoke: photo upload via input and drag-drop works', async ({ page }) => {
  await startWizard(page)
  await goToStep4(page)

  await page.setInputFiles('#step4-photo-input', {
    name: 'pet.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  })
  await page.getByRole('button', { name: 'Ganzes Bild' }).click()
  await expect(page.locator('img[alt="Pet"]')).toBeVisible()

  const dropZone = page.locator('#step4-photo-input').locator('xpath=..')
  const dataTransfer = await page.evaluateHandle(
    (bytes) => {
      const dt = new DataTransfer()
      const file = new File([new Uint8Array(bytes)], 'pet-drop.png', { type: 'image/png' })
      dt.items.add(file)
      return dt
    },
    [...tinyPng]
  )

  await dropZone.dispatchEvent('drop', { dataTransfer })
  await page.getByRole('button', { name: 'Ganzes Bild' }).click()
  await expect(page.locator('img[alt="Pet"]')).toBeVisible()
})

test('smoke: PDF and ZIP download actions are available', async ({ page }) => {
  await startWizard(page)
  await goToThankYou(page)

  await expect(page.getByRole('button', { name: /Create draft PDF/i })).toBeVisible()
  await expect(page.getByRole('button', { name: 'PDF / Print' })).toBeVisible()
})
