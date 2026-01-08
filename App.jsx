import React, { useState, useEffect } from 'react';
import { 
  Dog, 
  Cat,
  Bird,
  ShieldCheck, 
  Camera, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Bone,
  Mail, 
  Phone, 
  Home, 
  Coffee, 
  CreditCard, 
  Star, 
  Flag,
  PawPrint,
  ArrowRight,
  Check,
  Globe
} from 'lucide-react';

/**
 * Pet-Bewerbung v7.0 (Animated & Modular Structure)
 * - Added custom CSS animations for smooth transitions.
 * - Refactored into distinct functional components for better modularity.
 * - Enhanced UI with hover effects and glassmorphism.
 */

// --- CUSTOM STYLES & ANIMATIONS ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    /* Smooth Transitions */
    .fade-enter {
      opacity: 0;
      transform: translateY(10px);
      animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    
    .stagger-1 { animation-delay: 100ms; }
    .stagger-2 { animation-delay: 200ms; }
    .stagger-3 { animation-delay: 300ms; }

    @keyframes fadeIn {
      to { opacity: 1; transform: translateY(0); }
    }

    /* Glassmorphism Card Hover */
    .hover-glass {
      transition: all 0.3s ease;
    }
    .hover-glass:hover {
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    /* Button Press Effect */
    .btn-press:active {
      transform: scale(0.98);
    }

    /* Print Overrides */
    @media print {
      @page { size: A4; margin: 0; }
      body { -webkit-print-color-adjust: exact; background: white; }
      .print\\:hidden { display: none !important; }
    }
  `}</style>
);

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  de: {
    title: "Pet-Bewerbung",
    landing: {
      badge: "Nach Schweizer Immobilien-Standard",
      heroTitle: "Finden Sie eine Wohnung mit",
      heroTitleSuffix: "Ihrem Haustier.",
      heroSub: "Erhöhen Sie Ihre Chancen bei der Wohnungssuche. Erstellen Sie ein professionelles Bewerbungsdossier für Ihren Vierbeiner – inklusive Versicherungsnachweis.",
      cta: "Jetzt Dossier erstellen",
      trust: "Optimiert für Verwaltungen & Private Vermieter",
      features: [
        { title: "Schweizer Format", desc: "Seriöses PDF-Design, wie es Verwaltungen erwarten." },
        { title: "KI-Textoptimierung", desc: "Verwandelt Stichworte in sympathische Texte." },
        { title: "Alle Landessprachen", desc: "Verfügbar in DE, FR, IT und Rätoromanisch." }
      ]
    },
    steps: ["Start", "Halter", "Tier", "Gesundheit", "Wesen", "Foto", "Export"],
    labels: {
      type: "Tierart",
      dog: "Hund",
      cat: "Katze",
      other: "Andere",
      ownerName: "Vorname & Nachname",
      email: "E-Mail",
      phone: "Telefon",
      address: "Aktuelle Adresse",
      petName: "Name des Tieres",
      breed: "Rasse / Art",
      age: "Alter (Jahre)",
      weight: "Gewicht (kg)",
      gender: "Geschlecht",
      m: "Männlich",
      f: "Weiblich",
      chipId: "Chip-Nr. / Kennzeichnung",
      insurance: "Haftpflichtversicherung",
      vet: "Tierarzt / Praxis",
      neutered: "Kastriert",
      vaccination: "Geimpft",
      registration: "Registriert (AMICUS/ANIS)",
      aiPrompt: "Stichworte (z.B. ruhig, stubenrein)",
      aiBtn: "Text generieren",
      aiResult: "Text für Vermieter",
      photo: "Foto wählen",
      download: "PDF speichern",
    },
    doc: {
      title: "Tierhalter-Referenzblatt",
      subtitle: "Dokumentation zur Wohnungsbewerbung",
      sectionOwner: "Verantwortlicher Halter",
      sectionPet: "Angaben zum Tier",
      sectionLegal: "Versicherung & Status",
      sectionAbout: "Beschreibung & Wesen",
      footer: "Dokument generiert via Pet-Bewerbung.ch",
      date: "Ort, Datum",
      sign: "Unterschrift"
    },
    monetization: {
      title: "Projekt unterstützen",
      desc: "Dieser Service ist kostenlos. Helfen Sie uns mit einer Spende.",
      free: "Kostenlos nutzen",
      coffee: "Kaffee spendieren (5 CHF)",
      bone: "Leckerli spendieren (10 CHF)"
    },
    templates: {
      intro: "Bei dem beschriebenen Tier handelt es sich um einen sehr gepflegten und sozialverträglichen Mitbewohner.",
      keywords: "Besonders hervorzuheben sind folgende Eigenschaften: ",
      outro: "Das Tier ist an das Leben in einer Wohnung gewöhnt und verursacht keine Lärmbelästigung. Für allfällige Schäden besteht eine umfassende Haftpflichtdeckung."
    }
  },
  fr: {
    title: "Pet-Dossier",
    landing: {
      badge: "Standard Immobilier Suisse",
      heroTitle: "Trouvez un appartement avec",
      heroTitleSuffix: "votre animal.",
      heroSub: "Augmentez vos chances. Créez un dossier de candidature professionnel pour votre compagnon à quatre pattes – preuve d'assurance incluse.",
      cta: "Créer un dossier",
      trust: "Optimisé pour les régies et propriétaires",
      features: [
        { title: "Format Suisse", desc: "Design PDF sérieux, comme l'attendent les régies." },
        { title: "Optimisation IA", desc: "Transforme les mots-clés en texte convaincant." },
        { title: "Toutes les langues", desc: "Disponible en DE, FR, IT et Romanche." }
      ]
    },
    steps: ["Début", "Détenteur", "Animal", "Santé", "Caractère", "Photo", "Export"],
    labels: {
      type: "Type d'animal",
      dog: "Chien",
      cat: "Chat",
      other: "Autre",
      ownerName: "Prénom & Nom",
      email: "E-mail",
      phone: "Téléphone",
      address: "Adresse actuelle",
      petName: "Nom de l'animal",
      breed: "Race / Espèce",
      age: "Âge (ans)",
      weight: "Poids (kg)",
      gender: "Sexe",
      m: "Mâle",
      f: "Femelle",
      chipId: "N° Puce / ID",
      insurance: "Assurance RC",
      vet: "Vétérinaire",
      neutered: "Castré",
      vaccination: "Vacciné",
      registration: "Enregistré (AMICUS/ANIS)",
      aiPrompt: "Mots-clés (ex: calme, propre)",
      aiBtn: "Générer le texte",
      aiResult: "Texte pour la régie",
      photo: "Choisir une photo",
      download: "Télécharger PDF",
    },
    doc: {
      title: "Fiche de Référence Animale",
      subtitle: "Annexe à la demande de location",
      sectionOwner: "Détenteur responsable",
      sectionPet: "Détails de l'animal",
      sectionLegal: "Assurance & Statut",
      sectionAbout: "Description & Caractère",
      footer: "Document généré via Pet-Bewerbung.ch",
      date: "Lieu, Date",
      sign: "Signature"
    },
    monetization: {
      title: "Soutenir le projet",
      desc: "Ce service est gratuit. Aidez-nous avec un don.",
      free: "Utiliser gratuitement",
      coffee: "Offrir un café (5 CHF)",
      bone: "Offrir une friandise (10 CHF)"
    },
    templates: {
      intro: "L'animal décrit est un compagnon très soigné et sociable.",
      keywords: "Les caractéristiques suivantes sont particulièrement notables : ",
      outro: "L'animal est habitué à la vie en appartement et ne cause aucune nuisance sonore. Une couverture responsabilité civile complète est en place pour tout dommage éventuel."
    }
  },
  it: {
    title: "Pet-Dossier",
    landing: {
      badge: "Standard Immobiliare Svizzero",
      heroTitle: "Trova casa con",
      heroTitleSuffix: "il tuo animale.",
      heroSub: "Aumenta le tue possibilità. Crea un dossier professionale per il tuo amico a quattro zampe – inclusa la prova di assicurazione.",
      cta: "Crea dossier",
      trust: "Ottimizzato per amministrazioni e proprietari",
      features: [
        { title: "Formato Svizzero", desc: "Design PDF serio, come richiesto dalle amministrazioni." },
        { title: "Ottimizzazione IA", desc: "Trasforma le parole chiave in testo convincente." },
        { title: "Tutte le lingue", desc: "Disponibile in DE, FR, IT e Romancio." }
      ]
    },
    steps: ["Inizio", "Proprietario", "Animale", "Salute", "Carattere", "Foto", "Export"],
    labels: {
      type: "Tipo di animale",
      dog: "Cane",
      cat: "Gatto",
      other: "Altro",
      ownerName: "Nome & Cognome",
      email: "E-mail",
      phone: "Telefono",
      address: "Indirizzo attuale",
      petName: "Nome dell'animale",
      breed: "Razza / Specie",
      age: "Età (anni)",
      weight: "Peso (kg)",
      gender: "Sesso",
      m: "Maschio",
      f: "Femmina",
      chipId: "N. Chip / ID",
      insurance: "Assicurazione RC",
      vet: "Veterinario",
      neutered: "Castrato",
      vaccination: "Vaccinato",
      registration: "Registrato (AMICUS/ANIS)",
      aiPrompt: "Parole chiave (es. tranquillo, pulito)",
      aiBtn: "Generare testo",
      aiResult: "Testo per il proprietario",
      photo: "Scegli foto",
      download: "Salva PDF",
    },
    doc: {
      title: "Scheda di Referenza Animale",
      subtitle: "Allegato alla domanda di affitto",
      sectionOwner: "Proprietario responsabile",
      sectionPet: "Dati dell'animale",
      sectionLegal: "Assicurazione & Stato",
      sectionAbout: "Descrizione & Carattere",
      footer: "Documento generato via Pet-Bewerbung.ch",
      date: "Luogo, Data",
      sign: "Firma"
    },
    monetization: {
      title: "Sostieni il progetto",
      desc: "Questo servizio è gratuito. Aiutaci con una donazione.",
      free: "Usa gratis",
      coffee: "Offri un caffè (5 CHF)",
      bone: "Offri un osso (10 CHF)"
    },
    templates: {
      intro: "L'animale descritto è un compagno molto curato e socievole.",
      keywords: "Le seguenti caratteristiche sono particolarmente degne di nota: ",
      outro: "L'animale è abituato alla vita in appartamento e non causa disturbi. È presente una copertura completa di responsabilità civile per eventuali danni."
    }
  },
  rm: {
    title: "Pet-Annunzia",
    landing: {
      badge: "Standard Svizzer",
      heroTitle: "Chattai in'abitaziun cun",
      heroTitleSuffix: "voss animal.",
      heroSub: "Creei in dossier professiunal per voss chaun u voss giat – inclus cumprova d'assicuranza.",
      cta: "Crear dossier",
      trust: "Optimà per administraziuns e locataris",
      features: [
        { title: "Format Svizzer", desc: "Design PDF serius." },
        { title: "Optimaziun IA", desc: "Transfurma pleds-clav en text." },
        { title: "Tut las linguas", desc: "Disponibel en DE, FR, IT e Rumantsch." }
      ]
    },
    steps: ["Start", "Possessur", "Animal", "Sanadad", "Wesen", "Foto", "Export"],
    labels: {
      type: "Tip d'animal",
      dog: "Chaun",
      cat: "Giat",
      other: "Auter",
      ownerName: "Prenum & Num",
      email: "E-Mail",
      phone: "Telefon",
      address: "Adressa actuala",
      petName: "Num da l'animal",
      breed: "Rassa",
      age: "Vegliadetgna (onns)",
      weight: "Paisa (kg)",
      gender: "Schatta",
      m: "Mascel",
      f: "Femella",
      chipId: "Nr. da chip",
      insurance: "Assicuranza da responsabladad",
      vet: "Veterinari",
      neutered: "Castrà",
      vaccination: "Vaccinà",
      registration: "Registrà (AMICUS/ANIS)",
      aiPrompt: "Pleds-clav (p.ex. quiet)",
      aiBtn: "Generar text",
      aiResult: "Text per il locatari",
      photo: "Eleger foto",
      download: "Memorisar PDF",
    },
    doc: {
      title: "Fegl da Referenza per Animals",
      subtitle: "Agiunta a la dumonda d'abitaziun",
      sectionOwner: "Possessur responsabel",
      sectionPet: "Detagls davart l'animal",
      sectionLegal: "Assicuranza & Status",
      sectionAbout: "Descripziun & Caracter",
      footer: "Generà via Pet-Bewerbung.ch",
      date: "Lieu, Data",
      sign: "Suttascripziun"
    },
    monetization: {
      title: "Sustegnai nus",
      desc: "Quest servetsch è gratuit. Gidai nus cun ina donaziun.",
      free: "Gratuit",
      coffee: "Offrir un café (5 CHF)",
      bone: "Offrir in oss (10 CHF)"
    },
    templates: {
      intro: "L'animal descrit è un cumpogn fitg tgirà e sociabel.",
      keywords: "Las suandantas qualitads èn da menziunar: ",
      outro: "L'animal è disà da viver en in'abitaziun e na fa nagina canera. Per donns eventuals exista in'assicuranza da responsabladad cumpletta."
    }
  },
  en: {
    title: "Pet-Resume",
    landing: {
      badge: "Swiss Real Estate Standard",
      heroTitle: "Find an apartment with",
      heroTitleSuffix: "your pet.",
      heroSub: "Increase your chances. Create a professional application dossier for your pet – including proof of insurance.",
      cta: "Create Dossier Now",
      trust: "Optimized for Agencies & Landlords",
      features: [
        { title: "Swiss Format", desc: "Serious PDF design, as expected by agencies." },
        { title: "AI Text Optimization", desc: "Turns simple keywords into convincing text." },
        { title: "All National Languages", desc: "Available in DE, FR, IT, and Romansh." }
      ]
    },
    steps: ["Start", "Owner", "Pet", "Health", "Nature", "Photo", "Export"],
    labels: {
      type: "Animal Type",
      dog: "Dog",
      cat: "Cat",
      other: "Other",
      ownerName: "Full Name",
      email: "Email",
      phone: "Phone",
      address: "Current Address",
      petName: "Pet Name",
      breed: "Breed / Species",
      age: "Age (years)",
      weight: "Weight (kg)",
      gender: "Gender",
      m: "Male",
      f: "Female",
      chipId: "Chip ID",
      insurance: "Liability Insurance",
      vet: "Veterinarian",
      neutered: "Neutered",
      vaccination: "Vaccinated",
      registration: "Registered (AMICUS/ANIS)",
      aiPrompt: "Keywords (e.g. quiet, clean)",
      aiBtn: "Generate Text",
      aiResult: "Text for Landlord",
      photo: "Select Photo",
      download: "Save PDF",
    },
    doc: {
      title: "Pet Reference Sheet",
      subtitle: "Annex to Rental Application",
      sectionOwner: "Owner Information",
      sectionPet: "Pet Details",
      sectionLegal: "Insurance & Status",
      sectionAbout: "Character & Description",
      footer: "Generated via Pet-Bewerbung.ch",
      date: "Place, Date",
      sign: "Signature"
    },
    monetization: {
      title: "Support Us",
      desc: "This service is free. Help us with a donation.",
      free: "Use for Free",
      coffee: "Buy us a coffee (5 CHF)",
      bone: "Buy a treat (10 CHF)"
    },
    templates: {
      intro: "The described animal is a very well-groomed and socially compatible companion.",
      keywords: "The following characteristics are particularly noteworthy: ",
      outro: "The animal is accustomed to apartment living and causes no noise disturbance. Comprehensive liability coverage is in place for any potential damages."
    }
  },
  ua: {
    title: "Pet-Резюме",
    landing: {
      badge: "Швейцарський Стандарт Нерухомості",
      heroTitle: "Орендуйте квартиру з",
      heroTitleSuffix: "вашим улюбленцем.",
      heroSub: "Підвищіть свої шанси. Створіть професійне досьє для вашої тварини — включно зі страховкою та рекомендаціями.",
      cta: "Створити досьє",
      trust: "Оптимізовано для агенцій та власників",
      features: [
        { title: "Швейцарський Формат", desc: "Серйозний дизайн PDF, якого очікують агенції." },
        { title: "ШІ-Оптимізація", desc: "Перетворює прості слова на переконливий текст." },
        { title: "Всі державні мови", desc: "Доступно німецькою, французькою, італійською." }
      ]
    },
    steps: ["Старт", "Власник", "Тварина", "Здоров'я", "Характер", "Фото", "Експорт"],
    labels: {
      type: "Вид тварини",
      dog: "Собака",
      cat: "Кіт",
      other: "Інше",
      ownerName: "Ім'я та Прізвище",
      email: "Email",
      phone: "Телефон",
      address: "Поточна адреса",
      petName: "Кличка",
      breed: "Порода / Вид",
      age: "Вік (років)",
      weight: "Вага (кг)",
      gender: "Стать",
      m: "Хлопчик",
      f: "Дівчинка",
      chipId: "№ Чіпу / ID",
      insurance: "Страхова (Haftpflicht)",
      vet: "Ветеринар / Клініка",
      neutered: "Стерилізований",
      vaccination: "Вакцинований",
      registration: "Реєстрація (AMICUS/ANIS)",
      aiPrompt: "Ключові слова (напр. тихий, чистий)",
      aiBtn: "Згенерувати опис",
      aiResult: "Текст для власника",
      photo: "Обрати фото",
      download: "Зберегти PDF",
    },
    doc: {
      title: "Досьє Домашньої Тварини",
      subtitle: "Додаток до заяви на оренду",
      sectionOwner: "Власник",
      sectionPet: "Дані про тварину",
      sectionLegal: "Страхування та Статус",
      sectionAbout: "Характеристика",
      footer: "Згенеровано через Pet-Bewerbung.ch",
      date: "Місце, Дата",
      sign: "Підпис"
    },
    monetization: {
      title: "Підтримайте нас",
      desc: "Сервіс безкоштовний, але донати вітаються.",
      free: "Безкоштовно",
      coffee: "Пригостити кавою (5 CHF)",
      bone: "Купити кістку (10 CHF)"
    },
    templates: {
      intro: "Описана тварина є дуже доглянутим та соціалізованим компаньйоном.",
      keywords: "Особливо варто відзначити такі риси: ",
      outro: "Тварина привчена до життя в квартирі, поводиться тихо та охайно. На випадок будь-яких пошкоджень наявна повна цивільна відповідальність."
    }
  }
};

const INITIAL_DATA = {
  lang: 'de',
  petType: 'dog',
  ownerName: '',
  email: '',
  phone: '',
  address: '',
  name: '',
  breed: '',
  age: '',
  weight: '',
  gender: 'm',
  photo: null,
  chipId: '',
  insuranceProvider: '',
  vetName: '',
  isNeutered: false,
  hasVaccination: true,
  hasRegistration: true,
  keywords: '',
  generatedText: '',
};

// --- REUSABLE UI COMPONENTS ---

const Label = ({ children }) => (
  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{children}</label>
);

const Input = (props) => (
  <input 
    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-900 text-sm transition-all hover:bg-white"
    {...props}
  />
);

const Button = ({ variant = 'primary', className = '', ...props }) => {
  const base = "inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm transition-all focus:outline-none active:scale-[0.98] btn-press";
  const styles = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 hover:shadow-2xl",
    secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
    magic: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 shadow-lg shadow-indigo-200",
    ghost: "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
};

// --- MODULE: DOCUMENT RENDERER ---
const SwissDocument = ({ data, t }) => {
  const getLocale = (lang) => {
    switch(lang) {
      case 'de': return 'de-CH';
      case 'fr': return 'fr-CH';
      case 'it': return 'it-CH';
      case 'rm': return 'de-CH';
      case 'ua': return 'uk-UA';
      default: return 'en-GB';
    }
  };
  
  const today = new Date().toLocaleDateString(getLocale(data.lang));
  
  return (
    <div className="w-[210mm] h-[297mm] bg-white text-[#111] p-[20mm] font-sans text-sm relative box-border flex flex-col shadow-none mx-auto">
      {/* HEADER */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-black text-white p-2 rounded"><PawPrint size={24} /></div>
           <div className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Swiss Standard Pet CV</div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight uppercase mb-2">{t.doc.title}</h1>
        <div className="flex justify-between items-end border-b-4 border-black pb-4">
           <span className="text-base font-medium text-gray-500">{t.doc.subtitle}</span>
           <span className="text-xs font-mono text-gray-400">ID: {Math.floor(Math.random()*1000000)}</span>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className="flex gap-12 grow">
        <div className="w-[35%] flex flex-col gap-10">
           <div className="aspect-[3/4] w-full bg-gray-100 flex items-center justify-center overflow-hidden relative rounded-sm">
             {data.photo ? (
               <img src={data.photo} className="w-full h-full object-cover grayscale" alt="Pet" />
             ) : (
               <div className="text-gray-300 text-center">
                 <Camera size={32} className="mx-auto mb-2 opacity-50" />
                 NO IMAGE
               </div>
             )}
             <div className="absolute bottom-0 right-0 bg-black text-white p-3">
               {data.petType === 'dog' ? <Dog size={20}/> : data.petType === 'cat' ? <Cat size={20}/> : <Bird size={20}/>}
             </div>
           </div>

           <div>
             <h3 className="font-bold uppercase tracking-wider text-xs mb-4 border-b border-gray-200 pb-1">{t.doc.sectionOwner}</h3>
             <div className="space-y-2">
               <p className="font-bold text-lg leading-tight">{data.ownerName || '—'}</p>
               <p className="text-gray-600 leading-tight">{data.address || '—'}</p>
               <div className="pt-4 space-y-2 text-gray-500 text-xs">
                 <p className="flex items-center gap-2"><Phone size={12}/> {data.phone || '—'}</p>
                 <p className="flex items-center gap-2"><Mail size={12}/> {data.email || '—'}</p>
               </div>
             </div>
           </div>
        </div>

        <div className="w-[65%] flex flex-col gap-10">
          <div>
            <h3 className="font-bold uppercase tracking-wider text-xs mb-4 border-b border-gray-200 pb-1">{t.doc.sectionPet}</h3>
            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.petName}</span>
                <span className="font-bold text-xl">{data.name || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.breed}</span>
                <span className="text-base">{data.breed || '—'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.gender} / {t.labels.age}</span>
                <span className="text-base">
                  {data.gender === 'm' ? t.labels.m : t.labels.f}, {data.age}
                </span>
              </div>
              <div>
                <span className="block text-[10px] text-gray-500 uppercase tracking-wide mb-1">{t.labels.weight}</span>
                <span className="text-base">{data.weight || '—'}</span>
              </div>
            </div>
          </div>

          <div className="grow">
            <h3 className="font-bold uppercase tracking-wider text-xs mb-4 border-b border-gray-200 pb-1">{t.doc.sectionAbout}</h3>
            <div className="text-base leading-relaxed text-gray-800 text-justify">
              {data.generatedText || (
                <span className="text-gray-300 italic">Keine Beschreibung verfügbar...</span>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-sm border border-gray-100">
             <h3 className="font-bold uppercase tracking-wider text-xs mb-4 text-gray-500">{t.doc.sectionLegal}</h3>
             <div className="grid grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">{t.labels.chipId}</span>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">{data.chipId || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wide mb-1">{t.labels.insurance}</span>
                  <span className="font-medium">{data.insuranceProvider || '—'}</span>
                </div>
                <div className="col-span-2 flex flex-wrap gap-6 mt-2 pt-4 border-t border-gray-200">
                   <StatusItem label={t.labels.neutered} active={data.isNeutered} />
                   <StatusItem label={t.labels.vaccination} active={data.hasVaccination} />
                   <StatusItem label={t.labels.registration} active={data.hasRegistration} />
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 border-t border-gray-200 flex justify-between items-end">
        <div className="text-[10px] text-gray-400 uppercase tracking-wider">
          <p>{t.doc.footer}</p>
          <p>{today}</p>
        </div>
        <div className="w-64 border-t border-black pt-2">
          <p className="text-[10px] uppercase font-bold tracking-wider">{t.doc.sign}</p>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ label, active }) => (
  <div className="flex items-center gap-2">
    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'bg-black border-black text-white' : 'border-gray-300 text-transparent'}`}>
       <Check size={10} strokeWidth={4} />
    </div>
    <span className={`text-xs font-medium uppercase tracking-wide ${active ? 'text-black' : 'text-gray-400'}`}>{label}</span>
  </div>
);

