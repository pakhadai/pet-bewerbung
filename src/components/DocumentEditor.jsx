import React, { useState, useCallback, useMemo } from 'react';
import { SECTION_DEFINITIONS, INITIAL_DATA } from '../constants';
import SwissDocument from './SwissDocument';

// LocalStorage key for saving custom styles
const STORAGE_KEY = 'petcv_custom_style';

// Professional Color Palettes
const COLOR_PALETTES = [
  {
    id: 'swiss-red',
    name: 'Swiss Red',
    headerColor: '#DA291C',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#fef2f2',
  },
  {
    id: 'midnight-purple',
    name: 'Midnight Purple',
    headerColor: '#4a148c',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#f3e5f5',
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    headerColor: '#1565c0',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#e3f2fd',
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    headerColor: '#2e7d32',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#e8f5e9',
  },
  {
    id: 'golden-amber',
    name: 'Golden Amber',
    headerColor: '#f57c00',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#fff3e0',
  },
  {
    id: 'slate-gray',
    name: 'Slate Gray',
    headerColor: '#455a64',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#eceff1',
  },
  {
    id: 'rose-pink',
    name: 'Rose Pink',
    headerColor: '#c2185b',
    textColor: '#1f2937',
    backgroundColor: '#ffffff',
    accentColor: '#fce4ec',
  },
  {
    id: 'dark-elegant',
    name: 'Dark Elegant',
    headerColor: '#90caf9',
    textColor: '#e0e0e0',
    backgroundColor: '#1e1e1e',
    accentColor: '#2d2d2d',
  },
];

// Font options
const FONT_OPTIONS = [
  { id: 'helvetica', name: 'Helvetica', family: 'Helvetica, Arial, sans-serif' },
  { id: 'georgia', name: 'Georgia', family: 'Georgia, "Times New Roman", serif' },
  { id: 'arial', name: 'Arial', family: 'Arial, sans-serif' },
  { id: 'times', name: 'Times New Roman', family: '"Times New Roman", Times, serif' },
  { id: 'verdana', name: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
  { id: 'tahoma', name: 'Tahoma', family: 'Tahoma, Geneva, sans-serif' },
  { id: 'trebuchet', name: 'Trebuchet MS', family: '"Trebuchet MS", sans-serif' },
  { id: 'courier', name: 'Courier New', family: '"Courier New", monospace' },
];

// Font size options
const FONT_SIZE_OPTIONS = [
  { value: 7, label: '7px' },
  { value: 8, label: '8px' },
  { value: 9, label: '9px' },
  { value: 10, label: '10px' },
  { value: 11, label: '11px' },
  { value: 12, label: '12px' },
  { value: 14, label: '14px' },
];

// Default style values
const DEFAULT_STYLE = {
  headerColor: '#4a148c',
  textColor: '#1f2937',
  backgroundColor: '#ffffff',
  accentColor: '#f3e5f5',
  headerFont: 'helvetica',
  bodyFont: 'helvetica',
  headerFontSize: 9,
  bodyFontSize: 10,
  headerBold: true,
  headerItalic: false,
  bodyBold: false,
  bodyItalic: false,
  hiddenSections: [],
  selectedPalette: 'midnight-purple',
};

// Load saved style from localStorage
const loadSavedStyle = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_STYLE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load saved style:', e);
  }
  return DEFAULT_STYLE;
};

// Save style to localStorage
const saveStyle = (style) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(style));
  } catch (e) {
    console.warn('Failed to save style:', e);
  }
};

