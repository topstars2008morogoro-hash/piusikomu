import React from 'react';
import { Language, AdmissionApplication } from '../types';
import { SchoolLogo } from './SchoolLogo';
import { X, Printer, Download, CheckCircle2, ShieldCheck, MapPin, Phone, Mail, FileText } from 'lucide-react';

interface AdmissionLetterModalProps {
  language: Language;
  application: AdmissionApplication;
  onClose: () => void;
}

export const AdmissionLetterModal: React.FC<AdmissionLetterModalProps> = ({
  language,
  application,
  onClose,
}) => {
  const isSw = language === 'sw';

  const handlePrint = () => {
    window.print();
  };

  const studentFullName = `${application.child.first_name} ${application.child.middle_name} ${application.child.last_name}`;
  const admissionNumber = application.assigned_student_admission || `TS-2026-${Math.floor(100 + Math.random() * 900)}`;
  const reportingDate = application.reporting_date || '05 Januari 2027';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[95vh]">
        {/* Controls Toolbar */}
        <div className="bg-slate-900 text-white p-3 px-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-xs">
              {isSw ? 'Barua Rasmi ya Udahili & Maagizo ya Kujiunga' : 'Official Admission Letter & Joining Instructions'}
            </span>
            <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
              {application.reference_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isSw ? 'Chapisha / Pakua (Print/PDF)' : 'Print Letter'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Letter Sheet (A4 styling) */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 text-xs leading-relaxed bg-white">
          {/* School Header */}
          <div className="text-center border-b-2 border-amber-600 pb-4 flex flex-col items-center">
            <SchoolLogo size="lg" className="mb-2" />
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase">
              TOP STARS NURSERY & PRIMARY SCHOOL
            </h1>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest">
              SHULE YA AWALI NA MSINGI TOP STARS • MOROGORO
            </p>
            <p className="text-[11px] text-slate-600 mt-1">
              S.L.P 2008, Morogoro, Tanzania • Simu: +255 754 123 456 / +255 784 987 654
            </p>
            <p className="text-[10px] text-slate-500 font-mono">
              Usajili wa Shule Na: <strong className="text-slate-800">EM.14208/TZ</strong> • Barua Pepe: topstars2008morogoro@gmail.com
            </p>
            <div className="mt-2 inline-block bg-slate-100 px-3 py-0.5 rounded-full text-[10px] font-bold text-slate-700 uppercase tracking-wider">
              MOTTO: QUALITY EDUCATION, ETHICS AND VALUES
            </div>
          </div>

          {/* Reference & Recipient Particulars */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 text-xs">
            <div>
              <p><strong>Kumb. Na:</strong> <span className="font-mono">{application.reference_number}</span></p>
              <p><strong>Namba ya Udahili (Admission No):</strong> <span className="font-mono font-bold text-amber-700">{admissionNumber}</span></p>
              <p><strong>Tarehe:</strong> {new Date().toLocaleDateString('sw-TZ', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="sm:text-right">
              <p><strong>Kwa Ndugu Mzazi / Mlezi:</strong> {application.parent.parent_name}</p>
              <p><strong>Simu:</strong> <span className="font-mono">{application.parent.phone_number}</span></p>
              <p><strong>Eneo la Makazi:</strong> {application.parent.residence_ward}</p>
            </div>
          </div>

          {/* Letter Title */}
          <div className="text-center pt-2">
            <h2 className="text-sm sm:text-base font-black uppercase text-slate-950 underline underline-offset-4 decoration-amber-600">
              YAH: NAFASI YA UDAHILI NA MAELEKEZO YA KUJIUNGA NA MWAKA WA MASOMO 2026/2027
            </h2>
          </div>

          {/* Body Paragraphs */}
          <div className="space-y-3 text-justify text-slate-800 text-[11.5px]">
            <p>
              Tunayofuraha kukutaarifu kuwa mwanao mpendwa, <strong>{studentFullName}</strong>, amefaulu na amepewa nafasi ya kujiunga na <strong>{application.approved_class_stream || application.applying_for_class}</strong> katika Shule ya Awali na Msingi ya Top Stars, Morogoro kwa mwaka wa masomo 2026/2027.
            </p>
            <p>
              Muhula wa kwanza utaanza rasmi siku ya <strong>Jumatatu, {reportingDate}</strong> saa 1:30 asubuhi. Wanafunzi wote wanatakiwa kuripoti shuleni wakiwa na sare kamili za shule zilizoidhinishwa.
            </p>
          </div>

          {/* Key Particulars Table */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 text-xs border-b border-slate-300 flex justify-between">
              <span>MAELEZO YA MWANAFUNZI NA DARASA ALILOPANGIWA</span>
              <span className="font-mono text-amber-700 font-bold">{admissionNumber}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 text-[11px] bg-slate-50/50">
              <div>
                <span className="text-slate-500 block">Jina Kamili:</span>
                <strong className="text-slate-900">{studentFullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Darasa:</span>
                <strong className="text-amber-700">{application.approved_class_stream || application.applying_for_class}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Jinsia / Umri:</span>
                <span>{application.child.gender === 'M' ? 'Mvulana' : 'Msichana'} • {application.child.age_display}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Usafiri wa Shule:</span>
                <span>{application.parent.needs_school_bus ? 'Basi la Shule (Ruti Iliyochaguliwa)' : 'Anajitegemea'}</span>
              </div>
            </div>
          </div>

          {/* Initial Fee Status Card */}
          <div className="border border-slate-300 rounded-xl overflow-hidden">
            <div className="bg-slate-100 p-2 font-bold text-slate-800 text-xs border-b border-slate-300 flex justify-between">
              <span>HALI YA MALIPO YA AWALI (CONTROL NUMBER & RECEIPT)</span>
              <span className="text-emerald-700 font-bold">✓ IMETHIBITISHWA</span>
            </div>
            <div className="p-3 text-[11px] space-y-1.5">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Kiasi cha Awali Kilicholipwa:</span>
                <span className="font-mono font-bold text-slate-900">TZS {application.payment.amount_paid_tzs.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span>Njia ya Malipo / Namba ya Muamala:</span>
                <span className="font-mono text-slate-900">{application.payment.payment_method} ({application.payment.transaction_reference})</span>
              </div>
              <div className="flex justify-between">
                <span>Control Number ya Shule:</span>
                <span className="font-mono font-bold text-amber-800">{application.payment.control_number}</span>
              </div>
            </div>
          </div>

          {/* Crucial Instructions */}
          <div className="space-y-1.5 text-[11px] text-slate-800">
            <h3 className="font-bold text-xs uppercase text-slate-950">MAAGIZO MUHIMU KWA MZAZI:</h3>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Mlete mtoto na nakala halisi ya <strong>Cheti cha Kuzaliwa (RITA)</strong> kwa ukaguzi siku ya kuripoti.</li>
              <li>Sare za shule (jozi 2, sweta, tai na t-shirt ya michezo) zitatolewa kwenye ofisi ya vifaa ya shule kuanzia tarehe 20 Desemba.</li>
              <li>Mawasiliano yote rasmi ya matokeo ya mitihani, ripoti, na mahudhurio yatatumwa kwa njia ya SMS kwa namba yako: <strong>{application.parent.phone_number}</strong>.</li>
              <li>Wanafunzi wanaotumia basi la shule watapigiwa simu na dereva wa ruti siku moja kabla kwa maelekezo ya kituo cha kuchukuliwa.</li>
            </ol>
          </div>

          {/* Headteacher Signature & Stamp */}
          <div className="pt-6 flex justify-between items-end border-t border-slate-300">
            <div>
              <p className="text-[10px] text-slate-500">Imetolewa na:</p>
              <div className="font-bold text-xs text-slate-900 mt-1">Mwl. Josephat Kavishe</div>
              <p className="text-[11px] text-slate-600">Mkuu wa Shule (Headteacher)</p>
              <p className="text-[10px] text-slate-500 font-mono">Shule ya Awali na Msingi Top Stars</p>
            </div>

            {/* Simulated Stamp */}
            <div className="w-28 h-28 rounded-full border-2 border-dashed border-blue-600/70 p-2 flex flex-col items-center justify-center text-center text-blue-700/80 rotate-[-6deg] select-none">
              <span className="text-[8px] font-black uppercase">TOP STARS SCHOOL</span>
              <span className="text-[9px] font-black my-0.5">★ HEADTEACHER ★</span>
              <span className="text-[7px]">OFFICIAL ADMISSION</span>
              <span className="text-[8px] font-mono font-bold mt-0.5">MOROGORO</span>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-slate-500">Sahihi ya Mzazi/Mlezi:</p>
              <div className="border-b border-slate-400 w-36 h-6 mb-1"></div>
              <p className="text-[10px] text-slate-500">Tarehe: ........................</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
