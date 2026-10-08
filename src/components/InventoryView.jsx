import React, { useState } from "react";
import {
  Package,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Minus,
  Sparkles,
  Layers,
  Wrench,
  Cpu
} from "lucide-react";
import { INVENTORY_CATEGORIES } from "../data/initialData";

export function InventoryView({
  regions,
  currentRole,
  inventories,
  onSaveInventory,
  onDeleteInventory,
  onUpdateQuantity
}) {
  const isAdmin = currentRole === "admin";
  const activeRegion = regions.find((r) => r.id === currentRole) || regions[0];

  const [selectedRegionId, setSelectedRegionId] = useState(isAdmin ? "all" : activeRegion.id);
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State (Yeni Envanter Ekleme)
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(INVENTORY_CATEGORIES[0]);
  const [formRegionId, setFormRegionId] = useState(isAdmin ? "karadeniz" : activeRegion.id);
  const [formProvince, setFormProvince] = useState(
    isAdmin ? "Samsun" : activeRegion.provinces[0]?.name || "Samsun"
  );
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState("Çalışır Durumda"); // 'Çalışır Durumda' | 'Bakımda' | 'Arızalı'
  const [serialOrNote, setSerialOrNote] = useState("");

  const formRegion = regions.find((r) => r.id === formRegionId) || activeRegion;

  // Filtreleme
  const filteredInventories = inventories.filter((item) => {
    if (!isAdmin && item.regionId !== activeRegion.id) return false;
    if (isAdmin && selectedRegionId !== "all" && item.regionId !== selectedRegionId) return false;
    if (selectedProvince !== "all" && item.province !== selectedProvince) return false;
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (searchQuery.trim() && !item.itemName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // İstatistikler
  const totalItemCount = filteredInventories.reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);
  const workingCount = filteredInventories
    .filter((i) => i.condition === "Çalışır Durumda")
    .reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);
  const maintenanceCount = filteredInventories
    .filter((i) => i.condition === "Bakımda" || i.condition === "Arızalı")
    .reduce((acc, curr) => acc + (Number(curr.quantity) || 1), 0);

  // Form Gönder
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const newItem = {
      id: `inv-${Date.now()}`,
      itemName: itemName.trim(),
      category,
      regionId: formRegionId,
      province: formProvince,
      quantity: Math.max(1, Number(quantity) || 1),
      condition,
      serialOrNote: serialOrNote.trim(),
      addedDate: new Date().toISOString().slice(0, 10)
    };

    onSaveInventory(newItem);
    setItemName("");
    setQuantity(1);
    setSerialOrNote("");
    setIsAddModalOpen(false);
  };

  return (
    <div className="bolgeci-container">
      {/* Hero Kartı */}
      <div className="bolgeci-hero renaissance-card">
        <div className="hero-decor-line">✦ ✧ ✦</div>
        <div className="bolgeci-hero-content">
          <div className="hero-left">
            <span className="badge-gold font-royal">DEMİRBAŞ & ATÖLYE TEÇHİZATI</span>
            <h1 className="bolge-title font-royal">
              İL İCATHANE <span className="gold-text">ENVANTER YÖNETİMİ</span>
            </h1>
            <p className="bolge-desc font-serif">
              İllerdeki 3D yazıcılar, robotik kitler, bilgisayarlar ve atölye teçhizatının takibi; hızlı malzeme ekleme, çıkarma ve durum güncellemesi.
            </p>
          </div>

          <div className="navbar-actions">
            <button className="btn-royal" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} />
              <span>Yeni Envanter / Ekipman Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="kpi-grid">
        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--gold-primary)" }}>
            <Package size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Toplam Demirbaş / Malzeme</span>
            <div className="kpi-value font-royal">{totalItemCount} <span className="kpi-sub">Adet</span></div>
            <span className="kpi-hint">Kayıtlı envanter mevcudu</span>
          </div>
        </div>

        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--accent-emerald)" }}>
            <CheckCircle size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Aktif / Çalışır Durumda</span>
            <div className="kpi-value font-royal">{workingCount} <span className="kpi-sub">Adet</span></div>
            <span className="kpi-hint">Kullanıma hazır ekipmanlar</span>
          </div>
        </div>

        <div className="kpi-card renaissance-card">
          <div className="kpi-icon-wrap" style={{ color: "var(--accent-amber)" }}>
            <Wrench size={24} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Bakımda / Arızalı</span>
            <div className="kpi-value font-royal">{maintenanceCount} <span className="kpi-sub">Adet</span></div>
            <span className="kpi-hint">Onarım veya parça bekleyenler</span>
          </div>
        </div>
      </div>

      {/* Filtre ve Arama Barı */}
      <div className="filter-bar renaissance-card">
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", flex: 1 }}>
          {isAdmin && (
            <div className="form-group" style={{ minWidth: "160px" }}>
              <label className="form-label">Bölge:</label>
              <select
                className="form-select font-royal"
                value={selectedRegionId}
                onChange={(e) => {
                  setSelectedRegionId(e.target.value);
                  setSelectedProvince("all");
                }}
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

          <div className="form-group" style={{ minWidth: "160px" }}>
            <label className="form-label">İl Filtresi:</label>
            <select
              className="form-select font-royal"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="all">Tüm İller</option>
              {(isAdmin && selectedRegionId === "all"
                ? regions.flatMap((r) => r.provinces)
                : (regions.find((r) => r.id === (isAdmin ? selectedRegionId : activeRegion.id))?.provinces || [])
              ).map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ minWidth: "180px" }}>
            <label className="form-label">Kategori Filtresi:</label>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Tüm Kategoriler</option>
              {INVENTORY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1, minWidth: "200px" }}>
            <label className="form-label">Ekipman / Cihaz Ara:</label>
            <div className="search-box" style={{ width: "100%", maxWidth: "100%" }}>
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Örn: Ender 3, Arduino, Dell laptop, lehim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Envanter Tablosu */}
      <div className="table-card renaissance-card">
        <div className="table-responsive">
          <table className="renaissance-table">
            <thead>
              <tr>
                <th>Ekipman / Malzeme Adı</th>
                <th>Kategori</th>
                <th>Bulunduğu İl</th>
                <th style={{ textAlign: "center" }}>Miktar / Adet</th>
                <th>Çalışma Durumu</th>
                <th>Seri No / Özel Not</th>
                <th style={{ textAlign: "right" }}>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventories.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    <Package size={36} style={{ color: "var(--gold-primary)", margin: "0 auto 10px" }} />
                    <div className="font-royal" style={{ fontSize: "1.1rem" }}>
                      Henüz kayıtlı bir envanter / ekipman bulunmuyor
                    </div>
                    <p className="font-serif" style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginTop: 4 }}>
                      İlinize ait 3D yazıcı, robotik kit veya bilgisayarları kaydetmek için yukarıdaki "+ Yeni Envanter Ekle" butonunu kullanın.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInventories.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="font-royal" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                        {item.itemName}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        Kayıt Tarihi: {item.addedDate || "—"}
                      </div>
                    </td>

                    <td>
                      <span className="badge-gold font-royal" style={{ fontSize: "0.75rem" }}>
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <span className="badge-gold">
                        <MapPin size={11} style={{ marginRight: 2 }} />
                        {item.province}
                      </span>
                    </td>

                    {/* Miktar ve Hızlı + / - Kontrolleri */}
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <button
                          className="btn-ghost icon-only"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          title="1 Adet Azalt"
                        >
                          <Minus size={12} />
                        </button>

                        <span className="font-royal" style={{ fontSize: "1.1rem", fontWeight: 700, minWidth: "32px", textAlign: "center" }}>
                          {item.quantity}
                        </span>

                        <button
                          className="btn-ghost icon-only"
                          style={{ width: "24px", height: "24px" }}
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          title="1 Adet Arttır"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </td>

                    <td>
                      {item.condition === "Çalışır Durumda" ? (
                        <span className="badge-emerald" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle size={12} />
                          <span>Çalışır Durumda</span>
                        </span>
                      ) : item.condition === "Bakımda" ? (
                        <span className="badge-amber" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <Wrench size={12} />
                          <span>Bakımda</span>
                        </span>
                      ) : (
                        <span className="badge-crimson" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                          <AlertTriangle size={12} />
                          <span>Arızalı / Eksik</span>
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="font-serif" style={{ fontSize: "0.85rem", maxWidth: "220px", color: "var(--text-secondary)" }}>
                        {item.serialOrNote || "—"}
                      </div>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-ghost icon-only"
                        onClick={() => onDeleteInventory(item.id)}
                        title="Bu Envanteri Sil"
                      >
                        <Trash2 size={15} style={{ color: "var(--accent-crimson)" }} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ ENVANTER EKLEME MODALI */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="badge-gold font-royal" style={{ marginBottom: 4 }}>
                  <Package size={13} /> ENVANTER KAYDI
                </div>
                <h3 className="font-royal" style={{ fontSize: "1.2rem" }}>
                  Yeni Demirbaş / Ekipman Ekle
                </h3>
              </div>
              <button className="btn-ghost icon-only" onClick={() => setIsAddModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Ekipman / Malzeme Adı</label>
                  <input
                    type="text"
                    className="form-input"
                    value={itemName}
                    onChange={(e) => setItemName(e.target.value)}
                    placeholder="Örn: Creality Ender 3 V2 - 3D Yazıcı / 20'li Arduino Başlangıç Seti"
                    required
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
                  <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <select
                      className="form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {INVENTORY_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Miktar / Adet</label>
                    <input
                      type="number"
                      min="1"
                      className="form-input font-royal"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 1fr" : "1fr", gap: "12px" }}>
                  {isAdmin && (
                    <div className="form-group">
                      <label className="form-label">Bölge</label>
                      <select
                        className="form-select font-royal"
                        value={formRegionId}
                        onChange={(e) => {
                          const rId = e.target.value;
                          setFormRegionId(rId);
                          const reg = regions.find((r) => r.id === rId);
                          if (reg?.provinces[0]) setFormProvince(reg.provinces[0].name);
                        }}
                      >
                        {regions.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Bulunduğu İl</label>
                    <select
                      className="form-select font-royal"
                      value={formProvince}
                      onChange={(e) => setFormProvince(e.target.value)}
                    >
                      {formRegion.provinces.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name} {p.hasIcathane ? "(İcathane Var)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Çalışma / Sağlamlık Durumu</label>
                  <select
                    className="form-select"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="Çalışır Durumda">Çalışır Durumda (Kullanıma Hazır)</option>
                    <option value="Bakımda">Bakımda / Parça Bekliyor</option>
                    <option value="Arızalı">Arızalı / Onarım Gerekli</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Seri Numarası / Demirbaş Kodu / Özel Not</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={serialOrNote}
                    onChange={(e) => setSerialOrNote(e.target.value)}
                    placeholder="Örn: Seri No: SN-2024-9981 / İlkadım Atölyesi Bilişim Sınıfında"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-ghost" onClick={() => setIsAddModalOpen(false)}>
                  Vazgeç
                </button>
                <button type="submit" className="btn-royal">
                  <Plus size={15} />
                  <span>Envantere Ekle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
