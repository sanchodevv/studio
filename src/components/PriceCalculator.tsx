import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Check } from 'lucide-react';
import './PriceCalculator.css';

interface PriceCalculatorProps {
  onPackageSelected: (summary: string, price: string) => void;
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({ onPackageSelected }) => {
  const [serviceType, setServiceType] = useState<'wedding' | 'commercial' | 'music' | 'drone'>('wedding');
  const [hours, setHours] = useState<number>(8);
  const [operators, setOperators] = useState<number>(2);
  const [useDrone, setUseDrone] = useState<boolean>(false);
  const [useSde, setUseSde] = useState<boolean>(false);
  const [useExpress, setUseExpress] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Live calculation effect
  useEffect(() => {
    let basePrice = 0;
    let hourlyRate = 350000; // UZS per hour per cinematographer

    switch (serviceType) {
      case 'wedding':
        basePrice = 2500000;
        break;
      case 'commercial':
        basePrice = 4000000;
        hourlyRate = 500000;
        break;
      case 'music':
        basePrice = 3500000;
        hourlyRate = 450000;
        break;
      case 'drone':
        basePrice = 1500000;
        hourlyRate = 300000;
        break;
    }

    let calculated = basePrice + (hours * operators * hourlyRate);

    if (useDrone) calculated += 1500000; // UZS flat drone add-on
    if (useSde) calculated += 2000000;   // Same Day Edit costs extra
    if (useExpress) calculated += 1000000; // Fast edit within 48h

    setTotalPrice(calculated);
  }, [serviceType, hours, operators, useDrone, useSde, useExpress]);

  // Format currency
  const formatUZS = (value: number) => {
    return value.toLocaleString('uz-UZ') + " so'm";
  };

  // Package description generation
  const handleBookPackage = () => {
    const serviceName = 
      serviceType === 'wedding' ? "To'y va Love Story" :
      serviceType === 'commercial' ? "Tijoriy / Reklama" :
      serviceType === 'music' ? "Musiqiy Klip" : "Faqat FPV / Aerotasvir";

    const summary = `${serviceName} (${hours} soat, ${operators} ta operator${useDrone ? ', Drone parvozlari' : ''}${useSde ? ', SDE montaj' : ''}${useExpress ? ', Tezkor montaj' : ''})`;
    const priceText = formatUZS(totalPrice);
    
    onPackageSelected(summary, priceText);
    
    // Smooth scroll to booking
    const bookingSection = document.getElementById('booking');
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="prices" className="calculator-section">
      <div className="container">
        
        <h2 className="section-title">
          Narx <span className="gradient-text">Kalkulyatori</span>
        </h2>
        <p className="section-subtitle">
          Sizga kerak bo'lgan xizmatlarni tanlang va real vaqt rejimida shaffof paket narxini hisoblang
        </p>

        <div className="calculator-grid">
          {/* Controls Panel */}
          <div className="calc-controls glass-panel">
            <h3 className="calc-heading">
              <Sparkles size={18} className="text-cyan" /> Parametrlarni Tanlang
            </h3>

            {/* Service Selection */}
            <div className="control-group-wrapper">
              <label className="control-label">Xizmat turi</label>
              <div className="service-tabs">
                {[
                  { key: 'wedding', label: "To'y / Love Story" },
                  { key: 'commercial', label: "Tijoriy & Reklama" },
                  { key: 'music', label: "Klip Suratga Olish" },
                  { key: 'drone', label: "FPV & Aerotasvir" }
                ].map(item => (
                  <button
                    key={item.key}
                    className={`service-tab-btn ${serviceType === item.key ? 'active' : ''}`}
                    onClick={() => {
                      setServiceType(item.key as any);
                      // Adjust reasonable defaults for drone only
                      if (item.key === 'drone') {
                        setOperators(1);
                        setHours(4);
                      }
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours Range Slider */}
            <div className="control-group-wrapper">
              <div className="slider-label-row">
                <label className="control-label">Tasvirga olish davomiyligi</label>
                <span className="slider-value text-cyan">{hours} soat</span>
              </div>
              <input
                type="range"
                min={2}
                max={15}
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="calc-range-slider"
              />
              <div className="slider-limits">
                <span>2 soat</span>
                <span>15 soat</span>
              </div>
            </div>

            {/* Operator Range Slider */}
            <div className="control-group-wrapper">
              <div className="slider-label-row">
                <label className="control-label">Operatorlar soni</label>
                <span className="slider-value text-purple">{operators} ta operator</span>
              </div>
              <input
                type="range"
                min={1}
                max={4}
                value={operators}
                onChange={(e) => setOperators(parseInt(e.target.value))}
                className="calc-range-slider"
                disabled={serviceType === 'drone'} // Drone only usually uses 1 operator
              />
              <div className="slider-limits">
                <span>1 operator</span>
                <span>4 operator</span>
              </div>
            </div>

            {/* Addons Checklist */}
            <div className="control-group-wrapper">
              <label className="control-label">Qo'shimcha Xizmatlar</label>
              <div className="addons-grid">
                
                {/* Drone Checkbox */}
                <label className={`addon-checkbox-label ${useDrone ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={useDrone}
                    onChange={(e) => setUseDrone(e.target.checked)}
                    disabled={serviceType === 'drone'} // already drone
                  />
                  <div className="checkbox-ui">
                    {useDrone && <Check size={12} />}
                  </div>
                  <div className="addon-text">
                    <span className="addon-title">FPV & Aerotasvir (+1.5 mln)</span>
                    <span className="addon-desc">Dinamik va yuqori kadrlar</span>
                  </div>
                </label>

                {/* SDE Checkbox */}
                <label className={`addon-checkbox-label ${useSde ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={useSde}
                    onChange={(e) => setUseSde(e.target.checked)}
                    disabled={serviceType !== 'wedding'} // SDE only makes sense for weddings
                  />
                  <div className="checkbox-ui">
                    {useSde && <Check size={12} />}
                  </div>
                  <div className="addon-text">
                    <span className="addon-title">Same Day Edit (SDE) (+2.0 mln)</span>
                    <span className="addon-desc">To'y kunining o'zida montaj</span>
                  </div>
                </label>

                {/* Express Edit Checkbox */}
                <label className={`addon-checkbox-label ${useExpress ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={useExpress}
                    onChange={(e) => setUseExpress(e.target.checked)}
                  />
                  <div className="checkbox-ui">
                    {useExpress && <Check size={12} />}
                  </div>
                  <div className="addon-text">
                    <span className="addon-title">Tezkor Tayyorlash (+1.0 mln)</span>
                    <span className="addon-desc">Tayyor videoni 48 soatda topshirish</span>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Pricing Card Display */}
          <div className="calc-result-card glass-panel pulse-border">
            <div className="result-header">
              <span className="package-tag">HISOB-KITOB</span>
              <h3 className="result-card-title">Sizning Paket</h3>
            </div>

            <div className="price-display-wrapper">
              <div className="price-label">Taxminiy Narx</div>
              <div className="price-value gradient-text">{formatUZS(totalPrice)}</div>
            </div>

            <div className="package-breakdown">
              <h4 className="breakdown-heading">Tanlangan xizmatlar tarkibi:</h4>
              <ul className="breakdown-list">
                <li className="breakdown-item">
                  <span className="item-dot cyan"></span>
                  <span>Yo'nalish: <strong>{
                    serviceType === 'wedding' ? "To'y & Love Story" :
                    serviceType === 'commercial' ? "Tijoriy / Reklama" :
                    serviceType === 'music' ? "Musiqiy Klip" : "Aerotasvir"
                  }</strong></span>
                </li>
                <li className="breakdown-item">
                  <span className="item-dot purple"></span>
                  <span>Jami tasmir vaqti: <strong>{hours} soat</strong></span>
                </li>
                <li className="breakdown-item">
                  <span className="item-dot pink"></span>
                  <span>Operatorlar tarkibi: <strong>{operators} ta mutaxassis</strong></span>
                </li>
                {useDrone && (
                  <li className="breakdown-item">
                    <span className="item-dot cyan"></span>
                    <span>Havo tasviri: <strong>FPV & Dron faol</strong></span>
                  </li>
                )}
                {useSde && (
                  <li className="breakdown-item">
                    <span className="item-dot purple"></span>
                    <span>SDE montaj: <strong>Tayyor va faol</strong></span>
                  </li>
                )}
                {useExpress && (
                  <li className="breakdown-item">
                    <span className="item-dot pink"></span>
                    <span>Yetkazib berish: <strong>Tezkor 48 soatda</strong></span>
                  </li>
                )}
              </ul>
            </div>

            <button 
              className="btn btn-primary btn-block calc-book-btn"
              onClick={handleBookPackage}
            >
              <Calendar size={18} /> Ushbu Paketni Band Qilish
            </button>
            
            <p className="calc-card-note">
              * Hisoblangan narx dastlabki smeta hisoblanadi. Yakuniy tafsilotlar uchrashuvda aniqlashtiriladi.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default PriceCalculator;
