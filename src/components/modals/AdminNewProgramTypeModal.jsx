import React, { useState } from "react";
import { X, Save, Crown, Award, Sparkles } from "lucide-react";

export function AdminNewProgramTypeModal({
  isOpen,
  onClose,
  onSave
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Akademi & Kariyer");
  const [description, setDescription] = useState("");
  const [suggestedAudience, setSuggestedAudience] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTemplate = {
      id: `prog-${Date.now()}`,
      title: title.trim(),
      category,
      description: description.trim(),
      suggestedAudience: suggestedAudience.trim() || "Genel İcathane Gençliği",
      createdBy: "Admin"
    };

    onSave(newTemplate);
    setTitle("");
    setDescription("");
    setSuggestedAudience("");
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              <Crown size={13} /> MERKEZİ PROGRAM DİREKTİFİ
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
              Yeni Master Program Şablonu Tanımla
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p className="font-serif" style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>
              Admin olarak buraya tanımladığınız program (Örn: <em>"Mühendis Buluşması"</em>, <em>"Girişimcilik Zirvesi"</em>), Türkiye'deki tüm 7 bölgecinin program listesinde anında görünür hale gelir.
            </p>

            <div className="form-group">
              <label className="form-label">Programın Resmi Adı</label>
              <input
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Örn: Mühendis Buluşması / Teknoloji ve Gelecek Zirvesi"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Kategori</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Akademi & Kariyer">Akademi & Kariyer</option>
                <option value="Girişimcilik & İnovasyon">Girişimcilik & İnovasyon</option>
                <option value="Bilim & Eğitim Kampı">Bilim & Eğitim Kampı</option>
                <option value="Protokol & Tanıtım">Protokol & Tanıtım</option>
                <option value="Yarışma & Hackathon">Yarışma & Hackathon</option>
                <option value="Özel Etkinlik">Özel Etkinlik</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Programın Amacı ve Kapsamı</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Programın bölgedeki hedefi, içeriği ve bölgecilerin dikkat etmesi gereken hususlar..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tavsiye Edilen Hedef Kitle</label>
              <input
                type="text"
                className="form-input"
                value={suggestedAudience}
                onChange={(e) => setSuggestedAudience(e.target.value)}
                placeholder="Örn: Üniversite Mühendislik Öğrencileri, İcathane Mezunları, Sanayiciler"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Vazgeç
            </button>
            <button type="submit" className="btn-royal">
              <Save size={15} />
              <span>Şablonu Yayınla</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
