import React, { useState } from "react";
import {
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Filter,
  Search,
  Building,
  Package,
  Layers,
  Check,
  X
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

export function MaterialRequestsView({
  materialRequests = [],
  regions = [],
  currentRole,
  onOpenAddModal,
  onUpdateRequestStatus,
  onDeleteRequest
}) {
  const isAdmin = currentRole === "admin";
  const activeRegion = regions.find((r) => r.id === currentRole) || regions[0];

  const [selectedRegionId, setSelectedRegionId] = useState(isAdmin ? "all" : activeRegion.id);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Filtreleme
  const filteredRequests = materialRequests.filter((req) => {
    // Bölge filtresi
    if (selectedRegionId !== "all") {
      const reg = regions.find((r) => r.id === selectedRegionId);
      const isProvInRegion = reg?.provinces.some((p) => p.name === req.provinceName);
      if (!isProvInRegion) return false;
    }

    // Durum filtresi
    if (selectedStatus !== "all" && req.status !== selectedStatus) {
      return false;
    }

    // Arama
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchItem = req.itemName?.toLowerCase().includes(term);
      const matchProv = req.provinceName?.toLowerCase().includes(term);
      const matchCenter = req.centerName?.toLowerCase().includes(term);
      if (!matchItem && !matchProv && !matchCenter) return false;
    }

    return true;
  });

  const pendingCount = materialRequests.filter((r) => r.status === "Bekliyor").length;
  const approvedCount = materialRequests.filter((r) => r.status === "Onaylandı").length;
  const fulfilledCount = materialRequests.filter((r) => r.status === "Tedarik Edildi").length;

  return (
    <div className="bolgeci-container">
      {/* Üst Başlık & Eylemler */}
      <div className="section-header-row renaissance-card">
        <div>
          <span className="badge-gold font-royal">İHTİYAÇ & İKMAL MASASI</span>
          <h2 className="font-royal" style={{ fontSize: "1.35rem", margin: "4px 0" }}>
            İllerin Malzeme & Teçhizat Talepleri
          </h2>
          <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            “Şundan şu adet kaldı, şu kadar isteniyor” sarf ve ekipman taleplerinin takibi ve onay masası
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button className="btn-royal" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>+ Yeni Malzeme Talebi Gir</span>
          </button>
        </div>
      </div>

      {/* Makro Sayıcılar */}
      <div className="stats-grid">
        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Toplam Talep</span>
            <Layers size={18} className="gold-text" />
          </div>
          <div className="stat-value font-royal">{materialRequests.length}</div>
          <div className="stat-sub font-serif">Kayıtlı talep adedi</div>
        </div>

        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Bekleyen Talepler</span>
            <Clock size={18} style={{ color: "var(--accent-amber)" }} />
          </div>
          <div className="stat-value font-royal" style={{ color: "var(--accent-amber)" }}>
            {pendingCount}
          </div>
          <div className="stat-sub font-serif">İnceleme bekliyor</div>
        </div>

        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Onaylananlar</span>
            <CheckCircle2 size={18} style={{ color: "var(--gold-primary)" }} />
          </div>
          <div className="stat-value font-royal">{approvedCount}</div>
          <div className="stat-sub font-serif">Satın alma sürecinde</div>
        </div>

        <div className="stat-card renaissance-card">
          <div className="stat-header">
            <span className="stat-title font-serif">Tedarik Edilen</span>
            <CheckCircle2 size={18} style={{ color: "var(--accent-emerald)" }} />
          </div>
          <div className="stat-value font-royal" style={{ color: "var(--accent-emerald)" }}>
            {fulfilledCount}
          </div>
          <div className="stat-sub font-serif">Atölyeye teslim edildi</div>
        </div>
      </div>

      {/* Filtre Barı */}
      <div className="renaissance-card" style={{ padding: "14px 18px", display: "flex", gap: "14px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          {isAdmin && (
            <div className="form-group" style={{ minWidth: "180px", margin: 0 }}>
              <select
                className="form-select font-royal"
                value={selectedRegionId}
                onChange={(e) => setSelectedRegionId(e.target.value)}
              >
                <option value="all">Tüm Bölgeler</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group" style={{ minWidth: "160px", margin: 0 }}>
            <select
              className="form-select font-royal"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">Tüm Durumlar</option>
              <option value="Bekliyor">Bekleyenler</option>
              <option value="Onaylandı">Onaylananlar</option>
              <option value="Tedarik Edildi">Tedarik Edilenler</option>
            </select>
          </div>
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            className="form-input"
            placeholder="Malzeme veya il ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "32px", fontSize: "0.85rem" }}
          />
        </div>
      </div>

      {/* Talepler Tablosu */}
      <div className="table-card renaissance-card">
        {filteredRequests.length === 0 ? (
          <div className="empty-state-card font-serif" style={{ padding: "50px 20px", textAlign: "center" }}>
            <AlertTriangle size={40} className="gold-text" style={{ margin: "0 auto 12px", opacity: 0.6 }} />
            <h4 className="font-royal" style={{ fontSize: "1.1rem" }}>Kayıtlı Malzeme Talebi Bulunamadı</h4>
            <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
              Filtreleri değiştirebilir veya yukarıdaki butona tıklayarak yeni malzeme talebi girebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="renaissance-table">
              <thead>
                <tr>
                  <th>İl & İcathane</th>
                  <th>Talep Edilen Malzeme</th>
                  <th style={{ textAlign: "center" }}>Mevcut Kalan</th>
                  <th style={{ textAlign: "center" }}>Talep Miktarı</th>
                  <th>Aciliyet</th>
                  <th>Talep Eden & Tarih</th>
                  <th>Geçen Süre</th>
                  <th>Durum</th>
                  <th>Gerekçe / Not</th>
                  <th style={{ textAlign: "right" }}>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className="font-royal" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        {req.provinceName}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--gold-light)" }}>
                        {req.centerName}
                      </div>
                    </td>

                    <td>
                      <strong className="font-royal" style={{ fontSize: "0.95rem" }}>
                        {req.itemName}
                      </strong>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span className="badge-crimson font-royal" style={{ fontSize: "0.78rem" }}>
                        {req.currentStock || "0"} adet kaldı
                      </span>
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span className="badge-gold font-royal" style={{ fontSize: "0.85rem", fontWeight: 700 }}>
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
                        {req.urgency || "Normal"}
                      </span>
                    </td>

                    <td style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                      <div>{req.requestedBy || "Koordinatör"}</div>
                      <div style={{ fontSize: "0.72rem" }}>{req.date}</div>
                    </td>

                    <td>
                      {req.status === "Tedarik Edildi" ? (
                        <span className="badge-emerald font-royal" style={{ fontSize: "0.73rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle2 size={11} /> Tedarik Edildi
                        </span>
                      ) : (
                        <span className="badge-amber font-royal" style={{ fontSize: "0.73rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Clock size={11} /> {getDaysElapsed(req.date, req.createdAt)}
                        </span>
                      )}
                    </td>

                    <td>
                      {isAdmin ? (
                        <select
                          className="form-select font-royal"
                          value={req.status || "Bekliyor"}
                          onChange={(e) => onUpdateRequestStatus(req.id, e.target.value)}
                          style={{ fontSize: "0.75rem", padding: "3px 6px" }}
                        >
                          <option value="Bekliyor">Bekliyor</option>
                          <option value="Onaylandı">Onaylandı</option>
                          <option value="Tedarik Edildi">Tedarik Edildi</option>
                          <option value="İptal">İptal</option>
                        </select>
                      ) : (
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
                      )}
                    </td>

                    <td style={{ fontSize: "0.82rem", color: "var(--text-secondary)", maxWidth: "200px" }}>
                      {req.reason || "-"}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-ghost icon-only"
                        onClick={() => onDeleteRequest(req.id)}
                        title="Talebi Sil"
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
    </div>
  );
}
