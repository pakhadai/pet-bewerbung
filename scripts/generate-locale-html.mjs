import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const SITE_ORIGIN = 'https://pet-bewerbung.ch'

const LOCALES = {
  de: {
    htmlLang: 'de',
    hreflang: 'de-CH',
    pageTitle: 'Pet-Bewerbung | Professionelles Haustier-CV für die Wohnungsbewerbung (Schweiz)',
    pageDescription:
      'Kostenloses Pet-CV & Bewerbungsdossier für Hund, Katze und Haustier: Wohnungssuche Schweiz. Daten bleiben im Browser — kein Server.',
    ogLocale: 'de_CH',
  },
  fr: {
    htmlLang: 'fr',
    hreflang: 'fr-CH',
    pageTitle: 'Pet-Bewerbung | CV pour animal — dossier de candidature locative (Suisse)',
    pageDescription:
      'Créez un dossier professionnel pour votre animal (chien, chat) pour la recherche de logement en Suisse. Données traitées localement dans le navigateur.',
    ogLocale: 'fr_CH',
  },
  it: {
    htmlLang: 'it',
    hreflang: 'it-CH',
    pageTitle: 'Pet-Bewerbung | CV per animali domestici — domanda di affitto (Svizzera)',
    pageDescription:
      'Dossier gratuito per cane, gatto o altri animali: ricerca di un appartamento in Svizzera. I dati restano nel browser.',
    ogLocale: 'it_CH',
  },
  en: {
    htmlLang: 'en',
    hreflang: 'en-CH',
    pageTitle: 'Pet-Bewerbung | Pet CV & rental application dossier for Switzerland',
    pageDescription:
      'Free pet resume for renting with a dog or cat in Switzerland. Build a professional dossier — data stays in your browser, privacy-first.',
    ogLocale: 'en_CH',
  },
  rm: {
    htmlLang: 'rm',
    hreflang: 'rm-CH',
    pageTitle: 'Pet-Bewerbung | CV per animals — dossier per ina retschertga da chasa (Svizra)',
    pageDescription:
      'Dossier gratuit per chien, chat e pli: retschertga dad in apartmant en Svizra. Las datas restan en il navigatur.',
    ogLocale: 'rm_CH',
  },
}

const X_DEFAULT = `${SITE_ORIGIN}/de/`

function upsertMetaByName(html, name, content) {
  const escaped = content.replace(/"/g, '&quot;')
  const re = new RegExp(`<meta\\s+name=["']${name}["'][^>]*>`, 'i')
  if (re.test(html)) return html.replace(re, `<meta name="${name}" content="${escaped}" />`)
  return html.replace('</head>', `    <meta name="${name}" content="${escaped}" />\n  </head>`)
}

function upsertMetaByProperty(html, property, content) {
  const escaped = content.replace(/"/g, '&quot;')
  const re = new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i')
  if (re.test(html)) return html.replace(re, `<meta property="${property}" content="${escaped}" />`)
  return html.replace(
    '</head>',
    `    <meta property="${property}" content="${escaped}" />\n  </head>`
  )
}

function buildHreflangLinks() {
  const links = Object.entries(LOCALES)
    .map(
      ([lang, cfg]) =>
        `    <link rel="alternate" hreflang="${cfg.hreflang}" href="${SITE_ORIGIN}/${lang}/" data-static-hreflang="1" />`
    )
    .join('\n')
  return `\n${links}\n    <link rel="alternate" hreflang="x-default" href="${X_DEFAULT}" data-static-hreflang="1" />\n`
}

function localizeHtml(baseHtml, lang, cfg) {
  const canonical = `${SITE_ORIGIN}/${lang}/`
  let html = baseHtml

  html = html.replace(/<html\s+lang="[^"]*">/i, `<html lang="${cfg.htmlLang}">`)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${cfg.pageTitle}</title>`)

  html = upsertMetaByName(html, 'title', cfg.pageTitle)
  html = upsertMetaByName(html, 'description', cfg.pageDescription)
  html = upsertMetaByName(html, 'robots', 'index, follow')

  html = html.replace(
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${canonical}" />`
  )

  html = upsertMetaByProperty(html, 'og:type', 'website')
  html = upsertMetaByProperty(html, 'og:url', canonical)
  html = upsertMetaByProperty(html, 'og:title', cfg.pageTitle)
  html = upsertMetaByProperty(html, 'og:description', cfg.pageDescription)
  html = upsertMetaByProperty(html, 'og:image', `${SITE_ORIGIN}/og-image.jpg`)
  html = upsertMetaByProperty(html, 'og:locale', cfg.ogLocale)
  html = upsertMetaByProperty(html, 'og:site_name', 'Pet-Bewerbung.ch')

  html = upsertMetaByProperty(html, 'twitter:card', 'summary_large_image')
  html = upsertMetaByProperty(html, 'twitter:url', canonical)
  html = upsertMetaByProperty(html, 'twitter:title', cfg.pageTitle)
  html = upsertMetaByProperty(html, 'twitter:description', cfg.pageDescription)
  html = upsertMetaByProperty(html, 'twitter:image', `${SITE_ORIGIN}/og-image.jpg`)

  html = html.replace(/\s*<link\s+rel="alternate"[^>]*data-static-hreflang="1"[^>]*>\s*/gi, '\n')
  html = html.replace('</head>', `${buildHreflangLinks()}  </head>`)

  return html
}

async function main() {
  const distDir = path.resolve('dist')
  const basePath = path.join(distDir, 'index.html')
  const baseHtml = await readFile(basePath, 'utf8')

  for (const [lang, cfg] of Object.entries(LOCALES)) {
    const localized = localizeHtml(baseHtml, lang, cfg)
    const localeDir = path.join(distDir, lang)
    await mkdir(localeDir, { recursive: true })
    await writeFile(path.join(localeDir, 'index.html'), localized, 'utf8')
  }

  const rootLocalized = localizeHtml(baseHtml, 'de', LOCALES.de)
  await writeFile(basePath, rootLocalized, 'utf8')
}

main().catch((error) => {
  console.error('[generate-locale-html] Failed:', error)
  process.exit(1)
})
