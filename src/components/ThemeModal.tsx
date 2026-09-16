import React from 'react';
import { Language, ThemeMode, FontSizeMode, CardStyleMode, ThemeSettings } from '../types';
import { Palette, Check, Sparkles, Type, Layout, X } from 'lucide-react';

interface ThemeModalProps {
  language: Language;
  currentSettings: ThemeSettings;
  onUpdateSettings: (settings: ThemeSettings) => void;
  onClose: () => void;
  userRoleName?: string;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  language,
  currentSettings,
  onUpdateSettings,
  onClose,
  userRoleName,
}) => {
  const isSw = language === 'sw';

  const themes: {
    id: ThemeMode;
    name_sw: string;
    name_en: string;
    desc_sw: string;
    desc_en: string;
    bgClass: string;
    borderClass: string;
    accentColor: string;
    badge: string;
  }[] = [
    {
      id: 'dark-gold',
      name_sw: 'Top Stars Dhahabu (Giza)',
      name_en: 'Top Stars Gold (Dark)',
      desc_sw: 'Mwonekano rasmi wa shule: Slate ya Giza na Dhahabu ya Morogoro',
      desc_en: 'Default school palette: Deep slate with radiant golden amber',
      bgClass: 'bg-slate-900',
      borderClass: 'border-amber-500/50',
      accentColor: 'bg-amber-400',
      badge: '👑 Rasmi (Default)',
    },
    {
      id: 'light-modern',
      name_sw: 'Mwonekano Mweupe Safi (Mchana)',
      name_en: 'Modern Light (Daylight)',
      desc_sw: 'Mandhari meupe safi yenye usomaji wa juu sana mchana',
      desc_en: 'Crisp white theme optimized for bright daylight reading',
      bgClass: 'bg-slate-100 text-slate-900',
      borderClass: 'border-slate-300',
      accentColor: 'bg-blue-600',
      badge: '☀️ Mchana / Daylight',
    },
    {
      id: 'royal-navy',
      name_sw: 'Buluu ya Kifalme (Royal Navy)',
      name_en: 'Royal Navy & Gold',
      desc_sw: 'Buluu nzito ya kisasa yenye madoido ya dhahabu na cyan',
      desc_en: 'Deep royal sapphire palette with cyan and golden highlights',
      bgClass: 'bg-[#0b1329]',
      borderClass: 'border-blue-500/50',
      accentColor: 'bg-blue-500',
      badge: '💎 Kifalme / Executive',
    },
    {
      id: 'emerald-school',
      name_sw: 'Kijani cha Mazingira (Emerald)',
      name_en: 'Academic Emerald Green',
      desc_sw: 'Kijani kibichi cha taaluma na maendeleo ya wanafunzi',
      desc_en: 'Lush Tanzanian academy green symbolizing growth and nature',
      bgClass: 'bg-[#061d15]',
      borderClass: 'border-emerald-500/50',
      accentColor: 'bg-emerald-400',
      badge: '🌿 Elimu & Maadili',
    },
    {
      id: 'sunset-amber',
      name_sw: 'Mwanga wa Jua (Sunset Bronze)',
      name_en: 'Sunset Amber & Bronze',
      desc_sw: 'Mchanganyiko wa shaba na mwanga mchangamfu wa Morogoro',
      desc_en: 'Warm bronze and glowing amber accents with high contrast',
      bgClass: 'bg-[#1b120c]',
      borderClass: 'border-orange-500/50',
      accentColor: 'bg-orange-400',
      badge: '🌅 Morogoro Sunset',
    },
  ];

  const fontSizes: {
    id: FontSizeMode;
    title_sw: string;
    title_en: string;
    subtitle_sw: string;
    subtitle_en: string;
    sizeSample: string;
  }[] = [
    {
      id: 'compact',
      title_sw: 'Ndogo (Compact 92%)',
      title_en: 'Compact (92%)',
      subtitle_sw: 'Nzuri kwa kutazama jedwali na ripoti zenye data nyingi',
      subtitle_en: 'High density for tables, grades and extensive data',
      sizeSample: 'Aa',
    },
    {
      id: 'normal',
      title_sw: 'Kawaida (Standard 100%)',
      title_en: 'Standard (100%)',
      subtitle_sw: 'Ukubwa wa kawaida uliosawazishwa kwa vifaa vyote',
      subtitle_en: 'Balanced standard typography across all screens',
      sizeSample: 'Aa',
    },
    {
      id: 'large',
      title_sw: 'Kubwa (Readable 110%)',
      title_en: 'Large / Readable (110%)',
      subtitle_sw: 'Rahisi sana kusoma kwa wazazi na walimu kwenye simu',
      subtitle_en: 'Enhanced legibility for reading SMS and notices easily',
      sizeSample: 'Aa',
    },
  ];

  const cardStyles: {
    id: CardStyleMode;
    title_sw: string;
    title_en: string;
    radiusLabel: string;
  }[] = [
    {
      id: 'rounded',
      title_sw: 'Kisasa (Mviringo Laini 16px)',
      title_en: 'Modern Soft Rounded (16px)',
      radiusLabel: 'rounded-2xl',
    },
    {
      id: 'classic',
      title_sw: 'Imara (Classic Sharp 8px)',
      title_en: 'Classic Sharp (8px)',
      radiusLabel: 'rounded-lg',
    },
    {
      id: 'minimal',
      title_sw: 'Bapa Safi (Minimal Flat)',
      title_en: 'Minimal Flat',
      radiusLabel: 'rounded-none',
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-4 my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>{isSw ? 'Badili Mwonekano & Style ya Shule' : 'Appearance & Theme Customizer'}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSw
                  ? `Inatumika kwa wote: Mkuu wa Shule, Walimu, na Wazazi (${userRoleName || 'Watumiaji Wote'})`
                  : `Customizes visual styles for Admin, Teachers, and Parents`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. COLOR THEMES */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSw ? 'Chagua Rangi ya Mwonekano (Color Theme):' : 'Select Color Theme:'}</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {themes.map((t) => {
              const isSelected = currentSettings.theme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ ...currentSettings, theme: t.id })}
                  className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-400 bg-slate-800 ring-2 ring-amber-500/30 shadow-md'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-3.5 h-3.5 rounded-full ${t.accentColor} shadow-sm inline-block`}></span>
                      <span className="text-xs font-bold text-white">{isSw ? t.name_sw : t.name_en}</span>
                    </div>
                    {isSelected && (
                      <span className="p-0.5 rounded-full bg-amber-500 text-slate-950">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-tight mb-1">
                    {isSw ? t.desc_sw : t.desc_en}
                  </p>
                  <span className="text-[9px] font-bold text-amber-400/90 font-mono mt-auto">
                    {t.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. FONT SIZING */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-blue-400" />
            <span>{isSw ? 'Ukubwa wa Maandishi (Font Sizing):' : 'Font Size & Readability:'}</span>
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            {fontSizes.map((f) => {
              const isSelected = currentSettings.fontSize === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ ...currentSettings, fontSize: f.id })}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-blue-400 bg-blue-950/40 text-white font-bold ring-1 ring-blue-400/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`font-black mb-0.5 ${f.id === 'large' ? 'text-base' : f.id === 'compact' ? 'text-xs' : 'text-sm'}`}>
                    {f.sizeSample}
                  </div>
                  <div className="text-[11px] font-bold">{isSw ? f.title_sw : f.title_en}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. CARD & CORNER STYLE */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSw ? 'Muundo wa Vipeo vya Kadi (Card Corner Style):' : 'Card & Button Corners:'}</span>
          </label>

          <div className="grid grid-cols-3 gap-1.5">
            {cardStyles.map((c) => {
              const isSelected = currentSettings.cardStyle === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => onUpdateSettings({ ...currentSettings, cardStyle: c.id })}
                  className={`p-2 rounded-xl border text-center text-xs transition-all ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/40 text-white font-bold ring-1 ring-emerald-400/40'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{isSw ? c.title_sw : c.title_en}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <Check className="w-3.5 h-3.5" />
            <span>{isSw ? 'Inabadilika papo hapo!' : 'Applies instantly across portals!'}</span>
          </span>

          <button
            id="btn-close-theme-modal"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs shadow-md transition-transform active:scale-95"
          >
            {isSw ? 'Hifadhi & Funga' : 'Save & Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
