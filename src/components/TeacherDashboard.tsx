import React, { useState } from 'react';
import { STUDENTS, SUBJECTS, CLASSES, NECTA_GRADING_SCALE, calculateNectaGrade, INITIAL_ATTENDANCE, INITIAL_EXAM_RESULTS, INITIAL_RESULT_COMMENTS, SCHOOL_INFO } from '../data/mockData';
import { Language, AttendanceStatus, AttendanceRecord, AcademicDocument, ExamTimetable, ExamResult, ResultTeacherComment, Student } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { SendDocumentModal } from './SendDocumentModal';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { ExamTimetableCard } from './ExamTimetableCard';
import { PrintReportCardModal } from './PrintReportCardModal';
import {
  ClipboardCheck,
  Award,
  Calendar,
  Check,
  X,
  Clock,
  AlertCircle,
  Save,
  WifiOff,
  CheckCircle2,
  UserCheck,
  BookOpen,
  FileText,
  Send,
  Inbox,
  FileCheck,
  Eye,
  Download,
  PlusCircle,
  Paperclip,
  CheckCircle,
  Palette,
  Printer,
  MessageCircle,
  MessageSquare,
  Reply,
  Filter,
  Search,
  ChevronDown,
  User,
} from 'lucide-react';

interface TeacherDashboardProps {
  language: Language;
  isOnline: boolean;
  onRecordLocalChange: (entity: string, action: 'INSERT' | 'UPDATE', details: string) => void;
  documents?: AcademicDocument[];
  onAddDocument?: (doc: AcademicDocument) => void;
  onOpenThemeModal?: () => void;
  examTimetables?: ExamTimetable[];
  examResults?: ExamResult[];
  onUpdateExamResult?: (results: ExamResult[]) => void;
  resultComments?: ResultTeacherComment[];
  onReplyResultComment?: (commentId: string, replyText: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  language,
  isOnline,
  onRecordLocalChange,
  documents = [],
  onAddDocument,
  onOpenThemeModal,
  examTimetables = [],
  examResults = INITIAL_EXAM_RESULTS,
  onUpdateExamResult,
  resultComments = INITIAL_RESULT_COMMENTS,
  onReplyResultComment,
}) => {
  const isSw = language === 'sw';
  const [activeTeacherTab, setActiveTeacherTab] = useState<'attendance' | 'marks' | 'exams-docs' | 'timetable'>('attendance');

  // Sub-tabs inside Marks/Matokeo Tab:
  const [marksSubTab, setMarksSubTab] = useState<'entry' | 'results' | 'parent_comments'>('entry');
  const [selectedReportStudent, setSelectedReportStudent] = useState<Student | null>(null);
  const [activeReplyCommentId, setActiveReplyCommentId] = useState<string | null>(null);
  const [replyTextDraft, setReplyTextDraft] = useState<string>('');
  const [commentFilterStatus, setCommentFilterStatus] = useState<'all' | 'pending_reply' | 'replied'>('all');
  const [resultsSearchQuery, setResultsSearchQuery] = useState<string>('');

  // Exam & Document Dispatch State
  const [showSendModal, setShowSendModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState<AcademicDocument | null>(null);
  const [docsFilter, setDocsFilter] = useState<'all' | 'from_admin' | 'my_submissions'>('all');
  const [docSearchQuery, setDocSearchQuery] = useState('');

  // Attendance State for Class Standard IV A
  const std4Students = STUDENTS.filter((s) => s.class_id === 'cls-std4');
  const [attendanceDate, setAttendanceDate] = useState('2026-09-15');
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AttendanceStatus>>({
    'std-001': 'present',
    'std-002': 'present',
  });
  const [attendanceSaveMessage, setAttendanceSaveMessage] = useState<string | null>(null);

  // Marks Entry State
  const [selectedSubject, setSelectedSubject] = useState('sub-his'); // Hisabati by default
  const [marksState, setMarksState] = useState<Record<string, number>>({
    'std-001': 88,
    'std-002': 74,
  });
  const [marksSaveMessage, setMarksSaveMessage] = useState<string | null>(null);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = () => {
    onRecordLocalChange(
      'attendances',
      'INSERT',
      `Mahudhurio ya Darasa la IV (${attendanceDate}) yamehifadhiwa ${isOnline ? 'kwenye Seva' : 'ndani ya simu (Room DB)'}`
    );
    setAttendanceSaveMessage(
      isSw
        ? isOnline
          ? '✓ Mahudhurio yamerekodiwa na kulandanishwa na Seva Kuu!'
          : '✓ Mahudhurio yamehifadhiwa kwenye Simu (Room DB). Yatasawazishwa mtandao ukirudi.'
        : isOnline
        ? '✓ Attendance recorded and synchronized to Cloud Backend!'
        : '✓ Saved to local Room DB. Will auto-sync when network returns.'
    );
    setTimeout(() => setAttendanceSaveMessage(null), 3500);
  };

  const handleMarkChange = (studentId: string, val: string) => {
    const num = Math.min(100, Math.max(0, parseInt(val) || 0));
    setMarksState((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleSaveMarks = () => {
    const subjectObj = SUBJECTS.find((s) => s.id === selectedSubject);
    const subName = isSw ? subjectObj?.subject_name_sw : subjectObj?.subject_name_en;
    onRecordLocalChange(
      'exam_results',
      'UPDATE',
      `Alama za somo la ${subName} zimehifadhiwa ${isOnline ? 'mtandaoni' : 'kwenye simu (Offline Cache)'}`
    );
    setMarksSaveMessage(
      isSw
        ? isOnline
          ? `✓ Alama za somo la ${subName} zimehifadhiwa kwenye Seva Kuu!`
          : `✓ Alama zimehifadhiwa ndani ya simu (Room DB Offline).`
        : isOnline
        ? `✓ ${subName} marks successfully committed to Cloud Database!`
        : `✓ Marks safely saved in local SQLite storage.`
    );
    setTimeout(() => setMarksSaveMessage(null), 3500);
  };

  return (
    <div className="space-y-4 text-slate-100 pb-16">
      {/* Teacher Profile Card */}
      <div className="bg-gradient-to-r from-blue-900/30 via-slate-800 to-slate-900 border border-blue-500/30 rounded-xl p-3 sm:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300 font-bold text-sm">
              RM
            </div>
            <div>
              <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                {isSw ? 'Mwalimu wa Darasa' : 'Class Teacher Portal'}
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">Mwl. Rehema Msangi</h2>
              <p className="text-xs text-slate-300">
                Standard IV A • {isSw ? 'Masomo: Maarifa ya Jamii & Kiingereza' : 'Social Studies & English'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onOpenThemeModal && (
              <button
                id="teacher-theme-btn"
                onClick={onOpenThemeModal}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-750 border border-amber-500/40 text-amber-300 flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
                title={isSw ? 'Badili Mwonekano & Fonti' : 'Change Theme & Font'}
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSw ? 'Mwonekano' : 'Theme'}</span>
              </button>
            )}
            <SchoolLogo size="xs" />
            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-slate-300">Top Stars Morogoro</span>
              <p className="text-[10px] text-slate-400">Term 1, 2026</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Sub-Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold">
        <button
          id="teacher-tab-attendance"
          onClick={() => setActiveTeacherTab('attendance')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTeacherTab === 'attendance'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>{isSw ? 'Mahudhurio' : 'Roll Call'}</span>
        </button>
        <button
          id="teacher-tab-marks"
          onClick={() => setActiveTeacherTab('marks')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTeacherTab === 'marks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>{isSw ? 'Alama (NECTA)' : 'Marks Entry'}</span>
        </button>
        <button
          id="teacher-tab-exams-docs"
          onClick={() => setActiveTeacherTab('exams-docs')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors relative ${
            activeTeacherTab === 'exams-docs'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isSw ? 'Mitihani & Nyaraka' : 'Exams & Docs'}</span>
          {documents.filter((d) => d.recipient_role === 'all_teachers' || d.recipient_id === 'stf-03').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
        </button>
        <button
          id="teacher-tab-timetable"
          onClick={() => setActiveTeacherTab('timetable')}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            activeTeacherTab === 'timetable'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{isSw ? 'Ratiba' : 'Timetable'}</span>
        </button>
      </div>

      {/* TAB 1: DAILY ROLL CALL / MAHUDHURIO */}
      {activeTeacherTab === 'attendance' && (
        <div className="space-y-3">
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-blue-400" />
                  <span>{isSw ? 'Mahudhurio ya Kila Siku - Darasa la IV A' : 'Daily Roll Call - Standard IV A'}</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isSw
                    ? 'Chagua Yupo, Hayupo, Ruhusa au Mgonjwa. Wazazi hupokea SMS mtoto akipatikana hayupo.'
                    : 'Mark Present, Absent, Excused, or Sick. Absent alerts trigger SMS notification.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Offline notification banner if offline */}
            {!isOnline && (
              <div className="bg-amber-950/50 border border-amber-500/40 rounded-lg p-2 flex items-center gap-2 text-xs text-amber-300">
                <WifiOff className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>
                  {isSw
                    ? 'Hali ya Bila Mtandao (Offline): Mahudhurio yanahifadhiwa kwenye simu (Room DB). Utakapounganishwa na mtandao yatasawazishwa kiotomatiki.'
                    : 'Offline Mode: Roll call will be stored in Room SQLite DB and synced when connectivity is restored.'}
                </span>
              </div>
            )}

            {/* Student Attendance List */}
            <div className="space-y-2">
              {std4Students.map((std) => {
                const currentStatus = attendanceRecords[std.id] || 'present';
                return (
                  <div
                    key={std.id}
                    className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-amber-400">
                        {std.first_name[0]}
                        {std.last_name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{std.first_name} {std.last_name}</span>
                          <span className="text-[10px] text-slate-400">({std.gender === 'M' ? (isSw ? 'Mvulana' : 'Boy') : (isSw ? 'Msichana' : 'Girl')})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2">
                          <span className="font-mono text-slate-500">{std.admission_number}</span>
                          <span>•</span>
                          <span>{std.residence_area}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="grid grid-cols-4 gap-1 sm:w-auto">
                      <button
                        onClick={() => handleStatusChange(std.id, 'present')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isSw ? 'Yupo' : 'Present'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'absent')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          currentStatus === 'absent'
                            ? 'bg-rose-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isSw ? 'Hayupo' : 'Absent'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'excused')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          currentStatus === 'excused'
                            ? 'bg-amber-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isSw ? 'Ruhusa' : 'Excused'}
                      </button>
                      <button
                        onClick={() => handleStatusChange(std.id, 'sick')}
                        className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                          currentStatus === 'sick'
                            ? 'bg-purple-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {isSw ? 'Mgonjwa' : 'Sick'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {isSw ? 'Waliohudhuria: 100%' : 'Present Rate: 100%'}
              </span>
              <button
                id="save-attendance-btn"
                onClick={handleSaveAttendance}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSw ? 'Hifadhi Mahudhurio' : 'Save Attendance'}</span>
              </button>
            </div>

            {attendanceSaveMessage && (
              <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{attendanceSaveMessage}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MARKS ENTRY, RESULTS INSPECTION & PARENT FEEDBACK */}
      {activeTeacherTab === 'marks' && (
        <div className="space-y-3">
          {/* Sub-Tabs Switcher for Marks Module */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-1.5 flex items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-1 w-full sm:w-auto">
              <button
                id="btn-subtab-marks-entry"
                onClick={() => setMarksSubTab('entry')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  marksSubTab === 'entry'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{isSw ? 'Kuingiza Alama' : 'Enter Marks'}</span>
              </button>

              <button
                id="btn-subtab-marks-results"
                onClick={() => setMarksSubTab('results')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all ${
                  marksSubTab === 'results'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{isSw ? 'Matokeo ya Darasa' : 'Class Results & Cards'}</span>
              </button>

              <button
                id="btn-subtab-marks-comments"
                onClick={() => setMarksSubTab('parent_comments')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all relative ${
                  marksSubTab === 'parent_comments'
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{isSw ? 'Maoni ya Wazazi' : 'Parent Comments'}</span>
                {resultComments.filter((c) => c.status === 'pending_reply').length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-mono font-bold animate-pulse">
                    {resultComments.filter((c) => c.status === 'pending_reply').length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* SUB-VIEW 1: MARKS ENTRY */}
          {marksSubTab === 'entry' && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>{isSw ? 'Kuingiza Alama za Mitihani (NECTA Grading)' : 'Exam Marks & NECTA Grading'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isSw
                      ? 'Weka alama (0-100). Mfumo unakokotoa Daraja la NECTA (A, B, C, D, F) na maoni kiotomatiki.'
                      : 'Enter marks (0-100). Automatically calculates NECTA grades (A, B, C, D, F) and remarks.'}
                  </p>
                </div>

                {/* Subject Selector */}
                <div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-amber-400 font-semibold focus:outline-none focus:border-amber-400"
                  >
                    {SUBJECTS.filter((s) => s.level === 'primary').map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {isSw ? sub.subject_name_sw : sub.subject_name_en} ({sub.subject_code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* NECTA Reference Legend */}
              <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {isSw ? 'Kiwango cha Alama za NECTA (Primary Scale)' : 'NECTA Primary Grading Scale'}
                </span>
                <div className="grid grid-cols-5 gap-1 text-center text-[10px]">
                  <div className="bg-emerald-950/60 border border-emerald-500/30 p-1 rounded">
                    <span className="font-bold text-emerald-400">A (81-100)</span>
                    <p className="text-slate-400 text-[9px]">{isSw ? 'Bora Sana' : 'Excellent'}</p>
                  </div>
                  <div className="bg-blue-950/60 border border-blue-500/30 p-1 rounded">
                    <span className="font-bold text-blue-400">B (61-80)</span>
                    <p className="text-slate-400 text-[9px]">{isSw ? 'Vizuri' : 'Very Good'}</p>
                  </div>
                  <div className="bg-amber-950/60 border border-amber-500/30 p-1 rounded">
                    <span className="font-bold text-amber-400">C (41-60)</span>
                    <p className="text-slate-400 text-[9px]">{isSw ? 'Wastani' : 'Average'}</p>
                  </div>
                  <div className="bg-orange-950/60 border border-orange-500/30 p-1 rounded">
                    <span className="font-bold text-orange-400">D (21-40)</span>
                    <p className="text-slate-400 text-[9px]">{isSw ? 'Hafifu' : 'Weak'}</p>
                  </div>
                  <div className="bg-rose-950/60 border border-rose-500/30 p-1 rounded">
                    <span className="font-bold text-rose-400">F (0-20)</span>
                    <p className="text-slate-400 text-[9px]">{isSw ? 'Dhaifu' : 'Fail'}</p>
                  </div>
                </div>
              </div>

              {/* Marks input list */}
              <div className="space-y-2">
                {std4Students.map((std) => {
                  const mark = marksState[std.id] ?? 80;
                  const grading = calculateNectaGrade(mark);
                  return (
                    <div
                      key={std.id}
                      className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">
                          {std.first_name} {std.last_name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{std.admission_number}</div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[11px] text-slate-400">{isSw ? 'Alama:' : 'Marks:'}</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={mark}
                            onChange={(e) => handleMarkChange(std.id, e.target.value)}
                            className="w-16 bg-slate-800 border border-slate-700 rounded-lg p-1.5 text-xs text-center font-bold text-white focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        {/* Auto Computed Grade Badge */}
                        <div className="text-center min-w-[55px]">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-xs font-black border ${
                              grading.grade === 'A'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                : grading.grade === 'B'
                                ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                : grading.grade === 'C'
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : grading.grade === 'D'
                                ? 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {grading.grade}
                          </span>
                          <div className="text-[9px] text-slate-400 mt-0.5 font-medium">
                            {isSw ? grading.remark_sw : grading.remark_en}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Save Marks Button */}
              <div className="flex justify-end pt-2">
                <button
                  id="save-marks-btn"
                  onClick={handleSaveMarks}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSw ? 'Hifadhi Alama Zote' : 'Commit Marks'}</span>
                </button>
              </div>

              {marksSaveMessage && (
                <div className="p-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{marksSaveMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* SUB-VIEW 2: CLASS RESULTS INSPECTION & REPORT CARDS */}
          {marksSubTab === 'results' && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>{isSw ? 'Matokeo ya Mitihani & Ripoti za NECTA (Darasa la IV A)' : 'Class Results & NECTA Reports'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isSw
                      ? 'Angalia matokeo ya wanafunzi, wastani wa darasa, na chapisha kadi za maendeleo.'
                      : 'Review student performance, ranks, and print official report cards.'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      placeholder={isSw ? 'Tafuta mwanafunzi...' : 'Search student...'}
                      value={resultsSearchQuery}
                      onChange={(e) => setResultsSearchQuery(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-44"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Class Analytics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/70 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{isSw ? 'Wanafunzi' : 'Students'}</span>
                  <span className="text-sm font-black text-white">{std4Students.length}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/70 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{isSw ? 'Wastani wa Darasa' : 'Class Average'}</span>
                  <span className="text-sm font-black text-blue-400">79.2% (B)</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/70 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{isSw ? 'Ufaulu (Pass Rate)' : 'Pass Rate'}</span>
                  <span className="text-sm font-black text-emerald-400">100%</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/70 text-center">
                  <span className="text-[10px] text-slate-400 block uppercase">{isSw ? 'Nafasi ya Juu' : 'Top Score'}</span>
                  <span className="text-sm font-black text-amber-400">88% (A)</span>
                </div>
              </div>

              {/* Student Results Cards */}
              <div className="space-y-3">
                {std4Students
                  .filter((std) =>
                    `${std.first_name} ${std.last_name}`.toLowerCase().includes(resultsSearchQuery.toLowerCase())
                  )
                  .map((student, idx) => {
                    const studentRes = examResults.filter((r) => r.student_id === student.id);
                    const avg = studentRes.length
                      ? Math.round(studentRes.reduce((acc, r) => acc + r.marks, 0) / studentRes.length)
                      : 80;
                    const grade = avg >= 81 ? 'A' : avg >= 61 ? 'B' : avg >= 41 ? 'C' : 'D';

                    return (
                      <div
                        key={student.id}
                        className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 space-y-3 hover:border-slate-600 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                              #{idx + 1}
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-white">
                                {student.first_name} {student.last_name}
                              </h4>
                              <p className="text-[10px] text-slate-400">
                                {student.admission_number} • {student.class_name} • Mzazi: {student.parent_name}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block">{isSw ? 'Wastani' : 'Average'}</span>
                              <span className="text-xs font-bold text-emerald-400">{avg}% ({grade})</span>
                            </div>

                            <button
                              onClick={() => setSelectedReportStudent(student)}
                              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-400" />
                              <span>{isSw ? 'Kadi ya Ripoti' : 'Report Card'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Subject Chips */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {studentRes.map((r) => (
                            <div
                              key={r.id}
                              className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs"
                            >
                              <span className="font-semibold text-slate-300 text-[11px] truncate max-w-[110px]">
                                {r.subject_name}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="font-bold text-white text-xs">{r.marks}%</span>
                                <span className="text-[10px] font-black text-amber-400 px-1 py-0.2 rounded bg-slate-900 border border-slate-800">
                                  {r.grade}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: PARENT COMMENTS & DIRECT TEACHER FEEDBACK */}
          {marksSubTab === 'parent_comments' && (
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-amber-400" />
                    <span>{isSw ? 'Maoni ya Wazazi Kuhusu Matokeo (Direct Feedback)' : 'Parent Comments on Exam Results'}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isSw
                      ? 'Wazazi wanatuma maswali na maoni kuhusu matokeo. Walimu mnajibu moja kwa moja hapa.'
                      : 'Parents inquire directly regarding student marks. Reply to clarify and provide academic guidance.'}
                  </p>
                </div>

                {/* Filter Status */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => setCommentFilterStatus('all')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      commentFilterStatus === 'all'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSw ? 'Yote' : 'All'} ({resultComments.length})
                  </button>
                  <button
                    onClick={() => setCommentFilterStatus('pending_reply')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      commentFilterStatus === 'pending_reply'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSw ? 'Zinazosubiri Jibu' : 'Pending'} ({resultComments.filter((c) => c.status === 'pending_reply').length})
                  </button>
                  <button
                    onClick={() => setCommentFilterStatus('replied')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      commentFilterStatus === 'replied'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {isSw ? 'Zilizojibiwa' : 'Replied'} ({resultComments.filter((c) => c.status === 'replied').length})
                  </button>
                </div>
              </div>

              {/* Comments Stream */}
              <div className="space-y-3">
                {resultComments
                  .filter((c) => (commentFilterStatus === 'all' ? true : c.status === commentFilterStatus))
                  .map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3.5 space-y-3 shadow-md"
                    >
                      {/* Meta header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-300 text-xs">{comment.student_name}</span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="text-slate-400 text-xs">{comment.class_name}</span>
                          <span className="text-[10px] text-slate-500">•</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            {comment.subject_name}
                          </span>
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
                              ? isSw ? '✓ Mwalimu Amejibu' : '✓ Replied'
                              : isSw ? '⏳ Inasubiri Jibu' : '⏳ Pending Reply'}
                          </span>
                        </div>
                      </div>

                      {/* Parent details */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-blue-400" />
                          <span>{isSw ? 'Mzazi:' : 'Parent:'}</span>
                          <strong className="text-slate-200">{comment.parent_name}</strong>
                          <span className="text-slate-500">({comment.parent_phone})</span>
                        </div>
                        <div className="text-[10px] text-amber-400/90 font-mono">
                          {comment.exam_name}
                        </div>
                      </div>

                      {/* Parent message box */}
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                          {isSw ? 'Maoni ya Mzazi:' : 'Parent Inquiry:'}
                        </span>
                        {comment.comment_text}
                      </div>

                      {/* Existing reply if present */}
                      {comment.reply_text && (
                        <div className="ml-2 sm:ml-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1.5 animate-in fade-in">
                          <div className="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                            <span className="flex items-center gap-1.5">
                              <Reply className="w-3.5 h-3.5 text-emerald-400 rotate-180" />
                              <span>{isSw ? 'Jibu Rasmi la Mwalimu' : 'Teacher Reply'}: {comment.teacher_name}</span>
                            </span>
                            {comment.reply_at && (
                              <span className="text-[10px] font-normal text-emerald-400/80">{comment.reply_at}</span>
                            )}
                          </div>
                          <p className="text-slate-200 text-xs leading-relaxed italic">
                            &quot;{comment.reply_text}&quot;
                          </p>
                        </div>
                      )}

                      {/* Reply Box / Trigger */}
                      <div className="pt-1 flex flex-col gap-2">
                        {activeReplyCommentId === comment.id ? (
                          <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-xl space-y-2.5 animate-in fade-in">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <Reply className="w-3.5 h-3.5 rotate-180" />
                                <span>{isSw ? `Andika Jibu kwa Mzazi: ${comment.parent_name}` : `Reply to Parent: ${comment.parent_name}`}</span>
                              </span>
                              <button
                                onClick={() => {
                                  setActiveReplyCommentId(null);
                                  setReplyTextDraft('');
                                }}
                                className="text-xs text-slate-400 hover:text-white"
                              >
                                {isSw ? 'Ghairi' : 'Cancel'}
                              </button>
                            </div>

                            {/* Quick prompts for teacher */}
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 block">{isSw ? 'Majibu ya Haraka (Quick Template):' : 'Quick Templates:'}</span>
                              <div className="flex flex-wrap gap-1">
                                {[
                                  isSw
                                    ? 'Tumepokea maoni yako. Baraka anaendelea kupewa mazoezi ya ziada kila Jumanne na Alhamisi.'
                                    : 'Inquiry received. Extra remedial sessions are scheduled every Tue & Thu.',
                                  isSw
                                    ? 'Nidhamu yake darasani ni ya mfano bora, aongeze tu kasi ya kujibu maswali.'
                                    : 'Exemplary classroom discipline, we will guide on time management during tests.',
                                  isSw
                                    ? 'Asante sana mzazi kwa ushirikiano. Karibu shuleni kwa mazungumzo zaidi na mwalimu.'
                                    : 'Thank you for your active follow-up. Feel welcome to visit school for further dialogue.',
                                ].map((prompt, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => setReplyTextDraft(prompt)}
                                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-left"
                                  >
                                    {prompt.slice(0, 48)}...
                                  </button>
                                ))}
                              </div>
                            </div>

                            <textarea
                              rows={3}
                              value={replyTextDraft}
                              onChange={(e) => setReplyTextDraft(e.target.value)}
                              placeholder={
                                isSw
                                  ? 'Andika jibu lako rasmi kwa mzazi hapa...'
                                  : 'Type your official teacher response to the parent...'
                              }
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                            />

                            <div className="flex justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveReplyCommentId(null);
                                  setReplyTextDraft('');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                              >
                                {isSw ? 'Funga' : 'Close'}
                              </button>
                              <button
                                type="button"
                                disabled={!replyTextDraft.trim()}
                                onClick={() => {
                                  if (onReplyResultComment && replyTextDraft.trim()) {
                                    onReplyResultComment(comment.id, replyTextDraft.trim());
                                    setActiveReplyCommentId(null);
                                    setReplyTextDraft('');
                                  }
                                }}
                                className="px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 disabled:opacity-50"
                              >
                                <Send className="w-3.5 h-3.5" />
                                <span>{isSw ? 'Tuma Jibu kwa Mzazi' : 'Send Reply to Parent'}</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                setActiveReplyCommentId(comment.id);
                                setReplyTextDraft(comment.reply_text || '');
                              }}
                              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-xs font-semibold text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                            >
                              <Reply className="w-3 h-3 text-amber-400 rotate-180" />
                              <span>{comment.reply_text ? (isSw ? 'Badili Jibu Lako' : 'Update Reply') : (isSw ? 'Jibu Mzazi Hapa' : 'Reply to Parent')}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TIMETABLE & RATIO */}
      {activeTeacherTab === 'timetable' && (
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 sm:p-4 space-y-3">
          <div className="border-b border-slate-700 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>{isSw ? 'Ratiba ya Kufundisha ya Wiki (Standard IV A)' : 'Weekly Teaching Schedule'}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isSw ? 'Saa 2:00 Asubuhi hadi Saa 8:30 Mchana' : '08:00 AM - 02:30 PM Morogoro School Hours'}
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">08:00 - 08:40 AM • {isSw ? 'Hisabati' : 'Mathematics'}</div>
                <div className="text-[10px] text-slate-400">Standard IV A • Mwl. Josephat Kavishe</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                {isSw ? 'Imekamilika' : 'Completed'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-blue-500/40 bg-blue-950/20 flex items-center justify-between">
              <div>
                <div className="font-bold text-blue-300">08:45 - 09:25 AM • {isSw ? 'Kiingereza' : 'English Language'}</div>
                <div className="text-[10px] text-slate-400">Standard IV A • Mwl. Rehema Msangi</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold animate-pulse">
                {isSw ? 'Inaendelea Sasa' : 'Current Lesson'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">09:30 - 10:10 AM • {isSw ? 'Sayansi na Teknolojia' : 'Science & Tech'}</div>
                <div className="text-[10px] text-slate-400">Standard IV A • Mwl. Emmanuel Mtei</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-medium">
                {isSw ? 'Inayofuata' : 'Upcoming'}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-500/20 text-center text-amber-400 font-semibold text-[11px]">
              ☕ 10:10 - 10:40 AM: {isSw ? 'Mapumziko na Chai ya Asubuhi' : 'Morning Tea & Break'}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MITIHANI & NYARAKA (EXAMS & DOCUMENTS DISPATCH) */}
      {activeTeacherTab === 'exams-docs' && (
        <div className="space-y-3.5">
          {/* Action Header Card */}
          <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 rounded-xl p-3.5 sm:p-4 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    {isSw ? 'Ubadilishanaji wa Mitihani & Nyaraka (Mwalimu ⇄ Mkuu wa Shule)' : 'Exams & Academic Documents Exchange'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isSw
                      ? 'Tuma mitihani na marking schemes kwa Mkuu wa Shule kwa ajili ya uhakiki na idhini, na upokee miongozo na mitihani kutoka utawala.'
                      : 'Submit exam drafts & marking schemes for moderation, and access circulars & papers sent by Admin.'}
                  </p>
                </div>
              </div>

              <button
                id="btn-teacher-send-exam"
                onClick={() => setShowSendModal(true)}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-lg text-xs flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 whitespace-nowrap"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isSw ? 'Tuma Mtihani / Hati Mpya' : 'Submit Exam / Document'}</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800 text-center">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Niliyotuma' : 'Submitted'}</span>
                <span className="text-sm font-bold text-amber-400">
                  {documents.filter((d) => d.sender_id === 'stf-03').length}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Yaliyoidhinishwa' : 'Approved'}</span>
                <span className="text-sm font-bold text-emerald-400">
                  {documents.filter((d) => d.sender_id === 'stf-03' && d.status === 'approved').length}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">{isSw ? 'Kutoka kwa Admin' : 'From Admin'}</span>
                <span className="text-sm font-bold text-blue-400">
                  {documents.filter((d) => d.sender_role === 'admin' && (d.recipient_role === 'all_teachers' || d.recipient_id === 'stf-03')).length}
                </span>
              </div>
            </div>
          </div>

          {/* Filter Pills and Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setDocsFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  docsFilter === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {isSw ? 'Nyaraka Zote' : 'All Documents'} ({documents.length})
              </button>
              <button
                onClick={() => setDocsFilter('from_admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  docsFilter === 'from_admin'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>{isSw ? 'Kutoka kwa Mkuu wa Shule' : 'From Admin'}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-200">
                  {documents.filter((d) => d.sender_role === 'admin' && (d.recipient_role === 'all_teachers' || d.recipient_id === 'stf-03')).length}
                </span>
              </button>
              <button
                onClick={() => setDocsFilter('my_submissions')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  docsFilter === 'my_submissions'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSw ? 'Mitihani Niliyotuma' : 'My Submissions'}</span>
                <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-slate-800 text-slate-200">
                  {documents.filter((d) => d.sender_id === 'stf-03').length}
                </span>
              </button>
            </div>

            <input
              type="text"
              placeholder={isSw ? 'Tafuta mtihani au hati...' : 'Search exams/documents...'}
              value={docSearchQuery}
              onChange={(e) => setDocSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 w-full sm:w-48"
            />
          </div>

          {/* Documents List */}
          <div className="space-y-2.5">
            {documents
              .filter((doc) => {
                if (docsFilter === 'from_admin') {
                  return doc.sender_role === 'admin' && (doc.recipient_role === 'all_teachers' || doc.recipient_id === 'stf-03');
                }
                if (docsFilter === 'my_submissions') {
                  return doc.sender_id === 'stf-03';
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
                const isFromAdmin = doc.sender_role === 'admin';
                const isMySubmission = doc.sender_id === 'stf-03';

                return (
                  <div
                    key={doc.id}
                    className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 transition-all space-y-2"
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

                        {isFromAdmin ? (
                          <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-400 text-[10px] font-semibold flex items-center gap-1">
                            <Inbox className="w-3 h-3" />
                            <span>{isSw ? 'Kutoka: Mkuu wa Shule' : 'From: Headteacher'}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>{isSw ? `Kutoka: ${doc.sender_name}` : `From: ${doc.sender_name}`}</span>
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

                    {/* Admin Moderation Status (if it was submitted by teacher) */}
                    {isMySubmission && (
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">
                            {isSw ? 'Hali ya Uhakiki:' : 'Moderation Status:'}
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
                              : isSw ? '⏳ Inakaguliwa na Mkuu wa Shule' : '⏳ Under Headteacher Review'}
                          </span>
                        </div>

                        {doc.admin_feedback && (
                          <div className="text-[11px] text-amber-300 italic sm:max-w-xs">
                            "{doc.admin_feedback}"
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                      <button
                        onClick={() => setPreviewDocument(doc)}
                        className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isSw ? 'Tazama Mtihani / Hati' : 'Preview Paper'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setPreviewDocument(doc);
                        }}
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

      {/* TAB 4: OFFICIAL EXAM TIMETABLES (Dispatched by Admin) */}
      {activeTeacherTab === 'timetable' && (
        <div className="space-y-3.5">
          <div className="bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/40 rounded-xl p-3.5 sm:p-4">
            <div className="flex items-start gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Calendar className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {isSw ? 'Ratiba Rasmi za Mitihani & Usimamizi' : 'Official Exam Timetables & Invigilation'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {isSw
                    ? 'Ratiba hizi zimetolewa rasmi na Mkuu wa Shule. Walimu wanatakiwa kuzingatia muda wa mitihani, kumbi na zamu za usimamizi.'
                    : 'Official examination timetables dispatched by Headteacher. Please adhere to scheduled slots, venues and invigilator duties.'}
                </p>
              </div>
            </div>
          </div>

          {/* Render Timetables sent to Teachers or Both */}
          <div className="space-y-3">
            {examTimetables
              .filter((tt) => tt.target_audience === 'teachers_only' || tt.target_audience === 'both')
              .map((timetable) => (
                <ExamTimetableCard
                  key={timetable.id}
                  timetable={timetable}
                  language={language}
                  userRole="teacher"
                />
              ))}

            {examTimetables.filter((tt) => tt.target_audience === 'teachers_only' || tt.target_audience === 'both').length === 0 && (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl">
                <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-semibold">
                  {isSw ? 'Hakuna ratiba mpya ya mtihani iliyotolewa kwa sasa.' : 'No exam timetables currently published.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal to Send Exam / Document to Admin */}
      {showSendModal && (
        <SendDocumentModal
          language={language}
          senderRole="teacher"
          senderName="Mwl. Rehema Msangi"
          senderId="stf-03"
          onClose={() => setShowSendModal(false)}
          onSubmit={(newDoc) => {
            if (onAddDocument) {
              onAddDocument(newDoc);
            }
          }}
        />
      )}

      {/* Modal to Preview Exam Paper & Document */}
      {previewDocument && (
        <DocumentPreviewModal
          document={previewDocument}
          language={language}
          currentRole="teacher"
          onClose={() => setPreviewDocument(null)}
        />
      )}

      {/* Modal to Print / Save Student Report Card */}
      {selectedReportStudent && (
        <PrintReportCardModal
          student={selectedReportStudent}
          results={examResults.filter((r) => r.student_id === selectedReportStudent.id)}
          language={language}
          onClose={() => setSelectedReportStudent(null)}
        />
      )}
    </div>
  );
};

