/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  DeviceView,
  Language,
  UserRole,
  SyncQueueItem,
  ThemeSettings,
  LinkedParent,
  DirectParentMessage,
} from './types';
import { INITIAL_LINKED_PARENTS, INITIAL_DIRECT_MESSAGES, INITIAL_THEME_SETTINGS } from './data/mockParents';
import { Header } from './components/Header';
import { DeviceFrame } from './components/DeviceFrame';
import { SchemaVisualizer } from './components/SchemaVisualizer';
import { SqlScriptViewer } from './components/SqlScriptViewer';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { RolesAuthViewer } from './components/RolesAuthViewer';
import { ThemeModal } from './components/ThemeModal';
import { ParentRegisterModal } from './components/ParentRegisterModal';
import { SendDirectSmsModal } from './components/SendDirectSmsModal';
import { RefreshCw, CheckCircle2, MessageSquare, ShieldCheck, Database, Smartphone } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('app-simulator');
  const [language, setLanguage] = useState<Language>('sw'); // Default to Swahili as requested by user
  const [deviceView, setDeviceView] = useState<DeviceView>('mobile');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Sync Queue for Offline-First demonstration
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Global Theme & Visual Appearance State
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(INITIAL_THEME_SETTINGS);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);

  // Parent Registration & Direct SMS Link with Admin State
  const [linkedParents, setLinkedParents] = useState<LinkedParent[]>(INITIAL_LINKED_PARENTS);
  const [directMessages, setDirectMessages] = useState<DirectParentMessage[]>(INITIAL_DIRECT_MESSAGES);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isDirectSmsModalOpen, setIsDirectSmsModalOpen] = useState<boolean>(false);
  const [selectedParentIdForSms, setSelectedParentIdForSms] = useState<string | undefined>(undefined);

  // Trigger Toast Notification helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // When connection is restored, trigger auto-sync simulation
  useEffect(() => {
    if (isOnline && syncQueue.some((i) => i.status === 'pending')) {
      triggerToast(
        language === 'sw'
          ? `🔄 Mtandao umepatikana! WorkManager inalandanisha kumbukumbu ${syncQueue.filter((i) => i.status === 'pending').length} na Seva Kuu...`
          : `🔄 Network restored! WorkManager is synchronizing ${syncQueue.filter((i) => i.status === 'pending').length} items to Cloud PostgreSQL...`
      );

      const timer = setTimeout(() => {
        setSyncQueue((prev) =>
          prev.map((item) => ({
            ...item,
            status: 'synced',
          }))
        );
        triggerToast(
          language === 'sw'
            ? '✓ Ulandanishaji umekamilika! Kumbukumbu zote ziko sawa kwenye Seva.'
            : '✓ All local mutations reconciled with Central Cloud Database!'
        );
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isOnline, language]);

  const handleRecordLocalChange = (entity: string, action: 'INSERT' | 'UPDATE', details: string) => {
    const newItem: SyncQueueItem = {
      id: 'sync-' + Date.now(),
      entity,
      action,
      timestamp: new Date().toLocaleTimeString(),
      status: isOnline ? 'synced' : 'pending',
      details,
    };
    setSyncQueue((prev) => [newItem, ...prev]);

    if (!isOnline) {
      triggerToast(
        language === 'sw'
          ? `💾 [Room DB Offline] ${details}. Imehifadhiwa ndani ya simu.`
          : `💾 [Room DB Offline] ${details}. Saved locally on device.`
      );
    }
  };

  const handleSendSms = (recipient: string, message: string) => {
    triggerToast(
      language === 'sw'
        ? `📨 SMS Imetumwa kwa Walengwa (${recipient}): "${message.slice(0, 50)}..."`
        : `📨 SMS Dispatched to (${recipient}): "${message.slice(0, 50)}..."`
    );
  };

  // Handle Parent Registration & Direct Number Linking
  const handleRegisterParent = (newParent: LinkedParent) => {
    setLinkedParents((prev) => [newParent, ...prev]);

    // Automatically generate a welcome/confirmation SMS from Admin to this parent
    const welcomeSms: DirectParentMessage = {
      id: 'dmsg-' + Date.now(),
      sender_role: 'admin',
      sender_name: 'Mwl. Josephat Kavishe (Mkuu wa Shule)',
      recipient_phone: newParent.phone_number,
      recipient_name: newParent.parent_name,
      parent_id: newParent.id,
      message:
        language === 'sw'
          ? `Top Stars School: Ndugu ${newParent.parent_name}, namba yako ${newParent.phone_number} imesajiliwa na kuunganishwa (LINKED) kikamilifu kwenye mfumo wa Mkuu wa Shule kwa mwanafunzi ${newParent.student_name} (${newParent.class_name}). Ujumbe wowote rasmi wa shule sasa utakufikia moja kwa moja.`
          : `Top Stars School: Dear ${newParent.parent_name}, your phone ${newParent.phone_number} has been linked with the Headteacher system for pupil ${newParent.student_name} (${newParent.class_name}). You will receive direct SMS updates.`,
      message_type: 'sms',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
      is_read_by_parent: false,
      channel: 'SMS',
    };

    setDirectMessages((prev) => [welcomeSms, ...prev]);

    handleRecordLocalChange(
      'linked_parents',
      'INSERT',
      language === 'sw'
        ? `Mzazi ${newParent.parent_name} ameunganishwa (Simu: ${newParent.phone_number}, Mwanafunzi: ${newParent.student_name})`
        : `Parent ${newParent.parent_name} linked (Phone: ${newParent.phone_number}, Student: ${newParent.student_name})`
    );

    triggerToast(
      language === 'sw'
        ? `✓ Mzazi (${newParent.parent_name}) ameunganishwa kikamilifu na Admin! SMS ya uthibitisho imetumwa moja kwa moja kwa namba yake.`
        : `✓ Parent (${newParent.parent_name}) successfully linked with Admin! Direct SMS notification sent to their phone.`
    );
  };

  // Handle Direct SMS Dispatch from Admin to Parent
  const handleSendDirectSms = (message: DirectParentMessage) => {
    setDirectMessages((prev) => [message, ...prev]);

    setLinkedParents((prev) =>
      prev.map((p) =>
        p.id === message.parent_id || p.phone_number === message.recipient_phone
          ? {
              ...p,
              total_messages_received: (p.total_messages_received || 0) + 1,
              last_message_at: 'Sasa Hivi',
            }
          : p
      )
    );

    handleRecordLocalChange(
      'direct_messages',
      'INSERT',
      language === 'sw'
        ? `SMS ya moja kwa moja imetumwa kwa ${message.recipient_name} (${message.recipient_phone})`
        : `Direct SMS sent to ${message.recipient_name} (${message.recipient_phone})`
    );

    triggerToast(
      language === 'sw'
        ? `📨 SMS ya moja kwa moja imetumwa kwa ${message.recipient_name} (${message.recipient_phone})!`
        : `📨 Direct SMS dispatched to ${message.recipient_name} (${message.recipient_phone})!`
    );
  };

  // Handle Parent direct reply to Admin
  const handleReplyToAdmin = (replyText: string, parentName: string, studentName: string) => {
    const parentMsg: DirectParentMessage = {
      id: 'dmsg-' + Date.now(),
      sender_role: 'parent',
      sender_name: `${parentName} (Mzazi wa ${studentName})`,
      recipient_phone: '+255 754 112 233',
      recipient_name: 'Mkuu wa Shule (Headteacher)',
      message: replyText,
      message_type: 'general',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'acknowledged',
      is_read_by_parent: true,
      channel: 'In-App',
    };

    setDirectMessages((prev) => [parentMsg, ...prev]);

    handleRecordLocalChange(
      'direct_messages',
      'INSERT',
      language === 'sw'
        ? `Jibu la mzazi ${parentName} kwa Admin limehifadhiwa: "${replyText.slice(0, 40)}..."`
        : `Parent reply from ${parentName} saved: "${replyText.slice(0, 40)}..."`
    );

    triggerToast(
      language === 'sw'
        ? `📬 Ujumbe wako wa majibu umetumwa moja kwa moja kwa Mkuu wa Shule!`
        : `📬 Your reply has been sent directly to the Headteacher!`
    );
  };

  // Mark message as read
  const handleMarkMessageAsRead = (msgId: string) => {
    setDirectMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, is_read_by_parent: true } : m))
    );
  };

  // Open Direct SMS Modal with optional pre-selected parent
  const handleOpenDirectSmsModal = (parentId?: string) => {
    setSelectedParentIdForSms(parentId);
    setIsDirectSmsModalOpen(true);
  };

  const pendingCount = syncQueue.filter((i) => i.status === 'pending').length;

  // Global theme background class
  const getGlobalThemeClass = () => {
    switch (themeSettings.theme) {
      case 'light-modern':
        return 'bg-slate-900 text-slate-100 selection:bg-blue-500/40';
      case 'royal-navy':
        return 'bg-[#060c1c] text-blue-100 selection:bg-blue-500/40';
      case 'emerald-school':
        return 'bg-[#04140e] text-emerald-100 selection:bg-emerald-500/40';
      case 'sunset-amber':
        return 'bg-[#150a04] text-amber-100 selection:bg-amber-500/40';
      case 'dark-gold':
      default:
        return 'bg-slate-950 text-slate-100 selection:bg-amber-500/30';
    }
  };

  return (
    <div className={`min-h-screen ${getGlobalThemeClass()} flex flex-col font-sans transition-colors duration-300`}>
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        deviceView={deviceView}
        setDeviceView={setDeviceView}
        isOnline={isOnline}
        setIsOnline={setIsOnline}
        pendingSyncCount={pendingCount}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        {activeTab === 'app-simulator' && (
          <DeviceFrame
            deviceView={deviceView}
            language={language}
            userRole={userRole}
            setUserRole={setUserRole}
            isOnline={isOnline}
            onSendSms={handleSendSms}
            onRecordLocalChange={handleRecordLocalChange}
            themeSettings={themeSettings}
            onOpenThemeModal={() => setIsThemeModalOpen(true)}
            linkedParents={linkedParents}
            onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
            onOpenDirectSmsModal={handleOpenDirectSmsModal}
            directMessages={directMessages}
            onSendDirectSms={handleSendDirectSms}
            onMarkMessageAsRead={handleMarkMessageAsRead}
            onReplyToAdmin={handleReplyToAdmin}
          />
        )}

        {activeTab === 'db-schema' && <SchemaVisualizer language={language} />}

        {activeTab === 'sql-scripts' && <SqlScriptViewer language={language} />}

        {activeTab === 'android-architecture' && <ArchitectureViewer language={language} />}

        {activeTab === 'roles-auth' && <RolesAuthViewer language={language} />}
      </main>

      {/* Offline Sync Floating Drawer / Indicator */}
      {pendingCount > 0 && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-amber-950/90 border border-amber-500/60 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md text-xs text-amber-200 animate-bounce">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>
                {language === 'sw'
                  ? `${pendingCount} Zinasubiri Mtandao (Room DB)`
                  : `${pendingCount} Pending Offline Sync Items`}
              </span>
            </span>
            <button
              onClick={() => setIsOnline(true)}
              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px]"
            >
              {language === 'sw' ? 'Washa 4G' : 'Go Online'}
            </button>
          </div>
          <p className="text-[11px] text-amber-300/80">
            {language === 'sw'
              ? 'Data imehifadhiwa ndani ya simu ya mwalimu. Bofya "Washa 4G" au subiri simu ifike ofisini kusawazisha na seva kuu.'
              : 'Stored safely in local SQLite storage. Will auto-commit to backend once connectivity is restored.'}
          </p>
        </div>
      )}

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-amber-500/50 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-lg text-center animate-in fade-in slide-in-from-top-4">
          <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Modals */}
      {isThemeModalOpen && (
        <ThemeModal
          language={language}
          currentSettings={themeSettings}
          onUpdateSettings={(newSettings) => {
            setThemeSettings(newSettings);
            triggerToast(
              language === 'sw'
                ? `🎨 Mwonekano umesasishwa: ${newSettings.theme.toUpperCase()} (${newSettings.cardStyle})`
                : `🎨 Theme updated: ${newSettings.theme.toUpperCase()} (${newSettings.cardStyle})`
            );
          }}
          onClose={() => setIsThemeModalOpen(false)}
          userRoleName={
            userRole === 'admin'
              ? language === 'sw' ? 'Mkuu wa Shule' : 'Headteacher'
              : userRole === 'teacher'
              ? language === 'sw' ? 'Mwalimu' : 'Teacher'
              : language === 'sw' ? 'Mzazi' : 'Parent'
          }
        />
      )}

      {isRegisterModalOpen && (
        <ParentRegisterModal
          language={language}
          onClose={() => setIsRegisterModalOpen(false)}
          onRegister={(parentData) => {
            handleRegisterParent(parentData);
          }}
        />
      )}

      {isDirectSmsModalOpen && (
        <SendDirectSmsModal
          language={language}
          linkedParents={linkedParents}
          selectedParentId={selectedParentIdForSms}
          onClose={() => {
            setIsDirectSmsModalOpen(false);
            setSelectedParentIdForSms(undefined);
          }}
          onSend={(newMsg) => {
            handleSendDirectSms(newMsg);
          }}
        />
      )}

      {/* Global Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 Top Stars Nursery & Primary School • Morogoro, Tanzania
          </span>
          <span className="text-slate-400">
            Architecture & Database Management System (DBMS) Spec
          </span>
        </div>
      </footer>
    </div>
  );
}

