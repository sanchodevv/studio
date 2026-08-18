import React, { useState } from 'react';
import { Cpu, Eye, Zap, Award } from 'lucide-react';
import './GearSection.css';

interface GearItem {
  name: string;
  type: string;
  description: string;
  specs: {
    label: string;
    value: string;
    percentage: number; // For rendering glowing spec progress bars
  }[];
  features: string[];
  techBadge: string;
}

interface GearSectionProps {
  list: Record<'camera' | 'drone' | 'gimbal', GearItem[]>;
}

const GearSection: React.FC<GearSectionProps> = ({ list }) => {
  const [activeCategory, setActiveCategory] = useState<'camera' | 'drone' | 'gimbal'>('camera');



  return (
    <section id="gear" className="gear-section">
      <div className="container">
        
        <h2 className="section-title">
          Texnik <span className="gradient-text">Uskunalarimiz</span>
        </h2>
        <p className="section-subtitle">
          Kino va videolarni tasvirga olishda faqat eng so'nggi va jahon standartlariga mos texnikalardan foydalanamiz
        </p>

        {/* Gear Categories Navbar */}
        <div className="gear-tabs glass-panel">
          <button 
            className={`gear-tab-btn ${activeCategory === 'camera' ? 'active' : ''}`}
            onClick={() => setActiveCategory('camera')}
          >
            <Cpu size={16} /> Kameralar
          </button>
          <button 
            className={`gear-tab-btn ${activeCategory === 'drone' ? 'active' : ''}`}
            onClick={() => setActiveCategory('drone')}
          >
            <Zap size={16} /> Dronlar / FPV
          </button>
          <button 
            className={`gear-tab-btn ${activeCategory === 'gimbal' ? 'active' : ''}`}
            onClick={() => setActiveCategory('gimbal')}
          >
            <Eye size={16} /> Stabilizatorlar & Ovoz
          </button>
        </div>

        {/* Gear Grid Display */}
        <div className="gear-grid">
          {list[activeCategory].map((item, index) => (
            <div key={index} className="gear-card glass-panel">
              <div className="gear-card-header">
                <span className="gear-tech-badge">{item.techBadge}</span>
                <span className="gear-type-label">{item.type}</span>
                <h3 className="gear-name">{item.name}</h3>
                <p className="gear-desc">{item.description}</p>
              </div>

              {/* Specs Progress Bars */}
              <div className="gear-specs-wrapper">
                <h4 className="specs-section-title">Xususiyatlari va samaradorligi:</h4>
                <div className="specs-list">
                  {item.specs.map((spec, specIdx) => (
                    <div key={specIdx} className="spec-progress-item">
                      <div className="spec-info-row">
                        <span className="spec-lbl">{spec.label}</span>
                        <span className="spec-val text-cyan">{spec.value}</span>
                      </div>
                      <div className="spec-progress-bar-bg">
                        <div 
                          className="spec-progress-bar-fill" 
                          style={{ width: `${spec.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature lists tags */}
              <div className="gear-features">
                {item.features.map((feature, featIdx) => (
                  <span key={featIdx} className="gear-feature-tag">
                    <Award size={12} className="tag-icon" /> {feature}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default GearSection;
