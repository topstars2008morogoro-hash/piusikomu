import React, { useState } from 'react';
import { Language, AuthUser, UserRole } from '../types';
import { AUTH_USERS, authenticateUser } from '../data/authCredentials';
import { SchoolLogo } from './SchoolLogo';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Fingerprint,
  LogIn,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

interface LoginScreenProps {
  language: Language;
  onLoginSuccess: (user: AuthUser) => void;
  selectedRoleSuggestion?: UserRole;
  onOpenAdmissionForm?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  language,
  onLoginSuccess,
  selectedRoleSuggestion = 'admin',
  onOpenAdmissionForm,
}) => {
  const isSw = language === 'sw';

  // State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeAccountTab, setActiveAccountTab] = useState<UserRole>(selectedRoleSuggestion);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!usernameInput.trim()) {
      setErrorMessage(
        isSw ? 'Tafadhali ingiza jina la mtumiaji au namba ya simu.' : 'Please enter your username or phone number.'
      );
      return;
    }

    if (!passwordInput.trim()) {
      setErrorMessage(isSw ? 'Tafadhali ingiza nenosiri lako.' : 'Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate mobile biometric / API auth delay
    setTimeout(() => {
      setIsLoading(false);
      const user = authenticateUser(usernameInput, passwordInput);

      if (user) {
        onLoginSuccess(user);
      } else {
        setErrorMessage(
          isSw
            ? '❌ Jina la mtumiaji au nenosiri si sahihi! Angalia herufi kubwa/ndogo au tumia akaunti za majaribio hapa chini.'
            : '❌ Invalid username or password! Please verify credentials or select a demo account below.'
        );
      }
    }, 450);
  };

  // Quick autofill helper
  const handleSelectQuickAccount = (user: AuthUser) => {
    setUsernameInput(user.username);
    setPasswordInput(user.password_plain);
    setActiveAccountTab(user.role);
    setErrorMessage(null);
  };

  const handleBiometricLogin = () => {
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      // Pick matching account for current tab
      const matched = AUTH_USERS.find((u) => u.role === activeAccountTab) || AUTH_USERS[0];
      onLoginSuccess(matched);
    }, 500);
  };

  return (
    <div className="w-full max-w-md mx-auto py-2 px-1 sm:px-2 flex flex-col items-center">
      {/* School Crest & Welcome */}
      <div className="text-center mb-5 flex flex-col items-center">
        <SchoolLogo size="lg" className="mb-2" />
        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
          Top Stars Nursery & Primary School
        </h2>
        <p className="text-xs text-amber-400 font-medium">Morogoro, Tanzania • Est. 2008</p>

        {/* Sliding School Motto Ticker */}
        <div className="mt-2.5 w-full max-w-xs overflow-hidden rounded-full bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 px-2 py-0.5 shadow-inner">
          <div className="animate-marquee-mobile inline-flex items-center text-[10px] font-black text-amber-300 tracking-wider uppercase">
            <span className="mr-8 flex items-center gap-1.5">
              <span>⭐</span>
              <span>QUALITY EDUCATION, ETHICS AND VALUES</span>
            </span>
            <span className="mr-8 flex items-center gap-1.5">
              <span>⭐</span>
              <span>QUALITY EDUCATION, ETHICS AND VALUES</span>
            </span>
          </div>
        </div>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{isSw ? 'Mfumo Salama wa Usimamizi wa Shule' : 'School Management System Portal'}</span>
        </div>
      </div>

      {/* Role Quick Switch Tabs for Credentials Demo */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5 px-1 font-semibold uppercase tracking-wider">
          <span>{isSw ? 'Chagua Wasifu wa Kujaribu:' : 'Select Demo Account:'}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => {
              const u = AUTH_USERS.find((x) => x.role === 'admin')!;
              handleSelectQuickAccount(u);
            }}
            className={`py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeAccountTab === 'admin'
                ? 'bg-amber-500 text-slate-950 shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="text-sm">👑</span>
            <span className="leading-tight">{isSw ? 'Mkuu wa Shule' : 'Headteacher'}</span>
            <span className="text-[9px] opacity-80">(Admin)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const u = AUTH_USERS.find((x) => x.role === 'teacher')!;
              handleSelectQuickAccount(u);
            }}
            className={`py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeAccountTab === 'teacher'
                ? 'bg-blue-600 text-white shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="text-sm">👩‍🏫</span>
            <span className="leading-tight">{isSw ? 'Mwalimu' : 'Teacher'}</span>
            <span className="text-[9px] opacity-80">(Darasa la IV)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const u = AUTH_USERS.find((x) => x.role === 'parent')!;
              handleSelectQuickAccount(u);
            }}
            className={`py-2 px-1 rounded-lg text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all ${
              activeAccountTab === 'parent'
                ? 'bg-emerald-600 text-white shadow-md scale-102'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <span className="text-sm">👨‍👩‍👧</span>
            <span className="leading-tight">{isSw ? 'Mzazi' : 'Parent'}</span>
            <span className="text-[9px] opacity-80">(Mzee Juma)</span>
          </button>
        </div>
      </div>

      {/* Main Login Form Card */}
      <div className="w-full bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>{isSw ? 'Ingia na Akaunti Yako' : 'Sign in to your account'}</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isSw
              ? 'Weka jina la mtumiaji (username) na nenosiri (password) lako kuendelea.'
              : 'Enter your assigned school username and password to proceed.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/60 text-xs text-rose-200 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Username / Phone Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              {isSw ? 'Jina la Mtumiaji / Namba ya Simu:' : 'Username or Mobile Phone:'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="login-username-input"
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder={isSw ? 'mfano: admin, mwl.msangi, au mzazi.juma' : 'e.g. admin, mwl.msangi, mzazi.juma'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                {isSw ? 'Nenosiri (Password):' : 'Password:'}
              </label>
              <span className="text-[10px] text-amber-400 font-mono">
                {activeAccountTab === 'admin'
                  ? 'admin@topstars2026'
                  : activeAccountTab === 'teacher'
                  ? 'teacher@topstars2026'
                  : 'parent@topstars2026'}
              </span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password-input"
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={isSw ? 'Weka nenosiri...' : 'Enter password...'}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Security status */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-amber-400/30"
              />
              <span className="text-[11px] text-slate-300">
                {isSw ? 'Kumbuka kwenye simu hii' : 'Remember on this device'}
              </span>
            </label>

            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Argon2id Hash</span>
            </span>
          </div>

          {/* Submit Login Button */}
          <button
            id="btn-submit-login"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{isSw ? 'Ingia kwenye Mfumo' : 'Sign In'}</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-900 px-2 text-slate-400 font-medium">
              {isSw ? 'Au Ingia kwa Urahisi' : 'Or Quick Access'}
            </span>
          </div>
        </div>

        {/* Biometric Fingerprint Button */}
        <button
          id="btn-biometric-login"
          type="button"
          onClick={handleBiometricLogin}
          disabled={isLoading}
          className="w-full py-2 px-3 bg-slate-950 hover:bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Fingerprint className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>{isSw ? 'Ingia kwa Alama ya Kidole (Biometric)' : 'Sign In with Fingerprint (Biometric)'}</span>
        </button>
      </div>

      {/* Available User Credentials Directory Card */}
      <div className="w-full mt-4 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-xs text-slate-300">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-white flex items-center gap-1.5 text-[11px]">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{isSw ? 'Orodha ya Akaunti na Nenosiri Rasmi:' : 'Official Credentials Directory:'}</span>
          </span>
          <span className="text-[10px] text-amber-400 font-mono">Top Stars 2026</span>
        </div>

        <div className="space-y-2">
          {/* Admin Row */}
          <div
            onClick={() => handleSelectQuickAccount(AUTH_USERS[0])}
            className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 cursor-pointer flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <div>
                <div className="font-semibold text-white text-[11px] group-hover:text-amber-400 transition-colors">
                  {isSw ? 'Mkuu wa Shule (Mwl. Kavishe)' : 'Headteacher (Admin)'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  User: <span className="text-amber-300 font-bold">admin</span> • Pass:{' '}
                  <span className="text-amber-300 font-bold">admin@topstars2026</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </div>

          {/* Teacher Row */}
          <div
            onClick={() => handleSelectQuickAccount(AUTH_USERS[1])}
            className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 cursor-pointer flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">👩‍🏫</span>
              <div>
                <div className="font-semibold text-white text-[11px] group-hover:text-blue-400 transition-colors">
                  {isSw ? 'Mwalimu (Mwl. Rehema Msangi)' : 'Teacher (Standard IV)'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  User: <span className="text-blue-300 font-bold">mwl.msangi</span> • Pass:{' '}
                  <span className="text-blue-300 font-bold">teacher@topstars2026</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400 transition-colors" />
          </div>

          {/* Parent Row */}
          <div
            onClick={() => handleSelectQuickAccount(AUTH_USERS[3])}
            className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 cursor-pointer flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">👨‍👧</span>
              <div>
                <div className="font-semibold text-white text-[11px] group-hover:text-emerald-400 transition-colors">
                  {isSw ? 'Mzazi (Mzee Juma Mohamed)' : 'Parent (Mzee Juma)'}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  User: <span className="text-emerald-300 font-bold">mzazi.juma</span> • Pass:{' '}
                  <span className="text-emerald-300 font-bold">parent@topstars2026</span>
                </div>
              </div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};
