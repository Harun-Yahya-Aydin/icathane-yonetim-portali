import React, { useState } from "react";
import {
  Landmark,
  MapPin,
  Calendar,
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  FileText,
  Bell,
  Clock,
  Plus,
  Edit3,
  CheckCircle,
  AlertCircle,
  Building,
  Award,
  Crown,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  BookOpen,
  Filter,
  Layers,
  ArrowRight
} from "lucide-react";

export function BolgeciDashboard({
  region,
  weeks,
  currentWeekId,
  weeklyMetrics,
  programTemplates,
  programExecutions,
  agendas,
  onOpenEditMetricsModal,
  onOpenManageIcathaneModal,
  onOpenAddAgendaModal,
  onOpenAddProgramModal,
  onToggleAgendaStatus,
  onDeleteAgenda,
  onDeleteProgram,
  onSelectCenter
}) {
  const [activeTab, setActiveTab] = useState("weekly"); // 'weekly' | 'icathanes' | 'agendas' | 'programs' | 'notes'
  const [provinceFilter, setProvinceFilter] = useState("all"); // 'all' | 'with_icathane'
  const [searchTerm, setSearchTerm] = useState("");

  const currentWeek = weeks.find((w) => w.id === currentWeekId) || weeks[0];

  // Bu bölgeye ait gündemler
  const regionAgendas = agendas.filter((a) => a.regionId === region.id);

  // Bu bölgeye ait programlar
  const regionPrograms = programExecutions.filter((p) => p.regionId === region.id);

  // Bu bölgedeki metrik hesaplamaları (Tüm merkezleri gezerek)
  let regionApps = 0;
  let regionEnrolled = 0;
  let regionAttended = 0;
  let totalCentersCount = 0;
  let activeCentersCount = 0;

  region.provinces.forEach((p) => {
    const centers = p.centers || [];
    centers.forEach((c) => {
      totalCentersCount++;
      if (c.status === "active") activeCentersCount++;

      const metricKey = `${currentWeekId}_${p.name}_${c.id}`;
      // fallback to province-level key if not set
      const m = weeklyMetrics[metricKey] || weeklyMetrics[`${currentWeekId}_${p.name}`];
      if (m) {
        regionApps += Number(m.applications) || 0;
        regionEnrolled += Number(m.enrolled) || 0;
        regionAttended += Number(m.attended) || 0;
      }
    });
  });

  const attendanceRate =
    regionEnrolled > 0 ? Math.round((regionAttended / regionEnrolled) * 100) : 0;

  // İlleri Filtreleme
  const filteredProvinces = region.provinces.filter((p) => {
    const centers = p.centers || [];
    if (provinceFilter === "with_icathane" && centers.length === 0) return false;
    if (searchTerm.trim() && !p.name.toLowerCase().includes(searchTerm.toLowerCase().trim())) {
      return false;
    }
    return true;
  });

  // Yaklaşan Hatırlatıcılar (Gündemler)
  const pendingReminders = regionAgendas.filter((a) => a.hasReminder && a.status !== "Tamamlandı");

  return (
    <div className="bolgeci-container">
      {/* Bölge Hero Kartı */}
      <div className="bolgeci-hero renaissance-card">
        <div className="hero-decor-line">✦ ✧ ✦</div>
        <div className="bolgeci-hero-content">
          <div className="hero-left">
            <span className="badge-gold font-royal">{region.romanId}</span>
            <h1 className="bolge-title font-royal">
              {region.name} <span className="gold-text">KOORDİNASYONU</span>
            </h1>
            <p className="bolge-desc font-serif">{region.description}</p>
            <div className="coord-info-tag">
              <Landmark size={14} className="gold-text" />
              <span>Bölge Temsilcisi: <strong>{region.defaultCoordinator}</strong></span>
              <span className="dot-sep">•</span>
              <MapPin size={14} className="gold-text" />
              <span>{region.provinces.length} İl ({activeCentersCount} Aktif / {totalCentersCount} Toplam İcathane)</span>
            </div>
          </div>

          <div className="hero-quick-stats">
            <div className="quick-stat-item">
              <span className="qs-label">Bu Hafta Başvuru</span>
              <span className="qs-value font-royal">{regionApps}</span>
              <span className="qs-sub">{currentWeek?.label}</span>
            </div>
            <div className="quick-stat-item">
              <span className="qs-label">Ders Alan Öğrenci</span>
              <span className="qs-value font-royal">{regionEnrolled}</span>
              <span className="qs-sub">Kayıtlı Havuz</span>
            </div>
            <div className="quick-stat-item highlight">
              <span className="qs-label">O Hafta Gelen</span>
              <span className="qs-value font-royal" style={{ color: "var(--gold-light)" }}>
                {regionAttended}
              </span>
              <span className="qs-sub badge-emerald">%{attendanceRate} Devam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigasyon Sekmeleri (Rönesans Tabs) */}
      <div className="tabs-navigation renaissance-card">
        <button
          className={`tab-btn ${activeTab === "weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          <CalendarCheck size={16} />
          <span>Haftalık İl & Şube Takibi</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "icathanes" ? "active" : ""}`}
          onClick={() => setActiveTab("icathanes")}
        >
          <Building size={16} />
          <span>İcathane Yönetimi</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "agendas" ? "active" : ""}`}
          onClick={() => setActiveTab("agendas")}
        >
          <Bell size={16} />
          <span>İl Gündemleri & Hatırlatmalar</span>
          {pendingReminders.length > 0 && (
            <span className="tab-bubble">{pendingReminders.length}</span>
          )}
        </button>

        <button
          className={`tab-btn ${activeTab === "programs" ? "active" : ""}`}
          onClick={() => setActiveTab("programs")}
        >
          <Award size={16} />
          <span>Büyük Programlar ({regionPrograms.length})</span>
        </button>

        <button
          className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
          onClick={() => setActiveTab("notes")}
        >
          <BookOpen size={16} />
          <span>Haftalık Not Defteri</span>
        </button>
      </div>

      {/* ==============================================================
          SEKME 1: HAFTALIK İL VE EKSTRA İCATHANE TAKİBİ
          ============================================================== */}
      {activeTab === "weekly" && (
        <div className="tab-pane">
          {/* Kontrol & Arama Çubuğu */}
          <div className="filter-bar renaissance-card">
            <div className="search-box">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="İl adına göre ara (Örn: Samsun, Trabzon...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-options">
              <button
                className={`filter-btn ${provinceFilter === "all" ? "active" : ""}`}
                onClick={() => setProvinceFilter("all")}
              >
                Tüm İller ({region.provinces.length})
              </button>
              <button
                className={`filter-btn ${provinceFilter === "with_icathane" ? "active" : ""}`}
                onClick={() => setProvinceFilter("with_icathane")}
              >
                İcathanesi Olanlar
              </button>
            </div>
          </div>

          {/* Haftalık İller Tablosu */}
          <div className="table-card renaissance-card">
            <div className="table-header-info">
              <div>
                <h3 className="font-royal" style={{ fontSize: "1.15rem" }}>
                  📋 {currentWeek?.label} Haftalık İl & İcathane Faaliyet Tablosu
                </h3>
                <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                  Bölgedeki tüm İcathanelerin haftalık başvuru, katılım ve il notları takibi
                </p>
              </div>
            </div>

            <div className="table-responsive">
              <table className="renaissance-table">
                <thead>
                  <tr>
                    <th>İl & İcathane Atölyesi</th>
                    <th>Bu Sene Durumu</th>
                    <th style={{ textAlign: "center" }}>Başvuru</th>
                    <th style={{ textAlign: "center" }}>Ders Alan</th>
                    <th style={{ textAlign: "center" }}>O Hafta Gelen</th>
                    <th style={{ textAlign: "center" }}>Devam Oranı</th>
                    <th>Bu Haftanın Notu & Açıklaması</th>
                    <th style={{ textAlign: "right" }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProvinces.map((prov) => {
                    const centers = prov.centers || [];

                    // Eğer ilde hiç İcathane yoksa
                    if (centers.length === 0) {
                      return (
                        <tr key={prov.name} className="row-no-icathane">
                          <td>
                            <div className="prov-cell-name">
                              <span className="prov-title font-royal">{prov.name}</span>
                              <span className="badge-crimson prov-badge">İcathane Yok</span>
                            </div>
                          </td>
                          <td>
                            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>
                          </td>
                          <td style={{ textAlign: "center" }}>-</td>
                          <td style={{ textAlign: "center" }}>-</td>
                          <td style={{ textAlign: "center" }}>-</td>
                          <td style={{ textAlign: "center" }}>-</td>
                          <td>
                            <span className="no-note-placeholder">İcathane bulunmuyor</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn-outline-royal btn-sm"
                              onClick={() => onOpenManageIcathaneModal(prov)}
                              title="Bu il için İcathane tanımla"
                            >
                              <Plus size={12} />
                              <span>İcathane Ata</span>
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    // İlde bir veya daha fazla İcathane varsa her birini satır olarak listele
                    return centers.map((center, cIdx) => {
                      const metricKey = `${currentWeekId}_${prov.name}_${center.id}`;
                      const metrics = weeklyMetrics[metricKey] ||
                        (cIdx === 0 ? weeklyMetrics[`${currentWeekId}_${prov.name}`] : null) || {
                          applications: 0,
                          enrolled: 0,
                          attended: 0,
                          weeklyNote: ""
                        };

                      const provAttendanceRate =
                        metrics.enrolled > 0
                          ? Math.round((metrics.attended / metrics.enrolled) * 100)
                          : 0;

                      const isActive = center.status === "active";

                      return (
                        <tr
                          key={`${prov.name}-${center.id}`}
                          style={{
                            background: cIdx > 0 ? "rgba(212, 175, 55, 0.02)" : "transparent",
                            opacity: isActive ? 1 : 0.65
                          }}
                        >
                          {/* İl & İcathane İsmi */}
                          <td>
                            <div className="prov-cell-name">
                              <strong className="prov-title font-royal" style={{ fontSize: "1.05rem" }}>
                                {prov.name}
                              </strong>
                              <span
                                className="icathane-badge font-royal"
                                style={{ cursor: "pointer" }}
                                onClick={() => onSelectCenter && onSelectCenter(prov, center)}
                                title="Bu İcathanenin sayfasına git"
                              >
                                <Landmark size={12} className="gold-text" />
                                <span>{center.name}</span>
                              </span>
                              <button
                                className="btn-go-center font-royal"
                                onClick={() => onSelectCenter && onSelectCenter(prov, center)}
                                title="Bu İcathanenin sayfasına git"
                              >
                                <span>İcathane Sayfasına Git</span>
                                <ArrowRight size={11} />
                              </button>
                            </div>
                            {(center.district || center.coordinator) && (
                              <div className="prov-coord-text font-serif">
                                {center.district && `Bölge: ${center.district}`}
                                {center.district && center.coordinator && " • "}
                                {center.coordinator && `Sorumlu: ${center.coordinator}`}
                              </div>
                            )}
                          </td>

                          {/* Aktif / Pasif Rozeti */}
                          <td>
                            {isActive ? (
                              <span className="badge-emerald" style={{ fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                <CheckCircle2 size={11} />
                                <span>Aktif</span>
                              </span>
                            ) : (
                              <span
                                className="badge-crimson"
                                style={{
                                  fontSize: "0.72rem",
                                  background: "rgba(150, 150, 150, 0.15)",
                                  color: "var(--text-muted)",
                                  borderColor: "rgba(150, 150, 150, 0.3)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}
                              >
                                <Clock size={11} />
                                <span>Pasif</span>
                              </span>
                            )}
                          </td>

                          {/* Başvuru */}
                          <td style={{ textAlign: "center" }}>
                            <span className="font-royal metric-number">
                              {metrics.applications || 0}
                            </span>
                          </td>

                          {/* Ders Alan */}
                          <td style={{ textAlign: "center" }}>
                            <span className="font-royal metric-number">
                              {metrics.enrolled || 0}
                            </span>
                          </td>

                          {/* O Hafta Gelen */}
                          <td style={{ textAlign: "center" }}>
                            <span
                              className="font-royal metric-number highlight"
                              style={{ color: "var(--gold-light)" }}
                            >
                              {metrics.attended || 0}
                            </span>
                          </td>

                          {/* Devam Oranı */}
                          <td style={{ textAlign: "center", minWidth: 100 }}>
                            {metrics.enrolled > 0 ? (
                              <div className="attendance-gauge-wrap">
                                <span className="badge-gold font-royal" style={{ fontSize: "0.75rem" }}>
                                  %{provAttendanceRate}
                                </span>
                              </div>
                            ) : (
                              <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>-</span>
                            )}
                          </td>

                          {/* Haftalık Not */}
                          <td>
                            {metrics.weeklyNote ? (
                              <div className="weekly-note-box font-serif">
                                “{metrics.weeklyNote}”
                              </div>
                            ) : (
                              <span className="no-note-placeholder">Not girilmedi</span>
                            )}
                          </td>

                          {/* İşlemler: Veri Gir & Şube Yönetimi */}
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "6px" }}>
                              <button
                                className="btn-outline-royal btn-sm"
                                onClick={() =>
                                  onOpenEditMetricsModal(prov.name, center.id, center.name, metrics)
                                }
                                title="Bu İcathane için haftalık sayıları ve notu gir"
                              >
                                <Edit3 size={12} />
                                <span>Veri Gir</span>
                              </button>

                              {cIdx === 0 && (
                                <button
                                  className="btn-ghost icon-only"
                                  onClick={() => onOpenManageIcathaneModal(prov)}
                                  title="Bu ilin İcathanelerini yönet"
                                >
                                  <Plus size={13} style={{ color: "var(--gold-primary)" }} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    });
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          SEKME 2: İCATHANE ATAMA & EKSTRA ŞUBE YÖNETİMİ
          ============================================================== */}
      {activeTab === "icathanes" && (
        <div className="tab-pane">
          <div className="info-banner renaissance-card">
            <div>
              <h3 className="font-royal" style={{ fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={18} className="gold-text" />
                <span>{region.name} İcathane Yönetim Masası</span>
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Her il için mevcut veya yeni açılan İcathaneleri tanımlayabilir, bu sene açık olanları <strong>Aktif</strong>, kapalı olanları <strong>Pasif</strong> olarak işaretleyebilirsiniz.
              </p>
            </div>
          </div>

          <div className="icathanes-grid">
            {region.provinces.map((prov) => {
              const centers = prov.centers || [];
              const hasCenters = centers.length > 0;

              return (
                <div
                  key={prov.name}
                  className={`icathane-card renaissance-card ${hasCenters ? "has-center" : "no-center"}`}
                >
                  <div className="ic-card-header">
                    <div>
                      <h4 className="font-royal ic-prov-name">{prov.name}</h4>
                      {!hasCenters && (
                        <span className="font-serif ic-status-tag">
                          <span className="badge-crimson">İcathane Yok</span>
                        </span>
                      )}
                    </div>

                    <button
                      className="btn-outline-royal btn-sm"
                      onClick={() => onOpenManageIcathaneModal(prov)}
                      title="İcathane ekle, düzenle veya aktif/pasif yap"
                    >
                      <Plus size={13} />
                      <span>{hasCenters ? "İcathaneleri Yönet" : "+ İcathane Ekle"}</span>
                    </button>
                  </div>

                  <div className="ic-card-body">
                    {centers.length === 0 ? (
                      <div style={{ color: "var(--text-muted)", fontSize: "0.82rem", fontStyle: "italic" }}>
                        Bu ilde henüz açılmış bir İcathane bulunmuyor.
                      </div>
                    ) : (
                      centers.map((c, idx) => (
                        <div
                          key={c.id}
                          style={{
                            padding: "8px",
                            background: "rgba(255, 255, 255, 0.03)",
                            borderRadius: "4px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "3px",
                            borderLeft: c.status === "active" ? "3px solid var(--accent-emerald)" : "3px solid var(--text-muted)"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "6px" }}>
                            <span
                              className="icathane-badge font-royal"
                              style={{ fontSize: "0.84rem", cursor: "pointer" }}
                              onClick={() => onSelectCenter && onSelectCenter(prov, c)}
                              title="Bu İcathanenin sayfasına git"
                            >
                              <Landmark size={12} className="gold-text" />
                              <span>{c.name}</span>
                            </span>
                            {c.status === "active" ? (
                              <span className="badge-emerald" style={{ fontSize: "0.68rem" }}>Aktif</span>
                            ) : (
                              <span className="badge-crimson" style={{ fontSize: "0.68rem" }}>Pasif</span>
                            )}
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                              {c.district && `Bölge: ${c.district}`} {c.coordinator && `• Sorumlu: ${c.coordinator}`}
                            </div>
                            <button
                              className="btn-outline-royal btn-xs"
                              onClick={() => onSelectCenter && onSelectCenter(prov, c)}
                              style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                            >
                              <span>Sayfasına Git</span>
                              <ArrowRight size={10} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==============================================================
          SEKME 3: İL GÜNDEMLERİ & HATIRLATMALAR
          ============================================================== */}
      {activeTab === "agendas" && (
        <div className="tab-pane">
          <div className="section-header-row renaissance-card">
            <div>
              <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
                🔔 {region.name} İl Olayları, Gündem & Hatırlatıcılar
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                İllerde gelişen olaylar, bürokratik temaslar veya yaklaşan önemli tarihler için gündem kaydı oluşturun.
              </p>
            </div>

            <button className="btn-royal" onClick={onOpenAddAgendaModal}>
              <Plus size={16} />
              <span>Yeni İl Gündemi / Hatırlatma Ekle</span>
            </button>
          </div>

          <div className="agendas-list">
            {regionAgendas.length === 0 ? (
              <div className="empty-card renaissance-card">
                <AlertCircle size={32} style={{ color: "var(--gold-primary)", margin: "0 auto 10px" }} />
                <h4 className="font-royal">Bu bölge için henüz kayıtlı gündem yok</h4>
                <p className="font-serif">
                  Bir ilde gerçekleşen önemli bir gelişmeyi veya yaklaşan bir etkinliği kaydetmek için yukarıdaki butonu kullanın.
                </p>
              </div>
            ) : (
              regionAgendas.map((agenda) => {
                const isCompleted = agenda.status === "Tamamlandı";

                return (
                  <div
                    key={agenda.id}
                    className={`agenda-card renaissance-card ${isCompleted ? "completed" : ""} ${
                      agenda.priority === "Acil" ? "priority-urgent" : ""
                    }`}
                  >
                    <div className="agenda-top">
                      <div className="agenda-tags">
                        <span className="badge-gold font-royal">
                          <MapPin size={12} style={{ marginRight: 3 }} />
                          {agenda.province}
                        </span>

                        {agenda.priority === "Acil" && (
                          <span className="badge-crimson font-royal" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={11} />
                            <span>ACİL GÜNDEM</span>
                          </span>
                        )}
                        {agenda.priority === "Yüksek" && (
                          <span className="badge-amber font-royal" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Sparkles size={11} />
                            <span>Yüksek Öncelik</span>
                          </span>
                        )}
                        {agenda.priority === "Normal" && (
                          <span className="badge-emerald font-royal">Standart Gündem</span>
                        )}

                        <span
                          className={isCompleted ? "badge-emerald" : "badge-amber"}
                          style={{ fontSize: "0.72rem" }}
                        >
                          Durum: {agenda.status}
                        </span>
                      </div>

                      <div className="agenda-actions">
                        <button
                          className="btn-ghost"
                          onClick={() => onToggleAgendaStatus(agenda.id)}
                          title={isCompleted ? "Bekliyor yap" : "Tamamlandı olarak işaretle"}
                        >
                          <CheckCircle2
                            size={16}
                            style={{ color: isCompleted ? "var(--accent-emerald)" : "var(--text-muted)" }}
                          />
                          <span>{isCompleted ? "Tamamlandı" : "Kapat"}</span>
                        </button>

                        <button
                          className="btn-ghost icon-only"
                          onClick={() => onDeleteAgenda(agenda.id)}
                          title="Gündemi Sil"
                        >
                          <Trash2 size={15} style={{ color: "var(--accent-crimson)" }} />
                        </button>
                      </div>
                    </div>

                    <h4 className="agenda-title font-royal">{agenda.title}</h4>
                    <p className="agenda-desc font-serif">{agenda.description}</p>

                    <div className="agenda-footer">
                      {agenda.hasReminder && agenda.reminderDate && (
                        <div className="reminder-pill">
                          <Clock size={13} className="reminder-icon" />
                          <span>Hatırlatma Tarihi: <strong>{agenda.reminderDate}</strong></span>
                        </div>
                      )}
                      <span className="agenda-date font-serif">Kayıt: {agenda.createdAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ==============================================================
          SEKME 4: BÜYÜK PROGRAMLAR & PROTOKOL KAYITLARI
          ============================================================== */}
      {activeTab === "programs" && (
        <div className="tab-pane">
          <div className="section-header-row renaissance-card">
            <div>
              <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
                <Award size={13} /> YILLIK ZİRVELER & FAALİYETLER
              </div>
              <h3 className="font-royal" style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Crown size={18} className="gold-text" />
                <span>{region.name} Büyük Program Takibi & Protokol Heyetleri</span>
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Admin tarafından tanımlanan "Mühendis Buluşması" gibi vizyon programlarını seçip salon, katılımcı sayısı ve vali/rektör protokol detaylarını kaydedin.
              </p>
            </div>

            <button className="btn-royal" onClick={onOpenAddProgramModal}>
              <Plus size={16} />
              <span>Yeni Program Kaydı Gir</span>
            </button>
          </div>

          <div className="programs-list">
            {regionPrograms.length === 0 ? (
              <div className="empty-card renaissance-card">
                <Award size={36} style={{ color: "var(--gold-primary)", margin: "0 auto 10px" }} />
                <h4 className="font-royal">Bu bölgede henüz kayıtlı bir büyük program yok</h4>
                <p className="font-serif">
                  "Mühendis Buluşması", "Girişimcilik Zirvesi" gibi gerçekleştirdiğiniz veya planladığınız etkinlikleri ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              regionPrograms.map((prog) => (
                <div key={prog.id} className="program-royal-card renaissance-card">
                  <div className="prog-header">
                    <div className="prog-main-titles">
                      <div className="prog-tags">
                        <span className="badge-gold font-royal">
                          <MapPin size={12} style={{ marginRight: 3 }} />
                          {prog.province}
                        </span>
                        {prog.status === "Tamamlandı" ? (
                          <span className="badge-emerald font-royal">Tamamlandı</span>
                        ) : (
                          <span className="badge-amber font-royal">Planlandı</span>
                        )}
                      </div>
                      <h4 className="prog-title font-royal">{prog.title}</h4>
                    </div>

                    <div className="prog-date-box font-royal">
                      <Calendar size={15} style={{ color: "var(--gold-primary)" }} />
                      <span>{prog.date}</span>
                      {prog.time && <span className="prog-time">{prog.time}</span>}
                    </div>
                  </div>

                  <div className="renaissance-divider">✦</div>

                  <div className="prog-details-grid">
                    <div className="prog-detail-box">
                      <span className="pdb-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Landmark size={13} className="gold-text" />
                        <span>Yapıldığı Salon / Mekan:</span>
                      </span>
                      <strong className="pdb-value font-royal">{prog.venue}</strong>
                    </div>

                    <div className="prog-detail-box">
                      <span className="pdb-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Users size={13} className="gold-text" />
                        <span>Katılan Kişi Sayısı:</span>
                      </span>
                      <div className="pdb-count font-royal">
                        {prog.attendeeCount} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Kişi</span>
                      </div>
                      <p className="pdb-notes font-serif">{prog.attendeeNotes}</p>
                    </div>

                    <div className="prog-detail-box full-width">
                      <span className="pdb-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Crown size={13} className="gold-text" />
                        <span>İştirak Eden Protokol Heyeti:</span>
                      </span>
                      <div className="protocol-container font-serif">
                        {prog.protocol || "Protokol bilgisi belirtilmedi."}
                      </div>
                    </div>
                  </div>

                  {prog.notes && (
                    <div className="prog-extra-notes font-serif">
                      <strong>Notlar:</strong> {prog.notes}
                    </div>
                  )}

                  <div className="prog-footer">
                    <button
                      className="btn-ghost icon-only"
                      onClick={() => onDeleteProgram(prog.id)}
                      title="Bu Program Kaydını Sil"
                    >
                      <Trash2 size={15} style={{ color: "var(--accent-crimson)" }} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==============================================================
          SEKME 5: HAFTALIK NOT DEFTERİ (FERMAN GÖRÜNÜMÜ)
          ============================================================== */}
      {activeTab === "notes" && (
        <div className="tab-pane">
          <div className="parchment-notebook renaissance-card">
            <div className="notebook-header">
              <span className="badge-gold font-royal">HAFTALIK İCRAAT DEFTERİ</span>
              <h3 className="font-royal" style={{ fontSize: "1.3rem", marginTop: 6 }}>
                📜 {region.name} - {currentWeek?.label} İcmal Notları
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
                Bölgedeki tüm illerin bu haftaya özel olarak bıraktığı sahadan haberler ve etkinlik hazırlıkları
              </p>
            </div>

            <div className="renaissance-divider">✧ ✦ ✧</div>

            <div className="notebook-entries">
              {region.provinces.flatMap((prov) => {
                const centers = prov.centers || [];
                return centers.map((c) => {
                  const mKey = `${currentWeekId}_${prov.name}_${c.id}`;
                  const m = weeklyMetrics[mKey] || weeklyMetrics[`${currentWeekId}_${prov.name}`];
                  return {
                    province: prov.name,
                    centerName: c.name,
                    district: c.district,
                    note: m?.weeklyNote
                  };
                });
              }).filter((entry) => entry.note && entry.note.trim().length > 0).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
                  Bu hafta için henüz hiçbir ile ait özel not girilmemiş. "Haftalık İl & Şube Takibi" sekmesinden illere not ekleyebilirsiniz.
                </div>
              ) : (
                region.provinces.flatMap((prov) => {
                  const centers = prov.centers || [];
                  return centers.map((c) => {
                    const mKey = `${currentWeekId}_${prov.name}_${c.id}`;
                    const m = weeklyMetrics[mKey] || weeklyMetrics[`${currentWeekId}_${prov.name}`];
                    if (!m?.weeklyNote) return null;

                    return (
                      <div key={`${prov.name}-${c.id}`} className="note-entry-item">
                        <div className="note-prov-header font-royal">
                          <MapPin size={14} className="gold-text" />
                          <span>
                            {prov.name} • {c.name} ({c.district || "Merkez"})
                          </span>
                        </div>
                        <div className="note-text-body font-serif">“{m.weeklyNote}”</div>
                      </div>
                    );
                  });
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
