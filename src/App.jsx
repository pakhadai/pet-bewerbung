import React, { useState, useEffect, useRef } from 'react';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS, TRANSLATIONS, INITIAL_DATA } from './constants';
import GlobalStyles from './components/GlobalStyles';
import Label from './components/Label';
import Input from './components/Input';
import Button from './components/Button';
import LanguageSelector from './components/LanguageSelector';
import LandingPage from './components/LandingPage';
import SwissDocument from './components/SwissDocument';
import { Dog, Cat, Bird, Camera, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, PawPrint, ChevronLeft, ChevronRight, X, Printer, Mail, LayoutTemplate, Heart } from 'lucide-react';
import DonateModal from './components/DonateModal';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [step, setStep] = useState(0);
  
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
  const [selectedTemplate, setSelectedTemplate] = useState(null); 
  
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

  const updateData = (field, value) => setData(prev => ({ ...prev, [field]: value }));

  const goToStep = (newStep) => {
    setAnimDir(newStep > prevStepRef.current ? 'left' : 'right');
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

  const handleDonateMethod = async (method) => {
    const parsed = parseFloat(donationAmount || '0');
    const amount = Math.max(1, Math.round(parsed));
    const cents = amount * 100;
    try {
      const res = await fetch('http://localhost:4242/create-checkout-session', {
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
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 max-w-lg mx-auto`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span>
             {t.steps[1]}
          </h2>
          <div className="grid grid-cols-1 gap-5">
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
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 max-w-lg mx-auto`}>
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
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 max-w-lg mx-auto`}>
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
                  {data[opt.id] && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <input type="checkbox" className="hidden" checked={data[opt.id]} onChange={e => updateData(opt.id, e.target.checked)} />
              </label>
            ))}
          </div>
        </div>
      );
      case 4: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 max-w-lg mx-auto`}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span>
             {t.steps[4]}
          </h2>
          <div>
            <Label>{t.labels.aiPrompt}</Label>
              <textarea maxLength={MAX_DESCRIPTION_LENGTH} className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none h-40 resize-none bg-slate-50 transition-all hover:bg-white"
                placeholder={data.lang === 'ua' ? "тихий, охайний, любить спати" : "ruhig, sauber, schläft viel"}
                value={data.generatedText || data.keywords} onChange={e => updateData('generatedText', e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))} />
              <div className="text-xs text-slate-500 mt-2">{(data.generatedText || data.keywords).length} / {MAX_DESCRIPTION_LENGTH} chars</div>
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
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-6 text-center max-w-lg mx-auto`}>
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

      // --- КРОК 6: ВИБІР ШАБЛОНУ (ТІЛЬКИ СІТКА, БЕЗ ДОКУМЕНТУ) ---
      case 6: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-8 text-center max-w-4xl mx-auto`}>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {t.landing.heroTitle || 'Оберіть стиль'}
          </h2>
          <p className="text-slate-600 mb-8">{t.landing.heroSub || 'Виберіть професійний дизайн'}</p>

          {/* СІТКА ВИБОРУ ШАБЛОНУ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto px-4">
            {['classic', 'modern', 'compact'].map((tpl) => (
              <div key={tpl} 
                   className="group relative p-4 border-2 border-slate-100 rounded-3xl bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col items-center cursor-pointer"
                   onClick={() => { setTemplateType(tpl); setSelectedTemplate(tpl); showToast('Template selected', 'info'); goToStep(step + 1); }}>
                
                <div className="absolute top-4 left-0 right-0 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                    {tpl}
                  </span>
                </div>

                <div className="mt-10 w-full aspect-[1/1.4] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 group-hover:bg-white transition-colors relative">
                  {/* Мініатюра */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <div style={{ width: '210mm', transform: 'scale(0.25)', transformOrigin: 'center' }} className="shadow-lg">
                       <SwissDocument data={data} t={t} templateType={tpl} />
                     </div>
                  </div>
                  
                  {/* Overlay при наведенні */}
                  <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 bg-white px-4 py-2 rounded-lg shadow-lg font-medium text-indigo-600">
                      Select
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-3 w-full">
                  <Button variant="ghost" className="flex-1 text-xs" onClick={(e) => { e.stopPropagation(); setPreviewTemplate(tpl); setPreviewOpen(true); }}>
                    <Camera size={14} className="mr-1"/> Preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

      // --- КРОК 7: ФАЙЛ / ЗАВАНТАЖИТИ / ВІДПРАВИТИ ---
      case 7: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-8 max-w-3xl mx-auto`}>
          <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm">{step}</span>
             {t.steps[7]}
          </h2>

          {/* Показуємо повний документ */}
          <div className="w-full flex justify-center overflow-auto py-4 mb-8 border rounded-xl bg-slate-50 p-4">
            <div className="overflow-hidden border rounded shadow-lg bg-white" style={{ width: '210mm' }}>
              <SwissDocument data={data} t={t} templateType={selectedTemplate} />
            </div>
          </div>

          {/* ОПЦІЇ: Завантажити або Відправити */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
             <h3 className="text-xl font-bold mb-6 text-slate-900">Оберіть спосіб:</h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {/* Завантажити */}
               <Button 
                 onClick={() => window.print()} 
                 className="px-6 py-4 shadow-lg shadow-indigo-200 text-lg font-semibold flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700">
                 <Printer size={20}/> 
                 <span>{t.labels.download} (PDF)</span>
               </Button>

               {/* Відправити на пошту */}
               <Button 
                 variant="secondary"
                 onClick={() => { 
                   const mailTo = `mailto:?subject=${encodeURIComponent('Pet CV - Pet-Bewerbung.ch')}&body=${encodeURIComponent('Please find my pet CV attached (save as PDF first).')}`; 
                   window.location.href = mailTo; 
                 }}
                 className="px-6 py-4 shadow-lg shadow-slate-200 text-lg font-semibold flex items-center justify-center gap-3">
                 <Mail size={20}/> 
                 <span>Відправити на пошту</span>
               </Button>
             </div>

             <p className="text-sm text-slate-600 mt-6 text-center">
               Документ не зберігається на сервері — тільки локально у вашому комп'ютері
             </p>
          </div>

          {/* Кнопка далі */}
          <div className="flex justify-center">
            <Button className="text-lg px-8 py-4 shadow-xl shadow-indigo-200" onClick={() => goToStep(step + 1)}>
              Далі на подяку <ArrowRight className="ml-2" size={20}/>
            </Button>
          </div>
        </div>
      );
      default: return null;
    }
  };

  // --- КРОК 8: ФІНАЛЬНА СТОРІНКА (ПОДЯКА + ДОНАТИ) ---
  if (step === 8) {
    return (
      <div className="min-h-screen bg-white font-sans text-slate-900 pb-6 print:bg-white print:p-0">
        <GlobalStyles />
        <header className="app-header bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all">
          <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => goToStep(0)}>
            <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-200"><PawPrint size={18} /></div>
            <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector value={data.lang} onChange={(v) => updateData('lang', v)} />
          </div>
        </header>

        <main className="w-full max-w-2xl mx-auto py-20 text-center px-4">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
              <CheckCircle2 size={40} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold mb-4">{t.thankYou.title}</h2>
          <p className="text-lg text-slate-600 mb-12">{t.thankYou.msg}</p>

          <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100 mb-12">
             <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
               <Heart className="text-red-500 fill-red-500" size={20} />
               {t.monetization.title}
             </h3>
             <p className="text-slate-500 mb-8 max-w-md mx-auto">{t.monetization.desc}</p>
             
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0, 5, 10, 20].map(amount => (
                  <button 
                    key={amount}
                    onClick={() => {
                      if (amount === 0) { 
                        showToast('Дякуємо! Успіхів у пошуку.', 'success'); 
                      } else {
                        setDonationAmount(String(amount));
                        setDonateOpen(true);
                      }
                    }}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      amount === 0 
                      ? 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-100' 
                      : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105'
                    }`}
                  >
                    {amount === 0 ? t.monetization.free : `${amount} CHF`}
                  </button>
                ))}
             </div>
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={() => { setStep(0); setSelectedTemplate(null); showToast('Restarting'); }}>
              Створити нове
            </Button>
            <Button variant="ghost" onClick={() => window.location.reload()}>Close</Button>
          </div>
        </main>

        <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} amount={donationAmount} onDonate={handleDonateMethod} onOpenPayment={() => { setPaymentOpen(true); setDonateOpen(false); }} />
        <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} amount={donationAmount} onSuccess={(id) => showToast('Thank you — payment succeeded', 'success')} onFailure={(msg) => showToast(`Payment failed: ${msg}`, 'error')} />
      
        {toast && (
          <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
            {toast.msg}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-6 print:bg-white print:p-0">
      <GlobalStyles />
      <header className="app-header bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all">
        <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => goToStep(0)}>
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-200"><PawPrint size={18} /></div>
          <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector value={data.lang} onChange={(v) => updateData('lang', v)} />
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto print:w-full print:max-w-none print:p-0">
        <div className="p-4 md:p-8 print:border-none print:shadow-none print:p-0">
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
               <Camera size={18} /> Preview Mode — {previewTemplate}
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
        <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-3 animate-in slide-in-from-bottom-4 ${toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'}`}>
          {toast.msg}
        </div>
      )}

      {step > 0 && step < 8 && (
        <div className="nav-panel print:hidden">
          <Button variant="ghost" className="btn" onClick={() => goToStep(step - 1)}><ChevronLeft size={16} /></Button>
          <div className="px-4 text-sm text-slate-600">{t.steps[step]}</div>
          <Button className="btn" onClick={() => goToStep(step + 1)}>Next <ChevronRight size={16} /></Button>
        </div>
      )}

      <div className="butter-footer print:hidden">
        <div className={`butter-inner ${butterVisible ? 'visible' : ''}`}>
            <img src="https://flagcdn.com/20x15/ch.png" alt="CH" width="20" height="15" style={{ display: 'inline-block', marginRight: 8 }} />
            St. Gallen — Developed in Switzerland
          </div>
      </div>
    </div>
  );
}