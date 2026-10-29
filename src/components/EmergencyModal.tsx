import React, { useState } from 'react';
import { LiveVehicleState, Child } from '../types';
import {
  X,
  AlertOctagon,
  PhoneCall,
  MapPin,
  ShieldAlert,
  Radio,
  FileCheck2,
  Users
} from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleState: LiveVehicleState;
  childrenList: Child[];
  onTriggerSOS: (alertDetails: string) => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  vehicleState,
  childrenList,
  onTriggerSOS,
}) => {
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const handleBroadcastSOS = (type: 'police' | 'medical' | 'parents') => {
    const kidNames = childrenList.map((k) => k.name).join('、');
    const msg = `【SOS 紧急求助广播】车辆【沪A·68K99】在坐标(${vehicleState.lat.toFixed(
      4
    )}, ${vehicleState.lng.toFixed(
      4
    )})触发紧急呼叫！车上载送儿童: [${kidNames}]。车内记录仪与加密通话通道已锁定并上传至应急云平台。`;
    onTriggerSOS(msg);
    setSosSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border-2 border-rose-500 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <AlertOctagon className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-black text-lg">紧急安全呼叫中心 (SOS)</h3>
              <p className="text-xs text-rose-100">一键快速报警与联络家长保障儿童安全</p>
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
          {/* Current GPS Telemetry */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-rose-700">
              <MapPin className="w-4 h-4 text-rose-600" />
              <span>当前车辆精准位置已锁定:</span>
            </div>
            <div className="font-mono text-[11px] text-slate-700">
              纬度: {vehicleState.lat.toFixed(6)} | 经度: {vehicleState.lng.toFixed(6)} (高精度GPS)
            </div>
            <div className="text-[11px] text-slate-600 flex items-center gap-2">
              <span>车速: {vehicleState.speedKmH} km/h</span>
              <span>·</span>
              <span>行车记录仪云端实时备份中</span>
            </div>
          </div>

          {/* Quick Dial Buttons */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-700">一键紧急直拨与求助广播:</div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleBroadcastSOS('police')}
                className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-md transition-all active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-300" />
                  <div className="text-left">
                    <div>呼叫 110 报警</div>
                    <div className="text-[10px] text-red-200 font-normal">交警与公安应急通道</div>
                  </div>
                </div>
                <span className="text-xs bg-red-800 px-2 py-1 rounded">拨打</span>
              </button>

              <button
                type="button"
                onClick={() => handleBroadcastSOS('medical')}
                className="p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-md transition-all active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-200" />
                  <div className="text-left">
                    <div>呼叫 120 急救</div>
                    <div className="text-[10px] text-amber-200 font-normal">医疗紧急救援</div>
                  </div>
                </div>
                <span className="text-xs bg-amber-800 px-2 py-1 rounded">拨打</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleBroadcastSOS('parents')}
              className="w-full p-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-md transition-all active:scale-95 border border-slate-700"
            >
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400 animate-pulse" />
                <div className="text-left">
                  <div>一键群发紧急警报至所有在车孩子家长群</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    附带即时高精经纬度、行车路线与车内状况
                  </div>
                </div>
              </div>
              <span className="text-xs bg-rose-600 px-2.5 py-1 rounded">立即广播</span>
            </button>
          </div>

          {/* Child Emergency Contacts List */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 text-xs">
            <div className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>车内儿童紧急联系电话 (点击拨打)</span>
            </div>
            <div className="space-y-1.5">
              {childrenList.map((kid) => (
                <div
                  key={kid.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <img src={kid.avatar} alt={kid.name} className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="font-bold text-slate-800">{kid.nickname}</span>
                      <span className="text-slate-400 text-[10px] ml-1">
                        ({kid.guardianRelation} {kid.guardianName})
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${kid.emergencyPhone}`}
                    className="text-blue-600 hover:underline font-mono font-bold flex items-center gap-1"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{kid.emergencyPhone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {sosSent && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>紧急警报与当前 GPS 定位已成功广播并同步至即时留言板！</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
