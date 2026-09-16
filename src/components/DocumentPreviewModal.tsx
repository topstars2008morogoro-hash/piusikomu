import React, { useState } from 'react';
import { AcademicDocument, Language, UserRole } from '../types';
import { SchoolLogo } from './SchoolLogo';
import {
  X,
  FileText,
  Download,
  CheckCircle,
  AlertTriangle,
  Clock,
  Send,
  User,
  BookOpen,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: AcademicDocument;
  language: Language;
  currentRole: UserRole;
  onClose: () => void;
  onApprove?: (feedback: string) => void;
  onRequestRevision?: (feedback: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  language,
  currentRole,
  onClose,
  onApprove,
  onRequestRevision,
}) => {
  const isSw = language === 'sw';
  const [adminFeedbackInput, setAdminFeedbackInput] = useState(document.admin_feedback || '');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                {document.title}
              </h3>
              <p className="text-[10px] text-slate-400">
                {document.file_name} • {document.file_size}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-200">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">{isSw ? 'Darasa:' : 'Class:'}</span>
              <span className="font-bold text-white">{document.class_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{isSw ? 'Somo:' : 'Subject:'}</span>
              <span className="font-bold text-white">{document.subject_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{isSw ? 'Kutoka:' : 'From:'}</span>
              <span className="font-bold text-amber-300">{document.sender_name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">{isSw ? 'Hali:' : 'Status:'}</span>
              <span
                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  document.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : document.status === 'revision_requested'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {document.status === 'approved'
                  ? isSw ? '✓ Imeidhinishwa' : 'Approved'
                  : document.status === 'revision_requested'
                  ? isSw ? '⚠️ Inahitaji Marudio' : 'Needs Revision'
                  : document.status === 'under_review'
                  ? isSw ? '⏳ Inakaguliwa' : 'Under Review'
                  : isSw ? 'Inasubiri' : 'Submitted'}
              </span>
            </div>
          </div>

          {/* Simulated Exam / Document Paper Sheet */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 sm:p-6 shadow-inner space-y-3 font-sans">
            {/* Header of official exam / document */}
            <div className="text-center border-b border-slate-800 pb-3">
              <div className="flex justify-center mb-1">
                <SchoolLogo size="sm" />
              </div>
              <h4 className="text-sm sm:text-base font-extrabold uppercase text-white tracking-wider">
                Top Stars Nursery & Primary School
              </h4>
              <p className="text-[10px] text-amber-400 font-medium">
                P.O. BOX 2008, MOROGORO, TANZANIA • QUALITY EDUCATION, ETHICS AND VALUES
              </p>
              <div className="mt-2 text-xs font-bold text-slate-200 uppercase tracking-wide">
                {document.title}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {document.term} • {isSw ? 'Muda: Saa 2:00' : 'Time: 2:00 Hours'}
              </p>
            </div>

            {/* Description / Instruction */}
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                {isSw ? 'Maelekezo na Muhtasari wa Hati:' : 'Document Overview & Instructions:'}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">{document.description}</p>
            </div>

            {/* Sample Exam Questions Preview */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase">
                <span>{isSw ? 'Sampuli ya Maswali (NECTA Format):' : 'Sample Questions Content:'}</span>
                <span className="text-amber-400">Total Marks: 50</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-900/40 border border-slate-800">
                  <span className="font-bold text-slate-200">1. (a) </span>
                  <span className="text-slate-300">
                    {document.subject_name.includes('Hisabati') || document.subject_name.includes('Math')
                      ? 'Tafuta thamani ya x iwapo 3x + 15 = 45.'
                      : document.subject_name.includes('Sayansi')
                      ? 'Taja njia tatu kuu za kuzuia mmomonyoko wa ardhi kwenye mashamba ya mlimani.'
                      : 'Eleza kwa ufupi maana ya uzalendo katika jamii ya Kitanzania.'}
                  </span>
                  <span className="float-right text-[10px] text-slate-500 font-mono">(Alama 03)</span>
                </div>

                <div className="p-2 rounded bg-slate-900/40 border border-slate-800">
                  <span className="font-bold text-slate-200">1. (b) </span>
                  <span className="text-slate-300">
                    {document.subject_name.includes('Hisabati') || document.subject_name.includes('Math')
                      ? 'Duka la shule lilinunua madaftari 120 kwa shilingi 60,000. Je, daftari moja liliuzwa kwa faida ya asilimia ngapi ikiwa bei ya kuuza ilikuwa shilingi 750?'
                      : 'Chora na uweke lebo sehemu kuu nne za ua la mmea wa jamii ya mikunde.'}
                  </span>
                  <span className="float-right text-[10px] text-slate-500 font-mono">(Alama 05)</span>
                </div>
              </div>
            </div>

            {/* Admin Feedback Display if present */}
            {document.admin_feedback && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 mt-3">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-0.5">
                  {isSw ? 'Maoni ya Mkuu wa Shule (Admin Moderation Feedback):' : 'Headteacher Moderation Feedback:'}
                </span>
                <p className="text-xs text-amber-200 italic">{document.admin_feedback}</p>
                {document.reviewed_at && (
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {isSw ? 'Tarehe ya Uhakiki:' : 'Reviewed on:'} {document.reviewed_at}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Admin Moderation Controls (Only visible if Admin is reviewing a teacher-submitted exam) */}
          {currentRole === 'admin' && document.sender_role === 'teacher' && onApprove && onRequestRevision && (
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>{isSw ? 'Uamuzi wa Mkuu wa Shule (Admin Moderation):' : 'Admin Approval & Moderation Action:'}</span>
              </h5>
              <textarea
                value={adminFeedbackInput}
                onChange={(e) => setAdminFeedbackInput(e.target.value)}
                placeholder={
                  isSw
                    ? 'Andika maoni ya kitaaluma kwa mwalimu (mfano: Mtihani unakidhi vigezo, au rekebisha swali namba 4)...'
                    : 'Provide moderation comments or instructions for the teacher...'
                }
                rows={2}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onApprove(adminFeedbackInput || (isSw ? '✅ Mtihani umeidhinishwa kwa ajili ya uchapaji na usambazaji.' : '✅ Approved for printing and examination.'))}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{isSw ? 'Idhinisha Mtihani (Approve)' : 'Approve Exam Paper'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => onRequestRevision(adminFeedbackInput || (isSw ? '⚠️ Tafadhali rekebisha muundo wa maswali na urudie kuwasilisha.' : '⚠️ Please revise question layout.'))}
                  className="py-2 px-3 bg-rose-600/80 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isSw ? 'Omba Marudio (Revision)' : 'Request Revision'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleDownload}
            className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {downloadSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{isSw ? 'Imepakuliwa!' : 'Downloaded!'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSw ? 'Pakua Hati (Download)' : 'Download Document'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            {isSw ? 'Funga' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
