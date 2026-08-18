import React, { useState, useEffect } from 'react';
import { Camera, ArrowRight, Home, Grid, Tv, Calendar } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      // Background shift state
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Scroll progress computation
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor scrolling to highlight active bottom nav item
  useEffect(() => {
    const sections = ['home', 'services', 'portfolio', 'gear', 'booking'];
    
    const handleActiveSection = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleActiveSection);
    // Initial call
    handleActiveSection();
    return () => window.removeEventListener('scroll', handleActiveSection);
  }, []);

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        {/* Scroll Progress Bar */}
        <div 
          className="scroll-progress" 
          style={{ width: `${scrollProgress}%` }}
        />
        
        <div className="container header-container">
          <a href="#home" className="logo-area">
            <div className="logo-icon-wrapper">
              <Camera className="logo-icon" />
              <div className="logo-icon-glow" />
            </div>
            <span className="logo-text">
              Jo'shqinbek<span className="gradient-text-alt font-heavy">Studio</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <a href="#home" className="nav-link">Asosiy</a>
            <a href="#services" className="nav-link">Xizmatlar</a>
            <a href="#portfolio" className="nav-link">Partfolio</a>
            <a href="#gear" className="nav-link">Texnikalar</a>
            <a href="#prices" className="nav-link">Narxlar</a>
            <a href="#booking" className="btn btn-secondary nav-cta">
              Band qilish <ArrowRight size={16} />
            </a>
          </nav>
        </div>
      </header>

      {/* Floating Bottom Nav for Mobile - styled like user's mockup */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner glass-panel">
          <a href="#home" className={`mobile-nav-item ${activeSection === 'home' ? 'active' : ''}`}>
            <div className="nav-item-content">
              <Home className="nav-icon" size={20} />
              <span className="nav-label">Asosiy</span>
            </div>
          </a>
          <a href="#services" className={`mobile-nav-item ${activeSection === 'services' ? 'active' : ''}`}>
            <div className="nav-item-content">
              <Grid className="nav-icon" size={20} />
              <span className="nav-label">Xizmatlar</span>
            </div>
          </a>
          <a href="#portfolio" className={`mobile-nav-item ${activeSection === 'portfolio' ? 'active' : ''}`}>
            <div className="nav-item-content">
              <Tv className="nav-icon" size={20} />
              <span className="nav-label">Partfolio</span>
            </div>
          </a>
          <a href="#gear" className={`mobile-nav-item ${activeSection === 'gear' ? 'active' : ''}`}>
            <div className="nav-item-content">
              <Camera className="nav-icon" size={20} />
              <span className="nav-label">Texnikalar</span>
            </div>
          </a>
          <a href="#booking" className={`mobile-nav-item ${activeSection === 'booking' ? 'active' : ''}`}>
            <div className="nav-item-content">
              <Calendar className="nav-icon" size={20} />
              <span className="nav-label">Aloqa</span>
            </div>
          </a>
        </div>
      </nav>
    </>
  );
};

export default Header;
