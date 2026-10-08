import React, { useState } from "react";
import {
  ArrowLeft,
  Landmark,
  MapPin,
  User,
  CheckCircle2,
  Clock,
  Edit3,
  Package,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  Users,
  Calendar,
  AlertCircle,
  Settings,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  UserCheck,
  Shield
} from "lucide-react";

function getDaysElapsed(dateStr, createdAt) {
  try {
    let requestTime;
    if (createdAt && typeof createdAt === "number") {
      requestTime = createdAt;
    } else if (dateStr) {
      const parts = dateStr.split(".");
      if (parts.length === 3) {
        requestTime = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0])).getTime();
      } else {
        requestTime = new Date(dateStr).getTime();
      }
    }
    if (!requestTime || isNaN(requestTime)) return "Bugün";

    const diffMs = Date.now() - requestTime;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) return "Bugün (1. gün)";
    if (diffDays === 1) return "1 gündür sürüyor";
    return `${diffDays} gündür sürüyor`;
  } catch {
    return "Bugün";
  }
}

export function IcathaneDetailView({
  province,
  center,
  region,
  weeks = [],
  currentWeekId,
  weeklyMetrics = {},
  inventories = [],
  materialRequests = [],
  agendas = [],
  onBack,
  onOpenEditMetricsModal,
  onOpenManageIcathaneModal,
  onOpenAddMaterialRequestModal,
  onUpdateInventoryQuantity,
  onDeleteInventoryItem,
  onOpenAddInventoryModal
}) {
  const [detailTab, setDetailTab] = useState("weeks"); // 'weeks' | 'inventory' | 'requests' | 'agendas'

  if (!province || !center) {
    return (
      <div className="bolgeci-container">
        <button className="btn-outline-royal btn-sm" onClick={onBack}>
          <ArrowLeft size={14} /> <span>Geri Dön</span>
        </button>
        <div className="renaissance-card" style={{ padding: "30px", textAlign: "center" }}>
          İcathane bulunamadı.
        </div>
      </div>
    );
  }

  const isActive = center.status === "active";

  // Bu atölyeye ait 20 haftalık toplam metrikleri hesapla
  let totalApps = 0;
  let totalEnrolled = 0;
  let totalAttended = 0;

  const centerWeeksData = weeks.map((wk) => {
    const metricKey = `${wk.id}_${province.name}_${center.id}`;
    const metrics = weeklyMetrics[metricKey] ||
      weeklyMetrics[`${wk.id}_${province.name}`] || {
        applications: 0,
        enrolled: 0,
        attended: 0,
        weeklyNote: ""
      };

    totalApps += Number(metrics.applications || 0);
    totalEnrolled += Number(metrics.enrolled || 0);
    totalAttended += Number(metrics.attended || 0);

    const attRate =
      metrics.enrolled > 0
        ? Math.round((metrics.attended / metrics.enrolled) * 100)
        : 0;

    return {
      week: wk,
      metrics,
      attRate
    };
  });

  const overallAttendanceRate =
    totalEnrolled > 0 ? Math.round((totalAttended / totalEnrolled) * 100) : 0;

  // Bu ile/merkeze ait envanterler
  const centerInventories = inventories.filter(
    (item) => item.provinceName === province.name
  );

  // Bu merkeze ait malzeme talepleri
  const centerRequests = materialRequests.filter(
    (req) => req.provinceName === province.name
  );

  // Bu ile ait gündemler
  const centerAgendas = agendas.filter(
    (a) => a.province === province.name
  );

  return (
    <div className="bolgeci-container">
      {/* Üst Geri Butonu & Başlık */}
      <div className="detail-top-nav">
        <button className="btn-outline-royal btn-sm" onClick={onBack}>
          <ArrowLeft size={14} />
          <span>Haftalık Tabloya Dön</span>
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn-outline-royal btn-sm"
            onClick={() => onOpenManageIcathaneModal(province)}
          >
            <Settings size={14} />
            <span>Atölyeyi Düzenle</span>
          </button>
        </div>
      </div>

      {/* Hero Kartı: İcathane Özel Bilgileri */}
      <div className="renaissance-card center-hero-card">
        <div className="center-hero-main">
          <div className="center-hero-title-group">
            <span className="badge-gold font-royal" style={{ fontSize: "0.78rem" }}>
              {region?.name || "Bölge"} • {province.name}
            </span>
            <h2 className="font-royal center-hero-title">
              <Landmark size={24} className="gold-text" style={{ flexShrink: 0 }} />
              <span>{center.name}</span>
            </h2>
          </div>

          <div className="center-hero-badges">
            {isActive ? (
              <span className="badge-emerald" style={{ fontSize: "0.85rem", padding: "4px 12px" }}>
                <CheckCircle2 size={13} style={{ marginRight: 4 }} />
                <span>Aktif</span>
              </span>
            ) : (
              <span className="badge-crimson" style={{ fontSize: "0.85rem", padding: "4px 12px" }}>
                <Clock size={13} style={{ marginRight: 4 }} />
                <span>Pasif</span>
              </span>
            )}
          </div>
        </div>

        {/* İcathane / Atölye Sorumlusu Büyük Vurgu Kartı (Bölgeci Değil, Yerel Atölye Sorumlusu) */}
        <div className="center-responsible-banner">
          <div className="responsible-left">
            <div className="responsible-avatar-crest">
              <UserCheck size={26} />
            </div>
            <div className="responsible-text-group">
              <div className="responsible-badge-label font-royal">
                ✦ İCATHANE ATÖLYE SORUMLUSU
              </div>
              <div className="responsible-person-name font-royal">
                {center.coordinator || "Atölye Sorumlusu Atanmadı"}
              </div>
              <div className="responsible-details-sub font-serif">
                {province.name} İcathane Yönetimi • {center.district || "Merkez"} Yerleşkesi
              </div>
            </div>
          </div>

          <div className="responsible-right-meta">
            <div className="reg-bound-pill">
              <span className="reg-bound-label">Bağlı Olduğu Bölge</span>
              <span className="reg-bound-value font-royal">
                {region?.romanId} - {region?.name}
              </span>
            </div>

            <div className="reg-bound-pill">
              <span className="reg-bound-label">Bölge Koordinatörü</span>
              <span className="reg-bound-value font-royal" style={{ color: "var(--text-primary)" }}>
                {region?.defaultCoordinator || "Bölge Sorumlusu"}
              </span>
            </div>

            <button
              className="btn-outline-royal btn-sm"
              onClick={() => onOpenManageIcathaneModal(province)}
              title="İcathane sorumlusunu veya bilgilerini düzenle"
            >
              <Edit3 size={13} />
              <span>Sorumluyu Düzenle</span>
            </button>
          </div>
        </div>

        <div className="center-meta-grid">
          <div className="center-meta-item font-serif">
            <MapPin size={14} className="gold-text" />
            <div>
              <strong>İlçe / Konum:</strong> {center.district || "Merkez"}
            </div>
          </div>

          {center.address && (
            <div className="center-meta-item font-serif">
              <Landmark size={14} className="gold-text" />
              <div>
                <strong>Mekan / Adres:</strong> {center.address}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Makro KPI Özet Kartları */}
      <div className="stats-grid">
        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">20 Hafta Başvuru</span>
            <Users size={18} className="gold-text" />
          </div>
          <div className="stat-value font-royal">{totalApps}</div>
          <div className="stat-sub font-serif">Toplam başvuran öğrenci</div>
        </div>

        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Ders Alan / Katılan</span>
            <TrendingUp size={18} className="gold-text" />
          </div>
          <div className="stat-value font-royal">
            {totalAttended} <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>/ {totalEnrolled}</span>
          </div>
          <div className="stat-sub font-serif">Gelen öğrenci sayısı</div>
        </div>

        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Ortalama Devam</span>
            <Sparkles size={18} className="gold-text" />
          </div>
          <div className="stat-value font-royal">%{overallAttendanceRate}</div>
          <div className="stat-sub font-serif">Dönem geneli devamlılık</div>
        </div>

        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Kayıtlı Demirbaş</span>
            <Package size={18} className="gold-text" />
          </div>
          <div className="stat-value font-royal">{centerInventories.length}</div>
          <div className="stat-sub font-serif">Atölye ekipman kalemi</div>
        </div>
      </div>

      {/* Sekmeler: Haftalar, Envanter, Malzeme Talepleri, Gündem */}
      <div className="detail-tabs-bar">
        <button
          className={`detail-tab-btn ${detailTab === "weeks" ? "active" : ""}`}
          onClick={() => setDetailTab("weeks")}
        >
          <Calendar size={16} />
          <span>20 Haftalık Faaliyet & Not Çizelgesi</span>
        </button>

        <button
          className={`detail-tab-btn ${detailTab === "inventory" ? "active" : ""}`}
          onClick={() => setDetailTab("inventory")}
        >
          <Package size={16} />
          <span>Atölye Envanteri ({centerInventories.length})</span>
        </button>

        <button
          className={`detail-tab-btn ${detailTab === "requests" ? "active" : ""}`}
          onClick={() => setDetailTab("requests")}
        >
          <AlertTriangle size={16} />
          <span>Malzeme Talepleri ({centerRequests.length})</span>
        </button>

        <button
          className={`detail-tab-btn ${detailTab === "agendas" ? "active" : ""}`}
          onClick={() => setDetailTab("agendas")}
        >
          <ClipboardList size={16} />
          <span>İl Gündemleri & Notlar ({centerAgendas.length})</span>
        </button>
      </div>

      {/* SEKME 1: 20 HAFTALIK METRİK VE NOTLAR */}
      {detailTab === "weeks" && (
        <div className="table-card renaissance-card">
          <div className="table-header-info">
            <h3 className="font-royal" style={{ fontSize: "1.1rem" }}>
              📋 {center.name} — 20 Haftalık Eğitim Karnesi (17 Ekim Başlangıçlı)
            </h3>
            <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Bu atölyenin 20 hafta boyunca gerçekleşen başvuru, katılım ve haftalık özel not kayıtları
            </p>
          </div>

          <div className="table-responsive">
            <table className="renaissance-table">
              <thead>
                <tr>
                  <th>Eğitim Haftası</th>
                  <th style={{ textAlign: "center" }}>Başvuru</th>
                  <th style={{ textAlign: "center" }}>Ders Alan</th>
                  <th style={{ textAlign: "center" }}>Gelen Öğrenci</th>
                  <th style={{ textAlign: "center" }}>Devam Oranı</th>
                  <th>Haftalık Not & Gelişmeler</th>
                  <th style={{ textAlign: "right" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {centerWeeksData.map(({ week, metrics, attRate }) => {
                  const isCurrent = week.id === currentWeekId;
                  return (
                    <tr
                      key={week.id}
                      style={{
                        background: isCurrent ? "rgba(212, 175, 55, 0.05)" : "transparent"
                      }}
                    >
                      <td>
                        <strong className="font-royal" style={{ fontSize: "0.95rem" }}>
                          {week.label}
                        </strong>
                        {isCurrent && (
                          <span className="badge-emerald" style={{ fontSize: "0.68rem", marginLeft: 8 }}>
                            Seçili Hafta
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
                        <span className="font-royal metric-number" style={{ color: "var(--gold-light)" }}>
                          {metrics.attended || 0}
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <span className={`badge-gold font-royal ${metrics.enrolled === 0 ? "opacity-50" : ""}`}>
                          %{attRate}
                        </span>
                      </td>

                      <td>
                        {metrics.weeklyNote ? (
                          <div className="font-serif note-cell-text" title={metrics.weeklyNote}>
                            “{metrics.weeklyNote}”
                          </div>
                        ) : (
                          <span className="no-note-placeholder">Not girilmedi</span>
                        )}
                      </td>

                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-outline-royal btn-xs"
                          onClick={() =>
                            onOpenEditMetricsModal(
                              province.name,
                              metrics,
                              center.id,
                              center.name
                            )
                          }
                          title="Bu haftanın sayılarını veya notunu düzenle"
                        >
                          <Edit3 size={12} />
                          <span>Düzenle</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEKME 2: ATÖLYE DEMİRBAŞ ENVANTERİ */}
      {detailTab === "inventory" && (
        <div className="table-card renaissance-card">
          <div className="table-header-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="font-royal" style={{ fontSize: "1.1rem" }}>
                📦 {center.name} Demirbaş & Teçhizat Listesi
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                Atölyede bulunan 3D yazıcı, robotik kit, bilgisayar ve teçhizatların adet takibi
              </p>
            </div>

            <button
              className="btn-royal btn-sm"
              onClick={() => onOpenAddInventoryModal(province.name, center.name)}
            >
              <Plus size={14} />
              <span>+ Yeni Demirbaş Ekle</span>
            </button>
          </div>

          {centerInventories.length === 0 ? (
            <div className="empty-state-card font-serif" style={{ padding: "40px 20px", textAlign: "center" }}>
              <Package size={36} className="gold-text" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
              <p style={{ fontSize: "1rem" }}>Bu İcathane için henüz demirbaş kaydı eklenmedi.</p>
              <button
                className="btn-outline-royal btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => onOpenAddInventoryModal(province.name, center.name)}
              >
                <Plus size={13} />
                <span>İlk Demirbaşı Ekle</span>
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="renaissance-table">
                <thead>
                  <tr>
                    <th>Demirbaş / Ekipman Adı</th>
                    <th>Kategori</th>
                    <th style={{ textAlign: "center" }}>Mevcut Adet</th>
                    <th>Durum</th>
                    <th>Son Kontrol</th>
                    <th>Açıklama</th>
                    <th style={{ textAlign: "right" }}>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {centerInventories.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong className="font-royal" style={{ fontSize: "0.95rem" }}>
                          {item.itemName}
                        </strong>
                      </td>
                      <td>
                        <span className="badge-gold font-royal" style={{ fontSize: "0.72rem" }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                          <button
                            className="btn-ghost icon-only"
                            style={{ width: "24px", height: "24px", padding: 0 }}
                            onClick={() => onUpdateInventoryQuantity(item.id, Math.max(0, item.quantity - 1))}
                            title="1 Azalt"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-royal" style={{ fontSize: "1.1rem", fontWeight: 700, minWidth: "24px" }}>
                            {item.quantity}
                          </span>
                          <button
                            className="btn-ghost icon-only"
                            style={{ width: "24px", height: "24px", padding: 0 }}
                            onClick={() => onUpdateInventoryQuantity(item.id, item.quantity + 1)}
                            title="1 Arttır"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </td>
                      <td>
                        <span className="badge-emerald" style={{ fontSize: "0.72rem" }}>
                          {item.condition || "İyi"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        {item.lastChecked || "-"}
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {item.notes || "-"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="btn-ghost icon-only"
                          onClick={() => onDeleteInventoryItem(item.id)}
                          title="Demirbaşı Sil"
                        >
                          <Trash2 size={13} style={{ color: "var(--accent-crimson)" }} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SEKME 3: MALZEME TALEPLERİ */}
      {detailTab === "requests" && (
        <div className="table-card renaissance-card">
          <div className="table-header-info" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="font-royal" style={{ fontSize: "1.1rem" }}>
                🔔 {center.name} Malzeme & Sarf İhtiyaç Masası
              </h3>
              <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                “Şundan şu adet kaldı, şu kadar isteniyor” şeklinde atölye ihtiyaç ve sarf talepleri
              </p>
            </div>

            <button
              className="btn-royal btn-sm"
              onClick={() => onOpenAddMaterialRequestModal(province.name, center.id, center.name)}
            >
              <Plus size={14} />
              <span>+ Yeni Malzeme Talebi Gir</span>
            </button>
          </div>

          {centerRequests.length === 0 ? (
            <div className="empty-state-card font-serif" style={{ padding: "40px 20px", textAlign: "center" }}>
              <AlertTriangle size={36} className="gold-text" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
              <p style={{ fontSize: "1rem" }}>Bu atölye için henüz bekleyen veya girilen bir malzeme talebi yok.</p>
              <button
                className="btn-outline-royal btn-sm"
                style={{ marginTop: 12 }}
                onClick={() => onOpenAddMaterialRequestModal(province.name, center.id, center.name)}
              >
                <Plus size={13} />
                <span>+ Talep Oluştur</span>
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="renaissance-table">
                <thead>
                  <tr>
                    <th>Malzeme / Ekipman Adı</th>
                    <th style={{ textAlign: "center" }}>Kalan Mevcut</th>
                    <th style={{ textAlign: "center" }}>İstenen Miktar</th>
                    <th>Aciliyet</th>
                    <th>Talep Eden / Tarih</th>
                    <th>Durum</th>
                    <th>Açıklama / Gerekçe</th>
                  </tr>
                </thead>
                <tbody>
                  {centerRequests.map((req) => (
                    <tr key={req.id}>
                      <td>
                        <strong className="font-royal" style={{ fontSize: "0.95rem" }}>
                          {req.itemName}
                        </strong>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="badge-crimson font-royal" style={{ fontSize: "0.75rem" }}>
                          {req.currentStock || "0"} adet kaldı
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <span className="badge-gold font-royal" style={{ fontSize: "0.82rem", fontWeight: 700 }}>
                          {req.requestedQuantity}
                        </span>
                      </td>
                      <td>
                        <span
                          className={
                            req.urgency === "Acil"
                              ? "badge-crimson"
                              : req.urgency === "Orta"
                              ? "badge-amber"
                              : "badge-emerald"
                          }
                          style={{ fontSize: "0.72rem" }}
                        >
                          {req.urgency}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                        <div>{req.requestedBy || "Koordinatör"} • {req.date || "-"}</div>
                        <div style={{ marginTop: "3px" }}>
                          <span className="badge-amber font-royal" style={{ fontSize: "0.70rem", display: "inline-flex", alignItems: "center", gap: "3px" }}>
                            <Clock size={10} /> {getDaysElapsed(req.date, req.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          className={
                            req.status === "Tedarik Edildi"
                              ? "badge-emerald"
                              : req.status === "Onaylandı"
                              ? "badge-gold"
                              : "badge-amber"
                          }
                          style={{ fontSize: "0.72rem" }}
                        >
                          {req.status || "Bekliyor"}
                        </span>
                      </td>
                      <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                        {req.reason || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SEKME 4: İL GÜNDEMLERİ */}
      {detailTab === "agendas" && (
        <div className="table-card renaissance-card">
          <div className="table-header-info">
            <h3 className="font-royal" style={{ fontSize: "1.1rem" }}>
              📌 {province.name} İl Gündemleri & Hatırlatma Notları
            </h3>
            <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Bu ile ait aktif planlar, resmi temaslar ve koordinatör hatırlatmaları
            </p>
          </div>

          {centerAgendas.length === 0 ? (
            <div className="empty-state-card font-serif" style={{ padding: "40px 20px", textAlign: "center" }}>
              <ClipboardList size={36} className="gold-text" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
              <p style={{ fontSize: "1rem" }}>Bu il için kayıtlı aktif bir gündem veya hatırlatma bulunmuyor.</p>
            </div>
          ) : (
            <div className="agendas-list" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {centerAgendas.map((agenda) => (
                <div
                  key={agenda.id}
                  className="renaissance-card"
                  style={{
                    padding: "14px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    borderLeft: "3px solid var(--gold-primary)"
                  }}
                >
                  <div>
                    <strong className="font-royal" style={{ fontSize: "0.95rem" }}>
                      {agenda.title}
                    </strong>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: 2 }}>
                      {agenda.content}
                    </div>
                    {agenda.reminderDate && (
                      <div style={{ fontSize: "0.75rem", color: "var(--accent-amber)", marginTop: 4 }}>
                        Hatırlatma Tarihi: {agenda.reminderDate}
                      </div>
                    )}
                  </div>
                  <span className="badge-gold font-royal" style={{ fontSize: "0.72rem" }}>
                    {agenda.priority || "Normal"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
