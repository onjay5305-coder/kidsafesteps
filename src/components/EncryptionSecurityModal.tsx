import React from 'react';
import { X, ShieldCheck, Lock, KeyRound, EyeOff, Server, FileText } from 'lucide-react';
import { generateEncryptionKeyId } from '../utils/crypto';

interface EncryptionSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EncryptionSecurityModal: React.FC<EncryptionSecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">儿童出行隐私与端到端传输加密报告</h3>
              <p className="text-xs text-slate-300 font-mono">E2EE Protocol v3.2 · Active</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs text-slate-600">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 flex items-start gap-2.5">
            <Lock className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sm">传输链路已全量加密 (AES-256 GCM)</div>
              <p className="mt-1 text-[11px] text-emerald-800 leading-relaxed">
                本车载送系统所有 GPS 轨迹、上下车打卡照片、车内语音留言以及紧急呼叫信令，均采用国密级标准与
                TLS 1.3 / AES-256-GCM 双向加密传输，防止任何中间人拦截或数据泄露。
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <KeyRound className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">一车一密 · 动态密钥交换</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  每次发车自动协商生成临时会话密钥（Session Key ID: <span className="font-mono text-blue-600 font-semibold">{generateEncryptionKeyId()}</span>），行程结束后立即作废销毁。
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <EyeOff className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">儿童人脸与个人信息脱敏保护</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  所有打卡存证照片均对公网链接实施模糊脱敏保护；未经授权的外链无法提取儿童原始高清肖像。
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <Server className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-800">虚拟号码隐私通话保护 (AXB)</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  家长与车主王师傅之间的电话联系由运营商虚拟隐私中间号桥接，双方均不泄露真实私人手机号。
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-500 flex items-center justify-between">
            <span>数据合规认证: 儿童个人信息网络保护规定 (CAC Compliance)</span>
            <span className="font-bold text-emerald-600">✓ 已认证</span>
          </div>
        </div>
      </div>
    </div>
  );
};
