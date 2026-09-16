import React, { useState } from 'react';
import { SCHEMA_TABLES, SchemaTableDef } from '../data/dbSchemaDoc';
import { Language } from '../types';
import { Database, Key, Link2, Search, Filter, ShieldCheck, CheckCircle2, ChevronDown, ChevronRight, Layers } from 'lucide-react';

interface SchemaVisualizerProps {
  language: Language;
}

export const SchemaVisualizer: React.FC<SchemaVisualizerProps> = ({ language }) => {
  const isSw = language === 'sw';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTable, setExpandedTable] = useState<string | null>('students');

  // Categories
  const categories = ['all', ...Array.from(new Set(SCHEMA_TABLES.map((t) => t.category)))];

  const filteredTables = SCHEMA_TABLES.filter((tbl) => {
    const matchesSearch =
      tbl.tableName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tbl.description_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tbl.description_sw.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tbl.columns.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'all' || tbl.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                {isSw ? 'Muundo wa Seva Kuu (DBMS Schema)' : 'Production Relational Architecture'}
              </span>
              <span className="text-slate-400 text-xs">• 12 Tables • 3NF Normalized</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isSw ? 'Ramani ya Database na Mahusiano (ERD Schema)' : 'Database Schema & Entity Relationships'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              {isSw
                ? 'Muundo thabiti wa Database iliyoundwa kwa ajili ya Top Stars Nursery & Primary School (Morogoro). Inajumuisha taratibu za NECTA, fedha za TZS, ulinzi wa data (RBAC), na ulandanishaji wa simu (Offline Sync Logs).'
                : 'Robust relational schema engineered for Top Stars Nursery & Primary School. Covers Tanzanian NECTA grading, TZS mobile-money fees with control numbers, role-based access control, and offline mobile sync logging.'}
            </p>
          </div>

          {/* Schema Stats */}
          <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-700">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-lg font-black text-amber-400">12</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">{isSw ? 'Jedwali' : 'Tables'}</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-lg font-black text-emerald-400">18</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">{isSw ? 'Mahusiano' : 'Relations (FK)'}</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-black text-blue-400">3NF</div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">{isSw ? 'Uthabiti' : 'Normal Form'}</div>
            </div>
          </div>
        </div>

        {/* Entity Relationships Diagram (ERD) Flow Map */}
        <div className="mt-6 pt-5 border-t border-slate-700/80">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Link2 className="w-4 h-4 text-amber-400" />
              <span>{isSw ? 'Mchoro wa Mahusiano Makuu (Entity Relationship Flow)' : 'Core Relationship Architecture Diagram'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">PK 🔑 = Primary Key | FK 🔗 = Foreign Key</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
            {/* Box 1: Users & Auth */}
            <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/40">
              <div className="font-bold text-blue-400 flex items-center justify-between">
                <span>users</span>
                <span className="text-[10px] bg-blue-500/20 px-1.5 py-0.5 rounded text-blue-300">Auth Root</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 mb-2">🔑 id (UUID) • role • phone</p>
              <div className="text-[10px] text-slate-300 space-y-1 border-t border-slate-800 pt-1.5">
                <div className="text-amber-400">↳ 1:1 parents (user_id)</div>
                <div className="text-amber-400">↳ 1:1 staff (user_id)</div>
              </div>
            </div>

            {/* Box 2: Students */}
            <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/50 shadow-md">
              <div className="font-bold text-amber-400 flex items-center justify-between">
                <span>students</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded text-amber-300">Central Entity</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 mb-2">🔑 id • admission_number • gender</p>
              <div className="text-[10px] text-slate-300 space-y-1 border-t border-slate-800 pt-1.5">
                <div>🔗 class_id ➔ classes(id)</div>
                <div>🔗 parent_id ➔ parents(id)</div>
                <div className="text-emerald-400">↳ 1:N attendances</div>
                <div className="text-emerald-400">↳ 1:N exam_results</div>
                <div className="text-emerald-400">↳ 1:N fee_payments</div>
              </div>
            </div>

            {/* Box 3: Classes & Subjects */}
            <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/40">
              <div className="font-bold text-purple-400 flex items-center justify-between">
                <span>classes & subjects</span>
                <span className="text-[10px] bg-purple-500/20 px-1.5 py-0.5 rounded text-purple-300">Curriculum</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 mb-2">Nursery KKK + Primary 7 NECTA</p>
              <div className="text-[10px] text-slate-300 space-y-1 border-t border-slate-800 pt-1.5">
                <div>🔗 class_teacher_id ➔ staff(id)</div>
                <div>🔗 class_subject_teachers</div>
              </div>
            </div>

            {/* Box 4: Fees & Transactions */}
            <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/40">
              <div className="font-bold text-emerald-400 flex items-center justify-between">
                <span>fee_payments</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300">TZS Audit</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 mb-2">receipt_number • control_number</p>
              <div className="text-[10px] text-slate-300 space-y-1 border-t border-slate-800 pt-1.5">
                <div>🔗 student_id ➔ students(id)</div>
                <div>🔗 fee_structure_id ➔ fee_structures</div>
                <div>M-Pesa / Airtel / Tigo / Bank</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="text-xs font-semibold text-slate-300">{isSw ? 'Kitengo:' : 'Filter Category:'}</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? (isSw ? 'Vitengo Vyote' : 'All Categories') : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={isSw ? 'Tafuta jedwali, safu, au maelezo...' : 'Search table, column, or constraint...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>
      </div>

      {/* Tables Detailed Cards Grid */}
      <div className="space-y-4">
        {filteredTables.map((tbl) => {
          const isExpanded = expandedTable === tbl.tableName;
          return (
            <div
              key={tbl.tableName}
              className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-all shadow-md hover:border-slate-700"
            >
              {/* Table Header Bar */}
              <div
                onClick={() => setExpandedTable(isExpanded ? null : tbl.tableName)}
                className="p-3.5 sm:p-4 bg-slate-800/60 flex items-center justify-between cursor-pointer select-none hover:bg-slate-800/90 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white font-mono">{tbl.tableName}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                        {tbl.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isSw ? tbl.description_sw : tbl.description_en}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                    {tbl.columns.length} columns
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Columns Table (Expanded View) */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-800 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                        <th className="pb-2 w-48">{isSw ? 'Jina la Safu (Column)' : 'Column Name'}</th>
                        <th className="pb-2 w-52">{isSw ? 'Aina ya Data (Type & Check)' : 'Data Type & Constraints'}</th>
                        <th className="pb-2 w-32">{isSw ? 'Vigezo (Keys)' : 'Keys & Uniqueness'}</th>
                        <th className="pb-2">{isSw ? 'Maelezo ya Kazi' : 'Description & Business Rules'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {tbl.columns.map((col) => (
                        <tr key={col.name} className="hover:bg-slate-800/30">
                          <td className="py-2.5 font-mono font-bold text-slate-200">
                            {col.name}
                          </td>
                          <td className="py-2.5 font-mono text-amber-400/90 text-[11px]">
                            {col.type}
                          </td>
                          <td className="py-2.5">
                            <div className="flex flex-wrap items-center gap-1">
                              {col.isPrimary && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  <Key className="w-2.5 h-2.5" /> PK
                                </span>
                              )}
                              {col.isForeign && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30" title={`References ${col.references}`}>
                                  <Link2 className="w-2.5 h-2.5" /> FK
                                </span>
                              )}
                              {col.isUnique && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  UNIQUE
                                </span>
                              )}
                            </div>
                            {col.references && (
                              <div className="text-[10px] text-blue-300 font-mono mt-0.5">
                                ➔ {col.references}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 text-slate-300 text-[11px]">
                            {col.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
