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
        { title: "Alle Landessprachen", desc: "Verfügbar in DE, FR, IT und Rätoromanisch." },
        { title: "Mehrere Vorlagen", desc: "Wählen Sie aus mehreren professionellen PDF-Vorlagen." },
        { title: "Keine Registrierung", desc: "Kein Konto nötig — schnell und anonym." },
        { title: "Daten werden nicht gespeichert", desc: "Daten werden nach dem Erstellen nicht aufbewahrt — maximaler Datenschutz." }
      ]
    },
    steps: ["Start", "Halter", "Tier", "Gesundheit", "Wesen", "Foto", "Überprüfung", "Vorlage", "Datei", "Danke"],
    stepTitles: {
      1: "Halter Information",
      2: "Tier Details",
      3: "Gesundheit & Versicherung",
      4: "Charakter Beschreibung",
      5: "Foto hochladen",
      6: "Daten überprüfen",
      7: "Vorlage auswählen",
      8: "Vorschau & Download"
    },
    summary: {
      title: "Überprüfung Ihrer Daten",
      owner: "Halter",
      address: "Adresse",
      petName: "Tiername",
      breed: "Rasse",
      ageWeight: "Alter / Gewicht",
      gender: "Geschlecht",
      description: "Beschreibung",
      confirmation: "Alles korrekt? Weiter zur Vorlagenauswahl!"
    },
    templateSelection: {
      title: "Vorlage auswählen",
      subtitle: "Wählen Sie ein Design für Ihr Pet CV"
    },
    preview: {
      title: "Ihr Pet CV ist fertig!",
      instruction: "📄 Verwenden Sie die Schaltflächen unten zum Herunterladen oder Versenden des Dokuments"
    },
    finalMessage: "Vielen Dank für die Nutzung unseres Service! 🐾",
    ui: {
      select: "Wählen",
      preview: "Vorschau",
      previewMode: "Vorschau-Modus",
      emailComingSoon: "E-Mail-Funktion wird in Kürze hinzugefügt",
      emailInDevelopment: "E-Mail-Funktion in Entwicklung",
      freeSuccess: "Vielen Dank! Viel Erfolg bei der Suche.",
      insuranceInfoDog: "Für Hunde sind AMICUS und Haftpflicht in der Schweiz oft Pflicht.",
      insuranceInfoCat: "Auch für Katzen wird eine Versicherung oft empfohlen (Mieterschäden)."
    },
    labels: {
      type: "Tierart",
      dog: "Hund",
      cat: "Katze",
      other: "Andere",
      ownerName: "Vorname & Nachname",
      email: "E-Mail",
      phone: "Telefon",
      address: "Aktuelle Adresse",
      street: "Strasse",
      houseNumber: "Hausnummer",
      postal: "PLZ",
      city: "Stadt",
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
    thankYou: {
      title: "Danke",
      msg: "Danke, dass Sie unseren Service genutzt haben. Ihr Dokument wurde lokal erstellt."
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
        { title: "Toutes les langues", desc: "Disponible en DE, FR, IT et Romanche." },
        { title: "Plusieurs modèles", desc: "Choisissez parmi plusieurs modèles PDF professionnels." },
        { title: "Sans inscription", desc: "Aucun compte requis — rapide et anonyme." },
        { title: "Données non conservées", desc: "Les données ne sont pas conservées après création — confidentialité maximale." }
      ]
    },
    steps: ["Début", "Détenteur", "Animal", "Santé", "Caractère", "Photo", "Vérification", "Modèle", "Fichier", "Merci"],
    stepTitles: {
      1: "Informations du propriétaire",
      2: "Détails de l'animal",
      3: "Santé et assurance",
      4: "Description du caractère",
      5: "Télécharger une photo",
      6: "Vérifier les données",
      7: "Choisir un modèle",
      8: "Aperçu et téléchargement"
    },
    summary: {
      title: "Vérification de vos données",
      owner: "Propriétaire",
      address: "Adresse",
      petName: "Nom de l'animal",
      breed: "Race",
      ageWeight: "Âge / Poids",
      gender: "Sexe",
      description: "Description",
      confirmation: "Tout est correct? Passez au choix du modèle!"
    },
    templateSelection: {
      title: "Choisir un modèle",
      subtitle: "Sélectionnez un design pour votre Pet CV"
    },
    preview: {
      title: "Votre Pet CV est prêt!",
      instruction: "📄 Utilisez les boutons ci-dessous pour télécharger ou envoyer le document"
    },
    finalMessage: "Merci d'avoir utilisé notre service! 🐾",
    ui: {
      select: "Sélectionner",
      preview: "Aperçu",
      previewMode: "Mode Aperçu",
      emailComingSoon: "La fonction e-mail sera bientôt ajoutée",
      emailInDevelopment: "Fonction e-mail en développement",
      freeSuccess: "Merci! Bonne chance dans votre recherche.",
      insuranceInfoDog: "Pour les chiens, AMICUS et l'assurance responsabilité civile sont souvent obligatoires en Suisse.",
      insuranceInfoCat: "Pour les chats aussi, une assurance est souvent recommandée (dommages locatifs)."
    },
    labels: {
      type: "Type d'animal",
      dog: "Chien",
      cat: "Chat",
      other: "Autre",
      ownerName: "Prénom & Nom",
      email: "E-mail",
      phone: "Téléphone",
      address: "Adresse actuelle",
      street: "Rue",
      houseNumber: "Numéro",
      postal: "Code postal",
      city: "Ville",
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
      desc: "Ce service est gratuit. Aidez-nous avec une donation.",
      free: "Utiliser gratuitement",
      coffee: "Offrir un café (5 CHF)",
      bone: "Offrir une friandise (10 CHF)"
    },
    thankYou: {
      title: "Merci",
      msg: "Merci d'avoir utilisé notre service. Votre document a été généré localement."
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
        { title: "Tutte le lingue", desc: "Disponibile in DE, FR, IT e Romancio." },
        { title: "Più modelli", desc: "Scegli tra più modelli PDF professionali." },
        { title: "Nessuna registrazione", desc: "Nessun account richiesto — rapido e anonimo." },
        { title: "Dati non salvati", desc: "I dati non vengono conservati dopo la creazione — privacy massima." }
      ]
    },
    steps: ["Inizio", "Proprietario", "Animale", "Salute", "Carattere", "Foto", "Verifica", "Modello", "File", "Grazie"],
    stepTitles: {
      1: "Informazioni proprietario",
      2: "Dettagli animale",
      3: "Salute e assicurazione",
      4: "Descrizione carattere",
      5: "Caricare foto",
      6: "Verifica dati",
      7: "Scegli modello",
      8: "Anteprima e download"
    },
    summary: {
      title: "Verifica dei tuoi dati",
      owner: "Proprietario",
      address: "Indirizzo",
      petName: "Nome animale",
      breed: "Razza",
      ageWeight: "Età / Peso",
      gender: "Sesso",
      description: "Descrizione",
      confirmation: "Tutto corretto? Vai alla selezione del modello!"
    },
    templateSelection: {
      title: "Scegli modello",
      subtitle: "Seleziona un design per il tuo Pet CV"
    },
    preview: {
      title: "Il tuo Pet CV è pronto!",
      instruction: "📄 Usa i pulsanti sotto per scaricare o inviare il documento"
    },
    finalMessage: "Grazie per aver utilizzato il nostro servizio! 🐾",
    ui: {
      select: "Seleziona",
      preview: "Anteprima",
      previewMode: "Modalità Anteprima",
      emailComingSoon: "Funzione email verrà aggiunta presto",
      emailInDevelopment: "Funzione email in sviluppo",
      freeSuccess: "Grazie! Buona fortuna con la ricerca.",
      insuranceInfoDog: "Per i cani, AMICUS e l'assicurazione di responsabilità civile sono spesso obbligatori in Svizzera.",
      insuranceInfoCat: "Anche per i gatti, un'assicurazione è spesso consigliata (danni locativi)."
    },
    labels: {
      type: "Tipo di animale",
      dog: "Cane",
      cat: "Gatto",
      other: "Altro",
      ownerName: "Nome & Cognome",
      email: "E-mail",
      phone: "Telefono",
      address: "Indirizzo attuale",
      street: "Via",
      houseNumber: "Numero civico",
      postal: "CAP",
      city: "Città",
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
    thankYou: {
      title: "Grazie",
      msg: "Grazie per aver usato il servizio. Il documento è stato generato localmente."
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
        { title: "Tut las linguas", desc: "Disponibel en DE, FR, IT e Rumantsch." },
        { title: "Plirs templates", desc: "Tscherner tran plirs templates PDF professiunal." },
        { title: "Nessuna registraziun", desc: "Betg basegn da account — direct e anonim." },
        { title: "Datas betg tgiradas", desc: "Las datas vegnan betg tgiradas suenter creaziun — maxima privacy." }
      ]
    },
    steps: ["Start", "Possessur", "Animal", "Sanadad", "Wesen", "Foto", "Controlla", "Model", "Datoteca", "Grazia"],
    stepTitles: {
      1: "Infurmaziuns possessur",
      2: "Detagls animal",
      3: "Sanadad & assicuranza",
      4: "Descripziun caracter",
      5: "Chargiar foto",
      6: "Controllar datas",
      7: "Tscherner model",
      8: "Prevista & Download"
    },
    summary: {
      title: "Controlla da vossas datas",
      owner: "Possessur",
      address: "Adressa",
      petName: "Num animal",
      breed: "Razza",
      ageWeight: "Vegliadetgna / Paisa",
      gender: "Gener",
      description: "Descripziun",
      confirmation: "Tuttafatg correct? Vinavant tar tscherna dal model!"
    },
    templateSelection: {
      title: "Tscherner model",
      subtitle: "Tscherni in design per tes Pet CV"
    },
    preview: {
      title: "Tes Pet CV è pront!",
      instruction: "📄 Duvra ils buttuns sut per telechargiar u trametter il document"
    },
    finalMessage: "Grazia per avair duvra nos servetsch! 🐾",
    ui: {
      select: "Tscherner",
      preview: "Prevista",
      previewMode: "Modus Prevista",
      emailComingSoon: "Funcziun email vegn agiuntada en cuort",
      emailInDevelopment: "Funcziun email en svilup",
      freeSuccess: "Grazia! BunsSuccès tar tschertgar.",
      insuranceInfoDog: "Per chauns èn AMICUS e l'assicuranza da responsabladad savens obligatoris en Svizra.",
      insuranceInfoCat: "Era per gliats vegn in'assicuranza savens recumandada (donns da locaziun)."
    },
    labels: {
      type: "Tip d'animal",
      dog: "Chaun",
      cat: "Giat",
      other: "Auter",
      ownerName: "Prenum & Num",
      email: "E-Mail",
      phone: "Telefon",
      address: "Adressa actuala",
      street: "Via",
      houseNumber: "Numer",
      postal: "Numer postal",
      city: "Citad",
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
      aiPrompt: "Pleds-clav (p.ex. quiets, net)",
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
    thankYou: {
      title: "Grazia",
      msg: "Grazia fitg per l'utilisaziun. Il document è vegnì generà localmain."
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
        { title: "All National Languages", desc: "Available in DE, FR, IT, and Romansh." },
        { title: "Multiple Templates", desc: "Choose from several professional PDF templates." },
        { title: "No Registration", desc: "No account required — fast and anonymous." },
        { title: "Data Not Stored", desc: "Data is not kept after creation — privacy first." }
      ]
    },
    steps: ["Start", "Owner", "Pet", "Health", "Nature", "Photo", "Review", "Template", "File", "Thank you"],
    stepTitles: {
      1: "Owner Information",
      2: "Pet Details",
      3: "Health & Insurance",
      4: "Character Description",
      5: "Upload Photo",
      6: "Review Data",
      7: "Choose Template",
      8: "Preview & Download"
    },
    summary: {
      title: "Review Your Data",
      owner: "Owner",
      address: "Address",
      petName: "Pet Name",
      breed: "Breed",
      ageWeight: "Age / Weight",
      gender: "Gender",
      description: "Description",
      confirmation: "Everything looks good? Proceed to template selection!"
    },
    templateSelection: {
      title: "Choose Template",
      subtitle: "Select a design for your Pet CV"
    },
    preview: {
      title: "Your Pet CV is ready!",
      instruction: "📄 Use the buttons below to download or send the document"
    },
    finalMessage: "Thank you for using our service! 🐾",
    ui: {
      select: "Select",
      preview: "Preview",
      previewMode: "Preview Mode",
      emailComingSoon: "Email function will be added soon",
      emailInDevelopment: "Email function in development",
      freeSuccess: "Thank you! Good luck with your search.",
      insuranceInfoDog: "For dogs, AMICUS and liability insurance are often mandatory in Switzerland.",
      insuranceInfoCat: "For cats too, insurance is often recommended (tenant damages)."
    },
    labels: {
      type: "Animal Type",
      dog: "Dog",
      cat: "Cat",
      other: "Other",
      ownerName: "Full Name",
      email: "Email",
      phone: "Phone",
      address: "Current Address",
      street: "Street",
      houseNumber: "House Number",
      postal: "Postal Code",
      city: "City",
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
    thankYou: {
      title: "Thank you",
      msg: "Thanks for using the service. Your document was created locally."
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
        { title: "Всі державні мови", desc: "Доступно німецькою, французькою, італійською." },
        { title: "Кілька шаблонів", desc: "Вибирайте серед декількох професійних шаблонів PDF." },
        { title: "Без реєстрації", desc: "Не потрібно створювати акаунт — швидко й анонімно." },
        { title: "Дані не зберігаються", desc: "Дані не зберігаються після створення — конфіденційність перш за все." }
      ]
    },
    steps: ["Старт", "Власник", "Тварина", "Здоров'я", "Характер", "Фото", "Перевірка", "Шаблон", "Файл", "Дякуємо"],
    stepTitles: {
      1: "Інформація про власника",
      2: "Деталі про тварину",
      3: "Здоров'я та страхування",
      4: "Опис характеру",
      5: "Завантажити фото",
      6: "Перевірка даних",
      7: "Вибір шаблону",
      8: "Попередній перегляд"
    },
    summary: {
      title: "Огляд введених даних",
      owner: "Власник",
      address: "Адреса",
      petName: "Ім'я тварини",
      breed: "Порода",
      ageWeight: "Вік / Вага",
      gender: "Стать",
      description: "Опис",
      confirmation: "Все виглядає добре? Перейдіть до вибору дизайну!"
    },
    templateSelection: {
      title: "Виберіть шаблон",
      subtitle: "Оберіть дизайн для вашого Pet CV"
    },
    preview: {
      title: "Ваш Pet CV готовий!",
      instruction: "📄 Використовуйте кнопки знизу для завантаження або надсилання документу"
    },
    finalMessage: "Дякуємо, що скористалися нашим сервісом! 🐾",
    ui: {
      select: "Обрати",
      preview: "Попередній перегляд",
      previewMode: "Режим перегляду",
      emailComingSoon: "Функція надсилання на пошту буде додана незабаром",
      emailInDevelopment: "Email функція в розробці",
      freeSuccess: "Дякуємо! Успіхів у пошуку.",
      insuranceInfoDog: "Для собак AMICUS та страхування відповідальності часто є обов'язковими у Швейцарії.",
      insuranceInfoCat: "Для котів також рекомендується страхування (шкода орендованому житлу)."
    },
    labels: {
      type: "Вид тварини",
      dog: "Собака",
      cat: "Кіт",
      other: "Інше",
      ownerName: "Ім'я та Прізвище",
      email: "Email",
      phone: "Телефон",
      address: "Поточна адреса",
      street: "Вулиця",
      houseNumber: "Номер будинку",
      postal: "Поштовий індекс",
      city: "Місто",
      petName: "Кличка",
      breed: "Порода / Вид",
      age: "Вік (років)",
      weight: "Вага (кг)",
      gender: "Стать",
      m: "Самець",
      f: "Самиця",
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
    thankYou: {
      title: "Дякуємо",
      msg: "Дякуємо, що скористалися сервісом. Документ згенеровано локально."
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
  street: '',
  houseNumber: '',
  postal: '',
  city: '',
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

const MAX_DESCRIPTION_LENGTH = 1600; // limit for generated / manual descriptions

const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'compact', label: 'Compact' }
];

export { TRANSLATIONS, INITIAL_DATA, MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS };

