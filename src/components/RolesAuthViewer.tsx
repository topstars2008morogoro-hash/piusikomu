import React, { useState } from 'react';
import { Language, UserRole } from '../types';
import { AUTH_USERS } from '../data/authCredentials';
import {
  Shield,
  Key,
  Lock,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Smartphone,
  Server,
  Layers,
  Database,
  Fingerprint,
  PhoneCall,
  Terminal,
  ChevronRight,
  ShieldCheck,
  Copy,
  Check,
  KeyRound,
  User,
} from 'lucide-react';

interface RolesAuthViewerProps {
  language: Language;
}

interface PermissionRow {
  module: string;
  module_sw: string;
  action: string;
  action_sw: string;
  admin: boolean;
  teacher: boolean | 'partial';
  parent: boolean | 'partial';
  teacherNote?: string;
  teacherNote_sw?: string;
  parentNote?: string;
  parentNote_sw?: string;
}

export const RolesAuthViewer: React.FC<RolesAuthViewerProps> = ({ language }) => {
  const isSw = language === 'sw';
  const [selectedRole, setSelectedRole] = useState<UserRole>('teacher');
  const [authSolution, setAuthSolution] = useState<'firebase' | 'custom'>('firebase');
  const [testAction, setTestAction] = useState<string>('edit_marks');
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const permissions: PermissionRow[] = [
    {
      module: 'Student Profiles',
      module_sw: 'Wasifu wa Wanafunzi',
      action: 'Admit, Update & Delete Student Records',
      action_sw: 'Kusajili, Kuhuisha na Kufuta Kumbukumbu za Wanafunzi',
      admin: true,
      teacher: 'partial',
      parent: 'partial',
      teacherNote: 'View class roster; update emergency notes',
      teacherNote_sw: 'Kuangalia darasa; kuandika maelezo ya dharura',
      parentNote: 'Read own children data only',
      parentNote_sw: 'Kusoma taarifa za watoto wake pekee',
    },
    {
      module: 'Staff Management',
      module_sw: 'Usimamizi wa Walimu & Wafanyakazi',
      action: 'Hire, Assign Classes, Manage Payroll',
      action_sw: 'Kuajiri, Kupanga Madarasa, na Kusimamia Mishahara',
      admin: true,
      teacher: false,
      parent: false,
    },
    {
      module: 'Class & Curriculum',
      module_sw: 'Madarasa na Mitaala (KKK & NECTA)',
      action: 'Create Classes, Assign Streams & Teachers',
      action_sw: 'Kuunda Madarasa, Mikondo na Kupanga Walimu',
      admin: true,
      teacher: 'partial',
      parent: false,
      teacherNote: 'Read assigned schedule & student count',
      teacherNote_sw: 'Kusoma ratiba na idadi ya wanafunzi',
    },
    {
      module: 'Attendance Tracking',
      module_sw: 'Usimamizi wa Mahudhurio',
      action: 'Take Daily Roll Call (Present/Absent/Sick)',
      action_sw: 'Kupiga Mahudhurio ya Kila Siku Darasani',
      admin: true,
      teacher: true,
      parent: 'partial',
      parentNote: 'View daily presence timestamps of own child',
      parentNote_sw: 'Kuangalia muda wa mtoto wake kufika shuleni',
    },
    {
      module: 'Examinations & Marks',
      module_sw: 'Mitihani na Alama za NECTA',
      action: 'Enter Marks, Auto-grade, Publish Report Cards',
      action_sw: 'Kuingiza Alama, Kugawa Madaraja, na Kutoa Ripoti',
      admin: true,
      teacher: 'partial',
      parent: 'partial',
      teacherNote: 'Enter marks for assigned subjects only',
      teacherNote_sw: 'Kuingiza alama za masomo anayofundisha tu',
      parentNote: 'View & download verified report card',
      parentNote_sw: 'Kuangalia na kupakua ripoti iliyoidhinishwa',
    },
    {
      module: 'Fee Management',
      module_sw: 'Usimamizi wa Ada & Fedha (TZS)',
      action: 'Set Fee Structure, Verify Bank/M-Pesa Receipts',
      action_sw: 'Kuweka Viwango vya Ada, Kuthibitisha Malipo ya Benki/M-Pesa',
      admin: true,
      teacher: false,
      parent: 'partial',
      parentNote: 'View balance, receipts & generate Control Number',
      parentNote_sw: 'Kuangalia salio, risiti na kuzalisha Control Number',
    },
    {
      module: 'SMS Broadcast & Alerts',
      module_sw: 'Ujumbe wa SMS & Matangazo',
      action: 'Send Mass SMS to Parents (Morogoro Telcos)',
      action_sw: 'Kutuma SMS za Pamoja kwa Wazazi Wote',
      admin: true,
      teacher: 'partial',
      parent: false,
      teacherNote: 'Draft classroom notices for admin approval',
      teacherNote_sw: 'Kutunga tangazo la darasa likipitishwa na mkuu',
    },
    {
      module: 'System Audit Logs',
      module_sw: 'Kumbukumbu za Ulinzi (Audit Logs)',
      action: 'View Login Activity & Offline Sync History',
      action_sw: 'Kuangalia Walioingia na Historia ya Ulandanishaji',
      admin: true,
      teacher: false,
      parent: false,
    },
  ];

  // Live Sandbox Scenarios
  const sandboxScenarios = [
    {
      id: 'edit_marks',
      label_en: 'Input Standard IV Math Exam Scores',
      label_sw: 'Kuingiza Alama za Mtihani wa Hisabati Darasa la IV',
      eval: (role: UserRole) => {
        if (role === 'admin') return { allowed: true, msg_en: 'ALLOWED: Administrator holds master academic override permissions.', msg_sw: 'IMERUHUSIWA: Mkuu wa Shule ana mamlaka kamili ya kitaaluma.' };
        if (role === 'teacher') return { allowed: true, msg_en: 'ALLOWED: Permitted only if teacher is assigned to Standard IV Mathematics in class_subject_teachers.', msg_sw: 'IMERUHUSIWA: Iwapo mwalimu amepangiwa somo la Hisabati Darasa la IV kwenye jedwali la class_subject_teachers.' };
        return { allowed: false, msg_en: 'DENIED: Parents have read-only access to published final report cards. Cannot mutate raw scores.', msg_sw: 'IMEKATALIWA: Wazazi wana haki ya kusoma ripoti iliyotolewa tu, hawawezi kurekebisha alama.' };
      },
    },
    {
      id: 'view_financials',
      label_en: 'Access Total School Fee Collections & Defaulters List',
      label_sw: 'Kuangalia Makusanyo Yote ya Ada na Orodha ya Wenye Madeni',
      eval: (role: UserRole) => {
        if (role === 'admin') return { allowed: true, msg_en: 'ALLOWED: Full access to financial ledgers, bank balances, and TZS totals.', msg_sw: 'IMERUHUSIWA: Ufikiaji kamili wa fedha zote za shule, hesabu za benki, na makusanyo ya TZS.' };
        if (role === 'teacher') return { allowed: false, msg_en: 'DENIED: Teachers are barred from viewing overall school financial accounts to protect sensitive school balance data.', msg_sw: 'IMEKATALIWA: Walimu hawana ruhusa ya kuona akaunti za fedha za shule kulinda usiri wa mapato.' };
        return { allowed: false, msg_en: 'DENIED: Parents are strictly restricted to their own child ledger via WHERE parent_id = auth.uid().', msg_sw: 'IMEKATALIWA: Mzazi anaweza kuona akaunti ya mtoto wake pekee kupitia WHERE parent_id = auth.uid().' };
      },
    },
    {
      id: 'generate_control_number',
      label_en: 'Generate 12-Digit Payment Control Number for Tuition',
      label_sw: 'Kuzalisha Namba ya Udhibiti (Control Number) ya Kulipa Ada',
      eval: (role: UserRole) => {
        if (role === 'admin') return { allowed: true, msg_en: 'ALLOWED: Administrator can issue control numbers for any enrolled student.', msg_sw: 'IMERUHUSIWA: Mkuu wa shule anaweza kutoa control number kwa mwanafunzi yeyote.' };
        if (role === 'teacher') return { allowed: false, msg_en: 'DENIED: Financial invoicing handled exclusively by Bursar/Admin role.', msg_sw: 'IMEKATALIWA: Majukumu ya fedha hufanywa na Mhasibu au Mkuu wa Shule pekee.' };
        return { allowed: true, msg_en: 'ALLOWED: Parents can request automated payment control numbers for their enrolled children.', msg_sw: 'IMERUHUSIWA: Mzazi anaruhusiwa kuzalisha namba ya udhibiti ya kulipa ada ya mtoto wake.' };
      },
    },
    {
      id: 'send_bulk_sms',
      label_en: 'Broadcast Urgent SMS to All School Parents (Morogoro Network)',
      label_sw: 'Kutuma SMS ya Dharura kwa Wazazi Wote Shuleni',
      eval: (role: UserRole) => {
        if (role === 'admin') return { allowed: true, msg_en: 'ALLOWED: Authorized to execute SMS gateway dispatches via Beem Africa / Telcos.', msg_sw: 'IMERUHUSIWA: Mkuu wa shule ana idhini ya kutumia salio la SMS kutuma ujumbe kwa wazazi wote.' };
        if (role === 'teacher') return { allowed: false, msg_en: 'DENIED: Teachers must route bulk messages through administrative approval to prevent unauthorized broadcast charges.', msg_sw: 'IMEKATALIWA: Walimu hawawezi kutuma SMS kwa wazazi wote bila idhini ya Uongozi.' };
        return { allowed: false, msg_en: 'DENIED: Inbound communication only.', msg_sw: 'IMEKATALIWA: Wazazi hawana ruhusa ya kutuma matangazo ya shule.' };
      },
    },
  ];

  const currentScenario = sandboxScenarios.find((s) => s.id === testAction) || sandboxScenarios[0];
  const evalResult = currentScenario.eval(selectedRole);

  const firebaseAuthCode = `// Firebase Authentication & Custom Claims Setup
// Cloud Functions (Node.js/TypeScript)
import * as admin from 'firebase-admin';

// 1. Assign Role Custom Claims during user creation
export async function setUserRole(uid: string, role: 'admin' | 'teacher' | 'parent', metadata?: any) {
  await admin.auth().setCustomUserClaims(uid, {
    role,
    schoolId: 'top-stars-morogoro',
    assignedClasses: metadata?.assignedClasses || [], // e.g. ['STD-1A', 'STD-4A']
    studentIds: metadata?.studentIds || [],          // e.g. ['TS-2022-0045'] for parents
  });
}

// 2. Android Kotlin Token Verification
// The app attaches the Firebase ID token in HTTP Authorization: Bearer <token>
// Backend middleware validates claims:
export async function verifyRoleMiddleware(req, res, next) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decoded = await admin.auth().verifyIdToken(token);
  
  // Enforce Role-Based Access Control (RBAC)
  req.user = decoded; // Contains decoded.role ('admin' | 'teacher' | 'parent')
  next();
}`;

  const customAuthCode = `// Custom Backend Authentication (PostgreSQL + JWT + Argon2id)
// Server-Side API Middleware (Express / Fastify)
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

// 1. Password Verification during Login
export async function login(usernameOrPhone: string, passwordPlain: string) {
  const user = await db.query('SELECT * FROM users WHERE username = $1 OR phone_number = $1', [usernameOrPhone]);
  if (!user.rows[0]) throw new Error('Invalid credentials');

  const valid = await argon2.verify(user.rows[0].password_hash, passwordPlain);
  if (!valid) throw new Error('Invalid credentials');

  // Issue Short-Lived Access Token (15 mins) & Long-Lived Refresh Token (30 days)
  const accessToken = jwt.sign(
    { userId: user.rows[0].id, role: user.rows[0].role, phone: user.rows[0].phone_number },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return { accessToken, role: user.rows[0].role };
}

// 2. Row-Level Security (RLS) Query enforcement
// Ensures Parents can ONLY view their own children:
// SELECT * FROM students WHERE parent_id = (SELECT id FROM parents WHERE user_id = req.user.userId);`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(authSolution === 'firebase' ? firebaseAuthCode : customAuthCode);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
            {isSw ? 'Ulinzi na Uthibitishaji (Security & RBAC Architecture)' : 'Role-Based Access Control & Auth'}
          </span>
          <span className="text-slate-400 text-xs">• Zero Trust • Row-Level Security</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          {isSw
            ? 'Muundo wa Wajibu wa Watumiaji na Uthibitishaji (Roles & Authentication Module)'
            : 'User Roles & Secure Authentication Architecture'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
          {isSw
            ? 'Ufafanuzi wa kina wa ngazi tatu za watumiaji: Mkuu wa Shule (Admin), Mwalimu (Teacher), na Mzazi (Parent). Kila kundi lina Akaunti, Jina la Mtumiaji (Username), na Nenosiri (Password) la pekee lenye ulinzi madhubuti.'
            : 'Comprehensive specification of the three primary school personas: Admin, Teacher, and Parent. Each category features dedicated usernames, passwords, granular CRUD permissions, and zero-trust data protection.'}
        </p>
      </div>

      {/* NEW: Dedicated User Credentials Directory (Directly answering user's request) */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isSw ? 'Orodha ya Majina ya Watumiaji na Nenosiri (User Accounts & Credentials)' : 'Configured User Accounts & Passwords'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isSw
                ? 'Wazazi wana akaunti zao, Mkuu wa Shule ana ya kwake, na Walimu wana akaunti zao. Bofya kadi yoyote kunakili au kuingia moja kwa moja kwenye Simulator.'
                : 'Dedicated login credentials for Parents, Headteacher, and Classroom Teachers. Click copy icons to use on mobile login.'}
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold font-mono self-start sm:self-auto">
            Argon2id Hash Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AUTH_USERS.map((usr) => (
            <div
              key={usr.id}
              className={`p-4 rounded-xl border transition-all ${
                usr.role === 'admin'
                  ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400'
                  : usr.role === 'teacher'
                  ? 'bg-blue-950/20 border-blue-500/40 hover:border-blue-400'
                  : 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-400'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{usr.avatar_emoji}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{usr.full_name}</h4>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        usr.role === 'admin'
                          ? 'bg-amber-500/20 text-amber-300'
                          : usr.role === 'teacher'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {isSw ? usr.role_display_sw : usr.role_display_en}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mb-3 line-clamp-1">
                {isSw ? usr.associated_info_sw : usr.associated_info_en}
              </p>

              <div className="space-y-2 text-xs bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono">
                {/* Username */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Username:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-bold">{usr.username}</span>
                    <button
                      onClick={() => handleCopyText(usr.username, `${usr.id}-user`)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy username"
                    >
                      {copiedKey === `${usr.id}-user` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">Password:</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-bold ${
                        usr.role === 'admin'
                          ? 'text-amber-300'
                          : usr.role === 'teacher'
                          ? 'text-blue-300'
                          : 'text-emerald-300'
                      }`}
                    >
                      {usr.password_plain}
                    </span>
                    <button
                      onClick={() => handleCopyText(usr.password_plain, `${usr.id}-pass`)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="Copy password"
                    >
                      {copiedKey === `${usr.id}-pass` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mobile Phone */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Simu (SMS):</span>
                  <span className="text-slate-300">{usr.phone_number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Core Roles Architecture Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Role 1: Admin */}
        <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">👑</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                Superuser / Executive
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isSw ? 'Mkuu wa Shule / Mmiliki (Admin)' : 'Headteacher / School Admin'}
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isSw
                ? 'Mamlaka kamili juu ya wanafunzi wote, wafanyakazi, fedha, mitihani, na usimamizi wa mfumo.'
                : 'Unrestricted master supervisory access across academic records, staff appointments, fees, and system configuration.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider mb-1">
                {isSw ? 'Majukumu Makuu:' : 'Key Capabilities:'}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{isSw ? 'Kusajili wanafunzi na walimu wote' : 'Admit pupils & hire staff'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{isSw ? 'Kuweka viwango vya ada na kuona mapato' : 'Set fee structures & view full TZS revenue'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{isSw ? 'Kuidhinisha ripoti za mitihani ya NECTA' : 'Publish & approve final NECTA report cards'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>{isSw ? 'Kutuma Bulk SMS kwa wazazi wote' : 'Broadcast Bulk SMS to all school parents'}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-amber-300/80 bg-amber-950/40 p-2 rounded-lg border border-amber-900/60">
            RBAC Scope: ALL TENANTS & MODULES (CRUD)
          </div>
        </div>

        {/* Role 2: Teacher */}
        <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">👨‍🏫</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase">
                Academic Staff
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isSw ? 'Mwalimu wa Darasa / Somo (Teacher)' : 'Classroom & Subject Teacher'}
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isSw
                ? 'Ufikiaji uliopimwa kwa ajili ya mahudhurio, kuingiza alama, na usimamizi wa darasa alilopangiwa.'
                : 'Scoped academic privileges restricted to assigned grade streams, roll-call taking, and subject grading.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider mb-1">
                {isSw ? 'Majukumu Makuu:' : 'Key Capabilities:'}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{isSw ? 'Kupiga mahudhurio darasani (hata Offline)' : 'Take daily roll call (including offline mode)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{isSw ? 'Kuingiza alama za masomo anayofundisha' : 'Input scores for assigned subjects & classes'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>{isSw ? 'Kutunga maoni ya maendeleo ya mwanafunzi' : 'Write qualitative remarks on performance'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>{isSw ? 'Hawezi kuona au kurekebisha ada za fedha' : 'Blocked from financial & salary ledgers'}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-blue-300/80 bg-blue-950/40 p-2 rounded-lg border border-blue-900/60">
            RBAC Scope: ASSIGNED CLASSES & SUBJECTS
          </div>
        </div>

        {/* Role 3: Parent */}
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-lg">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">👨‍👩‍👧</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                Parent & Guardian
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {isSw ? 'Mzazi / Mlezi (Parent)' : 'Parent & Legal Guardian'}
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              {isSw
                ? 'Haki ya kuona maendeleo ya mtoto wake pekee (Row-Level Security), risiti za ada, na taarifa za shule.'
                : 'Strictly sandboxed read access confined to legally enrolled dependents with payment control numbers.'}
            </p>

            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="font-semibold text-slate-200 text-[11px] uppercase tracking-wider mb-1">
                {isSw ? 'Majukumu Makuu:' : 'Key Capabilities:'}
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{isSw ? 'Kupakua ripoti ya matokeo ya mtoto wake' : 'View & download certified report cards'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{isSw ? 'Kupokea taarifa ya mahudhurio ya kila siku' : 'Track daily attendance arrival timestamps'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>{isSw ? 'Kuzalisha Control No & kulipa kwa M-Pesa/Benki' : 'Generate Control No & pay via Mobile Money'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-400">
                <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                <span>{isSw ? 'Hawezi kuona alama au ada ya mtoto mwingine' : 'Cannot view records of other students'}</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-emerald-300/80 bg-emerald-950/40 p-2 rounded-lg border border-emerald-900/60">
            RBAC Scope: OWN DEPENDENTS ONLY (RLS)
          </div>
        </div>
      </div>

      {/* Interactive Permission Matrix Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 bg-slate-800/60 border-b border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>{isSw ? 'Jedwali Kamili la Ruhusa (Granular Permissions Matrix)' : 'Granular Role Permission Matrix'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isSw ? 'Mgawanyo wa haki za CRUD (Create, Read, Update, Delete) kwa kila moduli' : 'CRUD access policy across core modules'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> {isSw ? 'Inaruhusiwa' : 'Granted'}
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" /> {isSw ? 'Kwa Masharti (Scoped)' : 'Scoped'}
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <XCircle className="w-3.5 h-3.5" /> {isSw ? 'Imekataliwa' : 'Denied'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/50">
                <th className="py-3 px-4 w-48">{isSw ? 'Moduli' : 'Module'}</th>
                <th className="py-3 px-4">{isSw ? 'Kitendo / Haki' : 'Action / Capability'}</th>
                <th className="py-3 px-3 text-center w-28 text-amber-400">Admin</th>
                <th className="py-3 px-3 text-center w-36 text-blue-400">Teacher</th>
                <th className="py-3 px-3 text-center w-36 text-emerald-400">Parent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {permissions.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    {isSw ? p.module_sw : p.module}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {isSw ? p.action_sw : p.action}
                  </td>
                  {/* Admin column */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </td>
                  {/* Teacher column */}
                  <td className="py-3 px-3 text-center">
                    {p.teacher === true ? (
                      <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : p.teacher === 'partial' ? (
                      <div className="inline-flex flex-col items-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> Scoped
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5 max-w-[120px] truncate" title={isSw ? p.teacherNote_sw : p.teacherNote}>
                          {isSw ? p.teacherNote_sw : p.teacherNote}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-500/20 text-rose-400">
                        <XCircle className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  {/* Parent column */}
                  <td className="py-3 px-3 text-center">
                    {p.parent === true ? (
                      <span className="inline-flex items-center justify-center p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                      </span>
                    ) : p.parent === 'partial' ? (
                      <div className="inline-flex flex-col items-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300">
                          <AlertTriangle className="w-3 h-3" /> Own Child
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5 max-w-[120px] truncate" title={isSw ? p.parentNote_sw : p.parentNote}>
                          {isSw ? p.parentNote_sw : p.parentNote}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-flex items-center justify-center p-1 rounded-full bg-rose-500/20 text-rose-400">
                        <XCircle className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Permission Evaluation Sandbox */}
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>{isSw ? 'Kielelezo cha Ukaguzi wa Ruhusa (Live RBAC Evaluation Sandbox)' : 'Live RBAC Policy Enforcement Simulator'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isSw ? 'Chagua wasifu na kitendo kupima iwapo Seva itakubali au kukataa ombi' : 'Simulate API gateway policy evaluation across personas'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isSw ? '1. Chagua Wasifu Unaotaka Kupima:' : '1. Select Persona Role:'}
              </label>
              <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                {(['admin', 'teacher', 'parent'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                      selectedRole === r
                        ? r === 'admin'
                          ? 'bg-amber-500 text-slate-950 shadow'
                          : r === 'teacher'
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-emerald-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isSw ? '2. Chagua Kitendo Kinachoomba Kufanyika:' : '2. Action to Execute:'}
              </label>
              <select
                value={testAction}
                onChange={(e) => setTestAction(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-medium"
              >
                {sandboxScenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {isSw ? sc.label_sw : sc.label_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Evaluation Result Display */}
          <div
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 ${
              evalResult.allowed
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {isSw ? 'Jibu la Usalama (Authorization Decision)' : 'Policy Evaluation Result'}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-black uppercase ${
                    evalResult.allowed
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {evalResult.allowed ? (isSw ? 'IMERUHUSIWA' : 'GRANTED') : (isSw ? 'IMEKATALIWA' : 'DENIED')}
                </span>
              </div>
              <p className="text-xs leading-relaxed font-medium">
                {isSw ? evalResult.msg_sw : evalResult.msg_en}
              </p>
            </div>

            <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
              <span>Policy: Zero-Trust RBAC</span>
              <span>Audit Log: 2026-09-15 09:41 UTC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Mechanisms Deep-Dive (Firebase vs Custom Backend) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>{isSw ? 'Mifumo ya Uthibitishaji Salama (Authentication Mechanisms)' : 'Secure Authentication Architecture Options'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isSw
                ? 'Ulinganisho wa kina wa njia mbili zinazopendekezwa kwa mazingira ya shule ya Morogoro'
                : 'Evaluation of Firebase Authentication vs. Custom Argon2id/JWT for Tanzanian school deployments'}
            </p>
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => setAuthSolution('firebase')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                authSolution === 'firebase' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Option 1: Firebase Auth (Recommended)
            </button>
            <button
              onClick={() => setAuthSolution('custom')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                authSolution === 'custom' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Option 2: Custom PostgreSQL + JWT
            </button>
          </div>
        </div>

        {/* Option 1: Firebase Auth Details */}
        {authSolution === 'firebase' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-amber-400 flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4" />
                  <span>{isSw ? 'Namba ya Simu + SMS OTP' : 'Phone Number SMS OTP'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isSw
                    ? 'Wazazi wengi Tanzania hawana barua pepe (email). Firebase inaruhusu kuingia kwa namba ya simu ya Vodacom, Airtel, Tigo, au Halotel kwa kutumia nambari fupi ya siri (OTP).'
                    : 'Eliminates reliance on forgotten emails. Parents login via verified Vodacom, Airtel, or Tigo phone numbers with 6-digit SMS OTP.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-blue-400 flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  <span>{isSw ? 'Custom Claims (RBAC)' : 'Firebase Custom Claims'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isSw
                    ? 'Haki za mtumiaji (`role: admin`, `assignedClasses: [STD-4A]`) zinapachikwa moja kwa moja ndani ya JWT Token ya Firebase na kuthibitishwa bila kuchelewa.'
                    : 'Appends cryptographically signed metadata ({ role: "teacher", class: "STD-4" }) within the JWT token, reducing backend round trips.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4" />
                  <span>{isSw ? 'Biometiki (Alama ya Kidole)' : 'Biometric Keystore Sync'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isSw
                    ? 'Kwenye Android, tokeni ya Firebase inalindwa na Android BiometricPrompt (Fingerprint) na kuhifadhiwa kwenye EncryptedSharedPreferences.'
                    : 'Tokens securely stored in Android EncryptedSharedPreferences backed by hardware Keystore and BiometricPrompt fingerprint unlock.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Option 2: Custom Backend Details */}
        {authSolution === 'custom' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-blue-400 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>{isSw ? 'Argon2id Password Hashing' : 'Argon2id Hash Algorithm'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isSw
                    ? 'Kiwango cha juu zaidi duniani cha ulinzi wa nywila (password), kinalinda dhidi ya mashambulizi ya GPU na mashine za kisasa.'
                    : 'Winner of Password Hashing Competition. Highly resistant to brute-force GPU and side-channel cracking.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  <span>{isSw ? 'Access + Refresh Tokens' : 'Dual-Token Architecture'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isSw
                    ? 'Access token inakaa dakika 15 tu kwa usalama; Refresh token inakaa siku 30 kwenye simu ya mwalimu ili asilazimike kuingiza namba kila anapofungua app.'
                    : 'Short-lived 15-minute access token combined with rotated 30-day refresh token stored in Android Keystore for persistent offline capability.'}
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-purple-400 flex items-center gap-1.5">
                  <Server className="w-4 h-4" />
                  <span>{isSw ? 'Umiliki Kamili wa Data' : 'Zero Vendor Lock-In'}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {isSw
                    ? 'Database na watumiaji wote wanakaa ndani ya PostgreSQL yako binafsi bila kulipia gharama za kila mtumiaji kwa mtoa huduma wa nje.'
                    : 'Complete sovereign control over user databases, audit tables, and authentication logs hosted in your private PostgreSQL cluster.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Code Snippet Viewer */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 font-bold">
              {authSolution === 'firebase'
                ? 'firebase_custom_claims_middleware.ts'
                : 'custom_jwt_argon2_auth.ts'}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 border border-slate-700"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? (isSw ? 'Imenakiliwa' : 'Copied') : (isSw ? 'Nakili Code' : 'Copy Code')}</span>
            </button>
          </div>

          <div className="p-4 overflow-x-auto max-h-[350px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700">
            <pre>
              <code>{authSolution === 'firebase' ? firebaseAuthCode : customAuthCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
