import React, { useState } from 'react';
import { ShieldAlert, X, Terminal, Key } from 'lucide-react';
import './AdminLoginModal.css';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Default Credentials
    if (username === 'admin' && password === 'studio-joshqinbek-2026') {
      onLoginSuccess();
      setUsername('');
      setPassword('');
      onClose();
    } else {
      setError("Xatolik: Noto'g'ri login yoki parol!");
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-backdrop" onClick={onClose} />
      
      <div className="login-modal-content glass-panel pulse-border">
        {/* Top Header */}
        <div className="login-modal-header">
          <div className="terminal-header-title">
            <Terminal size={14} className="text-cyan" />
            <span>SECURE SYSTEM LOGIN</span>
          </div>
          <button className="login-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleLoginSubmit} className="login-modal-form">
          <div className="login-icon-box">
            <Key size={32} className="text-purple" />
          </div>

          <h3 className="login-title">Admin Portalga Kirish</h3>
          <p className="login-desc">Tizim ma'lumotlarini tahrirlash uchun parolni kiriting.</p>

          <div className="login-fields">
            {/* Username field */}
            <div className="login-field-wrapper">
              <label className="login-field-lbl">Login</label>
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="login-input"
                required
              />
            </div>

            {/* Password field */}
            <div className="login-field-wrapper">
              <label className="login-field-lbl">Parol</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="login-input"
                required
              />
            </div>
          </div>

          {/* Validation Error */}
          {error && (
            <div className="login-error-box">
              <ShieldAlert size={16} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-submit-btn">
            Tizimga ulanish
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginModal;
