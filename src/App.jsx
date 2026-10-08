import React, { useState, useEffect } from "react";
import { Database } from "lucide-react";
import { StorageService } from "./services/storage";
import { LoginView } from "./components/LoginView";
import { Navbar } from "./components/Navbar";
import { NotificationTickerBar } from "./components/NotificationTickerBar";
import { AdminOverview } from "./components/AdminOverview";
import { BolgeciDashboard } from "./components/BolgeciDashboard";
import { NotesArchiveView } from "./components/NotesArchiveView";
import { InventoryView } from "./components/InventoryView";
import { MaterialRequestsView } from "./components/MaterialRequestsView";
import { IcathaneDetailView } from "./components/IcathaneDetailView";
import { EditWeeklyMetricsModal } from "./components/modals/EditWeeklyMetricsModal";
import { ManageIcathaneModal } from "./components/modals/ManageIcathaneModal";
import { AddAgendaModal } from "./components/modals/AddAgendaModal";
import { AddProgramModal } from "./components/modals/AddProgramModal";
import { AddMaterialRequestModal } from "./components/modals/AddMaterialRequestModal";
import { AdminNewProgramTypeModal } from "./components/modals/AdminNewProgramTypeModal";
import { BackupRestoreModal } from "./components/modals/BackupRestoreModal";
import { RemindersModal } from "./components/modals/RemindersModal";