// Section visibility toggle
const SectionToggle = ({ id, label, isHidden, onToggle, required, t }) => (
  <label className="flex items-center justify-between cursor-pointer p-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
    <span className={`text-sm font-medium ${isHidden ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </span>
    {!required && (
      <div className="relative inline-flex items-center">
        <input 
          type="checkbox" 
          checked={!isHidden}
          onChange={() => onToggle(id)}
          className="sr-only peer" 
        />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500"></div>
      </div>
    )}
  </label>
);

// Color picker
const ColorPicker = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-gray-600"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-2 text-sm font-mono border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700"
        placeholder="#000000"
      />
    </div>
  </div>
);

// Font selector
const FontSelector = ({ label, value, onChange, options }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <select 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg cursor-pointer"
      style={{ fontFamily: options.find(f => f.id === value)?.family }}
    >
      {options.map((font) => (
        <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
          {font.name}
        </option>
      ))}
    </select>
  </div>
);

// Font size selector
const FontSizeSelector = ({ label, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          const idx = FONT_SIZE_OPTIONS.findIndex(o => o.value === value);
          if (idx > 0) onChange(FONT_SIZE_OPTIONS[idx - 1].value);
        }}
        className="size-8 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <span className="material-symbols-outlined text-sm">remove</span>
      </button>
      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 w-10 text-center">{value}px</span>
      <button
        type="button"
        onClick={() => {
          const idx = FONT_SIZE_OPTIONS.findIndex(o => o.value === value);
          if (idx < FONT_SIZE_OPTIONS.length - 1) onChange(FONT_SIZE_OPTIONS[idx + 1].value);
        }}
        className="size-8 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
      >
        <span className="material-symbols-outlined text-sm">add</span>
      </button>
    </div>
  </div>
);

// Text style buttons (bold/italic)
const TextStyleButtons = ({ label, isBold, isItalic, onBoldChange, onItalicChange, t }) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
      {label}
    </label>
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onBoldChange(!isBold)}
        className={`flex-1 px-3 py-2 rounded-lg border-2 font-bold text-sm transition-all flex items-center justify-center gap-1 ${
          isBold 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 text-gray-600 dark:text-gray-400'
        }`}
      >
        <span className="material-symbols-outlined text-lg">format_bold</span>
        {t?.editor?.bold ?? 'Fett'}
      </button>
      <button
        type="button"
        onClick={() => onItalicChange(!isItalic)}
        className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm transition-all flex items-center justify-center gap-1 ${
          isItalic 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 text-gray-600 dark:text-gray-400'
        }`}
        style={{ fontStyle: 'italic' }}
      >
        <span className="material-symbols-outlined text-lg">format_italic</span>
        {t?.editor?.italic ?? 'Kursiv'}
      </button>
    </div>
  </div>
);

