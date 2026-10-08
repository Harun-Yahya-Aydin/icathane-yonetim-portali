import React, { useState } from "react";
import { X, Save, Bell, Calendar, MapPin, AlertTriangle } from "lucide-react";

export function AddAgendaModal({
  isOpen,
  onClose,
  region,
  onSave
}) {
  const [province, setProvince] = useState(region?.provinces[0]?.name || "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Normal"); // 'Normal' | 'Yüksek' | 'Acil'
  const [hasReminder, setHasReminder] = useState(true);
  const [reminderDate, setReminderDate] = useState("");

  if (!isOpen || !region) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAgenda = {
      id: `agenda-${Date.now()}`,
      regionId: region.id,
      province,
      title: title.trim(),
      description: description.trim(),
      priority,
      hasReminder,
      reminderDate: hasReminder ? reminderDate : "",
      status: "Bekliyor",
      createdAt: new Date().toISOString().slice(0, 10)
    };

    onSave(newAgenda);
    setTitle("");
    setDescription("");
    setReminderDate("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              GÜNDEM & AJANDA KAYDI
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
              Yeni İl Gündemi / Hatırlatma
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* İl Seçimi */}
            <div className="form-group">
              <label className="form-label">İlgili İl ({region.name})</label>
              <select
                className="form-select"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                required
              >
                {region.provinces.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name} {p.hasIcathane ? "(İcathane Var)" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Gündem Başlığı */}
            <div className="form-group">
              <label className="form-label">Gündem Konusu / Olay Başlığı</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: İl Milli Eğitim Müdürü İcathane Resmi Ziyareti"
                required
              />
            </div>

            {/* Detay Açıklama */}
            <div className="form-group">
              <label className="form-label">Gündem Detayı & Notlar</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Örn: Protokol yenilemesi için görüşme yapılacak, sunum ve laboratuvar hazırlıkları tamamlanmalı..."
              />
            </div>

            {/* Öncelik & Hatırlatma */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Öncelik Derecesi</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Normal">Normal Öncelik</option>
                  <option value="Yüksek">Yüksek Öncelik</option>
                  <option value="Acil">Acil (Kritik Takip)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hatırlatma Yapılsın mı?</label>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", height: "42px" }}>
                  <input
                    type="checkbox"
                    id="hasReminderCheck"
                    checked={hasReminder}
                    onChange={(e) => setHasReminder(e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "var(--gold-primary)" }}
                  />
                  <label htmlFor="hasReminderCheck" style={{ fontSize: "0.88rem", cursor: "pointer" }}>
                    Tarih Hatırlatması Ekle
                  </label>
                </div>
              </div>
            </div>

            {hasReminder && (
              <div className="form-group">
                <label className="form-label">Hatırlatma Tarihi</label>
                <input
                  type="date"
                  className="form-input"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required={hasReminder}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Vazgeç
            </button>
            <button type="submit" className="btn-royal">
              <Save size={15} />
              <span>Gündemi Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
