import React, { useState } from 'react';
import { Language, LinkedParent, DirectParentMessage, CarrierType } from '../types';
import { CLASSES } from '../data/mockData';
import {
  CLASS_ORDER,
  GRADUATED_CLASS_NAME,
  isMatchingClass,
  getAllChildren,
  getOtherChildren,
  parentHasChildInClass,
  getNextClass,
} from '../utils/classPromotion';
import {
  Users,
  Phone,
  Plus,
  MessageSquare,
  Sparkles,
  Link as LinkIcon,
  Calendar,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Search,
  CheckCircle2,
  RefreshCw,
  Clock,
  Layers,
  ChevronRight,
  AlertCircle,
  X,
} from 'lucide-react';

interface ClassParentsManagerProps {
  language: Language;
  linkedParents: LinkedParent[];
  onOpenRegisterModalForClass: (className: string) => void;
  onOpenDirectSmsModal: (parentId?: string, targetPhone?: string, prefillClass?: string) => void;
  currentAcademicYear: string;
  onPromoteAcademicYear: () => void;
  onResetAcademicYear?: () => void;
}

export const ClassParentsManager: React.FC<ClassParentsManagerProps> = ({
  language,
  linkedParents,
  onOpenRegisterModalForClass,
  onOpenDirectSmsModal,
  currentAcademicYear,
  onPromoteAcademicYear,
  onResetAcademicYear,
}) => {
  const isSw = language === 'sw';

  // Selected class tab
  const [selectedClassId, setSelectedClassId] = useState<string>('cls-std2');
  const [searchFilter, setSearchFilter] = useState('');
  const [showPromotionModal, setShowPromotionModal] = useState(false);

  // Active class object
  const currentClassObj =
    CLASS_ORDER.find((c) => c.id === selectedClassId) || CLASS_ORDER[4]; // Default Std 2

  const activeClassName = currentClassObj.name;

  // Parents with children in this selected class
  const parentsInActiveClass = linkedParents.filter((parent) =>
    parentHasChildInClass(parent, activeClassName)
  );

  // Apply search query
  const filteredParents = parentsInActiveClass.filter((parent) => {
    const q = searchFilter.toLowerCase();
    const matchesParent = parent.parent_name.toLowerCase().includes(q) || parent.phone_number.includes(q);
    const children = getAllChildren(parent);
    const matchesChild = children.some((c) => c.student_name.toLowerCase().includes(q));
    return matchesParent || matchesChild;
  });

  // Calculate parent count per class for tab badges
  const getClassParentCount = (className: string) => {
    return linkedParents.filter((p) => parentHasChildInClass(p, className)).length;
  };

  const nextYearNumber = parseInt(currentAcademicYear) + 1;

  return (
    <div className="space-y-4">
      {/* Top Banner: Class Parent Registration & Multi-Child Synchronization */}
      <div className="bg-gradient-to-r from-teal-900/40 via-slate-900 to-amber-900/40 border border-teal-500/30 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-teal-400" />
                <span>{isSw ? 'Usajili kwa Madarasa & Uhawilishaji Kila Mwaka' : 'Class-Specific Parent Registry & Annual Promotion'}</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-mono font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{isSw ? `Mwaka wa Masomo: ${currentAcademicYear}` : `Academic Year: ${currentAcademicYear}`}</span>
              </span>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-white">
              {isSw
                ? 'Daftari Rasmi la Wazazi kwa Kila Darasa (Top Stars)'
                : 'Official Class-Specific Parent Directory (Top Stars)'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isSw
                ? 'Kila darasa lina sehemu yake maalum ya kusajili wazazi. Mzazi akiwa na watoto kwenye madarasa tofauti (mf. Darasa la 2 na 3), akijazwa mara moja taarifa zake zinahamia na kulandanishwa moja kwa moja kwenye madarasa yote aliyo na watoto!'
                : 'Each class maintains its dedicated registry. Parents with children in different classes automatically sync across all enrolled classes once registered.'}
            </p>
          </div>

          {/* Quick Annual Promotion Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            <button
              id="annual-promotion-btn"
              onClick={() => setShowPromotionModal(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isSw ? `Hamisha Mwaka wa Masomo (${currentAcademicYear} ➔ ${nextYearNumber})` : `Promote Academic Year (${currentAcademicYear} ➔ ${nextYearNumber})`}</span>
            </button>

            {onResetAcademicYear && (
              <button
                onClick={onResetAcademicYear}
                title={isSw ? 'Rejesha Mwaka wa 2026' : 'Reset to 2026'}
                className="px-2.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center"
              >
                <Clock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Class Tabs Navigation (Baby Class to Standard VII) */}
      <div className="bg-slate-900 border border-slate-800 p-2 rounded-2xl">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pb-1.5 flex items-center justify-between">
          <span>{isSw ? 'Chagua Darasa la Kutazama au Kusajili Wazazi Wake:' : 'Select Class to Manage or Register Parents:'}</span>
          <span className="text-[10px] text-teal-400 font-normal">
            {isSw ? 'Wazazi wenye watoto wengi wanaonekana kwenye madarasa yote husika' : 'Multi-child parents appear in all enrolled classes'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {CLASS_ORDER.map((cls) => {
            const isSelected = selectedClassId === cls.id;
            const parentCount = getClassParentCount(cls.name);

            return (
              <button
                key={cls.id}
                id={`class-tab-${cls.id}`}
                onClick={() => setSelectedClassId(cls.id)}
                className={`py-2 px-2.5 rounded-xl text-left text-xs font-semibold transition-all flex flex-col justify-between gap-1 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-400 shadow-md scale-[1.02]'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/70 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs truncate flex items-center justify-between">
                  <span>{cls.shortName}</span>
                  {cls.level === 'nursery' ? (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300">Awali</span>
                  ) : (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-blue-500/20 text-blue-300">Msingi</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className={isSelected ? 'text-teal-100' : 'text-slate-400'}>
                    {parentCount} {isSw ? 'Wazazi' : 'Parents'}
                  </span>
                  {parentCount > 0 && (
                    <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-300' : 'bg-emerald-400'}`}></span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Class Action Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black text-base flex-shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
              {isSw ? 'Daftari la Darasa Maalum' : 'Class Register'}
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              {activeClassName}
            </h3>
            <p className="text-xs text-slate-400">
              {isSw
                ? `Jumla ya Wazazi Waliosajiliwa kwenye darasa hili: ${parentsInActiveClass.length}`
                : `Total Parents Registered for this class: ${parentsInActiveClass.length}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search within class */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={isSw ? 'Tafuta mzazi au mtoto...' : 'Search in this class...'}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Register Parent specifically for this class */}
          <button
            id="register-parent-for-class-btn"
            onClick={() => onOpenRegisterModalForClass(activeClassName)}
            className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>{isSw ? `+ Sajili Mzazi wa ${currentClassObj.shortName}` : `+ Register Parent for ${currentClassObj.shortName}`}</span>
          </button>

          {/* Direct SMS to this class */}
          <button
            onClick={() => onOpenDirectSmsModal(undefined, undefined, activeClassName)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
            <span>{isSw ? 'SMS kwa Darasa Hili' : 'SMS This Class'}</span>
          </button>
        </div>
      </div>

      {/* Parents Cards Grid for this Class */}
      {filteredParents.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-6 space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-600">
            <Users className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-white">
            {isSw
              ? `Hakuna wazazi waliosajiliwa bado katika ${activeClassName}`
              : `No parents registered yet in ${activeClassName}`}
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isSw
              ? `Bofya kitufe cha "+ Sajili Mzazi wa ${currentClassObj.shortName}" kuanza kuunganisha namba zao. Kama mzazi ana watoto kwenye madarasa mengine, taarifa zake zitasawazishwa moja kwa moja.`
              : `Click "+ Register Parent for ${currentClassObj.shortName}" to start adding parents. Multi-child cross-sync is automatic.`}
          </p>
          <button
            onClick={() => onOpenRegisterModalForClass(activeClassName)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{isSw ? `Sajili Mzazi wa Kwanza (${currentClassObj.shortName})` : `Register First Parent (${currentClassObj.shortName})`}</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredParents.map((parent) => {
            const allChildren = getAllChildren(parent);
            // Children enrolled in this specific class
            const classChildren = allChildren.filter((c) => isMatchingClass(c.class_name, activeClassName));
            // Other children in different classes
            const otherChildren = getOtherChildren(parent, activeClassName);
            const hasChildrenInOtherClasses = otherChildren.length > 0;

            return (
              <div
                key={parent.id}
                className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 transition-all flex flex-col justify-between gap-3.5 shadow-sm"
              >
                <div className="space-y-3">
                  {/* Top Bar: Carrier badge + Phone Linked status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[11px] font-bold text-emerald-300">
                        {isSw ? 'Imeunganishwa na Admin' : 'Admin Linked'}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950 border border-slate-700 text-amber-300">
                      {parent.carrier}
                    </span>
                  </div>

                  {/* Parent Profile */}
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600/30 to-emerald-600/30 border border-teal-500/40 flex items-center justify-center text-teal-300 font-extrabold text-sm flex-shrink-0">
                      {parent.parent_name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-white truncate">{parent.parent_name}</h4>

                      <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        <span>{parent.phone_number}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1">
                        📍 <span>{parent.residence_area || 'Morogoro'}</span> •{' '}
                        <span>{isSw ? 'Mwaka:' : 'Year:'} {parent.academic_year || currentAcademicYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* Children in THIS Class */}
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1">
                    <div className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      <span>{isSw ? `Mtoto katika ${activeClassName}:` : `Child in ${activeClassName}:`}</span>
                    </div>
                    {classChildren.map((c, idx) => (
                      <div key={idx} className="text-xs font-semibold text-white flex items-center justify-between">
                        <span>{c.student_name}</span>
                        {c.student_admission && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                            {c.student_admission}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CROSS-CLASS AUTO-SYNC BADGE (User requirement):
                      "KAMA MZAZI ANAWATOTO MADARASA TOFAUTI ZIKISHAJAZWA SEHEMU MOJA BAS TAARIFA ZAKE ZIHAME MOJA KWA MOJA KWENY HAYOMADARASA AMBAYO ANAWATOTO YOTE, MFANO MZAZI ANA WATOTO DARASA LA 2 NA 3 BASI AKIJAZWA DARASA LA 2 BAS KULE DARASA LA 3 ZIHAME MOJA KWA MOJA" */}
                  {hasChildrenInOtherClasses && (
                    <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-teal-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="text-[10px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                        <LinkIcon className="w-3 h-3 text-amber-400" />
                        <span>
                          {isSw
                            ? '🔄 Zimeunganishwa Moja kwa Moja kwenye Madarasa Mengine:'
                            : '🔄 Auto-Synced in Other Classes:'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {otherChildren.map((oc, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[11px] text-slate-200 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800"
                          >
                            <span className="font-semibold text-amber-200">
                              {oc.student_name}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-medium">
                              {oc.class_name.split('(')[0].trim()}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 italic">
                        {isSw
                          ? '✓ Taarifa za mzazi huyu zinasawazishwa kiotomatiki kwenye madarasa yote haya.'
                          : '✓ Parent profile is automatically synchronized across all enrolled classes.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer: Send SMS directly to this parent */}
                <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    {isSw ? `${parent.total_messages_received || 0} SMS zimepokelewa` : `${parent.total_messages_received || 0} SMS received`}
                  </span>

                  <button
                    onClick={() => onOpenDirectSmsModal(parent.id, parent.phone_number, activeClassName)}
                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{isSw ? 'Tuma SMS' : 'Direct SMS'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ANNUAL PROMOTION MODAL ("KILAMWAKA ZIHAME MOJA KWAMOJA") */}
      {showPromotionModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {isSw ? 'Uhawilishaji wa Madarasa Kila Mwaka (Auto-Promotion)' : 'Annual Academic Year Class Promotion'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isSw ? `Kuhama kutoka ${currentAcademicYear} kwenda ${nextYearNumber}` : `Transitioning from ${currentAcademicYear} to ${nextYearNumber}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPromotionModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isSw ? 'Jinsi Uhawilishaji Huu Unavyofanya Kazi Kiotomatiki:' : 'How Annual Progression Works:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {isSw
                    ? 'Wanafunzi wote na wazazi wao watahama madarasa kwenda darasa linalofuata mara moja:'
                    : 'All students and their linked parents will advance by exactly one grade level:'}
                </p>
              </div>

              {/* Class progression timeline display */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 max-h-56 overflow-y-auto font-mono text-[11px]">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 font-sans font-bold">
                  <span>{isSw ? 'Darasa la Sasa (2026)' : 'Current Class'}</span>
                  <span>➔</span>
                  <span>{isSw ? 'Darasa Jipya (2027)' : 'Promoted Class'}</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Baby Class</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Middle Class</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Middle Class</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Pre-Unit (Awali)</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Pre-Unit (Awali)</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Standard I</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Standard I</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Standard II</span>
                </div>
                <div className="flex items-center justify-between text-white font-bold bg-amber-500/10 p-1 rounded">
                  <span>Standard II</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300">Standard III</span>
                </div>
                <div className="flex items-center justify-between text-white font-bold bg-amber-500/10 p-1 rounded">
                  <span>Standard III</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300">Standard IV (NECTA SFNA)</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Standard IV</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Standard V</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Standard V</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Standard VI</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Standard VI</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-teal-400">Standard VII (PSLE)</span>
                </div>
                <div className="flex items-center justify-between text-white">
                  <span>Standard VII</span>
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span className="text-purple-400 font-bold">Wahitimu / Alumni (Graduated)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-[11px] text-teal-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span>
                  {isSw
                    ? 'Uhusiano wa wazazi wenye watoto wengi kwenye madarasa tofauti utabaki salama na kuendelea kulandana moja kwa moja.'
                    : 'Multi-child parent links remain preserved across all promoted grades.'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowPromotionModal(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                {isSw ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="button"
                id="execute-annual-promotion-btn"
                onClick={() => {
                  onPromoteAcademicYear();
                  setShowPromotionModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  {isSw
                    ? `Tekeleza Uhawilishaji: Hamia Mwaka ${nextYearNumber} Sasa`
                    : `Execute Promotion: Advance to ${nextYearNumber}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
