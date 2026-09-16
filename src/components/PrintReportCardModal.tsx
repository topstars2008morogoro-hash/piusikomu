import React from 'react';
import { Language, Student, ExamResult } from '../types';
import { SCHOOL_INFO, NECTA_GRADING_SCALE } from '../data/mockData';
import { SchoolLogo } from './SchoolLogo';
import { Printer, X, Shield, Award, CheckCircle2 } from 'lucide-react';

interface PrintReportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  results: ExamResult[];
  language: Language;
  term?: string;
  examName?: string;
}

export const PrintReportCardModal: React.FC<PrintReportCardModalProps> = ({
  isOpen,
  onClose,
  student,
  results,
  language,
  term = 'Term 1, 2026',
  examName = 'Mid-Term Examination 2026',
}) => {
  const isSw = language === 'sw';

  if (!isOpen) return null;

  const totalMarks = results.reduce((acc, r) => acc + r.marks, 0);
  const maxPossible = results.length * 100;
  const averageMark = results.length ? Math.round(totalMarks / results.length) : 0;
  const overallGrade =
    averageMark >= 81 ? 'A' : averageMark >= 61 ? 'B' : averageMark >= 41 ? 'C' : averageMark >= 21 ? 'D' : 'F';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Actions */}
        <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-bold text-white">
              {isSw ? 'Ripoti Rasmi ya Maendeleo ya Mwanafunzi' : 'Official Student Progress Report Card'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-transform"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isSw ? 'Chapisha / Hifadhi PDF' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-white text-slate-900 printable-area space-y-4 text-xs font-serif">
          {/* Official School Letterhead */}
          <div className="text-center border-b-2 border-slate-800 pb-3">
            <div className="flex justify-center mb-1">
              <SchoolLogo size="md" />
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-wider text-slate-900 uppercase">
              {SCHOOL_INFO.name}
            </h1>
            <h2 className="text-xs font-bold text-slate-700 uppercase">
              {SCHOOL_INFO.name_sw}
            </h2>
            <p className="text-[10px] text-slate-600">
              {SCHOOL_INFO.location} • {SCHOOL_INFO.po_box} • Simu: {SCHOOL_INFO.phone}
            </p>
            <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-widest mt-0.5">
              Motto: &quot;{SCHOOL_INFO.motto}&quot; • Reg: {SCHOOL_INFO.registration_number}
            </p>
            <div className="mt-2 inline-block px-3 py-1 rounded bg-slate-100 border border-slate-300 font-sans font-black text-xs uppercase tracking-wide">
              {examName} — {term}
            </div>
          </div>

          {/* Student Biodata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg font-sans text-[11px]">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isSw ? 'Jina la Mwanafunzi:' : 'Student Name:'}</span>
              <strong className="text-slate-900">{student.first_name} {student.last_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isSw ? 'Namba ya Usajili:' : 'Admission No:'}</span>
              <strong className="font-mono text-slate-900">{student.admission_number}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isSw ? 'Darasa:' : 'Class:'}</span>
              <strong className="text-slate-900">{student.class_name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">{isSw ? 'Mzazi / Mlezi:' : 'Parent / Guardian:'}</span>
              <strong className="text-slate-900">{student.parent_name}</strong>
            </div>
          </div>

          {/* Performance Results Table */}
          <div>
            <table className="w-full border-collapse border border-slate-300 font-sans text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300 text-left">
                  <th className="p-2 border-r border-slate-300">#</th>
                  <th className="p-2 border-r border-slate-300">{isSw ? 'Somo' : 'Subject'}</th>
                  <th className="p-2 text-center border-r border-slate-300">{isSw ? 'Alama (%)' : 'Marks (%)'}</th>
                  <th className="p-2 text-center border-r border-slate-300">{isSw ? 'Daraja' : 'Grade'}</th>
                  <th className="p-2 text-center border-r border-slate-300">{isSw ? 'Nafasi' : 'Rank'}</th>
                  <th className="p-2">{isSw ? 'Maoni ya Mwalimu' : 'Remarks'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {results.map((res, index) => (
                  <tr key={res.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-2 border-r border-slate-200 text-center font-mono">{index + 1}</td>
                    <td className="p-2 border-r border-slate-200 font-semibold">{res.subject_name}</td>
                    <td className="p-2 border-r border-slate-200 text-center font-bold text-slate-900">{res.marks}%</td>
                    <td className="p-2 border-r border-slate-200 text-center">
                      <span className="font-black px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-xs">
                        {res.grade}
                      </span>
                    </td>
                    <td className="p-2 border-r border-slate-200 text-center font-semibold text-slate-600">
                      {res.position || index + 1}
                    </td>
                    <td className="p-2 text-[11px] text-slate-700">
                      {isSw ? res.remarks_sw : res.remarks_en}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Summary Box */}
          <div className="grid grid-cols-4 gap-2 bg-slate-100 border border-slate-300 p-2.5 rounded-lg text-center font-sans">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">{isSw ? 'Jumla ya Alama' : 'Total Marks'}</span>
              <strong className="text-sm font-black text-slate-900">{totalMarks} / {maxPossible}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">{isSw ? 'Wastani' : 'Average'}</span>
              <strong className="text-sm font-black text-blue-700">{averageMark}%</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">{isSw ? 'Daraja la Jumla' : 'Overall Grade'}</span>
              <strong className="text-sm font-black text-emerald-700">{overallGrade}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">{isSw ? 'Nafasi Darasani' : 'Class Rank'}</span>
              <strong className="text-sm font-black text-amber-700">2 / 45</strong>
            </div>
          </div>

          {/* NECTA Grading Key */}
          <div className="p-2 rounded border border-slate-200 bg-slate-50 font-sans text-[10px]">
            <span className="font-bold text-slate-700 block mb-1">
              {isSw ? 'Kiwango cha Madaraja ya NECTA (Primary Scale):' : 'Official NECTA Grading Scale:'}
            </span>
            <div className="flex flex-wrap gap-2 text-slate-600">
              {NECTA_GRADING_SCALE.map((scale) => (
                <span key={scale.grade}>
                  <strong>{scale.grade}</strong> ({scale.min}-{scale.max}%): {isSw ? scale.remark_sw : scale.remark_en}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Official Stamp */}
          <div className="pt-4 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-3 gap-4 font-sans text-[11px]">
            <div>
              <span className="text-slate-500 block">{isSw ? 'Mwalimu wa Darasa:' : 'Class Teacher:'}</span>
              <strong className="text-slate-900 block mt-1">Mwl. Rehema Msangi</strong>
              <div className="mt-1 h-6 border-b border-dashed border-slate-400 text-[9px] text-slate-400 flex items-end">
                {isSw ? 'Sahihi ya Mwalimu' : 'Signature'}
              </div>
            </div>

            <div>
              <span className="text-slate-500 block">{isSw ? 'Mkuu wa Shule:' : 'Headteacher:'}</span>
              <strong className="text-slate-900 block mt-1">Mwl. David Lyimo</strong>
              <div className="mt-1 h-6 border-b border-dashed border-slate-400 text-[9px] text-slate-400 flex items-end">
                {isSw ? 'Sahihi & Muhuri' : 'Signature & Official Stamp'}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-center">
              <Shield className="w-5 h-5 text-emerald-600 mb-0.5" />
              <strong className="text-[10px] uppercase font-black">{isSw ? 'Imethibitishwa Kidijitali' : 'Digitally Certified'}</strong>
              <span className="text-[9px] text-emerald-600 font-mono">TS-EXAM-{student.id}-2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
