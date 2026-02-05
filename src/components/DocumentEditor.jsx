import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Palette,
  X,
  Settings,
  Undo2,
  Check,
  ChevronLeft,
  ChevronRight,
  Move,
  Type,
  Image as ImageIcon,
  User,
  FileText,
  Shield,
  Phone,
  PawPrint,
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Layout,
} from 'lucide-react';
import { SECTION_DEFINITIONS, COLOR_PRESETS, INITIAL_DATA } from '../constants';

// Section components for rendering
import PetPhoto from './document/PetPhoto';
import OwnerInfo from './document/OwnerInfo';
import PetDetails from './document/PetDetails';
import BehaviorSection from './document/BehaviorSection';
import DescriptionSection from './document/DescriptionSection';
import LegalSection from './document/LegalSection';
import ReferenceSection from './document/ReferenceSection';

// Section component mapping
const SECTION_COMPONENTS = {
  photo: PetPhoto,
  owner: OwnerInfo,
  details: PetDetails,
  behavior: BehaviorSection,
  description: DescriptionSection,
  legal: LegalSection,
  reference: ReferenceSection,
};

// Section icons mapping
const SECTION_ICONS = {
  photo: ImageIcon,
  owner: User,
  details: PawPrint,
  behavior: Settings,
  description: FileText,
  legal: Shield,
  reference: Phone,
};

