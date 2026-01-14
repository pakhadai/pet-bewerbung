import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS, TRANSLATIONS, INITIAL_DATA } from './constants';
import API_ENDPOINTS from './config';
import GlobalStyles from './components/GlobalStyles';
import ThemeToggle from './components/ThemeToggle';
import PageTitle from './components/PageTitle';
import Label from './components/Label';
import Input from './components/Input';
import Button from './components/Button';
import LanguageSelector from './components/LanguageSelector';
import LandingPage from './components/LandingPage';
import SwissDocument from './components/SwissDocument';
import { Dog, Cat, Bird, Camera, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, PawPrint, ChevronLeft, ChevronRight, X, Printer, Mail, LayoutTemplate, Heart, Phone, Volume2 } from 'lucide-react';
import DonateModal from './components/DonateModal';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState('light');
  
  const detectLang = () => {
    try {
      const nav = (navigator && (navigator.language || navigator.userLanguage) || '').slice(0,2).toLowerCase();
      if (nav === 'uk') return 'ua';
      if (['de','fr','it','rm','en','ua'].includes(nav)) return nav;
    } catch (e) {
      // ignore
    }
    return INITIAL_DATA.lang || 'de';
  };

  const [data, setData] = useState(() => ({ ...INITIAL_DATA, lang: detectLang() }));
  const [isGenerating, setIsGenerating] = useState(false);
  const [animDir, setAnimDir] = useState('left');
  const prevStepRef = useRef(0);
  const [butterVisible, setButterVisible] = useState(false);
  
  // Template State
  const [templateType, setTemplateType] = useState(TEMPLATE_OPTIONS[0].id);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_OPTIONS[0].id); // Виправлено: замість null 
  
  // Donation State
  const [donationAmount, setDonationAmount] = useState('5');
  const [donateOpen, setDonateOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  
  const [toast, setToast] = useState(null); // { type: 'success'|'error'|'info', msg }
  
  // Preview State (Modal)
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(templateType);

  const t = TRANSLATIONS[data.lang] || TRANSLATIONS.de;

  // --- ВИПРАВЛЕННЯ ERROR #300: Хуки повинні бути тут, на самому верху ---
  useEffect(() => {
    const onScroll = () => {
      // Показуємо футер "Made in Switzerland" тільки внизу сторінки
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 120);
      setButterVisible(nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Попередження про застарілий згенерований текст при зміні мови
  const prevLangRef = useRef(data.lang);
  useEffect(() => {
    if (prevLangRef.current !== data.lang && data.generatedText && data.generatedText.length > 0) {
      // Очищаємо згенерований текст при зміні мови
      updateData('generatedText', '');
      showToast(TRANSLATIONS[data.lang]?.labels?.aiPrompt || 'Please regenerate text for the new language', 'info');
    }
    prevLangRef.current = data.lang;
  }, [data.lang, data.generatedText]);

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const goToStep = (newStep) => {
    // Виправлена логіка: вперед = right, назад = left
    setAnimDir(newStep > prevStepRef.current ? 'right' : 'left');
    prevStepRef.current = newStep;
    setStep(newStep);
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
      updateData('generatedText', fullText.slice(0, MAX_DESCRIPTION_LENGTH));
      setIsGenerating(false);
    }, 1000);
  };

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleDownloadPDF = async () => {
    try {
      const element = document.getElementById('pdf-document');
      if (!element) {
        showToast('Document not found', 'error');
        return;
      }
      const filename = `${data.name || 'Pet-CV'}-${new Date().getTime()}.pdf`;
      const options = {
        margin: 0,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
      };
      await html2pdf().set(options).from(element).save();
      showToast('PDF downloaded successfully!', 'success');
      // Автоматичний редирект на step 9 після завантаження - збільшена затримка
      setTimeout(() => goToStep(9), 2000);
    } catch (err) {
      showToast('Failed to download PDF: ' + err.message, 'error');
    }
  };

  const handleDonateMethod = async (method) => {
    const parsed = parseFloat(donationAmount || '5');
    const amount = Math.max(1, Math.round(parsed)); // Мінімум 1 CHF
    const cents = amount * 100;
    try {
      const res = await fetch(API_ENDPOINTS.createCheckoutSession, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cents, currency: 'eur', successUrl: window.location.href, cancelUrl: window.location.href, payment_method: method }),
      });
      const json = await res.json();
      if (json.url) {
        window.open(json.url, '_blank');
        showToast('Opening Checkout...', 'info');
      } else {
        showToast(json.error || 'Failed to create checkout session', 'error');
      }
    } catch (err) {
      showToast('Payment error: ' + (err.message || err), 'error');
    } finally {
      setDonateOpen(false);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0: return <div className={`page page-enter-${animDir} reveal fade-enter`}><LandingPage t={t} setStep={goToStep} /></div>;
      case 1: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
          <div className="grid grid-cols-1 gap-3">
            <div><Label>{t.labels.ownerName}</Label><Input value={data.ownerName} onChange={e => updateData('ownerName', e.target.value)} placeholder="Max Mustermann" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t.labels.street}</Label><Input value={data.street} onChange={e => updateData('street', e.target.value)} placeholder="Bahnhofstrasse" /></div>
              <div><Label>{t.labels.houseNumber}</Label><Input value={data.houseNumber} onChange={e => updateData('houseNumber', e.target.value)} placeholder="12A" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t.labels.postal}</Label><Input value={data.postal} onChange={e => updateData('postal', e.target.value)} placeholder="9000" /></div>
              <div><Label>{t.labels.city}</Label><Input value={data.city} onChange={e => updateData('city', e.target.value)} placeholder="St. Gallen" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>{t.labels.email}</Label><Input type="email" value={data.email} onChange={e => updateData('email', e.target.value)} /></div>
              <div><Label>{t.labels.phone}</Label><Input type="tel" value={data.phone} onChange={e => updateData('phone', e.target.value)} /></div>
            </div>
          </div>
        </div>
      );
      case 2: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[{ id: 'dog', label: t.labels.dog, icon: Dog }, { id: 'cat', label: t.labels.cat, icon: Cat }, { id: 'other', label: t.labels.other, icon: Bird }].map(type => (
              <button key={type.id} onClick={() => updateData('petType', type.id)}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover-glass ${data.petType === type.id ? 'theme-radio-selected' : 'theme-radio theme-border'}`}>
                <type.icon size={24} className="mb-2" /><span className="text-sm font-medium">{type.label}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label>{t.labels.petName}</Label><Input value={data.name} onChange={e => updateData('name', e.target.value)} /></div>
            <div><Label>{t.labels.breed}</Label><Input value={data.breed} onChange={e => updateData('breed', e.target.value)} /></div>
            <div><Label>{t.labels.age}</Label><Input type="number" value={data.age} onChange={e => updateData('age', e.target.value)} /></div>
            <div><Label>{t.labels.weight}</Label><Input value={data.weight} onChange={e => updateData('weight', e.target.value)} /></div>
            <div><Label>{t.labels.gender}</Label>
              <div className="flex gap-2 h-[46px]">
                {['m', 'f'].map(g => (
                  <label key={g} className={`flex items-center justify-center gap-2 cursor-pointer border rounded-lg flex-1 transition-colors ${data.gender === g ? 'theme-radio-selected' : 'theme-radio theme-border hover:theme-card-bg-hover'}`}>
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
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-7 max-w-2xl mx-auto`}>
          {/* Insurance Section */}
          <div className="theme-card rounded-2xl p-6 border theme-border">
            <div className="p-4 theme-info-box rounded-xl text-sm flex gap-3 leading-relaxed border mb-6">
              <ShieldCheck className="shrink-0 mt-0.5" />
              <span>{data.petType === 'dog' ? t.ui.insuranceInfoDog : t.ui.insuranceInfoCat}</span>
            </div>
            <div className="grid grid-cols-1 gap-5">
              <div><Label>{t.labels.insurance}</Label><Input value={data.insuranceProvider} onChange={e => updateData('insuranceProvider', e.target.value)} placeholder="z.B. AXA, Mobiliar" /></div>
              <div className="grid grid-cols-2 gap-5">
                <div><Label>{t.labels.chipId}</Label><Input value={data.chipId} onChange={e => updateData('chipId', e.target.value)} /></div>
                <div><Label>{t.labels.vet}</Label><Input value={data.vetName} onChange={e => updateData('vetName', e.target.value)} /></div>
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              {[{ id: 'isNeutered', label: t.labels.neutered }, { id: 'hasVaccination', label: t.labels.vaccination }, { id: 'hasRegistration', label: t.labels.registration }].map(opt => (
                <label key={opt.id} className="flex items-center justify-between p-4 theme-border rounded-xl cursor-pointer hover:theme-card-bg-hover transition-colors theme-card hover-glass">
                  <span className="text-sm font-medium theme-text">{opt.label}</span>
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${data[opt.id] ? 'theme-radio-selected' : 'theme-border'}`}>
                    {data[opt.id] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={data[opt.id]} onChange={e => updateData(opt.id, e.target.checked)} />
                </label>
              ))}
            </div>
          </div>

          {/* Behavior & Daily Routine Section */}
          <div className="theme-card rounded-2xl p-6 border theme-border">
            <h3 className="text-lg font-bold theme-text mb-4 flex items-center gap-2">
              <Volume2 size={20} />
              {t.labels.behaviorWithChildren.split(' ')[0]} & Routine
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label>{t.labels.noiseLevel}</Label>
                <select className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all" value={data.noiseLevel} onChange={e => updateData('noiseLevel', e.target.value)}>
                  <option value="low">{t.labels.noiseLow}</option>
                  <option value="medium">{t.labels.noiseMedium}</option>
                  <option value="high">{t.labels.noiseHigh}</option>
                </select>
              </div>
              <div>
                <Label>{t.labels.aloneTime}</Label>
                <Input type="number" min="0" max="24" value={data.aloneTime} onChange={e => updateData('aloneTime', e.target.value)} placeholder="0-24" />
              </div>
              <div className="md:col-span-2">
                <Label>{t.labels.activeHours}</Label>
                <Input value={data.activeHours} onChange={e => updateData('activeHours', e.target.value)} placeholder="07:00-09:00, 18:00-20:00" />
              </div>
              <div>
                <Label>{t.labels.behaviorWithChildren}</Label>
                <select className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all" value={data.behaviorWithChildren} onChange={e => updateData('behaviorWithChildren', e.target.value)}>
                  <option value="">{t.labels.behaviorNeutral}</option>
                  <option value="good">{t.labels.behaviorGood}</option>
                  <option value="neutral">{t.labels.behaviorNeutral}</option>
                  <option value="avoid">{t.labels.behaviorAvoid}</option>
                </select>
              </div>
              <div>
                <Label>{t.labels.behaviorWithPets}</Label>
                <select className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none transition-all" value={data.behaviorWithPets} onChange={e => updateData('behaviorWithPets', e.target.value)}>
                  <option value="">{t.labels.behaviorNeutral}</option>
                  <option value="good">{t.labels.behaviorGood}</option>
                  <option value="neutral">{t.labels.behaviorNeutral}</option>
                  <option value="avoid">{t.labels.behaviorAvoid}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reference & Emergency Contact Section */}
          <div className="theme-card rounded-2xl p-6 border theme-border">
            <h3 className="text-lg font-bold theme-text mb-4 flex items-center gap-2">
              <Phone size={20} />
              {t.labels.previousLandlord} & {t.labels.emergencyContact}
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div className="pb-4 border-b theme-border">
                <Label className="text-base font-semibold mb-3 block">{t.labels.previousLandlord}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>{t.labels.previousLandlordName}</Label><Input value={data.previousLandlordName} onChange={e => updateData('previousLandlordName', e.target.value)} /></div>
                  <div><Label>{t.labels.previousDuration}</Label><Input value={data.previousDuration} onChange={e => updateData('previousDuration', e.target.value)} placeholder="3 Jahre" /></div>
                  <div><Label>{t.labels.previousLandlordPhone}</Label><Input value={data.previousLandlordPhone} onChange={e => updateData('previousLandlordPhone', e.target.value)} placeholder="+41 XX XXX XX XX" /></div>
                  <div><Label>{t.labels.previousLandlordEmail}</Label><Input type="email" value={data.previousLandlordEmail} onChange={e => updateData('previousLandlordEmail', e.target.value)} /></div>
                </div>
              </div>
              <div>
                <Label className="text-base font-semibold mb-3 block">{t.labels.emergencyContact}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>{t.labels.emergencyContactName}</Label><Input value={data.emergencyContactName} onChange={e => updateData('emergencyContactName', e.target.value)} /></div>
                  <div><Label>{t.labels.emergencyContactRelation}</Label><Input value={data.emergencyContactRelation} onChange={e => updateData('emergencyContactRelation', e.target.value)} placeholder="Freund, Familie" /></div>
                  <div className="md:col-span-2"><Label>{t.labels.emergencyContactPhone}</Label><Input value={data.emergencyContactPhone} onChange={e => updateData('emergencyContactPhone', e.target.value)} placeholder="+41 XX XXX XX XX" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-lg mx-auto`}>
          <div>
            <Label>{t.labels.aiPrompt}</Label>
              <textarea maxLength={MAX_DESCRIPTION_LENGTH} className="theme-input w-full p-3 border rounded-xl text-sm focus:ring-2 outline-none h-32 resize-none transition-all"
                placeholder={data.lang === 'ua' ? "тихий, охайний, любить спати" : "ruhig, sauber, schläft viel"}
                value={data.generatedText || data.keywords} onChange={e => updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))} />
              <div className="text-xs theme-text-muted mt-1">{(data.generatedText || data.keywords).length} / {MAX_DESCRIPTION_LENGTH} chars</div>
          </div>
          <Button variant="magic" className="w-full" onClick={generateText} disabled={!data.keywords || isGenerating}>
            {isGenerating ? <Sparkles className="animate-spin mr-2" size={16} /> : <Sparkles className="mr-2" size={16} />}
            {t.labels.aiBtn}
          </Button>
          {data.generatedText && (
            <div className="mt-3 fade-enter">
              <Label>{t.labels.aiResult}</Label>
              <div className="theme-card p-4 rounded-xl border theme-border shadow-sm text-sm leading-relaxed theme-text-secondary italic">
                {data.generatedText}
              </div>
            </div>
          )}
        </div>
      );
      case 5: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 text-center max-w-lg mx-auto`}>
          <div className="relative group cursor-pointer inline-block w-full">
            <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className={`aspect-square w-full max-w-[240px] mx-auto rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${data.photo ? 'border-primary p-2' : 'theme-border theme-bg-secondary hover:theme-card-bg-hover hover:scale-105'}`}>
              {data.photo ? (
                <img src={data.photo} className="w-full h-full object-cover rounded-xl shadow-sm" alt="Pet" />
              ) : (
                <>
                  <div className="w-14 h-14 theme-bg-secondary rounded-full flex items-center justify-center mb-3 theme-text-muted"><Camera size={28} /></div>
                  <span className="theme-text font-medium">{t.labels.photo}</span>
                </>
              )}
            </div>
          </div>
        </div>
      );

      // --- КРОК 6: ОГЛЯД ДАНИХ (SUMMARY) ---
      case 6: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-2xl mx-auto`}>
          <div className="theme-card rounded-2xl p-5 theme-border border space-y-3 scale-hover">
            <div className="grid grid-cols-2 gap-3 text-sm slide-up-stagger">
              <div>
                <span className="theme-text-muted font-medium">{t.summary.owner}:</span>
                <p className="theme-text font-semibold">{data.ownerName || '—'}</p>
              </div>
              <div>
                <span className="theme-text-muted font-medium">{t.summary.address}:</span>
                <p className="theme-text">{data.street} {data.houseNumber}, {data.postal} {data.city}</p>
              </div>
              <div>
                <span className="theme-text-muted font-medium">{t.summary.petName}:</span>
                <p className="theme-text font-semibold">{data.name || '—'}</p>
              </div>
              <div>
                <span className="theme-text-muted font-medium">{t.summary.breed}:</span>
                <p className="theme-text">{data.breed || '—'}</p>
              </div>
              <div>
                <span className="theme-text-muted font-medium">{t.summary.ageWeight}:</span>
                <p className="theme-text">{data.age || '—'} / {data.weight || '—'}</p>
              </div>
              <div>
                <span className="theme-text-muted font-medium">{t.summary.gender}:</span>
                <p className="theme-text">{data.gender === 'm' ? t.labels.m : t.labels.f}</p>
              </div>
            </div>

            {data.generatedText && (
              <div className="pt-3 border-t theme-border">
                <span className="theme-text-muted font-medium text-sm">{t.summary.description}:</span>
                <p className="theme-text-secondary text-sm mt-1 leading-relaxed italic">
                  {data.generatedText}
                </p>
              </div>
            )}

            {data.photo && (
              <div className="pt-3 border-t theme-border flex justify-center">
                <img src={data.photo} alt="Pet" className="w-28 h-28 object-cover rounded-xl shadow-sm" />
              </div>
            )}
          </div>

          <div className="theme-info-box rounded-xl p-3 text-sm text-center">
            <CheckCircle2 size={18} className="inline mr-2" />
            {t.summary.confirmation}
          </div>
        </div>
      );

      // --- КРОК 7: ВИБІР ШАБЛОНУ (ТІЛЬКИ СІТКА, БЕЗ ДОКУМЕНТУ) ---
      case 7: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-10 text-center max-w-7xl mx-auto`}>
          {/* СІТКА ВИБОРУ ШАБЛОНУ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto px-4">
            {TEMPLATE_OPTIONS.map((tplOption) => (
              <div key={tplOption.id}
                   className="group relative p-4 border-2 theme-border rounded-3xl theme-card hover:border-primary hover:shadow-xl hover:shadow-strong transition-all duration-300 flex flex-col items-center cursor-pointer card-lift"
                   onClick={() => { setTemplateType(tplOption.id); setSelectedTemplate(tplOption.id); showToast('Template selected', 'info'); goToStep(step + 1); }}>

                <div className="absolute top-4 left-0 right-0 text-center">
                  <span className="inline-block px-3 py-1 rounded-full theme-bg-secondary theme-text-muted text-xs font-bold uppercase tracking-widest group-hover:bg-primary-light group-hover:text-primary transition-colors">
                    {tplOption.label}
                  </span>
                </div>

                <div className="mt-10 w-full aspect-[1/1.4] overflow-hidden rounded-xl border theme-border theme-bg-secondary group-hover:theme-card transition-colors relative">
                  {/* Мініатюра */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
                     <div style={{ width: '210mm', transform: 'scale(0.42)', transformOrigin: 'center' }} className="shadow-lg">
                       <SwissDocument data={data} t={t} templateType={tplOption.id} />
                     </div>
                  </div>

                  {/* Overlay при наведенні */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 theme-card px-4 py-2 rounded-lg shadow-lg font-medium theme-text">
                      {t.ui.select}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 w-full">
                  <Button variant="ghost" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); setPreviewTemplate(tplOption.id); setPreviewOpen(true); }}>
                    <Camera size={14} className="mr-1"/> {t.ui.preview}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      // --- КРОК 8: PREVIEW ДОКУМЕНТУ ---
      case 8: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-4 max-w-4xl mx-auto`}>
          {/* Показуємо повний документ */}
          <div className="w-full flex justify-center overflow-auto py-4 mb-4 border rounded-2xl theme-bg-secondary theme-border p-4 shadow-lg">
            <div id="pdf-document" className="overflow-hidden border-2 rounded-lg shadow-2xl theme-card" style={{ width: '210mm' }}>
              <SwissDocument data={data} t={t} templateType={selectedTemplate} />
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  // --- КРОК 9: ФІНАЛЬНА СТОРІНКА (ПОДЯКА + ДОНАТИ) ---
  if (step === 9) {
    return (
      <div className="min-h-screen theme-bg font-sans theme-text pb-6 print:bg-white print:p-0">
        <GlobalStyles />
        <header className="app-header sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all">
          <div className="flex items-center gap-3 font-bold text-lg cursor-pointer" onClick={() => goToStep(0)}>
            <div className="theme-button-primary p-1.5 rounded-lg shadow-md"><PawPrint size={18} /></div>
            <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
          </div>

          {/* Step 9 title in center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 theme-text font-semibold text-base hidden md:flex items-center gap-2">
            <span className="text-lg">✅</span>
            {t.thankYou.title}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector value={data.lang} onChange={(v) => updateData('lang', v)} />
          </div>
        </header>

        <main className="w-full max-w-2xl mx-auto py-20 text-center px-4">
          {/* Animated success icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'var(--success)' }} />
              <div className="absolute inset-0 rounded-full animate-pulse opacity-30" style={{ background: 'var(--success)' }} />

              {/* Main icon */}
              <div className="relative w-24 h-24 theme-success rounded-full flex items-center justify-center shadow-xl animate-in zoom-in duration-500">
                <CheckCircle2 size={48} className="animate-in slide-in-from-top-4 duration-700 delay-200" />
              </div>
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4 theme-text animate-in slide-in-from-bottom-4 duration-500 delay-300">
            {t.thankYou.title}
          </h2>
          <p className="text-lg theme-text-muted mb-12 animate-in fade-in duration-500 delay-500">
            {t.thankYou.msg}
          </p>

          <div className="theme-bg-secondary rounded-2xl p-8 theme-border border mb-12 shadow-xl animate-in slide-in-from-bottom-4 duration-500 delay-700">
             <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2 theme-text">
               <Heart className="theme-error fill-current animate-pulse" size={20} />
               {t.monetization.title}
             </h3>
             <p className="theme-text-muted mb-8 max-w-md mx-auto">{t.monetization.desc}</p>

             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0, 5, 10, 20].map((amount, index) => (
                  <button
                    key={amount}
                    onClick={() => {
                      if (amount === 0) {
                        showToast(t.ui.freeSuccess, 'success');
                      } else {
                        setDonationAmount(String(amount));
                        setDonateOpen(true);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all animate-in slide-in-from-bottom-4 duration-500 ${
                      amount === 0
                      ? 'theme-card border theme-border theme-text-muted hover:theme-card-bg-hover hover:scale-105'
                      : 'theme-button-primary shadow-lg hover:scale-110 hover:shadow-xl'
                    }`}
                    style={{ animationDelay: `${900 + index * 100}ms` }}
                  >
                    {amount === 0 ? t.monetization.free : `${amount} CHF`}
                  </button>
                ))}
             </div>
          </div>

          <p className="text-center theme-text-muted mt-8">
            {t.finalMessage}
          </p>
        </main>

        <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} amount={donationAmount} onDonate={handleDonateMethod} onOpenPayment={() => { setPaymentOpen(true); setDonateOpen(false); }} />
        <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} amount={donationAmount} onSuccess={(id) => showToast('Thank you — payment succeeded', 'success')} onFailure={(msg) => showToast(`Payment failed: ${msg}`, 'error')} />
      
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'theme-success' : toast.type === 'error' ? 'theme-error' : 'theme-card theme-text'}`}>
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen theme-bg font-sans theme-text pb-6 print:bg-white print:p-0">
      <GlobalStyles theme={theme} />
      <header className={`app-header ${step === 0 ? 'app-header-full' : ''} sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all`}>
        <div className="flex items-center gap-3 font-bold text-lg cursor-pointer" onClick={() => goToStep(0)}>
          <div className="theme-button-primary p-1.5 rounded-lg shadow-md"><PawPrint size={18} /></div>
          <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
        </div>

        {/* Step title in center */}
        {step > 0 && step < 9 && (
          <div className="absolute left-1/2 transform -translate-x-1/2 theme-text font-semibold text-base hidden md:flex items-center gap-2">
            <span className="text-lg">
              {step === 1 ? '1️⃣' : step === 2 ? '2️⃣' : step === 3 ? '3️⃣' : step === 4 ? '4️⃣' : step === 5 ? '5️⃣' : step === 6 ? '6️⃣' : step === 7 ? '7️⃣' : '8️⃣'}
            </span>
            {t.stepTitles?.[step] || ''}
          </div>
        )}

        <div className="flex items-center gap-3">
          <ThemeToggle theme={theme} onThemeChange={setTheme} />
          <LanguageSelector value={data.lang} onChange={(v) => updateData('lang', v)} />
        </div>
      </header>

      <main className="w-full print:w-full print:max-w-none print:p-0">
        <div className={step === 0 ? "w-full" : "max-w-7xl mx-auto p-4 md:p-8 print:border-none print:shadow-none print:p-0"}>
          {renderStep()}
        </div>
      </main>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} amount={donationAmount} onDonate={handleDonateMethod} onOpenPayment={() => { setPaymentOpen(true); setDonateOpen(false); }} />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} amount={donationAmount} onSuccess={(id) => showToast('Thank you — payment succeeded', 'success')} onFailure={(msg) => showToast(`Payment failed: ${msg}`, 'error')} />

      {/* ОНОВЛЕНИЙ PREVIEW MODAL (ТІЛЬКИ ПЕРЕГЛЯД) */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
          <div className="relative bg-transparent w-full h-full flex flex-col items-center justify-center" onClick={() => setPreviewOpen(false)}>
            <button onClick={(e) => { e.stopPropagation(); setPreviewOpen(false); }} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
              <X size={32} />
            </button>
            
            <div className="text-white mb-4 font-medium flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full backdrop-blur-md" onClick={(e) => e.stopPropagation()}>
               <Camera size={18} /> {t.ui.previewMode} — {previewTemplate}
            </div>

            <div className="w-full max-w-4xl h-full overflow-auto flex justify-center items-start pt-4" onClick={(e) => e.stopPropagation()}>
               <div className="origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 shadow-2xl">
                  <SwissDocument data={data} t={t} templateType={previewTemplate} />
               </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'theme-success' : toast.type === 'error' ? 'theme-error' : 'theme-card theme-text'}`}>
          {toast.msg}
        </div>
      )}

      {step > 0 && step < 9 && (
        <div className="nav-panel print:hidden">
          <Button
            variant="ghost"
            className="btn"
            onClick={() => goToStep(step - 1)}
            disabled={step === 1}
            title={t.steps[step - 1] || 'Previous'}
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </Button>

          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((step - 1) / 7) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs font-bold theme-text-muted whitespace-nowrap min-w-[60px] text-center">
              {step}/8
            </div>
          </div>

          {step === 8 ? (
            <>
              <Button
                variant="secondary"
                className="btn"
                onClick={() => {
                  handleDownloadPDF();
                  showToast(t.ui.emailComingSoon, 'info');
                }}
                title={t.ui.emailInDevelopment}
              >
                <Mail size={18} />
                <span className="hidden sm:inline ml-2">Email</span>
              </Button>
              <Button
                variant="primary"
                className="btn shadow-lg hover:shadow-xl"
                onClick={handleDownloadPDF}
                title="Download PDF"
              >
                <Printer size={18} />
                <span className="hidden sm:inline ml-2">Download</span>
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              className="btn shadow-lg hover:shadow-xl"
              onClick={() => goToStep(step + 1)}
              disabled={step === 8}
              title={t.steps[step + 1] || 'Next'}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight size={18} strokeWidth={2.5} />
            </Button>
          )}
        </div>
      )}

      {(step === 0 || step === 9) && (
        <div className="butter-footer print:hidden">
          <div className={`butter-inner ${butterVisible ? 'visible' : ''}`}>
              <img src="https://flagcdn.com/20x15/ch.png" alt="CH" width="20" height="15" style={{ display: 'inline-block', marginRight: 8 }} />
              St. Gallen — Developed in Switzerland
            </div>
        </div>
      )}
    </div>
  );
}