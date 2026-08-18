import React, { useState } from 'react';
import { Play, Clock, Cpu } from 'lucide-react';
import './Portfolio.css';

export interface Project {
  id: string;
  title: string;
  category: 'wedding' | 'commercial' | 'music' | 'drone';
  categoryLabel: string;
  duration: string;
  cameras: string;
  videoUrl: string;
  thumbnail: string;
  bgGradient: string;
  date: string;
}

interface PortfolioProps {
  list: Project[];
  onSelectProject: (project: Project) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ list, onSelectProject }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filteredProjects = activeFilter === 'all'
    ? list
    : list.filter(proj => proj.category === activeFilter);

  const filters = [
    { key: 'all', label: 'Barchasi' },
    { key: 'wedding', label: "To'ylar & Love Story" },
    { key: 'commercial', label: 'Reklama & Tijoriy' },
    { key: 'music', label: 'Musiqiy Kliplar' },
    { key: 'drone', label: 'FPV & Aerotasvir' }
  ];

  return (
    <section id="portfolio" className="portfolio-section">
      <div className="container">
        
        <h2 className="section-title">
          Ijodiy <span className="gradient-text">Partfoliomiz</span>
        </h2>
        <p className="section-subtitle">
          Biz tomondan muhrlangan so'nggi go'zal lahzalar, reklama kampaniyalari va yuqori adrenalinli kadrlar
        </p>

        {/* Filter Controls */}
        <div className="filter-wrapper glass-panel">
          {filters.map(filter => (
            <button
              key={filter.key}
              className={`filter-btn ${activeFilter === filter.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {filteredProjects.map(project => (
            <div 
              key={project.id} 
              className="portfolio-card glass-panel"
              onClick={() => onSelectProject(project)}
            >
              {/* Thumbnail Area */}
              <div 
                className="card-thumbnail" 
                style={{ background: project.bgGradient }}
              >
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="portfolio-thumb-img"
                />
                {/* Visual Camera Overlay Grid */}
                <div className="thumb-grid-pattern"></div>
                
                {/* Simulated Wave form or Shutter overlay */}
                <div className="thumb-lens-circle">
                  <Play className="play-trigger-icon" size={26} fill="currentColor" />
                </div>
                
                <span className="card-badge">{project.categoryLabel}</span>
              </div>

              {/* Info Area */}
              <div className="card-info">
                <div className="card-meta">
                  <span className="meta-item text-cyan">
                    <Clock size={12} /> {project.duration} daqiqa
                  </span>
                  <span className="meta-item text-muted">
                    {project.date}
                  </span>
                </div>
                
                <h3 className="card-title">{project.title}</h3>

                <div className="card-tech">
                  <Cpu size={14} className="tech-icon-small" />
                  <span>{project.cameras}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
