import { expect, test } from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const DRAFT_KEY = 'pet_cv_draft'

const templates = ['classic', 'modern', 'compact', 'buddy', 'buddyTest'] as const

function buildDraft(selectedTemplate: (typeof templates)[number]) {
  return {
    ownerName: 'Max Muster',
    email: 'max@example.com',
    phone: '+41 79 123 45 67',
    street: 'Bahnhofstrasse',
    houseNumber: '1',
    postal: '8001',
    city: 'Zürich',

    name: 'Luna',
    petType: 'dog',
    breed: 'Mix',
    gender: 'f',
    age: '3',
    weight: '18',

    insuranceProvider: 'AXA',
    chipId: 'CH-123456',
    vetName: 'Tierarzt Zürich',
    vetPhone: '+41 44 000 00 00',

    showAdvancedHealthInfo: true,
    noiseLevel: 'low',
    aloneTime: '4',
    activeHours: 'Morning / Evening',
    behaviorWithChildren: 'good',
    behaviorWithPets: 'neutral',

    previousLandlordName: 'Hausverwaltung Beispiel AG',
    previousLandlordPhone: '+41 44 111 11 11',
    previousLandlordEmail: 'office@example.com',
    previousDuration: '2 years',

    emergencyContactName: 'Anna Muster',
    emergencyContactPhone: '+41 79 222 22 22',
    emergencyContactRelation: 'Partner',
    secondaryEmergencyContact: 'Nachbar: +41 79 333 33 33',

    generatedText:
      'Friendly, calm, house-trained pet with stable daily routine. Quiet, clean, and well-socialized.',

    lang: 'de',
    selectedTemplate,
    updatedAt: Date.now(),
  }
}

test('generate static template preview images (webp)', async ({ browser }) => {
  const outDir = path.join(process.cwd(), 'public', 'template-previews')

  for (const templateType of templates) {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    })

    await context.addInitScript((args) => {
      // Disable print auto-trigger on /print route
      window.print = () => undefined

      // Seed draft before app loads
      localStorage.setItem(args.key, JSON.stringify(args.value))
    }, {
      key: DRAFT_KEY,
      value: buildDraft(templateType),
    })

    const page = await context.newPage()
    await page.goto('/de/print')

    const a4 = page.locator('div[style*="210mm"]').first()
    await expect(a4).toBeVisible()
    await expect(a4.locator('h1')).toBeVisible()

    const tmpPng = path.join(outDir, `${templateType}.png`)
    const outWebp = path.join(outDir, `${templateType}.webp`)

    await a4.screenshot({
      path: tmpPng,
      type: 'png',
    })

    await sharp(tmpPng).webp({ quality: 82 }).toFile(outWebp)
    await fs.unlink(tmpPng)

    await context.close()
  }
})

