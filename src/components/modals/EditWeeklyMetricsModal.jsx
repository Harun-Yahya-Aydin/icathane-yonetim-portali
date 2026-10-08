import React, { useState, useEffect } from "react";
import { X, Save, TrendingUp, Calendar, MapPin, FileText, Landmark } from "lucide-react";

export function EditWeeklyMetricsModal({
  isOpen,
  onClose,
  provinceName,
  centerId,
  centerName,
  currentWeek,
  initialData,
  onSave
}) {
  const [applications, setApplications] = useState(0);
  const [enrolled, setEnrolled] = useState(0);
  const [attended, setAttended] = useState(0);
  const [weeklyNote, setWeeklyNote] = useState("");

  useEffect(() => {
    if (initialData) {
      setApplications(initialData.applications || 0);
      setEnrolled(initialData.enrolled || 0);
      setAttended(initialData.attended || 0);
      setWeeklyNote(initialData.weeklyNote || "");
    } else {
      setApplications(0);
      setEnrolled(0);
      setAttended(0);
      setWeeklyNote("");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const appNum = Number(applications) || 0;
  const enrNum = Number(enrolled) || 0;
  const attNum = Number(attended) || 0;
  const rate = enrNum > 0 ? Math.round((attNum / enrNum) * 100) : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(provinceName, centerId, {
      applications: appNum,
      enrolled: enrNum,
      attended: attNum,
      weeklyNote
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              HAFTALIK VERİ GİRİŞİ
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px", margin: "4px 0" }}>
              <h3 className="font-royal" style={{ fontSize: "1.25rem", margin: 0 }}>
                {provinceName}
              </h3>
              {centerName && (
                <span className="icathane-badge font-royal">
                  <Landmark size={12} className="gold-text" />
                  <span>{centerName}</span>
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {currentWeek?.label}
            </div>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Başvuran Öğrenci</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={applications}
                  onChange={(e) => setApplications(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ders Alan / Kayıtlı</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={enrolled}
                  onChange={(e) => setEnrolled(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">O Hafta Gelen</label>
                <input
                  type="number"
                  min="0"
                  className="form-input"
                  value={attended}
                  onChange={(e) => setAttended(e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            {/* Devam Oranı Canlı Önizleme */}
            <div
              className="renaissance-card"
              style={{
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingUp size={16} className="gold-text" />
                <span style={{ fontSize: "0.85rem" }}>Hesaplanan Devam Oranı:</span>
              </div>
              <span
                className="font-royal"
                style={{
                  fontSize: "1.1rem",
                  color: rate >= 80 ? "var(--accent-emerald)" : "var(--gold-primary)"
                }}
              >
                %{rate}
              </span>
            </div>

            {/* Haftalık Not Alanı */}
            <div className="form-group">
              <label className="form-label">
                Bu Haftaya Özel Not (Örn: Gelecek hafta etkinlik hazırlığı, kriz, atölye ziyareti):
              </label>
              <textarea
                className="form-textarea"
                rows={4}
                value={weeklyNote}
                onChange={(e) => setWeeklyNote(e.target.value)}
                placeholder="Örnek: Gelecek hafta etkinlik hazırlıkları sürüyor. Öğrenci devamlılığı yüksek..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Vazgeç
            </button>
            <button type="submit" className="btn-royal">
              <Save size={15} />
              <span>Kaydet & Güncelle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
