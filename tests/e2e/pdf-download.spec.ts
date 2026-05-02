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

async function goToThankYou(page: Page) {
  await completeStep1(page)
  await ensureAccordionOpenFor('#pet-description', page)
  await page
    .locator('#pet-description')
    .fill('Friendly, calm, house-trained pet with stable daily routine.')
  await ensureAccordionOpenFor('#step4-photo-input', page)
  await page.setInputFiles('#step4-photo-input', {
    name: 'pet.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  })
  await page.getByRole('button', { name: 'Ganzes Bild' }).click()
  await expect(page.getByRole('button', { name: /Create draft PDF/i })).toBeVisible()
}

test('PDF download: no page errors or console errors', async ({ page }) => {
  test.setTimeout(120_000)

  const consoleErrors: string[] = []
  const pageErrors: string[] = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    }
  })
  page.on('pageerror', (err) => {
    pageErrors.push(`${err.name}: ${err.message}\n${err.stack ?? ''}`)
  })

  await startWizard(page)
  await goToThankYou(page)

  // In builder, "PDF / Print" opens a print view in a new tab.
  const newPagePromise = page.context().waitForEvent('page', { timeout: 15_000 }).catch(() => null)
  await page.getByRole('button', { name: 'PDF / Print' }).click()
  const printPage = await newPagePromise
  if (printPage) {
    await printPage.waitForLoadState('domcontentloaded')
    await expect(printPage.locator('div[style*="210mm"]').first()).toBeVisible()
    await printPage.close()
  }

  // Allow async PDF chunk + generation
  await page.waitForTimeout(3000)

  expect(pageErrors, `Uncaught page errors:\n${pageErrors.join('\n---\n')}`).toEqual([])

  const filteredConsole = consoleErrors.filter(
    (t) =>
      !t.includes('favicon') &&
      !t.includes('ResizeObserver') &&
      !t.includes('Failed to load resource') // network noise if any
  )
  expect(filteredConsole, `Console errors:\n${filteredConsole.join('\n---\n')}`).toEqual([])
})
