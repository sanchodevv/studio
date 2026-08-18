import React from 'react';
import { Heart, Megaphone, Music, Navigation, CheckCircle } from 'lucide-react';
import './Services.css';

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details: string[];
  gradient: string;
  glow: string;
}

interface ServicesProps {
  list: ServiceItem[];
}

const Services: React.FC<ServicesProps> = ({ list }) => {
  const getIconForService = (id: string) => {
    switch (id) {
      case 'wedding':
        return <Heart size={32} />;
      case 'commercial':
        return <Megaphone size={32} />;
      case 'music':
        return <Music size={32} />;
      case 'fpv':
        return <Navigation size={32} style={{ transform: 'rotate(45deg)' }} />;
      default:
        return <Heart size={32} />;
    }
  };

  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="section-title">
          Professional <span className="gradient-text">Xizmatlarimiz</span>
        </h2>
        <p className="section-subtitle">
          Jo'shqinbek Studio jamoasi eng so'nggi kino uskunalari va professional mahorat bilan quyidagi yo'nalishlarda ijod qiladi
        </p>

        <div className="services-grid">
          {list.map((service) => (
            <div 
              key={service.id} 
              className="service-card glass-panel"
              style={{ 
                '--card-glow-color': service.glow,
                background: `${service.gradient}, var(--bg-card)`
              } as React.CSSProperties}
            >
              {/* Card Header */}
              <div className="service-card-header">
                <div className="service-icon-box">
                  {getIconForService(service.id)}
                </div>
                <h3 className="service-card-title">{service.title}</h3>
              </div>

              {/* Card Description */}
              <p className="service-card-desc">{service.description}</p>

              {/* Service Detail Bullet points */}
              <div className="service-details-list">
                <h4 className="details-header">Xizmat tarkibi:</h4>
                <ul>
                  {service.details.map((detail, index) => (
                    <li key={index} className="detail-item">
                      <CheckCircle className="check-icon" size={14} />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer Tech Badge */}
              <div className="service-card-footer">
                <span className="tech-badge">PREMIUM CINEMA</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
