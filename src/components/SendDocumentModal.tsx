import React, { useState } from 'react';
import { AcademicDocument, DocumentCategory, Language, UserRole } from '../types';
import { CLASSES, SUBJECTS, STAFF } from '../data/mockData';
import {
  X,
  Upload,
  Send,
  FileText,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  Paperclip,
} from 'lucide-react';

interface SendDocumentModalProps {
  language: Language;
  senderRole: 'teacher' | 'admin';
  senderName: string;
  senderId: string;
  onClose: () => void;
  onSubmit: (newDoc: AcademicDocument) => void;
}

export const SendDocumentModal: React.FC<SendDocumentModalProps> = ({
  language,
  senderRole,
  senderName,
  senderId,
  onClose,
  onSubmit,
}) => {
  const isSw = language === 'sw';

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>(
    senderRole === 'teacher' ? 'exam_paper' : 'circular_notice'
  );
  const [selectedClass, setSelectedClass] = useState(
    senderRole === 'teacher' ? 'Standard IV A' : 'Shule Nzima (All Classes)'
  );
  const [selectedSubject, setSelectedSubject] = useState(
    senderRole === 'teacher' ? 'Hisabati (Mathematics)' : 'Miongozo ya Mitihani'
  );
  const [term, setTerm] = useState('Muhula wa 1, 2026');
  const [recipientChoice, setRecipientChoice] = useState<string>(
    senderRole === 'teacher' ? 'stf-01' : 'all_teachers'
  );
  const [description, setDescription] = useState('');
  const [attachedFileName, setAttachedFileName] = useState('');
  const [attachedFileSize, setAttachedFileSize] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'xlsx'>('pdf');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preset file templates for quick attachment simulation
  const mockPresetFiles = [
    { name: `Mtihani_${selectedSubject.split(' ')[0]}_Term1.pdf`, size: '1.4 MB', type: 'pdf' as const },
    { name: `Marking_Scheme_${selectedSubject.split(' ')[0]}.docx`, size: '780 KB', type: 'docx' as const },
    { name: `Waraka_Mwongozo_Mitihani_2026.pdf`, size: '2.8 MB', type: 'pdf' as const },
    { name: `Andalio_la_Somo_KKK_Awali.docx`, size: '640 KB', type: 'docx' as const },
  ];

  const handleSelectPresetFile = (preset: typeof mockPresetFiles[0]) => {
    setAttachedFileName(preset.name);
    setAttachedFileSize(preset.size);
    setFileType(preset.type);
    if (!title) {
      setTitle(preset.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }
  };

  const handleSimulateCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachedFileName(file.name);
      setAttachedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext === 'docx') setFileType('docx');
      else if (ext === 'xlsx') setFileType('xlsx');
      else setFileType('pdf');

      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage(isSw ? 'Tafadhali weka jina au kichwa cha hati/mtihani.' : 'Please provide a document/exam title.');
      return;
    }

    const finalFileName = attachedFileName || `${title.replace(/\s+/g, '_')}.pdf`;
    const finalFileSize = attachedFileSize || '1.2 MB';

    let recipientName = '';
    let recipientRole: 'teacher' | 'admin' | 'all_teachers' = 'teacher';

    if (senderRole === 'teacher') {
      recipientName = 'Mwl. Josephat Kavishe (Mkuu wa Shule)';
      recipientRole = 'admin';
    } else {
      if (recipientChoice === 'all_teachers') {
        recipientName = 'Walimu Wote (All Teaching Staff)';
        recipientRole = 'all_teachers';
      } else {
        const staffMember = STAFF.find((s) => s.id === recipientChoice);
        recipientName = staffMember ? staffMember.full_name : 'Mwalimu';
        recipientRole = 'teacher';
      }
    }

    const newDoc: AcademicDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      category,
      sender_id: senderId,
      sender_name: senderName,
      sender_role: senderRole,
      recipient_id: recipientChoice,
      recipient_name: recipientName,
      recipient_role: recipientRole,
      class_name: selectedClass,
      subject_name: selectedSubject,
      term,
      academic_year: '2026',
      status: senderRole === 'teacher' ? 'submitted' : 'distributed',
      file_name: finalFileName,
      file_size: finalFileSize,
      file_type: fileType,
      description: description.trim() || (isSw ? 'Hati hii imetumwa kwa njia ya mfumo rasmi wa shule.' : 'Official school document dispatched via portal.'),
      created_at: new Date().toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };

    onSubmit(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                {senderRole === 'teacher'
                  ? isSw
                    ? 'Tuma Mtihani au Document kwa Mkuu wa Shule'
                    : 'Submit Exam / Document to Headteacher'
                  : isSw
                  ? 'Tuma Mtihani au Document kwa Walimu'
                  : 'Dispatch Exam / Document to Teachers'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {isSw ? 'Kutoka:' : 'From:'} <span className="text-amber-400 font-semibold">{senderName}</span>
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-200">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/50 text-rose-200 flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Document Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {isSw ? 'Aina ya Hati (Document Type):' : 'Document Category:'}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
            >
              <option value="exam_paper">{isSw ? '📝 Mtihani wa Nusu Muhula / Muhula (Exam Paper)' : '📝 Examination Paper'}</option>
              <option value="marking_scheme">{isSw ? '🔑 Mwongozo wa Majibu & Alama (Marking Scheme)' : '🔑 Marking Scheme'}</option>
              <option value="lesson_plan">{isSw ? '📖 Andalio la Somo (Lesson Plan)' : '📖 Lesson Plan'}</option>
              <option value="scheme_of_work">{isSw ? '📋 Azimio la Kazi (Scheme of Work)' : '📋 Scheme of Work'}</option>
              <option value="circular_notice">{isSw ? '📜 Waraka wa Wizara / Shule (Circular Notice)' : '📜 Circular / Directive'}</option>
              <option value="curriculum_doc">{isSw ? '📚 Muhtasari wa Somo au Mtaala (Curriculum/Syllabus)' : '📚 Curriculum/Syllabus Document'}</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {isSw ? 'Kichwa cha Mtihani / Hati:' : 'Document / Exam Title:'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                isSw
                  ? 'mfano: Mtihani wa Nusu Muhula - Darasa la IV - Hisabati'
                  : 'e.g. Mid-Term Examination - Standard IV - Mathematics'
              }
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* Class & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {isSw ? 'Darasa (Class Level):' : 'Target Class:'}
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="Shule Nzima (All Classes)">{isSw ? 'Shule Nzima (All Classes)' : 'All Classes'}</option>
                <option value="Baby Class (Awali)">Baby Class</option>
                <option value="Middle Class (Awali)">Middle Class</option>
                <option value="Pre-Unit (Awali)">Pre-Unit</option>
                <option value="Standard I">Standard I (Darasa la 1)</option>
                <option value="Standard II">Standard II (Darasa la 2)</option>
                <option value="Standard III">Standard III (Darasa la 3)</option>
                <option value="Standard IV A">Standard IV A (Darasa la 4A)</option>
                <option value="Standard V">Standard V (Darasa la 5)</option>
                <option value="Standard VI">Standard VI (Darasa la 6)</option>
                <option value="Standard VII">Standard VII (Darasa la 7 - NECTA PSLE)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {isSw ? 'Somo (Subject):' : 'Subject:'}
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="Hisabati (Mathematics)">Hisabati (Mathematics)</option>
                <option value="English Language">English Language</option>
                <option value="Kiswahili">Kiswahili</option>
                <option value="Sayansi na Teknolojia">Sayansi na Teknolojia</option>
                <option value="Maarifa ya Jamii">Maarifa ya Jamii (Social Studies)</option>
                <option value="Uraia na Maadili">Uraia na Maadili (Civics)</option>
                <option value="Stadi za Kazi">Stadi za Kazi (Vocational)</option>
                <option value="Stadi za KKK (Awali)">Stadi za KKK (Awali 3Rs)</option>
                <option value="Miongozo ya Mitihani">Miongozo ya Mitihani (Admin Guidelines)</option>
              </select>
            </div>
          </div>

          {/* Recipient Selection if Admin is sending */}
          {senderRole === 'admin' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                {isSw ? 'Mpokeaji (Recipient):' : 'Recipient Teacher:'}
              </label>
              <select
                value={recipientChoice}
                onChange={(e) => setRecipientChoice(e.target.value)}
                className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
              >
                <option value="all_teachers">{isSw ? '📢 Walimu Wote (All Teaching Staff)' : '📢 All Teaching Staff'}</option>
                <option value="stf-03">Mwl. Rehema Msangi (Mwalimu wa Darasa la IV A)</option>
                <option value="stf-04">Madam Fatuma Ally (Mwalimu Mkuu wa Awali)</option>
                <option value="stf-02">Mr. Emmanuel Mtei (Mwalimu wa Darasa la I)</option>
                <option value="stf-07">Ms. Beatrice Kimario (Mwalimu wa Darasa la II)</option>
                <option value="stf-08">Mr. Juma Rashidi (Mwalimu wa Darasa la III)</option>
              </select>
            </div>
          )}

          {/* File Attachment Section */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-amber-400" />
                <span>{isSw ? 'Ambatisha Faili (File Attachment):' : 'Attach Document File:'}</span>
              </label>
              {attachedFileName && (
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{attachedFileName} ({attachedFileSize})</span>
                </span>
              )}
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-400 self-center mr-1">
                {isSw ? 'Chagua kiolezo:' : 'Preset mock:'}
              </span>
              {mockPresetFiles.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetFile(preset)}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                    attachedFileName === preset.name
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Simulated Custom File Picker */}
            <label className="block w-full border border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg p-2.5 text-center cursor-pointer bg-slate-900/50 transition-colors">
              <Upload className="w-4 h-4 mx-auto text-slate-400 mb-1" />
              <span className="text-[10px] text-slate-300 block">
                {isSw ? 'Bofya kupakia faili (PDF, Word docx, Excel)' : 'Click to select file (PDF, Word, Excel)'}
              </span>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleSimulateCustomUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Remarks / Message */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 mb-1">
              {isSw ? 'Maelezo / Ujumbe kwa Mpokeaji:' : 'Message / Instructions for Recipient:'}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                senderRole === 'teacher'
                  ? isSw
                    ? 'Andika maelezo ya mtihani kwa Mkuu wa Shule (mfano: Mtihani una maswali 25 na sehemu mbili A na B kulingana na muundo wa NECTA)...'
                    : 'Notes for the headteacher...'
                  : isSw
                  ? 'Andika maelekezo kwa walimu (mfano: Zingatieni miongozo hii wakati wa kutoa mitihani ya nusu muhula)...'
                  : 'Instructions for teachers...'
              }
              rows={2}
              className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-400 focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
            >
              {isSw ? 'Ghairi' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="py-1.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-98"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSw ? 'Tuma Sasa' : 'Dispatch Now'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
