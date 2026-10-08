import { TURKEY_REGIONS } from "../data/regionsData";
import {
  INITIAL_WEEKS,
  INITIAL_PROGRAM_TEMPLATES,
  INITIAL_PROGRAM_EXECUTIONS,
  INITIAL_WEEKLY_METRICS,
  INITIAL_AGENDAS,
  INITIAL_INVENTORIES,
  INITIAL_MATERIAL_REQUESTS,
  INITIAL_ADMIN_COORDINATOR_NOTES
} from "../data/initialData";

const STORAGE_KEYS = {
  VERSION: "icathane_version_v3_oct17_passive_unassigned",
  REGIONS: "icathane_regions_v3",
  WEEKS: "icathane_weeks_v3",
  PROGRAM_TEMPLATES: "icathane_program_templates_v3",
  PROGRAM_EXECUTIONS: "icathane_program_executions_v3",
  WEEKLY_METRICS: "icathane_weekly_metrics_v3",
  AGENDAS: "icathane_agendas_v3",
  INVENTORIES: "icathane_inventories_v3",
  MATERIAL_REQUESTS: "icathane_material_requests_v3",
  ADMIN_COORDINATOR_NOTES: "icathane_admin_coordinator_notes_v3",
  CURRENT_ROLE: "icathane_current_role_v3",
  CURRENT_WEEK: "icathane_current_week_v3",
  CURRENT_PAGE: "icathane_current_page_v3",
  THEME: "icathane_theme_v3",
  SESSION: "icathane_session_v3",
  PASSWORDS: "icathane_passwords_v3"
};

const DEFAULT_PASSWORDS = {
  admin: "admin123",
  karadeniz: "1234",
  marmara: "1234",
  ege: "1234",
  akdeniz: "1234",
  icanadolu: "1234",
  doguanadolu: "1234",
  guneydogu: "1234"
};

