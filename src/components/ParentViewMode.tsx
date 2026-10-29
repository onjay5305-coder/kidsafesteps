import React from 'react';
import { Child, LiveVehicleState, ScheduleItem, CheckInRecord } from '../types';
import {
  ShieldCheck,
  PhoneCall,
  MessageSquare,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Thermometer,
  Car,
  Lock,
  Edit3,
  Calendar,
  Share2
} from 'lucide-react';

interface ParentViewModeProps {
  childrenList: Child[];
  vehicleState: LiveVehicleState;
  activeSchedule: ScheduleItem | null;
  checkInRecords: CheckInRecord[];
  onOpenChat: (childId: string) => void;
  onOpenAdjust: (schedule: ScheduleItem) => void;
  onOpenShare: () => void;
  onOpenSOS: () => void;
}

export const ParentViewMode: React.FC<ParentViewModeProps> = ({
  childrenList,
  vehicleState,
  activeSchedule,
  checkInRecords,
  onOpenChat,
  onOpenAdjust,
  onOpenShare,
  onOpenSOS,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Banner: Peace of Mind Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-2xl p-4 md:p-5 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-white/20 backdrop-blur-md text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                <span>端到端加密护童监护中</span>
              </span>
              <span className="text-xs text-emerald-100 font-mono">
                车牌 沪A·68K99 · 王师傅
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black">
              今日接送进行中 · 车辆状态正常
            </h2>
            <p className="text-xs text-emerald-100 mt-1">
              {activeSchedule ? activeSchedule.title : '周一 晨间送学专线'} · 预计将在 08:05 前送达学校
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenShare}
              className="bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 backdrop-blur-sm border border-white/20"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>共享位置给家人</span>
            </button>
            <button
              onClick={onOpenSOS}
              className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>紧急呼叫 (SOS)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Children Status Big Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {childrenList.map((kid) => {
          const kidCheckIns = checkInRecords.filter((r) => r.childId === kid.id);
          const boardedRecord = kidCheckIns.find((r) => r.type === 'boarded');
          const arrivedRecord = kidCheckIns.find((r) => r.type === 'arrived');

          const isBoarded = !!boardedRecord;
          const isArrived = !!arrivedRecord;

          return (
            <div
              key={kid.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 hover:shadow-md transition-all"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={kid.avatar}
                      alt={kid.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                    />
                    <span
                      className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        isArrived
                          ? 'bg-emerald-500'
                          : isBoarded
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-amber-400'
                      }`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-800">{kid.name}</h3>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {kid.nickname}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {kid.school} · {kid.grade}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  {isArrived ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已安全送达学校
                    </span>
                  ) : isBoarded ? (
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Car className="w-3.5 h-3.5" /> 专车行驶中 (在车上)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> 待接驳上车
                    </span>
                  )}
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {isArrived
                      ? `送达签到: ${arrivedRecord?.formattedTime}`
                      : isBoarded
                      ? `上车打卡: ${boardedRecord?.formattedTime}`
                      : '接送安排: 07:30'}
                  </div>
                </div>
              </div>

              {/* Safety & Check-in telemetry */}
              <div className="bg-slate-50 rounded-xl p-3 mb-3 space-y-2 text-xs">
                {isBoarded ? (
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      安全带已佩戴 · 体温 {boardedRecord?.temperature || '36.5°C'} 正常
                    </span>
                    <span className="text-[11px] text-slate-400">
                      经办: {boardedRecord?.signedBy}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-slate-400" /> 上车点: {kid.homeAddress}
                    </span>
                  </div>
                )}

                {boardedRecord?.notes && (
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-700">打卡附言: </span>
                    {boardedRecord.notes}
                  </div>
                )}
              </div>

              {/* Quick Actions for Parents */}
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                <button
                  onClick={() => onOpenChat(kid.id)}
                  className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>给司机留言</span>
                </button>

                <a
                  href="tel:13812345678"
                  className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>电话呼叫</span>
                </a>

                <button
                  onClick={() => activeSchedule && onOpenAdjust(activeSchedule)}
                  className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 flex items-center justify-center gap-1 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>临时调整</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Vehicle Live Telemetry Panel for Parents */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Car className="w-4 h-4 text-blue-600" />
          <span>车辆实时安全遥测与车内环境</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 text-[11px] mb-1">当前行车速度</div>
            <div className="text-lg font-bold font-mono text-slate-800">
              {vehicleState.speedKmH} <span className="text-xs font-normal">km/h</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">● 城市绿波道路安全时速</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 text-[11px] mb-1">儿童安全锁</div>
            <div className="text-lg font-bold text-emerald-600 flex items-center gap-1">
              <Lock className="w-4 h-4" />
              <span>全部锁定</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">后门与车窗防误开已激活</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 text-[11px] mb-1">车内舒适温度</div>
            <div className="text-lg font-bold text-slate-800 flex items-center gap-1">
              <Thermometer className="w-4 h-4 text-rose-500" />
              <span>{vehicleState.acTemp}°C</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">新风过滤与恒温净化开启</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="text-slate-400 text-[11px] mb-1">数据传输安全</div>
            <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>AES-256</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">专线点对点加密传输</div>
          </div>
        </div>
      </div>
    </div>
  );
};
