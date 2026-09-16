import React, { useState } from 'react';
import { Language, AdmissionApplication, AdmissionLevel, PaymentChannel } from '../types';
import { MOROGORO_WARDS, SCHOOL_BUS_ROUTES, getAdmissionFeeBreakdown } from '../data/mockAdmissions';
import { SchoolLogo } from './SchoolLogo';
import {
  X,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  Phone,
  CreditCard,
  FileCheck2,
  Calendar,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  Building,
  Upload,
  Bus,
  ShieldCheck,
  Printer,
  HeartPulse,
  Clock,
  Download,
} from 'lucide-react';

interface AdmissionFormModalProps {
  language: Language;
  onClose: () => void;
  onSubmitAdmission: (application: AdmissionApplication) => void;
  initialParentPhone?: string;
  initialParentName?: string;
}

export const AdmissionFormModal: React.FC<AdmissionFormModalProps> = ({
  language,
  onClose,
  onSubmitAdmission,
  initialParentPhone = '',
  initialParentName = '',
}) => {
  const isSw = language === 'sw';
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1: Child Information
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [dob, setDob] = useState('2022-05-15');
  const [level, setLevel] = useState<AdmissionLevel>('nursery');
  const [applyingClass, setApplyingClass] = useState('Baby Class (Miaka 3 - 4)');
  const [birthCertNo, setBirthCertNo] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [hasAllergies, setHasAllergies] = useState(false);
  const [photoSelected, setPhotoSelected] = useState<string>(
    'https://images.unsplash.com/photo-1543332164-6e82f355badc?w=150&auto=format&fit=crop&q=80'
  );

  // STEP 2: Parent / Guardian Information
  const [parentName, setParentName] = useState(initialParentName);
  const [relationship, setRelationship] = useState<'baba' | 'mama' | 'mlezi'>('baba');
  const [parentPhone, setParentPhone] = useState(initialParentPhone);
  const [altPhone, setAltPhone] = useState('');
  const [nidaNo, setNidaNo] = useState('');
  const [occupation, setOccupation] = useState('');
  const [residenceWard, setResidenceWard] = useState(MOROGORO_WARDS[0]);
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [needsBus, setNeedsBus] = useState(true);
  const [busRoute, setBusRoute] = useState(SCHOOL_BUS_ROUTES[1]);

  // STEP 3: Payment Details
  const [paymentMethod, setPaymentMethod] = useState<PaymentChannel>('M-Pesa');
  const [controlNumber] = useState<string>(() => '991200845' + Math.floor(100 + Math.random() * 900));
  const [transactionRef, setTransactionRef] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(() => (level === 'nursery' ? 465000 : 530000));
  const [isCopiedControl, setIsCopiedControl] = useState(false);
  const [slipAttached, setSlipAttached] = useState(true);

  // STEP 4: Status / Submitted Result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<AdmissionApplication | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto calculate age from DOB
  const calculateAge = (dateStr: string) => {
    if (!dateStr) return { years: 0, months: 0, text: '' };
    const birthDate = new Date(dateStr);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months = (12 + months) % 12;
    }
    return {
      years,
      months,
      text: isSw ? `Miaka ${years}, Miezi ${months}` : `${years} yrs, ${months} mos`,
    };
  };

  const ageInfo = calculateAge(dob);

  // Level auto-adjustment helper
  const handleLevelChange = (newLevel: AdmissionLevel) => {
    setLevel(newLevel);
    if (newLevel === 'nursery') {
      setApplyingClass('Baby Class (Miaka 3 - 4)');
      setAmountPaid(needsBus ? 465000 : 410000);
    } else {
      setApplyingClass('Standard I (Darasa la 1)');
      setAmountPaid(needsBus ? 530000 : 470000);
    }
  };

  const feeItems = getAdmissionFeeBreakdown(level, needsBus);
  const totalRequired = feeItems.reduce((sum, item) => sum + item.amount_tzs, 0);

  const handleCopyControl = () => {
    navigator.clipboard.writeText(controlNumber);
    setIsCopiedControl(true);
    setTimeout(() => setIsCopiedControl(false), 2000);
  };

  // Step Validation
  const validateStep1 = () => {
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage(isSw ? 'Tafadhali jaza jina la kwanza na jina la ukoo la mtoto.' : 'Please enter child first and last name.');
      return false;
    }
    if (!dob) {
      setErrorMessage(isSw ? 'Tafadhali weka tarehe ya kuzaliwa ya mtoto.' : 'Please enter child birth date.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep2 = () => {
    if (!parentName.trim()) {
      setErrorMessage(isSw ? 'Tafadhali jaza jina kamili la mzazi/mlezi.' : 'Please enter parent/guardian full name.');
      return false;
    }
    if (!parentPhone.trim() || parentPhone.length < 9) {
      setErrorMessage(isSw ? 'Tafadhali weka namba sahihi ya simu ya mzazi.' : 'Please enter a valid phone number.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const validateStep3 = () => {
    if (!transactionRef.trim()) {
      setErrorMessage(
        isSw
          ? 'Tafadhali weka namba ya kumbukumbu ya muamala (Reference / M-Pesa Code au Namba ya Risiti ya Benki).'
          : 'Please enter transaction reference number or deposit slip receipt code.'
      );
      return false;
    }
    if (amountPaid <= 0) {
      setErrorMessage(isSw ? 'Tafadhali weka kiasi halisi kilicholipwa.' : 'Please enter amount paid.');
      return false;
    }
    setErrorMessage(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setCurrentStep(4);
  };

  const handleFinalSubmit = () => {
    if (!agreeTerms) {
      setErrorMessage(
        isSw
          ? 'Tafadhali kubali sheria na kanuni za shule ya Top Stars kabla ya kutuma.'
          : 'Please accept Top Stars school policies to proceed.'
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const refNo = `TS-ADM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: AdmissionApplication = {
      id: `adm-${Date.now()}`,
      reference_number: refNo,
      application_date: new Date().toISOString().split('T')[0],
      academic_year: '2026/2027',
      level,
      applying_for_class: applyingClass,
      child: {
        first_name: firstName.trim(),
        middle_name: middleName.trim() || '—',
        last_name: lastName.trim(),
        gender,
        date_of_birth: dob,
        age_display: ageInfo.text,
        birth_certificate_no: birthCertNo.trim() || `RITA-MOR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
        previous_school: previousSchool.trim() || (level === 'nursery' ? 'Nyumbani (Mwanafunzi Mpya)' : 'Nursery School'),
        health_medical_notes: medicalNotes.trim() || (isSw ? 'Mzima wa afya njema.' : 'Good health, no chronic conditions.'),
        has_allergies: hasAllergies,
        photo_url: photoSelected,
      },
      parent: {
        parent_name: parentName.trim(),
        relationship,
        phone_number: parentPhone.trim(),
        alt_phone_number: altPhone.trim() || undefined,
        nida_number: nidaNo.trim() || undefined,
        occupation: occupation.trim() || (isSw ? 'Mfanyabiashara' : 'Employed / Business'),
        residence_ward: residenceWard,
        emergency_contact_name: emergencyContactName.trim() || parentName.trim(),
        emergency_contact_phone: emergencyContactPhone.trim() || parentPhone.trim(),
        needs_school_bus: needsBus,
        bus_route: needsBus ? busRoute : undefined,
      },
      payment: {
        total_required_tzs: totalRequired,
        amount_paid_tzs: amountPaid,
        balance_tzs: Math.max(0, totalRequired - amountPaid),
        payment_method: paymentMethod,
        control_number: controlNumber,
        transaction_reference: transactionRef.trim().toUpperCase(),
        payment_date: new Date().toISOString().split('T')[0],
        payment_status: 'verified',
        receipt_number: `REC-ADM-${refNo.split('-').pop()}`,
        breakdown: feeItems,
        slip_attachment_name: `malipo_${firstName.toLowerCase()}_${paymentMethod.toLowerCase().replace(/\s+/g, '_')}.png`,
      },
      status: 'submitted',
      admin_notes: isSw
        ? `Fomu ya mtandao imejazwa na mzazi ${parentName}. Malipo ya TZS ${amountPaid.toLocaleString()} kupitia ${paymentMethod} yamepokelewa.`
        : `Online admission submitted by parent ${parentName}. Payment of TZS ${amountPaid.toLocaleString()} recorded.`,
      reporting_date: '05 Januari 2027',
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedApp(newApp);
      onSubmitAdmission(newApp);
    }, 700);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/80 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SchoolLogo size="sm" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  {isSw ? 'Fomu ya Dijitali ya Kujiunga na Shule' : 'Digital Admission & Enrollment Form'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300">
                  2026/2027
                </span>
              </div>
              <p className="text-[11px] text-amber-400 font-medium">
                Top Stars Nursery & Primary School • Morogoro, Tanzania
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

        {/* Step Indicator */}
        {!submittedApp && (
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  currentStep === 1
                    ? 'text-amber-400 font-bold'
                    : currentStep > 1
                    ? 'text-emerald-400 font-medium'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    currentStep === 1
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : currentStep > 1
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
                </div>
                <span className="text-[10px] leading-tight truncate">
                  {isSw ? 'Mtoto' : 'Child Bio'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1()) setCurrentStep(2);
                }}
                className={`flex flex-col items-center gap-1 transition-all ${
                  currentStep === 2
                    ? 'text-amber-400 font-bold'
                    : currentStep > 2
                    ? 'text-emerald-400 font-medium'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    currentStep === 2
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : currentStep > 2
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                </div>
                <span className="text-[10px] leading-tight truncate">
                  {isSw ? 'Mzazi & Makazi' : 'Parent & Area'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1() && validateStep2()) setCurrentStep(3);
                }}
                className={`flex flex-col items-center gap-1 transition-all ${
                  currentStep === 3
                    ? 'text-amber-400 font-bold'
                    : currentStep > 3
                    ? 'text-emerald-400 font-medium'
                    : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    currentStep === 3
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : currentStep > 3
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
                </div>
                <span className="text-[10px] leading-tight truncate">
                  {isSw ? 'Malipo ya Awali' : 'Initial Fee'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (validateStep1() && validateStep2() && validateStep3()) setCurrentStep(4);
                }}
                className={`flex flex-col items-center gap-1 transition-all ${
                  currentStep === 4 ? 'text-amber-400 font-bold' : 'text-slate-500'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border ${
                    currentStep === 4
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'border-slate-700 bg-slate-900 text-slate-500'
                  }`}
                >
                  4
                </div>
                <span className="text-[10px] leading-tight truncate">
                  {isSw ? 'Uhakiki & Tuma' : 'Review & Submit'}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert Bar */}
        {errorMessage && (
          <div className="bg-rose-950/80 border-b border-rose-500/50 p-2.5 px-4 text-xs text-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs flex-1">
          {submittedApp ? (
            /* SUCCESS CONFIRMATION & PROVISIONAL ADMISSION SLIP */
            <div className="space-y-4 animate-in fade-in zoom-in-95">
              <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-extrabold text-white">
                  {isSw ? 'Hongera! Maombi Yametumwa Kikamilifu' : 'Enrollment Application Submitted!'}
                </h3>
                <p className="text-xs text-emerald-300 mt-1 max-w-md mx-auto">
                  {isSw
                    ? `Taarifa za mtoto ${submittedApp.child.first_name} ${submittedApp.child.last_name} zimehifadhiwa kwenye database ya Shule ya Top Stars na SMS ya uthibitisho imetumwa kwa namba ${submittedApp.parent.phone_number}.`
                    : `Application for ${submittedApp.child.first_name} ${submittedApp.child.last_name} has been stored in Top Stars database. Confirmation SMS sent to ${submittedApp.parent.phone_number}.`}
                </p>
                <div className="mt-3 inline-flex items-center gap-2 bg-slate-900/90 px-3 py-1.5 rounded-xl border border-amber-500/40 text-amber-300 font-mono font-bold text-xs">
                  <span>{isSw ? 'Namba ya Kumbukumbu (Reference):' : 'Application Ref:'}</span>
                  <span className="text-white bg-amber-500/20 px-2 py-0.5 rounded">
                    {submittedApp.reference_number}
                  </span>
                </div>
              </div>

              {/* Printable Provisional Admission Slip Card */}
              <div
                id="admission-provisional-slip"
                className="bg-slate-950 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-slate-200 shadow-inner relative overflow-hidden"
              >
                {/* Watermark Logo */}
                <div className="absolute right-3 top-3 opacity-10 pointer-events-none">
                  <SchoolLogo size="lg" />
                </div>

                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                      {isSw ? 'HATI YA AWALI YA UDAHILI' : 'PROVISIONAL ADMISSION RECEIPT'}
                    </span>
                    <h4 className="text-sm font-black text-white">TOP STARS NURSERY & PRIMARY SCHOOL</h4>
                    <p className="text-[10px] text-slate-400">P.O. Box 2008, Morogoro • Reg: EM.14208/TZ</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">{isSw ? 'Tarehe:' : 'Date:'}</span>
                    <p className="font-mono text-[11px] text-white font-bold">{submittedApp.application_date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isSw ? 'Mwanafunzi:' : 'Pupil:'}</span>
                    <span className="font-bold text-white">
                      {submittedApp.child.first_name} {submittedApp.child.middle_name} {submittedApp.child.last_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isSw ? 'Darasa Lililoombwa:' : 'Class:'}</span>
                    <span className="font-bold text-amber-300">{submittedApp.applying_for_class}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isSw ? 'Umri / Tarehe ya Kuzaliwa:' : 'Age / DOB:'}</span>
                    <span className="text-white">{submittedApp.child.age_display} ({submittedApp.child.date_of_birth})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isSw ? 'Mzazi / Mlezi:' : 'Parent / Guardian:'}</span>
                    <span className="font-bold text-white">{submittedApp.parent.parent_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isSw ? 'Simu ya Mzazi:' : 'Phone:'}</span>
                    <span className="font-mono text-emerald-400">{submittedApp.parent.phone_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{isSw ? 'Makazi / Eneo:' : 'Residence:'}</span>
                    <span className="text-white">{submittedApp.parent.residence_ward}</span>
                  </div>
                </div>

                {/* Payment Breakdown table */}
                <div className="border border-slate-800 rounded-xl overflow-hidden mb-3">
                  <div className="bg-slate-900 px-3 py-1.5 font-bold text-slate-300 flex justify-between text-[11px]">
                    <span>{isSw ? 'Kipengele cha Malipo' : 'Fee Item'}</span>
                    <span>{isSw ? 'Kiasi (TZS)' : 'Amount (TZS)'}</span>
                  </div>
                  <div className="divide-y divide-slate-800 text-[11px]">
                    {submittedApp.payment.breakdown.map((item) => (
                      <div key={item.id} className="px-3 py-1.5 flex justify-between text-slate-300">
                        <span>{isSw ? item.name_sw : item.name_en}</span>
                        <span className="font-mono">TZS {item.amount_tzs.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="px-3 py-2 bg-slate-900/60 flex justify-between font-bold text-white">
                      <span>{isSw ? 'Jumla ya Awali Iliyolipwa:' : 'Total Initial Amount Paid:'}</span>
                      <span className="font-mono text-emerald-400">
                        TZS {submittedApp.payment.amount_paid_tzs.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-[10px] text-amber-200/90 flex items-start gap-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-0.5">
                      {isSw ? 'Hatua Zinazofuata (Next Steps):' : 'Next Steps:'}
                    </p>
                    <p>
                      {isSw
                        ? '1. Mkuu wa shule atahakiki nyaraka zako na kuthibitisha stream ya darasa. 2. Utapokea SMS ya namba rasmi ya udahili na tarehe ya kuanza muhula (05/01/2027). 3. Fika ofisini na cheti halisi cha kuzaliwa cha mtoto kuchukua sare za shule.'
                        : '1. Headteacher will review particulars and assign class stream. 2. You will receive an SMS with official student admission number. 3. Bring original birth certificate when picking up school uniforms.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Slip */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center gap-2 border border-slate-700 shadow-md transition-all"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  <span>{isSw ? 'Chapisha / Pakua Risiti (Print)' : 'Print / Download Slip'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg transition-all"
                >
                  <span>{isSw ? 'Kamilisha & Funga' : 'Finish & Close'}</span>
                </button>
              </div>
            </div>
          ) : (
            /* STEP BY STEP FORM FLOW */
            <>
              {/* STEP 1: Child Information */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white text-xs flex items-center gap-1.5 mb-1">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>{isSw ? 'Hatua 1: Taarifa Binafsi za Mtoto' : 'Step 1: Child Biodata'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isSw
                        ? 'Jaza majina kamili ya mtoto kama yalivyo kwenye cheti cha kuzaliwa cha RITA.'
                        : 'Enter child full legal names as appearing on birth certificate.'}
                    </p>
                  </div>

                  {/* Level Switcher (Nursery vs Primary) */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {isSw ? 'Kiwango cha Elimu Unachoomba:' : 'Education Level Applying For:'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleLevelChange('nursery')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          level === 'nursery'
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>🧸</span>
                          <span>{isSw ? 'Elimu ya Awali (Nursery)' : 'Nursery & Pre-School'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isSw ? 'Daycare, Baby Class, Middle Class, Pre-Unit (Miaka 2 - 5)' : 'Ages 2 - 5 years'}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleLevelChange('primary')}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          level === 'primary'
                            ? 'bg-amber-500/20 border-amber-400 text-white shadow-md'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-xs flex items-center gap-1.5">
                          <span>🎒</span>
                          <span>{isSw ? 'Elimu ya Msingi (Primary)' : 'Primary School'}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isSw ? 'Darasa la I hadi VII (Mtaala wa NECTA)' : 'Standard I to VII (NECTA)'}
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Child Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Jina la Kwanza *' : 'First Name *'}
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Baraka, Junior, Neema"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Jina la Kati' : 'Middle Name'}
                      </label>
                      <input
                        type="text"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        placeholder="e.g. Juma, Rashidi"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Jina la Ukoo *' : 'Last / Surname *'}
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="e.g. Mohamed, Massawe"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Gender & DOB with Age display */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Jinsia *' : 'Gender *'}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setGender('M')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                            gender === 'M'
                              ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          👦 {isSw ? 'Mvulana' : 'Boy'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('F')}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                            gender === 'F'
                              ? 'bg-rose-600/30 border-rose-400 text-rose-200 shadow'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          👧 {isSw ? 'Msichana' : 'Girl'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Tarehe ya Kuzaliwa *' : 'Date of Birth *'}
                      </label>
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">{isSw ? 'Umri wa Mtoto:' : 'Calculated Age:'}</span>
                        <span className="font-bold text-amber-300">{ageInfo.text}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                        {isSw ? 'Anastahili' : 'Eligible'}
                      </span>
                    </div>
                  </div>

                  {/* Applying For Class */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Darasa Analoomba Kujiunga *' : 'Class Applying For *'}
                      </label>
                      <select
                        value={applyingClass}
                        onChange={(e) => setApplyingClass(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      >
                        {level === 'nursery' ? (
                          <>
                            <option value="Day Care (Miaka 2 - 3)">Day Care (Miaka 2 - 3)</option>
                            <option value="Baby Class (Miaka 3 - 4)">Baby Class (Miaka 3 - 4)</option>
                            <option value="Middle Class (Miaka 4 - 5)">Middle Class (Miaka 4 - 5)</option>
                            <option value="Pre-Unit (Awali - Miaka 5 - 6)">Pre-Unit (Awali - Miaka 5 - 6)</option>
                          </>
                        ) : (
                          <>
                            <option value="Standard I (Darasa la 1)">Standard I (Darasa la 1)</option>
                            <option value="Standard II (Darasa la 2)">Standard II (Darasa la 2)</option>
                            <option value="Standard III (Darasa la 3)">Standard III (Darasa la 3)</option>
                            <option value="Standard IV (Darasa la 4 - SFNA)">Standard IV (Darasa la 4 - SFNA)</option>
                            <option value="Standard V (Darasa la 5)">Standard V (Darasa la 5)</option>
                            <option value="Standard VI (Darasa la 6)">Standard VI (Darasa la 6)</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Namba ya Cheti cha Kuzaliwa cha RITA' : 'RITA Birth Certificate Number'}
                      </label>
                      <input
                        type="text"
                        value={birthCertNo}
                        onChange={(e) => setBirthCertNo(e.target.value)}
                        placeholder="e.g. RITA-MOR-2023-12894"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* Previous school & Health Notes */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Shule Aliyotoka Awali (Kama ipo)' : 'Previous School Attended'}
                      </label>
                      <input
                        type="text"
                        value={previousSchool}
                        onChange={(e) => setPreviousSchool(e.target.value)}
                        placeholder={isSw ? 'e.g. St. Monica Nursery / Mwanafunzi Mpya' : 'Previous school or New'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-semibold text-slate-300">
                          {isSw ? 'Hali Maalum ya Afya au Mzio' : 'Health & Allergies Notes'}
                        </label>
                        <label className="inline-flex items-center gap-1 cursor-pointer text-[10px] text-amber-400">
                          <input
                            type="checkbox"
                            checked={hasAllergies}
                            onChange={(e) => setHasAllergies(e.target.checked)}
                            className="rounded accent-amber-500"
                          />
                          <span>{isSw ? 'Ana Mzio (Allergy)' : 'Has Allergy'}</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        placeholder={isSw ? 'e.g. Mzio wa karanga, pumu, au mzima wa afya' : 'e.g. Peanut allergy, asthma, or fine'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Photo attachment simulation */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={photoSelected}
                        alt="Child passport"
                        className="w-11 h-11 rounded-xl object-cover border border-amber-500/40"
                      />
                      <div>
                        <span className="font-bold text-white block text-xs">
                          {isSw ? 'Picha ya Pasipoti ya Mwanafunzi' : 'Pupil Passport Size Photo'}
                        </span>
                        <span className="text-[10px] text-emerald-400">✓ {isSw ? 'Picha imepakiwa (JPEG)' : 'Photo uploaded'}</span>
                      </div>
                    </div>
                    <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold cursor-pointer border border-slate-700 transition-colors flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isSw ? 'Badili Picha' : 'Change Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = () => setPhotoSelected(reader.result as string);
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 2: Parent Information & Residence */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white text-xs flex items-center gap-1.5 mb-1">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>{isSw ? 'Hatua 2: Taarifa za Mzazi / Mlezi & Makazi Morogoro' : 'Step 2: Parent & Residence'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isSw
                        ? 'Namba ya simu itakayowekwa hapa itaunganishwa moja kwa moja kupokea SMS za maendeleo ya mtoto kutoka kwa Mkuu wa Shule.'
                        : 'This phone number will be linked directly to receive official Top Stars School SMS updates.'}
                    </p>
                  </div>

                  {/* Parent Full Name & Relationship */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Jina Kamili la Mzazi / Mlezi *' : 'Parent / Guardian Full Name *'}
                      </label>
                      <input
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="e.g. Mzee Juma Mohamed / Bi. Fatuma Hassan"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Uhusiano na Mtoto *' : 'Relationship *'}
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="baba">{isSw ? 'Baba Mzazi' : 'Father'}</option>
                        <option value="mama">{isSw ? 'Mama Mzazi' : 'Mother'}</option>
                        <option value="mlezi">{isSw ? 'Mlezi / Msimamizi' : 'Guardian'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Primary Phone & Alternative Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Nambari Kuu ya Simu (SMS & Mfumo) *' : 'Primary Phone Number (SMS) *'}
                      </label>
                      <input
                        type="tel"
                        value={parentPhone}
                        onChange={(e) => setParentPhone(e.target.value)}
                        placeholder="e.g. +255 754 123 456 au 0754123456"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Simu ya Ziada / WhatsApp' : 'Alternative Phone / WhatsApp'}
                      </label>
                      <input
                        type="tel"
                        value={altPhone}
                        onChange={(e) => setAltPhone(e.target.value)}
                        placeholder="e.g. +255 784 987 654"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* NIDA & Occupation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Namba ya Kitambulisho cha Taifa (NIDA)' : 'National ID (NIDA) Number'}
                      </label>
                      <input
                        type="text"
                        value={nidaNo}
                        onChange={(e) => setNidaNo(e.target.value)}
                        placeholder="19880412-21102-00004-19"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Kazi ya Mzazi / Mlezi' : 'Occupation / Profession'}
                      </label>
                      <input
                        type="text"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder={isSw ? 'e.g. Mfanyabiashara, Mwalimu, Mhandisi' : 'e.g. Business, Civil Servant'}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Morogoro Residence Ward */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      {isSw ? 'Kata ya Makazi (Manispaa ya Morogoro) *' : 'Morogoro Residential Ward *'}
                    </label>
                    <select
                      value={residenceWard}
                      onChange={(e) => setResidenceWard(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    >
                      {MOROGORO_WARDS.map((ward) => (
                        <option key={ward} value={ward}>
                          📍 {ward}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* School Bus Section */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bus className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-white text-xs">
                          {isSw ? 'Huduma ya Mabasi ya Shule (School Bus)' : 'School Bus Transportation Service'}
                        </span>
                      </div>
                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={needsBus}
                          onChange={(e) => {
                            setNeedsBus(e.target.checked);
                            setAmountPaid(
                              getAdmissionFeeBreakdown(level, e.target.checked).reduce(
                                (s, i) => s + i.amount_tzs,
                                0
                              )
                            );
                          }}
                          className="rounded accent-amber-500 w-4 h-4"
                        />
                        <span className="text-xs font-semibold text-amber-300">
                          {needsBus ? (isSw ? 'Ndio, Anahitaji Basi' : 'Yes, Needs Bus') : (isSw ? 'Hapana' : 'No')}
                        </span>
                      </label>
                    </div>

                    {needsBus && (
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1">
                          {isSw ? 'Chagua Njia / Ruti ya Basi la Shule:' : 'Select Bus Route:'}
                        </label>
                        <select
                          value={busRoute}
                          onChange={(e) => setBusRoute(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 text-xs"
                        >
                          {SCHOOL_BUS_ROUTES.map((route) => (
                            <option key={route} value={route}>
                              🚌 {route}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Initial Payment */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white text-xs flex items-center gap-1.5 mb-1">
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span>{isSw ? 'Hatua 3: Malipo ya Awali ya Udahili na Ada' : 'Step 3: Initial Fees & Payment'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isSw
                        ? 'Lipa kupitia Control Number ya Serikali / Shule kwa njia ya M-Pesa, Airtel Money, Tigo Pesa, Halopesa au Benki ya CRDB/NMB.'
                        : 'Pay via official Top Stars Control Number using Mobile Money or Bank deposit.'}
                    </p>
                  </div>

                  {/* Itemized Initial Cost Breakdown */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="bg-slate-900 px-3.5 py-2 flex items-center justify-between border-b border-slate-800">
                      <span className="font-bold text-white text-xs">
                        {isSw ? 'Mchanganuo wa Gharama za Awali za Kujiunga:' : 'Initial Admission Fee Schedule:'}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-amber-400">
                        {level === 'nursery' ? 'Awali (Nursery)' : 'Msingi (Primary)'}
                      </span>
                    </div>

                    <div className="divide-y divide-slate-800/80 text-xs">
                      {feeItems.map((item) => (
                        <div key={item.id} className="p-2.5 px-3.5 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            <span className="text-slate-300">{isSw ? item.name_sw : item.name_en}</span>
                          </div>
                          <span className="font-mono font-bold text-white">
                            TZS {item.amount_tzs.toLocaleString()}
                          </span>
                        </div>
                      ))}
                      <div className="p-3 bg-amber-500/10 flex items-center justify-between font-black text-white text-xs">
                        <span>{isSw ? 'Jumla ya Gharama za Awali:' : 'Total Initial Amount:'}</span>
                        <span className="text-amber-300 font-mono text-sm">
                          TZS {totalRequired.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Official Control Number Box */}
                  <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/60 border-2 border-amber-500/50 rounded-2xl p-3.5 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div>
                      <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
                        {isSw ? 'Nambari ya Malipo ya Shule (Control Number):' : 'School Official Control Number:'}
                      </span>
                      <div className="text-xl font-black font-mono tracking-widest text-white mt-0.5">
                        {controlNumber}
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Akaunti: <span className="text-amber-300">Top Stars School Morogoro</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyControl}
                      className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all flex-shrink-0"
                    >
                      {isCopiedControl ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isSw ? 'Imenakiliwa!' : 'Copied!'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>{isSw ? 'Nakili Namba' : 'Copy Number'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Payment Channel Selector */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                      {isSw ? 'Chagua Njia ya Malipo Uliyotumia: *' : 'Select Payment Method Used: *'}
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {(['M-Pesa', 'Airtel Money', 'Tigo Pesa', 'Halopesa', 'CRDB Bank', 'NMB Bank'] as PaymentChannel[]).map(
                        (channel) => (
                          <button
                            key={channel}
                            type="button"
                            onClick={() => setPaymentMethod(channel)}
                            className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                              paymentMethod === channel
                                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-black'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {channel}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Transaction Reference and Amount Paid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw
                          ? 'Namba ya Muamala / Reference Code *'
                          : 'Transaction Reference / Receipt Code *'}
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. MP2609A8812K au CRDB-TX-9901"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono text-xs uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isSw ? 'Kiasi Kilicholipwa (TZS) *' : 'Amount Paid (TZS) *'}
                      </label>
                      <input
                        type="number"
                        value={amountPaid}
                        onChange={(e) => setAmountPaid(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono text-xs font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* Proof of Payment attachment confirmation */}
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>{isSw ? 'Ushahidi wa SMS / Bank Deposit Slip umethibitishwa' : 'SMS / Bank Slip verified'}</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      Attachment Ready
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    <h3 className="font-bold text-white text-xs flex items-center gap-1.5 mb-1">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{isSw ? 'Hatua 4: Hakiki Taarifa Zote Kabla ya Kutuma' : 'Step 4: Review Details Before Submission'}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {isSw
                        ? 'Tafadhali kagua taarifa zote. Baada ya kubofya "Tuma Maombi", taarifa zitahifadhiwa kwenye mfumo wa shule.'
                        : 'Review summary carefully. Data will be committed to the school SQLite/PostgreSQL database.'}
                    </p>
                  </div>

                  {/* Summary Review Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Child Card */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>{isSw ? 'Mwanafunzi' : 'Pupil'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[10px] text-slate-400 hover:text-amber-300 underline"
                        >
                          {isSw ? 'Badili' : 'Edit'}
                        </button>
                      </div>
                      <div className="text-[11px] space-y-1 text-slate-300">
                        <p>
                          <span className="text-slate-400">{isSw ? 'Jina:' : 'Name:'} </span>
                          <strong className="text-white">{firstName} {middleName} {lastName}</strong>
                        </p>
                        <p>
                          <span className="text-slate-400">{isSw ? 'Darasa:' : 'Class:'} </span>
                          <span className="text-amber-300 font-bold">{applyingClass}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">{isSw ? 'Umri / Jinsia:' : 'Age / Gender:'} </span>
                          {ageInfo.text} • {gender === 'M' ? (isSw ? 'Mvulana' : 'Boy') : (isSw ? 'Msichana' : 'Girl')}
                        </p>
                        <p>
                          <span className="text-slate-400">{isSw ? 'Afya:' : 'Health:'} </span>
                          {medicalNotes || (isSw ? 'Mzima' : 'Good')}
                        </p>
                      </div>
                    </div>

                    {/* Parent Card */}
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-emerald-400 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{isSw ? 'Mzazi & Makazi' : 'Parent & Area'}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[10px] text-slate-400 hover:text-emerald-300 underline"
                        >
                          {isSw ? 'Badili' : 'Edit'}
                        </button>
                      </div>
                      <div className="text-[11px] space-y-1 text-slate-300">
                        <p>
                          <span className="text-slate-400">{isSw ? 'Mzazi:' : 'Parent:'} </span>
                          <strong className="text-white">{parentName}</strong> ({relationship})
                        </p>
                        <p>
                          <span className="text-slate-400">{isSw ? 'Simu Kuu:' : 'Phone:'} </span>
                          <span className="text-emerald-400 font-mono font-bold">{parentPhone}</span>
                        </p>
                        <p>
                          <span className="text-slate-400">{isSw ? 'Makazi:' : 'Ward:'} </span>
                          {residenceWard}
                        </p>
                        <p>
                          <span className="text-slate-400">{isSw ? 'Basi la Shule:' : 'Bus:'} </span>
                          {needsBus ? busRoute.split(':')[0] : (isSw ? 'Hapana' : 'None')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">{isSw ? 'Njia & Kumbukumbu ya Malipo:' : 'Payment Channel & Ref:'}</span>
                      <div className="font-bold text-white text-xs flex items-center gap-2 mt-0.5">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {paymentMethod}
                        </span>
                        <span className="font-mono text-emerald-400">{transactionRef}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{isSw ? 'Kiasi Kilicholipwa:' : 'Amount Paid:'}</span>
                      <span className="text-base font-black text-amber-400 font-mono">
                        TZS {amountPaid.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* School Rules & Terms Declaration */}
                  <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded accent-amber-500 mt-0.5 w-4 h-4 flex-shrink-0"
                      />
                      <span className="text-[11px] text-slate-300 leading-relaxed">
                        {isSw
                          ? 'Nathibitisha kuwa taarifa nilizojaza ni za kweli na sahihi. Ninakubali kanuni na taratibu zote za malezi na maadili za Shule ya Top Stars Nursery & Primary School Morogoro.'
                          : 'I declare that all particulars are true and accurate. I agree to abide by the rules, ethics, and code of conduct of Top Stars Nursery & Primary School Morogoro.'}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!submittedApp && (
          <div className="bg-slate-950 p-3 sm:p-4 border-t border-slate-800 flex items-center justify-between gap-2">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => ((prev - 1) as any))}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isSw ? 'Rudi Nyuma' : 'Back'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                {isSw ? 'Ghairi' : 'Cancel'}
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg transition-all"
              >
                <span>{isSw ? 'Endelea Hatua Inayofuata' : 'Continue'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>{isSw ? 'Inahifadhi Kwenye Seva...' : 'Saving to Database...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isSw ? 'Tuma Fomu & Kamilisha Udahili' : 'Submit Application'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
