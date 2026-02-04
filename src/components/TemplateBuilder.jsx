import React, { useState, useCallback } from 'react';
import { X, GripVertical, ChevronUp, ChevronDown, Eye, EyeOff, Palette, RotateCcw } from 'lucide-react';
import { SECTION_DEFINITIONS, COLOR_PRESETS, INITIAL_DATA } from '../constants';

/**
 * TemplateBuilder - Premium feature for customizing document layout
 * Allows reordering sections and changing color scheme
 */
const TemplateBuilder = ({ 
  data, 
  updateData, 
  t, 
  darkMode, 
  onClose,
  onApply 
}) => {
  const customDesign = data.customDesign || INITIAL_DATA.customDesign;
  
  // Local state for editing
  const [layoutOrder, setLayoutOrder] = useState(customDesign.layoutOrder || SECTION_DEFINITIONS.map(s => s.id));
  const [hiddenSections, setHiddenSections] = useState(customDesign.hiddenSections || []);
  const [primaryColor, setPrimaryColor] = useState(customDesign.primaryColor || '#b39ddb');
  const [secondaryColor, setSecondaryColor] = useState(customDesign.secondaryColor || '#f5f5f5');
  const [accentStyle, setAccentStyle] = useState(customDesign.accentStyle || 'modern');
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);
  
  const titleCl = darkMode ? 'text-white' : 'text-gray-900';
  const mutedCl = darkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const sectionBg = darkMode ? 'bg-gray-700' : 'bg-gray-50';
  const borderCl = darkMode ? 'border-gray-600' : 'border-gray-200';
  
  // Move section up
  const moveUp = useCallback((index) => {
    if (index <= 0) return;
    const newOrder = [...layoutOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setLayoutOrder(newOrder);
  }, [layoutOrder]);
  
  // Move section down
  const moveDown = useCallback((index) => {
    if (index >= layoutOrder.length - 1) return;
    const newOrder = [...layoutOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setLayoutOrder(newOrder);
  }, [layoutOrder]);
  
  // Toggle section visibility
  const toggleVisibility = useCallback((sectionId) => {
    const section = SECTION_DEFINITIONS.find(s => s.id === sectionId);
    if (section?.required) return; // Can't hide required sections
    
    setHiddenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);
  
  // Drag handlers
  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, index) => {
    e.preventDefault();
    setDragOverItem(index);
  };
  
  const handleDrop = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }
    
    const newOrder = [...layoutOrder];
    const [removed] = newOrder.splice(draggedItem, 1);
    newOrder.splice(index, 0, removed);
    setLayoutOrder(newOrder);
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };
  
  // Apply color preset
  const applyPreset = (preset) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
  };
  
  // Reset to defaults
  const resetToDefaults = () => {
    setLayoutOrder(SECTION_DEFINITIONS.map(s => s.id));
    setHiddenSections([]);
    setPrimaryColor('#b39ddb');
    setSecondaryColor('#f5f5f5');
    setAccentStyle('modern');
  };
  
  // Apply changes
  const handleApply = () => {
    const newCustomDesign = {
      ...customDesign,
      layoutOrder,
      hiddenSections,
      primaryColor,
      secondaryColor,
      accentStyle
    };
    updateData('customDesign', newCustomDesign);
    onApply?.();
  };
  
  // Get section label
  const getSectionLabel = (sectionId) => {
    const section = SECTION_DEFINITIONS.find(s => s.id === sectionId);
    // Try translation first, fallback to definition
    return t?.builder?.sections?.[sectionId] || section?.label || sectionId;
  };
  
  // Get section icon
  const getSectionIcon = (sectionId) => {
    const section = SECTION_DEFINITIONS.find(s => s.id === sectionId);
    return section?.icon || 'article';
  };
  
  // Check if section is required
  const isRequired = (sectionId) => {
    const section = SECTION_DEFINITIONS.find(s => s.id === sectionId);
    return section?.required || false;
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl ${cardBg} shadow-2xl`}>
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${borderCl} ${cardBg}`}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Palette size={20} className="text-purple-500" />
            </div>
            <div>
              <h2 className={`font-display font-bold text-xl ${titleCl}`}>
                {t?.builder?.title ?? 'Template-Konstruktor'}
              </h2>
              <p className={`text-sm ${mutedCl}`}>
                {t?.builder?.subtitle ?? 'Passen Sie Ihr Dokument an'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <X size={20} className={mutedCl} />
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="overflow-y-auto p-4 space-y-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          
          {/* Color Section */}
          <div>
            <h3 className={`font-display font-bold text-lg mb-3 flex items-center gap-2 ${titleCl}`}>
              <Palette size={18} />
              {t?.builder?.colorScheme ?? 'Farbschema'}
            </h3>
            
            {/* Color Presets */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {COLOR_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-3 rounded-xl border-2 transition-all hover:scale-105 ${
                    primaryColor === preset.primary 
                      ? 'border-purple-500 ring-2 ring-purple-500/30' 
                      : `${borderCl} hover:border-gray-400`
                  }`}
                  style={{ background: `linear-gradient(135deg, ${preset.primary} 50%, ${preset.secondary} 50%)` }}
                  title={preset.label}
                >
                  <span className="sr-only">{preset.label}</span>
                </button>
              ))}
            </div>
            
            {/* Custom Color Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${mutedCl}`}>
                  {t?.builder?.primaryColor ?? 'Akzentfarbe'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${borderCl} ${sectionBg} ${titleCl} text-sm font-mono`}
                  />
                </div>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${mutedCl}`}>
                  {t?.builder?.secondaryColor ?? 'Hintergrundfarbe'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-300"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-lg border ${borderCl} ${sectionBg} ${titleCl} text-sm font-mono`}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Sections Reorder */}
          <div>
            <h3 className={`font-display font-bold text-lg mb-3 flex items-center gap-2 ${titleCl}`}>
              <GripVertical size={18} />
              {t?.builder?.sectionOrder ?? 'Block-Reihenfolge'}
            </h3>
            <p className={`text-sm mb-4 ${mutedCl}`}>
              {t?.builder?.dragHint ?? 'Ziehen Sie die Blöcke, um die Reihenfolge zu ändern'}
            </p>
            
            <div className="space-y-2">
              {layoutOrder.map((sectionId, index) => {
                const isHidden = hiddenSections.includes(sectionId);
                const required = isRequired(sectionId);
                const isDragging = draggedItem === index;
                const isDragOver = dragOverItem === index;
                
                return (
                  <div
                    key={sectionId}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-move
                      ${isDragging ? 'opacity-50 scale-95' : ''}
                      ${isDragOver ? 'border-purple-500 bg-purple-500/10' : borderCl}
                      ${isHidden ? 'opacity-50' : ''}
                      ${sectionBg}
                    `}
                  >
                    {/* Drag Handle */}
                    <GripVertical size={18} className={mutedCl} />
                    
                    {/* Section Icon & Label */}
                    <div className="flex items-center gap-2 flex-1">
                      <span className={`material-symbols-outlined text-lg ${isHidden ? mutedCl : 'text-purple-500'}`}>
                        {getSectionIcon(sectionId)}
                      </span>
                      <span className={`font-medium ${isHidden ? mutedCl : titleCl}`}>
                        {getSectionLabel(sectionId)}
                      </span>
                      {required && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-medium">
                          {t?.builder?.required ?? 'Pflicht'}
                        </span>
                      )}
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {/* Move Up */}
                      <button
                        onClick={() => moveUp(index)}
                        disabled={index === 0}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        title="Nach oben"
                      >
                        <ChevronUp size={16} className={mutedCl} />
                      </button>
                      
                      {/* Move Down */}
                      <button
                        onClick={() => moveDown(index)}
                        disabled={index === layoutOrder.length - 1}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                        title="Nach unten"
                      >
                        <ChevronDown size={16} className={mutedCl} />
                      </button>
                      
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => toggleVisibility(sectionId)}
                        disabled={required}
                        className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                          isHidden 
                            ? 'bg-red-500/20 text-red-500' 
                            : darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                        }`}
                        title={isHidden ? 'Einblenden' : 'Ausblenden'}
                      >
                        {isHidden ? <EyeOff size={16} /> : <Eye size={16} className={mutedCl} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Style Options */}
          <div>
            <h3 className={`font-display font-bold text-lg mb-3 ${titleCl}`}>
              {t?.builder?.style ?? 'Stil'}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['classic', 'modern', 'minimal'].map(style => (
                <button
                  key={style}
                  onClick={() => setAccentStyle(style)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    accentStyle === style 
                      ? 'border-purple-500 bg-purple-500/10' 
                      : `${borderCl} hover:border-gray-400`
                  }`}
                >
                  <span className={`block font-medium capitalize ${titleCl}`}>
                    {t?.builder?.styles?.[style] ?? style}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className={`sticky bottom-0 flex items-center justify-between gap-3 p-4 border-t ${borderCl} ${cardBg}`}>
          <button
            onClick={resetToDefaults}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${borderCl} ${mutedCl} hover:border-gray-400 transition-colors`}
          >
            <RotateCcw size={16} />
            {t?.builder?.reset ?? 'Zurücksetzen'}
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl border-2 ${borderCl} ${titleCl} hover:border-gray-400 transition-colors`}
            >
              {t?.ui?.cancel ?? 'Abbrechen'}
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-xl border-2 border-purple-500 bg-purple-500 text-white font-bold hover:bg-purple-600 transition-colors"
            >
              {t?.builder?.apply ?? 'Anwenden'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateBuilder;
