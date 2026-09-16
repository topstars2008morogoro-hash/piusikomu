import React, { useState } from 'react';
import { POSTGRESQL_DDL, MYSQL_DDL } from '../data/dbSchemaDoc';
import { Language } from '../types';
import { Copy, Check, Download, FileCode, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

interface SqlScriptViewerProps {
  language: Language;
}

export const SqlScriptViewer: React.FC<SqlScriptViewerProps> = ({ language }) => {
  const isSw = language === 'sw';
  const [flavor, setFlavor] = useState<'postgresql' | 'mysql'>('postgresql');
  const [copied, setCopied] = useState(false);

  const activeScript = flavor === 'postgresql' ? POSTGRESQL_DDL : MYSQL_DDL;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const filename = `top_stars_school_${flavor}_schema.sql`;
    const blob = new Blob([activeScript], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">
      {/* Script Header Bar */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
              {isSw ? 'SQL DDL Tayari Kutumika' : 'Production-Ready SQL Scripts'}
            </span>
            <span className="text-slate-400 text-xs">• ACID Compliant • Integrity Constraints</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white">
            {isSw ? 'Dondoo za SQL (CREATE TABLE Scripts)' : 'Database Management System DDL Scripts'}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            {isSw
              ? 'Scripts safi za kutengeneza mifumo ya database zikiwa na Constraints za kuzuia data zisizo sahihi, Indexes za kasi, na Triggers za kugawa madaraja ya NECTA (A, B, C, D, F).'
              : 'Clean, verified SQL scripts with strict foreign key constraints, indexes, check rules, and automated NECTA grading triggers.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Engine Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setFlavor('postgresql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                flavor === 'postgresql'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PostgreSQL
            </button>
            <button
              onClick={() => setFlavor('mysql')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                flavor === 'mysql'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MySQL / MariaDB
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (isSw ? 'Imenakiliwa!' : 'Copied!') : (isSw ? 'Nakili SQL' : 'Copy SQL')}</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isSw ? 'Pakua Faili (.sql)' : 'Download .sql'}</span>
          </button>
        </div>
      </div>

      {/* Constraints Highlights Notice */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            <span>{isSw ? 'Data Integrity Constraints' : 'Data Integrity Constraints'}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isSw
              ? 'Safu za alama zinalindwa na CHECK (marks >= 0 AND marks <= 100). Malipo ya fedha zinalindwa kuzuia namba hasi (amount_paid_tzs > 0).'
              : 'Marks constrained between 0 and 100. Fee payments enforced strictly positive (> 0 TZS) with unique transaction references.'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
          <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>{isSw ? 'Trigger ya Madaraja ya NECTA' : 'Automated NECTA Trigger'}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isSw
              ? 'Trigger ya kabla ya kuingiza/kurekebisha matokeo inabadilisha alama kuwa A (81-100), B (61-80), C (41-60), D (21-40), na F (0-20).'
              : 'BEFORE INSERT/UPDATE triggers convert raw numerical marks into official primary school grades without trusting client-side math.'}
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
          <div className="font-bold text-purple-400 mb-1 flex items-center gap-1.5">
            <Terminal className="w-4 h-4" />
            <span>{isSw ? 'Indexing & High Speed' : 'Indexes for Offline Queries'}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {isSw
              ? 'Indexes maalum zimewekwa kwenye admission_number, phone_number, attendance_date, na control_number kwa ajili ya utafutaji wa haraka.'
              : 'Dedicated B-tree indexes placed on phone numbers, daily attendance dates, class rosters, and payment control numbers.'}
          </p>
        </div>
      </div>

      {/* Syntax Highlighted Code Viewer */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-bold text-slate-200">
              top_stars_{flavor}_schema.sql
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {flavor === 'postgresql' ? 'PostgreSQL 14+ / Supabase / Cloud SQL' : 'MySQL 8.0+ / MariaDB InnoDB'}
          </span>
        </div>

        <div className="p-4 sm:p-5 overflow-x-auto max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700">
          <pre className="font-mono text-xs text-slate-200 leading-relaxed selection:bg-amber-500/30">
            <code>{activeScript}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
