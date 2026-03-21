import { useEffect } from 'react';
import { useTranslationContext } from '../context/WizardProviders';
import { HREFLANG_LOCALES, SEO_META, SITE_ORIGIN, type SeoMeta } from '../seo/metaByLang';
import { SUPPORTED_LANGS } from '../hooks/useTranslation';

const HREFLANG_ATTR = 'data-pet-seo-hreflang';
const ORG_JSONLD_ATTR = 'data-pet-seo-org';

function setMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
}

/**
 * Dynamic title, description, canonical, og:*, and hreflang alternates per locale URL.
 */
function SeoHead() {
  const { lang, isLoading } = useTranslationContext();

  useEffect(() => {
    if (isLoading) return;

    document.querySelectorAll(`script[${ORG_JSONLD_ATTR}]`).forEach((n) => n.remove());
    const orgScript = document.createElement('script');
    orgScript.type = 'application/ld+json';
    orgScript.setAttribute(ORG_JSONLD_ATTR, '1');
    orgScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Pet-Bewerbung.ch',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/logo-header.webp`,
    });
    document.head.appendChild(orgScript);

    const meta: SeoMeta = SEO_META[lang];
    const canonical = `${SITE_ORIGIN}/${lang}/`;

    document.title = meta.pageTitle;
    setMetaByName('description', meta.pageDescription);
    setMetaByName('title', meta.pageTitle);
    upsertCanonical(canonical);

    setMetaProperty('og:type', 'website');
    setMetaProperty('og:url', canonical);
    setMetaProperty('og:title', meta.pageTitle);
    setMetaProperty('og:description', meta.pageDescription);
    setMetaProperty('og:locale', meta.ogLocale);
    setMetaProperty('og:image', `${SITE_ORIGIN}/og-image.jpg`);
    setMetaProperty('og:site_name', 'Pet-Bewerbung.ch');

    setMetaProperty('twitter:card', 'summary_large_image');
    setMetaProperty('twitter:url', canonical);
    setMetaProperty('twitter:title', meta.pageTitle);
    setMetaProperty('twitter:description', meta.pageDescription);
    setMetaProperty('twitter:image', `${SITE_ORIGIN}/og-image.jpg`);

    document.querySelectorAll(`link[${HREFLANG_ATTR}]`).forEach((n) => n.remove());

    SUPPORTED_LANGS.forEach((l) => {
      const link = document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', HREFLANG_LOCALES[l]);
      link.setAttribute('href', `${SITE_ORIGIN}/${l}/`);
      link.setAttribute(HREFLANG_ATTR, '1');
      document.head.appendChild(link);
    });
    const xdef = document.createElement('link');
    xdef.setAttribute('rel', 'alternate');
    xdef.setAttribute('hreflang', 'x-default');
    xdef.setAttribute('href', `${SITE_ORIGIN}/de/`);
    xdef.setAttribute(HREFLANG_ATTR, '1');
    document.head.appendChild(xdef);
  }, [lang, isLoading]);

  return null;
}

export default SeoHead;
