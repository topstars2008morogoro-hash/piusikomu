import React, { useState, useEffect } from 'react';
import { Language, LinkedParent, LinkedChild, CarrierType } from '../types';
import { CLASSES } from '../data/mockData';
import { normalizePhoneNumber, getAllChildren } from '../utils/classPromotion';
import {
  Phone,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

interface ParentRegisterModalProps {
  language: Language;
  onClose: () => void;
  onRegister: (parentData: LinkedParent) => void;
  initialPhone?: string;
  initialParentName?: string;
  initialStudentName?: string;
  initialClassName?: string;
  existingParents?: LinkedParent[];
  currentAcademicYear?: string;
}

export const ParentRegisterModal: React.FC<ParentRegisterModalProps> = ({
  language,
  onClose,
  onRegister,
  initialPhone = '',
  initialParentName = '',
  initialStudentName = '',
  initialClassName = 'Standard II (Darasa la 2)',
  existingParents = [],
  currentAcademicYear = '2026',
}) => {
  const isSw = language === 'sw';

  const [parentName, setParentName] = useState(initialParentName);
  const [phoneNumber, setPhoneNumber] = useState(initialPhone);
  const [carrier, setCarrier] = useState<CarrierType>('Vodacom');
  const [residenceArea, setResidenceArea] = useState('Kihonda, Morogoro');

  // Primary child in the active class
  const [primaryStudentName, setPrimaryStudentName] = useState(initialStudentName);
  const [primaryClassName, setPrimaryClassName] = useState(initialClassName);
  const [primaryAdmission, setPrimaryAdmission] = useState('');

  // Additional children in other classes (User requirement: e.g. Child in Std 2 and Std 3)
  const [additionalChildren, setAdditionalChildren] = useState<
    Array<{ id: string; student_name: string; class_name: string; student_admission: string }>
  >([]);

  // Detected existing parent alert
  const [detectedExistingParent, setDetectedExistingParent] = useState<LinkedParent | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Detect existing parent when phone number changes
  useEffect(() => {
    const cleanInput = phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (cleanInput.length >= 8) {
      const match = existingParents.find((p) => {
        const pClean = p.phone_number.replace(/[\s\-\(\)]/g, '');
        return pClean.includes(cleanInput) || cleanInput.includes(pClean.slice(-8));
      });

      if (match) {
        setDetectedExistingParent(match);
        if (!parentName.trim()) setParentName(match.parent_name);
        if (match.residence_area) setResidenceArea(match.residence_area);
        if (match.carrier) setCarrier(match.carrier);
      } else {
        setDetectedExistingParent(null);
      }
    } else {
      setDetectedExistingParent(null);
    }
  }, [phoneNumber, existingParents, parentName]);

  const handleAddChild = () => {
    // Pick next default class that is not already chosen
    const usedClasses = [primaryClassName, ...additionalChildren.map((c) => c.class_name)];
    const nextAvailableClass =
      CLASSES.find((c) => !usedClasses.includes(c.class_name))?.class_name ||
      CLASSES[2]?.class_name ||
      'Standard III (Darasa la 3)';

    setAdditionalChildren((prev) => [
      ...prev,
      {
        id: 'child-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        student_name: '',
        class_name: nextAvailableClass,
        student_admission: '',
      },
    ]);
  };

  const handleRemoveChild = (childId: string) => {
    setAdditionalChildren((prev) => prev.filter((c) => c.id !== childId));
  };

  const handleUpdateChild = (
    childId: string,
    field: 'student_name' | 'class_name' | 'student_admission',
    value: string
  ) => {
    setAdditionalChildren((prev) =>
      prev.map((c) => (c.id === childId ? { ...c, [field]: value } : c))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phoneNumber.trim() || !primaryStudentName.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      // Build complete children array
      const allChildrenList: LinkedChild[] = [
        {
          id: 'ch-' + Date.now() + '-1',
          student_name: primaryStudentName.trim(),
          class_name: primaryClassName,
          student_admission: primaryAdmission.trim() || `TS-${currentAcademicYear}-${Math.floor(100 + Math.random() * 900)}`,
          academic_year: currentAcademicYear,
        },
        ...additionalChildren
          .filter((c) => c.student_name.trim().length > 0)
          .map((c, idx) => ({
            id: 'ch-' + Date.now() + '-' + (idx + 2),
            student_name: c.student_name.trim(),
            class_name: c.class_name,
            student_admission: c.student_admission.trim() || `TS-${currentAcademicYear}-${Math.floor(100 + Math.random() * 900)}`,
            academic_year: currentAcademicYear,
          })),
      ];

      // If existing parent was detected, preserve their existing messages and append children
      let finalChildren = allChildrenList;
      if (detectedExistingParent) {
        const existingKids = getAllChildren(detectedExistingParent);
        // Merge without duplicate names
        const existingNames = new Set(allChildrenList.map((c) => c.student_name.toLowerCase().trim()));
        for (const ek of existingKids) {
          if (!existingNames.has(ek.student_name.toLowerCase().trim())) {
            finalChildren.push(ek);
          }
        }
      }

      const newLinkedParent: LinkedParent = {
        id: detectedExistingParent ? detectedExistingParent.id : 'par-' + Date.now(),
        parent_name: parentName.trim(),
        phone_number: phoneNumber.trim().startsWith('+255') || phoneNumber.trim().startsWith('0')
          ? phoneNumber.trim()
          : '+255 ' + phoneNumber.trim(),
        student_name: finalChildren[0].student_name,
        class_name: finalChildren[0].class_name,
        student_admission: finalChildren[0].student_admission,
        residence_area: residenceArea.trim() || 'Morogoro',
        linked_at: detectedExistingParent ? detectedExistingParent.linked_at : new Date().toISOString().split('T')[0],
        status: 'linked',
        carrier: carrier,
        total_messages_received: detectedExistingParent ? detectedExistingParent.total_messages_received : 1,
        last_message_at: 'Sasa Hivi',
        academic_year: currentAcademicYear,
        children: finalChildren,
      };

      onRegister(newLinkedParent);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 500);
  };

  const totalClassesCount = 1 + additionalChildren.filter((c) => c.student_name.trim()).length;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {isSw ? 'Usajili wa Mzazi kwa Madarasa & Kuunganisha na Admin' : 'Class-Specific Parent Registration & Direct Link'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSw
                  ? `Darasa Lengwa: ${primaryClassName} • Taarifa zitasawazishwa moja kwa moja`
                  : `Target Class: ${primaryClassName} • Cross-class auto-sync enabled`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isSw ? 'Mzazi Amesajiliwa & Kuunganishwa Kikamilifu!' : 'Parent Successfully Registered & Linked!'}
            </h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              {isSw
                ? `Taarifa za ${parentName} (${phoneNumber}) sasa zimehifadhiwa na kuunganishwa moja kwa moja kwenye madarasa yote aliyo na watoto (${totalClassesCount} madarasa).`
                : `Information for ${parentName} (${phoneNumber}) is now synchronized across all enrolled classes.`}
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 font-semibold max-w-md mx-auto">
              ✓ {isSw ? 'Taarifa zimehama kiotomatiki kwenda kwenye madarasa yote husika!' : 'Records automatically synced across classes!'}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Automatic Cross-Class Link Info Banner */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-teal-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-white">
                  {isSw ? 'Usawazishaji wa Kiotomatiki (Automatic Cross-Class Sync):' : 'Automatic Multi-Class Synchronization:'}
                </p>
                <p className="text-[11px] text-slate-300">
                  {isSw
                    ? 'Ukisajili mzazi mwenye watoto zaidi ya mmoja (k.m. Darasa la 2 na Darasa la 3), taarifa zake za mawasiliano zitahamia moja kwa moja kwenye hayo madarasa yote bila kurudia kuandika mara mbili!'
                    : 'If a parent has children in multiple classes (e.g. Std 2 & Std 3), their profile automatically synchronizes across all respective classes.'}
                </p>
              </div>
            </div>

            {/* Detected Parent Notification if phone matches */}
            {detectedExistingParent && (
              <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-500/50 text-xs text-blue-200 flex items-start gap-2.5 animate-in fade-in">
                <LinkIcon className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-white flex items-center gap-1.5">
                    <span>⚡ {isSw ? 'Mzazi Ametambuliwa Kwenye Mfumo:' : 'Existing Parent Auto-Detected:'}</span>
                    <span className="text-emerald-400">{detectedExistingParent.parent_name}</span>
                  </p>
                  <p className="text-[11px] text-blue-300">
                    {isSw
                      ? `Mzazi huyu tayari ana mtoto "${detectedExistingParent.student_name}" katika [${detectedExistingParent.class_name}]. Mtoto unayemsajili sasa ataunganishwa kwenye akaunti ya mzazi huyu, na mzazi ataonekana kwenye madarasa yote mawili!`
                      : `This parent is already linked with ${detectedExistingParent.student_name} in ${detectedExistingParent.class_name}. This new student will be linked to the same parent account.`}
                  </p>
                </div>
              </div>
            )}

            {/* SECTION 1: Parent Contact Details */}
            <div className="bg-slate-950/70 border border-slate-800 p-3 sm:p-3.5 rounded-xl space-y-3">
              <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{isSw ? '1. Taarifa za Mzazi / Mlezi' : '1. Parent / Guardian Details'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Parent Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Jina Kamili la Mzazi:' : 'Parent Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={isSw ? 'mf. Mzee Juma Mohamed' : 'e.g. Mzee Juma Mohamed'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Namba ya Simu (Tanzania):' : 'Phone Number (TZ):'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+255 754 123 456 au 0754 123 456"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                {/* Carrier */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Mtandao wa Simu:' : 'Mobile Carrier:'}
                  </label>
                  <select
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value as CarrierType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Vodacom">Vodacom (M-Pesa)</option>
                    <option value="Airtel">Airtel (Airtel Money)</option>
                    <option value="Tigo">Tigo (Tigo Pesa)</option>
                    <option value="Halotel">Halotel (HaloPesa)</option>
                    <option value="Other">Mtandao Mwingine</option>
                  </select>
                </div>

                {/* Residence Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Eneo la Makazi Morogoro:' : 'Residence Area:'}
                  </label>
                  <input
                    type="text"
                    value={residenceArea}
                    onChange={(e) => setResidenceArea(e.target.value)}
                    placeholder="Kihonda, Mazimbu, Msamvu, Forest Hill..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Primary Student in Target Class */}
            <div className="bg-slate-950/70 border border-slate-800 p-3 sm:p-3.5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>
                    {isSw
                      ? `2. Mtoto wa 1 (Darasa Hili la ${primaryClassName.split('(')[0].trim()})`
                      : `2. Primary Child (${primaryClassName.split('(')[0].trim()})`}
                  </span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold">
                  {primaryClassName}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Jina la Mwanafunzi:' : 'Student Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryStudentName}
                    onChange={(e) => setPrimaryStudentName(e.target.value)}
                    placeholder={isSw ? 'mf. Baraka Juma' : 'e.g. Baraka Juma'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {isSw ? 'Darasa:' : 'Class:'}
                  </label>
                  <select
                    value={primaryClassName}
                    onChange={(e) => setPrimaryClassName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-teal-400"
                  >
                    {CLASSES.map((c) => (
                      <option key={c.id} value={c.class_name}>
                        {c.class_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Additional Children in other classes (Multi-child auto-sync) */}
            <div className="bg-slate-950/70 border border-slate-800 p-3 sm:p-3.5 rounded-xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSw ? '3. Watoto Wengine Shuleni (Madarasa Tofauti)' : '3. Additional Children in Other Classes'}</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isSw
                      ? 'Taarifa za mzazi zitaenda moja kwa moja kwenye madarasa utakayoweka hapa.'
                      : 'Parent info will automatically sync to all classes added below.'}
                  </p>
                </div>

                <button
                  type="button"
                  id="add-other-child-btn"
                  onClick={handleAddChild}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-amber-500/40 text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isSw ? '+ Ongeza Mtoto wa Darasa Lingine' : '+ Add Child in Another Class'}</span>
                </button>
              </div>

              {additionalChildren.length === 0 ? (
                <div className="py-2.5 px-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 italic flex items-center justify-between">
                  <span>
                    {isSw
                      ? 'Kama mzazi ana watoto kwenye madarasa mengine (mf. Darasa la 2 na 3), bofya kitufe cha "+ Ongeza Mtoto wa Darasa Lingine" hapo juu.'
                      : 'If this parent has children in other classes (e.g. Std 2 & Std 3), click "+ Add Child in Another Class" above.'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {additionalChildren.map((child, index) => (
                    <div
                      key={child.id}
                      className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2 relative animate-in fade-in"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                          <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-[10px]">
                            {index + 2}
                          </span>
                          <span>{isSw ? `Mtoto wa ${index + 2} (Darasa Lingine)` : `Child #${index + 2}`}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveChild(child.id)}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                          title={isSw ? 'Ondoa mtoto huyu' : 'Remove child'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            {isSw ? 'Jina la Mwanafunzi:' : 'Student Name:'}
                          </label>
                          <input
                            type="text"
                            required
                            value={child.student_name}
                            onChange={(e) => handleUpdateChild(child.id, 'student_name', e.target.value)}
                            placeholder={isSw ? 'mf. Asha Juma' : 'e.g. Asha Juma'}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                            {isSw ? 'Darasa Analosoma Mtoto Huyu:' : 'Enrolled Class:'}
                          </label>
                          <select
                            value={child.class_name}
                            onChange={(e) => handleUpdateChild(child.id, 'class_name', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          >
                            {CLASSES.map((c) => (
                              <option key={c.id} value={c.class_name}>
                                {c.class_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium pt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                        <span>
                          {isSw
                            ? `✓ Mzazi huyu ataonekana kiotomatiki kwenye daftari la [${child.class_name}]`
                            : `✓ Parent will automatically appear in [${child.class_name}] register`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Link Confirmation Badge */}
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                {isSw
                  ? `Mkuu wa Shule na Walimu wa madarasa husika wataona namba ya ${phoneNumber || 'mzazi'} mara moja.`
                  : 'Headteacher and class teachers will have immediate SMS link.'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                {isSw ? 'Ghairi' : 'Cancel'}
              </button>
              <button
                type="submit"
                id="submit-parent-registration-btn"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-transform active:scale-95 disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isSw ? 'Inasajili & Kulandanisha...' : 'Saving & Syncing...'
                    : isSw ? `Sajili & Sawazisha Kwenye Madarasa (${totalClassesCount})` : `Save & Sync to Classes (${totalClassesCount})`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
