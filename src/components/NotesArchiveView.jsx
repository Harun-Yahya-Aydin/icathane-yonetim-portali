import React, { useState } from "react";
import {
  BookOpen,
  MapPin,
  Calendar,
  Search,
  Filter,
  Plus,
  Edit3,
  TrendingUp,
  FileText,
  Clock,
  Printer,
  ChevronRight
} from "lucide-react";

export function NotesArchiveView({
  regions,
  weeks,
  currentWeekId,
  currentRole,
  weeklyMetrics,
  onOpenEditMetricsModal
}) {
  const isAdmin = currentRole === "admin";
  const activeRegion = regions.find((r) => r.id === currentRole) || regions[0];

  // Filtre durumları
  const [selectedRegionId, setSelectedRegionId] = useState(isAdmin ? "karadeniz" : activeRegion.id);
  const [selectedProvince, setSelectedProvince] = useState(
    isAdmin ? "Samsun" : activeRegion.provinces[0]?.name || "Samsun"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const currentRegion = regions.find((r) => r.id === selectedRegionId) || activeRegion;

  // Seçilen ile ait tüm haftalardaki notlar (Tarihsel sıralı)
  const provinceNotesHistory = weeks.map((week) => {
    const key = `${week.id}_${selectedProvince}`;
    const metrics = weeklyMetrics[key];
    return {
      week,
      metrics: metrics || { applications: 0, enrolled: 0, attended: 0, weeklyNote: "" },
      hasNote: Boolean(metrics?.weeklyNote && metrics.weeklyNote.trim().length > 0)
    };
  });

  // Arama filtresi: tüm illerde arama yapılıyorsa
  const allNotesMatchingSearch = [];
  if (searchQuery.trim().length > 1) {
    regions.forEach((reg) => {
      reg.provinces.forEach((prov) => {
        weeks.forEach((wk) => {
          const k = `${wk.id}_${prov.name}`;
          const m = weeklyMetrics[k];
          if (m?.weeklyNote && m.weeklyNote.toLowerCase().includes(searchQuery.toLowerCase())) {
            allNotesMatchingSearch.push({
              regionName: reg.name,
              provinceName: prov.name,
              weekLabel: wk.label,
              weekId: wk.id,
              note: m.weeklyNote,
              metrics: m
            });
          }
        });
      });
    });
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bolgeci-container">
      {/* Başlık ve Açıklama Hero */}
      <div className="bolgeci-hero renaissance-card">
        <div className="hero-decor-line">✦ ✧ ✦</div>
        <div className="bolgeci-hero-content">
          <div className="hero-left">
            <span className="badge-gold font-royal">TARİHSEL İL RAPORLARI</span>
            <h1 className="bolge-title font-royal">
              İL NOT DEFTERİ & <span className="gold-text">GELİŞİM ARŞİVİ</span>
            </h1>
            <p className="bolge-desc font-serif">
              Her ilin haftalar boyunca kaydedilen tüm saha notlarını, etkinlik hazırlıklarını ve gelişmelerini kronolojik olarak inceleyin ve değerlendirin.
            </p>
          </div>

          <div className="navbar-actions">
            <button className="btn-outline-royal" onClick={handlePrint} title="Notları Yazdır / PDF Al">
              <Printer size={15} />
              <span>Yazdır / İcmal Çıkar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kontrol & İl Seçim Çubuğu */}
      <div className="filter-bar renaissance-card">
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          {/* Admin ise Bölge Seçici */}
          {isAdmin && (
            <div className="form-group" style={{ minWidth: "180px" }}>
              <label className="form-label">Bölge Seçimi:</label>
              <select
                className="form-select font-royal"
                value={selectedRegionId}
                onChange={(e) => {
                  const regId = e.target.value;
                  setSelectedRegionId(regId);
                  const reg = regions.find((r) => r.id === regId);
                  if (reg?.provinces[0]) setSelectedProvince(reg.provinces[0].name);
                }}
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* İl Seçici */}
          <div className="form-group" style={{ minWidth: "200px" }}>
            <label className="form-label">İncelenecek İl:</label>
            <select
              className="form-select font-royal"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              {currentRegion.provinces.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notlarda Arama Yap */}
          <div className="form-group" style={{ flex: 1, minWidth: "240px" }}>
            <label className="form-label">Notlar İçinde Kelime / Konu Ara:</label>
            <div className="search-box" style={{ width: "100%", maxWidth: "100%" }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Örn: TÜBİTAK, etkinlik, valilik ziyareti, robotik..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arama Sonuçları Varsa */}
      {searchQuery.trim().length > 1 ? (
        <div className="table-card renaissance-card">
          <h3 className="font-royal" style={{ fontSize: "1.1rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Search size={16} className="gold-text" />
            <span>"{searchQuery}" İçin Bulunan Notlar ({allNotesMatchingSearch.length})</span>
          </h3>
          <div className="notebook-entries">
            {allNotesMatchingSearch.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)" }}>
                Aramanızla eşleşen bir not bulunamadı.
              </div>
            ) : (
              allNotesMatchingSearch.map((item, idx) => (
                <div key={idx} className="note-entry-item">
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span className="badge-gold font-royal">
                      <MapPin size={12} /> {item.provinceName} ({item.regionName})
                    </span>
                    <span className="font-royal" style={{ fontSize: "0.8rem", color: "var(--gold-light)" }}>
                      {item.weekLabel}
                    </span>
                  </div>
                  <div className="note-text-body font-serif">“{item.note}”</div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Seçili İle Ait Kronolojik Tarihsel Not Zaman Çizelgesi */
        <div className="timeline-container">
          <div className="section-header-row renaissance-card" style={{ marginBottom: "16px" }}>
            <div>
              <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
                <MapPin size={12} /> {selectedProvince} İLİ TARİHSEL HAFTALIK ARŞİVİ
              </div>
              <h3 className="font-royal" style={{ fontSize: "1.25rem" }}>
                {selectedProvince} İli Notları ve Haftalık Faaliyet Günlüğü
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
                Tüm haftalarda bu il için girilen notlar, öğrenci katılım sayılarıyla birlikte aşağıda listelenmektedir.
              </p>
            </div>

            <button
              className="btn-royal"
              onClick={() => {
                const currentWeekData = weeklyMetrics[`${currentWeekId}_${selectedProvince}`] || {
                  applications: 0,
                  enrolled: 0,
                  attended: 0,
                  weeklyNote: ""
                };
                onOpenEditMetricsModal(selectedProvince, currentWeekData);
              }}
            >
              <Plus size={16} />
              <span>Bu İle Not / Veri Ekle</span>
            </button>
          </div>

          <div className="timeline-list">
            {provinceNotesHistory.map((item) => {
              const { week, metrics, hasNote } = item;
              const attRate =
                metrics.enrolled > 0 ? Math.round((metrics.attended / metrics.enrolled) * 100) : 0;

              return (
                <div
                  key={week.id}
                  className={`timeline-card renaissance-card ${week.isCurrent ? "is-current-week" : ""} ${
                    !hasNote ? "empty-note" : ""
                  }`}
                >
                  <div className="tl-header">
                    <div className="tl-week-badge">
                      <Calendar size={14} className="gold-text" />
                      <span className="font-royal" style={{ fontWeight: 700 }}>
                        {week.label}
                      </span>
                      {week.isCurrent && <span className="badge-emerald">Aktif Hafta</span>}
                    </div>

                    <div className="tl-metrics-mini">
                      <span>Başvuru: <strong>{metrics.applications || 0}</strong></span>
                      <span className="dot-sep">•</span>
                      <span>Ders Alan: <strong>{metrics.enrolled || 0}</strong></span>
                      <span className="dot-sep">•</span>
                      <span>Gelen: <strong style={{ color: "var(--gold-light)" }}>{metrics.attended || 0}</strong></span>
                      {metrics.enrolled > 0 && (
                        <span className="badge-gold" style={{ fontSize: "0.72rem", marginLeft: "6px" }}>
                          %{attRate} Devam
                        </span>
                      )}
                    </div>

                    <button
                      className="btn-outline-royal btn-sm"
                      onClick={() => onOpenEditMetricsModal(selectedProvince, metrics)}
                      title="Bu haftanın notunu veya sayılarını düzenle"
                    >
                      <Edit3 size={13} />
                      <span>{hasNote ? "Düzenle" : "Not Ekle"}</span>
                    </button>
                  </div>

                  <div className="tl-content">
                    {hasNote ? (
                      <div className="tl-note-quote font-serif">
                        <span className="note-quote">“</span>
                        {metrics.weeklyNote}
                      </div>
                    ) : (
                      <div className="tl-no-note font-serif">
                        Bu hafta için henüz bir not girilmemiş. Yukarıdaki "Not Ekle" butonuna basarak not yazabilirsiniz.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
