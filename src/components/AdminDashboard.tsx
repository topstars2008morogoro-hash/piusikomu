import React, { useState } from 'react';
import { CLASSES, STUDENTS, INITIAL_FEES, SCHOOL_NOTICES, STAFF } from '../data/mockData';
import {
  Language,
  SchoolNotice,
  AcademicDocument,
  LinkedParent,
  DirectParentMessage,
  ExamTimetable,
} from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SendDocumentModal } from './SendDocumentModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { ClassParentsManager } from './ClassParentsManager';
import { SendExamTimetableModal } from './SendExamTimetableModal';
import { ExamTimetableCard } from './ExamTimetableCard';
import { getAllChildren, getOtherChildren } from '../utils/classPromotion';
import {
  Users,
  DollarSign,
  CalendarCheck,
  Calendar,
  Send,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  PhoneCall,
  School,
  BookOpen,
  Clock,
  FileText,
  FileCheck,
  Eye,
  Download,
  PlusCircle,
  Inbox,
  ShieldCheck,
  Paperclip,
  Palette,
  MessageSquare,
  Phone,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Layers,
  Link as LinkIcon,
  RefreshCw,
  Smartphone,
  GraduationCap,
} from 'lucide-react';

interface AdminDashboardProps {
  language: Language;
  onSendSms: (recipient: string, message: string) => void;
  isOnline: boolean;
  documents?: AcademicDocument[];
  onAddDocument?: (doc: AcademicDocument) => void;
  onUpdateDocumentStatus?: (
    docId: string,
    status: 'approved' | 'revision_requested',
    feedback: string
  ) => void;
  linkedParents?: LinkedParent[];
  onOpenDirectSmsModal?: (parentId?: string, targetPhone?: string, prefillClass?: string) => void;
  onOpenThemeModal?: () => void;
  directMessages?: DirectParentMessage[];
  onOpenRegisterModalForClass?: (className?: string) => void;
  currentAcademicYear?: string;
  onPromoteAcademicYear?: () => void;
  onResetAcademicYear?: () => void;
  examTimetables?: ExamTimetable[];
  onDispatchExamTimetable?: (timetable: ExamTimetable, customSmsMessage?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  onSendSms,
  isOnline,
  documents = [],
  onAddDocument,
  onUpdateDocumentStatus,
  linkedParents = [],
  onOpenDirectSmsModal,
  onOpenThemeModal,
  directMessages = [],
  onOpenRegisterModalForClass,
  currentAcademicYear = '2026',
  onPromoteAcademicYear,
  onResetAcademicYear,
  examTimetables = [],
  onDispatchExamTimetable,
}) => {
  const isSw = language === 'sw';

  // Navigation tab for Admin
  const [adminTab, setAdminTab] = useState<'overview' | 'exams-moderation' | 'finance' | 'linked-parents'>('overview');

  // Timetable State (Dispatch Exam Timetable with Options: Teachers only, Parents only, or Both)
  const [showTimetableModal, setShowTimetableModal] = useState(false);
  const [examSubTab, setExamSubTab] = useState<'timetables' | 'moderation'>('timetables');
  const [timetableAudienceFilter, setTimetableAudienceFilter] = useState<'all' | 'teachers_only' | 'parents_only' | 'both'>('all');

  // Document management state
  const [showSendDocModal, setShowSendDocModal] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<AcademicDocument | null>(null);
  const [docFilter, setDocFilter] = useState<'all' | 'pending' | 'approved' | 'dispatched'>('all');
  const [docSearchQuery, setDocSearchQuery] = useState('');

  // Linked Parents Filter State
  const [parentSearchQuery, setParentSearchQuery] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');
  const [parentTabMode, setParentTabMode] = useState<'class-registry' | 'all-directory' | 'sms-logs'>('class-registry');

  // Metrics
  const totalStudents = CLASSES.reduce((acc, c) => acc + c.total_students, 0);
  const totalFeesCollected = INITIAL_FEES.reduce((acc, f) => acc + f.amount_paid_tzs, 0);
  const totalPendingFees = 14500000; // Simulated total pending
  const attendanceRate = 96.4;

  const pendingTeacherExams = documents.filter(
    (d) => d.sender_role === 'teacher' && d.status === 'under_review'
  );

  // SMS Modal State
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsTarget, setSmsTarget] = useState<'all' | 'unpaid' | 'std4' | 'std7'>('all');
  const [smsMessage, setSmsMessage] = useState(
    isSw
      ? 'Top Stars School: Tunakukumbusha mzazi kuwa mitihani ya nusu muhula inaanza tarehe 22/09/2026. Tafadhali kamilisha ada ya mtoto wako kabla ya Ijumaa.'
      : 'Top Stars School: Reminder to parents that mid-term examinations commence on 22/09/2026. Kindly settle any outstanding school fees balance before Friday.'
  );
  const [smsSentSuccess, setSmsSentSuccess] = useState(false);

  // Class search filter
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClasses = CLASSES.filter(
    (c) =>
      c.class_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.class_teacher_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter linked parents
  const filteredParents = linkedParents.filter((p) => {
    const matchesSearch =
      p.parent_name.toLowerCase().includes(parentSearchQuery.toLowerCase()) ||
      p.student_name.toLowerCase().includes(parentSearchQuery.toLowerCase()) ||
      p.phone_number.includes(parentSearchQuery) ||
      p.class_name.toLowerCase().includes(parentSearchQuery.toLowerCase());

    const matchesCarrier = carrierFilter === 'all' || p.carrier === carrierFilter;

    return matchesSearch && matchesCarrier;
  });

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) return;
    onSendSms(smsTarget, smsMessage);
    setSmsSentSuccess(true);
    setTimeout(() => {
      setSmsSentSuccess(false);
      setShowSmsModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 text-slate-100 pb-16">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-amber-600/20 via-slate-800 to-slate-900 border border-amber-500/30 rounded-xl p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <SchoolLogo size="md" />
            <div>
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                {isSw ? 'Dashibodi ya Uongozi & Utawala' : 'Executive Admin Dashboard'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {isSw ? 'Mkuu wa Shule & Mmiliki' : 'Headteacher & Director Office'}
              </h2>
              <p className="text-xs text-slate-300">
                Top Stars Nursery & Primary School • Morogoro, Tanzania
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="admin-dispatch-timetable-btn"
              onClick={() => setShowTimetableModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-transform active:scale-95 whitespace-nowrap"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSw ? 'Tuma Ratiba ya Mtihani' : 'Dispatch Timetable'}</span>
            </button>
            {onOpenDirectSmsModal && (
              <button
                id="admin-direct-sms-btn"
                onClick={() => onOpenDirectSmsModal()}
                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-transform active:scale-95 whitespace-nowrap"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isSw ? 'Meseji kwa Mzazi' : 'Direct SMS to Parent'}</span>
              </button>
            )}
            <button
              id="admin-send-doc-btn"
              onClick={() => setShowSendDocModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-transform active:scale-95 whitespace-nowrap"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isSw ? 'Tuma Mtihani kwa Walimu' : 'Dispatch Doc/Exam'}</span>
            </button>
            <button
              id="admin-broadcast-sms-btn"
              onClick={() => setShowSmsModal(true)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSw ? 'SMS Broadcast' : 'Broadcast'}</span>
            </button>
            {onOpenThemeModal && (
              <button
                id="admin-theme-btn"
                onClick={onOpenThemeModal}
                className="px-2.5 py-2 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                title={isSw ? 'Badili Mwonekano & Style' : 'Appearance Settings'}
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSw ? 'Mwonekano' : 'Theme'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs (4 Comprehensive Tabs) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold">
        <button
          id="admin-tab-overview"
          onClick={() => setAdminTab('overview')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            adminTab === 'overview'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          <span className="truncate">{isSw ? 'Muhtasari wa Shule' : 'Overview'}</span>
        </button>
        <button
          id="admin-tab-exams-moderation"
          onClick={() => setAdminTab('exams-moderation')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors relative ${
            adminTab === 'exams-moderation'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5" />
          <span className="truncate">{isSw ? 'Mitihani & Uhakiki' : 'Exam Moderation'}</span>
          {pendingTeacherExams.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black animate-pulse">
              {pendingTeacherExams.length}
            </span>
          )}
        </button>
        <button
          id="admin-tab-finance"
          onClick={() => setAdminTab('finance')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            adminTab === 'finance'
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span className="truncate">{isSw ? 'Ada & Mapato' : 'Fees & Finance'}</span>
        </button>
        <button
          id="admin-tab-linked-parents"
          onClick={() => setAdminTab('linked-parents')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors relative ${
            adminTab === 'linked-parents'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span className="truncate">{isSw ? 'Wazazi & SMS' : 'Linked Parents'}</span>
          {linkedParents.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black">
              {linkedParents.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {adminTab === 'overview' && (
        <div className="space-y-4">
          {/* Pending Exams Moderation Alert Banner */}
          {pendingTeacherExams.length > 0 && (
            <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-slate-900 border border-amber-500/50 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                    {isSw
                      ? `Mitihani ${pendingTeacherExams.length} Kutoka kwa Walimu Inasubiri Ukaguzi & Idhini Yako!`
                      : `${pendingTeacherExams.length} Exam Papers from Teachers Awaiting Your Moderation!`}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {isSw
                      ? 'Walimu wamewasilisha rasimu za mitihani ya nusu muhula. Kagua muundo wa maswali na idhinisha kabla ya kupelekwa kwenye uchapaji.'
                      : 'Teachers submitted drafts for mid-term exams. Review formatting and questions before approving for print.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setAdminTab('exams-moderation')}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isSw ? 'Kagua Mitihani Hii Sasa' : 'Review Submissions'}</span>
              </button>
            </div>
          )}

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
            {/* Total Students */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-400">{isSw ? 'Wanafunzi Wote' : 'Total Pupils'}</span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{totalStudents}</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span className="text-blue-400 font-semibold">95 Awali</span> • <span>257 Msingi</span>
              </div>
            </div>

            {/* Total Staff */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-400">{isSw ? 'Walimu & Wafanyakazi' : 'Total Staff'}</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <School className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{STAFF.length + 15}</div>
              <div className="text-[10px] text-emerald-400 mt-1 font-medium">
                {isSw ? 'Walimu 16 • Wasaidizi 4' : '16 Teachers • 4 Support'}
              </div>
            </div>

            {/* Fees Collected */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-400">{isSw ? 'Ada Iliyokusanywa' : 'Fees Collected'}</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-lg sm:text-xl font-black text-amber-400">
                TZS {(totalFeesCollected / 1000).toLocaleString()}k
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {isSw ? 'Deni: TZS 14.5M' : 'Balance: TZS 14.5M'}
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-medium text-slate-400">{isSw ? 'Mahudhurio Leo' : 'Today Attendance'}</span>
                <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-400">{attendanceRate}%</div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{isSw ? 'Wamefika: 339 / 352' : 'Present: 339 / 352'}</span>
              </div>
            </div>
          </div>

          {/* Class Roster & Enrollment Overview */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{isSw ? 'Madarasa na Walimu Walezi (Tanzania Curriculum)' : 'Class Streams & Teachers'}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isSw ? 'Chekechea (Awali) hadi Darasa la VII (NECTA Candidates)' : 'Nursery through Standard VII Candidates'}
                </p>
              </div>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder={isSw ? 'Tafuta darasa au mwalimu...' : 'Search class or teacher...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-48"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 font-medium">
                    <th className="pb-2">{isSw ? 'Darasa' : 'Class'}</th>
                    <th className="pb-2">{isSw ? 'Ngazi' : 'Level'}</th>
                    <th className="pb-2">{isSw ? 'Mwalimu Mlezi' : 'Class Teacher'}</th>
                    <th className="pb-2 text-right">{isSw ? 'Wanafunzi' : 'Pupils'}</th>
                    <th className="pb-2 text-right">{isSw ? 'Nafasi' : 'Capacity'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="py-2.5 font-semibold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>{cls.class_name}</span>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                            cls.level === 'nursery'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {cls.level === 'nursery' ? (isSw ? 'Awali' : 'Nursery') : (isSw ? 'Msingi' : 'Primary')}
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-300">{cls.class_teacher_name}</td>
                      <td className="py-2.5 text-right font-bold text-amber-400">{cls.total_students}</td>
                      <td className="py-2.5 text-right text-slate-400">{cls.capacity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EXAM TIMETABLES & MODERATION EXCHANGE */}
      {adminTab === 'exams-moderation' && (
        <div className="space-y-3.5">
          {/* Subtabs Switcher: Ratiba za Mitihani vs Uhakiki wa Mitihani ya Walimu */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
            <div className="flex items-center gap-1.5">
              <button
                id="subtab-exam-timetables"
                onClick={() => setExamSubTab('timetables')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  examSubTab === 'timetables'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>{isSw ? 'Ratiba Rasmi za Mitihani' : 'Official Exam Timetables'}</span>
                <span className="px-1.5 py-0.2 rounded-full bg-slate-950/60 text-[10px] text-amber-300 font-bold">
                  {examTimetables.length}
                </span>
              </button>

              <button
                id="subtab-exam-moderation"
                onClick={() => setExamSubTab('moderation')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  examSubTab === 'moderation'
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>{isSw ? 'Uhakiki wa Mitihani ya Walimu' : 'Teacher Exam Moderation'}</span>
                {pendingTeacherExams.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {pendingTeacherExams.length}
                  </span>
                )}
              </button>
            </div>

            <button
              id="admin-open-timetable-modal-btn"
              onClick={() => setShowTimetableModal(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 shadow-md active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{isSw ? 'Tuma Ratiba Mpya ya Mtihani' : 'Dispatch New Timetable'}</span>
            </button>
          </div>

          {/* SUBTAB CONTENT 1: OFFICIAL EXAM TIMETABLES */}
          {examSubTab === 'timetables' && (
            <div className="space-y-3.5">
              {/* Informative Dispatch Banner */}
              <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-xl p-3.5 sm:p-4 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mt-0.5">
                      <Calendar className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-extrabold text-white">
                        {isSw
                          ? 'Usambazaji wa Ratiba za Mitihani (Chaguo la Walimu / Wazazi / Wote)'
                          : 'Exam Timetable Distribution (Teachers / Parents / Both)'}
                      </h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {isSw
                          ? 'Admin ana uwezo wa kusambaza ratiba kwenda kwa: 1) Walimu Peke Yao, 2) Wazazi Peke Yao (kupitia SMS), au 3) Wote: Wazazi na Walimu kwa pamoja.'
                          : 'Headteacher can dispatch timetables to: 1) Teachers only, 2) Parents only (via cellular SMS), or 3) Both Parents and Teachers.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowTimetableModal(true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 whitespace-nowrap"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    <span>{isSw ? 'Tuma Ratiba ya Mtihani' : 'Dispatch Timetable'}</span>
                  </button>
                </div>

                {/* Audience Summary Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">{isSw ? 'Jumla ya Ratiba' : 'Total Timetables'}</span>
                    <span className="text-sm font-bold text-white">{examTimetables.length}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-blue-500/30">
                    <span className="text-[10px] text-blue-300 block">{isSw ? 'Kwa Walimu Peke Yao' : 'Teachers Only'}</span>
                    <span className="text-sm font-bold text-blue-400">
                      {examTimetables.filter((t) => t.target_audience === 'teachers_only').length}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-emerald-500/30">
                    <span className="text-[10px] text-emerald-300 block">{isSw ? 'Kwa Wazazi Peke Yao' : 'Parents Only (SMS)'}</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {examTimetables.filter((t) => t.target_audience === 'parents_only').length}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950/60 border border-purple-500/30">
                    <span className="text-[10px] text-purple-300 block">{isSw ? 'Kwa Wote (Walimu & Wazazi)' : 'Both (All)'}</span>
                    <span className="text-sm font-bold text-purple-400">
                      {examTimetables.filter((t) => t.target_audience === 'both').length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Audience Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setTimetableAudienceFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    timetableAudienceFilter === 'all'
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isSw ? 'Ratiba Zote' : 'All Timetables'} ({examTimetables.length})
                </button>
                <button
                  onClick={() => setTimetableAudienceFilter('teachers_only')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    timetableAudienceFilter === 'teachers_only'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👨‍🏫 {isSw ? 'Walimu Peke Yao' : 'Teachers Only'} (
                  {examTimetables.filter((t) => t.target_audience === 'teachers_only').length})
                </button>
                <button
                  onClick={() => setTimetableAudienceFilter('parents_only')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    timetableAudienceFilter === 'parents_only'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  👨‍👩‍👧 {isSw ? 'Wazazi Peke Yao (SMS)' : 'Parents Only (SMS)'} (
                  {examTimetables.filter((t) => t.target_audience === 'parents_only').length})
                </button>
                <button
                  onClick={() => setTimetableAudienceFilter('both')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    timetableAudienceFilter === 'both'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  🌐 {isSw ? 'Wote (Wazazi na Walimu)' : 'Both (Teachers & Parents)'} (
                  {examTimetables.filter((t) => t.target_audience === 'both').length})
                </button>
              </div>

              {/* List of Timetables */}
              <div className="space-y-3">
                {examTimetables
                  .filter((tt) => {
                    if (timetableAudienceFilter === 'all') return true;
                    return tt.target_audience === timetableAudienceFilter;
                  })
                  .map((timetable) => (
                    <ExamTimetableCard
                      key={timetable.id}
                      timetable={timetable}
                      language={language}
                      userRole="admin"
                    />
                  ))}

                {examTimetables.filter((tt) => {
                  if (timetableAudienceFilter === 'all') return true;
                  return tt.target_audience === timetableAudienceFilter;
                }).length === 0 && (
                  <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl">
                    <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                    <p className="text-sm text-slate-300 font-semibold">
                      {isSw ? 'Hakuna ratiba ya mtihani katika kundi hili.' : 'No exam timetables in this filter.'}
                    </p>
                    <button
                      onClick={() => setShowTimetableModal(true)}
                      className="mt-3 px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      {isSw ? 'Tuma Ratiba Sasa' : 'Dispatch Timetable Now'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB CONTENT 2: TEACHER EXAM MODERATION & DOCUMENT EXCHANGE */}
          {examSubTab === 'moderation' && (
            <div className="space-y-3.5">
          {/* Action Header Card */}
          <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border border-blue-500/40 rounded-xl p-3.5 sm:p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {isSw
                      ? 'Idara ya Mitihani, Uhakiki & Nyaraka (Admin ⇄ Walimu)'
                      : 'Exam Moderation & Document Dispatch (Headteacher Desk)'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isSw
                      ? 'Kagua na idhinisha mitihani inayowasilishwa na walimu, toa maoni ya kurekebisha, au tuma mitihani, miongozo na nyaraka kwa walimu wote.'
                      : 'Review and approve exams submitted by teachers, provide correction notes, or dispatch circulars & past papers to staff.'}
                  </p>
                </div>
              </div>

              <button
                id="btn-admin-dispatch-doc"
                onClick={() => setShowSendDocModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSw ? 'Tuma Hati / Mtihani kwa Walimu' : 'Dispatch Document / Exam'}</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Inayosubiri Uhakiki' : 'Pending Review'}</span>
                <span className="text-sm font-bold text-amber-400">
                  {documents.filter((d) => d.sender_role === 'teacher' && d.status === 'under_review').length}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Imeidhinishwa' : 'Approved'}</span>
                <span className="text-sm font-bold text-emerald-400">
                  {documents.filter((d) => d.sender_role === 'teacher' && d.status === 'approved').length}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Nyaraka za Mkuu' : 'Sent by Headteacher'}</span>
                <span className="text-sm font-bold text-blue-400">
                  {documents.filter((d) => d.sender_role === 'admin').length}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Pills and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setDocFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  docFilter === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isSw ? 'Nyaraka Zote' : 'All Documents'} ({documents.length})
              </button>
              <button
                onClick={() => setDocFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  docFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSw ? 'Inayosubiri Uhakiki' : 'Pending Review'}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-amber-500/20 text-amber-300 font-bold">
                  {documents.filter((d) => d.sender_role === 'teacher' && d.status === 'under_review').length}
                </span>
              </button>
              <button
                onClick={() => setDocFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  docFilter === 'approved'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{isSw ? 'Imeidhinishwa' : 'Approved'}</span>
              </button>
              <button
                onClick={() => setDocFilter('dispatched')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  docFilter === 'dispatched'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSw ? 'Zilizotumwa na Mkuu' : 'Sent by Admin'}</span>
              </button>
            </div>

            <input
              type="text"
              placeholder={isSw ? 'Tafuta mtihani au mwalimu...' : 'Search exams/teachers...'}
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-48"
            />
          </div>

          {/* Documents Grid / List */}
          <div className="space-y-2.5">
            {documents
              .filter((doc) => {
                if (docFilter === 'pending') {
                  return doc.sender_role === 'teacher' && doc.status === 'under_review';
                }
                if (docFilter === 'approved') {
                  return doc.status === 'approved';
                }
                if (docFilter === 'dispatched') {
                  return doc.sender_role === 'admin';
                }
                return true;
              })
              .filter((doc) => {
                if (!docSearchQuery) return true;
                const q = docSearchQuery.toLowerCase();
                return (
                  doc.title.toLowerCase().includes(q) ||
                  doc.subject_name.toLowerCase().includes(q) ||
                  doc.class_name.toLowerCase().includes(q) ||
                  doc.sender_name.toLowerCase().includes(q)
                );
              })
              .map((doc) => {
                const isTeacherSubmission = doc.sender_role === 'teacher';

                return (
                  <div
                    key={doc.id}
                    className={`bg-slate-900/90 border rounded-xl p-3.5 transition-all space-y-2 ${
                      doc.status === 'under_review' && isTeacherSubmission
                        ? 'border-amber-500/60 ring-1 ring-amber-500/20'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Category, Tag, Date */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            doc.category === 'exam_paper'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : doc.category === 'marking_scheme'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : doc.category === 'circular_notice'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {doc.category === 'exam_paper'
                            ? isSw ? '📝 Mtihani (Exam)' : '📝 Exam Paper'
                            : doc.category === 'marking_scheme'
                            ? isSw ? '🔑 Mwongozo wa Majibu' : '🔑 Marking Scheme'
                            : doc.category === 'circular_notice'
                            ? isSw ? '📜 Waraka Rasmi' : '📜 Circular / Notice'
                            : isSw ? '📚 Nyaraka' : 'Academic Doc'}
                        </span>

                        {isTeacherSubmission ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                            <span>{isSw ? `Mwalimu: ${doc.sender_name}` : `Teacher: ${doc.sender_name}`}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300 text-[10px] font-semibold flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>{isSw ? 'Umetumwa na Utawala' : 'Sent by Headteacher'}</span>
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono">{doc.created_at}</span>
                    </div>

                    {/* Title and Metadata */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">{doc.title}</h4>
                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">{doc.description}</p>
                    </div>

                    {/* Class & Subject Details Pill */}
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {isSw ? 'Darasa:' : 'Class:'} <span className="text-slate-200 font-semibold">{doc.class_name}</span>
                      </span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {isSw ? 'Somo:' : 'Subject:'} <span className="text-slate-200 font-semibold">{doc.subject_name}</span>
                      </span>
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-mono text-amber-400">
                        📎 {doc.file_name} ({doc.file_size})
                      </span>
                    </div>

                    {/* Status & Feedback */}
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {isSw ? 'Hali ya Karatasi:' : 'Document Status:'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            doc.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : doc.status === 'revision_requested'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {doc.status === 'approved'
                            ? isSw ? '✓ Imeidhinishwa kwa Uchapaji' : '✓ Approved for Printing'
                            : doc.status === 'revision_requested'
                            ? isSw ? '⚠️ Inahitaji Marudio' : '⚠️ Revision Requested'
                            : isSw ? '⏳ Inasubiri Uhakiki wako' : '⏳ Awaiting Your Review'}
                        </span>
                      </div>

                      {doc.admin_feedback && (
                        <div className="text-[11px] text-amber-300 italic sm:max-w-xs">
                          Maoni: "{doc.admin_feedback}"
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                      {isTeacherSubmission ? (
                        <button
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="py-1 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{isSw ? 'Kagua & Toa Idhini / Maoni' : 'Review & Moderate'}</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedDocForPreview(doc)}
                          className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>{isSw ? 'Tazama Karatasi' : 'Preview Paper'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedDocForPreview(doc)}
                        className="py-1 px-2.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isSw ? 'Pakua' : 'Download'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    )}

      {/* TAB 3: FEES & FINANCE */}
      {adminTab === 'finance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Fees Collected Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <span className="text-xs text-slate-400 font-semibold">{isSw ? 'Jumla ya Ada Iliyolipwa' : 'Total Collected'}</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                TZS {(totalFeesCollected).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isSw ? 'Kupitia NMB Bank, CRDB na Malipo ya Mitandao ya Simu' : 'Deposits through Tanzanian Banks & Mobile Money'}
              </p>
            </div>

            {/* Pending Fees Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4">
              <span className="text-xs text-slate-400 font-semibold">{isSw ? 'Madeni ya Ada Yanayosubiriwa' : 'Outstanding Balances'}</span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                TZS {(totalPendingFees).toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {isSw ? 'Wanafunzi 64 wana salio la ada kwa muhula wa kwanza' : '64 students with pending balances for Term 1'}
              </p>
            </div>
          </div>

          {/* Recent Fees Transactions (TZS) */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>{isSw ? 'Malipo ya Hivi Karibuni (M-Pesa, Benki, n.k.)' : 'Recent Fee Collections (TZS)'}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isSw ? 'Risiti rasmi zenye Namba za Udhibiti (Control Numbers)' : 'Verified receipts with control numbers'}
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-400 px-2 py-1 bg-emerald-500/10 rounded border border-emerald-500/20">
                {isSw ? 'Mfumo wa NACTE / GePG Tayari' : 'GePG/Control No Ready'}
              </span>
            </div>

            <div className="space-y-2">
              {INITIAL_FEES.map((fee) => (
                <div
                  key={fee.id}
                  className="bg-slate-900/80 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      TZS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{fee.student_name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                        <span>{fee.class_name}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-medium">{fee.payment_method}</span>
                        <span>•</span>
                        <span className="font-mono text-slate-500">{fee.receipt_number}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">
                      +TZS {fee.amount_paid_tzs.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-400" />
                      <span>{fee.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LINKED PARENTS & DIRECT SMS (SYSTEM INTEGRATION) */}
      {adminTab === 'linked-parents' && (
        <div className="space-y-4">
          {/* Header & Concept Explanation */}
          <div className="bg-gradient-to-r from-emerald-950/80 via-slate-850 to-slate-900 border border-emerald-500/40 rounded-xl p-3.5 sm:p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                    {isSw ? 'Mfumo wa Namba za Wazazi Zilizounganishwa' : 'Linked Parent Numbers & Direct SMS Bridge'}
                  </span>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{isSw ? 'Wazazi Waliosajiliwa na Kuunganishwa' : 'Registered Parents Directory'}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                      {linkedParents.length} {isSw ? 'Wazazi' : 'Parents'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl">
                    {isSw
                      ? 'Mzazi akishajisajili, namba yake inaunganishwa moja kwa moja na dashibodi ya mkuu wa shule. Ukituma ujumbe unamfikia moja kwa moja kwenye simu yake ya mkononi kama SMS ya kawaida.'
                      : 'Parents registered in the system are directly linked to the admin console. Regular SMS messages dispatched here reach the parent’s cellular phone without requiring data bundles.'}
                  </p>
                </div>
              </div>

              {onOpenDirectSmsModal && (
                <button
                  id="admin-new-direct-sms-btn"
                  onClick={() => onOpenDirectSmsModal()}
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-transform whitespace-nowrap flex-shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isSw ? 'Tuma Meseji Mpya kwa Mzazi' : 'Compose Direct SMS'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub Navigation Modes for Linked Parents */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
            <button
              id="subtab-class-registry"
              onClick={() => setParentTabMode('class-registry')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                parentTabMode === 'class-registry'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>{isSw ? 'Wazazi kwa Madarasa & Uhawilishaji' : 'Class Registers & Annual Promotion'}</span>
            </button>

            <button
              id="subtab-all-directory"
              onClick={() => setParentTabMode('all-directory')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                parentTabMode === 'all-directory'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{isSw ? `Orodha Kamili (${linkedParents.length})` : `All Parents Directory (${linkedParents.length})`}</span>
            </button>

            <button
              id="subtab-sms-logs"
              onClick={() => setParentTabMode('sms-logs')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                parentTabMode === 'sms-logs'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isSw ? `Kumbukumbu ya SMS (${directMessages.length})` : `Direct SMS Logs (${directMessages.length})`}</span>
            </button>
          </div>

          {/* MODE 1: CLASS REGISTRY & ANNUAL PROMOTION */}
          {parentTabMode === 'class-registry' && (
            <ClassParentsManager
              language={language}
              linkedParents={linkedParents}
              onOpenRegisterModalForClass={(cls) =>
                onOpenRegisterModalForClass ? onOpenRegisterModalForClass(cls) : undefined
              }
              onOpenDirectSmsModal={(pId, phone, prefillClass) =>
                onOpenDirectSmsModal && onOpenDirectSmsModal(pId, phone, prefillClass)
              }
              currentAcademicYear={currentAcademicYear}
              onPromoteAcademicYear={onPromoteAcademicYear || (() => {})}
              onResetAcademicYear={onResetAcademicYear}
            />
          )}

          {/* MODE 2: ALL DIRECTORY & SEARCH */}
          {parentTabMode === 'all-directory' && (
            <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {isSw ? 'Wazazi Walio Link' : 'Linked Parents'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{linkedParents.length}</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5">
                {isSw ? 'Wote wapo hewani (100%)' : 'All active & verified'}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {isSw ? 'Meseji za SMS' : 'Direct Messages'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span>{directMessages.length}</span>
              </div>
              <div className="text-[10px] text-amber-400 mt-0.5">
                {isSw ? 'Zilizotumwa & Kupokelewa' : 'Dispatched & Synced'}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {isSw ? 'Ufikiaji wa SMS' : 'Delivery Rate'}
              </div>
              <div className="text-lg sm:text-xl font-bold text-white mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                <span>100%</span>
              </div>
              <div className="text-[10px] text-teal-400 mt-0.5">
                {isSw ? 'GSM Cellular SMS' : 'Zero drop network rate'}
              </div>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/70 p-3 rounded-xl">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">
                {isSw ? 'Mitandao ya Tanzania' : 'Supported Telcos'}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1">
                <span className="text-rose-400">Voda</span> •
                <span className="text-red-400">Airtel</span> •
                <span className="text-blue-400">Tigo</span> •
                <span className="text-amber-400">Halo</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {isSw ? 'Morogoro & Tanzania Nzima' : 'National coverage'}
              </div>
            </div>
          </div>

          {/* Search & Carrier Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder={
                  isSw
                    ? 'Tafuta kwa jina la mzazi, mwanafunzi, namba ya simu au darasa...'
                    : 'Search by parent, student, phone, or class...'
                }
                value={parentSearchQuery}
                onChange={(e) => setParentSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[10px] text-slate-400 px-1">{isSw ? 'Mtandao:' : 'Carrier:'}</span>
              {['all', 'Vodacom', 'Airtel', 'Tigo', 'Halotel'].map((carrier) => (
                <button
                  key={carrier}
                  onClick={() => setCarrierFilter(carrier)}
                  className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors whitespace-nowrap ${
                    carrierFilter === carrier
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {carrier === 'all' ? (isSw ? 'Yote' : 'All') : carrier}
                </button>
              ))}
            </div>
          </div>

          {/* Linked Parents Directory List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>{isSw ? 'Orodha ya Wazazi Walio Tayari Kupokea Meseji' : 'Linked Parents Directory'}</span>
              <span className="text-[11px] text-slate-400">
                {filteredParents.length} {isSw ? 'kati ya' : 'of'} {linkedParents.length}
              </span>
            </h4>

            {filteredParents.length === 0 ? (
              <div className="text-center py-10 bg-slate-800/40 border border-slate-700/60 rounded-xl space-y-2">
                <Phone className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs text-slate-400">
                  {isSw ? 'Hakuna mzazi anayelingana na utafutaji wako.' : 'No parents matched your filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredParents.map((parent) => (
                  <div
                    key={parent.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 hover:border-emerald-500/50 transition-all flex flex-col justify-between gap-3 shadow-sm"
                  >
                    <div>
                      {/* Top status bar */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>{isSw ? 'Namba Imeunganishwa' : 'Phone Linked'}</span>
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 border border-slate-700 text-amber-300">
                          {parent.carrier}
                        </span>
                      </div>

                      {/* Parent & Child info */}
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm flex-shrink-0">
                          {parent.parent_name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{parent.parent_name}</h4>
                          <div className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" />
                            <span>{parent.phone_number}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            <span>📍 {parent.residence_area || 'Morogoro'}</span> •{' '}
                            <span>{isSw ? 'Mwaka:' : 'Year:'} {parent.academic_year || currentAcademicYear}</span>
                          </div>

                          {/* Multi-Child Enrollment Chips */}
                          <div className="mt-2 p-1.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                            <div className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-between">
                              <span>{isSw ? 'Watoto Shuleni:' : 'Enrolled Children:'}</span>
                              {getAllChildren(parent).length > 1 && (
                                <span className="text-amber-400 flex items-center gap-0.5">
                                  <LinkIcon className="w-2.5 h-2.5" />
                                  <span>{isSw ? 'Madarasa Tofauti' : 'Multi-Class'}</span>
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              {getAllChildren(parent).map((k, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[11px]">
                                  <span className="text-white font-medium">{k.student_name}</span>
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 font-semibold">
                                    {k.class_name.split('(')[0].trim()}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Send Direct SMS */}
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-2">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span>{isSw ? 'SMS itamfikia moja kwa moja' : 'Direct SMS enabled'}</span>
                      </div>
                      {onOpenDirectSmsModal && (
                        <button
                          onClick={() => onOpenDirectSmsModal(parent.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm transition-colors active:scale-95"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{isSw ? 'Tuma Ujumbe (SMS)' : 'Send SMS'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

          {/* MODE 3: DIRECT SMS LOGS */}
          {parentTabMode === 'sms-logs' && (
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2.5">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isSw ? 'Kumbukumbu ya Meseji za Moja kwa Moja Zilizotumwa kwa Wazazi' : 'Direct Parent SMS Transmission Log'}
                </h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                {directMessages.length} {isSw ? 'Meseji' : 'Messages'}
              </span>
            </div>

            {directMessages.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {isSw ? 'Hakuna meseji zilizotumwa bado.' : 'No direct messages in log.'}
              </p>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {directMessages.map((msg) => {
                  const isAdmin = msg.sender_role === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-xl border text-xs ${
                        isAdmin
                          ? 'bg-slate-900/90 border-slate-700/70'
                          : 'bg-emerald-950/40 border-emerald-500/30 ml-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white flex items-center gap-1">
                            <span>{isAdmin ? '👑 Mkuu wa Shule' : '👨‍👧 ' + msg.sender_name}</span>
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {isAdmin ? `➔ ${msg.recipient_name} (${msg.recipient_phone})` : '➔ Mkuu wa Shule'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{msg.timestamp}</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                            ✓✓ {isSw ? 'Imefika' : 'Delivered'}
                          </span>
                        </div>
                      </div>

                      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{msg.message}</p>

                      <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>
                          {isSw ? 'Njia ya Mawasiliano:' : 'Network Channel:'}{' '}
                          <strong className="text-emerald-400">{msg.carrier} Cellular Direct SMS</strong>
                        </span>
                        {msg.student_name && (
                          <span>
                            {isSw ? 'Mwanafunzi:' : 'Pupil:'}{' '}
                            <span className="text-amber-300 font-semibold">{msg.student_name}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        </div>
      )}

      {showSendDocModal && (
        <SendDocumentModal
          language={language}
          senderRole="admin"
          senderName="Mwl. David Lyimo (Mkuu wa Shule)"
          senderId="stf-01"
          onClose={() => setShowSendDocModal(false)}
          onSubmit={(newDoc) => {
            if (onAddDocument) {
              onAddDocument(newDoc);
            }
          }}
        />
      )}

      {/* Modal: Document Preview & Moderation (Approve / Request Revision) */}
      {selectedDocForPreview && (
        <DocumentPreviewModal
          document={selectedDocForPreview}
          language={language}
          currentRole="admin"
          onClose={() => setSelectedDocForPreview(null)}
          onModerate={(status, feedback) => {
            if (onUpdateDocumentStatus) {
              onUpdateDocumentStatus(selectedDocForPreview.id, status, feedback);
            }
          }}
        />
      )}

      {/* SMS Broadcast Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {isSw ? 'Tuma Ujumbe wa SMS kwa Wazazi' : 'SMS Gateway Broadcast'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isSw ? 'Morogoro SMS Bulk Gateway (Beem Africa)' : 'Tanzania Bulk SMS Gateway Integration'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {smsSentSuccess ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {isSw ? 'Ujumbe Umetumwa Kikamilifu!' : 'SMS Broadcast Dispatched!'}
                </h4>
                <p className="text-xs text-slate-400">
                  {isSw
                    ? 'Wazazi 248 wamepokea ujumbe kupitia Vodacom, Airtel, na Tigo.'
                    : '248 parents notified via Tanzania Telco SMS networks.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Walengwa wa Ujumbe (Target Audience)' : 'Recipient Target'}
                  </label>
                  <select
                    value={smsTarget}
                    onChange={(e: any) => setSmsTarget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="all">{isSw ? 'Wazazi Wote (Shule Nzima - 352)' : 'All Parents (Whole School - 352)'}</option>
                    <option value="unpaid">{isSw ? 'Wazazi Wenye Madeni ya Ada (64)' : 'Parents with Fee Balances (64)'}</option>
                    <option value="std4">{isSw ? 'Wazazi wa Darasa la IV (SFNA Candidates)' : 'Standard IV Parents (SFNA Candidates)'}</option>
                    <option value="std7">{isSw ? 'Wazazi wa Darasa la VII (PSLE Candidates)' : 'Standard VII Parents (PSLE Candidates)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Maudhui ya Ujumbe (SMS Text)' : 'Message Content'}
                  </label>
                  <textarea
                    rows={4}
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                    placeholder={isSw ? 'Andika ujumbe hapa...' : 'Type message here...'}
                  ></textarea>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Sender ID: TOPSTARS</span>
                    <span>{smsMessage.length} characters (1 SMS)</span>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50 text-[11px] text-slate-300 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {isSw
                      ? 'Wazazi wasio na intaneti au bando watapokea ujumbe kama SMS ya kawaida bila kuathiriwa na umeme au mtandao mdogo.'
                      : 'Parents without active data bundles will receive standard cellular SMS guaranteed.'}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSmsModal(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    {isSw ? 'Ghairi' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSw ? 'Tuma Sasa' : 'Send Now'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Send Exam Timetable Modal (Teachers only, Parents only, or Both) */}
      {showTimetableModal && (
        <SendExamTimetableModal
          language={language}
          linkedParents={linkedParents}
          onClose={() => setShowTimetableModal(false)}
          onDispatch={(newTimetable, customSmsMessage) => {
            if (onDispatchExamTimetable) {
              onDispatchExamTimetable(newTimetable, customSmsMessage);
            }
          }}
        />
      )}
    </div>
  );
};
