import React, { useState } from "react";
import { 
  Landmark, 
  Crown, 
  MapPin, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Sparkles
} from "lucide-react";
import { StorageService } from "../services/storage";

export function LoginView({ regions, onLogin }) {
  const [selectedAccountId, setSelectedAccountId] = useState("karadeniz");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Seçilen hesabın detayları
  const isSelectedAdmin = selectedAccountId === "admin";
  const selectedRegion = regions.find((r) => r.id === selectedAccountId);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Lütfen giriş şifrenizi yazınız.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const isValid = StorageService.verifyPassword(selectedAccountId, password);

      if (isValid) {
        const sessionData = {
          role: isSelectedAdmin ? "admin" : "bolgeci",
          regionId: isSelectedAdmin ? null : selectedAccountId,
          accountTitle: isSelectedAdmin 
            ? "Genel Koordinatör (Admin)" 
            : `${selectedRegion?.name || "Bölge"} Temsilciliği`,
          coordinatorName: isSelectedAdmin 
            ? "Genel Merkez Teşkilatı" 
            : (selectedRegion?.defaultCoordinator || "Bölge Koordinatörü"),
          loginTime: new Date().toISOString()
        };

        StorageService.setSession(sessionData);
        onLogin(sessionData);
      } else {
        setError("Girdiğiniz şifre hatalı. Lütfen kontrol edip tekrar deneyiniz.");
        setIsSubmitting(false);
      }
    }, 250);
  };

  const handleQuickFill = (pwd) => {
    setPassword(pwd);
    setError("");
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-backdrop-glow"></div>

      <div className="login-card-container">
        {/* Üst Rönesans Arması & Başlık */}
        <div className="login-header text-center">
          <div className="login-crest-badge">
            <Landmark size={36} className="crest-svg-gold" />
          </div>
          
          <h1 className="font-royal login-title">
            İCATHANE <span className="gold-text">PRAEFECTUS</span>
          </h1>
          <p className="login-subtitle font-serif">
            Türkiye 7 Bölge İnovasyon & Atölye Yönetim Portalı
          </p>

          <div className="login-decor-divider">
            <span className="decor-star">✦</span>
            <span className="decor-line"></span>
            <span className="decor-crown">
              <Sparkles size={14} />
            </span>
            <span className="decor-line"></span>
            <span className="decor-star">✦</span>
          </div>
        </div>

        {/* Giriş Formu */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* 1. Bölge / Hesap Seçimi (Kullanıcı adı yazmak yok!) */}
          <div className="form-group">
            <label className="login-label font-royal">
              <MapPin size={16} className="label-icon-gold" />
              Giriş Yapılacak Bölgeyi / Yetkiyi Seçiniz
            </label>

            <div className="custom-select-wrapper">
              <select
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value);
                  setError("");
                }}
                className="login-select font-sans"
              >
                <optgroup label="── MERKEZİ YÖNETİM ──">
                  <option value="admin">
                    👑 Genel Koordinatörlük & Teşkilat Başkanlığı (Admin)
                  </option>
                </optgroup>
                <optgroup label="── 7 BÖLGE TEMSİLCİLİKLERİ ──">
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.romanId || "BÖLGE"} - {reg.name} ({reg.defaultCoordinator})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          {/* Seçilen Bölge Bilgi Kartı */}
          <div className="login-region-preview renaissance-card">
            <div className="preview-icon-wrap">
              {isSelectedAdmin ? (
                <Crown size={22} className="gold-text" />
              ) : (
                <MapPin size={22} className="gold-text" />
              )}
            </div>
            <div className="preview-details">
              <div className="preview-title font-royal">
                {isSelectedAdmin 
                  ? "Genel Merkez & Teşkilat Yönetimi" 
                  : `${selectedRegion?.romanId || ""} ${selectedRegion?.name || ""}`}
              </div>
              <div className="preview-meta font-sans">
                {isSelectedAdmin ? (
                  <span>Tüm Türkiye (7 Bölge, 81 İl, Tüm İcathaneler)</span>
                ) : (
                  <span>
                    Sorumlu: <strong>{selectedRegion?.defaultCoordinator}</strong> • {selectedRegion?.provinces?.length || 0} İl / Atölye
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Şifre Girişi */}
          <div className="form-group">
            <div className="label-with-hint">
              <label className="login-label font-royal">
                <Lock size={16} className="label-icon-gold" />
                Giriş Şifresi
              </label>
              <span className="login-hint-text">Bölge Giriş Anahtarı</span>
            </div>

            <div className="password-input-wrapper">
              <KeyRound size={18} className="input-prefix-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Şifrenizi yazınız..."
                className="login-input font-sans"
                autoFocus
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Şifreyi Gizle" : "Şifreyi Göster"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Hata Bildirimi */}
          {error && (
            <div className="login-error-alert animate-shake">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {/* Giriş Butonu */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-royal btn-login-submit"
          >
            {isSubmitting ? (
              <span>Doğrulanıyor...</span>
            ) : (
              <>
                <ShieldCheck size={18} />
                <span className="font-royal">GİRİŞ YAP</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>

          {/* Kolay Test & Bilgilendirme Kutucuğu */}
          <div className="login-helper-box">
            <div className="helper-header">
              <Sparkles size={13} className="gold-text" />
              <span>Varsayılan Sistem Şifreleri</span>
            </div>
            <div className="helper-body">
              <span>Bölge Temsilcileri: <code>1234</code></span>
              <span className="separator">•</span>
              <span>Admin: <code>admin123</code></span>
            </div>
            <div className="quick-fill-actions">
              <button
                type="button"
                className="btn-quick-tag"
                onClick={() => handleQuickFill(isSelectedAdmin ? "admin123" : "1234")}
              >
                Otomatik Doldur ({isSelectedAdmin ? "admin123" : "1234"})
              </button>
            </div>
          </div>
        </form>

        {/* Alt Rönesans Mührü */}
        <div className="login-footer text-center">
          <p className="font-serif">
            İcathane Praefectus v3.0 • Güvenli Bölge & Atölye İcraat Portalı
          </p>
        </div>
      </div>
    </div>
  );
}
