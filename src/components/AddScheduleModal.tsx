import React, { useState } from 'react';
import { Child, DayOfWeek, LocationPoint, ScheduleItem, TripType } from '../types';
import { X, Calendar, Clock, MapPin, Users, Plus, Check } from 'lucide-react';
import { BASE_COORDS } from '../mock/initialData';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSchedule: ScheduleItem) => void;
  childrenList: Child[];
  initialDay?: DayOfWeek;
}

const PRESET_LOCATIONS: { name: string; address: string; lat: number; lng: number }[] = [
  { name: '阳光花园东门', address: '朝阳路88号阳光花园东门接送区', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng },
  { name: '绿城翡翠湾8栋', address: '翡翠湾8栋地库门前接送台', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng },
  { name: '金茂府南门', address: '金茂府南门接驳柱A区', lat: BASE_COORDS.stop3.lat, lng: BASE_COORDS.stop3.lng },
  { name: '实验外国语小学', address: '育才大道120号学校护童专用道', lat: BASE_COORDS.school1.lat, lng: BASE_COORDS.school1.lng },
  { name: '明德双语附属小学', address: '学府路1号大门', lat: BASE_COORDS.school2.lat, lng: BASE_COORDS.school2.lng },
  { name: '少年宫艺术中心', address: '文化艺术广场B栋3层', lat: BASE_COORDS.musicCenter.lat, lng: BASE_COORDS.musicCenter.lng },
  { name: '奥体青少年体育公园', address: '奥体东路8号体育公园南门', lat: BASE_COORDS.sportsPark.lat, lng: BASE_COORDS.sportsPark.lng },
];

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  childrenList,
  initialDay = 1,
}) => {
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialDay);
  const [title, setTitle] = useState('');
  const [tripType, setTripType] = useState<TripType>('morning_school');
  const [selectedChildIds, setSelectedChildIds] = useState<string[]>([]);
  const [pickupTime, setPickupTime] = useState('07:30');
  const [dropoffTime, setDropoffTime] = useState('08:15');
  const [pickupLocIdx, setPickupLocIdx] = useState(0);
  const [dropoffLocIdx, setDropoffLocIdx] = useState(3);
  const [customNotes, setCustomNotes] = useState('');

  if (!isOpen) return null;

  const toggleChild = (id: string) => {
    setSelectedChildIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChildIds.length === 0) {
      alert('请至少选择一位需要接送的孩子');
      return;
    }

    const pLoc = PRESET_LOCATIONS[pickupLocIdx];
    const dLoc = PRESET_LOCATIONS[dropoffLocIdx];

    const pickupPoint: LocationPoint = {
      name: pLoc.name,
      address: pLoc.address,
      lat: pLoc.lat,
      lng: pLoc.lng,
      estimatedTime: pickupTime,
    };

    const dropoffPoint: LocationPoint = {
      name: dLoc.name,
      address: dLoc.address,
      lat: dLoc.lat,
      lng: dLoc.lng,
      estimatedTime: dropoffTime,
    };

    const newSchedule: ScheduleItem = {
      id: `sch_custom_${Date.now()}`,
      dayOfWeek,
      title:
        title.trim() ||
        `${
          dayOfWeek === 1
            ? '周一'
            : dayOfWeek === 2
            ? '周二'
            : dayOfWeek === 3
            ? '周三'
            : dayOfWeek === 4
            ? '周四'
            : dayOfWeek === 5
            ? '周五'
            : dayOfWeek === 6
            ? '周六'
            : '周日'
        } ${tripType === 'morning_school' ? '晨间送学' : tripType === 'afternoon_pickup' ? '下午放学' : '课后兴趣班'}`,
      timeSlot: `${pickupTime} - ${dropoffTime}`,
      type: tripType,
      childIds: selectedChildIds,
      pickupPoint,
      dropoffPoint,
      status: 'scheduled',
      notes: customNotes,
      routeStops: [
        { name: '常熟路车库', address: '常熟路车库', lat: BASE_COORDS.driverStart.lat, lng: BASE_COORDS.driverStart.lng, estimatedTime: pickupTime },
        pickupPoint,
        dropoffPoint,
      ],
    };

    onSave(newSchedule);
    onClose();
  };

  const days: { label: string; value: DayOfWeek }[] = [
    { label: '周一', value: 1 },
    { label: '周二', value: 2 },
    { label: '周三', value: 3 },
    { label: '周四', value: 4 },
    { label: '周五', value: 5 },
    { label: '周六', value: 6 },
    { label: '周日', value: 0 },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-base">新增一星期定时定点接送排程</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Day of Week */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              重复周期 (星期)
            </label>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setDayOfWeek(d.value)}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all text-center ${
                    dayOfWeek === d.value
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/30'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                行程名称 (可选)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="例如：周三课后围棋送达"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                接送类型
              </label>
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as TripType)}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="morning_school">晨间送学</option>
                <option value="afternoon_pickup">下午放学接回</option>
                <option value="activity_tutoring">课后兴趣班/辅导</option>
                <option value="weekend_class">周末特训/俱乐部</option>
              </select>
            </div>
          </div>

          {/* Select Children */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>指定载送孩子 (可多选)</span>
              <span className="text-slate-400 font-normal">已选 {selectedChildIds.length} 人</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {childrenList.map((child) => {
                const isSelected = selectedChildIds.includes(child.id);
                return (
                  <div
                    key={child.id}
                    onClick={() => toggleChild(child.id)}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {child.name} ({child.nickname})
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">{child.grade}</div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time & Location */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-3">
            {/* Pickup */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1 text-emerald-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" /> 上车打卡地点
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" /> 上车时间
                </span>
              </div>
              <div className="flex gap-2">
                <select
                  value={pickupLocIdx}
                  onChange={(e) => setPickupLocIdx(Number(e.target.value))}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  {PRESET_LOCATIONS.map((loc, idx) => (
                    <option key={`p-${idx}`} value={idx}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-24 text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-center font-mono"
                />
              </div>
            </div>

            {/* Dropoff */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1 text-rose-700">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" /> 送达终点
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" /> 预计送达时间
                </span>
              </div>
              <div className="flex gap-2">
                <select
                  value={dropoffLocIdx}
                  onChange={(e) => setDropoffLocIdx(Number(e.target.value))}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
                >
                  {PRESET_LOCATIONS.map((loc, idx) => (
                    <option key={`d-${idx}`} value={idx}>
                      {loc.name}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={dropoffTime}
                  onChange={(e) => setDropoffTime(e.target.value)}
                  className="w-24 text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white text-center font-mono"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              特别提醒与家长备注
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="例如：需携带大提琴、雨具；或靠窗就座"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
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
              className="px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>保存为每周固定排程</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
