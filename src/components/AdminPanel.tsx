import React, { useState } from 'react';
import { Save, Trash2, Edit3, Settings, HelpCircle, HardDrive, ArrowLeft, Info, Camera, Film, Send } from 'lucide-react';
import type { Project } from './Portfolio';
import './AdminPanel.css';

interface AdminPanelProps {
  data: any;
  onSave: (updatedData: any) => void;
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ data, onSave, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'stats' | 'services' | 'portfolio' | 'gear' | 'telegram'>('general');
  const [formData, setFormData] = useState<any>(JSON.parse(JSON.stringify(data))); // deep copy

  // Portfolio Form State (for adding/editing a project)
  const [editingProjectIdx, setEditingProjectIdx] = useState<number | null>(null);
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

  // Services Select State
  const [selectedServiceIdx, setSelectedServiceIdx] = useState<number>(0);

  // Gear Select State
  const [selectedGearCat, setSelectedGearCat] = useState<'camera' | 'drone' | 'gimbal'>('camera');
  const [selectedGearIdx, setSelectedGearIdx] = useState<number>(0);

  // Gradient presets for new project cards
  const gradientPresets = [
    { value: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)', label: 'Pushti / Qizil gradiyent' },
    { value: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', label: 'Havorang / Ko\'k gradiyent' },
    { value: 'linear-gradient(135deg, #b927fc 0%, #e207b1 100%)', label: 'Binafsha / Magenta gradiyent' },
    { value: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', label: 'Yashil / Zumrad gradiyent' },
    { value: 'linear-gradient(135deg, #ffb199 0%, #ff0844 100%)', label: 'Alvon / Qizil gradiyent' },
    { value: 'linear-gradient(135deg, #ffe259 0%, #ffa751 100%)', label: 'Sariq / Oltin gradiyent' }
  ];

  const handleGeneralChange = (field: string, val: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: val
    }));
  };

  const handleSaveAll = () => {
    onSave(formData);
    alert("O'zgarishlar tizim xotirasida muvaffaqiyatli saqlandi!");
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
      projects[editingProjectIdx] = {
        ...projects[editingProjectIdx],
        ...projectForm
      } as Project;
    } else {
      const newProj = {
        ...projectForm,
        id: 'proj-' + Date.now()
      } as Project;
      projects.push(newProj);
    }

    setFormData((prev: any) => ({ ...prev, portfolio: projects }));
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
      if (editingProjectIdx === idx) setEditingProjectIdx(null);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Rasm fayli juda katta! 10MB dan kichik rasm tanlashingizni tavsiya qilamiz.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      handleProjectFormChange('thumbnail', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 30 * 1024 * 1024) {
      alert("Diqqat! Video fayl hajmi biroz katta (30MB dan ko'p). Sayt tezroq yuklanishi va xotira to'lib qolmasligi uchun kichikroq o'lchamdagi yoki siqilgan MP4 video yuklashingizni maslahat beramiz.");
    }
    const reader = new FileReader();
    reader.onload = () => {
      handleProjectFormChange('videoUrl', reader.result as string);
    };
    reader.readAsDataURL(file);
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

  // Helper date function
  const getUzbekDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('uz-UZ', options);
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'general': return "Asosiy Matnlar sozlamalari";
      case 'stats': return "Statistika ko'rsatkichlari";
      case 'services': return "Xizmat turlarini tahrirlash";
      case 'portfolio': return "Portfoliodagi video ishlar";
      case 'gear': return "Uskunalar & Texnikalar";
      case 'telegram': return "Telegram Bot aloqa kanali";
      default: return "Boshqaruv paneli";
    }
  };

  return (
    <div className="admin-crm-container">
      
      {/* 1. LEFT SIDEBAR (ASIDE NAVIGATION) - MATCHES REFERENCE MOCKUP */}
      <aside className="crm-sidebar">
        
        {/* Sidebar Top Header Branding */}
        <div className="crm-sidebar-header">
          <div className="crm-logo-group">
            <Film className="crm-logo-icon text-cyan" size={24} />
            <div className="crm-logo-text">
              <h3>Jo'shqinbek</h3>
              <span>Studio CRM Tizimi</span>
            </div>
          </div>
          <button className="crm-back-btn" onClick={onLogout}>
            <ArrowLeft size={14} /> Qaytish
          </button>
        </div>

        {/* Sidebar Middle Menu Links */}
        <nav className="crm-sidebar-menu">
          <div className="crm-menu-title">Tahrirlash bo'limlari</div>
          
          <button 
            className={`crm-menu-item ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <HardDrive size={18} />
            <span>Asosiy sahifa (Hero)</span>
          </button>

          <button 
            className={`crm-menu-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <Settings size={18} />
            <span>Statistika raqamlari</span>
          </button>

          <button 
            className={`crm-menu-item ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            <HelpCircle size={18} />
            <span>Xizmatlar ro'yxati</span>
          </button>

          <button 
            className={`crm-menu-item ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <Film size={18} />
            <span>Portfoliodagi videolar</span>
          </button>

          <button 
            className={`crm-menu-item ${activeTab === 'gear' ? 'active' : ''}`}
            onClick={() => setActiveTab('gear')}
          >
            <Camera size={18} />
            <span>Kamera & Uskunalar</span>
          </button>

          <button 
            className={`crm-menu-item ${activeTab === 'telegram' ? 'active' : ''}`}
            onClick={() => setActiveTab('telegram')}
          >
            <Send size={18} />
            <span>Telegram Bot sozlash</span>
          </button>
        </nav>

        {/* Sidebar Bottom Profile/Credits */}
        <div className="crm-sidebar-footer">
          <div className="crm-profile-badge">
            <div className="profile-avatar">A</div>
            <div className="profile-details">
              <h4>Administrator</h4>
              <span>admin@joshqinbek.uz</span>
            </div>
          </div>
          
          <button className="crm-logout-btn" onClick={onLogout}>
            <span>Chiqish (Saytga qaytish)</span>
          </button>
        </div>
      </aside>

      {/* 2. RIGHT WORKSPACE CONTENT VIEW */}
      <main className="crm-main-workspace">
        
        {/* Workspace Top Header Section */}
        <header className="crm-workspace-header">
          <div className="header-info-group">
            <h2>{getTabTitle()}</h2>
            <span className="current-date">{getUzbekDate()}</span>
          </div>
          
          <div className="header-action-group">
            <button onClick={handleSaveAll} className="btn btn-primary crm-save-btn">
              <Save size={16} /> O'zgarishlarni Saqlash
            </button>
          </div>
        </header>

        {/* Workspace Body Section */}
        <div className="crm-workspace-body">
          
          {/* TAB 1: GENERAL HERO TEXTS */}
          {activeTab === 'general' && (
            <div className="crm-tab-editor-pane">
              <div className="helper-banner">
                <Info size={16} className="text-cyan" />
                <span>Saytning eng yuqori qismidagi (Hero) sarlavha va matnlarini shu yerdan o'zgartirishingiz mumkin.</span>
              </div>

              <div className="crm-card glass-panel">
                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Hero Asosiy Katta Sarlavha</label>
                  <input 
                    type="text"
                    value={formData.heroTitle}
                    onChange={(e) => handleGeneralChange('heroTitle', e.target.value)}
                    className="editor-input"
                  />
                  <span className="field-helper">* Ushbu matn sayt kirishidagi eng katta sarlavha hisoblanadi.</span>
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Hero Kichik Tavsif Matni</label>
                  <textarea 
                    rows={5}
                    value={formData.heroDescription}
                    onChange={(e) => handleGeneralChange('heroDescription', e.target.value)}
                    className="editor-textarea"
                  />
                  <span className="field-helper">* Sarlavha ostida turadigan studiya faoliyati haqidagi ta'rif.</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MICRO STATS */}
          {activeTab === 'stats' && (
            <div className="crm-tab-editor-pane">
              <div className="helper-banner">
                <Info size={16} className="text-cyan" />
                <span>Sayt sarlavhasi ostidagi 3 ta statistika ko'rsatkichini tahrirlash (raqamlar va yozuvlar).</span>
              </div>

              <div className="crm-stats-cards-grid">
                
                {/* Stat 1 Card */}
                <div className="crm-stat-editor-card glass-panel">
                  <div className="card-top-header">
                    <span className="card-number-index">01</span>
                    <h4>Baxtli Juftliklar</h4>
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Raqamli Qiymat</label>
                    <input 
                      type="text"
                      value={formData.stat1Val}
                      onChange={(e) => handleGeneralChange('stat1Val', e.target.value)}
                      className="editor-input text-pink-glow"
                    />
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Ta'rif yozuvi</label>
                    <input 
                      type="text"
                      value={formData.stat1Label}
                      onChange={(e) => handleGeneralChange('stat1Label', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>

                {/* Stat 2 Card */}
                <div className="crm-stat-editor-card glass-panel">
                  <div className="card-top-header">
                    <span className="card-number-index">02</span>
                    <h4>Format Sifati</h4>
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Raqamli Qiymat</label>
                    <input 
                      type="text"
                      value={formData.stat2Val}
                      onChange={(e) => handleGeneralChange('stat2Val', e.target.value)}
                      className="editor-input text-cyan-glow"
                    />
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Ta'rif yozuvi</label>
                    <input 
                      type="text"
                      value={formData.stat2Label}
                      onChange={(e) => handleGeneralChange('stat2Label', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>

                {/* Stat 3 Card */}
                <div className="crm-stat-editor-card glass-panel">
                  <div className="card-top-header">
                    <span className="card-number-index">03</span>
                    <h4>Tajriba yili</h4>
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Raqamli Qiymat</label>
                    <input 
                      type="text"
                      value={formData.stat3Val}
                      onChange={(e) => handleGeneralChange('stat3Val', e.target.value)}
                      className="editor-input text-purple-glow"
                    />
                  </div>
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Ta'rif yozuvi</label>
                    <input 
                      type="text"
                      value={formData.stat3Label}
                      onChange={(e) => handleGeneralChange('stat3Label', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: SERVICES */}
          {activeTab === 'services' && (
            <div className="crm-tab-editor-pane">
              <div className="helper-banner">
                <Info size={16} className="text-cyan" />
                <span>Xizmat yo'nalishlarining sarlavhalari, ta'riflari va batafsil xizmat tarkiblarini shu yerdan o'zgartiring.</span>
              </div>

              {/* Selector tabs */}
              <div className="crm-tabs-row">
                {formData.services.map((ser: any, idx: number) => (
                  <button
                    key={ser.id}
                    type="button"
                    className={`crm-tab-btn ${selectedServiceIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedServiceIdx(idx)}
                  >
                    {ser.title}
                  </button>
                ))}
              </div>

              <div className="crm-card glass-panel">
                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Xizmat Guruhi Nomi</label>
                  <input 
                    type="text"
                    value={formData.services[selectedServiceIdx].title}
                    onChange={(e) => handleServiceFieldChange('title', e.target.value)}
                    className="editor-input"
                  />
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Batafsil ma'lumot ta'rifi</label>
                  <textarea 
                    rows={4}
                    value={formData.services[selectedServiceIdx].description}
                    onChange={(e) => handleServiceFieldChange('description', e.target.value)}
                    className="editor-textarea"
                  />
                </div>

                <div className="crm-details-edit-list">
                  <h4 className="crm-section-divider">Xizmat tarkibiga kiruvchi 5 ta xususiyat:</h4>
                  {formData.services[selectedServiceIdx].details.map((detail: string, i: number) => (
                    <div key={i} className="editor-field-wrapper spec-detail-row">
                      <label className="editor-field-lbl">Xususiyat #{i+1}</label>
                      <input 
                        type="text"
                        value={detail}
                        onChange={(e) => handleServiceDetailChange(i, e.target.value)}
                        className="editor-input"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO LOYIHALARI */}
          {activeTab === 'portfolio' && (
            <div className="crm-tab-editor-pane">
              <div className="helper-banner">
                <Info size={16} className="text-cyan" />
                <span>Portfoliodagi video ishlarini qo'shish, o'chirish yoki mavjudlarini tahrirlash bo'limi.</span>
              </div>

              <div className="crm-portfolio-split">
                {/* List of projects */}
                <div className="crm-split-list-col glass-panel">
                  <div className="crm-col-header-row">
                    <h3 className="crm-col-title">Mavjud ishlar ro'yxati</h3>
                    <button 
                      type="button"
                      className="btn btn-secondary crm-add-new-btn"
                      onClick={() => {
                        setEditingProjectIdx(null);
                        setProjectForm({
                          id: '',
                          title: '',
                          category: 'wedding',
                          categoryLabel: "To'y marosimi",
                          duration: '03:00',
                          cameras: 'Sony FX3',
                          videoUrl: '',
                          thumbnail: '',
                          bgGradient: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)',
                          date: 'Avgust 2026'
                        });
                      }}
                    >
                      + Yangi Video Qo'shish
                    </button>
                  </div>
                  
                  <div className="crm-items-scroll-list">
                    {formData.portfolio.map((proj: any, idx: number) => (
                      <div key={proj.id} className={`crm-list-item-card ${editingProjectIdx === idx ? 'editing' : ''}`}>
                        <div className="item-meta">
                          <span className="item-badge">{proj.categoryLabel}</span>
                          <h4 className="item-title">{proj.title}</h4>
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
                <div className="crm-split-form-col glass-panel">
                  <h3 className="crm-col-title text-cyan">
                    {editingProjectIdx !== null ? `Loyihani Tahrirlash: "${projectForm.title}"` : "Yangi Loyiha Qo'shish"}
                  </h3>
                  
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Video nomi (Sarlavha)</label>
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
                      <label className="editor-field-lbl">Bo'limi (Kategoriya)</label>
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
                      <label className="editor-field-lbl">Video davomiyligi</label>
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
                      <label className="editor-field-lbl">Ishlatilgan kameralar</label>
                      <input 
                        type="text"
                        value={projectForm.cameras || ''}
                        onChange={(e) => handleProjectFormChange('cameras', e.target.value)}
                        placeholder="Sony FX3 + Sony A7S3"
                        className="editor-input"
                      />
                    </div>

                    <div className="editor-field-wrapper">
                      <label className="editor-field-lbl">Tadbir sanasi (masalan: Avg 2026)</label>
                      <input 
                        type="text"
                        value={projectForm.date || ''}
                        onChange={(e) => handleProjectFormChange('date', e.target.value)}
                        placeholder="Avgust 2026"
                        className="editor-input"
                      />
                    </div>
                  </div>

                  {/* THUMBNAIL FILE UPLOAD WITH PREVIEW AND URL FALLBACK */}
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Rasm (Thumbnail Fayli)</label>
                    <div className="crm-file-upload-zone">
                      <label htmlFor="thumbnail-file-input" className="file-upload-lbl-click">
                        📁 Rasm faylini yuklash
                      </label>
                      <input 
                        type="file" 
                        id="thumbnail-file-input"
                        accept="image/*" 
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <span className="file-info-text">
                        {projectForm.thumbnail && projectForm.thumbnail.startsWith('data:') ? '✓ Rasm yuklandi (Base64)' : 'Fayl tanlanmagan'}
                      </span>
                    </div>

                    {projectForm.thumbnail && (
                      <div className="upload-preview-box">
                        <img src={projectForm.thumbnail} alt="Preview" className="mini-preview-img" />
                        <button 
                          type="button" 
                          onClick={() => handleProjectFormChange('thumbnail', '')}
                          className="btn-delete-preview"
                        >
                          Faylni o'chirish
                        </button>
                      </div>
                    )}

                    <div className="url-fallback-field">
                      <label className="editor-field-lbl-small">Yoki tayyor rasm havolasini yozing (ixtiyoriy):</label>
                      <input 
                        type="text"
                        value={projectForm.thumbnail && !projectForm.thumbnail.startsWith('data:') ? projectForm.thumbnail : ''}
                        onChange={(e) => handleProjectFormChange('thumbnail', e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="editor-input-small"
                      />
                    </div>
                  </div>

                  {/* VIDEO FILE UPLOAD WITH PREVIEW AND URL FALLBACK */}
                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Video (Rolik Fayli - MP4)</label>
                    <div className="crm-file-upload-zone">
                      <label htmlFor="video-file-input" className="file-upload-lbl-click">
                        🎥 Video faylini yuklash (MP4)
                      </label>
                      <input 
                        type="file" 
                        id="video-file-input"
                        accept="video/mp4,video/*" 
                        onChange={handleVideoUpload}
                        style={{ display: 'none' }}
                      />
                      <span className="file-info-text">
                        {projectForm.videoUrl && projectForm.videoUrl.startsWith('data:') ? '✓ Video yuklandi (Base64)' : 'Fayl tanlanmagan'}
                      </span>
                    </div>

                    {projectForm.videoUrl && (
                      <div className="upload-preview-box">
                        <video src={projectForm.videoUrl} className="mini-preview-video" controls muted />
                        <button 
                          type="button" 
                          onClick={() => handleProjectFormChange('videoUrl', '')}
                          className="btn-delete-preview"
                        >
                          Faylni o'chirish
                        </button>
                      </div>
                    )}

                    <div className="url-fallback-field">
                      <label className="editor-field-lbl-small">Yoki tayyor video havolasini yozing (ixtiyoriy):</label>
                      <input 
                        type="text"
                        value={projectForm.videoUrl && !projectForm.videoUrl.startsWith('data:') ? projectForm.videoUrl : ''}
                        onChange={(e) => handleProjectFormChange('videoUrl', e.target.value)}
                        placeholder="https://assets.mixkit.co/..."
                        className="editor-input-small"
                      />
                    </div>
                  </div>

                  <div className="editor-field-wrapper">
                    <label className="editor-field-lbl">Karta gradiyenti foni</label>
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

                  <div className="crm-form-actions">
                    <button 
                      type="button" 
                      onClick={handleAddOrUpdateProject}
                      className="btn btn-primary crm-btn-inside-save"
                    >
                      {editingProjectIdx !== null ? "Saqlash" : "Loyihani ro'yxatga qo'shish"}
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
                            videoUrl: '',
                            thumbnail: '',
                            bgGradient: 'linear-gradient(135deg, #ec008c 0%, #fc6767 100%)',
                            date: 'Avgust 2026'
                          });
                        }}
                        className="btn btn-secondary crm-btn-inside-cancel"
                      >
                        Bekor qilish
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: GEAR USKUNALAR */}
          {activeTab === 'gear' && (
            <div className="crm-tab-editor-pane">
              <div className="helper-banner">
                <Info size={16} className="text-cyan" />
                <span>Texnik uskunalar (Kameralar, dronlar, stabilizatorlar) sarlavhalari, ta'riflari va foiz slayd ko'rsatkichlarini o'zgartiring.</span>
              </div>

              {/* Selector */}
              <div className="crm-tabs-row">
                <button 
                  className={`crm-tab-btn ${selectedGearCat === 'camera' ? 'active' : ''}`}
                  onClick={() => { setSelectedGearCat('camera'); setSelectedGearIdx(0); }}
                >
                  Kameralar
                </button>
                <button 
                  className={`crm-tab-btn ${selectedGearCat === 'drone' ? 'active' : ''}`}
                  onClick={() => { setSelectedGearCat('drone'); setSelectedGearIdx(0); }}
                >
                  Dronlar / FPV
                </button>
                <button 
                  className={`crm-tab-btn ${selectedGearCat === 'gimbal' ? 'active' : ''}`}
                  onClick={() => { setSelectedGearCat('gimbal'); setSelectedGearIdx(0); }}
                >
                  Stabilizator & Ovoz
                </button>
              </div>

              {/* Sub-selector for gear item */}
              <div className="crm-sub-tabs-row">
                {formData.gear[selectedGearCat].map((item: any, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    className={`crm-sub-tab-btn ${selectedGearIdx === idx ? 'active' : ''}`}
                    onClick={() => setSelectedGearIdx(idx)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              <div className="crm-card glass-panel">
                <div className="editor-row-grid">
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
                    <label className="editor-field-lbl">Klassifikatsiyasi (Nima vazifa bajaradi)</label>
                    <input 
                      type="text"
                      value={formData.gear[selectedGearCat][selectedGearIdx].type}
                      onChange={(e) => handleGearFieldChange('type', e.target.value)}
                      className="editor-input"
                    />
                  </div>
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Uskuna ta'rifi</label>
                  <textarea 
                    rows={3}
                    value={formData.gear[selectedGearCat][selectedGearIdx].description}
                    onChange={(e) => handleGearFieldChange('description', e.target.value)}
                    className="editor-textarea"
                  />
                </div>

                <h4 className="crm-section-divider">Uskuna xususiyat parametr ko'rsatkichlari (4 ta):</h4>
                <div className="crm-gear-specs-edit-grid">
                  {formData.gear[selectedGearCat][selectedGearIdx].specs.map((spec: any, i: number) => (
                    <div key={i} className="crm-spec-edit-card glass-panel">
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
                        <label className="editor-field-lbl">Matnli Qiymati</label>
                        <input 
                          type="text"
                          value={spec.value}
                          onChange={(e) => handleGearSpecChange(i, 'value', e.target.value)}
                          className="editor-input"
                        />
                      </div>
                      <div className="editor-field-wrapper">
                        <div className="crm-slider-label-row">
                          <label className="editor-field-lbl">Kuchlilik Foiz ko'rsatkichi (Slayder)</label>
                          <span className="slider-val text-cyan">{spec.percentage}%</span>
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
                </div>

                <h4 className="crm-section-divider">Uskunaning 3 ta kalta teglari (Tags)</h4>
                <div className="editor-row-grid three-cols">
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
              </div>
            </div>
          )}

          {/* TAB 6: TELEGRAM SETTINGS */}
          {activeTab === 'telegram' && (
            <div className="crm-tab-editor-pane">
              <div className="helper-banner">
                <Info size={16} className="text-cyan" />
                <span>Buyurtmalar kelib tushadigan Telegram Bot va Chat ID sozlamalari.</span>
              </div>

              <div className="crm-card glass-panel">
                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Telegram Bot Token Kaliti</label>
                  <input 
                    type="text"
                    value={formData.telegramToken}
                    onChange={(e) => handleGeneralChange('telegramToken', e.target.value)}
                    className="editor-input monospace-font"
                  />
                  <span className="field-helper">* BotFather bergan maxfiy API token (e.g. 8688264078:AAGfMk...)</span>
                </div>

                <div className="editor-field-wrapper">
                  <label className="editor-field-lbl">Doimiy Chat ID raqami (Ixtiyoriy)</label>
                  <input 
                    type="text"
                    value={formData.telegramChatId}
                    placeholder="Masalan: 123456789"
                    onChange={(e) => handleGeneralChange('telegramChatId', e.target.value)}
                    className="editor-input monospace-font"
                  />
                  <span className="field-helper">* Guruh yoki kanalingizning Chat ID raqami. Agar kiritilmasa, tizim o'zi topib oladi.</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
};

export default AdminPanel;
