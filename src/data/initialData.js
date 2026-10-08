// 20 Haftalık Eğitim Takvimi (17 Ekim Başlangıçlı)
export const INITIAL_WEEKS = [
  { id: "hafta-1", weekNumber: 1, label: "1. Hafta (17 - 23 Ekim)", startDate: "2026-10-17", endDate: "2026-10-23", isCurrent: true },
  { id: "hafta-2", weekNumber: 2, label: "2. Hafta (24 - 30 Ekim)", startDate: "2026-10-24", endDate: "2026-10-30", isCurrent: false },
  { id: "hafta-3", weekNumber: 3, label: "3. Hafta (31 Ekim - 6 Kasım)", startDate: "2026-10-31", endDate: "2026-11-06", isCurrent: false },
  { id: "hafta-4", weekNumber: 4, label: "4. Hafta (7 - 13 Kasım)", startDate: "2026-11-07", endDate: "2026-11-13", isCurrent: false },
  { id: "hafta-5", weekNumber: 5, label: "5. Hafta (14 - 20 Kasım)", startDate: "2026-11-14", endDate: "2026-11-20", isCurrent: false },
  { id: "hafta-6", weekNumber: 6, label: "6. Hafta (21 - 27 Kasım)", startDate: "2026-11-21", endDate: "2026-11-27", isCurrent: false },
  { id: "hafta-7", weekNumber: 7, label: "7. Hafta (28 Kasım - 4 Aralık)", startDate: "2026-11-28", endDate: "2026-12-04", isCurrent: false },
  { id: "hafta-8", weekNumber: 8, label: "8. Hafta (5 - 11 Aralık)", startDate: "2026-12-05", endDate: "2026-12-11", isCurrent: false },
  { id: "hafta-9", weekNumber: 9, label: "9. Hafta (12 - 18 Aralık)", startDate: "2026-12-12", endDate: "2026-12-18", isCurrent: false },
  { id: "hafta-10", weekNumber: 10, label: "10. Hafta (19 - 25 Aralık)", startDate: "2026-12-19", endDate: "2026-12-25", isCurrent: false },
  { id: "hafta-11", weekNumber: 11, label: "11. Hafta (26 Aralık - 1 Ocak)", startDate: "2026-12-26", endDate: "2027-01-01", isCurrent: false },
  { id: "hafta-12", weekNumber: 12, label: "12. Hafta (2 - 8 Ocak)", startDate: "2027-01-02", endDate: "2027-01-08", isCurrent: false },
  { id: "hafta-13", weekNumber: 13, label: "13. Hafta (9 - 15 Ocak)", startDate: "2027-01-09", endDate: "2027-01-15", isCurrent: false },
  { id: "hafta-14", weekNumber: 14, label: "14. Hafta (16 - 22 Ocak)", startDate: "2027-01-16", endDate: "2027-01-22", isCurrent: false },
  { id: "hafta-15", weekNumber: 15, label: "15. Hafta (23 - 29 Ocak)", startDate: "2027-01-23", endDate: "2027-01-29", isCurrent: false },
  { id: "hafta-16", weekNumber: 16, label: "16. Hafta (30 Ocak - 5 Şubat)", startDate: "2027-01-30", endDate: "2027-02-05", isCurrent: false },
  { id: "hafta-17", weekNumber: 17, label: "17. Hafta (6 - 12 Şubat)", startDate: "2027-02-06", endDate: "2027-02-12", isCurrent: false },
  { id: "hafta-18", weekNumber: 18, label: "18. Hafta (13 - 19 Şubat)", startDate: "2027-02-13", endDate: "2027-02-19", isCurrent: false },
  { id: "hafta-19", weekNumber: 19, label: "19. Hafta (20 - 26 Şubat)", startDate: "2027-02-20", endDate: "2027-02-26", isCurrent: false },
  { id: "hafta-20", weekNumber: 20, label: "20. Hafta (27 Şubat - 5 Mart)", startDate: "2027-02-27", endDate: "2027-03-05", isCurrent: false }
];

// Admin Tarafından Tanımlanan Büyük Program Şablonları (Bölgecilerin Seçeceği Başlıklar)
export const INITIAL_PROGRAM_TEMPLATES = [
  {
    id: "prog-muhendis-bulusmasi",
    title: "Mühendis Buluşması",
    category: "Akademi & Kariyer",
    description: "Bölgedeki mühendislik fakültesi öğrencileri ve tecrübeli sektör temsilcilerinin bir araya geldiği yıllık vizyon programı.",
    suggestedAudience: "Mühendisler, İcathane Gençleri, Akademisyenler",
    createdBy: "Admin"
  },
  {
    id: "prog-girisimcilik-zirvesi",
    title: "İcathane Girişimcilik & İnovasyon Zirvesi",
    category: "Girişimcilik",
    description: "Genç mucitlerin teknoloji projelerini yatırımcılara ve yerel yöneticilere sunduğu demoday etkinliği.",
    suggestedAudience: "Genç Mucitler, Sanayiciler, Yatırımcılar",
    createdBy: "Admin"
  },
  {
    id: "prog-mucitler-kampi",
    title: "Geleceğin Mucitleri Bilim Kampı",
    category: "Eğitim Kampı",
    description: "Hafta sonu yoğunlaştırılmış robotik, yapay zeka ve elektronik tasarım atölyesi.",
    suggestedAudience: "Ortaokul ve Lise İcathane Öğrencileri",
    createdBy: "Admin"
  },
  {
    id: "prog-protokol-tanitim",
    title: "İl Protokolü & İcathane Tanıtım Günü",
    category: "Protokol & Tanıtım",
    description: "Valilik, Belediye ve İl Milli Eğitim Müdürlüklerine İcathane faaliyetlerinin ve öğrenci eserlerinin sergilenmesi.",
    suggestedAudience: "Mülki Amirler, Protokol, STK Temsilcileri",
    createdBy: "Admin"
  }
];

// Kullanıcının kendisinin gireceği sıfır başlangıçlı veriler:
export const INITIAL_PROGRAM_EXECUTIONS = [];

export const INITIAL_WEEKLY_METRICS = {};

export const INITIAL_AGENDAS = [];

// Envanter Kategorileri
export const INVENTORY_CATEGORIES = [
  "3D Yazıcı & Hızlı İmalat",
  "Robotik, Kodlama & Sensör",
  "Bilgisayar, Tablet & Ekran",
  "Elektronik & Lehimleme İstasyonu",
  "İHA, Dron & Havacılık Kiti",
  "Talaşlı / Mekanik El Aletleri",
  "Ofis, Mobilya & Demirbaş",
  "Sarf Malzeme (Filament, Reçine vb.)"
];

// Başlangıç Temiz Envanter Listesi
export const INITIAL_INVENTORIES = [];

// Başlangıç Malzeme Talepleri Listesi
export const INITIAL_MATERIAL_REQUESTS = [];

// Admin Bölgeci Değerlendirme & Özel Notları
export const INITIAL_ADMIN_COORDINATOR_NOTES = {};