// --- MODULE: LANDING PAGE ---
const LandingPage = ({ t, setStep }) => (
  <div className="flex flex-col animate-in fade-in duration-700">
    <div className="relative isolate px-6 pt-14 lg:px-8 text-center pb-24 sm:pb-32">
      <div className="mx-auto max-w-2xl py-8 sm:py-12 fade-enter stagger-1">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 hover:bg-gray-50 transition-all cursor-default">
            <span className="flex items-center gap-2">
               <Flag size={14} className="text-red-600 fill-red-600" /> {t.landing.badge}
            </span>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl mb-6 leading-tight">
          {t.landing.heroTitle} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
            {t.landing.heroTitleSuffix}
          </span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 max-w-xl mx-auto">
          {t.landing.heroSub}
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button onClick={() => setStep(1)} className="text-lg px-8 py-4 shadow-indigo-200">
            {t.landing.cta} <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-2 text-sm text-slate-500">
           <CheckCircle2 size={16} className="text-green-600" /> {t.landing.trust}
        </div>
      </div>

      {/* Decorative Blob */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 opacity-20 pointer-events-none">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
    </div>

    {/* Features Grid */}
    <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-12 fade-enter stagger-2">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: ShieldCheck, ...t.landing.features[0] },
          { icon: Sparkles, ...t.landing.features[1] },
          { icon: Globe, ...t.landing.features[2] },
        ].map((f, i) => (
          <div key={i} className="flex flex-col bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover-glass">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <f.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <dt className="text-lg font-bold leading-7 text-gray-900 mb-2">{f.title}</dt>
            <dd className="text-base leading-7 text-gray-600 flex-auto">{f.desc}</dd>
          </div>
        ))}
      </div>
    </div>

    {/* Footer Branding */}
    <div className="pb-12 text-center opacity-60 flex flex-col items-center justify-center gap-2 fade-enter stagger-3">
       <div className="w-6 h-6 bg-red-600 rounded-sm flex items-center justify-center text-white shadow-sm">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
       </div>
       <span className="text-xs font-bold tracking-widest uppercase text-slate-800">Developed in Switzerland</span>
       <span className="text-[10px] text-slate-500">Zürich • Lausanne • Lugano</span>
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [donationTier, setDonationTier] = useState(null);

  const t = TRANSLATIONS[data.lang] || TRANSLATIONS.de;

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateData('photo', reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateText = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const tmpl = t.templates;
      const rawKeywords = data.keywords.split(',').map(s => s.trim()).filter(s => s);
      let middleSection = "";
      if (rawKeywords.length > 0) {
        const formattedKeywords = rawKeywords.map(k => `**${k}**`).join(', ');
        middleSection = `${tmpl.keywords}${formattedKeywords}. `;
      }
      const fullText = `${tmpl.intro} ${middleSection}${tmpl.outro}`;
      updateData('generatedText', fullText);
      setIsGenerating(false);
    }, 1000);
  };

  // --- Step Content Renderers ---
  const renderStep = () => {
    switch(step) {
      case 0: return <LandingPage t={t} setStep={setStep} />;
      
      case 1: return (
        <div className="space-y-6 fade-enter max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span> 
             {t.steps[1]}
          </h2>
          <div className="grid grid-cols-1 gap-5">
            <div><Label>{t.labels.ownerName}</Label><Input value={data.ownerName} onChange={e => updateData('ownerName', e.target.value)} placeholder="Max Mustermann" /></div>
            <div><Label>{t.labels.email}</Label><Input type="email" value={data.email} onChange={e => updateData('email', e.target.value)} /></div>
            <div><Label>{t.labels.phone}</Label><Input type="tel" value={data.phone} onChange={e => updateData('phone', e.target.value)} /></div>
            <div><Label>{t.labels.address}</Label><Input value={data.address} onChange={e => updateData('address', e.target.value)} /></div>
          </div>
        </div>
      );

      case 2: return (
        <div className="space-y-6 fade-enter max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span> 
             {t.steps[2]}
          </h2>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[{ id: 'dog', label: t.labels.dog, icon: Dog }, { id: 'cat', label: t.labels.cat, icon: Cat }, { id: 'other', label: t.labels.other, icon: Bird }].map(type => (
              <button key={type.id} onClick={() => updateData('petType', type.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover-glass ${data.petType === type.id ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500'}`}>
                <type.icon size={24} className="mb-2" /><span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2"><Label>{t.labels.petName}</Label><Input value={data.name} onChange={e => updateData('name', e.target.value)} /></div>
            <div><Label>{t.labels.breed}</Label><Input value={data.breed} onChange={e => updateData('breed', e.target.value)} /></div>
            <div><Label>{t.labels.age}</Label><Input type="number" value={data.age} onChange={e => updateData('age', e.target.value)} /></div>
            <div><Label>{t.labels.weight}</Label><Input value={data.weight} onChange={e => updateData('weight', e.target.value)} /></div>
            <div><Label>{t.labels.gender}</Label>
              <div className="flex gap-2 h-[46px]">
                {['m', 'f'].map(g => (
                  <label key={g} className={`flex items-center justify-center gap-2 cursor-pointer border rounded-lg flex-1 transition-colors ${data.gender === g ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                    <input type="radio" name="gender" checked={data.gender === g} onChange={() => updateData('gender', g)} className="hidden" />
                    <span className="text-sm font-medium">{g === 'm' ? t.labels.m : t.labels.f}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

      case 3: return (
        <div className="space-y-6 fade-enter max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span> 
             {t.steps[3]}
          </h2>
          <div className="p-4 bg-indigo-50 rounded-xl text-sm text-indigo-900 flex gap-3 leading-relaxed border border-indigo-100 mb-6">
            <ShieldCheck className="shrink-0 mt-0.5" />
            <span>{data.petType === 'dog' ? "Für Hunde sind AMICUS und Haftpflicht in der Schweiz oft Pflicht." : "Auch für Katzen wird eine Versicherung oft empfohlen (Mieterschäden)."}</span>
          </div>
          <div className="grid grid-cols-1 gap-5">
            <div><Label>{t.labels.insurance}</Label><Input value={data.insuranceProvider} onChange={e => updateData('insuranceProvider', e.target.value)} placeholder="z.B. AXA, Mobiliar" /></div>
            <div className="grid grid-cols-2 gap-5">
              <div><Label>{t.labels.chipId}</Label><Input value={data.chipId} onChange={e => updateData('chipId', e.target.value)} /></div>
              <div><Label>{t.labels.vet}</Label><Input value={data.vetName} onChange={e => updateData('vetName', e.target.value)} /></div>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            {[{ id: 'isNeutered', label: t.labels.neutered }, { id: 'hasVaccination', label: t.labels.vaccination }, { id: 'hasRegistration', label: t.labels.registration }].map(opt => (
              <label key={opt.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors bg-white hover-glass">
                <span className="text-sm font-medium text-slate-700">{opt.label}</span>
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${data[opt.id] ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                  {data[opt.id] && <Check size={14} className="text-white" />}
                </div>
                <input type="checkbox" className="hidden" checked={data[opt.id]} onChange={e => updateData(opt.id, e.target.checked)} />
              </label>
            ))}
          </div>
        </div>
      );

      case 4: return (
        <div className="space-y-6 fade-enter max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span> 
             {t.steps[4]}
          </h2>
          <div>
            <Label>{t.labels.aiPrompt}</Label>
            <textarea className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-32 resize-none bg-slate-50 transition-all hover:bg-white"
              placeholder={data.lang === 'ua' ? "тихий, охайний, любить спати" : "ruhig, sauber, schläft viel"}
              value={data.keywords} onChange={e => updateData('keywords', e.target.value)} />
          </div>
          <Button variant="magic" className="w-full" onClick={generateText} disabled={!data.keywords || isGenerating}>
            {isGenerating ? <Sparkles className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
            {t.labels.aiBtn}
          </Button>
          {data.generatedText && (
            <div className="mt-4 fade-enter">
              <Label>{t.labels.aiResult}</Label>
              <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm text-sm leading-relaxed text-slate-700 italic">
                {data.generatedText}
              </div>
            </div>
          )}
        </div>
      );

      case 5: return (
        <div className="space-y-6 fade-enter text-center max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{t.steps[5]}</h2>
          <div className="relative group cursor-pointer inline-block w-full">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`aspect-square w-full max-w-[300px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${data.photo ? 'border-indigo-500 p-2' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:scale-105'}`}>
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover rounded-xl shadow-sm" alt="Pet" />
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400"><Camera size={32} /></div>
                  <span className="text-slate-600 font-medium">{t.labels.photo}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );

      case 6: return (
        <div className="space-y-8 fade-enter text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">{t.monetization.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {['free', 'coffee', 'bone'].map(tier => (
              <div key={tier} onClick={() => setDonationTier(tier)}
                className={`p-6 border rounded-2xl cursor-pointer transition-all hover-glass ${donationTier === tier ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 bg-white'}`}>
                <div className="text-3xl mb-3">{tier === 'free' ? '🎈' : tier === 'coffee' ? '☕' : '🦴'}</div>
                <div className="font-bold text-slate-900">{t.monetization[tier]}</div>
              </div>
            ))}
          </div>
          {donationTier && (
            <div className="fade-enter">
              <Button onClick={() => window.print()} className="py-4 px-12 text-lg shadow-xl shadow-slate-200">
                <Download className="mr-2" /> {t.labels.download}
              </Button>
            </div>
          )}
          <div className="w-full h-px bg-slate-100 my-8"></div>
          <div className="text-left mb-2"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</span></div>
          <div className="w-full overflow-hidden flex justify-center bg-slate-100 rounded-xl border border-slate-200 p-4 sm:p-8">
             <div className="transform scale-[0.45] sm:scale-[0.6] md:scale-[0.75] origin-top h-[140mm] sm:h-[190mm] md:h-[230mm] shadow-2xl transition-transform duration-500 hover:scale-[0.76]">
                <SwissDocument data={data} t={t} />
             </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-20 print:bg-white print:p-0">
      <GlobalStyles />
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 h-16 px-4 flex items-center justify-between print:hidden max-w-7xl mx-auto w-full transition-all">
        <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => setStep(0)}>
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-200"><PawPrint size={18} /></div>
          <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
        </div>
        <select value={data.lang} onChange={(e) => updateData('lang', e.target.value)}
          className="bg-slate-50 border border-slate-200 text-sm font-medium outline-none cursor-pointer hover:bg-slate-100 py-1.5 px-3 rounded-lg transition-colors">
          <option value="de">🇩🇪 DE</option>
          <option value="fr">🇫🇷 FR</option>
          <option value="it">🇮🇹 IT</option>
          <option value="rm">🇨🇭 RM</option>
          <option value="en">🇬🇧 EN</option>
          <option value="ua">🇺🇦 UA</option>
        </select>
      </header>

      <main className="w-full max-w-7xl mx-auto print:w-full print:max-w-none print:p-0">
        <div className="p-4 md:p-8 print:border-none print:shadow-none print:p-0">
          {step > 0 && step < 6 && (
            <div className="flex gap-2 mb-8 max-w-lg mx-auto">
              {t.steps.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`} />
              ))}
            </div>
          )}
          {renderStep()}
        </div>
      </main>

      {step > 0 && step < 6 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-200 p-4 z-20 flex justify-between max-w-7xl mx-auto print:hidden">
          <Button variant="ghost" onClick={() => setStep(step - 1)} className="px-4"><ChevronLeft size={18} /> Back</Button>
          <Button onClick={() => setStep(step + 1)} className="px-8 shadow-lg shadow-indigo-100">Next <ChevronRight size={18} /></Button>
        </div>
      )}

      <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999]">
         <SwissDocument data={data} t={t} />
      </div>
    </div>
  );
}