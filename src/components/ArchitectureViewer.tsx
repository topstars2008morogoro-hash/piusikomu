import React, { useState } from 'react';
import { TECH_STACK_RECOMMENDATIONS, KOTLIN_CODE_SNIPPETS } from '../data/androidArchitectureDoc';
import { Language } from '../types';
import { Layers, Smartphone, Database, Cloud, RefreshCw, Bell, Cpu, ArrowRight, ShieldCheck, CheckCircle2, Code2, Copy, Check } from 'lucide-react';

interface ArchitectureViewerProps {
  language: Language;
}

export const ArchitectureViewer: React.FC<ArchitectureViewerProps> = ({ language }) => {
  const isSw = language === 'sw';
  const [activeCodeTab, setActiveCodeTab] = useState<'entity' | 'dao' | 'worker'>('entity');
  const [copiedCode, setCopiedCode] = useState(false);

  const getActiveCode = () => {
    switch (activeCodeTab) {
      case 'entity':
        return KOTLIN_CODE_SNIPPETS.roomEntity;
      case 'dao':
        return KOTLIN_CODE_SNIPPETS.roomDao;
      case 'worker':
        return KOTLIN_CODE_SNIPPETS.syncWorker;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase tracking-wider">
            {isSw ? 'Mkakati wa Uhandisi (Tech Stack & Architecture)' : 'Android Enterprise Architecture'}
          </span>
          <span className="text-slate-400 text-xs">• Offline-First • Clean Architecture</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {isSw ? 'Ramani ya Android App & Mfumo wa Offline Sync' : 'Android App Architecture & Offline Synchronization'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          {isSw
            ? 'Uchambuzi wa kina wa teknolojia bora kwa ajili ya mazingira ya Morogoro, Tanzania: Utumiaji wa Kotlin + Jetpack Compose, Room Database kwa hali ya bila mtandao (Offline), Seva Kuu ya PostgreSQL, na Ujumbe wa Haraka wa FCM + SMS.'
            : 'Detailed technological blueprint designed for Tanzanian school conditions: Native Kotlin + Jetpack Compose, Room SQLite with WAL offline mode, PostgreSQL cloud backend, and dual FCM push + local SMS gateway alerts.'}
        </p>
      </div>

      {/* 3-Tier Clean Architecture Layer Diagram */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>{isSw ? 'Muundo wa Tabaka Tatu (Clean Architecture Layers)' : 'Clean Architecture Layer Stack'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Layer 1: Presentation (UI) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-blue-400 uppercase tracking-wider">
                  {isSw ? '1. Tabaka la UI (Muonekano)' : '1. Presentation Layer'}
                </span>
                <Smartphone className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Jetpack Compose + ViewModel</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isSw
                  ? 'Kiolesura cha kisasa cha Android kinachofanya kazi kwa wepesi bila kutumia XML. Hutumia Kotlin StateFlow kwa ajili ya kubadili data mara moja skrini inapofunguka.'
                  : 'Modern declarative UI with zero XML boilerplate. Reactive StateFlow streams driving high-performance 60fps renders on budget Android hardware.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-blue-300 bg-blue-950/40 p-2 rounded border border-blue-900">
              AdminView • TeacherView • ParentView
            </div>
          </div>

          {/* Layer 2: Domain (Logic) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                  {isSw ? '2. Tabaka la Mantiki (Domain)' : '2. Domain Layer'}
                </span>
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">UseCases & Business Rules</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isSw
                  ? 'Hushughulikia sheria zote za shule: Kukokotoa Madaraja ya NECTA, Udhibiti wa Malipo ya Ada (TZS), na kuthibitisha ruhusa za watumiaji (RBAC).'
                  : 'Encapsulates school business rules: NECTA grading conversion, fee control number reconciliation, and role access validation.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-300 bg-amber-950/40 p-2 rounded border border-amber-900">
              CalculateNectaGradeUseCase • RecordRollCall
            </div>
          </div>

          {/* Layer 3: Data (Local & Remote) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                  {isSw ? '3. Tabaka la Data (Hifadhi)' : '3. Data Repository Layer'}
                </span>
                <Database className="w-4 h-4 text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Room DB + Retrofit + WorkManager</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isSw
                  ? 'Mfumo wa "Offline-First". Data inasomwa na kuandikwa kwanza kwenye simu (Room DB). Seva ikipatikana, WorkManager inatuma mabadiliko kiotomatiki.'
                  : 'Offline-First repository pattern. The app always queries and mutates the local SQLite database; WorkManager synchronizes mutations with the Cloud.'}
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-900">
              AttendanceRepository • OfflineSyncWorker
            </div>
          </div>
        </div>
      </div>

      {/* Offline Sync Protocol Walkthrough */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-400" />
              <span>{isSw ? 'Mzunguko wa Ulandanishaji wa Nje ya Mtandao (Offline Sync Flow)' : 'Two-Way Offline Synchronization Flow'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isSw
                ? 'Jinsi walimu wanavyofanya kazi Morogoro hata umeme au mtandao wa simu ukikatika'
                : 'Resilient data consistency under intermittent cellular connections in Morogoro'}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
            Guaranteed Consistency
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center">1</span>
            <h5 className="font-bold text-white">{isSw ? 'Mwalimu Kujaza Darasani' : 'Teacher Roll Call Offline'}</h5>
            <p className="text-slate-400 text-[11px]">
              {isSw
                ? 'Mwalimu anafungua app darasani bila intaneti. Anajaza mahudhurio ya Darasa la IV.'
                : 'Teacher records student attendance inside classrooms without Wi-Fi or data bundles.'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-black text-xs flex items-center justify-center">2</span>
            <h5 className="font-bold text-white">{isSw ? 'Kuhifadhi Kwenye Room DB' : 'Persist to Room SQLite'}</h5>
            <p className="text-slate-400 text-[11px]">
              {isSw
                ? 'Data inarekodiwa kwenye simu yenye alama ya `is_synced = FALSE` na timestamp ya sasa.'
                : 'Stored immediately in device local storage flagged with `is_synced = false` and client timestamp.'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-black text-xs flex items-center justify-center">3</span>
            <h5 className="font-bold text-white">{isSw ? 'WorkManager Kugundua Mtandao' : 'WorkManager Triggers'}</h5>
            <p className="text-slate-400 text-[11px]">
              {isSw
                ? 'Simu inapopata 4G au Wi-Fi ofisini, Android OS inaamsha OfflineSyncWorker kiotomatiki.'
                : 'Android OS detects network availability constraint and launches background worker.'}
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs flex items-center justify-center">4</span>
            <h5 className="font-bold text-white">{isSw ? 'Kuthibitishwa na Seva Kuu' : 'Cloud Reconciliation'}</h5>
            <p className="text-slate-400 text-[11px]">
              {isSw
                ? 'Seva inasajili rekodi, inatuma `HTTP 200 OK`, na simu inabadilisha kuwa `is_synced = TRUE`.'
                : 'Backend logs changes, updates server tables, and device marks records as fully synchronized.'}
            </p>
          </div>
        </div>
      </div>

      {/* Push Notifications & SMS Hybrid Architecture */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">
            {isSw ? 'Mfumo Pacha wa Arifa (FCM Push + Tanzania SMS Fallback)' : 'Hybrid Notification Architecture (FCM + Cellular SMS)'}
          </h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {isSw
            ? 'Kwa kuwa baadhi ya wazazi mjini au pembezoni mwa Morogoro wanaweza kuwa hawana bando la intaneti muda wote, mfumo unatumia mfumo pacha: Wazazi wenye intaneti wanapokea bure arifa ya Firebase (FCM). Ikiwa mtoto hataripotiwa shuleni ifikapo saa 2:30 asubuhi, au risiti ya ada inatoka, mfumo unachochea moja kwa moja SMS ya kawaida (kupitia Beem Africa au mtoa huduma wa SMS Tanzania) inayomfikia mzazi hata kwenye simu ya kawaida (kitochi).'
            : 'Acknowledging that not all parents maintain 24/7 smartphone data bundles, the system implements an intelligent dual-channel pipeline: Firebase Cloud Messaging (FCM) push notifications are sent for real-time app users, while automated transactional SMS triggers over local Tanzanian telco gateways (Vodacom, Airtel, Tigo, Halotel) for urgent absentee alerts and fee receipts.'}
        </p>
      </div>

      {/* Tech Stack Comparison Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">
          {isSw ? 'Ulinganisho wa Teknolojia Zilizochaguliwa (Tech Stack Selection)' : 'Component Stack Justification'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 font-semibold">
                <th className="pb-2">{isSw ? 'Ngazi ya Mfumo' : 'System Layer'}</th>
                <th className="pb-2">{isSw ? 'Teknolojia Iliyopendekezwa' : 'Recommended Solution'}</th>
                <th className="pb-2">{isSw ? 'Njia Mbadala' : 'Alternative'}</th>
                <th className="pb-2">{isSw ? 'Sababu Kuu (Morogoro Context)' : 'Key Justification'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {TECH_STACK_RECOMMENDATIONS.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 font-bold text-white">{item.layer}</td>
                  <td className="py-2.5 font-semibold text-emerald-400">{item.technology}</td>
                  <td className="py-2.5 text-slate-400">{item.alternative}</td>
                  <td className="py-2.5 text-slate-300 text-[11px] leading-relaxed">
                    {isSw ? item.verdict_sw : item.verdict_and_reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Snippets Section (Room Entity, DAO, WorkManager) */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-white font-mono">
              Android Kotlin Code Reference (Room & WorkManager)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveCodeTab('entity')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                  activeCodeTab === 'entity' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                AttendanceEntity.kt
              </button>
              <button
                onClick={() => setActiveCodeTab('dao')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                  activeCodeTab === 'dao' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                AttendanceDao.kt
              </button>
              <button
                onClick={() => setActiveCodeTab('worker')}
                className={`px-2.5 py-1 rounded font-mono text-[11px] transition-colors ${
                  activeCodeTab === 'worker' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                OfflineSyncWorker.kt
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? (isSw ? 'Imenakiliwa' : 'Copied') : (isSw ? 'Nakili' : 'Copy')}</span>
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5 overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed">
            <code>{getActiveCode()}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