// Main Editor Component
const DocumentEditor = ({ 
  data, 
  updateData, 
  t, 
  darkMode, 
  onClose, 
  onApply,
  selectedTemplate 
}) => {
  const [style, setStyle] = useState(() => loadSavedStyle());
  const [hasChanges, setHasChanges] = useState(false);
  const [zoom, setZoom] = useState(65);

  // Update style
  const updateStyle = useCallback((key, value) => {
    setStyle(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, []);

  // Toggle section visibility
  const toggleSection = useCallback((sectionId) => {
    setStyle(prev => {
      const hidden = prev.hiddenSections || [];
      const newHidden = hidden.includes(sectionId)
        ? hidden.filter(id => id !== sectionId)
        : [...hidden, sectionId];
      return { ...prev, hiddenSections: newHidden };
    });
    setHasChanges(true);
  }, []);

  // Apply palette
  const applyPalette = useCallback((palette) => {
    setStyle(prev => ({
      ...prev,
      selectedPalette: palette.id,
      headerColor: palette.headerColor,
      textColor: palette.textColor,
      backgroundColor: palette.backgroundColor,
      accentColor: palette.accentColor,
    }));
    setHasChanges(true);
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setStyle(DEFAULT_STYLE);
    setHasChanges(true);
  }, []);

  // Apply and save
  const handleApply = useCallback(() => {
    saveStyle(style);
    
    const customDesign = {
      isEdited: true,
      primaryColor: style.headerColor,
      secondaryColor: style.accentColor,
      backgroundColor: style.backgroundColor,
      textColor: style.textColor,
      headerFont: style.headerFont,
      bodyFont: style.bodyFont,
      headerFontSize: style.headerFontSize,
      bodyFontSize: style.bodyFontSize,
      headerBold: style.headerBold,
      headerItalic: style.headerItalic,
      bodyBold: style.bodyBold,
      bodyItalic: style.bodyItalic,
      hiddenSections: style.hiddenSections,
    };
    
    updateData('customDesign', customDesign);
    setHasChanges(false);
    
    if (onApply) {
      onApply(customDesign);
    }
  }, [style, updateData, onApply]);

  // Sections with translations
  const sections = useMemo(() => {
    return SECTION_DEFINITIONS.map(section => ({
      ...section,
      label: t?.editor?.sections?.[section.id] ?? t?.builder?.sections?.[section.id] ?? section.label
    }));
  }, [t]);

  // Translations
  const tr = {
    title: t?.editor?.title ?? 'Dokument anpassen',
    subtitle: t?.editor?.subtitle ?? 'Farben, Schriften & Sichtbarkeit',
    palettes: t?.editor?.palettes ?? 'Farbpaletten',
    colors: t?.editor?.colors ?? 'Eigene Farben',
    headerColor: t?.editor?.headerColor ?? 'Überschriften',
    textColor: t?.editor?.textColor ?? 'Textfarbe',
    accentColor: t?.editor?.accentColor ?? 'Akzentfarbe',
    bgColor: t?.editor?.bgColor ?? 'Hintergrund',
    typography: t?.editor?.typography ?? 'Schriftarten',
    headerFont: t?.editor?.headerFont ?? 'Überschriften',
    bodyFont: t?.editor?.bodyFont ?? 'Fließtext',
    headerStyle: t?.editor?.headerStyle ?? 'Überschriften-Stil',
    bodyStyle: t?.editor?.bodyStyle ?? 'Text-Stil',
    visibility: t?.editor?.visibility ?? 'Sichtbarkeit',
    reset: t?.editor?.reset ?? 'Zurücksetzen',
    close: t?.editor?.close ?? 'Schließen',
    apply: t?.editor?.apply ?? 'Anwenden',
    unsaved: t?.editor?.unsaved ?? 'Nicht gespeichert',
    saved: t?.editor?.saved ?? 'Gespeichert',
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-14 flex items-center justify-between px-4 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div 
            className="flex size-9 items-center justify-center rounded-lg"
            style={{ backgroundColor: style.accentColor, color: style.headerColor }}
          >
            <span className="material-symbols-outlined">palette</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 dark:text-gray-100">
              {tr.title}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {tr.subtitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`hidden md:flex items-center text-xs ${hasChanges ? 'text-amber-500' : 'text-green-500'}`}>
            <span className="material-symbols-outlined text-sm mr-1">
              {hasChanges ? 'edit' : 'check_circle'}
            </span>
            {hasChanges ? tr.unsaved : tr.saved}
          </span>
          
          <button 
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm text-gray-600 dark:text-gray-300"
          >
            {tr.close}
          </button>
          
          <button 
            onClick={handleApply}
            disabled={!hasChanges}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              hasChanges 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {tr.apply}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            
            {/* Palettes */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {tr.palettes}
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {COLOR_PALETTES.map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => applyPalette(palette)}
                    className={`p-2 rounded-lg border-2 text-left transition-all ${
                      style.selectedPalette === palette.id 
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex gap-0.5 mb-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.headerColor }}></div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: palette.accentColor }}></div>
                    </div>
                    <div className="text-[10px] font-medium text-gray-600 dark:text-gray-400 truncate">{palette.name}</div>
                  </button>
                ))}
              </div>
            </section>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Colors */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {tr.colors}
              </h3>
              <div className="space-y-3">
                <ColorPicker label={tr.headerColor} value={style.headerColor} onChange={(v) => updateStyle('headerColor', v)} />
                <ColorPicker label={tr.textColor} value={style.textColor} onChange={(v) => updateStyle('textColor', v)} />
                <ColorPicker label={tr.accentColor} value={style.accentColor} onChange={(v) => updateStyle('accentColor', v)} />
                <ColorPicker label={tr.bgColor} value={style.backgroundColor} onChange={(v) => updateStyle('backgroundColor', v)} />
              </div>
            </section>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Typography */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {tr.typography}
              </h3>
              <div className="space-y-3">
                <FontSelector label={tr.headerFont} value={style.headerFont} onChange={(v) => updateStyle('headerFont', v)} options={FONT_OPTIONS} />
                <TextStyleButtons
                  label={tr.headerStyle}
                  isBold={style.headerBold}
                  isItalic={style.headerItalic}
                  onBoldChange={(v) => updateStyle('headerBold', v)}
                  onItalicChange={(v) => updateStyle('headerItalic', v)}
                  t={t}
                />
                <FontSizeSelector label={tr.headerFontSize ?? (t?.editor?.headerFontSize ?? 'Überschriften-Größe')} value={style.headerFontSize} onChange={(v) => updateStyle('headerFontSize', v)} />
                <FontSelector label={tr.bodyFont} value={style.bodyFont} onChange={(v) => updateStyle('bodyFont', v)} options={FONT_OPTIONS} />
                <TextStyleButtons
                  label={tr.bodyStyle}
                  isBold={style.bodyBold}
                  isItalic={style.bodyItalic}
                  onBoldChange={(v) => updateStyle('bodyBold', v)}
                  onItalicChange={(v) => updateStyle('bodyItalic', v)}
                  t={t}
                />
                <FontSizeSelector label={tr.bodyFontSize ?? (t?.editor?.bodyFontSize ?? 'Text-Größe')} value={style.bodyFontSize} onChange={(v) => updateStyle('bodyFontSize', v)} />
              </div>
            </section>

            <hr className="border-gray-200 dark:border-gray-700" />

            {/* Visibility */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {tr.visibility}
              </h3>
              <div className="space-y-0.5 bg-gray-50 dark:bg-gray-900/50 rounded-lg p-1.5">
                {sections.map((section) => (
                  <SectionToggle
                    key={section.id}
                    id={section.id}
                    label={section.label}
                    isHidden={style.hiddenSections?.includes(section.id)}
                    onToggle={toggleSection}
                    required={section.required}
                    t={t}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Reset */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <button 
              onClick={handleReset}
              className="w-full py-2 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 text-sm hover:border-red-400 hover:text-red-500 transition-all flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
              {tr.reset}
            </button>
          </div>
        </aside>

        {/* Preview */}
        <main className="flex-1 bg-gray-200 dark:bg-gray-900 relative flex flex-col">
          {/* Zoom */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur rounded-full shadow border border-gray-200 dark:border-gray-700 p-1 flex items-center gap-1">
            <button 
              onClick={() => setZoom(z => Math.max(30, z - 10))}
              className="size-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-lg">remove</span>
            </button>
            <span className="text-xs font-mono text-gray-500 w-10 text-center">{zoom}%</span>
            <button 
              onClick={() => setZoom(z => Math.min(100, z + 10))}
              className="size-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              <span className="material-symbols-outlined text-lg">add</span>
            </button>
          </div>

          {/* Document */}
          <div 
            className="flex-1 overflow-auto p-6 flex justify-center items-start"
            style={{
              backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          >
            <div 
              className="shadow-2xl origin-top transition-transform"
              style={{ transform: `scale(${zoom / 100})` }}
            >
              <SwissDocument
                data={{
                  ...data,
                  customDesign: {
                    isEdited: true,
                    primaryColor: style.headerColor,
                    secondaryColor: style.accentColor,
                    backgroundColor: style.backgroundColor,
                    textColor: style.textColor,
                    headerFont: style.headerFont,
                    bodyFont: style.bodyFont,
                    headerFontSize: style.headerFontSize,
                    bodyFontSize: style.bodyFontSize,
                    headerBold: style.headerBold,
                    headerItalic: style.headerItalic,
                    bodyBold: style.bodyBold,
                    bodyItalic: style.bodyItalic,
                    hiddenSections: style.hiddenSections,
                  }
                }}
                t={t}
                templateType={selectedTemplate || 'classic'}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DocumentEditor;