// LocalStorage Yardımcısı
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`Veri okuma hatası (${key}):`, err);
    return fallback;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Veri kaydetme hatası (${key}):`, err);
  }
}

// v3 Eğitim Takvimi (17 Ekim) & Sıfır Veri Kontrolü
function checkAndInitCleanState() {
  const version = localStorage.getItem(STORAGE_KEYS.VERSION);
  if (version !== "icathane_version_v3_oct17_passive_unassigned") {
    localStorage.setItem(STORAGE_KEYS.VERSION, "icathane_version_v3_oct17_passive_unassigned");
    localStorage.setItem(STORAGE_KEYS.REGIONS, JSON.stringify(TURKEY_REGIONS));
    localStorage.setItem(STORAGE_KEYS.WEEKS, JSON.stringify(INITIAL_WEEKS));
    localStorage.setItem(STORAGE_KEYS.PROGRAM_TEMPLATES, JSON.stringify(INITIAL_PROGRAM_TEMPLATES));
    localStorage.setItem(STORAGE_KEYS.PROGRAM_EXECUTIONS, JSON.stringify(INITIAL_PROGRAM_EXECUTIONS));
    localStorage.setItem(STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify(INITIAL_WEEKLY_METRICS));
    localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify(INITIAL_AGENDAS));
    localStorage.setItem(STORAGE_KEYS.INVENTORIES, JSON.stringify(INITIAL_INVENTORIES));
    localStorage.setItem(STORAGE_KEYS.MATERIAL_REQUESTS, JSON.stringify(INITIAL_MATERIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.ADMIN_COORDINATOR_NOTES, JSON.stringify(INITIAL_ADMIN_COORDINATOR_NOTES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, "hafta-1");
  }
}

checkAndInitCleanState();

export const StorageService = {
  // Bölgeler ve İller
  getRegions() {
    return load(STORAGE_KEYS.REGIONS, TURKEY_REGIONS);
  },
  saveRegions(regions) {
    save(STORAGE_KEYS.REGIONS, regions);
  },

  // Haftalar (20 Hafta - 17 Ekim Başlangıçlı)
  getWeeks() {
    return load(STORAGE_KEYS.WEEKS, INITIAL_WEEKS);
  },
  saveWeeks(weeks) {
    save(STORAGE_KEYS.WEEKS, weeks);
  },

  // Admin Program Şablonları (Mühendis Buluşması vb.)
  getProgramTemplates() {
    return load(STORAGE_KEYS.PROGRAM_TEMPLATES, INITIAL_PROGRAM_TEMPLATES);
  },
  saveProgramTemplates(templates) {
    save(STORAGE_KEYS.PROGRAM_TEMPLATES, templates);
  },

  // Gerçekleştirilen / Planlanan Programlar
  getProgramExecutions() {
    return load(STORAGE_KEYS.PROGRAM_EXECUTIONS, INITIAL_PROGRAM_EXECUTIONS);
  },
  saveProgramExecutions(executions) {
    save(STORAGE_KEYS.PROGRAM_EXECUTIONS, executions);
  },

  // Haftalık Metrikler & Notlar
  getWeeklyMetrics() {
    return load(STORAGE_KEYS.WEEKLY_METRICS, INITIAL_WEEKLY_METRICS);
  },
  saveWeeklyMetrics(metrics) {
    save(STORAGE_KEYS.WEEKLY_METRICS, metrics);
  },

  // Gündemler & Hatırlatmalar
  getAgendas() {
    return load(STORAGE_KEYS.AGENDAS, INITIAL_AGENDAS);
  },
  saveAgendas(agendas) {
    save(STORAGE_KEYS.AGENDAS, agendas);
  },

  // İllerin Envanterleri (Demirbaş & Ekipmanlar)
  getInventories() {
    return load(STORAGE_KEYS.INVENTORIES, INITIAL_INVENTORIES);
  },
  saveInventories(inventories) {
    save(STORAGE_KEYS.INVENTORIES, inventories);
  },

  // Malzeme & Teçhizat Talepleri (Şundan şu kaldı, şu kadar isteniyor)
  getMaterialRequests() {
    return load(STORAGE_KEYS.MATERIAL_REQUESTS, INITIAL_MATERIAL_REQUESTS);
  },
  saveMaterialRequests(requests) {
    save(STORAGE_KEYS.MATERIAL_REQUESTS, requests);
  },

  // Admin Koordinatör Değerlendirme & Özel Notları
  getAdminCoordinatorNotes() {
    return load(STORAGE_KEYS.ADMIN_COORDINATOR_NOTES, INITIAL_ADMIN_COORDINATOR_NOTES);
  },
  saveAdminCoordinatorNotes(notes) {
    save(STORAGE_KEYS.ADMIN_COORDINATOR_NOTES, notes);
  },

  // Aktif Rol (admin veya bölge id'si: 'karadeniz', 'marmara', vs.)
  getCurrentRole() {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_ROLE) || "karadeniz";
    } catch {
      return "karadeniz";
    }
  },
  setCurrentRole(role) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_ROLE, role);
    } catch (e) {
      console.error(e);
    }
  },

  // Aktif Sayfa ('dashboard' | 'notes' | 'inventory' | 'requests' | 'center_detail')
  getCurrentPage() {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE) || "dashboard";
    } catch {
      return "dashboard";
    }
  },
  setCurrentPage(page) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page);
    } catch (e) {
      console.error(e);
    }
  },

  // Seçili Hafta ID (1. Hafta: 17 - 23 Ekim)
  getCurrentWeekId() {
    try {
      return localStorage.getItem(STORAGE_KEYS.CURRENT_WEEK) || "hafta-1";
    } catch {
      return "hafta-1";
    }
  },
  setCurrentWeekId(weekId) {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_WEEK, weekId);
    } catch (e) {
      console.error(e);
    }
  },

  // Tema ('renaissance-dark' veya 'renaissance-light')
  getTheme() {
    try {
      return localStorage.getItem(STORAGE_KEYS.THEME) || "renaissance-dark";
    } catch {
      return "renaissance-dark";
    }
  },
  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.error(e);
    }
  },

  // Tüm Verileri Fabrika Ayarlarına (Temiz Haline) Sıfırla
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.REGIONS);
    localStorage.removeItem(STORAGE_KEYS.WEEKS);
    localStorage.removeItem(STORAGE_KEYS.PROGRAM_TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.PROGRAM_EXECUTIONS);
    localStorage.setItem(STORAGE_KEYS.WEEKLY_METRICS, JSON.stringify({}));
    localStorage.setItem(STORAGE_KEYS.AGENDAS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.INVENTORIES, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.MATERIAL_REQUESTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.ADMIN_COORDINATOR_NOTES, JSON.stringify({}));
    return {
      regions: TURKEY_REGIONS,
      weeks: INITIAL_WEEKS,
      programTemplates: INITIAL_PROGRAM_TEMPLATES,
      programExecutions: [],
      weeklyMetrics: {},
      agendas: [],
      inventories: [],
      materialRequests: [],
      adminCoordinatorNotes: {}
    };
  },

  // Verileri JSON Olarak İndir (Yedek Al)
  exportBackup() {
    const backupData = {
      version: "3.0",
      exportDate: new Date().toISOString(),
      regions: this.getRegions(),
      weeks: this.getWeeks(),
      programTemplates: this.getProgramTemplates(),
      programExecutions: this.getProgramExecutions(),
      weeklyMetrics: this.getWeeklyMetrics(),
      agendas: this.getAgendas(),
      inventories: this.getInventories(),
      materialRequests: this.getMaterialRequests(),
      adminCoordinatorNotes: this.getAdminCoordinatorNotes()
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `icathane_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  },

  // JSON Yedeğini Sisteme Geri Yükle (Import)
  importBackup(jsonData) {
    try {
      const data = typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;

      if (data.regions) this.saveRegions(data.regions);
      if (data.weeks) this.saveWeeks(data.weeks);
      if (data.programTemplates) this.saveProgramTemplates(data.programTemplates);
      if (data.programExecutions) this.saveProgramExecutions(data.programExecutions);
      if (data.weeklyMetrics) this.saveWeeklyMetrics(data.weeklyMetrics);
      if (data.agendas) this.saveAgendas(data.agendas);
      if (data.inventories) this.saveInventories(data.inventories);
      if (data.materialRequests) this.saveMaterialRequests(data.materialRequests);
      if (data.adminCoordinatorNotes) this.saveAdminCoordinatorNotes(data.adminCoordinatorNotes);

      return { success: true, message: "Yedek başarıyla yüklendi!" };
    } catch (err) {
      console.error("Yedek yükleme hatası:", err);
      return { success: false, message: "Geçersiz dosya formatı: " + err.message };
    }
  },

  // Oturum Yönetimi (Session)
  getSession() {
    return load(STORAGE_KEYS.SESSION, null);
  },
  setSession(session) {
    save(STORAGE_KEYS.SESSION, session);
  },
  clearSession() {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (e) {
      console.error(e);
    }
  },

  // Şifre Yönetimi
  getPasswords() {
    return load(STORAGE_KEYS.PASSWORDS, DEFAULT_PASSWORDS);
  },
  savePassword(accountType, newPassword) {
    const passwords = this.getPasswords();
    passwords[accountType] = newPassword;
    save(STORAGE_KEYS.PASSWORDS, passwords);
  },
  verifyPassword(accountType, inputPassword) {
    if (!inputPassword) return false;
    const passwords = this.getPasswords();
    const correctPassword = passwords[accountType] || "1234";

    // Güvenlik ve test kolaylığı:
    // Doğru şifre OR evrensel yedek şifre '1234' OR admin için 'admin'/'admin123'
    if (inputPassword === correctPassword) return true;
    if (inputPassword === "1234") return true;
    if (accountType === "admin" && (inputPassword === "admin" || inputPassword === "admin123")) return true;
    if (inputPassword === `${accountType}123`) return true;

    return false;
  }
};
