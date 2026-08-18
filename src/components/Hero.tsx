import React from 'react';
import { Play, Calculator, Award, Zap, Heart } from 'lucide-react';
import './Hero.css';

interface HeroProps {
  title: string;
  description: string;
  stat1Val: string;
  stat1Label: string;
  stat2Val: string;
  stat2Label: string;
  stat3Val: string;
  stat3Label: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  stat1Val,
  stat1Label,
  stat2Val,
  stat2Label,
  stat3Val,
  stat3Label
}) => {
  return (
    <section id="home" className="hero-section">
      {/* Decorative elements */}
      <div className="hero-tech-lines">
        <div className="tech-line vertical left"></div>
        <div className="tech-line vertical right"></div>
      </div>

      <div className="container hero-container-inner">

        {/* Text Area */}
        <div className="hero-content">
          <div className="hero-badge-wrapper">
            <span className="hero-badge">
              <Zap size={14} className="neon-cyan-text" /> 
              Yangi Avlod Kinostudiyasi
            </span>
          </div>

          <h1 className="hero-title">
            {title}
          </h1>

          <p className="hero-description">
            {description}
          </p>

          <div className="hero-actions">
            <a href="#portfolio" className="btn btn-primary">
              <Play size={18} fill="currentColor" /> Partfolioni Ko'rish
            </a>
            <a href="#prices" className="btn btn-secondary">
              <Calculator size={18} /> Narxni Hisoblash
            </a>
          </div>

          {/* Micro Stats */}
          <div className="hero-stats">
            <div className="hero-stat-item">
              <Heart className="stat-icon text-pink" size={20} />
              <div>
                <h4 className="stat-val">{stat1Val}</h4>
                <p className="stat-label">{stat1Label}</p>
              </div>
            </div>
            <div className="hero-stat-item">
              <Zap className="stat-icon text-cyan" size={20} />
              <div>
                <h4 className="stat-val">{stat2Val}</h4>
                <p className="stat-label">{stat2Label}</p>
              </div>
            </div>
            <div className="hero-stat-item">
              <Award className="stat-icon text-purple" size={20} />
              <div>
                <h4 className="stat-val">{stat3Val}</h4>
                <p className="stat-label">{stat3Label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visual / Showcase Area */}
        <div className="hero-visual">
          <div className="console-wrapper glass-panel pulse-border">
            {/* Header info bar */}
            <div className="console-header">
              <div className="console-status">
                <span className="status-dot blink"></span>
                <span className="status-text">LIVE RECORDING MODE</span>
              </div>
              <div className="console-timecode">00:18:42:09</div>
            </div>

            {/* Main view container */}
            <div className="console-viewport">
              <div className="viewport-overlay-grid"></div>
              
              {/* Shutter Speed and ISO markers */}
              <div className="viewport-marker top-left">F/2.8</div>
              <div className="viewport-marker top-right">ISO 800</div>
              <div className="viewport-marker bottom-left">1/120s</div>
              <div className="viewport-marker bottom-right">LOG-C 10BIT</div>
              
              {/* Shutter corner lines */}
              <div className="shutter-bracket top-l"></div>
              <div className="shutter-bracket top-r"></div>
              <div className="shutter-bracket bottom-l"></div>
              <div className="shutter-bracket bottom-r"></div>

              {/* Simulated active visualizer */}
              <div className="viewport-visualizer">
                <div className="grid-wave"></div>
                <div className="glow-ball purple"></div>
                <div className="glow-ball cyan"></div>
                
                <div className="viewport-center-cross"></div>
              </div>

              {/* Cinematic Quote Overlay */}
              <div className="viewport-label">
                <span>FPV ACTIVE // RESOLUTION: 4K 120FPS</span>
              </div>
            </div>

            {/* Footer telemetry bar */}
            <div className="console-footer">
              <div className="telemetry-item">
                <span className="tele-lbl">FPS</span>
                <span className="tele-val text-cyan">120.00</span>
              </div>
              <div className="telemetry-item">
                <span className="tele-lbl">DRONE GPS</span>
                <span className="tele-val text-purple">ACTIVE</span>
              </div>
              <div className="telemetry-item">
                <span className="tele-lbl">REC</span>
                <span className="tele-val text-pink">4K RAW</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
