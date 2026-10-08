import React, { useState, useEffect } from "react";
import { X, Save, Award, Calendar, MapPin, Users, Building, Shield } from "lucide-react";

export function AddProgramModal({
  isOpen,
  onClose,
  region,
  allRegions,
  isAdmin,
  programTemplates: propTemplates,
  templates,
  onSave
}) {
  const programTemplates = propTemplates || templates || [];
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [targetRegionId, setTargetRegionId] = useState(region?.id || "karadeniz");
  const [province, setProvince] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("14:00");
  const [venue, setVenue] = useState("");
  const [attendeeCount, setAttendeeCount] = useState("");
  const [attendeeNotes, setAttendeeNotes] = useState("");
  const [protocol, setProtocol] = useState("");
  const [status, setStatus] = useState("Planlandı");
  const [notes, setNotes] = useState("");

  const currentActiveRegion = (allRegions || []).find((r) => r.id === targetRegionId) || region;

  useEffect(() => {
    if (isOpen && region?.id) {
      setTargetRegionId(region.id);
    }
  }, [isOpen, region]);

  useEffect(() => {
    if (programTemplates && programTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(programTemplates[0].id);
    }
  }, [programTemplates, selectedTemplateId]);

  useEffect(() => {
    if (currentActiveRegion && currentActiveRegion.provinces?.length > 0) {
      setProvince(currentActiveRegion.provinces[0].name);
    }
  }, [targetRegionId, currentActiveRegion]);

  useEffect(() => {
    const tmpl = (programTemplates || []).find((t) => t.id === selectedTemplateId);
    if (tmpl && province) {
      setCustomTitle(`${tmpl.title} - ${province} Buluşması`);
    }
  }, [selectedTemplateId, province, programTemplates]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const tmpl = programTemplates.find((t) => t.id === selectedTemplateId);

    const newExecution = {
      id: `exec-${Date.now()}`,
      templateId: selectedTemplateId,
      title: customTitle.trim() || (tmpl ? tmpl.title : "Büyük Program"),
      regionId: targetRegionId,
      province,
      date,
      time,
      venue: venue.trim(),
      attendeeCount: Number(attendeeCount) || 0,
      attendeeNotes: attendeeNotes.trim(),
      protocol: protocol.trim(),
      status,
      notes: notes.trim()
    };

    onSave(newExecution);
    setVenue("");
    setAttendeeCount("");
    setAttendeeNotes("");
    setProtocol("");
    setNotes("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              <Award size={13} /> BÜYÜK PROGRAM KAYDI
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
              Etkinlik, Salon & Protokol Kaydı
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* 1. Admin Tarafından Eklenen Master Program Seçimi */}
            <div className="form-group">
              <label className="form-label">
                1. Programı Seç (Admin Tarafından Tanımlanan Şablonlar)
              </label>
              <select
                className="form-select font-royal"
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                required
              >
                {programTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Bölge & İl Seçimi */}
            <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 1fr" : "1fr", gap: "12px" }}>
              {isAdmin && (
                <div className="form-group">
                  <label className="form-label">Bölge Seçimi</label>
                  <select
                    className="form-select"
                    value={targetRegionId}
                    onChange={(e) => setTargetRegionId(e.target.value)}
                  >
                    {(allRegions || []).map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Gerçekleşeceği İl</label>
                <select
                  className="form-select"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                >
                  {currentActiveRegion?.provinces?.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} {p.hasIcathane ? "(İcathane Var)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Program Özel Başlığı */}
            <div className="form-group">
              <label className="form-label">Program Başlığı / Afiş Adı</label>
              <input
                type="text"
                className="form-input"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                required
              />
            </div>

            {/* Tarih, Saat & Salon/Mekan */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Etkinlik Tarihi</label>
                <input
                  type="date"
                  className="form-input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Saat</label>
                <input
                  type="time"
                  className="form-input"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            {/* Yapıldığı Salon / Mekan */}
            <div className="form-group">
              <label className="form-label">Yapıldığı Salon / Mekan Adı</label>
              <input
                type="text"
                className="form-input"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Örn: Atatürk Kültür Merkezi - Büyük Salon / Üniversite Konferans Salonu"
                required
              />
            </div>

            {/* Katılımcı Sayısı & Katılımcı Profili */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">👥 Katılan Kişi Sayısı</label>
                <input
                  type="number"
                  min="0"
                  className="form-input font-royal"
                  value={attendeeCount}
                  onChange={(e) => setAttendeeCount(e.target.value)}
                  placeholder="Örn: 240"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Katılımcı Profili / Notları</label>
                <input
                  type="text"
                  className="form-input"
                  value={attendeeNotes}
                  onChange={(e) => setAttendeeNotes(e.target.value)}
                  placeholder="Örn: 12 farklı liseden mühendis kulübü öğrencileri ve girişimciler"
                />
              </div>
            </div>

            {/* Protokol Heyeti */}
            <div className="form-group">
              <label className="form-label">Katılan Protokol Heyeti (Vali, Rektör, Başkan vb.)</label>
              <textarea
                className="form-textarea"
                rows={2}
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
                placeholder="Örn: Samsun Valisi, Ondokuz Mayıs Üniversitesi Rektörü, Sanayi ve Teknoloji İl Müdürü, STK Başkanları"
                required
              />
            </div>

            {/* Durum & Ek Notlar */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "12px" }}>
              <div className="form-group">
                <label className="form-label">Durum</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Planlandı">⏳ Planlandı (Gelecek Etkinlik)</option>
                  <option value="Tamamlandı">✓ Tamamlandı (Gerçekleşti)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Ek Notlar / Hazırlık</label>
                <input
                  type="text"
                  className="form-input"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Örn: İkramlar ayarlandı, plaketler hazırlandı"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Vazgeç
            </button>
            <button type="submit" className="btn-royal">
              <Save size={15} />
              <span>Programı Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
