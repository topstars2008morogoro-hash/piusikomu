import React from 'react';
import { ActiveTab, DeviceView, Language } from '../types';
import { SCHOOL_INFO } from '../data/mockData';
import { SchoolLogo } from './SchoolLogo';
import { Smartphone, Tablet, Monitor, Wifi, WifiOff, Globe, Database, FileCode, Layers, ShieldCheck, Palette } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  deviceView: DeviceView;
  setDeviceView: (view: DeviceView) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncCount: number;
  onOpenThemeModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  deviceView,
  setDeviceView,
  isOnline,
  setIsOnline,
  pendingSyncCount,
  onOpenThemeModal,
}) => {
  const isSw = language === 'sw';

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      {/* Top Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Official Top Stars School Logo Crest */}
          <SchoolLogo size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight">
                {isSw ? SCHOOL_INFO.name_sw : SCHOOL_INFO.name}
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Morogoro, TZ
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap sm:flex-nowrap">
              {/* Sliding Motto Badge */}
              <div className="flex items-center gap-1.5 overflow-hidden max-w-[280px] sm:max-w-md bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-sm">
                <span className="text-[10px] font-extrabold uppercase text-amber-400 flex-shrink-0 tracking-wider">
                  MOTTO:
                </span>
                <div className="overflow-hidden whitespace-nowrap flex-1">
                  <div className="animate-marquee-smooth inline-flex items-center text-[11px] font-bold text-amber-300 tracking-wider uppercase">
                    <span className="mr-8 flex items-center gap-2">
                      <span>✨ QUALITY EDUCATION, ETHICS AND VALUES ✨</span>
                      <span className="text-amber-500/50">•</span>
                      <span className="text-amber-100 font-semibold">{isSw ? 'ELIMU BORA, MAADILI NA MISINGI' : 'EST. 2008 MOROGORO'}</span>
                    </span>
                    <span className="mr-8 flex items-center gap-2">
                      <span>✨ QUALITY EDUCATION, ETHICS AND VALUES ✨</span>
                      <span className="text-amber-500/50">•</span>
                      <span className="text-amber-100 font-semibold">{isSw ? 'ELIMU BORA, MAADILI NA MISINGI' : 'EST. 2008 MOROGORO'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-slate-400 text-[11px]">Est. 2008 • {SCHOOL_INFO.registration_number}</span>
            </div>
          </div>
        </div>

        {/* Global Controls: Language, Network Simulation, Device Frame */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Network Simulator: Online / Offline Mode */}
          <button
            id="network-toggle-btn"
            onClick={() => setIsOnline(!isOnline)}
            title={isOnline ? (isSw ? 'Bofya kujaribu hali ya bila mtandao' : 'Click to test offline mode') : (isSw ? 'Bofya kuwasha mtandao' : 'Click to restore network')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 hover:bg-emerald-900/40'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-400 hover:bg-rose-900/50 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{isOnline ? (isSw ? 'Mtandao: 4G/Wi-Fi' : 'Online (4G/Wi-Fi)') : (isSw ? 'Nje ya Mtandao (Offline)' : 'Offline (Room DB)')}</span>
            {pendingSyncCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px]">
                {pendingSyncCount}
              </span>
            )}
          </button>

          {/* Device Switcher (active only when app simulator is selected) */}
          {activeTab === 'app-simulator' && (
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
              <button
                id="view-mobile-btn"
                onClick={() => setDeviceView('mobile')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  deviceView === 'mobile' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Android Phone View"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Phone</span>
              </button>
              <button
                id="view-tablet-btn"
                onClick={() => setDeviceView('tablet')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  deviceView === 'tablet' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Android Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Tablet</span>
              </button>
              <button
                id="view-desktop-btn"
                onClick={() => setDeviceView('desktop')}
                className={`p-1.5 rounded text-xs flex items-center gap-1 transition-colors ${
                  deviceView === 'desktop' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-white'
                }`}
                title="Responsive Full Screen"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Full</span>
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              id="lang-sw-btn"
              onClick={() => setLanguage('sw')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                language === 'sw' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇹🇿</span>
              <span>Kiswahili</span>
            </button>
            <button
              id="lang-en-btn"
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                language === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>

          {/* Theme & Appearance Switcher */}
          {onOpenThemeModal && (
            <button
              id="global-theme-btn"
              onClick={onOpenThemeModal}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
              title={isSw ? 'Badili Rangi & Mwonekano' : 'Change Theme & Visual Style'}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{isSw ? 'Mwonekano' : 'Theme'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Prominent Sliding Motto Ticker Ribbon */}
      <div className="w-full bg-gradient-to-r from-amber-500/15 via-yellow-500/20 to-amber-500/15 border-t border-amber-500/30 py-1.5 px-4 overflow-hidden flex items-center shadow-inner">
        <div className="flex items-center gap-1.5 flex-shrink-0 mr-3 px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-sm">
          <span>🎓</span>
          <span>MOTTO:</span>
        </div>
        <div className="overflow-hidden relative flex-1 whitespace-nowrap">
          <div className="animate-marquee-smooth inline-flex items-center text-xs font-black text-amber-300 tracking-wider uppercase">
            <span className="mr-12 flex items-center gap-3">
              <span>⭐ QUALITY EDUCATION, ETHICS AND VALUES ⭐</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-yellow-300 font-bold">{isSw ? 'ELIMU BORA, MAADILI NA MISINGI' : 'TOP STARS NURSERY & PRIMARY SCHOOL'}</span>
              <span className="text-amber-500/60">•</span>
              <span>⭐ QUALITY EDUCATION, ETHICS AND VALUES ⭐</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-yellow-300 font-bold">{isSw ? 'MOROGORO, TANZANIA (EST. 2008)' : 'MOROGORO, TANZANIA (EST. 2008)'}</span>
            </span>
            <span className="mr-12 flex items-center gap-3">
              <span>⭐ QUALITY EDUCATION, ETHICS AND VALUES ⭐</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-yellow-300 font-bold">{isSw ? 'ELIMU BORA, MAADILI NA MISINGI' : 'TOP STARS NURSERY & PRIMARY SCHOOL'}</span>
              <span className="text-amber-500/60">•</span>
              <span>⭐ QUALITY EDUCATION, ETHICS AND VALUES ⭐</span>
              <span className="text-amber-500/60">•</span>
              <span className="text-yellow-300 font-bold">{isSw ? 'MOROGORO, TANZANIA (EST. 2008)' : 'MOROGORO, TANZANIA (EST. 2008)'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto scrollbar-none border-t border-slate-800/80">
        <button
          id="tab-app-simulator"
          onClick={() => setActiveTab('app-simulator')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'app-simulator'
              ? 'border-amber-400 text-amber-400 bg-amber-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{isSw ? '📱 Kiigaji cha App ya Android (Live UI/UX)' : '📱 Android App Live Dashboards'}</span>
        </button>

        <button
          id="tab-db-schema"
          onClick={() => setActiveTab('db-schema')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'db-schema'
              ? 'border-amber-400 text-amber-400 bg-amber-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>{isSw ? '🗄️ Muundo wa Database (Schema & ERD)' : '🗄️ Database Schema & Relations'}</span>
        </button>

        <button
          id="tab-sql-scripts"
          onClick={() => setActiveTab('sql-scripts')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'sql-scripts'
              ? 'border-amber-400 text-amber-400 bg-amber-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>{isSw ? '💻 DDL Scripts za SQL (PostgreSQL / MySQL)' : '💻 Production SQL DDL'}</span>
        </button>

        <button
          id="tab-android-architecture"
          onClick={() => setActiveTab('android-architecture')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'android-architecture'
              ? 'border-amber-400 text-amber-400 bg-amber-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{isSw ? '🏗️ Ramani ya Android & Offline Sync' : '🏗️ Android Architecture & Sync'}</span>
        </button>

        <button
          id="tab-roles-auth"
          onClick={() => setActiveTab('roles-auth')}
          className={`flex items-center gap-2 py-2.5 px-3 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'roles-auth'
              ? 'border-amber-400 text-amber-400 bg-amber-400/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isSw ? '🔐 Wajibu & Ulinzi (RBAC & Auth)' : '🔐 User Roles & Auth (RBAC)'}</span>
        </button>
      </div>
    </header>
  );
};
