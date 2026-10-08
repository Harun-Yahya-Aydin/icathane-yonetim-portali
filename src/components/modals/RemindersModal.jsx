import React from "react";
import { X, Bell, Clock, MapPin, CheckCircle2 } from "lucide-react";

export function RemindersModal({
  isOpen,
  onClose,
  agendas = [],
  reminders = [],
  onToggleStatus
}) {
  if (!isOpen) return null;

  const list = (reminders && reminders.length > 0) ? reminders : (agendas || []);
  const remindersWithDates = list.filter((a) => a && (a.hasReminder || a.reminderDate));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              <Bell size={13} /> HATIRLATMALAR & YAKLAŞAN TARİHLER
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
              Ajanda Bildirimleri ({remindersWithDates.length})
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: "60vh", overflowY: "auto" }}>
          {remindersWithDates.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px", color: "var(--text-muted)" }}>
              Aktif hatırlatma tarihi olan bir gündem bulunmuyor.
            </div>
          ) : (
            remindersWithDates.map((agenda) => {
              const isCompleted = agenda.status === "Tamamlandı";

              return (
                <div
                  key={agenda.id}
                  className="renaissance-card"
                  style={{
                    padding: "14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    opacity: isCompleted ? 0.6 : 1,
                    borderColor:
                      agenda.priority === "Acil"
                        ? "rgba(199, 56, 56, 0.4)"
                        : "var(--border-gold)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span className="badge-gold font-royal">
                        <MapPin size={11} /> {agenda.province}
                      </span>
                      {agenda.priority === "Acil" && (
                        <span className="badge-crimson">Acil</span>
                      )}
                      {agenda.priority === "Yüksek" && (
                        <span className="badge-amber">Yüksek</span>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Clock size={13} className="gold-text" />
                      <span className="font-royal" style={{ fontSize: "0.82rem", color: "var(--gold-light)" }}>
                        {agenda.reminderDate || "Tarih belirtilmedi"}
                      </span>
                    </div>
                  </div>

                  <h5 className="font-royal" style={{ fontSize: "0.95rem" }}>
                    {agenda.title}
                  </h5>

                  <p className="font-serif" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    {agenda.description}
                  </p>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button
                      className="btn-ghost"
                      style={{ fontSize: "0.78rem" }}
                      onClick={() => onToggleStatus(agenda.id)}
                    >
                      <CheckCircle2 size={14} style={{ color: isCompleted ? "var(--accent-emerald)" : "var(--text-muted)" }} />
                      <span>{isCompleted ? "Tamamlandı (Aç)" : "Tamamlandı Olarak İşaretle"}</span>
                    </button>
                  </div>
                </div>
              );
            })
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
