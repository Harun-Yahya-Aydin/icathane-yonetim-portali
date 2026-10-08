import React from "react";
import { 
  Crown, 
  Landmark, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Database, 
  Bell, 
  MapPin,
  CheckCircle2,
  BookOpen,
  Package,
  LayoutDashboard,
  AlertTriangle,
  LogOut
} from "lucide-react";

export function Navbar({
  currentRole,
  onRoleChange,
  currentPage,
  onPageChange,
  regions,
  weeks,
  currentWeekId,
  onWeekChange,
  theme,
  onThemeToggle,
  pendingRemindersCount,
  onOpenBackupModal,
  onOpenRemindersView,
  onLogout,
  session
}) {
  const currentWeek = weeks.find((w) => w.id === currentWeekId) || weeks[0];
  const currentWeekIndex = weeks.findIndex((w) => w.id === currentWeekId);

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      onWeekChange(weeks[currentWeekIndex - 1].id);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      onWeekChange(weeks[currentWeekIndex + 1].id);
    }
  };

  // Aktif Rol Bilgisi
  const selectedRegion = regions.find((r) => r.id === currentRole);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Sol Taraf: Rönesans Logosu & Başlık */}
        <div className="navbar-brand">
          <div className="brand-crest">
            <Landmark className="crest-icon" size={22} />
          </div>
          <div className="brand-titles">
            <div className="brand-main font-royal">
              İCATHANE <span className="gold-text">PRAEFECTUS</span>
            </div>
            <div className="brand-sub font-serif">
              Türkiye 7 Bölge & İcathane Koordinasyon Sistemi
            </div>
          </div>
        </div>

        {/* Ana Sayfa Menü Linkleri (Sayfa Gezgini) */}
        <div className="nav-main-links">
          <button
            className={`nav-link-btn ${currentPage === "dashboard" ? "active" : ""}`}
            onClick={() => onPageChange("dashboard")}
          >
            <LayoutDashboard size={15} />
            <span className="font-royal">Haftalık Takip</span>
          </button>

          <button
            className={`nav-link-btn ${currentPage === "notes" ? "active" : ""}`}
            onClick={() => onPageChange("notes")}
          >
            <BookOpen size={15} />
            <span className="font-royal">İl Not Arşivi</span>
          </button>

          <button
            className={`nav-link-btn ${currentPage === "inventory" ? "active" : ""}`}
            onClick={() => onPageChange("inventory")}
          >
            <Package size={15} />
            <span className="font-royal">Envanter</span>
          </button>

          <button
            className={`nav-link-btn ${currentPage === "requests" ? "active" : ""}`}
            onClick={() => onPageChange("requests")}
          >
            <AlertTriangle size={15} />
            <span className="font-royal">Malzeme Talepleri</span>
          </button>
        </div>

        {/* Orta: Hafta Seçici (Renaissance Week Navigator) */}
        <div className="week-navigator renaissance-card">
          <button 
            className="week-btn" 
            onClick={handlePrevWeek} 
            disabled={currentWeekIndex === 0}
            title="Önceki Hafta"
          >
            <ChevronLeft size={16} />
          </button>

          <div className="week-info">
            <Calendar size={15} className="week-icon" />
            <span className="week-label font-royal">
              {currentWeek?.label || "Hafta Seçiniz"}
            </span>
            {currentWeek?.isCurrent && (
              <span className="badge-emerald current-tag">Bu Hafta</span>
            )}
          </div>

          <button 
            className="week-btn" 
            onClick={handleNextWeek} 
            disabled={currentWeekIndex === weeks.length - 1}
            title="Sonraki Hafta"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Sağ Taraf: Rol Seçici (Admin / Bölgeci) ve Araçlar */}
        <div className="navbar-actions">
          {/* Rol Bilgisi (Normal Bölgeci için Kilitli, Sadece Admin Diğer Bölgeleri İnceleyebilir) */}
          <div className="role-selector-wrap">
            <div className="role-badge font-royal">
              {currentRole === "admin" ? (
                <Crown size={14} className="role-icon-gold" />
              ) : (
                <MapPin size={14} className="role-icon-gold" />
              )}
              <span className="role-name">
                {currentRole === "admin"
                  ? "Genel Koordinatör (Admin)"
                  : `${selectedRegion?.romanId || ""} ${selectedRegion?.name || "Bölge"}`}
              </span>
            </div>

            {/* Sadece Admin yetkisindekiler incelemek için bölge değiştirebilir */}
            {session?.role === "admin" && (
              <select
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value)}
                className="role-dropdown font-sans"
                title="Bölge Görünümünü Değiştir (Admin Yetkisi)"
              >
                <optgroup label="Yönetim Masası">
                  <option value="admin">👑 Genel Merkez & Admin Paneli</option>
                </optgroup>
                <optgroup label="7 Bölge İnceleme">
                  {regions.map((reg) => (
                    <option key={reg.id} value={reg.id}>
                      {reg.romanId} - {reg.name} ({reg.defaultCoordinator})
                    </option>
                  ))}
                </optgroup>
              </select>
            )}
          </div>

          {/* Hatırlatıcı / Bildirim Butonu */}
          <button 
            className="icon-btn reminder-btn" 
            onClick={onOpenRemindersView}
            title={`${pendingRemindersCount} Bekleyen Hatırlatma`}
          >
            <Bell size={18} />
            {pendingRemindersCount > 0 && (
              <span className="notification-bubble">{pendingRemindersCount}</span>
            )}
          </button>

          {/* Tema Değiştirici */}
          <button 
            className="icon-btn" 
            onClick={onThemeToggle}
            title={theme === "renaissance-dark" ? "Parşömen (Açık) Moduna Geç" : "Koyu Altın Moduna Geç"}
          >
            {theme === "renaissance-dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Çıkış Yap Butonu */}
          <button 
            className="btn-royal btn-sm btn-logout" 
            onClick={onLogout}
            title="Oturumu Kapat ve Giriş Ekranına Dön"
          >
            <LogOut size={15} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </header>
  );
}
