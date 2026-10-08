// Excel (.xls) Formatında Zengin Veri Dışa Aktarma Servisi

export function exportAllDataToExcel({
  regions = [],
  weeks = [],
  weeklyMetrics = {},
  inventories = [],
  materialRequests = [],
  programExecutions = [],
  adminNotes = {}
}) {
  const currentDateStr = new Date().toLocaleDateString("tr-TR");

  // Excel HTML Şablonu (Excel tarafından doğrudan açılan ve biçimlendirmeyi koruyan format)
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; }
        table { border-collapse: collapse; margin-bottom: 25px; width: 100%; }
        th { background-color: #2c251e; color: #d4af37; border: 1px solid #796634; padding: 8px 12px; font-weight: bold; text-align: left; }
        td { border: 1px solid #d4c5b9; padding: 6px 10px; font-size: 11pt; }
        .title-row { background-color: #1a1612; color: #d4af37; font-size: 14pt; font-weight: bold; }
        .section-header { background-color: #3d3224; color: #ffffff; font-size: 12pt; font-weight: bold; }
        .num-cell { text-align: right; }
        .center-cell { text-align: center; }
        .badge-active { color: #1e7e34; font-weight: bold; }
        .badge-passive { color: #bd2130; font-weight: bold; }
      </style>
    </head>
    <body>
      <h2>İCATHANE BÖLGE YÖNETİM PLATFORMU - RESMİ VERİ YEDEĞİ</h2>
      <p>Dışa Aktarım Tarihi: ${currentDateStr} | 20 Haftalık Eğitim Dönemi</p>
      <hr/>

      <!-- BÖLÜM 1: 20 HAFTALIK İL & İCATHANE VERİLERİ -->
      <h3>1. HAFTALIK İCATHANE FAALİYET & NOT METRİKLERİ</h3>
      <table>
        <thead>
          <tr class="section-header">
            <th>Bölge</th>
            <th>İl</th>
            <th>İcathane Atölyesi</th>
            <th>Durum</th>
            <th>Hafta</th>
            <th class="num-cell">Başvuran</th>
            <th class="num-cell">Ders Alan</th>
            <th class="num-cell">Gelen</th>
            <th class="center-cell">Devam Oranı (%)</th>
            <th>Haftalık Not & Gelişmeler</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Hafta verilerini satır satır doldur
  regions.forEach((reg) => {
    reg.provinces.forEach((prov) => {
      const centers = prov.centers || [];
      if (centers.length === 0) {
        weeks.forEach((wk) => {
          html += `
            <tr>
              <td>${reg.name}</td>
              <td>${prov.name}</td>
              <td><em>(İcathane Yok)</em></td>
              <td>-</td>
              <td>${wk.label}</td>
              <td class="num-cell">-</td>
              <td class="num-cell">-</td>
              <td class="num-cell">-</td>
              <td class="center-cell">-</td>
              <td>-</td>
            </tr>
          `;
        });
      } else {
        centers.forEach((center, cIdx) => {
          weeks.forEach((wk) => {
            const metricKey = `${wk.id}_${prov.name}_${center.id}`;
            const metrics = weeklyMetrics[metricKey] ||
              (cIdx === 0 ? weeklyMetrics[`${wk.id}_${prov.name}`] : null) || {
                applications: 0,
                enrolled: 0,
                attended: 0,
                weeklyNote: ""
              };

            const rate = metrics.enrolled > 0 ? Math.round((metrics.attended / metrics.enrolled) * 100) : 0;
            const statusText = center.status === "active" ? "Aktif" : "Pasif";

            html += `
              <tr>
                <td>${reg.name}</td>
                <td>${prov.name}</td>
                <td><strong>${center.name}</strong> ${center.district ? `(${center.district})` : ""}</td>
                <td class="${center.status === 'active' ? 'badge-active' : 'badge-passive'}">${statusText}</td>
                <td>${wk.label}</td>
                <td class="num-cell">${metrics.applications || 0}</td>
                <td class="num-cell">${metrics.enrolled || 0}</td>
                <td class="num-cell">${metrics.attended || 0}</td>
                <td class="center-cell">%${rate}</td>
                <td>${metrics.weeklyNote || ""}</td>
              </tr>
            `;
          });
        });
      }
    });
  });

  html += `
        </tbody>
      </table>

      <!-- BÖLÜM 2: MALZEME & TEÇHİZAT TALEPLERİ -->
      <h3>2. İLLERİN MALZEME VE SARF İHTİYAÇ TALEPLERİ</h3>
      <table>
        <thead>
          <tr class="section-header">
            <th>İl</th>
            <th>İcathane Atölyesi</th>
            <th>Talep Edilen Malzeme</th>
            <th class="num-cell">Mevcut Kalan</th>
            <th class="num-cell">Talep Miktarı</th>
            <th>Aciliyet</th>
            <th>Talep Eden / Tarih</th>
            <th>Durum</th>
            <th>Gerekçe / Not</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (materialRequests.length === 0) {
    html += `<tr><td colspan="9" style="text-align:center; font-style:italic;">Kayıtlı malzeme talebi bulunmuyor.</td></tr>`;
  } else {
    materialRequests.forEach((req) => {
      html += `
        <tr>
          <td>${req.provinceName}</td>
          <td>${req.centerName || "-"}</td>
          <td><strong>${req.itemName}</strong></td>
          <td class="num-cell">${req.currentStock || "-"}</td>
          <td class="num-cell"><strong>${req.requestedQuantity}</strong></td>
          <td>${req.urgency || "Normal"}</td>
          <td>${req.requestedBy || "-"} (${req.date || "-"})</td>
          <td><strong>${req.status || "Bekliyor"}</strong></td>
          <td>${req.reason || ""}</td>
        </tr>
      `;
    });
  }

  html += `
        </tbody>
      </table>

      <!-- BÖLÜM 3: DEMİRBAŞ & TEÇHİZAT ENVANTERİ -->
      <h3>3. ATÖLYE DEMİRBAŞ & EKİPMAN ENVANTERİ</h3>
      <table>
        <thead>
          <tr class="section-header">
            <th>İl</th>
            <th>İcathane / Şube</th>
            <th>Demirbaş Adı</th>
            <th>Kategori</th>
            <th class="num-cell">Adet</th>
            <th>Fiziki Durum</th>
            <th>Son Kontrol Tarihi</th>
            <th>Ek Not</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (inventories.length === 0) {
    html += `<tr><td colspan="8" style="text-align:center; font-style:italic;">Kayıtlı envanter bulunmuyor.</td></tr>`;
  } else {
    inventories.forEach((item) => {
      html += `
        <tr>
          <td>${item.provinceName}</td>
          <td>${item.centerName || "Merkez"}</td>
          <td><strong>${item.itemName}</strong></td>
          <td>${item.category}</td>
          <td class="num-cell">${item.quantity}</td>
          <td>${item.condition}</td>
          <td>${item.lastChecked || "-"}</td>
          <td>${item.notes || ""}</td>
        </tr>
      `;
    });
  }

  html += `
        </tbody>
      </table>

      <!-- BÖLÜM 4: BÜYÜK PROGRAMLAR & PROTOKOL -->
      <h3>4. YILLIK PROGRAM VE ETKİNLİK İCRAATLARI</h3>
      <table>
        <thead>
          <tr class="section-header">
            <th>Program Adı</th>
            <th>Kategori</th>
            <th>Bölge</th>
            <th>İl</th>
            <th>Tarih</th>
            <th>Salon / Mekan</th>
            <th class="num-cell">Katılımcı Sayısı</th>
            <th>Katılan Protokol / VIP</th>
          </tr>
        </thead>
        <tbody>
  `;

  if (programExecutions.length === 0) {
    html += `<tr><td colspan="8" style="text-align:center; font-style:italic;">Kayıtlı program icraatı bulunmuyor.</td></tr>`;
  } else {
    programExecutions.forEach((prog) => {
      html += `
        <tr>
          <td><strong>${prog.title}</strong></td>
          <td>${prog.category || "-"}</td>
          <td>${prog.regionId}</td>
          <td>${prog.province}</td>
          <td>${prog.date}</td>
          <td>${prog.venue || "-"}</td>
          <td class="num-cell">${prog.attendeeCount || 0}</td>
          <td>${prog.vipProtocol || "-"}</td>
        </tr>
      `;
    });
  }

  html += `
        </tbody>
      </table>

      <!-- BÖLÜM 5: KOORDİNATÖR DEĞERLENDİRME NOTLARI -->
      <h3>5. BÖLGE KOORDİNATÖRLERİ YÖNETİCİ DEĞERLENDİRME DEFTERİ</h3>
      <table>
        <thead>
          <tr class="section-header">
            <th>Bölge</th>
            <th>Koordinatör</th>
            <th>Değerlendirme Notu</th>
            <th>Durum / Değerlendirme</th>
            <th>Son Güncelleme</th>
          </tr>
        </thead>
        <tbody>
  `;

  regions.forEach((reg) => {
    const note = adminNotes[reg.id] || { text: "", rating: "Düzenli", updatedAt: "-" };
    html += `
      <tr>
        <td><strong>${reg.name} (${reg.romanId})</strong></td>
        <td>${reg.defaultCoordinator}</td>
        <td>${note.text || "Henüz not girilmedi."}</td>
        <td>${note.rating || "-"}</td>
        <td>${note.updatedAt || "-"}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;

  // Dosya indirme işlemini başlat
  const blob = new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `icathane_tam_rapor_${new Date().toISOString().slice(0, 10)}.xls`;
  link.click();
  URL.revokeObjectURL(url);
}
