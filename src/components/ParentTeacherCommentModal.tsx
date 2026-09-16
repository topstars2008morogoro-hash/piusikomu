import React, { useState } from 'react';
import { Language, ResultTeacherComment } from '../types';
import { STAFF, SUBJECTS } from '../data/mockData';
import { MessageSquare, Send, X, User, BookOpen, CheckCircle2, Sparkles } from 'lucide-react';

interface ParentTeacherCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
  className: string;
  parentName: string;
  parentPhone: string;
  parentId: string;
  examName?: string;
  defaultSubject?: string;
  defaultTeacherId?: string;
  language: Language;
  onSubmit: (comment: ResultTeacherComment) => void;
}

export const ParentTeacherCommentModal: React.FC<ParentTeacherCommentModalProps> = ({
  isOpen,
  onClose,
  studentName,
  studentId,
  className: studentClassName,
  parentName,
  parentPhone,
  parentId,
  examName = 'Mid-Term Examination 2026',
  defaultSubject = 'Ripoti Kamili ya Matokeo (General Performance)',
  defaultTeacherId,
  language,
  onSubmit,
}) => {
  const isSw = language === 'sw';

  // Teaching staff eligible for receiving comments
  const teachingStaff = STAFF.filter((s) => s.role === 'teacher' || s.role === 'academic_master' || s.role === 'headteacher');

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    defaultTeacherId || teachingStaff[1]?.id || teachingStaff[0]?.id || 'stf-03'
  );
  const [selectedSubject, setSelectedSubject] = useState<string>(defaultSubject);
  const [commentText, setCommentText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentTeacher = teachingStaff.find((s) => s.id === selectedTeacherId);

  const quickPrompts = isSw
    ? [
        'Hongera sana Mwalimu kwa matokeo mazuri ya mtoto wangu.',
        'Ningependa kujua jinsi ya kumsaidia mtoto kwenye mazoezi ya nyumbani.',
        'Je, kuna vitabu vya ziada au past papers unazoshauri tumtafutie?',
        'Tafadhali tuwekeeni mikakati ya kuongeza ufaulu katika masomo ya sayansi na hisabati.',
      ]
    : [
        'Thank you Teacher for the great exam performance of my child.',
        'How can we best support the student with homework and revision at home?',
        'Which additional reference books or past papers do you recommend?',
        'Please advise on strategies to boost performance in Mathematics & Science.',
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    const now = new Date();
    const timeFormatted = `${now.toISOString().split('T')[0]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newComment: ResultTeacherComment = {
      id: `comm-${Date.now()}`,
      student_id: studentId,
      student_name: studentName,
      class_name: studentClassName,
      parent_id: parentId,
      parent_name: parentName,
      parent_phone: parentPhone,
      teacher_id: selectedTeacherId,
      teacher_name: currentTeacher?.full_name || 'Mwalimu wa Somo',
      teacher_role_title: currentTeacher?.title_display || (isSw ? 'Mwalimu' : 'Teacher'),
      subject_name: selectedSubject,
      exam_name: examName,
      comment_text: commentText.trim(),
      created_at: timeFormatted,
      status: 'pending_reply',
    };

    setTimeout(() => {
      onSubmit(newComment);
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1200);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/70 via-indigo-900/60 to-slate-900 p-4 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <MessageSquare className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {isSw ? 'Toa Maoni / Wasiliana na Mwalimu' : 'Comment & Inquire with Teacher'}
              </h3>
              <p className="text-xs text-slate-300">
                {studentName} ({studentClassName}) • {examName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs flex-1">
          {successMessage ? (
            <div className="p-6 text-center space-y-3 bg-emerald-950/40 border border-emerald-500/50 rounded-xl animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">
                {isSw ? 'Maoni Yako Yametumwa Kikamilifu!' : 'Comment Successfully Dispatched!'}
              </h4>
              <p className="text-xs text-slate-300">
                {isSw
                  ? `Ujumbe wako umetumwa moja kwa moja kwa ${currentTeacher?.full_name}. Mwalimu atakujibu kwenye dawati hili na utapokea ujumbe.`
                  : `Your comment has been delivered directly to ${currentTeacher?.full_name}. You will be alerted once the teacher replies.`}
              </p>
            </div>
          ) : (
            <>
              {/* Teacher Selection */}
              <div>
                <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSw ? 'Chagua Mwalimu Unayetaka Kumuandikia:' : 'Select Teacher to Inquire / Comment:'}</span>
                </label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-amber-400 text-xs"
                >
                  {teachingStaff.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.full_name} — {teacher.title_display} ({teacher.specialization})
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject / Exam Scope */}
              <div>
                <label className="block font-bold text-slate-200 mb-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isSw ? 'Mada / Somo Husika la Matokeo:' : 'Subject / Assessment Scope:'}</span>
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-medium focus:outline-none focus:border-blue-400 text-xs"
                >
                  <option value="Ripoti Kamili ya Matokeo (General Performance)">
                    {isSw ? '📌 Ripoti Kamili ya Matokeo (General Performance)' : '📌 Overall Progress Report (General)'}
                  </option>
                  {SUBJECTS.map((sub) => (
                    <option key={sub.id} value={`${isSw ? sub.subject_name_sw : sub.subject_name_en} (${sub.subject_code})`}>
                      📖 {isSw ? sub.subject_name_sw : sub.subject_name_en} ({sub.subject_code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Prompt Suggestions */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSw ? 'Mifano ya maswali / maoni ya haraka (Bofya kuweka):' : 'Quick Prompt Suggestions (Click to insert):'}</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCommentText(prompt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] text-left transition-colors"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Textarea */}
              <div>
                <label className="block font-bold text-slate-200 mb-1">
                  {isSw ? 'Andika Maoni, Pongezi au Swali Lako:' : 'Type Your Comment, Commendation or Question:'}
                </label>
                <textarea
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    isSw
                      ? 'Andika maoni yako hapa kwa kina ili mwalimu aweze kukusaidia au kukupatia ushauri unaofaa...'
                      : 'Type your message to the teacher in detail...'
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Summary of sender */}
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[10px]">{isSw ? 'Mtumaji (Mzazi):' : 'Sender (Parent):'}</span>
                  <span className="font-bold text-slate-200">{parentName}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block text-[10px]">{isSw ? 'Simu ya Mawasiliano:' : 'Contact Phone:'}</span>
                  <span className="font-mono text-amber-300">{parentPhone}</span>
                </div>
              </div>
            </>
          )}

          {!successMessage && (
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                {isSw ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !commentText.trim()}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? '...' : isSw ? 'Tuma kwa Mwalimu Moja kwa Moja' : 'Send to Teacher Directly'}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
