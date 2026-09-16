import React, { useState } from 'react';
import {
  ExamTimetable,
  ExamScheduleSlot,
  TimetableTargetAudience,
  Language,
  LinkedParent,
} from '../types';
import { CLASSES, SUBJECTS, STAFF } from '../data/mockData';
import {
  X,
  Calendar,
  Send,
  Users,
  GraduationCap,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Smartphone,
  ShieldCheck,
  Building,
  Info,
} from 'lucide-react';

interface SendExamTimetableModalProps {
  language: Language;
  linkedParents: LinkedParent[];
  onClose: () => void;
  onDispatch: (
    timetable: ExamTimetable,
    customSmsMessage?: string
  ) => void;
}

export const SendExamTimetableModal: React.FC<SendExamTimetableModalProps> = ({
  language,
  linkedParents,
  onClose,
  onDispatch,
}) => {
  const isSw = language === 'sw';

  // Target audience: 'teachers_only' | 'parents_only' | 'both' (Exact User Request)
  const [targetAudience, setTargetAudience] = useState<TimetableTargetAudience>('both');

  // Scope: 'all' or specific class
  const [targetClassScope, setTargetClassScope] = useState<string>('all');

  // Exam Meta
  const [examTitle, setExamTitle] = useState(
    isSw
      ? 'Ratiba Rasmi ya Mitihani ya Nusu Muhula 2026'
      : 'Official Mid-Term Examination Timetable 2026'
  );
  const [examType, setExamType] = useState<ExamTimetable['exam_type']>('mid_term');
  const [startDate, setStartDate] = useState('2026-09-22');
  const [endDate, setEndDate] = useState('2026-09-26');
  const [instructionsSw, setInstructionsSw] = useState(
    'Wanafunzi wote wawahi kufika shuleni kabla ya saa 1:30 asubuhi. Kila mwanafunzi awe na sare kamili, rula, kalamu za bluu na vifaa vya hesabu. Hairuhusiwi kuingia na simu wala karatasi zisizo rasmi.'
  );
  const [instructionsEn, setInstructionsEn] = useState(
    'All pupils must arrive before 07:30 AM in complete uniform. Carry necessary stationery and geometry kits. Strictly no mobile phones or unverified papers.'
  );

  // Slots
  const [slots, setSlots] = useState<ExamScheduleSlot[]>([
    {
      id: 'slot-default-1',
      day_label_sw: 'Jumatatu, 22 Septemba 2026',
      day_label_en: 'Monday, 22 September 2026',
      date: '2026-09-22',
      time_slot: '08:00 AM - 10:00 AM',
      subject_name: 'Hisabati (Mathematics)',
      class_name: 'Madarasa Yote (All Classes)',
      supervisor_name: 'Mwl. Josephat Kavishe & Mwl. Rehema',
      room_or_hall: 'Ukumbi Mkuu & Madarasani',
      special_requirements: 'Vifaa vya jiometri na rula',
    },
    {
      id: 'slot-default-2',
      day_label_sw: 'Jumatatu, 22 Septemba 2026',
      day_label_en: 'Monday, 22 September 2026',
      date: '2026-09-22',
      time_slot: '10:45 AM - 12:45 PM',
      subject_name: 'Kiingereza (English Language)',
      class_name: 'Madarasa Yote (All Classes)',
      supervisor_name: 'Mwl. Grace Mollel & Mwl. Salum',
      room_or_hall: 'Ukumbi Mkuu & Madarasani',
      special_requirements: 'Kalamu ya bluu',
    },
    {
      id: 'slot-default-3',
      day_label_sw: 'Jumanne, 23 Septemba 2026',
      day_label_en: 'Tuesday, 23 September 2026',
      date: '2026-09-23',
      time_slot: '08:00 AM - 10:00 AM',
      subject_name: 'Sayansi na Teknolojia (Science & Tech)',
      class_name: 'Madarasa Yote (All Classes)',
      supervisor_name: 'Mwl. Emmanuel Mtei & Mwl. Fatma',
      room_or_hall: 'Ukumbi Mkuu & Madarasani',
      special_requirements: 'Penseli na rula',
    },
    {
      id: 'slot-default-4',
      day_label_sw: 'Jumanne, 23 Septemba 2026',
      day_label_en: 'Tuesday, 23 September 2026',
      date: '2026-09-23',
      time_slot: '10:45 AM - 12:45 PM',
      subject_name: 'Kiswahili',
      class_name: 'Madarasa Yote (All Classes)',
      supervisor_name: 'Mwl. Asha Ramadhani',
      room_or_hall: 'Ukumbi Mkuu & Madarasani',
      special_requirements: 'Kalamu ya wino',
    },
  ]);

  // New slot entry state
  const [newDayLabel, setNewDayLabel] = useState('Jumatano, 24 Septemba 2026');
  const [newDate, setNewDate] = useState('2026-09-24');
  const [newTime, setNewTime] = useState('08:00 AM - 10:00 AM');
  const [newSubject, setNewSubject] = useState('Maarifa ya Jamii (Social Studies)');
  const [newSupervisor, setNewSupervisor] = useState('Mwl. David Lyimo');
  const [showAddSlotForm, setShowAddSlotForm] = useState(false);

  // SMS custom text for parents
  const [customSms, setCustomSms] = useState(
    isSw
      ? 'Top Stars School: Ndugu Mzazi, Ratiba rasmi ya Mitihani ya Nusu Muhula 2026 imetolewa. Mitihani itaanza tarehe 22/09/2026 saa 2:00 asubuhi. Mwanafunzi awahi basi saa 12:45 asubuhi na awe na vifaa vyote vya kuandikia.'
      : 'Top Stars School: Dear Parent, The official 2026 Mid-Term Exam timetable has been released. Exams commence on 22/09/2026 at 08:00 AM. Ensure pupils arrive by 07:30 AM with all required stationary.'
  );

  // Calculate recipients count
  const matchingParents =
    targetClassScope === 'all'
      ? linkedParents
      : linkedParents.filter((p) => {
          const kidMatch = p.children?.some((c) =>
            c.class_name.toLowerCase().includes(targetClassScope.toLowerCase())
          );
          const directMatch = p.class_name.toLowerCase().includes(targetClassScope.toLowerCase());
          return kidMatch || directMatch;
        });

  const parentCount = matchingParents.length;
  const teacherCount = 14; // All teaching staff

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const slotItem: ExamScheduleSlot = {
      id: 'slot-' + Date.now(),
      day_label_sw: newDayLabel,
      day_label_en: newDayLabel,
      date: newDate,
      time_slot: newTime,
      subject_name: newSubject,
      class_name: targetClassScope === 'all' ? (isSw ? 'Madarasa Yote' : 'All Classes') : targetClassScope,
      supervisor_name: newSupervisor,
      room_or_hall: isSw ? 'Ukumbi Mkuu & Madarasani' : 'Main Hall & Classrooms',
      special_requirements: isSw ? 'Kalamu na rula' : 'Pen & ruler',
    };

    setSlots((prev) => [...prev, slotItem]);
    setShowAddSlotForm(false);
  };

  const handleRemoveSlot = (slotId: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== slotId));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTimetable: ExamTimetable = {
      id: 'tt-' + Date.now(),
      title: examTitle.trim(),
      exam_type: examType,
      term: 'Muhula wa 1, 2026',
      academic_year: '2026',
      target_audience: targetAudience,
      target_classes: targetClassScope === 'all' ? ['all'] : [targetClassScope],
      start_date: startDate,
      end_date: endDate,
      instructions_sw: instructionsSw.trim(),
      instructions_en: instructionsEn.trim(),
      slots,
      created_at: new Date().toLocaleString([], {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      dispatched_by: 'Mwl. David Lyimo (Mkuu wa Shule)',
      status: 'dispatched',
      sms_message_preview: targetAudience !== 'teachers_only' ? customSms : undefined,
      stats: {
        teachers_notified: targetAudience === 'parents_only' ? 0 : teacherCount,
        parents_notified_sms: targetAudience === 'teachers_only' ? 0 : parentCount,
      },
    };

    onDispatch(newTimetable, customSms);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl max-h-[92vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Top Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-950 border-b border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {isSw ? 'Uongozi wa Mitihani & Ratiba' : 'Exam Moderation & Timetable Dispatch'}
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {isSw ? 'Tuma Ratiba Rasmi ya Mtihani' : 'Dispatch Official Exam Timetable'}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* USER'S CORE REQUIREMENT: TARGET AUDIENCE SELECTOR (Walimu pekee / Wazazi pekee / Wote) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{isSw ? 'Chagua Walengwa wa Ratiba Hii (Target Audience):' : 'Select Target Audience:'}</span>
              <span className="text-rose-400">*</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Walimu Peke Yao */}
              <div
                onClick={() => setTargetAudience('teachers_only')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  targetAudience === 'teachers_only'
                    ? 'bg-blue-950/70 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-blue-300 flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <span>{isSw ? 'Walimu Peke Yao' : 'Teachers Only'}</span>
                    </span>
                    <input
                      type="radio"
                      name="targetAudience"
                      checked={targetAudience === 'teachers_only'}
                      onChange={() => setTargetAudience('teachers_only')}
                      className="text-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isSw
                      ? 'Inatumwa kwa walimu wote kwa ajili ya usimamizi darasani, upangaji vyumba na ratiba ya kusahihisha.'
                      : 'Dispatched to academic teachers for invigilation, room allocation and marking schedule.'}
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-mono text-blue-400 font-semibold">
                  ✓ {isSw ? 'Walimu 14 wataarifiwa' : '14 Teachers notified'}
                </span>
              </div>

              {/* Option 2: Wazazi Peke Yao */}
              <div
                onClick={() => setTargetAudience('parents_only')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  targetAudience === 'parents_only'
                    ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                      <Smartphone className="w-4 h-4 text-emerald-400" />
                      <span>{isSw ? 'Wazazi Peke Yao' : 'Parents Only'}</span>
                    </span>
                    <input
                      type="radio"
                      name="targetAudience"
                      checked={targetAudience === 'parents_only'}
                      onChange={() => setTargetAudience('parents_only')}
                      className="text-emerald-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isSw
                      ? 'Inatumwa kwa wazazi kupitia SMS za kawaida za simu (Cellular Direct SMS) na dashibodi ya mzazi.'
                      : 'Dispatched directly to parents via GSM SMS and parent in-app dashboard.'}
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-mono text-emerald-400 font-semibold">
                  ✓ {isSw ? `${parentCount} Wazazi kupitia SMS` : `${parentCount} Parents via SMS`}
                </span>
              </div>

              {/* Option 3: Wote (Wazazi na Walimu) */}
              <div
                onClick={() => setTargetAudience('both')}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  targetAudience === 'both'
                    ? 'bg-amber-950/70 border-amber-500 shadow-md ring-1 ring-amber-500'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isSw ? 'Wote: Walimu & Wazazi' : 'Both: Teachers & Parents'}</span>
                    </span>
                    <input
                      type="radio"
                      name="targetAudience"
                      checked={targetAudience === 'both'}
                      onChange={() => setTargetAudience('both')}
                      className="text-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    {isSw
                      ? 'Inatumwa kwa Walimu (usimamizi wa kitaaluma) na Wazazi (SMS ya simu na maandalizi ya watoto).'
                      : 'Broadband dispatch: Teachers receive invigilation rota; Parents receive direct cellular SMS.'}
                  </p>
                </div>
                <span className="mt-2 text-[10px] font-mono text-amber-400 font-semibold">
                  ✓ {isSw ? `Walimu 14 + Wazazi ${parentCount}` : `14 Teachers + ${parentCount} Parents`}
                </span>
              </div>
            </div>
          </div>

          {/* Target Class Scope & Exam Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                {isSw ? 'Darasa Lililolengwa (Target Class):' : 'Target Class / Grade:'}
              </label>
              <select
                value={targetClassScope}
                onChange={(e) => setTargetClassScope(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">
                  {isSw ? '🏫 Madarasa Yote (All Classes)' : '🏫 All Classes (Whole School)'}
                </option>
                {CLASSES.map((cls) => (
                  <option key={cls.id} value={cls.class_name}>
                    {cls.class_name} ({cls.stream ? `Stream ${cls.stream}` : 'Single'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                {isSw ? 'Aina ya Mtihani (Exam Category):' : 'Exam Type:'}
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamTimetable['exam_type'])}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="mid_term">{isSw ? 'Mtihani wa Nusu Muhula (Mid-Term)' : 'Mid-Term Exam'}</option>
                <option value="terminal">{isSw ? 'Mtihani wa Mwisho wa Muhula (Terminal)' : 'Terminal Exam'}</option>
                <option value="mock">{isSw ? 'Mtihani wa Majaribio (Mock Exam)' : 'Mock Exam (NECTA Format)'}</option>
                <option value="monthly">{isSw ? 'Jaribio la Mwezi (Monthly Test)' : 'Monthly Assessment'}</option>
                <option value="annual">{isSw ? 'Mtihani wa Mwisho wa Mwaka (Annual)' : 'Annual Examination'}</option>
              </select>
            </div>
          </div>

          {/* Title of Timetable */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              {isSw ? 'Kichwa cha Ratiba ya Mtihani:' : 'Timetable Title:'}
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder={isSw ? 'Mfano: Ratiba Rasmi ya Mitihani ya Nusu Muhula...' : 'Exam Timetable Title...'}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Exam Dates & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                {isSw ? 'Tarehe ya Kuanza:' : 'Start Date:'}
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                {isSw ? 'Tarehe ya Kumaliza:' : 'End Date:'}
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Exam Schedule Slots (Days, Subjects, Supervisors) */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isSw ? 'Vipindi & Masomo ya Mtihani (Exam Slots):' : 'Exam Schedule Slots:'}</span>
                </h4>
                <p className="text-[10px] text-slate-400">
                  {slots.length} {isSw ? 'vipindi vilivyopangwa' : 'scheduled papers'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddSlotForm(!showAddSlotForm)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-amber-300 text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isSw ? 'Ongeza Somo' : 'Add Subject'}</span>
              </button>
            </div>

            {/* List of current slots */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {slots.map((slot, idx) => (
                <div
                  key={slot.id || idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-300">{slot.time_slot}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-bold text-white truncate">{slot.subject_name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                      <span>📅 {slot.day_label_sw}</span>
                      {slot.supervisor_name && <span>👤 Msimamizi: {slot.supervisor_name}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(slot.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors ml-2"
                    title={isSw ? 'Futa somo' : 'Remove paper'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Form to add custom slot */}
            {showAddSlotForm && (
              <div className="p-3 bg-slate-900/95 border border-amber-500/40 rounded-xl space-y-2 mt-2">
                <div className="text-xs font-bold text-amber-400">{isSw ? 'Ongeza Somo Jipya kwenye Ratiba:' : 'Add Exam Slot:'}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{isSw ? 'Siku & Tarehe:' : 'Day Label:'}</label>
                    <input
                      type="text"
                      value={newDayLabel}
                      onChange={(e) => setNewDayLabel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{isSw ? 'Muda (Time Slot):' : 'Time:'}</label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{isSw ? 'Somo:' : 'Subject:'}</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                      placeholder="e.g. Maarifa ya Jamii"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">{isSw ? 'Msimamizi (Invigilator):' : 'Invigilator:'}</label>
                    <input
                      type="text"
                      value={newSupervisor}
                      onChange={(e) => setNewSupervisor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white"
                      placeholder="e.g. Mwl. Kavishe"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddSlotForm(false)}
                    className="px-2.5 py-1 text-slate-400 text-xs"
                  >
                    {isSw ? 'Ghairi' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddSlot}
                    className="px-3 py-1 bg-amber-500 text-slate-950 font-bold text-xs rounded"
                  >
                    {isSw ? 'Weka Somo' : 'Save Slot'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Conditional: SMS Message Preview for Parents (When target is parents_only or both) */}
          {targetAudience !== 'teachers_only' && (
            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isSw ? 'Ujumbe wa SMS Utakaofika kwa Simu za Wazazi:' : 'Cellular SMS Preview for Parents:'}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                  {parentCount} {isSw ? 'Wazazi' : 'Parents'}
                </span>
              </div>
              <textarea
                value={customSms}
                onChange={(e) => setCustomSms(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-emerald-500/40 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-400 font-mono"
              />
              <p className="text-[10px] text-emerald-400/80">
                {isSw
                  ? '✓ SMS hii itawafikia wazazi wote waliojiandikisha moja kwa moja kwenye mitandao yao (Vodacom, Airtel, Tigo, Halotel).'
                  : '✓ Dispatched instantly via cellular SMS bridge directly to registered parents.'}
              </p>
            </div>
          )}

          {/* Instructions for School */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              {isSw ? 'Maelekezo na Miongozo ya Mitihani (Instructions):' : 'Exam Rules & Instructions:'}
            </label>
            <textarea
              value={instructionsSw}
              onChange={(e) => setInstructionsSw(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Summary Banner before dispatch */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">
                {targetAudience === 'teachers_only' && (isSw ? 'Itatumwa kwa WALIMU PEKEE (Nyaraka na Usimamizi)' : 'Dispatching to TEACHERS ONLY')}
                {targetAudience === 'parents_only' && (isSw ? `Itatumwa kwa WAZAZI PEKEE (${parentCount} kupitia SMS & Dashibodi)` : `Dispatching to PARENTS ONLY (${parentCount} SMS)`)}
                {targetAudience === 'both' && (isSw ? `Itatumwa kwa WOTE: Walimu 14 na Wazazi ${parentCount} (SMS & Mfumo)` : `Dispatching to BOTH: 14 Teachers & ${parentCount} Parents`)}
              </span>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
              Top Stars Morogoro
            </span>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
            >
              {isSw ? 'Ghairi' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-lg shadow-lg flex items-center gap-1.5 transition-transform active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSw ? 'Tuma Ratiba Sasa' : 'Dispatch Exam Timetable'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
