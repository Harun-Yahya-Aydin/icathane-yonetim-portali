import React, { useState, useEffect } from "react";
import { X, Save, Building, Plus, Trash2, Edit2, CheckCircle2, AlertCircle, MapPin, Landmark, Clock } from "lucide-react";

export function ManageIcathaneModal({
  isOpen,
  onClose,
  province,
  onSave
}) {
  const [centers, setCenters] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingCenterId, setEditingCenterId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    district: "",
    coordinator: "",
    address: ""
  });

  // Yeni Ekstra İcathane Form State
  const [newName, setNewName] = useState("");
  const [newDistrict, setNewDistrict] = useState("");
  const [newStatus, setNewStatus] = useState("active"); // 'active' | 'passive'
  const [newCoordinator, setNewCoordinator] = useState("");
  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    if (province) {
      setCenters(province.centers || []);
      setIsAddingNew(false);
      setEditingCenterId(null);
    }
  }, [province, isOpen]);

  if (!isOpen || !province) return null;

  // Yeni Ekstra İcathane Ekle
  const handleAddNewCenter = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCenter = {
      id: `${province.name.toLowerCase()}-${Date.now()}`,
      name: newName.trim(),
      district: newDistrict.trim() || "Merkez",
      status: newStatus,
      coordinator: newCoordinator.trim(),
      address: newAddress.trim()
    };

    const updatedCenters = [...centers, newCenter];
    setCenters(updatedCenters);
    onSave(province.name, updatedCenters);

    // Formu Sıfırla
    setNewName("");
    setNewDistrict("");
    setNewCoordinator("");
    setNewAddress("");
    setNewStatus("active");
    setIsAddingNew(false);
  };

  // İcathane Durumu Değiştir (Aktif <-> Pasif)
  const handleToggleStatus = (centerId) => {
    const updated = centers.map((c) => {
      if (c.id === centerId) {
        return {
          ...c,
          status: c.status === "active" ? "passive" : "active"
        };
      }
      return c;
    });
    setCenters(updated);
    onSave(province.name, updated);
  };

  // İcathane Sil
  const handleDeleteCenter = (centerId) => {
    if (window.confirm("Bu İcathane atölyesini silmek istediğinize emin misiniz?")) {
      const updated = centers.filter((c) => c.id !== centerId);
      setCenters(updated);
      onSave(province.name, updated);
    }
  };

  // Düzenlemeyi Başlat
  const handleStartEdit = (center) => {
    setEditingCenterId(center.id);
    setEditFormData({
      name: center.name || "",
      district: center.district || "",
      coordinator: center.coordinator || "",
      address: center.address || ""
    });
  };

  // Düzenlemeyi Kaydet
  const handleSaveEdit = (centerId) => {
    const updated = centers.map((c) => {
      if (c.id === centerId) {
        return {
          ...c,
          name: editFormData.name.trim() || c.name,
          district: editFormData.district.trim() || c.district,
          coordinator: editFormData.coordinator.trim(),
          address: editFormData.address.trim()
        };
      }
      return c;
    });
    setCenters(updated);
    onSave(province.name, updated);
    setEditingCenterId(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "680px" }}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              İL İCATHANE YÖNETİMİ
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.25rem" }}>
              {province.name} İli İcathaneleri
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
            Bu ildeki mevcut İcathanelerin <strong>bu seneki aktiflik/pasiflik</strong> durumunu ayarlayabilir veya yeni açılan İcathaneleri ekleyebilirsiniz.
          </p>

          {/* Mevcut İcathaneler Listesi */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {centers.length === 0 ? (
              <div
                className="renaissance-card"
                style={{ padding: "24px", textAlign: "center", borderStyle: "dashed" }}
              >
                <AlertCircle size={28} style={{ color: "var(--accent-amber)", margin: "0 auto 8px" }} />
                <div className="font-royal" style={{ fontSize: "0.95rem" }}>
                  {province.name} ilinde henüz kayıtlı bir İcathane bulunmuyor
                </div>
                <p className="font-serif" style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginTop: 4 }}>
                  Aşağıdaki butona basarak ilk İcathane atölyesini ekleyebilirsiniz.
                </p>
              </div>
            ) : (
              centers.map((center, index) => {
                const isActive = center.status === "active";
                const isEditing = editingCenterId === center.id;

                if (isEditing) {
                  return (
                    <form
                      key={center.id}
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveEdit(center.id);
                      }}
                      className="renaissance-card"
                      style={{
                        padding: "16px",
                        background: "rgba(212, 175, 55, 0.05)",
                        border: "1px solid var(--border-gold)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong className="font-royal" style={{ color: "var(--gold-primary)", fontSize: "0.92rem" }}>
                          ✦ İcathane Bilgilerini Düzenle
                        </strong>
                        <button
                          type="button"
                          className="btn-ghost"
                          style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                          onClick={() => setEditingCenterId(null)}
                        >
                          Vazgeç
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "10px" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>İcathane Adı</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>İlçe / Konum</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editFormData.district}
                            onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: "0.75rem" }}>
                          İcathane Sorumlusu (İl/Atölye Yöneticisi - Bölgeci Değil)
                        </label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Örn: Ahmet Yılmaz (Atölye Sorumlusu)"
                          value={editFormData.coordinator}
                          onChange={(e) => setEditFormData({ ...editFormData, coordinator: e.target.value })}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: "0.75rem" }}>Mekan / Adres</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Adres veya gençlik merkezi"
                          value={editFormData.address}
                          onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        />
                      </div>

                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "4px" }}>
                        <button type="submit" className="btn-royal btn-sm">
                          <Save size={14} />
                          <span>Kaydet</span>
                        </button>
                      </div>
                    </form>
                  );
                }

                return (
                  <div
                    key={center.id}
                    className="renaissance-card"
                    style={{
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      background: isActive ? "var(--bg-surface)" : "rgba(255, 255, 255, 0.02)",
                      borderLeft: isActive ? "4px solid var(--accent-emerald)" : "4px solid var(--text-muted)"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span className="icathane-badge font-royal" style={{ fontSize: "0.88rem" }}>
                          <Landmark size={12} className="gold-text" />
                          <span>{center.name}</span>
                        </span>
                        {isActive ? (
                          <span className="badge-emerald" style={{ fontSize: "0.72rem", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <CheckCircle2 size={12} />
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
                            <Clock size={12} />
                            <span>Pasif</span>
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: "0.82rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                        <MapPin size={12} className="gold-text" />
                        <span>İlçe/Konum: <strong>{center.district || "Merkez"}</strong></span>
                        {center.coordinator ? (
                          <span> • İcathane Sorumlusu: <strong style={{ color: "var(--gold-light)" }}>{center.coordinator}</strong></span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}> • Sorumlu atanmadı</span>
                        )}
                      </div>

                      {center.address && (
                        <div className="font-serif" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          {center.address}
                        </div>
                      )}
                    </div>

                    {/* Sağ Taraf İşlemler: Düzenle, Aktif/Pasif Butonu & Sil */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: "0.75rem", padding: "5px 9px", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        onClick={() => handleStartEdit(center)}
                        title="İcathane sorumlusunu ve bilgilerini düzenle"
                      >
                        <Edit2 size={13} className="gold-text" />
                        <span>Düzenle</span>
                      </button>

                      <button
                        className={`btn-ghost ${isActive ? "" : "active-gold"}`}
                        style={{ fontSize: "0.75rem", padding: "5px 10px" }}
                        onClick={() => handleToggleStatus(center.id)}
                        title="Bu seneki durumunu Aktif veya Pasif yap"
                      >
                        {isActive ? "Pasif Yap" : "Aktif Yap"}
                      </button>

                      <button
                        className="btn-ghost icon-only"
                        onClick={() => handleDeleteCenter(center.id)}
                        title="İcathane Kaydını Sil"
                      >
                        <Trash2 size={14} style={{ color: "var(--accent-crimson)" }} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="renaissance-divider">✦</div>

          {/* Yeni / Ekstra İcathane Ekleme Alanı */}
          {!isAddingNew ? (
            <button
              className="btn-outline-royal"
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
              onClick={() => {
                setIsAddingNew(true);
                if (centers.length === 0) {
                  setNewName(`${province.name} İcathane Atölyesi`);
                  setNewDistrict("Merkez");
                } else {
                  setNewName(`${province.name} - `);
                  setNewDistrict("");
                }
              }}
            >
              <Plus size={16} />
              <span>
                {centers.length === 0
                  ? `+ ${province.name} İçin İcathane Tanımla`
                  : `+ ${province.name} İline Yeni İcathane Ekle (Örn: Bafra)`}
              </span>
            </button>
          ) : (
            <form onSubmit={handleAddNewCenter} className="renaissance-card" style={{ padding: "18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                <strong className="font-royal" style={{ fontSize: "0.95rem", color: "var(--gold-primary)" }}>
                  + Yeni İcathane Bilgileri
                </strong>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ fontSize: "0.75rem", padding: "2px 8px" }}
                  onClick={() => setIsAddingNew(false)}
                >
                  İptal
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "10px" }}>
                  <div className="form-group">
                    <label className="form-label">İcathane Atölye Adı</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Örn: Bafra İcathane Atölyesi"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">İlçe / Bölge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      placeholder="Örn: Bafra / Çarşamba"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div className="form-group">
                    <label className="form-label">Bu Sene Faaliyet Durumu</label>
                    <select
                      className="form-select font-royal"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="active">Aktif (Eğitim Var)</option>
                      <option value="passive">Pasif (Kapalı / Tadilat)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">İcathane Sorumlusu (Atölye Yöneticisi - Bölgeci Değil)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newCoordinator}
                      onChange={(e) => setNewCoordinator(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz (Atölye Sorumlusu)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Adres / Mekan Bilgisi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    placeholder="Örn: Bafra Gençlik Merkezi Kat 2"
                  />
                </div>

                <button type="submit" className="btn-royal" style={{ justifyContent: "center", marginTop: "6px" }}>
                  <Save size={15} />
                  <span>Bu İcathane'yi Kaydet</span>
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-royal" onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}
