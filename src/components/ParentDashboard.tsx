import React, { useState } from 'react';
import { STUDENTS, INITIAL_EXAM_RESULTS, INITIAL_FEES, SCHOOL_NOTICES, SCHOOL_INFO, INITIAL_RESULT_COMMENTS } from '../data/mockData';
import { Language, Student, FeePayment, LinkedParent, DirectParentMessage, ExamTimetable, ExamResult, ResultTeacherComment } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { ExamTimetableCard } from './ExamTimetableCard';
import { ParentTeacherCommentModal } from './ParentTeacherCommentModal';
import { PrintReportCardModal } from './PrintReportCardModal';
import {
  UserCheck,
  Award,
  Receipt,
  Bell,
  Shield,
  Download,
  FileText,
  CheckCircle2,
  ChevronRight,
  Phone,
  MessageSquare,
  AlertCircle,
  Palette,
  Send,
  Sparkles,
  Clock,
  UserCheck2,
  Printer,
  MessageSquarePlus,
  MessageCircle,
  Reply,
  User,
  ExternalLink,
} from 'lucide-react';

interface ParentDashboardProps {
  language: Language;
  linkedParents?: LinkedParent[];
  directMessages?: DirectParentMessage[];
  onOpenRegisterModal?: () => void;
  onOpenThemeModal?: () => void;
  onMarkMessageAsRead?: (msgId: string) => void;
  onReplyToAdmin?: (replyText: string, parentName: string, studentName: string) => void;
  currentParentPhone?: string;
  examTimetables?: ExamTimetable[];
  examResults?: ExamResult[];
  resultComments?: ResultTeacherComment[];
  onAddResultComment?: (comment: ResultTeacherComment) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  language,
  linkedParents = [],
  directMessages = [],
  onOpenRegisterModal,
  onOpenThemeModal,
  onMarkMessageAsRead,
  onReplyToAdmin,
  currentParentPhone = '+255 754 998 877',
  examTimetables = [],
  examResults = INITIAL_EXAM_RESULTS,
  resultComments = INITIAL_RESULT_COMMENTS,
  onAddResultComment,
}) => {
  const isSw = language === 'sw';

  // Active student state (defaults to Baraka Juma, can switch if linked)
  const [selectedStudentId, setSelectedStudentId] = useState<string>(STUDENTS[0].id);
  const activeStudent = STUDENTS.find((s) => s.id === selectedStudentId) || STUDENTS[0];

  // Results filtered for this student
  const studentResults = examResults.filter((r) => r.student_id === activeStudent.id);
  const studentFees = INITIAL_FEES.filter((f) => f.student_id === activeStudent.id);

  // Selected Exam for report viewing
  const [selectedExamName, setSelectedExamName] = useState<string>('Mid-Term Examination 2026');

  // Modals for commenting and printing
  const [isCommentModalOpen, setIsCommentModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [commentTargetSubject, setCommentTargetSubject] = useState<string>('Ripoti Kamili ya Matokeo (General Performance)');
  const [commentTargetTeacherId, setCommentTargetTeacherId] = useState<string>('stf-03');

  // Comments specifically for this student and family
  const studentComments = resultComments.filter(
    (c) => c.student_id === activeStudent.id || c.parent_phone.includes('754 998 877')
  );

  // Sub-tabs for Parent
  const [activeParentTab, setActiveParentTab] = useState<
    'progress' | 'attendance' | 'fees' | 'direct-sms' | 'notices'
  >('progress');
  const [noticeSubTab, setNoticeSubTab] = useState<'timetables' | 'announcements'>('timetables');

  // Find linked status for this parent
  const myLinkedProfile =
    linkedParents.find(
      (p) =>
        p.student_name.toLowerCase().includes(activeStudent.first_name.toLowerCase()) ||
        p.phone_number.includes(currentParentPhone.replace(/\s+/g, '').slice(-9))
    ) || linkedParents[0];

  // Messages directed to this parent
  const parentMessages = directMessages.filter(
    (m) =>
      m.recipient_phone.replace(/\s+/g, '').slice(-9) ===
        (myLinkedProfile?.phone_number || currentParentPhone).replace(/\s+/g, '').slice(-9) ||
      m.recipient_name.toLowerCase().includes('juma') ||
      m.sender_role === 'parent'
  );

  const unreadCount = parentMessages.filter(
    (m) => m.sender_role === 'admin' && !m.is_read_by_parent
  ).length;

  // Quick reply state
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [replySentSuccess, setReplySentSuccess] = useState(false);

  // Control number modal state
  const [showPayModal, setShowPayModal] = useState(false);
  const [copiedControl, setCopiedControl] = useState(false);

  // Calculate Average & Overall Grade
  const totalMarks = studentResults.reduce((acc, r) => acc + r.marks, 0);
  const averageMark = studentResults.length ? Math.round(totalMarks / studentResults.length) : 0;
  const overallGrade = averageMark >= 81 ? 'A' : averageMark >= 61 ? 'B' : averageMark >= 41 ? 'C' : 'D';

  const handleCopyControlNumber = () => {
    navigator.clipboard.writeText('991200845001');
    setCopiedControl(true);
    setTimeout(() => setCopiedControl(false), 2500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setReplySending(true);
    setTimeout(() => {
      setReplySending(false);
      if (onReplyToAdmin) {
        onReplyToAdmin(
          replyText.trim(),
          myLinkedProfile?.parent_name || 'Mzee Juma Mohamed',
          activeStudent.first_name + ' ' + activeStudent.last_name
        );
      }
      setReplyText('');
      setReplySentSuccess(true);
      setTimeout(() => setReplySentSuccess(false), 3000);
    }, 450);
  };

  return (
    <div className="space-y-4 text-slate-100 pb-16">
      {/* Direct Phone Link Verification Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>{isSw ? 'Namba Yako ya Simu Imeunganishwa na Utawala' : 'Phone Linked to Headteacher System'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{myLinkedProfile ? myLinkedProfile.phone_number : currentParentPhone}</span>
                <span>({myLinkedProfile?.carrier || 'Vodacom'})</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              {isSw
                ? 'Mkuu wa Shule anaweza kukutumia meseji za kawaida, risiti za ada, na taarifa za mtoto moja kwa moja.'
                : 'Direct SMS connection active. Messages from admin reach your phone instantly.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onOpenRegisterModal && (
            <button
              id="parent-update-phone-btn"
              onClick={onOpenRegisterModal}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
            >
              <UserCheck2 className="w-3.5 h-3.5" />
              <span>{isSw ? 'Sajili / Badili Namba' : 'Update Phone'}</span>
            </button>
          )}

          {onOpenThemeModal && (
            <button
              id="parent-theme-btn"
              onClick={onOpenThemeModal}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
              title={isSw ? 'Badili Mwonekano & Ukubwa wa Maandishi' : 'Theme & Text Size'}
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSw ? 'Mwonekano' : 'Theme'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Parent & Child Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-lg">
              BJ
            </div>
            <div>
              <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                {isSw ? 'Mwanafunzi Wako' : 'Enrolled Pupil'}
              </span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>{activeStudent.first_name} {activeStudent.last_name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeStudent.class_name}
                </span>
              </h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <span>{isSw ? 'Udahili:' : 'Admission:'} <strong className="text-amber-400 font-mono">{activeStudent.admission_number}</strong></span>
                <span>•</span>
                <span>{activeStudent.residence_area}</span>
              </p>
            </div>
          </div>

          <button
            id="parent-quick-pay-btn"
            onClick={() => setShowPayModal(true)}
            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>{isSw ? 'Lipa Ada / Control No' : 'Pay Fees (Control No)'}</span>
          </button>
        </div>
      </div>

      {/* Parent Sub-Navigation (5 Tabs including Direct SMS from Admin) */}
      <div className="grid grid-cols-5 gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
        <button
          id="parent-tab-progress"
          onClick={() => setActiveParentTab('progress')}
          className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeParentTab === 'progress' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-xs truncate">{isSw ? 'Matokeo' : 'Results'}</span>
        </button>
        <button
          id="parent-tab-attendance"
          onClick={() => setActiveParentTab('attendance')}
          className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeParentTab === 'attendance' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-xs truncate">{isSw ? 'Mahudhurio' : 'Attendance'}</span>
        </button>
        <button
          id="parent-tab-fees"
          onClick={() => setActiveParentTab('fees')}
          className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeParentTab === 'fees' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-xs truncate">{isSw ? 'Kadi ya Ada' : 'Fees Ledger'}</span>
        </button>
        <button
          id="parent-tab-direct-sms"
          onClick={() => setActiveParentTab('direct-sms')}
          className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors relative ${
            activeParentTab === 'direct-sms' ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-xs truncate">{isSw ? 'Meseji za Admin' : 'Admin SMS'}</span>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          id="parent-tab-notices"
          onClick={() => setActiveParentTab('notices')}
          className={`py-2 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors ${
            activeParentTab === 'notices' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="text-[10px] sm:text-xs truncate">{isSw ? 'Matangazo' : 'Notices'}</span>
        </button>
      </div>

      {/* TAB: DIRECT SMS FROM ADMIN */}
      {activeParentTab === 'direct-sms' && (
        <div className="space-y-3">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{isSw ? 'Meseji za Moja kwa Moja Kutoka kwa Mkuu wa Shule' : 'Direct Messages from Headteacher & School Admin'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isSw
                      ? `Zinatumwa kwenye simu yako (${myLinkedProfile?.phone_number || currentParentPhone}) na kuhifadhiwa hapa`
                      : `Synced with parent phone number and preserved in portal`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {parentMessages.length} {isSw ? 'Meseji' : 'Messages'}
                </span>
              </div>
            </div>

            {/* Message Thread List */}
            {parentMessages.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">
                  {isSw ? 'Bado hakuna meseji mpya kutoka kwa Admin.' : 'No direct messages yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                {parentMessages.map((msg) => {
                  const isAdmin = msg.sender_role === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isAdmin
                          ? 'bg-slate-900/90 border-slate-700/80 text-left'
                          : 'bg-emerald-950/40 border-emerald-500/30 ml-4 sm:ml-8 text-left'
                      }`}
                    >
                      {/* Sender details and time */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white flex items-center gap-1">
                            <span>{isAdmin ? '👑' : '👨‍👧'}</span>
                            <span>{msg.sender_name}</span>
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                              isAdmin
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isAdmin ? 'Mkuu wa Shule' : 'Wewe (Mzazi)'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            <span>{msg.timestamp}</span>
                          </span>
                          <span className="text-emerald-400 font-medium">✓✓ SMS</span>
                        </div>
                      </div>

                      {/* Message Content */}
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {msg.message}
                      </p>

                      {/* Acknowledge Button if from Admin */}
                      {isAdmin && (
                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="text-[10px] text-slate-400">
                            {isSw ? 'Njia: SMS ya Kawaida & Mtandao' : 'Channel: Direct SMS Carrier'}
                          </span>
                          {onMarkMessageAsRead && (
                            <button
                              onClick={() => onMarkMessageAsRead(msg.id)}
                              className={`px-2.5 py-1 rounded text-[10px] font-semibold flex items-center gap-1 transition-colors ${
                                msg.status === 'acknowledged' || msg.is_read_by_parent
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>
                                {msg.status === 'acknowledged' || msg.is_read_by_parent
                                  ? isSw ? 'Imethibitishwa' : 'Acknowledged'
                                  : isSw ? 'Thibitisha Kupokea' : 'Acknowledge Receipt'}
                              </span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Quick Reply Composer to Headteacher */}
            <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-700/80 space-y-2">
              <label className="block text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isSw ? 'Jibu au Tuma Ujumbe kwa Mkuu wa Shule:' : 'Reply or Send Message to Headteacher:'}</span>
              </label>

              {replySentSuccess && (
                <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isSw
                      ? '✓ Jibu lako limetumwa kwa Mkuu wa Shule na Ofisi ya Utawala!'
                      : '✓ Reply sent to Headteacher and Admin office!'}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={
                    isSw
                      ? 'Andika jibu hapa (mf. Asante Mkuu wa Shule, tumepokea taarifa)...'
                      : 'Type a reply to the Headteacher...'
                  }
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-sans"
                />
                <button
                  type="submit"
                  disabled={replySending || !replyText.trim()}
                  className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow-md transition-transform active:scale-95 disabled:opacity-50 flex-shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{replySending ? '...' : isSw ? 'Jibu' : 'Reply'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* TAB 1: PROGRESS & NECTA REPORT CARD */}
      {activeParentTab === 'progress' && (
        <div className="space-y-4">
          {/* Header Controls & Actions */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <SchoolLogo size="sm" />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{isSw ? 'Ripoti ya Matokeo ya Mitihani (NECTA Scale)' : 'Exam Results & Progress Report Card'}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {SCHOOL_INFO.current_term} • {activeStudent.first_name} {activeStudent.last_name} ({activeStudent.class_name})
                </p>
              </div>
            </div>

            {/* Actions: Print and Comment to Teacher */}
            <div className="flex items-center flex-wrap gap-2">
              <button
                id="btn-print-report-card"
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSw ? 'Chapisha / Hifadhi Ripoti' : 'Print / Save PDF'}</span>
              </button>

              <button
                id="btn-comment-to-teacher-top"
                onClick={() => {
                  setCommentTargetSubject('Ripoti Kamili ya Matokeo (General Performance)');
                  setCommentTargetTeacherId('stf-03');
                  setIsCommentModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{isSw ? 'Toa Maoni kwa Mwalimu' : 'Comment to Teacher'}</span>
              </button>
            </div>
          </div>

          {/* Report Summary Card */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700 pb-3 mb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">{isSw ? 'Chagua Mtihani:' : 'Select Exam:'}</span>
                <select
                  value={selectedExamName}
                  onChange={(e) => setSelectedExamName(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                >
                  <option value="Mid-Term Examination 2026">Mid-Term Examination 2026 (Muhula wa 1)</option>
                  <option value="Monthly Test February 2026">Monthly Test February 2026</option>
                  <option value="Annual Examination 2025">Annual Examination 2025 (Mwaka Jana)</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{isSw ? 'Nafasi Darasani' : 'Class Position'}</span>
                  <span className="text-sm font-black text-amber-400">2 / 45</span>
                </div>
                <div className="text-right pl-3 border-l border-slate-700">
                  <span className="text-[10px] text-slate-400 block">{isSw ? 'Wastani' : 'Average'}</span>
                  <span className="text-sm font-black text-emerald-400">{averageMark}%</span>
                </div>
              </div>
            </div>

            {/* Quick KPI Bar */}
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Jumla ya Alama' : 'Total Score'}</span>
                <span className="text-base font-bold text-white">{totalMarks} / {studentResults.length * 100}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Wastani (Average)' : 'Average'}</span>
                <span className="text-base font-bold text-emerald-400">{averageMark}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Daraja la Jumla' : 'Overall Grade'}</span>
                <span className="text-base font-bold text-amber-400">{overallGrade} ({overallGrade === 'A' ? 'Bora Sana' : 'Vizuri'})</span>
              </div>
            </div>

            {/* Subject-Wise Table with Direct Comment Trigger */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-medium">
                    <th className="pb-2">{isSw ? 'Somo' : 'Subject'}</th>
                    <th className="pb-2 text-center">{isSw ? 'Alama' : 'Marks'}</th>
                    <th className="pb-2 text-center">{isSw ? 'Daraja' : 'Grade'}</th>
                    <th className="pb-2">{isSw ? 'Maoni ya Mwalimu' : 'Teacher Remark'}</th>
                    <th className="pb-2 text-right">{isSw ? 'Ushirikiano' : 'Direct Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {studentResults.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-700/20">
                      <td className="py-2.5 font-semibold text-white">{res.subject_name}</td>
                      <td className="py-2.5 text-center font-bold text-slate-200">{res.marks}%</td>
                      <td className="py-2.5 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-black ${
                            res.grade === 'A'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : res.grade === 'B'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {res.grade}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300 text-[11px]">
                        {isSw ? res.remarks_sw : res.remarks_en}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setCommentTargetSubject(`${res.subject_name}`);
                            // assign teacher based on subject
                            if (res.subject_name.toLowerCase().includes('hisabati') || res.subject_name.toLowerCase().includes('sayansi')) {
                              setCommentTargetTeacherId('stf-02');
                            } else {
                              setCommentTargetTeacherId('stf-03');
                            }
                            setIsCommentModalOpen(true);
                          }}
                          className="px-2 py-1 rounded bg-slate-900 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-slate-300 hover:text-amber-300 text-[10px] font-semibold inline-flex items-center gap-1 transition-colors"
                          title={isSw ? 'Wasiliana na mwalimu wa somo hili' : 'Comment on this subject'}
                        >
                          <MessageSquare className="w-3 h-3 text-amber-400" />
                          <span>{isSw ? 'Maoni' : 'Inquire'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* School Stamp & Remarks Footer */}
            <div className="mt-4 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <div>
                <strong>{isSw ? 'Maoni ya Mkuu wa Shule:' : 'Headteacher Remark:'}</strong>{' '}
                <span className="text-slate-200">
                  {isSw
                    ? 'Baraka anaendelea vizuri sana. Aendelee kudumisha nidhamu na juhudi hizi katika SFNA.'
                    : 'Baraka is performing exceptionally well. Keep up this commendable discipline.'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] flex-shrink-0">
                <Shield className="w-3.5 h-3.5" />
                <span>{isSw ? 'Imethibitishwa Kidijitali' : 'Digitally Certified'}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION: DIRECT PARENT-TO-TEACHER COMMENTS & INQUIRIES ON EXAM RESULTS */}
          {/* ========================================================================= */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{isSw ? 'Mawasiliano na Maoni kwa Walimu Kuhusu Matokeo' : 'Direct Comments & Feedback with Teachers'}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                      {studentComments.length}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isSw
                      ? 'Tuma maoni, maswali, au maelekezo moja kwa moja kwa mwalimu wa somo au mwalimu wa darasa.'
                      : 'Send direct comments, questions, or guidance to subject and class teachers.'}
                  </p>
                </div>
              </div>

              <button
                id="btn-comment-to-teacher-section"
                onClick={() => {
                  setCommentTargetSubject('Ripoti Kamili ya Matokeo (General Performance)');
                  setCommentTargetTeacherId('stf-03');
                  setIsCommentModalOpen(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>{isSw ? 'Andika Maoni Mapya kwa Mwalimu' : 'Send New Comment to Teacher'}</span>
              </button>
            </div>

            {/* Comments Stream */}
            {studentComments.length === 0 ? (
              <div className="p-6 text-center bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">
                  {isSw ? 'Bado hujatuma maoni yoyote kwa walimu kuhusu mtihani huu.' : 'No direct comments sent to teachers yet.'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {isSw
                    ? 'Bofya kitufe cha "Toa Maoni kwa Mwalimu" hapo juu kuuliza swali au kutoa ushauri.'
                    : 'Click "Send New Comment to Teacher" to initiate an inquiry or advice.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-3 sm:p-3.5 space-y-2.5 shadow-md"
                  >
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-300">{comment.subject_name}</span>
                        <span className="text-[10px] text-slate-500">•</span>
                        <span className="text-slate-400 text-[11px]">{comment.exam_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{comment.created_at}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            comment.status === 'replied'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          {comment.status === 'replied'
                            ? isSw ? '✓ Mwalimu Amejibu' : '✓ Replied by Teacher'
                            : isSw ? '⏳ Inasubiri Jibu la Mwalimu' : '⏳ Pending Teacher Reply'}
                        </span>
                      </div>
                    </div>

                    {/* Teacher Targeted */}
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1 rounded-lg border border-slate-800">
                      <User className="w-3 h-3 text-blue-400" />
                      <span>{isSw ? 'Mwalimu Aliyetumiwa:' : 'Addressed to Teacher:'}</span>
                      <strong className="text-slate-200">{comment.teacher_name}</strong>
                      {comment.teacher_role_title && (
                        <span className="text-slate-500 font-normal">({comment.teacher_role_title})</span>
                      )}
                    </div>

                    {/* Parent's Original Comment */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                      <span className="text-[10px] font-bold text-amber-400 block mb-0.5">
                        {isSw ? 'Maoni Yako (Mzazi):' : 'Your Comment (Parent):'}
                      </span>
                      {comment.comment_text}
                    </div>

                    {/* Teacher's Direct Reply (if replied) */}
                    {comment.reply_text ? (
                      <div className="ml-2 sm:ml-4 p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1 animate-in fade-in">
                        <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                          <span className="flex items-center gap-1">
                            <Reply className="w-3.5 h-3.5 text-emerald-400 rotate-180" />
                            <span>{isSw ? 'Jibu Rasmi la Mwalimu:' : 'Official Teacher Reply:'} {comment.teacher_name}</span>
                          </span>
                          {comment.reply_at && (
                            <span className="text-[10px] font-normal text-emerald-400/80">{comment.reply_at}</span>
                          )}
                        </div>
                        <p className="text-slate-200 text-xs leading-relaxed italic">
                          &quot;{comment.reply_text}&quot;
                        </p>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-400 italic flex items-center gap-1.5 pt-0.5">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>
                          {isSw
                            ? 'Mwalimu anapitia maoni haya na atakujibu moja kwa moja hapa.'
                            : 'The teacher is reviewing your inquiry and will reply directly here.'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE HISTORY */}
      {activeParentTab === 'attendance' && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 space-y-3">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>{isSw ? 'Historia ya Mahudhurio ya Mtoto' : 'Attendance Log & Verification'}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isSw ? 'Ufuatiliaji wa siku zote alizofika shuleni muhula huu' : 'Daily school presence record for this term'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
              <div className="text-[10px] text-slate-400">{isSw ? 'Siku za Shule' : 'School Days'}</div>
              <div className="text-base font-bold text-white">48</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
              <div className="text-[10px] text-slate-400">{isSw ? 'Alizohudhuria' : 'Days Present'}</div>
              <div className="text-base font-bold text-emerald-400">47</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60">
              <div className="text-[10px] text-slate-400">{isSw ? 'Asilimia' : 'Rate'}</div>
              <div className="text-base font-bold text-amber-400">98%</div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">15 Sep 2026 (Leo / Today)</div>
                <div className="text-[10px] text-slate-400">07:45 AM • Basi la Shule (Kihonda Route)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {isSw ? 'Yupo Shuleni' : 'Present'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">14 Sep 2026</div>
                <div className="text-[10px] text-slate-400">07:40 AM • Kuingia getini</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {isSw ? 'Yupo Shuleni' : 'Present'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">11 Sep 2026</div>
                <div className="text-[10px] text-slate-400">07:50 AM • Kuingia getini</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {isSw ? 'Yupo Shuleni' : 'Present'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEES LEDGER & DIGITAL RECEIPTS */}
      {activeParentTab === 'fees' && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700 pb-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>{isSw ? 'Kadi ya Malipo ya Ada & Risiti' : 'School Fees Ledger & Receipts'}</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSw ? 'Malipo yote hufanyika kupitia Namba ya Udhibiti ya Shule' : 'All payments routed via school control number'}
              </p>
            </div>
            <button
              onClick={() => setShowPayModal(true)}
              className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-amber-400"
            >
              {isSw ? 'Namba ya Udhibiti' : 'Control No.'}
            </button>
          </div>

          {/* Fee Balance Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-3 rounded-xl border border-slate-700/80">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">{isSw ? 'Hali ya Ada (Muhula wa 1, 2026)' : 'Term 1, 2026 Status'}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                {isSw ? 'Imelipwa Kamili' : 'Fully Cleared'}
              </span>
            </div>
            <div className="text-xl font-black text-emerald-400">TZS 630,000</div>
            <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
              <span>{isSw ? 'Deni Lililobaki: TZS 0' : 'Outstanding Balance: TZS 0'}</span>
              <span>{isSw ? 'Ada ya Masomo + Usafiri wa Basi' : 'Tuition + School Bus'}</span>
            </div>
          </div>

          {/* Receipts List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              {isSw ? 'Risiti Zilizothibitishwa' : 'Official Receipts'}
            </span>
            {studentFees.map((fee) => (
              <div
                key={fee.id}
                className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{fee.fee_type} Fee</div>
                  <div className="text-[10px] text-slate-400">
                    {fee.payment_date} • {fee.payment_method} • Ref: {fee.reference_number}
                  </div>
                  <div className="text-[10px] font-mono text-amber-400">{fee.receipt_number}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">
                    TZS {fee.amount_paid_tzs.toLocaleString()}
                  </div>
                  <button
                    onClick={() => alert(isSw ? `Risiti ${fee.receipt_number} inapakuliwa kama PDF...` : `Downloading receipt ${fee.receipt_number} as PDF...`)}
                    className="mt-1 text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>PDF</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: NOTICES & EXAM TIMETABLES FROM SCHOOL */}
      {activeParentTab === 'notices' && (
        <div className="space-y-3">
          {/* Subtab Switcher: Ratiba za Mitihani vs Matangazo ya Shule */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              id="parent-subtab-timetables"
              onClick={() => setNoticeSubTab('timetables')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                noticeSubTab === 'timetables'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSw ? 'Ratiba za Mitihani' : 'Exam Timetables'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px] text-amber-300 font-bold">
                {examTimetables.filter((t) => t.target_audience === 'parents_only' || t.target_audience === 'both').length}
              </span>
            </button>

            <button
              id="parent-subtab-announcements"
              onClick={() => setNoticeSubTab('announcements')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                noticeSubTab === 'announcements'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isSw ? 'Matangazo ya Shule' : 'School Notices'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px] text-white font-bold">
                {SCHOOL_NOTICES.length}
              </span>
            </button>
          </div>

          {noticeSubTab === 'timetables' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl p-3.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <FileText className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      {isSw ? 'Ratiba Rasmi za Mitihani ya Mwanafunzi' : 'Pupil Exam Timetables'}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {isSw
                        ? 'Ratiba hizi zimetumwa na Mkuu wa Shule kwenda kwa wazazi ili kuandaa watoto vizuri na vifaa vya mitihani.'
                        : 'Official exam schedules dispatched by Headteacher for parental preparation and revision.'}
                    </p>
                  </div>
                </div>
              </div>

              {examTimetables
                .filter((tt) => tt.target_audience === 'parents_only' || tt.target_audience === 'both')
                .map((timetable) => (
                  <ExamTimetableCard
                    key={timetable.id}
                    timetable={timetable}
                    language={language}
                    userRole="parent"
                  />
                ))}

              {examTimetables.filter((tt) => tt.target_audience === 'parents_only' || tt.target_audience === 'both').length === 0 && (
                <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl">
                  <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-semibold">
                    {isSw ? 'Hakuna ratiba ya mtihani iliyotolewa kwa wazazi kwa sasa.' : 'No exam timetables published for parents yet.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {noticeSubTab === 'announcements' && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 space-y-3">
              <div className="border-b border-slate-700 pb-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>{isSw ? 'Taarifa na Matangazo ya Shule' : 'Official School Announcements'}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isSw ? 'Ujumbe kutoka Ofisi ya Mkuu wa Shule na Utawala' : 'Dispatched by Headteacher and Academic Office'}
                </p>
              </div>

              <div className="space-y-2.5">
                {SCHOOL_NOTICES.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-3 rounded-xl border ${
                      notice.urgent
                        ? 'bg-amber-950/20 border-amber-500/40 text-slate-100'
                        : 'bg-slate-900/80 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {notice.urgent && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 font-black text-[9px] uppercase">
                            {isSw ? 'Muhimu' : 'Urgent'}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-white">
                          {isSw ? notice.title_sw : notice.title_en}
                        </h4>
                      </div>
                      <span className="text-[10px] text-slate-400">{notice.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isSw ? notice.message_sw : notice.message_en}
                    </p>
                    <div className="mt-2 text-[10px] text-slate-400 font-medium">
                      {notice.author}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Control Number & Payment Guide Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isSw ? 'Lipa Ada ya Shule (Control Number)' : 'Pay School Fees via Control Number'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Top Stars Nursery & Primary School</p>
                </div>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {isSw ? 'Namba ya Udhibiti ya Malipo (Control Number):' : 'Official Payment Control Number:'}
              </span>
              <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-amber-500/40">
                <span className="font-mono text-base sm:text-lg font-black text-amber-400 tracking-wider">
                  991200845001
                </span>
                <button
                  onClick={handleCopyControlNumber}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded"
                >
                  {copiedControl ? (isSw ? 'Imenakiliwa!' : 'Copied!') : (isSw ? 'Nakili' : 'Copy')}
                </button>
              </div>
              <div className="text-[10px] text-slate-400">
                {isSw
                  ? 'Mwanafunzi: Baraka Juma (Darasa la IV A) • Eneo: Morogoro'
                  : 'Student: Baraka Juma (Std IV A) • Morogoro'}
              </div>
            </div>

            {/* Payment Instructions for Tanzania Telcos & Banks */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-200">
                {isSw ? 'Jinsi ya Kulipa kwa Mtandao Wako:' : 'How to Pay via Mobile Money & Banks:'}
              </h4>
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-1">
                <div className="font-semibold text-rose-400">Vodacom M-Pesa:</div>
                <div className="text-[11px] text-slate-300">
                  {isSw
                    ? '1. Piga *150*00# -> 2. Lipa kwa M-Pesa -> 3. Weka Namba ya Kampuni au Control Number: 991200845001.'
                    : '1. Dial *150*00# -> 2. Pay by M-Pesa -> 3. Enter Control No: 991200845001.'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-1">
                <div className="font-semibold text-amber-400">Airtel Money & Tigo Pesa:</div>
                <div className="text-[11px] text-slate-300">
                  {isSw
                    ? 'Piga *150*60# au *150*01# -> Lipia Bili -> Weka Namba ya Udhibiti: 991200845001.'
                    : 'Dial *150*60# or *150*01# -> Pay Bill -> Enter Control Number.'}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 space-y-1">
                <div className="font-semibold text-emerald-400">CRDB SimBanking / NMB Mkononi:</div>
                <div className="text-[11px] text-slate-300">
                  {isSw
                    ? 'Fungua App ya Benki -> Malipo ya Serikali/Ada -> Ingiza 991200845001.'
                    : 'Open Bank App -> Government/School Payments -> Enter Control No.'}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPayModal(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                {isSw ? 'Funga' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parent-to-Teacher Direct Comment / Inquiry Modal */}
      <ParentTeacherCommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        studentName={`${activeStudent.first_name} ${activeStudent.last_name}`}
        studentId={activeStudent.id}
        className={activeStudent.class_name}
        parentName={myLinkedProfile?.parent_name || 'Mzee Juma Mohamed'}
        parentPhone={myLinkedProfile?.phone_number || currentParentPhone}
        parentId={activeStudent.parent_id}
        examName={selectedExamName}
        defaultSubject={commentTargetSubject}
        defaultTeacherId={commentTargetTeacherId}
        language={language}
        onSubmit={(newComment) => {
          if (onAddResultComment) {
            onAddResultComment(newComment);
          }
        }}
      />

      {/* Official Printable Report Card Modal */}
      <PrintReportCardModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        student={activeStudent}
        results={studentResults}
        language={language}
        examName={selectedExamName}
        term={SCHOOL_INFO.current_term}
      />
    </div>
  );
};
