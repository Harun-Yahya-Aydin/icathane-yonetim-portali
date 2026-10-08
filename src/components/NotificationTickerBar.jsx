import React, { useState } from "react";
import {
  BellRing,
  CalendarCheck,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export function NotificationTickerBar({
  agendas = [],
  programs = [],
  materialRequests = [],
  onOpenRemindersModal,
  onOpenProgramsTab,
  onOpenMaterialRequestsTab
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Bildirim öğelerini derle
  const notifications = [];

  // 1. Hatırlatma Notları
  agendas.forEach((agenda) => {
    if (!agenda.isCompleted) {
      notifications.push({
        id: `agenda-${agenda.id}`,
        type: "reminder",
        title: agenda.title,
        subtitle: `${agenda.province || "Bölge"} • ${agenda.reminderDate || "Aktif Gündem"}`,
        icon: BellRing,
        colorClass: "badge-amber",
        actionLabel: "Notu Aç",
        onClick: onOpenRemindersModal
      });
    }
  });

  // 2. Yaklaşan Programlar
  programs.forEach((prog) => {
    notifications.push({
      id: `prog-${prog.id}`,
      type: "program",
      title: `${prog.title} (${prog.province})`,
      subtitle: `${prog.date} • ${prog.venue || "Salon Belirtilmedi"}`,
      icon: CalendarCheck,
      colorClass: "badge-gold",
      actionLabel: "Programı Gör",
      onClick: onOpenProgramsTab
    });
  });

  // 3. Acil Malzeme Talepleri
  materialRequests
    .filter((req) => req.urgency === "Acil" && req.status === "Bekliyor")
    .forEach((req) => {
      notifications.push({
        id: `req-${req.id}`,
        type: "request",
        title: `Acil Malzeme: ${req.itemName} (${req.requestedQuantity})`,
        subtitle: `${req.provinceName} • ${req.currentStock || "0"} adet kaldı`,
        icon: AlertTriangle,
        colorClass: "badge-crimson",
        actionLabel: "Talepleri İncele",
        onClick: onOpenMaterialRequestsTab
      });
    });

  if (isDismissed || notifications.length === 0) {
    return null;
  }

  const currentItem = notifications[currentIndex % notifications.length];
  const IconComponent = currentItem.icon;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + notifications.length) % notifications.length);
  };

  return (
    <div className="notification-ticker-bar renaissance-card">
      <div className="ticker-left">
        <div className="ticker-pulsing-icon">
          <IconComponent size={16} />
        </div>
        <span className={`ticker-type-tag ${currentItem.colorClass} font-royal`}>
          {currentItem.type === "reminder" && "HATIRLATMA"}
          {currentItem.type === "program" && "YAKLAŞAN PROGRAM"}
          {currentItem.type === "request" && "ACİL İHTİYAÇ"}
        </span>
        <div className="ticker-message">
          <strong className="ticker-title font-royal">{currentItem.title}</strong>
          <span className="ticker-sub font-serif">{currentItem.subtitle}</span>
        </div>
      </div>

      <div className="ticker-right">
        {notifications.length > 1 && (
          <div className="ticker-pagination font-royal">
            <span>
              {currentIndex + 1} / {notifications.length}
            </span>
            <button className="ticker-arrow-btn" onClick={handlePrev} title="Önceki Bildirim">
              <ChevronLeft size={14} />
            </button>
            <button className="ticker-arrow-btn" onClick={handleNext} title="Sonraki Bildirim">
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {currentItem.onClick && (
          <button
            className="btn-outline-royal btn-xs"
            onClick={currentItem.onClick}
            style={{ padding: "4px 10px", fontSize: "0.75rem" }}
          >
            <span>{currentItem.actionLabel}</span>
            <ArrowRight size={12} />
          </button>
        )}

        <button
          className="btn-ghost icon-only"
          onClick={() => setIsDismissed(true)}
          title="Bildirim Çubuğunu Gizle"
          style={{ width: "24px", height: "24px", padding: 0 }}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