// Sortable Section Item
const SortableSection = ({ 
  id, 
  section, 
  data, 
  t, 
  isSelected, 
  isHidden,
  onSelect, 
  onToggleVisibility,
  customColors,
  darkMode 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : isHidden ? 0.4 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  const SectionComponent = SECTION_COMPONENTS[id];
  const SectionIcon = SECTION_ICONS[id];

  if (!SectionComponent) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${isDragging ? 'shadow-2xl scale-[1.02]' : ''}
        ${isHidden ? 'grayscale' : ''}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* Section Controls - visible on hover/select */}
      <div className={`
        absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20
        transition-opacity duration-200
        ${isSelected || isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
      `}>
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical size={16} className="text-gray-500" />
        </button>

        {/* Toggle Visibility */}
        {!section.required && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(id);
            }}
            className={`p-2 rounded-lg shadow-lg border transition-colors ${
              isHidden 
                ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 hover:bg-red-100'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
            title={isHidden ? 'Show section' : 'Hide section'}
          >
            {isHidden ? (
              <EyeOff size={16} className="text-red-500" />
            ) : (
              <Eye size={16} className="text-gray-500" />
            )}
          </button>
        )}
      </div>

      {/* Section Label Badge */}
      <div className={`
        absolute -top-3 left-4 px-2 py-0.5 rounded-full text-xs font-medium z-10
        flex items-center gap-1 transition-opacity duration-200
        ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        ${section.required ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}
      `}>
        {SectionIcon && <SectionIcon size={12} />}
        {section.label}
        {section.required && <span className="text-red-500">*</span>}
      </div>

      {/* Hidden Overlay */}
      {isHidden && (
        <div className="absolute inset-0 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
          <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
            <EyeOff size={16} />
            Ausgeblendet
          </span>
        </div>
      )}

      {/* Actual Section Content */}
      <div className={`
        rounded-lg overflow-hidden border-2 transition-colors duration-200
        ${isSelected ? 'border-blue-400' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-600'}
      `}>
        <SectionComponent
          data={data}
          t={t}
          variant="custom"
          customColors={customColors}
          photo={data.photo}
          petType={data.petType}
          text={data.generatedText}
        />
      </div>
    </div>
  );
};

// Color Picker Panel
const ColorPickerPanel = ({ 
  primaryColor, 
  secondaryColor, 
  onPrimaryChange, 
  onSecondaryChange,
  onPresetSelect,
  darkMode,
  t
}) => {
  return (
    <div className="p-4 space-y-4">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Palette size={16} />
        {t?.builder?.colorScheme ?? 'Farbschema'}
      </h4>
      
      {/* Presets */}
      <div className="space-y-2">
        <label className="text-xs text-gray-500 dark:text-gray-400">Presets</label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onPresetSelect(preset)}
              className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
              style={{ backgroundColor: preset.primary }}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {t?.builder?.primaryColor ?? 'Akzentfarbe'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => onPrimaryChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => onPrimaryChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-500 dark:text-gray-400">
            {t?.builder?.secondaryColor ?? 'Hintergrund'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => onSecondaryChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => onSecondaryChange(e.target.value)}
              className="flex-1 px-2 py-1 text-xs font-mono border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Document Editor Component
const DocumentEditor = ({ 
  data, 
  updateData, 
  t, 
  darkMode, 
  onClose, 
  onApply,
  selectedTemplate 
}) => {
  // Get custom design from data or use defaults
  const customDesign = data.customDesign || INITIAL_DATA.customDesign;
  
  // Local state for editing
  const [layoutOrder, setLayoutOrder] = useState(customDesign.layoutOrder);
  const [hiddenSections, setHiddenSections] = useState(customDesign.hiddenSections || []);
  const [primaryColor, setPrimaryColor] = useState(customDesign.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(customDesign.secondaryColor);
  const [accentStyle, setAccentStyle] = useState(customDesign.accentStyle || 'modern');
  
  // UI state
  const [selectedSection, setSelectedSection] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [showColorPanel, setShowColorPanel] = useState(true);
  const [zoom, setZoom] = useState(0.6);
  const [hasChanges, setHasChanges] = useState(false);
  
  // History for undo
  const [history, setHistory] = useState([]);
  const canUndo = history.length > 0;

  const editorRef = useRef(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Save state to history before changes
  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev.slice(-19), {
      layoutOrder: [...layoutOrder],
      hiddenSections: [...hiddenSections],
      primaryColor,
      secondaryColor,
      accentStyle
    }]);
  }, [layoutOrder, hiddenSections, primaryColor, secondaryColor, accentStyle]);

  // Undo last change
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    
    const lastState = history[history.length - 1];
    setLayoutOrder(lastState.layoutOrder);
    setHiddenSections(lastState.hiddenSections);
    setPrimaryColor(lastState.primaryColor);
    setSecondaryColor(lastState.secondaryColor);
    setAccentStyle(lastState.accentStyle);
    setHistory(prev => prev.slice(0, -1));
  }, [history]);

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    setSelectedSection(event.active.id);
    saveToHistory();
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLayoutOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }

    setActiveId(null);
  };

  // Toggle section visibility
  const handleToggleVisibility = useCallback((sectionId) => {
    saveToHistory();
    setHiddenSections(prev => {
      if (prev.includes(sectionId)) {
        return prev.filter(id => id !== sectionId);
      } else {
        return [...prev, sectionId];
      }
    });
    setHasChanges(true);
  }, [saveToHistory]);

  // Handle color changes
  const handlePrimaryColorChange = useCallback((color) => {
    saveToHistory();
    setPrimaryColor(color);
    setHasChanges(true);
  }, [saveToHistory]);

  const handleSecondaryColorChange = useCallback((color) => {
    saveToHistory();
    setSecondaryColor(color);
    setHasChanges(true);
  }, [saveToHistory]);

  const handlePresetSelect = useCallback((preset) => {
    saveToHistory();
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setHasChanges(true);
  }, [saveToHistory]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    saveToHistory();
    setLayoutOrder(INITIAL_DATA.customDesign.layoutOrder);
    setHiddenSections([]);
    setPrimaryColor(INITIAL_DATA.customDesign.primaryColor);
    setSecondaryColor(INITIAL_DATA.customDesign.secondaryColor);
    setAccentStyle(INITIAL_DATA.customDesign.accentStyle);
    setHasChanges(true);
  }, [saveToHistory]);

  // Apply changes
  const handleApply = useCallback(() => {
    const newCustomDesign = {
      ...customDesign,
      isEdited: true, // Mark as edited so it's always applied
      layoutOrder,
      hiddenSections,
      primaryColor,
      secondaryColor,
      accentStyle,
    };
    
    updateData('customDesign', newCustomDesign);
    setHasChanges(false);
    
    if (onApply) {
      onApply(newCustomDesign);
    }
  }, [customDesign, layoutOrder, hiddenSections, primaryColor, secondaryColor, accentStyle, updateData, onApply]);

  // Click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (editorRef.current && !editorRef.current.contains(e.target)) {
        setSelectedSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get section definitions with translated labels
  const sections = useMemo(() => {
    return SECTION_DEFINITIONS.map(section => ({
      ...section,
      label: t?.builder?.sections?.[section.id] ?? section.label
    }));
  }, [t]);

  // Custom colors for preview
  const customColors = useMemo(() => ({
    primary: primaryColor,
    secondary: secondaryColor,
    accentStyle
  }), [primaryColor, secondaryColor, accentStyle]);

  // Sidebar sections (left column in document)
  const SIDEBAR_SECTION_IDS = ['photo', 'owner', 'behavior'];
  const MAIN_SECTION_IDS = ['details', 'description', 'legal', 'reference'];

  // Filter and sort sections for each column
  const sidebarSections = useMemo(() => {
    return layoutOrder.filter(id => SIDEBAR_SECTION_IDS.includes(id));
  }, [layoutOrder]);

  const mainSections = useMemo(() => {
    return layoutOrder.filter(id => MAIN_SECTION_IDS.includes(id));
  }, [layoutOrder]);

  return (
    <div className="fixed inset-0 z-50 bg-gray-100 dark:bg-gray-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Schließen"
          >
            <X size={20} />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
          
          {/* Title */}
          <div className="flex items-center gap-2">
            <Layout size={20} className="text-primary" />
            <span className="font-semibold">
              {t?.builder?.title ?? 'Template Builder'}
            </span>
          </div>
        </div>

        {/* Center - Zoom Controls */}
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setZoom(z => Math.max(0.3, z - 0.1))}
            className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
            disabled={zoom <= 0.3}
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-sm font-medium w-14 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(z => Math.min(1, z + 0.1))}
            className="p-1.5 hover:bg-white dark:hover:bg-gray-600 rounded transition-colors"
            disabled={zoom >= 1}
          >
            <ZoomIn size={16} />
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-2 rounded-lg transition-colors ${
              canUndo 
                ? 'hover:bg-gray-100 dark:hover:bg-gray-700' 
                : 'opacity-40 cursor-not-allowed'
            }`}
            title="Rückgängig"
          >
            <Undo2 size={18} />
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Zurücksetzen"
          >
            <RotateCcw size={18} />
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Toggle Color Panel */}
          <button
            onClick={() => setShowColorPanel(!showColorPanel)}
            className={`p-2 rounded-lg transition-colors ${
              showColorPanel ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title="Farbeinstellungen"
          >
            <Palette size={18} />
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
              hasChanges 
                ? 'bg-primary text-white hover:bg-primary/90' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}
          >
            <Check size={18} />
            {t?.builder?.apply ?? 'Anwenden'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Section List */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-sm mb-1">
              {t?.builder?.sectionOrder ?? 'Sektionen'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t?.builder?.dragHint ?? 'Ziehen Sie Sektionen zum Neuanordnen'}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={layoutOrder}
                strategy={verticalListSortingStrategy}
              >
                {layoutOrder.map((sectionId) => {
                  const section = sections.find(s => s.id === sectionId);
                  const SectionIcon = SECTION_ICONS[sectionId];
                  const isHidden = hiddenSections.includes(sectionId);
                  
                  return (
                    <SortableSectionItem
                      key={sectionId}
                      id={sectionId}
                      section={section}
                      Icon={SectionIcon}
                      isHidden={isHidden}
                      isSelected={selectedSection === sectionId}
                      onToggleVisibility={handleToggleVisibility}
                      onSelect={setSelectedSection}
                    />
                  );
                })}
              </SortableContext>
            </DndContext>
          </div>

          {/* Style Selection */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium mb-2">
              {t?.builder?.style ?? 'Stil'}
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {['classic', 'modern', 'minimal'].map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    saveToHistory();
                    setAccentStyle(style);
                    setHasChanges(true);
                  }}
                  className={`px-2 py-1.5 text-xs rounded-lg border-2 transition-all ${
                    accentStyle === style
                      ? 'border-primary bg-primary/10 text-primary font-medium'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t?.builder?.styles?.[style] ?? style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={editorRef}
          className="flex-1 overflow-auto bg-gray-200 dark:bg-gray-900 p-8"
          onClick={() => setSelectedSection(null)}
        >
          <div 
            className="mx-auto transition-transform duration-200"
            style={{
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Document Container */}
            <div 
              className="bg-white shadow-2xl rounded-sm overflow-hidden"
              style={{
                '--custom-primary': primaryColor,
                '--custom-secondary': secondaryColor,
              }}
            >
              {/* Document Header */}
              <div 
                className="px-8 py-4 border-b-2 flex items-center justify-between"
                style={{ borderBottomColor: primaryColor }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    🐾
                  </div>
                  <div>
                    <h1 className="font-bold text-lg" style={{ color: primaryColor }}>
                      {t?.doc?.title ?? 'Tier-Referenzblatt'}
                    </h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {t?.doc?.subtitle ?? 'Beilage zum Mietantrag'}
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('de-CH')}
                </div>
              </div>

              {/* Document Content */}
              <div className="p-6 flex gap-6">
                {/* Sidebar Column */}
                <div className="w-[35%] space-y-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={layoutOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      {sidebarSections.map((sectionId) => {
                        const section = sections.find(s => s.id === sectionId);
                        if (!section) return null;
                        const isHidden = hiddenSections.includes(sectionId);

                        return (
                          <SortableSection
                            key={sectionId}
                            id={sectionId}
                            section={section}
                            data={data}
                            t={t}
                            isSelected={selectedSection === sectionId}
                            isHidden={isHidden}
                            onSelect={setSelectedSection}
                            onToggleVisibility={handleToggleVisibility}
                            customColors={customColors}
                            darkMode={darkMode}
                          />
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Main Column */}
                <div className="flex-1 space-y-4">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={layoutOrder}
                      strategy={verticalListSortingStrategy}
                    >
                      {mainSections.map((sectionId) => {
                        const section = sections.find(s => s.id === sectionId);
                        if (!section) return null;
                        const isHidden = hiddenSections.includes(sectionId);

                        return (
                          <SortableSection
                            key={sectionId}
                            id={sectionId}
                            section={section}
                            data={data}
                            t={t}
                            isSelected={selectedSection === sectionId}
                            isHidden={isHidden}
                            onSelect={setSelectedSection}
                            onToggleVisibility={handleToggleVisibility}
                            customColors={customColors}
                            darkMode={darkMode}
                          />
                        );
                      })}
                    </SortableContext>
                  </DndContext>
                </div>
              </div>

              {/* Document Footer */}
              <div 
                className="px-8 py-4 border-t mt-4 flex justify-between items-center"
                style={{ borderTopColor: primaryColor }}
              >
                <span className="text-xs text-gray-400">
                  {t?.doc?.footer ?? 'Generiert via Pet-Bewerbung.ch'}
                </span>
                <div className="flex gap-8 text-xs text-gray-500">
                  <div>
                    <span className="text-gray-400">{t?.doc?.date ?? 'Ort, Datum'}:</span>
                    <span className="ml-2">_________________</span>
                  </div>
                  <div>
                    <span className="text-gray-400">{t?.doc?.sign ?? 'Unterschrift'}:</span>
                    <span className="ml-2">_________________</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Color Settings */}
        {showColorPanel && (
          <div className="w-72 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <ColorPickerPanel
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
              onPrimaryChange={handlePrimaryColorChange}
              onSecondaryChange={handleSecondaryColorChange}
              onPresetSelect={handlePresetSelect}
              darkMode={darkMode}
              t={t}
            />

            {/* Preview of selected colors */}
            <div className="px-4 pb-4">
              <div 
                className="rounded-lg p-4 border-2"
                style={{ 
                  backgroundColor: secondaryColor,
                  borderColor: primaryColor 
                }}
              >
                <div 
                  className="font-bold text-sm mb-1"
                  style={{ color: primaryColor }}
                >
                  Farbvorschau
                </div>
                <div className="text-xs" style={{ color: primaryColor + '99' }}>
                  So werden Ihre Farben im Dokument aussehen.
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                💡 Tipps
              </h4>
              <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1.5">
                <li>• Klicken Sie auf eine Sektion, um sie auszuwählen</li>
                <li>• Ziehen Sie Sektionen in der linken Liste neu</li>
                <li>• Blenden Sie optionale Sektionen aus</li>
                <li>• Verwenden Sie professionelle Farben</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Sortable Section Item for the sidebar list
const SortableSectionItem = ({ 
  id, 
  section, 
  Icon, 
  isHidden, 
  isSelected, 
  onToggleVisibility,
  onSelect 
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 p-2 rounded-lg border-2 transition-all cursor-pointer
        ${isDragging ? 'shadow-lg' : ''}
        ${isSelected 
          ? 'border-primary bg-primary/5' 
          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
        }
        ${isHidden ? 'opacity-50' : ''}
      `}
      onClick={() => onSelect(id)}
    >
      <button
        {...attributes}
        {...listeners}
        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={14} className="text-gray-400" />
      </button>
      
      {Icon && <Icon size={16} className={isHidden ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'} />}
      
      <span className={`flex-1 text-sm ${isHidden ? 'line-through text-gray-400' : ''}`}>
        {section?.label ?? id}
      </span>

      {section?.required && (
        <span className="text-xs text-red-500 font-medium">*</span>
      )}

      {!section?.required && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(id);
          }}
          className={`p-1 rounded transition-colors ${
            isHidden ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
};

export default DocumentEditor;
