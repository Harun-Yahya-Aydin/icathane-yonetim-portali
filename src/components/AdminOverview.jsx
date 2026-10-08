import React, { useState } from "react";
import {
  Crown,
  Landmark,
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  MapPin,
  Sparkles,
  Plus,
  Building,
  Award,
  Clock,
  ArrowRight,
  ShieldCheck,
  BellRing,
  BookOpen,
  Edit3,
  Search,
  Filter,
  CheckCircle2
} from "lucide-react";

export function AdminOverview({
  regions,
  weeks,
  currentWeekId,
  weeklyMetrics,
  programTemplates,
  programExecutions,
  agendas,
  onSelectRegion,
  onOpenNewTemplateModal,
  onOpenAddProgramModal,
  onOpenEditMetricsModal,
  adminCoordinatorNotes = {},
  onSaveAdminCoordinatorNotes,
  onSelectCenter
}) {
  const [adminTab, setAdminTab] = useState("regions"); // 'regions' | 'all_provinces' | 'programs'
  const [selectedRegionFilter, setSelectedRegionFilter] = useState("all");
  const [provinceSearch, setProvinceSearch] = useState("");

  const currentWeek = weeks.find((w) => w.id === currentWeekId) || weeks[0];

  // Hesaplamalar
  let totalProvinces = 0;
  let totalCenters = 0;
  let totalActiveIcathanes = 0;
  let totalPassiveIcathanes = 0;
  let totalApplications = 0;
  let totalEnrolled = 0;
  let totalAttended = 0;

  regions.forEach((reg) => {
    reg.provinces.forEach((p) => {
      totalProvinces++;
      const centers = p.centers || [];
      centers.forEach((c) => {
        totalCenters++;
        if (c.status === "active") totalActiveIcathanes++;
        if (c.status === "passive") totalPassiveIcathanes++;

        const metricKey = `${currentWeekId}_${p.name}_${c.id}`;
        const m = weeklyMetrics[metricKey] || weeklyMetrics[`${currentWeekId}_${p.name}`];
        if (m) {
          totalApplications += Number(m.applications) || 0;
          totalEnrolled += Number(m.enrolled) || 0;
          totalAttended += Number(m.attended) || 0;
        }
      });
    });
  });

  const overallAttendanceRate =
    totalEnrolled > 0 ? Math.round((totalAttended / totalEnrolled) * 100) : 0;

  // Bölge bazında istatistikler
  const regionStats = regions.map((reg) => {
    let totalRegCenters = 0;
    let activeCenters = 0;
    let apps = 0;
    let enr = 0;
    let att = 0;

    reg.provinces.forEach((p) => {
      const centers = p.centers || [];
      centers.forEach((c) => {
        totalRegCenters++;
        if (c.status === "active") activeCenters++;

        const metricKey = `${currentWeekId}_${p.name}_${c.id}`;
        const m = weeklyMetrics[metricKey] || weeklyMetrics[`${currentWeekId}_${p.name}`];
        if (m) {
          apps += Number(m.applications) || 0;
          enr += Number(m.enrolled) || 0;
          att += Number(m.attended) || 0;
        }
      });
    });

    const regAgendas = agendas.filter((a) => a.regionId === reg.id && a.status !== "Tamamlandı");
    const regPrograms = programExecutions.filter((p) => p.regionId === reg.id);

    return {
      ...reg,
      totalRegCenters,
      activeCenters,
      apps,
      enr,
      att,
      attendanceRate: enr > 0 ? Math.round((att / enr) * 100) : 0,
      activeAgendasCount: regAgendas.length,
      programsCount: regPrograms.length
    };
  });

  // Tüm merkezleri düz listeye çıkarma (Admin hızlı veri girişi için)
  const allCentersFlat = [];
  regions.forEach((reg) => {
    reg.provinces.forEach((prov) => {
      const centers = prov.centers || [];
      if (centers.length === 0) {
        allCentersFlat.push({
          provinceName: prov.name,
          centerId: null,
          centerName: null,
          district: null,
          status: "none",
          regionId: reg.id,
          regionName: reg.name
        });
      } else {
        centers.forEach((c, idx) => {
          allCentersFlat.push({
            provinceName: prov.name,
            centerId: c.id,
            centerName: c.name,
            district: c.district,
            status: c.status,
            isExtra: idx > 0,
            coordinator: c.coordinator,
            regionId: reg.id,
            regionName: reg.name
          });
        });
      }
    });
  });

  const filteredCenters = allCentersFlat.filter((item) => {
    if (selectedRegionFilter !== "all" && item.regionId !== selectedRegionFilter) return false;
    if (
      provinceSearch.trim() &&
      !item.provinceName.toLowerCase().includes(provinceSearch.toLowerCase().trim()) &&
      !(item.centerName && item.centerName.toLowerCase().includes(provinceSearch.toLowerCase().trim()))
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="admin-container">
      {/* Rönesans Üst Banner */}
      <div className="admin-hero renaissance-card">
        <div className="admin-hero-decor">✦ ✧ ✦</div>
        <div className="admin-hero-inner">
          <div className="hero-badge badge-gold font-royal">
            <Crown size={14} /> DİVAN-I HÜMAYUN / GENEL MERKEZ
          </div>
          <h1 className="admin-title font-royal">
            TÜRKİYE İCATHANE <span className="gold-text">KONSORSİYUMU</span>
          </h1>
          <p className="admin-subtitle font-serif">
            7 Coğrafi Bölge, 81 İl ve İlçe İcathanelerinin {currentWeek?.label} İtibarıyla Faaliyet ve Şube Takip Tablosu
          </p>
        </div>
      </div>

      {/* Makro KPI Kartları (Rönesans Altın Kartlar) */}
      <div className="kpi-grid">
        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--gold-primary)" }}>
            <Building size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Aktif İcathane Şubeleri</span>
            <div className="kpi-value font-royal">
              {totalActiveIcathanes} <span className="kpi-sub">/ {totalCenters} Toplam</span>
            </div>
            <span className="kpi-hint">
              {totalPassiveIcathanes > 0 ? `(${totalPassiveIcathanes} Şube bu sene pasif)` : "Tüm şubeler aktif"}
            </span>
          </div>
        </div>

        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--accent-lapis)" }}>
            <Users size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Bu Hafta Başvuran Öğrenci</span>
            <div className="kpi-value font-royal">{totalApplications.toLocaleString()}</div>
            <span className="kpi-hint">{currentWeek?.label} başvuruları</span>
          </div>
        </div>

        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--accent-amber)" }}>
            <GraduationCap size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Ders Alan / Kayıtlı</span>
            <div className="kpi-value font-royal">{totalEnrolled.toLocaleString()}</div>
            <span className="kpi-hint">Aktif sınıflardaki öğrenciler</span>
          </div>
        </div>

        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--accent-emerald)" }}>
            <CalendarCheck size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">O Hafta Gelen Öğrenci</span>
            <div className="kpi-value font-royal">
              {totalAttended.toLocaleString()}{" "}
              <span className="badge-emerald" style={{ fontSize: "0.75rem", verticalAlign: "middle" }}>
                %{overallAttendanceRate} Devam
              </span>
            </div>
            <span className="kpi-hint">Fiziki katılım sağlayan öğrenci sayısı</span>
          </div>
        </div>
      </div>

      {/* Admin Görünüm Sekmeleri */}
      <div className="tabs-navigation renaissance-card">
        <button
          className={`tab-btn ${adminTab === "regions" ? "active" : ""}`}
          onClick={() => setAdminTab("regions")}
        >
          <Landmark size={16} />
          <span>7 Bölge Matrisi</span>
        </button>

        <button
          className={`tab-btn ${adminTab === "all_provinces" ? "active" : ""}`}
          onClick={() => setAdminTab("all_provinces")}
        >
          <Edit3 size={16} />
          <span>Tüm Türkiye İlleri & Şubeleri Hızlı Veri Girişi ({allCentersFlat.length} Nokta)</span>
        </button>

        <button
          className={`tab-btn ${adminTab === "programs" ? "active" : ""}`}
          onClick={() => setAdminTab("programs")}
        >
          <Award size={16} />
          <span>Master Programlar & Protokol ({programExecutions.length})</span>
        </button>

        <button
          className={`tab-btn ${adminTab === "coordinator_notes" ? "active" : ""}`}
          onClick={() => setAdminTab("coordinator_notes")}
        >
          <BookOpen size={16} />
          <span>Bölge Koordinatörleri Değerlendirme Defteri</span>
        </button>
      </div>

      {/* SEKME 1: 7 BÖLGE ÖZET MATRİSİ */}
      {adminTab === "regions" && (
        <div className="tab-pane">
          <div className="section-header">
            <div>
              <h2 className="section-title font-royal" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Landmark size={20} className="gold-text" />
                <span>7 BÖLGE KOORDİNATÖRLÜĞÜ & İCRAATLER</span>
              </h2>
              <p className="section-subtitle font-serif">
                Bölge temsilcilerinin sorumluluk alanları ve haftalık icathane performansları
              </p>
            </div>
          </div>

          <div className="regions-grid">
            {regionStats.map((reg) => (
              <div key={reg.id} className="region-summary-card renaissance-card">
                <div className="reg-card-top">
                  <div>
                    <span className="reg-roman-id font-royal">{reg.romanId}</span>
                    <h3 className="reg-card-title font-royal">{reg.name}</h3>
                    <span className="reg-coord-badge">
                      Sorumlu: <strong>{reg.defaultCoordinator}</strong>
                    </span>
                  </div>
                  <div className="reg-badge-centers badge-gold">
                    {reg.activeCenters} Aktif / {reg.totalRegCenters} İcathane
                  </div>
                </div>

                <div className="renaissance-divider">✦</div>

                <div className="reg-metrics-row">
                  <div className="reg-stat-col">
                    <span className="reg-stat-label">Başvuru</span>
                    <span className="reg-stat-val font-royal">{reg.apps}</span>
                  </div>
                  <div className="reg-stat-col">
                    <span className="reg-stat-label">Ders Alan</span>
                    <span className="reg-stat-val font-royal">{reg.enr}</span>
                  </div>
                  <div className="reg-stat-col">
                    <span className="reg-stat-label">Gelen</span>
                    <span className="reg-stat-val font-royal" style={{ color: "var(--gold-light)" }}>
                      {reg.att}
                    </span>
                  </div>
                  <div className="reg-stat-col">
                    <span className="reg-stat-label">Devam</span>
                    <span className="reg-stat-val font-royal">%{reg.attendanceRate}</span>
                  </div>
                </div>

                <div className="reg-extra-info">
                  {reg.activeAgendasCount > 0 ? (
                    <span className="badge-amber" style={{ fontSize: "0.72rem" }}>
                      <BellRing size={12} style={{ marginRight: 4 }} />
                      {reg.activeAgendasCount} Aktif Gündem
                    </span>
                  ) : (
                    <span className="badge-emerald" style={{ fontSize: "0.72rem" }}>
                      <ShieldCheck size={12} style={{ marginRight: 4 }} />
                      Sakin
                    </span>
                  )}

                  {reg.programsCount > 0 && (
                    <span className="badge-gold" style={{ fontSize: "0.72rem" }}>
                      <Award size={12} style={{ marginRight: 4 }} />
                      {reg.programsCount} Program Kaydı
                    </span>
                  )}
                </div>

                <button
                  className="btn-royal reg-manage-btn"
                  onClick={() => onSelectRegion(reg.id)}
                >
                  <span>{reg.name} Masasına Geç</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEKME 2: TÜM TÜRKİYE İLLERİ & ADMİN HIZLI VERİ GİRİŞİ */}
      {adminTab === "all_provinces" && (
        <div className="tab-pane">
          <div className="filter-bar renaissance-card">
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
              <div className="form-group" style={{ minWidth: "180px" }}>
                <label className="form-label">Bölgeye Göre Filtrele:</label>
                <select
                  className="form-select font-royal"
                  value={selectedRegionFilter}
                  onChange={(e) => setSelectedRegionFilter(e.target.value)}
                >
                  <option value="all">🌍 Tüm Bölgeler</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: 1, minWidth: "220px" }}>
                <label className="form-label">İl veya Şube Adına Göre Ara:</label>
                <div className="search-box" style={{ width: "100%", maxWidth: "100%" }}>
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Örn: Samsun, Bafra, Trabzon, Fatih, Üsküdar..."
                    value={provinceSearch}
                    onChange={(e) => setProvinceSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="table-card renaissance-card">
            <div className="table-header-info">
              <h3 className="font-royal" style={{ fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Crown size={18} className="gold-text" />
                <span>Admin Doğrudan İl & İcathane Veri Giriş Masası</span>
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Admin olarak Türkiye'nin tüm İcathanelerine ait haftalık öğrenci sayılarını ve notlarını doğrudan buradan girebilirsiniz.
              </p>
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
                    <th>Bu Haftanın Notu</th>
                    <th style={{ textAlign: "right" }}>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCenters.map((item, idx) => {
                    const metricKey = item.centerId
                      ? `${currentWeekId}_${item.provinceName}_${item.centerId}`
                      : `${currentWeekId}_${item.provinceName}`;
                    const metrics = weeklyMetrics[metricKey] ||
                      weeklyMetrics[`${currentWeekId}_${item.provinceName}`] || {
                        applications: 0,
                        enrolled: 0,
                        attended: 0,
                        weeklyNote: ""
                      };

                    const provRate =
                      metrics.enrolled > 0 ? Math.round((metrics.attended / metrics.enrolled) * 100) : 0;

                    const isActive = item.status === "active";

                    return (
                      <tr
                        key={`${item.provinceName}-${item.centerId || idx}`}
                        style={{ opacity: item.status === "passive" ? 0.65 : 1 }}
                      >
                        <td>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "5px" }}>
                            <strong className="font-royal" style={{ fontSize: "1.02rem" }}>
                              {item.provinceName}
                            </strong>
                            {item.centerName && (
                              <span
                                className="icathane-badge font-royal"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  const reg = regions.find((r) => r.id === item.regionId);
                                  const prov = reg?.provinces.find((p) => p.name === item.provinceName);
                                  const centerObj = prov?.centers?.find((c) => c.id === item.centerId) || {
                                    id: item.centerId,
                                    name: item.centerName,
                                    district: item.district,
                                    status: item.status,
                                    coordinator: item.coordinator
                                  };
                                  onSelectCenter && onSelectCenter(prov, centerObj);
                                }}
                                title="Bu İcathanenin sayfasına git"
                              >
                                <Landmark size={12} className="gold-text" />
                                <span>{item.centerName}</span>
                              </span>
                            )}
                            {item.centerName && (
                              <button
                                className="btn-go-center font-royal"
                                onClick={() => {
                                  const reg = regions.find((r) => r.id === item.regionId);
                                  const prov = reg?.provinces.find((p) => p.name === item.provinceName);
                                  const centerObj = prov?.centers?.find((c) => c.id === item.centerId) || {
                                    id: item.centerId,
                                    name: item.centerName,
                                    district: item.district,
                                    status: item.status,
                                    coordinator: item.coordinator
                                  };
                                  onSelectCenter && onSelectCenter(prov, centerObj);
                                }}
                                title="Bu İcathanenin sayfasına git"
                              >
                                <span>İcathane Sayfasına Git</span>
                                <ArrowRight size={11} />
                              </button>
                            )}
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {item.regionName} {item.district && `• Bölge: ${item.district}`} {item.coordinator && `• Sorumlu: ${item.coordinator}`}
                            </div>
                          </div>
                        </td>

                        <td>
                          {item.status === "active" ? (
                            <span className="badge-emerald" style={{ fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <CheckCircle2 size={11} />
                              <span>Aktif</span>
                            </span>
                          ) : item.status === "passive" ? (
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
                          ) : (
                            <span className="badge-crimson" style={{ fontSize: "0.72rem" }}>
                              İcathane Yok
                            </span>
                          )}
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span className="font-royal metric-number">{metrics.applications || 0}</span>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span className="font-royal metric-number">{metrics.enrolled || 0}</span>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          <span className="font-royal metric-number highlight" style={{ color: "var(--gold-light)" }}>
                            {metrics.attended || 0}
                          </span>
                        </td>

                        <td style={{ textAlign: "center" }}>
                          {metrics.enrolled > 0 ? (
                            <span className="badge-gold font-royal">%{provRate}</span>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>-</span>
                          )}
                        </td>

                        <td>
                          {metrics.weeklyNote ? (
                            <div className="weekly-note-box font-serif" style={{ maxWidth: "260px" }}>
                              “{metrics.weeklyNote}”
                            </div>
                          ) : (
                            <span className="no-note-placeholder">Not girilmedi</span>
                          )}
                        </td>

                        <td style={{ textAlign: "right" }}>
                          <button
                            className="btn-outline-royal btn-sm"
                            onClick={() =>
                              onOpenEditMetricsModal(
                                item.provinceName,
                                item.centerId,
                                item.centerName,
                                metrics
                              )
                            }
                            title="Bu İcathane için haftalık verileri ve notu gir"
                          >
                            <Edit3 size={13} />
                            <span>Veri Gir</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SEKME 3: MASTER PROGRAMLAR & PROTOKOL */}
      {adminTab === "programs" && (
        <div className="tab-pane">
          {/* Master Program Şablonları */}
          <div className="admin-programs-section renaissance-card">
            <div className="programs-header-row">
              <div>
                <div className="badge-gold font-royal" style={{ marginBottom: 6 }}>
                  <Award size={14} /> MERKEZİ PROGRAM DİREKTİFLERİ
                </div>
                <h2 className="font-royal" style={{ fontSize: "1.3rem" }}>
                  Büyük Program Şablonları & Yıllık Zirveler
                </h2>
                <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  Admin olarak buraya eklediğiniz programlar, tüm 7 bölgecinin "Program Seç" listesinde otomatik olarak listelenir.
                </p>
              </div>

              <button className="btn-royal" onClick={onOpenNewTemplateModal}>
                <Plus size={16} />
                <span>Yeni Master Program Tanımla</span>
              </button>
            </div>

            <div className="templates-grid">
              {programTemplates.map((tmpl) => (
                <div key={tmpl.id} className="template-card">
                  <div className="template-top">
                    <span className="template-category badge-gold">{tmpl.category}</span>
                    <span className="template-creator font-serif">Tanımlayan: {tmpl.createdBy}</span>
                  </div>
                  <h4 className="template-title font-royal">{tmpl.title}</h4>
                  <p className="template-desc">{tmpl.description}</p>
                  <div className="template-footer">
                    <span className="template-audience">
                      Hedef Kitle: {tmpl.suggestedAudience}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gerçekleşen Programlar */}
          <div className="admin-executions-section renaissance-card">
            <div className="programs-header-row">
              <div>
                <h2 className="font-royal" style={{ fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Crown size={18} className="gold-text" />
                  <span>Türkiye Geneli Kayıtlı Büyük Programlar & Protokol Listesi</span>
                </h2>
                <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                  Bölgecilerin kendi illerinde gerçekleştirdiği salon, katılımcı ve protokol kayıtları
                </p>
              </div>
              <button className="btn-outline-royal" onClick={onOpenAddProgramModal}>
                <Plus size={14} />
                <span>Merkezden Program Kaydı Gir</span>
              </button>
            </div>

            <div className="executions-table-wrap">
              <table className="renaissance-table">
                <thead>
                  <tr>
                    <th>Program & Başlık</th>
                    <th>Bölge & İl</th>
                    <th>Tarih / Salon</th>
                    <th>Katılımcı Sayısı</th>
                    <th>Protokol Heyeti</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {programExecutions.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: "center", padding: "30px" }}>
                        Henüz kayıtlı bir program bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    programExecutions.map((prog) => (
                      <tr key={prog.id}>
                        <td>
                          <div className="font-royal" style={{ fontWeight: 600 }}>{prog.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            {prog.notes || "Özel not girilmedi"}
                          </div>
                        </td>
                        <td>
                          <span className="badge-gold">
                            <MapPin size={12} style={{ marginRight: 2 }} />
                            {prog.province}
                          </span>
                        </td>
                        <td>
                          <div><strong>{prog.date}</strong> {prog.time && `(${prog.time})`}</div>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{prog.venue}</div>
                        </td>
                        <td>
                          <span className="font-royal" style={{ fontSize: "1rem", color: "var(--gold-primary)" }}>
                            {prog.attendeeCount} Kişi
                          </span>
                          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", maxWidth: 180 }}>
                            {prog.attendeeNotes}
                          </div>
                        </td>
                        <td>
                          <div className="protocol-box font-serif">
                            {prog.protocol || "Protokol kaydı yok"}
                          </div>
                        </td>
                        <td>
                          {prog.status === "Tamamlandı" ? (
                            <span className="badge-emerald">Tamamlandı</span>
                          ) : (
                            <span className="badge-amber">Planlandı</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SEKME 4: BÖLGE KOORDİNATÖRLERİ DEĞERLENDİRME & ÖZEL NOTLAR DEFTERİ */}
      {adminTab === "coordinator_notes" && (
        <div className="tab-pane">
          <div className="section-header-row renaissance-card">
            <div>
              <span className="badge-gold font-royal">YÖNETİCİ ÖZEL DEFTERİ</span>
              <h2 className="font-royal" style={{ fontSize: "1.3rem", margin: "4px 0" }}>
                Bölge Koordinatörleri Değerlendirme & Takip Masası
              </h2>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Admin olarak 7 bölgenin koordinatörleri hakkında özel notlar alabilir, gelişim ve çalışma durumlarını kaydedebilirsiniz.
              </p>
            </div>
          </div>

          <div className="coordinator-notes-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "16px", marginTop: "16px" }}>
            {regions.map((reg) => {
              const currentNote = adminCoordinatorNotes[reg.id] || {
                text: "",
                rating: "Düzenli",
                updatedAt: "-"
              };

              return (
                <div key={reg.id} className="renaissance-card" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <span className="badge-gold font-royal" style={{ fontSize: "0.72rem" }}>
                        {reg.romanId}
                      </span>
                      <h3 className="font-royal" style={{ fontSize: "1.1rem", margin: "4px 0" }}>
                        {reg.name}
                      </h3>
                      <div className="font-serif" style={{ fontSize: "0.85rem", color: "var(--gold-light)" }}>
                        Sorumlu: <strong>{reg.defaultCoordinator}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Koordinatör Çalışma Notu</label>
                    <textarea
                      className="form-textarea font-serif"
                      rows="4"
                      placeholder={`${reg.defaultCoordinator} hakkında yönetici değerlendirme notu giriniz... (Örn: Raporlaması çok düzenli, atölye ziyaretleri planlandı)`}
                      defaultValue={currentNote.text}
                      id={`coord-note-${reg.id}`}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <label className="form-label" style={{ margin: 0 }}>Durum:</label>
                      <select
                        className="form-select font-royal"
                        style={{ fontSize: "0.75rem", padding: "4px 8px" }}
                        defaultValue={currentNote.rating || "Düzenli"}
                        id={`coord-rating-${reg.id}`}
                      >
                        <option value="Başarılı">🟢 Başarılı / Örnek</option>
                        <option value="Düzenli">🟡 Düzenli / Normal</option>
                        <option value="Takipte">🟠 Yakın Takip</option>
                        <option value="Destek Gerekli">🔴 Destek Gerekli</option>
                      </select>
                    </div>

                    <button
                      className="btn-royal btn-sm"
                      onClick={() => {
                        const textVal = document.getElementById(`coord-note-${reg.id}`)?.value || "";
                        const ratingVal = document.getElementById(`coord-rating-${reg.id}`)?.value || "Düzenli";
                        const updated = {
                          ...adminCoordinatorNotes,
                          [reg.id]: {
                            text: textVal,
                            rating: ratingVal,
                            updatedAt: new Date().toLocaleDateString("tr-TR")
                          }
                        };
                        onSaveAdminCoordinatorNotes(updated);
                      }}
                    >
                      <span>Notu Kaydet</span>
                    </button>
                  </div>

                  {currentNote.updatedAt && currentNote.updatedAt !== "-" && (
                    <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "right" }}>
                      Son Güncelleme: {currentNote.updatedAt}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
