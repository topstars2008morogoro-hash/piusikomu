import React, { useState } from 'react';
import { ExamTimetable, Language } from '../types';
import {
  Calendar,
  Clock,
  Users,
  GraduationCap,
  Smartphone,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Printer,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface ExamTimetableCardProps {
  timetable: ExamTimetable;
  language: Language;
  viewerRole?: 'admin' | 'teacher' | 'parent';
  onResendSms?: (tt: ExamTimetable) => void;
}

export const ExamTimetableCard: React.FC<ExamTimetableCardProps> = ({
  timetable,
  language,
  viewerRole = 'admin',
  onResendSms,
}) => {
  const isSw = language === 'sw';
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const getAudienceBadge = () => {
    switch (timetable.target_audience) {
      case 'teachers_only':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{isSw ? 'Walimu Peke Yao' : 'Teachers Only'}</span>
          </span>
        );
      case 'parents_only':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isSw ? 'Wazazi Peke Yao (SMS)' : 'Parents Only (SMS)'}</span>
          </span>
        );
      case 'both':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSw ? 'Wote: Wazazi & Walimu' : 'Both: Parents & Teachers'}</span>
          </span>
        );
    }
  };

  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg transition-all hover:border-slate-600">
      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {getAudienceBadge()}
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
              {timetable.term}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
              {timetable.target_classes.includes('all')
                ? isSw
                  ? 'Madarasa Yote'
                  : 'All Classes'
                : timetable.target_classes.join(', ')}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{timetable.title}</span>
          </h3>
          <div className="text-[11px] text-slate-400 flex flex-wrap items-center gap-2">
            <span>📅 {timetable.start_date} hadi {timetable.end_date}</span>
            <span>•</span>
            <span>Iliandikwa na {timetable.dispatched_by}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {viewerRole === 'admin' && onResendSms && timetable.target_audience !== 'teachers_only' && (
            <button
              onClick={() => onResendSms(timetable)}
              className="px-2.5 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/40 text-emerald-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              title={isSw ? 'Tuma SMS tena kwa Wazazi' : 'Resend SMS to Parents'}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{isSw ? 'Tuma SMS Tena' : 'Resend SMS'}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors text-xs"
            title={isSw ? 'Shiriki / Chapisha' : 'Share / Print'}
          >
            {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Printer className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Timetable Schedule Grid */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 space-y-3">
          {/* Dispatch Metrics (Admin View) */}
          {viewerRole === 'admin' && timetable.stats && (
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div className="border-r border-slate-800 pr-2">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Walimu Waliopewa Ratiba' : 'Teachers Notified'}</span>
                <span className="font-bold text-blue-400">
                  {timetable.stats.teachers_notified} {isSw ? 'Walimu' : 'Staff'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Wazazi Waliopewa SMS' : 'Parents Notified via SMS'}</span>
                <span className="font-bold text-emerald-400">
                  {timetable.stats.parents_notified_sms} {isSw ? 'Wazazi (Delivered)' : 'Parents'}
                </span>
              </div>
            </div>
          )}

          {/* Schedule Table / List */}
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">{isSw ? 'Siku & Tarehe' : 'Day & Date'}</th>
                  <th className="py-2.5 px-3">{isSw ? 'Muda' : 'Time'}</th>
                  <th className="py-2.5 px-3">{isSw ? 'Somo la Mtihani' : 'Subject'}</th>
                  <th className="py-2.5 px-3">{isSw ? 'Msimamizi / Chumba' : 'Supervisor & Room'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                {timetable.slots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200 whitespace-nowrap">
                      {isSw ? slot.day_label_sw : slot.day_label_en}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-amber-400 whitespace-nowrap">
                      {slot.time_slot}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">{slot.subject_name}</div>
                      {slot.special_requirements && (
                        <div className="text-[10px] text-slate-400">{slot.special_requirements}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      <div>{slot.supervisor_name || 'Mwalimu wa Somo'}</div>
                      <div className="text-[10px] text-slate-500">{slot.room_or_hall || 'Madarasani'}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Instructions Box */}
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs">
            <span className="font-bold text-amber-300 block mb-1">
              📌 {isSw ? 'Miongozo & Maagizo ya Mitihani:' : 'Exam Guidelines & Instructions:'}
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {isSw ? timetable.instructions_sw : timetable.instructions_en}
            </p>
          </div>

          {/* SMS Snapshot if sent to parents */}
          {timetable.sms_message_preview && (
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
              <span className="text-slate-400 block font-semibold mb-0.5">
                💬 {isSw ? 'Nakala ya SMS iliyotumwa kwa simu za wazazi:' : 'SMS Dispatched to Parents:'}
              </span>
              <p className="text-emerald-300 font-mono italic">
                "{timetable.sms_message_preview}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
