import React, { useState } from 'react';
import {
  DeviceView,
  Language,
  UserRole,
  AuthUser,
  AcademicDocument,
  ThemeSettings,
  LinkedParent,
  DirectParentMessage,
  ExamTimetable,
  ExamResult,
  ResultTeacherComment,
} from '../types';
import { AUTH_USERS } from '../data/authCredentials';
import { INITIAL_DOCUMENTS } from '../data/mockDocuments';
import { INITIAL_EXAM_TIMETABLES } from '../data/mockTimetables';
import { INITIAL_EXAM_RESULTS, INITIAL_RESULT_COMMENTS } from '../data/mockData';
import { AdminDashboard } from './AdminDashboard';
import { TeacherDashboard } from './TeacherDashboard';
import { ParentDashboard } from './ParentDashboard';
import { LoginScreen } from './LoginScreen';
import { SchoolLogo } from './SchoolLogo';
import {
  Wifi,
  WifiOff,
  Battery,
  ShieldAlert,
  Users,
  Award,
  Receipt,
  Smartphone,
  LogOut,
  KeyRound,
  CheckCircle2,
  UserCheck,
  Palette,
  MessageSquare,
  Phone,
} from 'lucide-react';

interface DeviceFrameProps {
  deviceView: DeviceView;
  language: Language;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isOnline: boolean;
  onSendSms: (recipient: string, message: string) => void;
  onRecordLocalChange: (entity: string, action: 'INSERT' | 'UPDATE', details: string) => void;
  themeSettings: ThemeSettings;
  onOpenThemeModal: () => void;
  linkedParents: LinkedParent[];
  onOpenRegisterModal: () => void;
  onOpenDirectSmsModal: (parentId?: string) => void;
  directMessages: DirectParentMessage[];
  onSendDirectSms?: (msg: DirectParentMessage) => void;
  onMarkMessageAsRead?: (msgId: string) => void;
  onReplyToAdmin?: (text: string, parentName: string, studentName: string) => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceView,
  language,
  userRole,
  setUserRole,
  isOnline,
  onSendSms,
  onRecordLocalChange,
  themeSettings,
  onOpenThemeModal,
  linkedParents,
  onOpenRegisterModal,
  onOpenDirectSmsModal,
  directMessages,
  onSendDirectSms,
  onMarkMessageAsRead,
  onReplyToAdmin,
}) => {
  const isSw = language === 'sw';

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<AuthUser>(
    AUTH_USERS.find((u) => u.role === userRole) || AUTH_USERS[0]
  );

  // Two-way Academic Documents and Examinations Exchange State
  const [documents, setDocuments] = useState<AcademicDocument[]>(INITIAL_DOCUMENTS);

  // Official Exam Timetables State (Admin Dispatches to Teachers Only, Parents Only, or Both)
  const [examTimetables, setExamTimetables] = useState<ExamTimetable[]>(INITIAL_EXAM_TIMETABLES);

  // Student Examination Results & Direct Parent-Teacher Comments State
  const [examResults, setExamResults] = useState<ExamResult[]>(INITIAL_EXAM_RESULTS);
  const [resultComments, setResultComments] = useState<ResultTeacherComment[]>(INITIAL_RESULT_COMMENTS);

  const handleAddResultComment = (newComment: ResultTeacherComment) => {
    setResultComments((prev) => [newComment, ...prev]);
    onRecordLocalChange(
      'result_comments',
      'INSERT',
      isSw
        ? `Maoni ya Mzazi (${newComment.parent_name}) kuhusu ${newComment.subject_name} yametumwa kwa mwalimu ${newComment.teacher_name}`
        : `Parent comment from ${newComment.parent_name} regarding ${newComment.subject_name} sent to ${newComment.teacher_name}`
    );
  };

  const handleReplyResultComment = (commentId: string, replyText: string) => {
    setResultComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              reply_text: replyText,
              reply_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: 'replied' as const,
            }
          : c
      )
    );
    onRecordLocalChange(
      'result_comments',
      'UPDATE',
      isSw
        ? `Mwalimu amejibu maoni ya mzazi kuhusu matokeo ya mtihani`
        : `Teacher replied to parent result comment`
    );
  };

  const handleDispatchExamTimetable = (timetable: ExamTimetable, customSmsMessage?: string) => {
    setExamTimetables((prev) => [timetable, ...prev]);

    // 1. If audience includes teachers (teachers_only or both)
    if (timetable.target_audience === 'teachers_only' || timetable.target_audience === 'both') {
      const docForTeachers: AcademicDocument = {
        id: `doc-${Date.now()}`,
        title: timetable.title,
        category: 'circular_notice',
        sender_id: 'adm-01',
        sender_name: 'Mwl. David Lyimo (Mkuu wa Shule)',
        sender_role: 'admin',
        recipient_id: 'all_teachers',
        recipient_name: 'Walimu Wote (All Teaching Staff)',
        recipient_role: 'all_teachers',
        class_name: timetable.target_classes.includes('all') ? 'Shule Nzima (All Classes)' : timetable.target_classes.join(', '),
        subject_name: 'Ratiba ya Mitihani & Usimamizi',
        term: timetable.term,
        academic_year: timetable.academic_year,
        status: 'distributed',
        file_name: `${timetable.title.replace(/\s+/g, '_')}.pdf`,
        file_size: '1.8 MB',
        file_type: 'pdf',
        description: isSw
          ? `Ratiba rasmi ya mitihani imetolewa na Mkuu wa Shule. Walimu mnaombwa kuzingatia zamu za usimamizi na kumbi zilizopangwa.`
          : `Official exam timetable issued by Headteacher. Please adhere to invigilation rosters and venues.`,
        created_at: new Date().toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      };
      setDocuments((prev) => [docForTeachers, ...prev]);
    }

    // 2. If audience includes parents (parents_only or both)
    if (timetable.target_audience === 'parents_only' || timetable.target_audience === 'both') {
      const smsText =
        customSmsMessage ||
        timetable.sms_message_preview ||
        (isSw
          ? `Top Stars School: Ndugu Mzazi, Ratiba ya ${timetable.title} imetoka rasmi. Mitihani itaanza tarehe ${timetable.start_date}. Mwanafunzi awahi asubuhi akiwa na vifaa vyote.`
          : `Top Stars School: Dear Parent, The exam schedule for ${timetable.title} has been released. Exams start on ${timetable.start_date}.`);

      // Filter parents based on target classes
      const targetParents = timetable.target_classes.includes('all')
        ? linkedParents
        : linkedParents.filter((p) => {
            const kidMatch = p.children?.some((c) =>
              timetable.target_classes.some((tc) => c.class_name.toLowerCase().includes(tc.toLowerCase()))
            );
            const directMatch = timetable.target_classes.some((tc) =>
              p.class_name.toLowerCase().includes(tc.toLowerCase())
            );
            return kidMatch || directMatch;
          });

      targetParents.forEach((parent) => {
        const smsMsg: DirectParentMessage = {
          id: `dmsg-${Date.now()}-${parent.id}`,
          sender_role: 'admin',
          sender_name: 'Mwl. David Lyimo (Mkuu wa Shule)',
          recipient_phone: parent.phone_number,
          recipient_name: parent.parent_name,
          parent_id: parent.id,
          message: smsText,
          message_type: 'academic',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered',
          is_read_by_parent: false,
          channel: 'SMS',
        };
        if (onSendDirectSms) {
          onSendDirectSms(smsMsg);
        }
      });

      onSendSms(
        timetable.target_classes.includes('all') ? (isSw ? 'Wazazi Wote' : 'All Parents') : timetable.target_classes.join(', '),
        smsText
      );
    }

    onRecordLocalChange(
      'exam_timetables',
      'INSERT',
      isSw
        ? `Ratiba ya Mtihani "${timetable.title}" imetumwa kwa ${
            timetable.target_audience === 'teachers_only'
              ? 'Walimu Peke Yao'
              : timetable.target_audience === 'parents_only'
              ? 'Wazazi Peke Yao (SMS)'
              : 'Wote (Wazazi na Walimu)'
          }`
        : `Exam timetable "${timetable.title}" dispatched to ${timetable.target_audience}`
    );
  };

  const handleAddDocument = (newDoc: AcademicDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    onRecordLocalChange(
      'academic_documents',
      'INSERT',
      isSw
        ? `Hati/Mtihani mpya umetungwa/kutumwa: "${newDoc.title}" (${newDoc.sender_name} -> ${newDoc.recipient_name})`
        : `New document/exam dispatched: "${newDoc.title}" (${newDoc.sender_name} -> ${newDoc.recipient_name})`
    );
  };

  const handleUpdateDocumentStatus = (
    docId: string,
    status: 'approved' | 'revision_requested',
    feedback: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              status,
              admin_feedback: feedback,
              reviewed_at: new Date().toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }),
            }
          : doc
      )
    );
    onRecordLocalChange(
      'academic_documents',
      'UPDATE',
      isSw
        ? `Mtihani umehakiwa: "${docId}" hali mpya: ${status === 'approved' ? 'Imeidhinishwa' : 'Marudio Yameombwa'}`
        : `Exam moderated: "${docId}" new status: ${status}`
    );
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setUserRole(user.role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleSwitchToRole = (role: UserRole) => {
    setUserRole(role);
    const matched = AUTH_USERS.find((u) => u.role === role) || AUTH_USERS[0];
    setCurrentUser(matched);
    setIsAuthenticated(true);
  };

  // Determine theme styling classes based on active ThemeSettings
  const getThemeWrapperClasses = () => {
    switch (themeSettings.theme) {
      case 'light-modern':
        return 'bg-slate-900 text-slate-100 ring-2 ring-blue-500/40';
      case 'royal-navy':
        return 'bg-slate-950 text-slate-100 ring-2 ring-blue-500/60';
      case 'emerald-school':
        return 'bg-slate-950 text-slate-100 ring-2 ring-emerald-500/60';
      case 'sunset-amber':
        return 'bg-slate-950 text-slate-100 ring-2 ring-amber-500/60';
      case 'dark-gold':
      default:
        return 'bg-slate-950 text-slate-100 ring-1 ring-amber-500/40';
    }
  };

  // Sizing styles depending on device view
  const frameContainerClasses =
    deviceView === 'mobile'
      ? `max-w-[430px] w-full mx-auto my-4 rounded-[42px] border-[10px] border-slate-800 shadow-2xl overflow-hidden ${getThemeWrapperClasses()}`
      : deviceView === 'tablet'
      ? `max-w-[800px] w-full mx-auto my-4 rounded-[36px] border-[12px] border-slate-800 shadow-2xl overflow-hidden ${getThemeWrapperClasses()}`
      : `w-full max-w-5xl mx-auto my-4 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl ${getThemeWrapperClasses()}`;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Credentials & Role Switcher Toolbar */}
      <div className="w-full max-w-xl mx-auto mb-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            {isSw ? 'Akaunti ya Kuingilia:' : 'Active Account:'}
          </span>
          {isAuthenticated && (
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <UserCheck className="w-3 h-3" />
              <span className="font-bold">{currentUser.username}</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-inner justify-center">
          <button
            id="role-admin-btn"
            onClick={() => handleSwitchToRole('admin')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              isAuthenticated && userRole === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👑</span>
            <span>{isSw ? 'Mkuu (Admin)' : 'Admin'}</span>
          </button>
          <button
            id="role-teacher-btn"
            onClick={() => handleSwitchToRole('teacher')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              isAuthenticated && userRole === 'teacher'
                ? 'bg-blue-600 text-white shadow-md scale-102'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👩‍🏫</span>
            <span>{isSw ? 'Mwalimu' : 'Teacher'}</span>
          </button>
          <button
            id="role-parent-btn"
            onClick={() => handleSwitchToRole('parent')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
              isAuthenticated && userRole === 'parent'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>👨‍👧</span>
            <span>{isSw ? 'Mzazi' : 'Parent'}</span>
          </button>

          {/* Explicit Login/Logout toggle button */}
          <button
            id="btn-toggle-auth-screen"
            onClick={() => (isAuthenticated ? handleLogout() : setIsAuthenticated(true))}
            className={`ml-1 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition-colors ${
              isAuthenticated
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300 hover:bg-rose-900/60'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 animate-pulse'
            }`}
            title={isAuthenticated ? 'Log out to Login Screen' : 'Go back to Dashboard'}
          >
            {isAuthenticated ? (
              <>
                <LogOut className="w-3 h-3" />
                <span>{isSw ? 'Toka' : 'Logout'}</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3 h-3" />
                <span>{isSw ? 'Ingia' : 'Login'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Outer Device Container */}
      <div className={frameContainerClasses}>
        {/* Android Status Bar (Only visible in Phone & Tablet mockups) */}
        {deviceView !== 'desktop' && (
          <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-slate-400 text-xs select-none border-b border-slate-900">
            <span className="font-semibold text-white text-[11px]">09:41</span>
            {/* Camera Punch-Hole Simulation */}
            <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              {isOnline ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  <span className="text-[10px] font-mono">4G</span>
                </span>
              ) : (
                <span className="text-rose-400 flex items-center gap-1 animate-pulse">
                  <WifiOff className="w-3 h-3" />
                  <span className="text-[10px] font-mono">Offline</span>
                </span>
              )}
              <div className="flex items-center gap-1">
                <span className="text-[10px]">88%</span>
                <Battery className="w-3.5 h-3.5 text-slate-300" />
              </div>
            </div>
          </div>
        )}

        {/* In-App Header Bar (when logged in) */}
        {isAuthenticated ? (
          <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <SchoolLogo size="sm" />
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold text-white tracking-tight">{currentUser.full_name}</h2>
                  <span className="text-xs">{currentUser.avatar_emoji}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {isSw ? currentUser.associated_info_sw : currentUser.associated_info_en}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* In-App Theme & Style Switcher Button */}
              <button
                id="device-frame-theme-btn"
                onClick={onOpenThemeModal}
                className="p-1.5 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-slate-800 transition-colors flex items-center gap-1 border border-amber-500/30 text-xs shadow-sm"
                title={isSw ? 'Badili Mwonekano & Fonti' : 'Theme & Display Settings'}
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline text-[10px]">{isSw ? 'Mtindo' : 'Theme'}</span>
              </button>

              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  userRole === 'admin'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : userRole === 'teacher'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {userRole}
              </span>

              {/* Log Out Button inside App */}
              <button
                onClick={handleLogout}
                className="p-1 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                title={isSw ? 'Toka kwenye mfumo' : 'Log out'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Header when on login screen */
          <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>{isSw ? 'Mlango wa Kuingia Shuleni' : 'School Auth Portal'}</span>
            </span>
            <span className="text-[10px] text-amber-400 font-mono">v2.4 Android</span>
          </div>
        )}

        {/* Animated Sliding Motto Bar on Mobile Device */}
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-amber-950/70 border-b border-amber-500/25 px-3 py-1 flex items-center overflow-hidden">
          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider mr-2 flex-shrink-0">
            MOTTO
          </span>
          <div className="overflow-hidden whitespace-nowrap flex-1">
            <div className="animate-marquee-mobile inline-flex text-[10px] font-bold text-amber-300 uppercase tracking-wide">
              <span className="mr-8 flex items-center gap-2">
                <span>⭐ QUALITY EDUCATION, ETHICS AND VALUES ⭐</span>
                <span className="text-amber-500/50">•</span>
                <span className="text-amber-200">{isSw ? 'ELIMU BORA, MAADILI NA MISINGI' : 'TOP STARS MOROGORO'}</span>
              </span>
              <span className="mr-8 flex items-center gap-2">
                <span>⭐ QUALITY EDUCATION, ETHICS AND VALUES ⭐</span>
                <span className="text-amber-500/50">•</span>
                <span className="text-amber-200">{isSw ? 'ELIMU BORA, MAADILI NA MISINGI' : 'TOP STARS MOROGORO'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Offline Notification Alert banner */}
        {!isOnline && (
          <div className="bg-amber-950/80 border-b border-amber-500/50 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span className="text-[11px]">
                {isSw
                  ? 'Uko Nje ya Mtandao: Data zote zinahifadhiwa kwenye SQLite/Room DB ya simu yako.'
                  : 'Offline Mode: Changes safely saved to local Android Room DB.'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">
              WorkManager Sync Ready
            </span>
          </div>
        )}

        {/* Scrollable Screen Content */}
        <div className="p-3.5 sm:p-5 max-h-[720px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          {!isAuthenticated ? (
            <LoginScreen
              language={language}
              onLoginSuccess={handleLoginSuccess}
              selectedRoleSuggestion={userRole}
            />
          ) : (
            <>
              {userRole === 'admin' && (
                <AdminDashboard
                  language={language}
                  onSendSms={onSendSms}
                  isOnline={isOnline}
                  documents={documents}
                  onAddDocument={handleAddDocument}
                  onUpdateDocumentStatus={handleUpdateDocumentStatus}
                  linkedParents={linkedParents}
                  onOpenDirectSmsModal={onOpenDirectSmsModal}
                  onOpenThemeModal={onOpenThemeModal}
                  directMessages={directMessages}
                  examTimetables={examTimetables}
                  onDispatchExamTimetable={handleDispatchExamTimetable}
                />
              )}
              {userRole === 'teacher' && (
                <TeacherDashboard
                  language={language}
                  isOnline={isOnline}
                  onRecordLocalChange={onRecordLocalChange}
                  documents={documents}
                  onAddDocument={handleAddDocument}
                  onOpenThemeModal={onOpenThemeModal}
                  examTimetables={examTimetables}
                  examResults={examResults}
                  onUpdateExamResult={setExamResults}
                  resultComments={resultComments}
                  onReplyResultComment={handleReplyResultComment}
                />
              )}
              {userRole === 'parent' && (
                <ParentDashboard
                  language={language}
                  linkedParents={linkedParents}
                  directMessages={directMessages}
                  onOpenRegisterModal={onOpenRegisterModal}
                  onOpenThemeModal={onOpenThemeModal}
                  onMarkMessageAsRead={onMarkMessageAsRead}
                  onReplyToAdmin={onReplyToAdmin}
                  examTimetables={examTimetables}
                  examResults={examResults}
                  resultComments={resultComments}
                  onAddResultComment={handleAddResultComment}
                />
              )}
            </>
          )}
        </div>

        {/* Android 3-Button or Gesture Pill Bar (Phone & Tablet) */}
        {deviceView !== 'desktop' && (
          <div className="bg-slate-950 py-2.5 px-8 flex items-center justify-center border-t border-slate-900 select-none">
            {/* Gesture Navigation Pill */}
            <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

