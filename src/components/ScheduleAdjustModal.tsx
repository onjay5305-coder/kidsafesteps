import React, { useState } from 'react';
import { ScheduleItem, LocationPoint } from '../types';
import { X, AlertTriangle, Clock, MapPin, CheckCircle, RefreshCw } from 'lucide-react';
import { BASE_COORDS } from '../mock/initialData';

interface ScheduleAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleItem | null;
  onConfirmAdjust: (adjustedSchedule: ScheduleItem, notifyMessage: string) => void;
}

export const ScheduleAdjustModal: React.FC<ScheduleAdjustModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onConfirmAdjust,
}) => {
  const [reason, setReason] = useState<string>('change_location');
  const [newLocationName, setNewLocationName] = useState('外婆家 (静安枫景苑)');
  const [newAddress, setNewAddress] = useState('新闸路1788号西门');
  const [adjustedTime, setAdjustedTime] = useState('07:50');
  const [customNote, setCustomNote] = useState('');

  if (!isOpen || !schedule) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    let notifyMsg = '';
    const updated = { ...schedule, isAdjusted: true };

    if (reason === 'change_location') {
      const newPoint: LocationPoint = {
        name: newLocationName,
        address: newAddress,
        lat: BASE_COORDS.stop2.lat + 0.003,
        lng: BASE_COORDS.stop2.lng - 0.002,
        estimatedTime: adjustedTime,
      };
      updated.pickupPoint = newPoint;
      updated.adjustmentReason = `临时更改接送地点至【${newLocationName}】`;
      notifyMsg = `【临时调整通知】${schedule.title} 已将接送地点更改为：${newLocationName} (${newAddress})，预计接送时间：${adjustedTime}。GPS路线已自动重新规划。`;
    } else if (reason === 'delay_time') {
      updated.adjustedOriginalTime = schedule.timeSlot;
      updated.timeSlot = `${adjustedTime} - 08:35`;
      updated.adjustmentReason = `临时顺延时间至 ${adjustedTime}`;
      notifyMsg = `【临时调整通知】因家长特别嘱托，${schedule.title} 接送时间推迟至 ${adjustedTime}，请各位家长知悉。`;
    } else if (reason === 'cancel_one') {
      updated.adjustmentReason = '孩子请假，本日单点取消';
      notifyMsg = `【临时请假通知】收到轩轩家长请假申请，本日早班跳过阳光花园停靠点，直接前往翡翠湾。`;
    } else {
      updated.adjustmentReason = customNote;
      notifyMsg = `【行程特别调整】${customNote}`;
    }

    onConfirmAdjust(updated, notifyMsg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">临时行程调整与应急改签</h3>
              <p className="text-xs text-amber-100">{schedule.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleApply} className="p-6 space-y-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-800 flex items-start gap-2">
            <RefreshCw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              临时调整将即时重新计算 GPS 导航路径与预计到达时间 (ETA)，并自动向关联家长手机端发送加密加密变更提醒。
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              调整类型
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setReason('change_location')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  reason === 'change_location'
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                📍 更改接送地点
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">送外婆家/培训点</div>
              </button>

              <button
                type="button"
                onClick={() => setReason('delay_time')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  reason === 'delay_time'
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                ⏰ 顺延接送时间
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">推迟15-30分钟</div>
              </button>

              <button
                type="button"
                onClick={() => setReason('cancel_one')}
                className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                  reason === 'cancel_one'
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                🏥 生病临时请假
                <div className="text-[10px] text-slate-400 font-normal mt-0.5">本日跳过该站</div>
              </button>
            </div>
          </div>

          {reason === 'change_location' && (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  新接送地点名称
                </label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  placeholder="例如：静安枫景苑西门"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  详细地址
                </label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  placeholder="例如：新闸路1788号"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  调整后的预计到达时间
                </label>
                <input
                  type="time"
                  value={adjustedTime}
                  onChange={(e) => setAdjustedTime(e.target.value)}
                  className="w-32 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white font-mono"
                />
              </div>
            </div>
          )}

          {reason === 'delay_time' && (
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                新发车时间
              </label>
              <input
                type="time"
                value={adjustedTime}
                onChange={(e) => setAdjustedTime(e.target.value)}
                className="w-32 text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white font-mono text-center font-bold"
              />
              <p className="text-[11px] text-slate-400">
                原定时间为：{schedule.timeSlot}
              </p>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              特别说明或嘱托 (将同步显示在司机导航板)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="例如：轩轩妈妈临时加班，改为外婆到西门接"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>确认调整并重算导航路线</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
