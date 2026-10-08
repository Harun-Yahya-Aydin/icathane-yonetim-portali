import React, { useState } from "react";
import { X, Save, AlertTriangle, Package, MapPin } from "lucide-react";

export function AddMaterialRequestModal({
  isOpen,
  onClose,
  regions = [],
  currentRegion,
  prefilledProvince = "",
  prefilledCenterId = "",
  prefilledCenterName = "",
  onSave
}) {
  const [selectedProvince, setSelectedProvince] = useState(prefilledProvince || "");
  const [selectedCenterId, setSelectedCenterId] = useState(prefilledCenterId || "");
  const [itemName, setItemName] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [requestedQuantity, setRequestedQuantity] = useState("");
  const [urgency, setUrgency] = useState("Orta"); // 'Acil' | 'Orta' | 'Planlı'
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  // Mevcut bölgenin veya tüm bölgelerin illeri
  const provincesList = currentRegion?.provinces || [];

  const activeProvinceObj = provincesList.find((p) => p.name === (selectedProvince || provincesList[0]?.name));
  const availableCenters = activeProvinceObj?.centers || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const currentProvName = selectedProvince || provincesList[0]?.name || "Merkez";
    const chosenCenter = availableCenters.find((c) => c.id === selectedCenterId) || availableCenters[0];

    const newRequest = {
      id: "req_" + Date.now(),
      provinceName: currentProvName,
      centerId: chosenCenter?.id || null,
      centerName: chosenCenter?.name || prefilledCenterName || currentProvName + " İcathane",
      itemName: itemName.trim(),
      currentStock: currentStock.trim() || "0",
      requestedQuantity: requestedQuantity.trim() || "1 adet",
      urgency,
      reason: reason.trim(),
      date: new Date().toLocaleDateString("tr-TR"),
      createdAt: Date.now(),
      status: "Bekliyor",
      requestedBy: currentRegion?.defaultCoordinator || "Bölge Sorumlusu"
    };

    onSave(newRequest);
    onClose();

    // Reset
    setItemName("");
    setCurrentStock("");
    setRequestedQuantity("");
    setReason("");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px" }}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              MALZEME & TEÇHİZAT TALEBİ
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.25rem" }}>
              Yeni Malzeme / Sarf İhtiyacı Bildir
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Atölyenizde tükenen veya yaklaşan eğitimler için ihtiyaç duyulan sarf ve teçhizat taleplerini buradan kaydedebilirsiniz.
            </p>

            {/* İl ve İcathane Seçimi */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">İl</label>
                <select
                  className="form-select font-royal"
                  value={selectedProvince || (provincesList[0]?.name || "")}
                  onChange={(e) => {
                    setSelectedProvince(e.target.value);
                    setSelectedCenterId("");
                  }}
                >
                  {provincesList.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">İcathane Atölyesi</label>
                <select
                  className="form-select font-royal"
                  value={selectedCenterId}
                  onChange={(e) => setSelectedCenterId(e.target.value)}
                >
                  {availableCenters.length === 0 ? (
                    <option value="">Merkez Atölye</option>
                  ) : (
                    availableCenters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Malzeme Adı */}
            <div className="form-group">
              <label className="form-label">Talep Edilen Malzeme / Ekipman</label>
              <input
                type="text"
                className="form-input"
                placeholder="Örn: PLA 3D Yazıcı Filamenti (Siyah/Beyaz)"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />
            </div>

            {/* Kalan ve İstenen Adet ("şundan şu kaldı, şu kadar isteniyor") */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="form-group">
                <label className="form-label">Mevcut Kalan Miktar</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Örn: 2 rulo kaldı / 0 adet"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">İstenen / Talep Miktarı</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Örn: 10 rulo isteniyor / 5 takım"
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Aciliyet */}
            <div className="form-group">
              <label className="form-label">Aciliyet Durumu</label>
              <select
                className="form-select font-royal"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="Acil">🔴 Acil (Eğitimi durduracak düzeyde)</option>
                <option value="Orta">🟡 Orta (Önümüzdeki hafta gerekli)</option>
                <option value="Planlı">🟢 Planlı (Dönem içi takviye)</option>
              </select>
            </div>

            {/* Açıklama / Gerekçe */}
            <div className="form-group">
              <label className="form-label">Gerekçe / Kullanım Amacı</label>
              <textarea
                className="form-textarea font-serif"
                rows="2"
                placeholder="Örn: 3. hafta robotik tasarım derslerinde kullanılacak, mevcut filamentler bitti."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              İptal
            </button>
            <button type="submit" className="btn-royal">
              <Save size={15} />
              <span>Talebi Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
