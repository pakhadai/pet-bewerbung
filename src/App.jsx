import React, { useState, useEffect, useRef } from 'react';
import { MAX_DESCRIPTION_LENGTH, TEMPLATE_OPTIONS } from './constants';
import { TRANSLATIONS, INITIAL_DATA } from './constants';
import GlobalStyles from './components/GlobalStyles';
import Label from './components/Label';
import Input from './components/Input';
import Button from './components/Button';
import LandingPage from './components/LandingPage';
import SwissDocument from './components/SwissDocument';
import { Dog, Cat, Bird, Camera, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, Flag, PawPrint, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import DonateModal from './components/DonateModal';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);
  const [donationTier, setDonationTier] = useState(null);
  const [animDir, setAnimDir] = useState('left');
  const prevStepRef = useRef(0);
  const [butterVisible, setButterVisible] = useState(false);
  const [templateType, setTemplateType] = useState(TEMPLATE_OPTIONS[0].id);
  const [donationAmount, setDonationAmount] = useState('5');

  const t = TRANSLATIONS[data.lang] || TRANSLATIONS.de;

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

  const handleDonate = async () => {
    // legacy single-method donate kept for compatibility
    return handleDonateMethod('card');
  };

  const [donateOpen, setDonateOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

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
      if (json.url) window.open(json.url, '_blank');
      else alert(json.error || 'Failed to create checkout session');
    } catch (err) {
      alert('Payment error: ' + (err.message || err));
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
            <div><Label>{t.labels.email}</Label><Input type="email" value={data.email} onChange={e => updateData('email', e.target.value)} /></div>
            <div><Label>{t.labels.phone}</Label><Input type="tel" value={data.phone} onChange={e => updateData('phone', e.target.value)} /></div>
            <div><Label>{t.labels.address}</Label><Input value={data.address} onChange={e => updateData('address', e.target.value)} /></div>
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
      case 6: return (
        <div className={`page page-enter-${animDir} reveal fade-enter space-y-8 text-center max-w-4xl mx-auto`}>
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

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 120);
      setButterVisible(nearBottom);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 pb-32 print:bg-white print:p-0">
      <GlobalStyles />
      <header className="app-header bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-4 z-30 h-16 px-4 flex items-center justify-between print:hidden w-full transition-all">
        <div className="flex items-center gap-2 font-bold text-lg cursor-pointer" onClick={() => goToStep(0)}>
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-200"><PawPrint size={18} /></div>
          <span className="hidden sm:inline">Pet-Bewerbung.ch</span>
        </div>
        <div className="flex items-center gap-4">
          <select value={data.lang} onChange={(e) => updateData('lang', e.target.value)}
            className="bg-slate-50 border border-slate-200 text-sm font-medium outline-none cursor-pointer hover:bg-slate-100 py-1.5 px-3 rounded-lg transition-colors">
            <option value="de">🇩🇪 DE</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="it">🇮🇹 IT</option>
            <option value="rm">🇨🇭 RM</option>
          </select>

          <div className="flex items-center justify-center gap-4">
            <Button onClick={() => window.print()} className="py-4 px-6 text-sm shadow-sm">
              <Download className="mr-2" size={14} /> {t.labels.download}
            </Button>
            <div className="flex items-center gap-2">
              <input placeholder="Donation EUR" value={donationAmount} onChange={e => setDonationAmount(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
              <Button onClick={() => setDonateOpen(true)}>Donate</Button>
            </div>
          </div>
        </div>
      </header>

          <div className="mb-4 flex items-center justify-between">
            <div className="text-left"><span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Preview</span></div>
            <div className="text-right">
              <span className="text-xs text-slate-500 mr-3">Template:</span>
              <select value={templateType} onChange={e => setTemplateType(e.target.value)} className="px-2 py-1 border rounded">
                {TEMPLATE_OPTIONS.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
              </select>
              <Button variant="ghost" className="ml-3" onClick={() => goToStep(5)}>Back to Edit</Button>
            </div>
          </div>
      <main className="w-full max-w-7xl mx-auto print:w-full print:max-w-none print:p-0">
        <div className="p-4 md:p-8 print:border-none print:shadow-none print:p-0">
                <SwissDocument data={data} t={t} templateType={templateType} />
            <div className="flex gap-2 mb-8 max-w-lg mx-auto">
              {t.steps.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-600' : 'bg-slate-100'}`} />
              ))}
            </div>
          )}
          {renderStep()}
        </div>
      </main>

      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} amount={donationAmount} onDonate={handleDonateMethod} onOpenPayment={() => { setPaymentOpen(true); setDonateOpen(false); }} />
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} amount={donationAmount} />

      {step > 0 && step < 6 && (
        <div className="nav-panel print:hidden">
          <Button variant="ghost" className="btn" onClick={() => goToStep(step - 1)}><ChevronLeft size={16} /></Button>
          <div className="px-4 text-sm text-slate-600">{t.steps[step]}</div>
          <Button className="btn" onClick={() => goToStep(step + 1)}>Next <ChevronRight size={16} /></Button>
        </div>
      )}

      <div className="butter-footer">
        <div className={`butter-inner ${butterVisible ? 'visible' : ''}`}>
          Developed in Switzerland • Zürich • Lausanne • Lugano
        </div>
      </div>

      <div className="hidden print:block absolute top-0 left-0 w-full bg-white z-[9999]">
         <SwissDocument data={data} t={t} />
      </div>
    </div>
  );
}