export function App() {
  // Kullanıcı Oturumu (Login / Şifreli Giriş)
  const [session, setSession] = useState(() => StorageService.getSession());

  // Veri Durumları
  const [regions, setRegions] = useState(() => StorageService.getRegions());
  const [weeks, setWeeks] = useState(() => StorageService.getWeeks());
  const [currentWeekId, setCurrentWeekId] = useState(() => StorageService.getCurrentWeekId());
  const [currentRole, setCurrentRole] = useState(() => StorageService.getCurrentRole());
  const [currentPage, setCurrentPage] = useState(() => StorageService.getCurrentPage());
  const [programTemplates, setProgramTemplates] = useState(() => StorageService.getProgramTemplates());
  const [programExecutions, setProgramExecutions] = useState(() => StorageService.getProgramExecutions());
  const [weeklyMetrics, setWeeklyMetrics] = useState(() => StorageService.getWeeklyMetrics());
  const [agendas, setAgendas] = useState(() => StorageService.getAgendas());
  const [inventories, setInventories] = useState(() => StorageService.getInventories());
  const [materialRequests, setMaterialRequests] = useState(() => StorageService.getMaterialRequests());
  const [adminCoordinatorNotes, setAdminCoordinatorNotes] = useState(() => StorageService.getAdminCoordinatorNotes());
  const [theme, setTheme] = useState(() => StorageService.getTheme());

  // Seçili İcathane (Özel Detay Sayfası İçin)
  const [selectedCenter, setSelectedCenter] = useState(null); // { province, center }

  // Modal Durumları
  const [editMetricsState, setEditMetricsState] = useState({
    isOpen: false,
    provinceName: "",
    centerId: null,
    centerName: "",
    initialData: null
  });
  const [manageIcathaneState, setManageIcathaneState] = useState({ isOpen: false, province: null });
  const [isAddAgendaModalOpen, setIsAddAgendaModalOpen] = useState(false);
  const [isAddProgramModalOpen, setIsAddProgramModalOpen] = useState(false);
  const [isAddMaterialRequestModalOpen, setIsAddMaterialRequestModalOpen] = useState(false);
  const [materialRequestModalPrefill, setMaterialRequestModalPrefill] = useState({
    provinceName: "",
    centerId: "",
    centerName: ""
  });
  const [isAdminNewProgramTypeModalOpen, setIsAdminNewProgramTypeModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);

  // Tema Değişimini HTML'e Yansıt
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    StorageService.setTheme(theme);
  }, [theme]);

  // Rol Değiştirme (Sadece Admin yetkisindekiler inceleme amacıyla değiştirebilir)
  const handleRoleChange = (role) => {
    if (session?.role !== "admin") return;
    setCurrentRole(role);
    StorageService.setCurrentRole(role);
  };

  // Sayfa Değiştirme
  const handlePageChange = (page) => {
    setCurrentPage(page);
    StorageService.setCurrentPage(page);
    if (page !== "center_detail") {
      setSelectedCenter(null);
    }
  };

  // İcathane Özel Sayfasına Gitme
  const handleSelectCenter = (province, center) => {
    setSelectedCenter({ province, center });
    setCurrentPage("center_detail");
    StorageService.setCurrentPage("center_detail");
  };

  // Hafta Değiştirme
  const handleWeekChange = (weekId) => {
    setCurrentWeekId(weekId);
    StorageService.setCurrentWeekId(weekId);
  };

  // Tema Değiştirme
  const handleThemeToggle = () => {
    const nextTheme = theme === "renaissance-dark" ? "renaissance-light" : "renaissance-dark";
    setTheme(nextTheme);
  };

  // Haftalık Metrik Kaydetme
  const handleSaveWeeklyMetrics = (provinceName, centerId, metrics) => {
    const key = centerId
      ? `${currentWeekId}_${provinceName}_${centerId}`
      : `${currentWeekId}_${provinceName}`;

    const updated = {
      ...weeklyMetrics,
      [key]: metrics
    };
    setWeeklyMetrics(updated);
    StorageService.saveWeeklyMetrics(updated);
  };

  // İcathane Atölyeleri Güncelleme
  const handleSaveIcathaneCenters = (provinceName, updatedCenters) => {
    const updatedRegions = regions.map((reg) => {
      const provIndex = reg.provinces.findIndex((p) => p.name === provinceName);
      if (provIndex === -1) return reg;

      const newProvinces = [...reg.provinces];
      newProvinces[provIndex] = {
        ...newProvinces[provIndex],
        centers: updatedCenters
      };

      return {
        ...reg,
        provinces: newProvinces
      };
    });

    setRegions(updatedRegions);
    StorageService.saveRegions(updatedRegions);

    // Eğer şu an bu atölyenin detay sayfasındaysak ve güncellendiyse güncelle
    if (selectedCenter && selectedCenter.province.name === provinceName) {
      const updatedCenter = updatedCenters.find((c) => c.id === selectedCenter.center.id);
      if (updatedCenter) {
        setSelectedCenter({
          province: { ...selectedCenter.province, centers: updatedCenters },
          center: updatedCenter
        });
      }
    }
  };

  // Yeni Gündem / Hatırlatma Ekleme
  const handleSaveAgenda = (newAgenda) => {
    const updated = [newAgenda, ...agendas];
    setAgendas(updated);
    StorageService.saveAgendas(updated);
  };

  // Gündem Tamamlama Durumu
  const handleToggleAgendaStatus = (id) => {
    const updated = agendas.map((item) =>
      item.id === id
        ? { ...item, status: item.status === "Tamamlandı" ? "Bekliyor" : "Tamamlandı" }
        : item
    );
    setAgendas(updated);
    StorageService.saveAgendas(updated);
  };

  // Gündem Silme
  const handleDeleteAgenda = (id) => {
    const updated = agendas.filter((item) => item.id !== id);
    setAgendas(updated);
    StorageService.saveAgendas(updated);
  };

  // Yeni Program İcraatı Kaydetme
  const handleSaveProgramExecution = (newExecution) => {
    const updated = [newExecution, ...programExecutions];
    setProgramExecutions(updated);
    StorageService.saveProgramExecutions(updated);
  };

  // Program İcraatı Silme
  const handleDeleteProgram = (id) => {
    const updated = programExecutions.filter((item) => item.id !== id);
    setProgramExecutions(updated);
    StorageService.saveProgramExecutions(updated);
  };

  // Admin Yeni Master Program Tipi Ekleme
  const handleSaveProgramTemplate = (newTemplate) => {
    const updated = [...programTemplates, newTemplate];
    setProgramTemplates(updated);
    StorageService.saveProgramTemplates(updated);
  };

  // Envanter Kaydetme
  const handleSaveInventory = (newItems) => {
    const itemsToAdd = Array.isArray(newItems) ? newItems : [newItems];
    const updated = [...itemsToAdd, ...inventories];
    setInventories(updated);
    StorageService.saveInventories(updated);
  };

  // Envanter Adet Güncelleme
  const handleUpdateInventoryQuantity = (id, newQuantity) => {
    const updated = inventories.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setInventories(updated);
    StorageService.saveInventories(updated);
  };

  // Envanter Silme
  const handleDeleteInventory = (id) => {
    const updated = inventories.filter((item) => item.id !== id);
    setInventories(updated);
    StorageService.saveInventories(updated);
  };

  // Malzeme Talebi Kaydetme
  const handleSaveMaterialRequest = (newRequest) => {
    const updated = [newRequest, ...materialRequests];
    setMaterialRequests(updated);
    StorageService.saveMaterialRequests(updated);
  };

  // Malzeme Talebi Durum Güncelleme (Onaylandı / Tedarik Edildi vb.)
  const handleUpdateRequestStatus = (id, newStatus) => {
    const updated = materialRequests.map((req) =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setMaterialRequests(updated);
    StorageService.saveMaterialRequests(updated);
  };

  // Malzeme Talebi Silme
  const handleDeleteMaterialRequest = (id) => {
    const updated = materialRequests.filter((req) => req.id !== id);
    setMaterialRequests(updated);
    StorageService.saveMaterialRequests(updated);
  };

  // Admin Koordinatör Değerlendirme Notları Kaydetme
  const handleSaveAdminCoordinatorNotes = (updatedNotes) => {
    setAdminCoordinatorNotes(updatedNotes);
    StorageService.saveAdminCoordinatorNotes(updatedNotes);
  };

  // Oturum Açma (Login)
  const handleLogin = (sessionData) => {
    setSession(sessionData);
    if (sessionData.role === "admin") {
      setCurrentRole("admin");
      StorageService.setCurrentRole("admin");
    } else if (sessionData.regionId) {
      setCurrentRole(sessionData.regionId);
      StorageService.setCurrentRole(sessionData.regionId);
    }
  };

  // Oturum Kapatma (Logout)
  const handleLogout = () => {
    StorageService.clearSession();
    setSession(null);
  };

  // JSON Yedek Yükleme
  const handleImportBackup = (jsonString) => {
    const res = StorageService.importBackup(jsonString);
    if (res.success) {
      setRegions(StorageService.getRegions());
      setWeeks(StorageService.getWeeks());
      setProgramTemplates(StorageService.getProgramTemplates());
      setProgramExecutions(StorageService.getProgramExecutions());
      setWeeklyMetrics(StorageService.getWeeklyMetrics());
      setAgendas(StorageService.getAgendas());
      setInventories(StorageService.getInventories());
      setMaterialRequests(StorageService.getMaterialRequests());
      setAdminCoordinatorNotes(StorageService.getAdminCoordinatorNotes());
    }
    return res;
  };

  // Fabrika Ayarlarına Sıfırla (Temiz Başlangıç)
  const handleResetDefaults = () => {
    const resetData = StorageService.resetToDefaults();
    setRegions(resetData.regions);
    setWeeks(resetData.weeks);
    setProgramTemplates(resetData.programTemplates);
    setProgramExecutions(resetData.programExecutions);
    setWeeklyMetrics(resetData.weeklyMetrics);
    setAgendas(resetData.agendas);
    setInventories(resetData.inventories);
    setMaterialRequests(resetData.materialRequests || []);
    setAdminCoordinatorNotes(resetData.adminCoordinatorNotes || {});
  };

  // Aktif Bölgeyi Bul
  const activeRegion = regions.find((r) => r.id === currentRole) || regions[0];

  // Bekleyen Hatırlatmalar Sayısı
  const pendingReminders =
    currentRole === "admin"
      ? agendas.filter((a) => a.hasReminder && a.status !== "Tamamlandı")
      : agendas.filter((a) => a.regionId === currentRole && a.hasReminder && a.status !== "Tamamlandı");

  const currentWeek = weeks.find((w) => w.id === currentWeekId) || weeks[0];

  // Eğer oturum açılmamışsa Şifreli Giriş Ekranını göster
  if (!session) {
    return (
      <LoginView
        regions={regions}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app-layout">
      {/* Üst Bar (Navbar) */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        regions={regions}
        weeks={weeks}
        currentWeekId={currentWeekId}
        onWeekChange={handleWeekChange}
        theme={theme}
        onThemeToggle={handleThemeToggle}
        pendingRemindersCount={pendingReminders.length}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenRemindersView={() => setIsRemindersModalOpen(true)}
        onLogout={handleLogout}
        session={session}
      />

      {/* Ana Sayfa Bildirimler & Hatırlatmalar Çubuğu */}
      <NotificationTickerBar
        agendas={agendas}
        programs={programExecutions}
        materialRequests={materialRequests}
        onOpenRemindersModal={() => setIsRemindersModalOpen(true)}
        onOpenProgramsTab={() => {
          handlePageChange("dashboard");
        }}
        onOpenMaterialRequestsTab={() => handlePageChange("requests")}
      />

      {/* Ana Gövde */}
      <main className="main-content">
        {/* SAYFA: İCATHANE ÖZEL DETAY SAYFASI */}
        {currentPage === "center_detail" && selectedCenter ? (
          <IcathaneDetailView
            province={selectedCenter.province}
            center={selectedCenter.center}
            region={regions.find((r) =>
              r.provinces.some((p) => p.name === selectedCenter.province.name)
            )}
            weeks={weeks}
            currentWeekId={currentWeekId}
            weeklyMetrics={weeklyMetrics}
            inventories={inventories}
            materialRequests={materialRequests}
            agendas={agendas}
            onBack={() => {
              setCurrentPage("dashboard");
              setSelectedCenter(null);
            }}
            onOpenEditMetricsModal={(provName, metrics, cId, cName) =>
              setEditMetricsState({
                isOpen: true,
                provinceName: provName,
                centerId: cId,
                centerName: cName,
                initialData: metrics
              })
            }
            onOpenManageIcathaneModal={(prov) =>
              setManageIcathaneState({ isOpen: true, province: prov })
            }
            onOpenAddMaterialRequestModal={(provName, cId, cName) => {
              setMaterialRequestModalPrefill({
                provinceName: provName,
                centerId: cId,
                centerName: cName
              });
              setIsAddMaterialRequestModalOpen(true);
            }}
            onUpdateInventoryQuantity={handleUpdateInventoryQuantity}
            onDeleteInventoryItem={handleDeleteInventory}
            onOpenAddInventoryModal={(provName, cName) => {
              // Hızlı demirbaş ekleme
              const name = prompt(`${cName} için eklenecek demirbaş/ekipman adı:`);
              if (name && name.trim()) {
                const qty = parseInt(prompt("Mevcut adet:", "1") || "1", 10);
                handleSaveInventory({
                  id: "inv_" + Date.now(),
                  provinceName: provName,
                  centerName: cName,
                  itemName: name.trim(),
                  category: "3D Yazıcı & Hızlı İmalat",
                  quantity: qty || 1,
                  condition: "İyi",
                  notes: "",
                  lastChecked: new Date().toLocaleDateString("tr-TR")
                });
              }
            }}
          />
        ) : currentPage === "requests" ? (
          /* SAYFA: MALZEME & TEÇHİZAT TALEPLERİ */
          <MaterialRequestsView
            materialRequests={materialRequests}
            regions={regions}
            currentRole={currentRole}
            onOpenAddModal={() => {
              setMaterialRequestModalPrefill({
                provinceName: "",
                centerId: "",
                centerName: ""
              });
              setIsAddMaterialRequestModalOpen(true);
            }}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            onDeleteRequest={handleDeleteMaterialRequest}
          />
        ) : currentPage === "notes" ? (
          /* SAYFA: İL NOT ARŞİVİ */
          <NotesArchiveView
            regions={regions}
            weeks={weeks}
            currentWeekId={currentWeekId}
            currentRole={currentRole}
            weeklyMetrics={weeklyMetrics}
            onOpenEditMetricsModal={(provName, initial) =>
              setEditMetricsState({
                isOpen: true,
                provinceName: provName,
                centerId: null,
                centerName: "",
                initialData: initial
              })
            }
          />
        ) : currentPage === "inventory" ? (
          /* SAYFA: İL ENVANTER YÖNETİMİ */
          <InventoryView
            regions={regions}
            currentRole={currentRole}
            inventories={inventories}
            onSaveInventory={handleSaveInventory}
            onDeleteInventory={handleDeleteInventory}
            onUpdateQuantity={handleUpdateInventoryQuantity}
          />
        ) : currentRole === "admin" ? (
          /* SAYFA: GENEL KOORDİNATÖR (ADMİN) PANELİ */
          <AdminOverview
            regions={regions}
            weeks={weeks}
            currentWeekId={currentWeekId}
            weeklyMetrics={weeklyMetrics}
            programTemplates={programTemplates}
            programExecutions={programExecutions}
            agendas={agendas}
            onSelectRegion={(regId) => handleRoleChange(regId)}
            onOpenNewTemplateModal={() => setIsAdminNewProgramTypeModalOpen(true)}
            onOpenAddProgramModal={() => setIsAddProgramModalOpen(true)}
            onOpenEditMetricsModal={(provName, centerId, centerName, initial) =>
              setEditMetricsState({
                isOpen: true,
                provinceName: provName,
                centerId,
                centerName,
                initialData: initial
              })
            }
            adminCoordinatorNotes={adminCoordinatorNotes}
            onSaveAdminCoordinatorNotes={handleSaveAdminCoordinatorNotes}
            onSelectCenter={handleSelectCenter}
          />
        ) : (
          /* SAYFA: BÖLGECİ ÇALIŞMA MASASI */
          <BolgeciDashboard
            region={activeRegion}
            weeks={weeks}
            currentWeekId={currentWeekId}
            weeklyMetrics={weeklyMetrics}
            programTemplates={programTemplates}
            programExecutions={programExecutions}
            agendas={agendas}
            onOpenEditMetricsModal={(provName, centerId, centerName, initial) =>
              setEditMetricsState({
                isOpen: true,
                provinceName: provName,
                centerId,
                centerName,
                initialData: initial
              })
            }
            onOpenManageIcathaneModal={(prov) =>
              setManageIcathaneState({ isOpen: true, province: prov })
            }
            onOpenAddAgendaModal={() => setIsAddAgendaModalOpen(true)}
            onOpenAddProgramModal={() => setIsAddProgramModalOpen(true)}
            onToggleAgendaStatus={handleToggleAgendaStatus}
            onDeleteAgenda={handleDeleteAgenda}
            onDeleteProgram={handleDeleteProgram}
            onSelectCenter={handleSelectCenter}
          />
        )}
      </main>

      {/* Alt Bilgi (Footer) - Yedekleme & Veri Kurtarma Butonu Aşağı Taşındı */}
      <footer className="app-footer">
        <div className="footer-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <span className="font-royal">✦ İCATHANE YÖNETİM PORTALI ✦</span>
            <span className="font-serif" style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: "12px" }}>
              Türkiye 7 Bölge İnovasyon Atölyeleri Takip Sistemi © 2026
            </span>
          </div>
          <button
            className="btn-outline-royal"
            onClick={() => setIsBackupModalOpen(true)}
            style={{ fontSize: "0.82rem", padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            title="Sistem verilerini yedekleyin veya geri yükleyin"
          >
            <Database size={14} />
            <span>Sistem Yedekleme & Veri Kurtarma</span>
          </button>
        </div>
      </footer>

      {/* MODALLAR */}
      {/* 1. Haftalık Veri & Not Düzenleme Modalı */}
      <EditWeeklyMetricsModal
        isOpen={editMetricsState.isOpen}
        onClose={() =>
          setEditMetricsState({
            isOpen: false,
            provinceName: "",
            centerId: null,
            centerName: "",
            initialData: null
          })
        }
        provinceName={editMetricsState.provinceName}
        centerId={editMetricsState.centerId}
        centerName={editMetricsState.centerName}
        currentWeek={currentWeek}
        initialData={editMetricsState.initialData}
        onSave={handleSaveWeeklyMetrics}
      />

      {/* 2. İcathane Yönetimi Modalı */}
      <ManageIcathaneModal
        isOpen={manageIcathaneState.isOpen}
        onClose={() => setManageIcathaneState({ isOpen: false, province: null })}
        province={manageIcathaneState.province}
        onSave={handleSaveIcathaneCenters}
      />

      {/* 3. Yeni İl Gündemi / Hatırlatma Modalı */}
      <AddAgendaModal
        isOpen={isAddAgendaModalOpen}
        onClose={() => setIsAddAgendaModalOpen(false)}
        region={activeRegion}
        onSave={handleSaveAgenda}
      />

      {/* 4. Yeni Malzeme / Sarf İhtiyaç Talebi Modalı */}
      <AddMaterialRequestModal
        isOpen={isAddMaterialRequestModalOpen}
        onClose={() => setIsAddMaterialRequestModalOpen(false)}
        regions={regions}
        currentRegion={activeRegion}
        prefilledProvince={materialRequestModalPrefill.provinceName}
        prefilledCenterId={materialRequestModalPrefill.centerId}
        prefilledCenterName={materialRequestModalPrefill.centerName}
        onSave={handleSaveMaterialRequest}
      />

      {/* 5. Büyük Program İcraatı Ekleme Modalı */}
      <AddProgramModal
        isOpen={isAddProgramModalOpen}
        onClose={() => setIsAddProgramModalOpen(false)}
        region={activeRegion}
        allRegions={regions}
        isAdmin={currentRole === "admin"}
        templates={programTemplates}
        programTemplates={programTemplates}
        onSave={handleSaveProgramExecution}
      />

      {/* 6. Admin Yeni Master Program Tipi Oluşturma Modalı */}
      <AdminNewProgramTypeModal
        isOpen={isAdminNewProgramTypeModalOpen}
        onClose={() => setIsAdminNewProgramTypeModalOpen(false)}
        onSave={handleSaveProgramTemplate}
      />

      {/* 7. Veri Yedekleme & Geri Yükleme Modalı */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onExportBackup={() => StorageService.exportBackup()}
        onImportBackup={handleImportBackup}
        onResetDefaults={handleResetDefaults}
      />

      {/* 8. Bekleyen Hatırlatmalar Modalı */}
      <RemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        reminders={pendingReminders}
        agendas={agendas}
        onToggleStatus={handleToggleAgendaStatus}
      />
    </div>
  );
}

export default App;
