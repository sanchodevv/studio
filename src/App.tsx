import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import type { Project } from './components/Portfolio';
import VideoModal from './components/VideoModal';
import PriceCalculator from './components/PriceCalculator';
import GearSection from './components/GearSection';
import BookingForm from './components/BookingForm';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanel from './components/AdminPanel';
import { Send, Mail, Phone, MapPin, Film, ShieldCheck } from 'lucide-react';
import { getSiteData, saveSiteData } from './utils/db';
import './App.css';

// Default static content which gets loaded if LocalStorage is empty
const INITIAL_DATA = {
  heroTitle: "Hissiyotlaringizni Kino San'atiga Aylantiramiz",
  heroDescription: "To'ylar, maxsus marosimlar, sevgi hikoyalari, tijoriy reklama va ultra-dinamik FPV dron tasvirlari. Biz sizning eng qadrli daqiqalaringizni kino darajasidagi 4K sifatda va betakror vizual uslubda muhrlaymiz.",
  stat1Val: "350+",
  stat1Label: "Baxtli Juftliklar",
  stat2Val: "4K UHD",
  stat2Label: "HDR Format",
  stat3Val: "8+ yil",
  stat3Label: "Tajriba",
  telegramToken: "8688264078:AAGfMk_9Vh560ogrmA69s7phkxWuht42z40",
  telegramChatId: "",
  services: [
    {
      id: 'wedding',
      title: "To'ylar va Love Story",
      description: "Hayotingizning eng baxtli kunini professional darajada muhrlash. Hissiyotlar, samimiylik va unutilmas lahzalar kino darajasida taqdim etiladi.",
      details: [
        "4K UHD HDR multi-kamera (2-4 kamera)",
        "Kinematik rang dizayni (Color Grading)",
        "Professional audio (Tashqi mikrofon va mikserdan yozish)",
        "Love Story (Oldindan suratga olingan syujet)",
        "SDE (Same Day Edit) - To'y kuni montaj qilib ko'rsatish"
      ],
      gradient: "linear-gradient(135deg, rgba(255, 0, 127, 0.15) 0%, rgba(185, 39, 252, 0.05) 100%)",
      glow: "rgba(255, 0, 127, 0.3)"
    },
    {
      id: 'commercial',
      title: "Tijoriy va Reklama",
      description: "Sizning brendingiz, mahsulotingiz yoki xizmatingiz uchun sotuvchi va ta'sirchan videolar. Biz biznesingizni yangi darajaga olib chiquvchi hikoyalar yaratamiz.",
      details: [
        "Biznes va startaplar uchun promo roliklar",
        "Ssenariy yozish va storyboarding xizmatlari",
        "Professional aktyorlar va diktorlarni tanlash",
        "Ijtimoiy tarmoqlar uchun reels va shorts formatlar",
        "Maxsus animatsiyalar va infografika (Motion graphics)"
      ],
      gradient: "linear-gradient(135deg, rgba(0, 242, 254, 0.15) 0%, rgba(79, 172, 254, 0.05) 100%)",
      glow: "rgba(0, 242, 254, 0.3)"
    },
    {
      id: 'music',
      title: "Musiqiy Kliplar",
      description: "Ijodkorlar va xonandalar uchun noodatiy konsepsiya va yuqori estetikaga ega kliplar. Har bir qo'shiqning ruhini tasvirlar orqali namoyon etamiz.",
      details: [
        "Konseptual va badiiy ssenariylar",
        "Lokatsiyalarni tanlash (Scouting) va dekoratsiya",
        "Murakkab dinamik yoritish tizimlari (Studio lighting)",
        "Studiya va tashqi muhitda murakkab tasmirlar",
        "Sound FX va musiqiy sinxron montaj"
      ],
      gradient: "linear-gradient(135deg, rgba(185, 39, 252, 0.15) 0%, rgba(255, 0, 127, 0.05) 100%)",
      glow: "rgba(185, 39, 252, 0.3)"
    },
    {
      id: 'fpv',
      title: "FPV Dron va Aerotasvir",
      description: "Tezkor FPV dronlar yordamida hayratlanarli va dinamik havo kadrlari. Standart drosslar ololmaydigan ekstremal burchaklar va uchishlar.",
      details: [
        "Yuqori tezlikdagi dinamik FPV uchishlari (100 km/soat+)",
        "Bino ichi va tor joylarda xavfsiz FPV parvozlar",
        "Cinematic DJI Inspire 3 aerotasvirlari",
        "6K ProRes va 4K 120fps yuqori chastotali tasvirlar",
        "Sport tadbirlari va avtoshoularni faol kuzatish"
      ],
      gradient: "linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(185, 39, 252, 0.1) 100%)",
      glow: "rgba(0, 242, 254, 0.25)"
    }
  ],
  portfolio: [
    {
      id: 'proj-1',
      title: "Sardor & Dilnoza - Cinematic Wedding Day",
      category: 'wedding',
      categoryLabel: "To'y marosimi",
      duration: "04:15",
      cameras: "Sony FX3 + Sony A7SIII",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-in-a-forest-41617-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      bgGradient: "linear-gradient(135deg, #ec008c 0%, #fc6767 100%)",
      date: "Avgust 2026"
    },
    {
      id: 'proj-2',
      title: "Chortoq Resort - Ekologik Turizm Promosi",
      category: 'commercial',
      categoryLabel: "Reklama / Tijoriy",
      duration: "01:30",
      cameras: "RED V-Raptor + DJI Inspire 3",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-flight-over-a-green-mountain-forest-41619-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
      bgGradient: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
      date: "Iyul 2026"
    },
    {
      id: 'proj-3',
      title: "Jasur Umirov - 'Yomg'irlar' (Official Music Video)",
      category: 'music',
      categoryLabel: "Musiqiy Klip",
      duration: "03:40",
      cameras: "ARRI Alexa Mini LF",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-under-neon-lights-41623-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
      bgGradient: "linear-gradient(135deg, #b927fc 0%, #e207b1 100%)",
      date: "Iyun 2026"
    },
    {
      id: 'proj-4',
      title: "Toshkent City - FPV Speed Run Chase",
      category: 'drone',
      categoryLabel: "FPV Dron / Aerotasvir",
      duration: "01:05",
      cameras: "GoPro Hero 12 (FPV Naked) + DJI Avata 2",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-of-a-woman-holding-a-vintage-camera-41620-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&w=800&q=80",
      bgGradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      date: "May 2026"
    },
    {
      id: 'proj-5',
      title: "Farrux & Nigora - Romantic Love Story",
      category: 'wedding',
      categoryLabel: "To'y marosimi",
      duration: "03:10",
      cameras: "Sony FX3 (Anamorphic Lenses)",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-wedding-couple-dancing-in-a-forest-41617-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=800&q=80",
      bgGradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
      date: "Aprel 2026"
    },
    {
      id: 'proj-6',
      title: "Evos Uzbekistan - Yangi Burger Kampaniyasi",
      category: 'commercial',
      categoryLabel: "Reklama / Tijoriy",
      duration: "00:45",
      cameras: "Sony FX6 (Macro Probe Lenses)",
      videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hand-of-a-woman-holding-a-vintage-camera-41620-large.mp4",
      thumbnail: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      bgGradient: "linear-gradient(135deg, #ffe259 0%, #ffa751 100%)",
      date: "Mart 2026"
    }
  ],
  gear: {
    camera: [
      {
        name: "RED V-Raptor 8K VV",
        type: "Flagman Cinema Kamera",
        description: "Kinematografiyaning eng yuqori cho'qqisi. Ushbu kamera Hollywood filmlari va yirik brend reklamalarini suratga olish uchun qo'llaniladi.",
        specs: [
          { label: "Rezolyutsiya (Rasm sifati)", value: "8K (8192 x 4320)", percentage: 98 },
          { label: "Dinamik Diapazon", value: "17+ stop", percentage: 95 },
          { label: "Kadr chastotasi (Slow-motion)", value: "8K 120fps / 2K 480fps", percentage: 90 },
          { label: "Rang chuqurligi", value: "16-bit REDCODE RAW", percentage: 96 }
        ],
        features: ["Kino-standart tasvir", "Ranglarni benuqson yetkazish", "Kam yorug'likda ajoyib ishlash"],
        techBadge: "8K RAW SYSTEM"
      },
      {
        name: "Sony FX3 Cinema Line",
        type: "Yengil Badiiy Kamera",
        description: "Netflix tomonidan tasdiqlangan va dinamik, ko'chma suratga olishlar (to'ylar, reportajlar, love story) uchun eng mukammal kamera.",
        specs: [
          { label: "Rezolyutsiya (Rasm sifati)", value: "4K UHD (3840 x 2160)", percentage: 85 },
          { label: "Dinamik Diapazon", value: "15 stop", percentage: 82 },
          { label: "Kadr chastotasi (Slow-motion)", value: "4K 120fps / FHD 240fps", percentage: 85 },
          { label: "Rang chuqurligi", value: "10-bit 4:2:2 S-Log3", percentage: 80 }
        ],
        features: ["Gibrid avtofokus", "Yarim tunda ham toza tasvir (Dual ISO)", "Ixcham va yengil dizayn"],
        techBadge: "ISO 409600 MAX"
      }
    ],
    drone: [
      {
        name: "DJI Inspire 3",
        type: "Professional Aerotasvir Droni",
        description: "Havo kinematografiyasining qiroli. Ikki kishi boshqaradigan (uchuvchi + operator) to'liq aylanuvchi kamerali dron.",
        specs: [
          { label: "Kamera rezolyutsiyasi", value: "8K ProRes RAW / DNxHR", percentage: 95 },
          { label: "Tezlik va manyovr", value: "94 km/soat", percentage: 75 },
          { label: "Parvoz davomiyligi", value: "28 daqiqa", percentage: 65 },
          { label: "Barqarorlik va shamolga chidamlilik", value: "RTK 1 sm aniqlik", percentage: 92 }
        ],
        features: ["Zenmuse X9-8K Air kamera", "To'liq 360 daraja gimbal", "FPV yo'nalish kamerasi"],
        techBadge: "PRO AERIAL 8K"
      },
      {
        name: "Custom FPV Cinematic Drone 7\"",
        type: "Tezkor Badiiy Dron",
        description: "Adrenalin va yuqori tezlikdagi kadrlar olish uchun maxsus yig'ilgan sport droni. Binolar orasidan tezkor o'tishlar va drift tasmirlari uchun.",
        specs: [
          { label: "Kamera rezolyutsiyasi", value: "4K 120fps (Naked GoPro/O3)", percentage: 80 },
          { label: "Maksimal tezlik", value: "140 km/soat+", percentage: 99 },
          { label: "Manyovrchanlik (Burilishlar)", value: "Akrobatik (3D parvoz)", percentage: 98 },
          { label: "Signal barqarorligi", value: "Crossfire / ELRS", percentage: 90 }
        ],
        features: ["Ekstremal tezkor harakatlar", "Gopro gyro barqarorlashtirish", "Yaqin masofadagi xavfli uchishlar"],
        techBadge: "140 KM/H TURBO"
      }
    ],
    gimbal: [
      {
        name: "DJI Ronin RS3 Pro + Transmission",
        type: "Kino Stabilizator Tizimi",
        description: "Kamerani 3 ta o'qda to'liq barqarorlashtiruvchi va tasvirni rejissyor monitoriga masofadan uzatuvchi tizim.",
        specs: [
          { label: "Yuk ko'tarish og'irligi", value: "4.5 kg gacha", percentage: 88 },
          { label: "Barqarorlashtirish sifati", value: "SuperSmooth algoritmi", percentage: 95 },
          { label: "Fokus tizimi", value: "LiDAR lazerli avtofokus", percentage: 90 },
          { label: "Simsiz uzatish masofasi", value: "6 km gacha (O3 Pro)", percentage: 85 }
        ],
        features: ["Lazerli LiDAR avtofokus", "Simsiz tasvir uzatish", "Avtomatik bloklanuvchi motorlar"],
        techBadge: "LiDAR AUTOFOCUS"
      },
      {
        name: "Sennheiser AVX & Zoom F8n",
        type: "Professional Ovoz Tizimi",
        description: "Kino darajasidagi ovoz yozish uskunalari. To'ylardagi nutqlar va shovqinli joylarda toza va tiniq ovoz yozish kafolati.",
        specs: [
          { label: "Ovoz yozish sifati", value: "24-bit / 192 kHz", percentage: 92 },
          { label: "Kanal sig'imi", value: "8 ta alohida mikrofon kirishi", percentage: 90 },
          { label: "Signal barqarorligi", value: "1.9 GHz avtomatik chastota", percentage: 88 },
          { label: "Shovqinni bostirish (Noise reduction)", value: "-127 dBu EIN", percentage: 94 }
        ],
        features: ["Mikserdan to'g'ridan-to'g'ri yozish", "Simsiz petlichkalar", "Kino darajasidagi toza ovoz"],
        techBadge: "24BIT STUDIO AUDIO"
      }
    ]
  }
};

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedPrice, setSelectedPrice] = useState<string>('');

  // Admin Portal state bindings
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminActive, setIsAdminActive] = useState(false);

  // Content Store synced with IndexedDB (IndexedDB has no 5MB limit like LocalStorage)
  const [siteData, setSiteData] = useState<any>(INITIAL_DATA);

  React.useEffect(() => {
    const loadData = async () => {
      const data = await getSiteData();
      if (data) {
        setSiteData(data);
      } else {
        // Migration check: check if LocalStorage has data
        const saved = localStorage.getItem('joshqinbek_studio_data');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSiteData(parsed);
            await saveSiteData(parsed);
          } catch (e) {}
        } else {
          // Initialize DB with initial data
          await saveSiteData(INITIAL_DATA);
        }
      }
    };
    loadData();
  }, []);

  const handleSaveSiteData = async (updatedData: any) => {
    setSiteData(updatedData);
    await saveSiteData(updatedData);
    try {
      localStorage.setItem('joshqinbek_studio_data', JSON.stringify(updatedData));
    } catch (e) {}
  };

  const handlePackageSelected = (summary: string, price: string) => {
    setSelectedPackage(summary);
    setSelectedPrice(price);
  };

  const handleClearPackage = () => {
    setSelectedPackage('');
    setSelectedPrice('');
  };

  if (isAdminActive) {
    return (
      <AdminPanel 
        data={siteData}
        onSave={handleSaveSiteData}
        onLogout={() => setIsAdminActive(false)}
      />
    );
  }

  return (
    <>
      {/* Cosmic background with grid overlays and glowing blur orbs */}
      <div className="cosmic-bg">
        <div className="orb orb-purple"></div>
        <div className="orb orb-cyan"></div>
      </div>

      {/* Navigation Header */}
      <Header />

      {/* Main Sections */}
      <main className="main-content-layout">
        <Hero 
          title={siteData.heroTitle}
          description={siteData.heroDescription}
          stat1Val={siteData.stat1Val}
          stat1Label={siteData.stat1Label}
          stat2Val={siteData.stat2Val}
          stat2Label={siteData.stat2Label}
          stat3Val={siteData.stat3Val}
          stat3Label={siteData.stat3Label}
        />
        
        <Services list={siteData.services} />
        
        <Portfolio 
          list={siteData.portfolio}
          onSelectProject={setSelectedProject} 
        />
        
        <GearSection list={siteData.gear} />
        
        <PriceCalculator onPackageSelected={handlePackageSelected} />
        
        <BookingForm 
          selectedPackage={selectedPackage}
          selectedPrice={selectedPrice}
          onClearPackage={handleClearPackage}
          telegramToken={siteData.telegramToken}
          telegramChatId={siteData.telegramChatId}
        />
      </main>

      {/* Custom Media Player Modal Overlay */}
      <VideoModal 
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* Admin Modules */}
      <AdminLoginModal 
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => setIsAdminActive(true)}
      />


      {/* Modern Futuristic Footer */}
      <footer className="footer-section">
        <div className="footer-divider-glow"></div>
        <div className="container">
          <div className="footer-grid">
            {/* Branding column */}
            <div className="footer-col branding">
              <div className="footer-logo">
                <Film className="footer-logo-icon text-cyan" size={22} />
                <span className="logo-text">
                  Jo'shqinbek<span className="gradient-text-alt font-heavy">Studio</span>
                </span>
              </div>
              <p className="footer-desc">
                Biz sizning eng yorqin hissiyotlaringiz va qadrli lahzalaringizni kino sifati darajasidagi kadrlarga aylantiruvchi zamonaviy kinematografiya studiyasimiz.
              </p>
              <div className="social-links">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn instagram" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="https://t.me" target="_blank" rel="noreferrer" className="social-icon-btn telegram" title="Telegram">
                  <Send size={18} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn youtube" title="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/><polygon points="10 15 15 12 10 9"/></svg>
                </a>
              </div>
            </div>

            {/* Navigation links column */}
            <div className="footer-col links">
              <h4 className="footer-col-title">Navigatsiya</h4>
              <ul className="footer-links-list">
                <li><a href="#home">Asosiy sahifa</a></li>
                <li><a href="#services">Xizmatlarimiz</a></li>
                <li><a href="#portfolio">Ijodiy ishlar</a></li>
                <li><a href="#gear">Texnik uskunalar</a></li>
                <li><a href="#prices">Narxlarimiz</a></li>
              </ul>
            </div>

            {/* Contacts Column */}
            <div className="footer-col contacts">
              <h4 className="footer-col-title">Aloqa Ma'lumotlari</h4>
              <ul className="footer-contacts-list">
                <li>
                  <Phone size={16} className="text-cyan" />
                  <a href="tel:+998901234567">+998 (90) 123-45-67</a>
                </li>
                <li>
                  <Phone size={16} className="text-purple" />
                  <a href="tel:+998939876543">+998 (93) 987-65-43</a>
                </li>
                <li>
                  <Mail size={16} className="text-pink" />
                  <a href="mailto:info@joshqinbekstudio.uz">info@joshqinbekstudio.uz</a>
                </li>
                <li>
                  <MapPin size={16} className="text-cyan" />
                  <span>Toshkent shahri, Yakkasaroy tumani</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Subfooter */}
          <div className="sub-footer">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} Jo'shqinbek Studio. Barcha huquqlar himoyalangan.
            </p>
            {/* Clickable icon acts as secret hidden trigger */}
            <div className="dev-credit">
              <ShieldCheck 
                size={14} 
                className="text-cyan cursor-pointer secret-admin-dot" 
                onClick={() => setIsAdminLoginOpen(true)}
              />
              <span>Future Cinematic Standard</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default App;
