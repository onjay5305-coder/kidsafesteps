import React, { useState } from 'react';
import { ChatMessage, Child, ScheduleItem } from '../types';
import {
  MessageSquare,
  Send,
  Mic,
  Clock,
  Sparkles,
  ShieldCheck,
  User,
  Filter,
  Check,
  Volume2
} from 'lucide-react';

interface ChatMessengerProps {
  messages: ChatMessage[];
  childrenList: Child[];
  activeSchedule: ScheduleItem | null;
  onSendMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  currentRole: 'driver' | 'parent';
  onToggleRole: () => void;
  selectedChildFilter?: string;
  onSelectChildFilter: (childId?: string) => void;
}

const PRESET_DRIVER_NOTES = [
  '已到达接驳点，车打双闪等候中',
  '孩子们均已系好安全带，准时发车',
  '路上有些轻微缓行，预计晚到3-5分钟',
  '已平安将孩子送达学校门口，请家长放心！',
];

const PRESET_PARENT_NOTES = [
  '孩子已下楼，穿黄色校服戴红领巾',
  '今天有点感冒，麻烦车内空调开温和一些',
  '今天放学需多带一件小提琴乐器',
  '收到！感谢师傅悉心载送！',
];

export const ChatMessenger: React.FC<ChatMessengerProps> = ({
  messages,
  childrenList,
  activeSchedule,
  onSendMessage,
  currentRole,
  onToggleRole,
  selectedChildFilter,
  onSelectChildFilter,
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const filteredMessages = messages.filter((m) => {
    if (!selectedChildFilter) return true;
    return m.childId === selectedChildFilter || !m.childId;
  });

  const handleSendText = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const senderName = currentRole === 'driver' ? '接送车主 (王师傅)' : '家长 (轩轩爸爸)';
    const senderAvatar =
      currentRole === 'driver'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80';

    onSendMessage({
      scheduleId: activeSchedule?.id,
      childId: selectedChildFilter,
      sender: currentRole,
      senderName,
      senderAvatar,
      content: text,
      type: 'text',
      read: true,
    });

    if (!textToSend) {
      setInputText('');
    }
  };

  const handleSendVoiceSim = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const senderName = currentRole === 'driver' ? '接送车主 (王师傅)' : '家长 (可可妈妈)';
      const senderAvatar =
        currentRole === 'driver'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
          : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80';

      onSendMessage({
        scheduleId: activeSchedule?.id,
        childId: selectedChildFilter,
        sender: currentRole,
        senderName,
        senderAvatar,
        content: '[语音留言] 4秒',
        type: 'voice',
        voiceDurationSec: 4,
        read: true,
      });
    }, 1200);
  };

  const handlePlayVoice = (id: string) => {
    setPlayingVoiceId(id);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm">家车即时沟通与行程留言板</h3>
        </div>

        {/* Identity switch */}
        <div className="flex items-center gap-1.5 text-xs bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
          <span className="text-slate-400">当前发送人:</span>
          <button
            onClick={onToggleRole}
            className={`font-semibold px-2 py-0.5 rounded transition-colors ${
              currentRole === 'driver'
                ? 'bg-blue-600 text-white'
                : 'bg-emerald-600 text-white'
            }`}
          >
            {currentRole === 'driver' ? '🚗 司机视角' : '👨‍👩‍👧 家长视角'} (点击切换)
          </button>
        </div>
      </div>

      {/* Child Filter Tabs */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 flex items-center gap-1 shrink-0 text-[11px]">
          <Filter className="w-3 h-3" /> 关联孩子:
        </span>
        <button
          onClick={() => onSelectChildFilter(undefined)}
          className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${
            !selectedChildFilter
              ? 'bg-slate-800 text-white font-bold'
              : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
          }`}
        >
          全部留言
        </button>
        {childrenList.map((kid) => (
          <button
            key={kid.id}
            onClick={() => onSelectChildFilter(kid.id)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg shrink-0 font-medium transition-colors ${
              selectedChildFilter === kid.id
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <img src={kid.avatar} alt={kid.name} className="w-4 h-4 rounded-full object-cover" />
            <span>{kid.nickname}</span>
          </button>
        ))}
      </div>

      {/* Message List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
        {filteredMessages.map((msg) => {
          const isSystem = msg.sender === 'system';
          const isMe =
            (currentRole === 'driver' && msg.sender === 'driver') ||
            (currentRole === 'parent' && msg.sender === 'parent');

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="bg-slate-200/80 text-slate-700 text-[11px] px-3 py-1.5 rounded-full flex items-center gap-1.5 max-w-[90%] shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{msg.content}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <img
                src={msg.senderAvatar}
                alt={msg.senderName}
                className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
              />
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-700">{msg.senderName}</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {msg.type === 'voice' ? (
                  <button
                    onClick={() => handlePlayVoice(msg.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl shadow-xs transition-colors ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    <Volume2
                      className={`w-4 h-4 ${
                        playingVoiceId === msg.id ? 'animate-bounce text-amber-300' : ''
                      }`}
                    />
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-3 flex items-center gap-0.5">
                        <span className="w-1 h-2 bg-current rounded" />
                        <span className="w-1 h-3 bg-current rounded" />
                        <span className="w-1 h-4 bg-current rounded" />
                        <span className="w-1 h-2 bg-current rounded" />
                        <span className="w-1 h-3 bg-current rounded" />
                      </div>
                      <span className="text-xs font-mono font-bold">{msg.voiceDurationSec}s</span>
                    </div>
                  </button>
                ) : (
                  <div
                    className={`px-3.5 py-2 rounded-2xl text-xs leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preset Quick Notes */}
      <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 overflow-x-auto">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-[10px] text-slate-500 font-semibold shrink-0">快捷常用留言:</span>
          {(currentRole === 'driver' ? PRESET_DRIVER_NOTES : PRESET_PARENT_NOTES).map(
            (note, idx) => (
              <button
                key={idx}
                onClick={() => handleSendText(note)}
                className="text-[11px] bg-white hover:bg-blue-50 hover:text-blue-700 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs"
              >
                {note}
              </button>
            )
          )}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendVoiceSim}
          disabled={isRecording}
          title="按住模拟发送语音留言"
          className={`p-2.5 rounded-xl border transition-all ${
            isRecording
              ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
          placeholder={
            isRecording
              ? '正在录制语音留言...'
              : currentRole === 'driver'
              ? '作为车主留言（如路况、提醒备齐红领巾水壶）...'
              : '作为家长给司机留言（如在路边接车、特别嘱托）...'
          }
          className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={() => handleSendText()}
          disabled={!inputText.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
