import React, { useState } from 'react';
import { LiveVehicleState, ScheduleItem, Child, CheckInRecord } from '../types';
import {
  X,
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  QrCode,
  Clock,
  Eye,
  Smartphone
} from 'lucide-react';
import { generateShareUrl } from '../utils/crypto';

interface FamilyShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleState: LiveVehicleState;
  activeSchedule: ScheduleItem | null;
  childrenList: Child[];
  checkIns: CheckInRecord[];
  onOpenParentPreview: () => void;
}

export const FamilyShareModal: React.FC<FamilyShareModalProps> = ({
  isOpen,
  onClose,
  vehicleState,
  activeSchedule,
  childrenList,
  checkIns,
  onOpenParentPreview,
}) => {
  const [copied, setCopied] = useState(false);
  const [expireHours, setExpireHours] = useState(3);
  const [shareTarget, setShareTarget] = useState('轩轩妈妈 & 奶奶');

  if (!isOpen) return null;

  const shareToken = 'SHARE-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  const shareUrl = generateShareUrl(shareToken);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `【童途安行·实时护童专线】\n接送车【沪A·68K99】当前正在执行【${activeSchedule?.title || '接送任务'}】。\n点击安全加密链接查看车辆实时位置与孩子上下车状态：\n${shareUrl}\n(链接有效期${expireHours}小时，端到端AES-256传输加密)`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-200" />
            <div>
              <h3 className="font-bold text-base">实时共享位置给家人朋友</h3>
              <p className="text-xs text-cyan-100">生成端到端加密专属监护链接</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Privacy badge */}
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold flex items-center gap-1.5">
                <span>AES-256 端到端加密共享已就绪</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-800 px-1.5 py-0.2 rounded font-mono">E2EE</span>
              </div>
              <p className="text-emerald-700 mt-0.5 leading-relaxed text-[11px]">
                专属安全令牌保护，仅持加密链接的家人可查看车辆高精定位与孩子打卡凭证，不泄露个人隐私，随时一键作废。
              </p>
            </div>
          </div>

          {/* Config options */}
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">共享对象标签</label>
              <input
                type="text"
                value={shareTarget}
                onChange={(e) => setShareTarget(e.target.value)}
                className="text-xs px-2.5 py-1 border border-slate-300 rounded-lg bg-white w-48 text-right font-medium"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> 链接有效时长
              </label>
              <div className="flex gap-1.5">
                {[1, 3, 12, 24].map((hr) => (
                  <button
                    key={hr}
                    onClick={() => setExpireHours(hr)}
                    className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors ${
                      expireHours === hr
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {hr}小时
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generated Share Link Box */}
          <div className="border border-slate-200 rounded-xl p-3 bg-white">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-600">专属加密分享链接:</span>
              <span className="text-[11px] font-mono text-blue-600 font-bold">
                Token: {shareToken}
              </span>
            </div>
            <div className="bg-slate-100 p-2 rounded-lg font-mono text-[11px] text-slate-700 break-all select-all mb-2.5 border border-slate-200">
              {shareUrl}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '已复制短信/微信文案' : '复制加密分享链接'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenParentPreview();
                }}
                className="py-2 px-3 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-900 text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>预览家人监护视图</span>
              </button>
            </div>
          </div>

          {/* Quick instructions */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="font-semibold text-slate-700">家人朋友打开后可看到:</div>
            <ul className="list-disc list-inside space-y-0.5">
              <li>车辆当前实时 GPS 位置与行车速度 ({vehicleState.speedKmH} km/h)</li>
              <li>孩子是否已上车打卡、打卡凭证与预计送达分钟数</li>
              <li>车内儿童锁状态、车内空调温度 (24.5°C) 与一键给司机拨号</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
