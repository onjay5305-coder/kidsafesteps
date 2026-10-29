import React, { useState } from 'react';
import { TripRecord, Child, CheckInRecord } from '../types';
import {
  History,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Download,
  Filter,
  Car
} from 'lucide-react';

interface TripHistoryViewProps {
  tripHistory: TripRecord[];
  childrenList: Child[];
  todayCheckIns: CheckInRecord[];
}

export const TripHistoryView: React.FC<TripHistoryViewProps> = ({
  tripHistory,
  childrenList,
  todayCheckIns,
}) => {
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month'>('week');

  const totalTrips = tripHistory.length + 1; // plus today's
  const totalKm = tripHistory.reduce((sum, t) => sum + t.distanceKm, 0) + 12.4;
  const onTimeRate = 99.2;

  const childMap = new Map(childrenList.map((c) => [c.id, c]));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">
              接送行程数据与历史审计中心
            </h3>
            <p className="text-xs text-slate-500">
              全程记录每一次载送里程、起止时刻、上下车打卡凭据与准点率
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-0.5 rounded-lg flex text-xs">
            <button
              onClick={() => setFilterPeriod('week')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filterPeriod === 'week' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
              }`}
            >
              本周统计
            </button>
            <button
              onClick={() => setFilterPeriod('month')}
              className={`px-3 py-1 rounded-md font-semibold transition-colors ${
                filterPeriod === 'month' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-600'
              }`}
            >
              本月累计
            </button>
          </div>

          <button
            onClick={() => alert('已生成并导出本周儿童接送行程审计PDF报告')}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出周报</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 p-3.5 rounded-xl border border-blue-100">
          <div className="text-[11px] font-semibold text-blue-600 mb-1 flex items-center gap-1">
            <Car className="w-3.5 h-3.5" /> 总载送班次
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {totalTrips * (filterPeriod === 'month' ? 4 : 1)}{' '}
            <span className="text-xs font-normal text-slate-500">次</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">每周固定定时定点专线</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-3.5 rounded-xl border border-emerald-100">
          <div className="text-[11px] font-semibold text-emerald-600 mb-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> 累计安全里程
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {(totalKm * (filterPeriod === 'month' ? 4.2 : 1)).toFixed(1)}{' '}
            <span className="text-xs font-normal text-slate-500">km</span>
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">0 事故 · 0 超速违章</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50/50 p-3.5 rounded-xl border border-purple-100">
          <div className="text-[11px] font-semibold text-purple-600 mb-1 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" /> 接送准点率
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            {onTimeRate}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">平均误差仅在 ±2 分钟内</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-3.5 rounded-xl border border-amber-100">
          <div className="text-[11px] font-semibold text-amber-700 mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 打卡签到合规率
          </div>
          <div className="text-2xl font-black text-slate-800 font-mono">
            100%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">上下车双向核实留痕</div>
        </div>
      </div>

      {/* Trips Timeline */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          近期完成行程记录明细
        </h4>

        {/* Today's active trip preview */}
        <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50/20 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                今日进行中
              </span>
              <h5 className="font-bold text-sm text-slate-800">周一 晨间送学专线</h5>
            </div>
            <div className="text-xs text-slate-500 font-mono">2026-10-28 · 07:25 发车</div>
          </div>

          <div className="text-xs text-slate-600 mb-3 flex items-center gap-4">
            <span>里程: 约 12.4 km</span>
            <span>预计耗时: 38 分钟</span>
            <span>平均车速: 28 km/h</span>
          </div>

          <div className="text-xs">
            <div className="font-semibold text-slate-700 mb-1.5">今日已打卡流水:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {todayCheckIns.map((chk) => (
                <div
                  key={chk.id}
                  className="bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2 text-xs"
                >
                  <img src={chk.photoUrl} alt="打卡" className="w-8 h-8 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800">
                      {chk.type === 'boarded' ? '上车' : '送达'} · {chk.locationName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">{chk.formattedTime}</div>
                  </div>
                  <span className="text-emerald-600 text-[10px] font-bold">已存证</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historical completed trips */}
        {tripHistory.map((trip) => (
          <div
            key={trip.id}
            className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all text-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  已圆满送达
                </span>
                <h5 className="font-bold text-slate-800">{trip.scheduleTitle}</h5>
              </div>
              <div className="text-slate-400 font-mono text-[11px]">{trip.date}</div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-500 mb-2">
              <span>行驶距离: <strong className="text-slate-700">{trip.distanceKm} km</strong></span>
              <span>耗时: <strong className="text-slate-700">{trip.durationMinutes} 分钟</strong></span>
              <span>均速: <strong className="text-slate-700">{trip.avgSpeedKmH} km/h</strong></span>
              {trip.fuelSavedKg && (
                <span className="text-emerald-600">节能减排: {trip.fuelSavedKg} kg CO₂</span>
              )}
            </div>

            {trip.checkIns.length > 0 && (
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-3">
                <span className="text-[11px] text-slate-400">打卡确认:</span>
                {trip.checkIns.map((c, i) => (
                  <span key={i} className="text-[11px] text-slate-700 font-medium">
                    {c.locationName} ({c.formattedTime})
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
