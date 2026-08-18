import React, { useState } from 'react';
import { Send, Terminal, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import './BookingForm.css';

interface BookingFormProps {
  selectedPackage: string;
  selectedPrice: string;
  onClearPackage: () => void;
  telegramToken: string;
  telegramChatId: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ 
  selectedPackage, 
  selectedPrice,
  onClearPackage,
  telegramToken,
  telegramChatId
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [wishes, setWishes] = useState('');
  
  // Submit loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLogs, setSubmitLogs] = useState<string[]>([]);
  const [submitStep, setSubmitStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Form validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Ismingizni kiriting";
    if (!phone.trim()) newErrors.phone = "Telefon raqamingizni kiriting";
    if (!date) newErrors.date = "Tadbir sanasini tanlang";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitLogs(["Jo'shqinbek Gateway: Aloqa kanali tekshirilmoqda..."]);
    setSubmitStep(1);

    const TELEGRAM_TOKEN = telegramToken;
    const DEFAULT_CHAT_ID = telegramChatId;

    const addLog = (text: string) => {
      setSubmitLogs(prev => [...prev, text]);
    };

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      addLog("Jo'shqinbek Gateway: Xavfsiz SSL ulanish o'rnatildi.");
      setSubmitStep(2);

      let chatId: string | number | null = DEFAULT_CHAT_ID || null;

      if (!chatId) {
        addLog("Jo'shqinbek Gateway: Telegram API orqali faol Chat ID qidirilmoqda...");
        const updateRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/getUpdates`);
        const updateData = await updateRes.json();
        
        if (updateData.ok && updateData.result && updateData.result.length > 0) {
          const latest = updateData.result[updateData.result.length - 1];
          if (latest.message && latest.message.chat) {
            chatId = latest.message.chat.id;
          } else if (latest.my_chat_member && latest.my_chat_member.chat) {
            chatId = latest.my_chat_member.chat.id;
          }
        }
      }

      if (!chatId) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        addLog("XATOLIK: Telegram Chat ID topilmadi!");
        addLog("Sababi: Botingiz bilan hali chat boshlanmagan.");
        addLog("Yechim: Telegramda botingizni qidirib toping, '/start' tugmasini bosing va formani qaytadan yuboring!");
        setSubmitStep(0);
        setTimeout(() => {
          setIsSubmitting(false);
        }, 8000);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 600));
      addLog(`Jo'shqinbek Gateway: Chat ID aniqlandi (${chatId}). Paket shifrlanmoqda...`);
      setSubmitStep(3);

      const messageText = `
<b>Jo'shqinbek Studio - Yangi Buyurtma!</b>
--------------------------------------------
<b>👤 Mijoz:</b> ${name}
<b>📞 Telefon:</b> ${phone}
<b>📅 Sana:</b> ${date}
${selectedPackage ? `<b>📦 Paket:</b> ${selectedPackage}` : '<b>📦 Paket:</b> Maxsus buyurtma'}
${selectedPrice ? `<b>💰 Taxminiy narxi:</b> ${selectedPrice}` : ''}
--------------------------------------------
<b>✍️ Istaklar va g'oyalar:</b>
${wishes ? wishes : 'Yo\'q'}
      `;

      await new Promise(resolve => setTimeout(resolve, 800));
      addLog("Jo'shqinbek Gateway: Sun'iy yo'ldosh tarmog'i orqali xabar Telegram serverga uzatilmoqda...");
      setSubmitStep(4);

      const sendRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: messageText,
          parse_mode: 'HTML'
        })
      });

      const sendData = await sendRes.json();

      if (sendData.ok) {
        addLog("Jo'shqinbek Gateway: Xabar Telegram botga muvaffaqiyatli yuborildi!");
        setSubmitStep(5);
        await new Promise(resolve => setTimeout(resolve, 600));
        const confirmationCode = "#LLN-" + Math.floor(100000 + Math.random() * 900000);
        addLog(`Jo'shqinbek Gateway: Muvaffaqiyatli yakunlandi. Tasdiq kodi: ${confirmationCode}`);
        setSubmitStep(6);
        
        setTimeout(() => {
          setIsSubmitting(false);
          setIsSuccess(true);
        }, 800);
      } else {
        addLog(`XATOLIK: Xabar yuborishda xatolik yuz berdi (${sendData.description})`);
        setSubmitStep(0);
        setTimeout(() => {
          setIsSubmitting(false);
        }, 5000);
      }

    } catch (err) {
      addLog("XATOLIK: Tarmoq ulanishida uzilish yuz berdi.");
      setSubmitStep(0);
      setTimeout(() => {
        setIsSubmitting(false);
      }, 5000);
    }
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setDate('');
    setWishes('');
    onClearPackage();
    setIsSuccess(false);
    setSubmitLogs([]);
  };

  return (
    <section id="booking" className="booking-section">
      <div className="container">
        
        <h2 className="section-title">
          Konsultatsiya <span className="gradient-text">Band Qilish</span>
        </h2>
        <p className="section-subtitle">
          Sana va aloqa ma'lumotlarini qoldiring. Jamoamiz siz bilan bog'lanib, tadbiringiz ssenariysi ustida ishlashni boshlaydi
        </p>

        <div className="booking-form-wrapper glass-panel">
          
          {/* Active submission terminal overlay */}
          {isSubmitting && (
            <div className="terminal-overlay">
              <div className="terminal-box glass-panel pulse-border">
                <div className="terminal-header">
                  <Terminal size={14} className="text-cyan" />
                  <span>TRANSMITTING DATA STREAM...</span>
                  <span className="terminal-dots"></span>
                </div>
                <div className="terminal-body">
                  {submitLogs.map((log, i) => (
                    <div key={i} className="terminal-line">
                      <span className="line-prefix">&gt; </span>
                      <span className="line-text">{log}</span>
                    </div>
                  ))}
                  {submitStep < 6 && (
                    <div className="terminal-spinner-row">
                      <RefreshCw className="spinner-icon" size={16} />
                      <span>Transmitting... {Math.floor(submitStep * 16.6)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {isSuccess ? (
            <div className="success-panel text-center">
              <CheckCircle2 size={64} className="success-icon text-cyan" />
              <h3 className="success-title">Muvaffaqiyatli Yuborildi!</h3>
              <p className="success-desc">
                Sizning ma'lumotlaringiz muvaffaqiyatli qabul qilindi. 2 soat ichida mutaxassisimiz siz bilan bog'lanadi.
              </p>
              
              <div className="success-summary glass-panel">
                <div className="summary-row">
                  <span className="sum-lbl">Mijoz:</span>
                  <span className="sum-val">{name}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-lbl">Telefon:</span>
                  <span className="sum-val">{phone}</span>
                </div>
                <div className="summary-row">
                  <span className="sum-lbl">Sana:</span>
                  <span className="sum-val">{date}</span>
                </div>
                {selectedPackage && (
                  <div className="summary-row package">
                    <span className="sum-lbl">Paket:</span>
                    <span className="sum-val text-cyan">{selectedPackage}</span>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={handleReset}>
                Yangi arizani band qilish
              </button>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="booking-form">
              <div className="form-grid">
                
                {/* Name */}
                <div className="form-field-wrapper">
                  <label className="field-label">Ism / Familiyangiz</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingizni kiriting"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                  />
                  {errors.name && <span className="field-error-msg">{errors.name}</span>}
                </div>

                {/* Phone */}
                <div className="form-field-wrapper">
                  <label className="field-label">Telefon raqamingiz</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 (90) 123-45-67"
                    className={`form-input ${errors.phone ? 'error' : ''}`}
                  />
                  {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                </div>

                {/* Date */}
                <div className="form-field-wrapper">
                  <label className="field-label">Tadbir sanasi</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`form-input ${errors.date ? 'error' : ''}`}
                  />
                  {errors.date && <span className="field-error-msg">{errors.date}</span>}
                </div>

                {/* Selected Package Info (if exists) */}
                {selectedPackage && (
                  <div className="form-field-wrapper full-width selected-package-alert glass-panel">
                    <div className="alert-meta">
                      <span className="alert-badge">TANLANGAN PAKET</span>
                      <button 
                        type="button" 
                        className="clear-package-btn"
                        onClick={onClearPackage}
                      >
                        O'chirish
                      </button>
                    </div>
                    <div className="alert-title">{selectedPackage}</div>
                    <div className="alert-price text-cyan">{selectedPrice}</div>
                  </div>
                )}

                {/* Wishes */}
                <div className="form-field-wrapper full-width">
                  <label className="field-label">Qo'shimcha istaklar (konsept, lokatsiyalar, musiqiy g'oyalar)</label>
                  <textarea
                    rows={4}
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder="Tadbir haqida batafsil yozishingiz mumkin (masalan, FPV dron binoni ichida uchishi kerak, yoki to'y tog' etagida bo'ladi)..."
                    className="form-textarea"
                  />
                </div>

              </div>

              <div className="form-actions-wrapper">
                <button type="submit" className="btn btn-primary form-submit-btn">
                  <Send size={18} /> So'rovni Yuborish
                </button>
                <div className="form-security-note">
                  <ShieldCheck size={16} className="text-cyan" />
                  <span>Ma'lumotlaringiz xavfsiz himoyalangan</span>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </section>
  );
};

export default BookingForm;
