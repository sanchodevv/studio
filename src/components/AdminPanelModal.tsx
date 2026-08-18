import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Edit3, Settings, HelpCircle, HardDrive } from 'lucide-react';
import type { Project } from './Portfolio';
import './AdminPanelModal.css';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  onSave: (updatedData: any) => void;
}

const AdminPanelModal: React.FC<AdminPanelModalProps> = ({ isOpen, onClose, data, onSave }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'general' | 'services' | 'portfolio' | 'gear'>('general');
  const [formData, setFormData] = useState<any>(JSON.parse(JSON.stringify(data))); // deep copy

  // Portfolio Form State (for adding/editing a project)
  const [editingProjectIdx, setEditingProjectIdx] = useState<number | null>(null); // null means adding a new one
  const [projectForm, setProjectForm] = useState<Partial<Project>>({
    id: '',
    title: '',
    category: 'wedding',
    categoryLabel: "To'y marosimi",
    duration: '03:00',
    cameras: 'Sony FX3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-in-a-forest-41617-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)',
    date: 'Avgust 2026'
  });

  // Services Select State (to choose which of the 4 services is being edited)
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number>(0);

  // Gear Select State (to choose which category and item is being edited)
  const [selectedGearCat, setSelectedGearCat] = useState<'camera' | 'drone' | 'gimbal'>('camera');
  const [selectedGearIdx, setSelectedGearIdx] = useState<number>(0);

  // Gradient presets for new project cards
  const gradientPresets = [
    { value: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)', label: 'Pushti / Qizil' },
    { value: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', label: 'Havorang / Ko\'k' },
    { value: 'linear-gradient(135deg, #b927fc 0%, #e207b1 100%)', label: 'Binafsha / Magenta' },
    { value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', label: 'Yashil / Zumrad' },
    { value: 'linear-gradient(135deg, #ffb199 0%, #ff0844 100%)', label: 'Alvon / Qizil' },
    { value: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)', label: 'Sariq / Oltin' }
  ];

  const handleGeneralChange = (field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSaveAll = () => {
    onSave(formData);
    onClose();
  };

  // Service Edit helper
  const handleServiceFieldChange = (field: string, val: any) => {
    const updatedServices = [...formData.services];
    updatedServices[selectedServiceIdx] = {
      ...updatedServices[selectedServiceIdx],
      [field]: val
    };
    setFormData((prev: any) => ({ ...prev, services: updatedServices }));
  };

  const handleServiceDetailChange = (detailIdx: number, val: string) => {
    const updatedServices = [...formData.services];
    const details = [...updatedServices[selectedServiceIdx].details];
    details[detailIdx] = val;
    updatedServices[selectedServiceIdx].details = details;
    setFormData((prev: any) => ({ ...prev, services: updatedServices }));
  };

  // Portfolio Management helpers
  const handleProjectFormChange = (field: keyof Project, val: any) => {
    setProjectForm(prev => {
      const updated = { ...prev, [field]: val };
      
      // Auto-label category depending on choice
      if (field === 'category') {
        if (val === 'wedding') updated.categoryLabel = "To'y marosimi";
        else if (val === 'commercial') updated.categoryLabel = "Reklama / Tijoriy";
        else if (val === 'music') updated.categoryLabel = "Musiqiy Klip";
        else if (val === 'drone') updated.categoryLabel = "FPV Dron / Aerotasvir";
      }
      return updated;
    });
  };

  const handleAddOrUpdateProject = () => {
    const projects = [...formData.portfolio];
    
    if (editingProjectIdx !== null) {
      // Edit existing
      projects[editingProjectIdx] = {
        ...projects[editingProjectIdx],
        ...projectForm
      } as Project;
    } else {
      // Add new
      const newProj = {
        ...projectForm,
        id: 'proj-' + Date.now()
      } as Project;
      projects.push(newProj);
    }

    setFormData((prev: any) => ({ ...prev, portfolio: projects }));
    
    // Reset Project Form
    setEditingProjectIdx(null);
    setProjectForm({
      id: '',
      title: '',
      category: 'wedding',
      categoryLabel: "To'y marosimi",
      duration: '03:00',
      cameras: 'Sony FX3',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-in-a-forest-41617-large.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      bgGradient: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)',
      date: 'Avgust 2026'
    });
  };

  const handleEditProjectClick = (idx: number) => {
    setEditingProjectIdx(idx);
    setProjectForm(formData.portfolio[idx]);
  };

  const handleDeleteProject = (idx: number) => {
    if (window.confirm("Rostdan ham ushbu ishni portfoliodan o'chirmoqchimisiz?")) {
      const projects = formData.portfolio.filter((_: any, i: number) => i !== idx);
      setFormData((prev: any) => ({ ...prev, portfolio: projects }));
      if (editingProjectIdx === idx) {
        setEditingProjectIdx(null);
      }
    }
  };

  // Gear management helpers
  const handleGearFieldChange = (field: string, val: any) => {
    const updatedGear = { ...formData.gear };
    const items = [...updatedGear[selectedGearCat]];
    items[selectedGearIdx] = {
      ...items[selectedGearIdx],
      [field]: val
    };
    updatedGear[selectedGearCat] = items;
    setFormData((prev: any) => ({ ...prev, gear: updatedGear }));
  };

  const handleGearSpecChange = (specIdx: number, specField: 'label' | 'value' | 'percentage', val: any) => {
    const updatedGear = { ...formData.gear };
    const items = [...updatedGear[selectedGearCat]];
    const specs = [...items[selectedGearIdx].specs];
    specs[specIdx] = {
      ...specs[specIdx],
      [specField]: val
    };
    items[selectedGearIdx].specs = specs;
    updatedGear[selectedGearCat] = items;
    setFormData((prev: any) => ({ ...prev, gear: updatedGear }));
  };

  const handleGearFeatureChange = (featIdx: number, val: string) => {
    const updatedGear = { ...formData.gear };
    const items = [...updatedGear[selectedGearCat]];
    const features = [...items[selectedGearIdx].features];
    features[featIdx] = val;
    items[selectedGearIdx].features = features;
    updatedGear[selectedGearCat] = items;
    setFormData((prev: any) => ({ ...prev, gear: updatedGear }));
  };

  return (
    <div className="admin-panel-overlay">
      <div className="admin-panel-backdrop" onClick={onClose} />

      <div className="admin-panel-content glass-panel">
        {/* Top Header */}
        <div className="admin-panel-header">
          <div className="admin-header-title">
            <Settings size={18} className="text-cyan spinner-icon" />
            <h2>Boshqaruv Paneli (Admin Console)</h2>
          </div>
          <button className="admin-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Workspace Layout */}
        <div className="admin-panel-workspace">
          
          {/* Left Sidebar Menu */}
          <aside className="admin-sidebar">
            <button 
              className={`sidebar-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <HardDrive size={16} /> Asosiy & Telegram
            </button>
            <button 
              className={`sidebar-tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <HelpCircle size={16} /> Xizmatlar
            </button>
            <button 
              className={`sidebar-tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
              onClick={() => setActiveTab('portfolio')}
            >
              <Plus size={16} /> Partfolio
            </button>
            <button 
              className={`sidebar-tab-btn ${activeTab === 'gear' ? 'active' : ''}`}
              onClick={() => setActiveTab('gear')}
            >
              <Settings size={16} /> Texnikalar
            </button>
          </aside>

          {/* Right Editor Screen */}
          <main className="admin-editor-screen">
            
            {/* 1. GENERAL TAB */}
            {activeTab === 'general' && (
              <div className="editor-tab-pane">
                <h3 className="editor-pane-title">Asosiy Sozlamalar & Hero Matnlari</h3>
                
                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Hero Asosiy Sarlavha (Uzbek)</label>
                  <input 
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleGeneralChange('heroTitle', e.target.value)}
                    className="editor-input"
                  />
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Hero Tavsifi (Description)</label>
                  <textarea 
                    rows={4}
                    value={formData.heroDescription}
                    onChange={(e) => handleGeneralChange('heroDescription', e.target.value)}
                    className="editor-textarea"
                  />
                </div>

                <h4 className="editor-section-divider">Micro Statistika Ko'rsatkichlari</h4>
                <div className="editor-row-grid">
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Stat 1 Qiymat (e.g. 350+)</label>
                    <input 
                      type="text"
                      value={formData.stat1Val}
                      onChange={(e) => handleGeneralChange('stat1Val', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Stat 1 Tavsif (e.g. Baxtli Juftliklar)</label>
                    <input 
                      type="text"
                      value={formData.stat1Label}
                      onChange={(e) => handleGeneralChange('stat1Label', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>
                <div className="editor-row-grid">
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Stat 2 Qiymat (e.g. 4K UHD)</label>
                    <input 
                      type="text"
                      value={formData.stat2Val}
                      onChange={(e) => handleGeneralChange('stat2Val', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Stat 2 Tavsif (e.g. HDR Format)</label>
                    <input 
                      type="text"
                      value={formData.stat2Label}
                      onChange={(e) => handleGeneralChange('stat2Label', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>
                <div className="editor-row-grid">
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Stat 3 Qiymat (e.g. 8+ yil)</label>
                    <input 
                      type="text"
                      value={formData.stat3Val}
                      onChange={(e) => handleGeneralChange('stat3Val', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Stat 3 Tavsif (e.g. Tajriba)</label>
                    <input 
                      type="text"
                      value={formData.stat3Label}
                      onChange={(e) => handleGeneralChange('stat3Label', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>

                <h4 className="editor-section-divider">Telegram Bot Sozlamalari (Aloqa)</h4>
                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Telegram Bot Token</label>
                  <input 
                    type="text"
                    value={formData.telegramToken}
                    onChange={(e) => handleGeneralChange('telegramToken', e.target.value)}
                    className="editor-input monospace-font"
                  />
                </div>
                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Doimiy Telegram Chat ID (Ixtiyoriy)</label>
                  <input 
                    type="text"
                    value={formData.telegramChatId}
                    placeholder="Agar bo'sh qolsa, getUpdates orqali dinamik aniqlanadi"
                    onChange={(e) => handleGeneralChange('telegramChatId', e.target.value)}
                    className="editor-input monospace-font"
                  />
                  <span className="editor-help-text">
                    Agar botingizga har safar yuborishda getUpdates orqali ID qidirishini xohlamasangiz, Telegram Chat ID raqamingizni kiriting.
                  </span>
                </div>
              </div>
            )}

            {/* 2. SERVICES TAB */}
            {activeTab === 'services' && (
              <div className="editor-tab-pane">
                <h3 className="editor-pane-title">Xizmatlar yo'nalishlarini tahrirlash</h3>
                
                {/* Selector */}
                <div className="selector-tabs-row">
                  {formData.services.map((ser: any, idx: number) => (
                    <button
                      key={ser.id}
                      type="button"
                      className={`selector-tab-btn ${selectedServiceIdx === idx ? 'active' : ''}`}
                      onClick={() => setSelectedServiceIdx(idx)}
                    >
                      {ser.title}
                    </button>
                  ))}
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Xizmat Sarlavhasi</label>
                  <input 
                    type="text"
                    value={formData.services[selectedServiceIdx].title}
                    onChange={(e) => handleServiceFieldChange('title', e.target.value)}
                    className="editor-input"
                  />
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Xizmat Batafsil Tavsifi</label>
                  <textarea 
                    rows={4}
                    value={formData.services[selectedServiceIdx].description}
                    onChange={(e) => handleServiceFieldChange('description', e.target.value)}
                    className="editor-textarea"
                  />
                </div>

                <h4 className="editor-section-divider">Xizmat tarkibi (5 ta band):</h4>
                {formData.services[selectedServiceIdx].details.map((detail: string, i: number) => (
                  <div key={i} className="editor-field-wrapper">
                    <label className="editor-field-lbl">Band #{i+1}</label>
                    <input 
                      type="text"
                      value={detail}
                      onChange={(e) => handleServiceDetailChange(i, e.target.value)}
                      className="editor-input"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* 3. PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="editor-tab-pane">
                <h3 className="editor-pane-title">Partfolio Ishlari</h3>
                
                {/* List of current projects */}
                <div className="editor-projects-list-wrapper">
                  <label className="editor-field-lbl">Hozirgi ishlar ro'yxati</label>
                  <div className="editor-items-list-grid">
                    {formData.portfolio.map((proj: any, idx: number) => (
                      <div key={proj.id} className="editor-list-item glass-panel">
                        <div className="item-details">
                          <span className="item-cat-tag">{proj.categoryLabel}</span>
                          <span className="item-name-title">{proj.title}</span>
                        </div>
                        <div className="item-actions">
                          <button 
                            className="item-btn edit" 
                            title="Tahrirlash"
                            onClick={() => handleEditProjectClick(idx)}
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            className="item-btn delete" 
                            title="O'chirish"
                            onClick={() => handleDeleteProject(idx)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form to Add/Edit project */}
                <div className="editor-nested-form glass-panel">
                  <h4 className="nested-form-title">
                    {editingProjectIdx !== null ? "Loyihani Tahrirlash" : "Yangi Loyiha Qo'shish"}
                  </h4>
                  
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Loyiha sarlavhasi</label>
                    <input 
                      type="text"
                      value={projectForm.title || ''}
                      onChange={(e) => handleProjectFormChange('title', e.target.value)}
                      placeholder="Sardor & Dilnoza - Wedding Day"
                      className="editor-input"
                    />
                  </div>

                  <div className="editor-row-grid">
                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Kategoriya</label>
                      <select
                        value={projectForm.category || 'wedding'}
                        onChange={(e) => handleProjectFormChange('category', e.target.value as any)}
                        className="editor-select"
                      >
                        <option value="wedding">To'ylar va Love Story</option>
                        <option value="commercial">Reklama / Tijoriy</option>
                        <option value="music">Musiqiy Kliplar</option>
                        <option value="drone">FPV Dron / Aerotasvir</option>
                      </select>
                    </div>

                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Davomiyligi (min:sec)</label>
                      <input 
                        type="text"
                        value={projectForm.duration || ''}
                        onChange={(e) => handleProjectFormChange('duration', e.target.value)}
                        placeholder="03:45"
                        className="editor-input"
                      />
                    </div>
                  </div>

                  <div className="editor-row-grid">
                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Uskunalar (Kamera / Dronlar)</label>
                      <input 
                        type="text"
                        value={projectForm.cameras || ''}
                        onChange={(e) => handleProjectFormChange('cameras', e.target.value)}
                        placeholder="Sony FX3 + DJI FPV"
                        className="editor-input"
                      />
                    </div>

                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Tadbir oyi/yili</label>
                      <input 
                        type="text"
                        value={projectForm.date || ''}
                        onChange={(e) => handleProjectFormChange('date', e.target.value)}
                        placeholder="Avgust 2026"
                        className="editor-input"
                      />
                    </div>
                  </div>

                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Rasm / Thumbnail havolasi (Image URL)</label>
                    <input 
                      type="text"
                      value={projectForm.thumbnail || ''}
                      onChange={(e) => handleProjectFormChange('thumbnail', e.target.value)}
                      className="editor-input monospace-font"
                    />
                  </div>

                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Video havolasi (MP4 URL, Vimeo, YouTube)</label>
                    <input 
                      type="text"
                      value={projectForm.videoUrl || ''}
                      onChange={(e) => handleProjectFormChange('videoUrl', e.target.value)}
                      className="editor-input monospace-font"
                    />
                  </div>

                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Karta rangi (Gradiyent)</label>
                    <select
                      value={projectForm.bgGradient || ''}
                      onChange={(e) => handleProjectFormChange('bgGradient', e.target.value)}
                      className="editor-select"
                    >
                      {gradientPresets.map(preset => (
                        <option key={preset.value} value={preset.value}>{preset.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-action-buttons">
                    <button 
                      type="button" 
                      onClick={handleAddOrUpdateProject}
                      className="btn btn-secondary add-proj-btn"
                    >
                      {editingProjectIdx !== null ? "O'zgartirishni kiritish" : "Loyiha ro'yxatiga qo'shish"}
                    </button>
                    {editingProjectIdx !== null && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingProjectIdx(null);
                          setProjectForm({
                            id: '',
                            title: '',
                            category: 'wedding',
                            categoryLabel: "To'y marosimi",
                            duration: '03:00',
                            cameras: 'Sony FX3',
                            videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-in-a-forest-41617-large.mp4',
                            thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
                            bgGradient: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)',
                            date: 'Avgust 2026'
                          });
                        }}
                        className="btn btn-secondary cancel-edit-btn"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* 4. GEAR TAB */}
            {activeTab === 'gear' && (
              <div className="editor-tab-pane">
                <h3 className="editor-pane-title">Uskunalarni tahrirlash</h3>
                
                {/* Selector */}
                <div className="selector-tabs-row">
                  <button 
                    className={`selector-tab-btn ${selectedGearCat === 'camera' ? 'active' : ''}`}
                    onClick={() => { setSelectedGearCat('camera'); setSelectedGearIdx(0); }}
                  >
                    Kameralar
                  </button>
                  <button 
                    className={`selector-tab-btn ${selectedGearCat === 'drone' ? 'active' : ''}`}
                    onClick={() => { setSelectedGearCat('drone'); setSelectedGearIdx(0); }}
                  >
                    Dronlar
                  </button>
                  <button 
                    className={`selector-tab-btn ${selectedGearCat === 'gimbal' ? 'active' : ''}`}
                    onClick={() => { setSelectedGearCat('gimbal'); setSelectedGearIdx(0); }}
                  >
                    Stabilizator / Ovoz
                  </button>
                </div>

                {/* Sub-selector for gear item */}
                <div className="sub-selector-tabs-row">
                  {formData.gear[selectedGearCat].map((item: any, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      className={`sub-selector-tab-btn ${selectedGearIdx === idx ? 'active' : ''}`}
                      onClick={() => setSelectedGearIdx(idx)}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Uskuna nomi</label>
                  <input 
                    type="text"
                    value={formData.gear[selectedGearCat][selectedGearIdx].name}
                    onChange={(e) => handleGearFieldChange('name', e.target.value)}
                    className="editor-input"
                  />
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Uskuna turi (e.g. Flagman Cinema Kamera)</label>
                  <input 
                    type="text"
                    value={formData.gear[selectedGearCat][selectedGearIdx].type}
                    onChange={(e) => handleGearFieldChange('type', e.target.value)}
                    className="editor-input"
                  />
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Uskuna tavsifi</label>
                  <textarea 
                    rows={3}
                    value={formData.gear[selectedGearCat][selectedGearIdx].description}
                    onChange={(e) => handleGearFieldChange('description', e.target.value)}
                    className="editor-textarea"
                  />
                </div>

                <h4 className="editor-section-divider">Uskuna parametr ko'rsatkichlari (4 ta):</h4>
                {formData.gear[selectedGearCat][selectedGearIdx].specs.map((spec: any, i: number) => (
                  <div key={i} className="editor-spec-edit-box glass-panel">
                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Parametr #{i+1} Nomi</label>
                      <input 
                        type="text"
                        value={spec.label}
                        onChange={(e) => handleGearSpecChange(i, 'label', e.target.value)}
                        className="editor-input"
                      />
                    </div>
                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Qiymat</label>
                      <input 
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleGearSpecChange(i, 'value', e.target.value)}
                        className="editor-input"
                      />
                    </div>
                    <div className="editor-field-wrapper">
                      <div className="slider-label-row">
                        <label className="editor-field-lbl">Foiz ko'rsatkichi (Maks. bar)</label>
                        <span className="slider-value text-cyan">{spec.percentage}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="20"
                        max="100"
                        value={spec.percentage}
                        onChange={(e) => handleGearSpecChange(i, 'percentage', parseInt(e.target.value))}
                        className="calc-range-slider"
                      />
                    </div>
                  </div>
                ))}

                <h4 className="editor-section-divider">Kalta ustunlar (3 ta xususiyat):</h4>
                {formData.gear[selectedGearCat][selectedGearIdx].features.map((feat: string, i: number) => (
                  <div key={i} className="editor-field-wrapper">
                    <label className="editor-field-lbl">Xususiyat tag #{i+1}</label>
                    <input 
                      type="text"
                      value={feat}
                      onChange={(e) => handleGearFeatureChange(i, e.target.value)}
                      className="editor-input"
                    />
                  </div>
                ))}
              </div>
            )}

          </main>
        </div>

        {/* Bottom Save Action Panel */}
        <div className="admin-panel-footer">
          <span className="save-hint">* O'zgarishlar sayt xotirasida (LocalStorage) doimiy saqlanadi.</span>
          <button onClick={handleSaveAll} className="btn btn-primary admin-save-btn">
            <Save size={18} /> O'zgarishlarni Saqlash
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminPanelModal;
