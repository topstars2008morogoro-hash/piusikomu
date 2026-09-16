import React, { useState } from 'react';
import { Language, LinkedParent, DirectParentMessage, DirectMessageType } from '../types';
import { Send, Phone, MessageSquare, CheckCircle2, X, Sparkles, User, Clock, AlertTriangle } from 'lucide-react';

interface SendDirectSmsModalProps {
  language: Language;
  linkedParents: LinkedParent[];
  selectedParentId?: string;
  onClose: () => void;
  onSend: (message: DirectParentMessage) => void;
}

export const SendDirectSmsModal: React.FC<SendDirectSmsModalProps> = ({
  language,
  linkedParents,
  selectedParentId,
  onClose,
  onSend,
}) => {
  const isSw = language === 'sw';

  const [recipientId, setRecipientId] = useState<string>(
    selectedParentId || (linkedParents[0]?.id || '')
  );

  const selectedParent = linkedParents.find((p) => p.id === recipientId) || linkedParents[0];

  const [messageType, setMessageType] = useState<DirectMessageType>('general');
  const [messageBody, setMessageBody] = useState(
    isSw
      ? `Habari ${selectedParent?.parent_name || 'Mzazi'}. Ofisi ya Mkuu wa Shule Top Stars inapenda kukutaarifu kuwa...`
      : `Dear ${selectedParent?.parent_name || 'Parent'}, Office of the Headteacher Top Stars wishes to notify you that...`
  );
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Quick message templates
  const applyTemplate = (type: DirectMessageType) => {
    setMessageType(type);
    const pName = selectedParent?.parent_name || 'Mzazi';
    const sName = selectedParent?.student_name || 'Mwanafunzi';
    const cName = selectedParent?.class_name || 'Darasani';

    if (type === 'attendance') {
      setMessageBody(
        isSw
          ? `Top Stars School: Ndugu ${pName}, mwanafunzi ${sName} (${cName}) hakuhudhuria shuleni leo. Tafadhali wasiliana na Ofisi ya Mkuu wa Shule (+255754112233) kuthibitisha sababu au usalama wake.`
          : `Top Stars School: Dear ${pName}, pupil ${sName} (${cName}) was absent from school today. Kindly contact the Headteacher office (+255754112233) to verify.`
      );
    } else if (type === 'fee_reminder') {
      setMessageBody(
        isSw
          ? `Top Stars School: Ndugu ${pName}, tunakukumbusha kuwa mitihani ya nusu muhula ya ${sName} inaanza hivi karibuni. Tafadhali kamilisha salio la ada kupitia Control Number: 991200845001 au benki ya NMB/CRDB kabla ya Ijumaa.`
          : `Top Stars School: Reminder to ${pName}, please settle the remaining school fees balance for ${sName} via Control Number: 991200845001 before Friday.`
      );
    } else if (type === 'academic') {
      setMessageBody(
        isSw
          ? `Top Stars School: Hongera Ndugu ${pName}! Maendeleo ya kitaaluma ya mwanafunzi ${sName} (${cName}) yako vizuri sana kwenye mazoezi ya mitihani. Ripoti kamili ipo kwenye mfumo wako wa mzazi.`
          : `Top Stars School: Congratulations ${pName}! Academic performance for ${sName} (${cName}) is outstanding. Progress report card is available in your parent portal.`
      );
    } else {
      setMessageBody(
        isSw
          ? `Top Stars School: Ndugu ${pName}, tunakukumbusha kuhusu kikao cha dharura cha wazazi na walimu (PTA) siku ya Jumamosi saa 3:00 asubuhi katika ukumbi wa shule Morogoro.`
          : `Top Stars School: Dear ${pName}, kindly note the upcoming Parent-Teacher Association (PTA) meeting this Saturday at 9:00 AM at the school hall.`
      );
    }
  };

  const handleRecipientChange = (newId: string) => {
    setRecipientId(newId);
    const parent = linkedParents.find((p) => p.id === newId);
    if (parent) {
      const pName = parent.parent_name;
      setMessageBody(
        isSw
          ? `Habari ${pName}. Ofisi ya Mkuu wa Shule Top Stars inapenda kukutaarifu kuwa...`
          : `Dear ${pName}, Office of the Headteacher Top Stars wishes to notify you that...`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim() || !selectedParent) return;

    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      const now = new Date();
      const timestampStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      const newMsg: DirectParentMessage = {
        id: 'msg-' + Date.now(),
        sender_role: 'admin',
        sender_name: 'Mwl. Josephat Kavishe (Mkuu wa Shule)',
        recipient_phone: selectedParent.phone_number,
        recipient_name: selectedParent.parent_name,
        parent_id: selectedParent.id,
        message: messageBody.trim(),
        message_type: messageType,
        timestamp: timestampStr,
        status: 'delivered',
        is_read_by_parent: false,
        channel: 'SMS',
      };

      onSend(newMsg);
      setSentSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1600);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-4 sm:p-5 shadow-2xl space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {isSw ? 'Tuma Meseji ya Kawaida kwa Mzazi (Direct SMS)' : 'Dispatch Direct SMS to Linked Parent'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {isSw
                  ? 'Inafika moja kwa moja kwenye simu na mfumo wa mzazi'
                  : 'Delivered directly to parent mobile SMS and dashboard inbox'}
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

        {sentSuccess ? (
          <div className="py-6 text-center space-y-3 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">
              {isSw ? 'Meseji Imetumwa na Kufika Kikamilifu!' : 'SMS Dispatched & Delivered!'}
            </h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              {isSw
                ? `Meseji imetumwa kwa ${selectedParent?.parent_name} (${selectedParent?.phone_number}). Mzazi ataiona papo hapo kwenye SMS na mtandao wake wa simu.`
                : `Delivered to ${selectedParent?.parent_name} (${selectedParent?.phone_number}).`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Recipient Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isSw ? 'Chagua Mzazi Aliyesajiliwa / Mpokeaji:' : 'Select Linked Parent Recipient:'}
              </label>
              <select
                value={recipientId}
                onChange={(e) => handleRecipientChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-medium"
              >
                {linkedParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.parent_name} • {p.student_name} ({p.class_name}) • {p.phone_number} [{p.carrier}]
                  </option>
                ))}
              </select>
            </div>

            {/* Target Details Badge */}
            {selectedParent && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-white font-bold">{selectedParent.parent_name}</span>
                  <span className="text-slate-400">({selectedParent.student_name} - {selectedParent.class_name})</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-amber-400 font-semibold text-[11px]">
                  <Phone className="w-3 h-3" />
                  <span>{selectedParent.phone_number}</span>
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px]">
                    {selectedParent.carrier}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Templates */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isSw ? 'Chagua Ujumbe wa Haraka (Templates):' : 'Quick Tanzanian School Templates:'}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => applyTemplate('attendance')}
                  className="px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-[11px] text-slate-300 text-center font-medium"
                >
                  {isSw ? '⚠️ Mahudhurio' : 'Attendance'}
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('fee_reminder')}
                  className="px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-[11px] text-slate-300 text-center font-medium"
                >
                  {isSw ? '💰 Ada & Benki' : 'Fee Reminder'}
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('academic')}
                  className="px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-[11px] text-slate-300 text-center font-medium"
                >
                  {isSw ? '📝 Mitihani' : 'Exam Progress'}
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('general')}
                  className="px-2 py-1.5 rounded-lg border border-slate-800 bg-slate-950/80 hover:bg-slate-800 text-[11px] text-slate-300 text-center font-medium"
                >
                  {isSw ? '👥 Kikao PTA' : 'PTA Meeting'}
                </button>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                {isSw ? 'Ujumbe / Meseji ya Kawaida:' : 'SMS Message Content:'}
              </label>
              <textarea
                rows={4}
                required
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder={isSw ? 'Andika ujumbe hapa...' : 'Type message here...'}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
              />
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>
                  {isSw ? 'Wahusika:' : 'Characters:'} {messageBody.length} (1 SMS)
                </span>
                <span className="text-emerald-400 font-medium">
                  {isSw ? 'Njia: SMS ya Moja kwa Moja + Inbox ya App' : 'Channel: Direct SMS + Portal'}
                </span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
              >
                {isSw ? 'Funga' : 'Close'}
              </button>
              <button
                type="submit"
                disabled={isSending}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md transition-transform active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSending
                    ? isSw ? 'Inatuma...' : 'Dispatching...'
                    : isSw ? 'Tuma Meseji Sasa' : 'Send Direct SMS'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
