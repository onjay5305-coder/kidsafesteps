import React, { useState } from 'react';
import { ScheduleItem, Child, DayOfWeek } from '../types';
import {
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Edit3,
  MessageSquare,
  Users
} from 'lucide-react';

interface ScheduleWeekViewProps {
  schedules: ScheduleItem[];
  childrenList: Child[];
  activeScheduleId: string;
  onSelectSchedule: (schedule: ScheduleItem) => void;
  onOpenAddSchedule: (day: DayOfWeek) => void;
  onOpenCheckIn: (schedule: ScheduleItem) => void;
  onOpenAdjust: (schedule: ScheduleItem) => void;
  onOpenChatWithChild?: (childId: string) => void;
}

export const ScheduleWeekView: React.FC<ScheduleWeekViewProps> = ({
  schedules,
  childrenList,
  activeScheduleId,
  onSelectSchedule,
  onOpenAddSchedule,
  onOpenCheckIn,
  onOpenAdjust,
  onOpenChatWithChild,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(1); // Default to Monday

  const days: { label: string; sub: string; value: DayOfWeek }[] = [
    { label: '周一', sub: 'Mon', value: 1 },
    { label: '周二', sub: 'Tue', value: 2 },
    { label: '周三', sub: 'Wed', value: 3 },
    { label: '周四', sub: 'Thu', value: 4 },
    { label: '周五', sub: 'Fri', value: 5 },
    { label: '周六', sub: 'Sat', value: 6 },
    { label: '周日', sub: 'Sun', value: 0 },
  ];

  // Filter schedules for the selected day
  const currentDaySchedules = schedules.filter((s) => s.dayOfWeek === selectedDay);

  const childMap = new Map(childrenList.map((c) => [c.id, c]));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 md:p-5">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm md:text-base">
              一星期定时定点接送计划
            </h3>
            <p className="text-[11px] text-slate-500">
              按星期灵活排班，自动联动 GPS 导航路线与打卡提醒
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenAddSchedule(selectedDay)}
          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新建排程</span>
        </button>
      </div>

      {/* Weekday Switcher Tabs */}
      <div className="grid grid-cols-7 gap-1.5 p-1 bg-slate-100 rounded-xl mb-4">
        {days.map((d) => {
          const count = schedules.filter((s) => s.dayOfWeek === d.value).length;
          const isSelected = selectedDay === d.value;
          return (
            <button
              key={d.value}
              onClick={() => setSelectedDay(d.value)}
              className={`py-2 px-1 rounded-lg text-center transition-all relative ${
                isSelected
                  ? 'bg-white text-blue-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="text-xs">{d.label}</div>
              <div className="text-[10px] text-slate-400 font-normal">{d.sub}</div>
              {count > 0 && (
                <span
                  className={`inline-block text-[9px] px-1.5 py-0.2 rounded-full font-bold mt-0.5 ${
                    isSelected
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}班
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Schedules List */}
      <div className="space-y-3">
        {currentDaySchedules.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-medium">本日暂未配置固定接送排程</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              可点击上方“新建排程”设置定时定点孩子接送路线
            </p>
          </div>
        ) : (
          currentDaySchedules.map((schedule) => {
            const isActive = activeScheduleId === schedule.id;
            const assignedKids = schedule.childIds
              .map((id) => childMap.get(id))
              .filter(Boolean) as Child[];

            return (
              <div
                key={schedule.id}
                className={`p-3.5 md:p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50/40 shadow-md ring-1 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
                }`}
              >
                {/* Card Top: Title, Time, Status badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        schedule.type === 'morning_school'
                          ? 'bg-amber-100 text-amber-800'
                          : schedule.type === 'afternoon_pickup'
                          ? 'bg-indigo-100 text-indigo-800'
                          : schedule.type === 'activity_tutoring'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {schedule.type === 'morning_school'
                        ? '🌅 晨间送学'
                        : schedule.type === 'afternoon_pickup'
                        ? '🌇 放学接回'
                        : schedule.type === 'activity_tutoring'
                        ? '🎨 兴趣班'
                        : '⚽ 周末训练'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-800">{schedule.title}</h4>
                    {schedule.isAdjusted && (
                      <span className="text-[10px] bg-rose-100 text-rose-700 font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> 已临时调整
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{schedule.timeSlot}</span>
                  </div>
                </div>

                {/* Assigned Children Avatars & Names */}
                <div className="flex flex-wrap items-center gap-2 mb-3 bg-white/70 p-2 rounded-lg border border-slate-100">
                  <span className="text-[11px] font-medium text-slate-500">载送孩子:</span>
                  {assignedKids.map((kid) => (
                    <div
                      key={kid.id}
                      className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-1 rounded-full text-xs transition-colors cursor-pointer"
                      onClick={() => onOpenChatWithChild?.(kid.id)}
                      title={`点击与 ${kid.guardianName} 沟通留言`}
                    >
                      <img
                        src={kid.avatar}
                        alt={kid.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="font-semibold text-slate-700">{kid.nickname}</span>
                      <span className="text-[10px] text-slate-400">({kid.grade})</span>
                    </div>
                  ))}
                </div>

                {/* Pickup & Dropoff Route Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 mb-3 bg-slate-50/80 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-700">
                        上车点 · {schedule.pickupPoint.estimatedTime}
                      </div>
                      <div className="font-medium text-slate-800">{schedule.pickupPoint.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[220px]">
                        {schedule.pickupPoint.address}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-rose-700">
                        送达点 · {schedule.dropoffPoint.estimatedTime}
                      </div>
                      <div className="font-medium text-slate-800">{schedule.dropoffPoint.name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[220px]">
                        {schedule.dropoffPoint.address}
                      </div>
                    </div>
                  </div>
                </div>

                {schedule.notes && (
                  <div className="text-[11px] text-amber-800 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1.5 rounded-lg mb-3">
                    <span className="font-semibold">备注: </span>
                    {schedule.notes}
                  </div>
                )}

                {/* Bottom Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    {isActive ? (
                      <span className="text-xs font-bold text-blue-600 bg-blue-100/70 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> 当前导航中
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectSchedule(schedule)}
                        className="text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>启用本行程导航</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenCheckIn(schedule)}
                      className="text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>上下车打卡</span>
                    </button>

                    <button
                      onClick={() => onOpenAdjust(schedule)}
                      className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                      title="临时行程调整"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>临时调整</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
