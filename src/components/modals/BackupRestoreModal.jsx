import React, { useRef, useState } from "react";
import { X, Download, Upload, RefreshCw, Database, Cloud, CheckCircle, AlertTriangle } from "lucide-react";

export function BackupRestoreModal({
  isOpen,
  onClose,
  onExport,
  onImport,
  onReset
}) {
  const fileInputRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        const result = onImport(content);
        if (result.success) {
          setFeedback({ type: "success", text: "Yedek başarıyla yüklendi ve tüm veriler güncellendi!" });
        } else {
          setFeedback({ type: "error", text: `Yükleme hatası: ${result.error}` });
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetConfirm = () => {
    if (window.confirm("Tüm değişiklikler sıfırlanıp varsayılan Karadeniz & Türkiye örnek verilerine dönülecek. Onaylıyor musunuz?")) {
      onReset();
      setFeedback({ type: "success", text: "Veriler varsayılan ayarlara sıfırlandı." });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
              VERİ DEPOLAMA & YEDEKLEME
            </div>
            <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
              Sistem Hafızası & Dışa Aktarma
            </h3>
          </div>
          <button className="btn-ghost icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {feedback && (
            <div
              className={`badge-${feedback.type === "success" ? "emerald" : "crimson"}`}
              style={{ padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem", display: "flex", gap: "8px" }}
            >
              {feedback.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
              <span>{feedback.text}</span>
            </div>
          )}

          {/* Depolama Durumu Kartı */}
          <div className="renaissance-card" style={{ padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Database size={20} className="gold-text" />
              <strong className="font-royal" style={{ fontSize: "0.95rem" }}>
                Kalıcı Tarayıcı Hafızası (Aktif)
              </strong>
            </div>
            <p className="font-serif" style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Girdiğiniz tüm haftalık öğrenci sayıları, icathane atamaları, il gündemleri ve büyük programlar bilgisayarınızın yerel hafızasında anlık olarak saklanmaktadır. Sayfayı yenileseniz de kaybolmaz.
            </p>
          </div>

          {/* Yedek Al & Yükle Butonları */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <button
              className="btn-royal"
              style={{ justifyContent: "center", padding: "12px" }}
              onClick={onExport}
            >
              <Download size={16} />
              <span>Yedeği İndir (.JSON)</span>
            </button>

            <button
              className="btn-outline-royal"
              style={{ justifyContent: "center", padding: "12px" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              <span>Yedek Dosyası Yükle</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".json"
              onChange={handleFileChange}
            />
          </div>

          <div className="renaissance-divider">✦</div>

          {/* Fabrika Ayarlarına Dön */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Varsayılanlara Sıfırla</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                İlk açılıştaki zengin Karadeniz & Türkiye örnek verilerini geri getirir.
              </div>
            </div>
            <button className="btn-ghost" onClick={handleResetConfirm}>
              <RefreshCw size={14} />
              <span>Sıfırla</span>
            </button>
          </div>

          {/* Bulut Veritabanı Bilgilendirmesi */}
          <div
            className="renaissance-card"
            style={{
              padding: "14px",
              background: "rgba(49, 120, 198, 0.08)",
              borderColor: "rgba(49, 120, 198, 0.3)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Cloud size={16} style={{ color: "var(--accent-lapis)" }} />
              <strong style={{ fontSize: "0.85rem", color: "var(--accent-lapis)" }}>
                Bulut Veritabanı (Supabase) Hazır
              </strong>
            </div>
            <p className="font-serif" style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Farklı şehirlerdeki bölgecilerinizin ve adminin aynı anda canlı veri girmesini istediğiniz an, sistem tek bir API anahtarıyla Supabase veya kurumsal veritabanınıza bağlanmaya hazır olarak tasarlanmıştır.
            </p>
          </div>
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
