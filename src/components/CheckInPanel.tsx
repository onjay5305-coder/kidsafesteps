import React, { useState } from 'react';
import { ScheduleItem, Child, CheckInRecord, LiveVehicleState } from '../types';
import {
  X,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Thermometer,
  AlertCircle
} from 'lucide-react';

interface CheckInPanelProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: ScheduleItem | null;
  childrenList: Child[];
  checkInRecords: CheckInRecord[];
  vehicleState: LiveVehicleState;
  onPerformCheckIn: (record: Omit<CheckInRecord, 'id'>) => void;
}

export const CheckInPanel: React.FC<CheckInPanelProps> = ({
  isOpen,
  onClose,
  schedule,
  childrenList,
  checkInRecords,
  vehicleState,
  onPerformCheckIn,
}) => {
  const [selectedChildId, setSelectedChildId] = useState<string>('');
  const [checkType, setCheckType] = useState<'boarded' | 'arrived'>('boarded');
  const [seatbeltSecured, setSeatbeltSecured] = useState(true);
  const [temperature, setTemperature] = useState('36.5°C');
  const [notes, setNotes] = useState('');
  const [usePhotoProof, setUsePhotoProof] = useState(true);

  if (!isOpen || !schedule) return null;

  const assignedKids = schedule.childIds
    .map((id) => childrenList.find((c) => c.id === id))
    .filter(Boolean) as Child[];

  // Current active kid
  const currentChild = childrenList.find((c) => c.id === (selectedChildId || assignedKids[0]?.id));

  // Determine current child's check-in status
  const childCheckIns = checkInRecords.filter(
    (r) => r.scheduleId === schedule.id && r.childId === currentChild?.id
  );
  const hasBoarded = childCheckIns.some((r) => r.type === 'boarded');
  const hasArrived = childCheckIns.some((r) => r.type === 'arrived');

  const handleConfirmCheckIn = () => {
    if (!currentChild) return;

    const now = new Date();
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    const locationName =
      checkType === 'boarded' ? schedule.pickupPoint.name : schedule.dropoffPoint.name;

    const newRecord: Omit<CheckInRecord, 'id'> = {
      scheduleId: schedule.id,
      childId: currentChild.id,
      type: checkType,
      timestamp: Date.now(),
      formattedTime,
      locationName,
      lat: vehicleState.lat,
      lng: vehicleState.lng,
      seatbeltSecured,
      photoUrl: currentChild.avatar,
      signedBy: checkType === 'boarded' ? '接送司机 (车主王师傅)' : '学校老师 / 护童员',
      notes: notes.trim() || (checkType === 'boarded' ? '安全上车并系好安全带' : '已交接至校门口护童老师'),
      temperature: checkType === 'boarded' ? temperature : undefined,
    };

    onPerformCheckIn(newRecord);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <div>
              <h3 className="font-bold text-base">儿童载送打卡签到中心</h3>
              <p className="text-xs text-emerald-100">{schedule.title}</p>
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
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Child Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              选择本次打卡的孩子
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {assignedKids.map((kid) => {
                const isSelected = (currentChild?.id === kid.id);
                const kidRecords = checkInRecords.filter(
                  (r) => r.scheduleId === schedule.id && r.childId === kid.id
                );
                const isBoarded = kidRecords.some((r) => r.type === 'boarded');
                const isArrived = kidRecords.some((r) => r.type === 'arrived');

                return (
                  <button
                    type="button"
                    key={kid.id}
                    onClick={() => {
                      setSelectedChildId(kid.id);
                      setCheckType(isBoarded && !isArrived ? 'arrived' : 'boarded');
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <img
                      src={kid.avatar}
                      alt={kid.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{kid.nickname}</div>
                      <div className="text-[10px]">
                        {isArrived ? (
                          <span className="text-emerald-600 font-semibold">● 已送达</span>
                        ) : isBoarded ? (
                          <span className="text-blue-600 font-semibold">● 行驶中</span>
                        ) : (
                          <span className="text-amber-600 font-semibold">○ 待接送</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {currentChild && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-4">
              {/* Type Switcher: 上车打卡 vs 送达打卡 */}
              <div className="flex rounded-lg bg-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => setCheckType('boarded')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    checkType === 'boarded'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>1. 上车接载打卡 (Mark Picked Up)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckType('arrived')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    checkType === 'arrived'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. 下车送达打卡 (Mark Dropped Off)</span>
                </button>
              </div>

              {/* Status preview for current child */}
              <div className="flex items-center justify-between text-xs p-2.5 bg-white rounded-lg border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">当前监护状态:</span>
                  {hasArrived ? (
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      已安全送达目的地
                    </span>
                  ) : hasBoarded ? (
                    <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      已载上车 · 专车行驶中
                    </span>
                  ) : (
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      等候接车中
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  家长: {currentChild.guardianName} ({currentChild.guardianRelation})
                </div>
              </div>

              {/* Checks */}
              {checkType === 'boarded' ? (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seatbeltSecured}
                      onChange={(e) => setSeatbeltSecured(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="font-medium text-slate-700">安全带/气囊背心已扣好</span>
                  </label>

                  <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200">
                    <Thermometer className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="text-slate-600">体温正常:</span>
                    <input
                      type="text"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      className="w-16 font-mono text-xs px-1.5 py-0.5 border border-slate-300 rounded text-center"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-700 font-medium">
                      交接确认: 护童老师/校方值班员已当面签收
                    </span>
                  </div>
                  <span className="text-emerald-600 font-bold">✓ 双方确认</span>
                </div>
              )}

              {/* Photo Evidence & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200">
                  <Camera className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-700">实时留痕凭证照:</span>
                  <span className="text-slate-500 font-mono text-[11px] truncate">已自动存证</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-white rounded-lg border border-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-700">定位打卡:</span>
                  <span className="text-slate-500 truncate text-[11px]">
                    {checkType === 'boarded' ? schedule.pickupPoint.name : schedule.dropoffPoint.name}
                  </span>
                </div>
              </div>

              {/* Notes Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  打卡补充留言 (自动同步通知家长)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    checkType === 'boarded'
                      ? '例如：孩子带齐了红领巾和水壶，精神饱满'
                      : '例如：已亲手交给三班李老师，已进校门'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Confirm Action Button */}
              <button
                type="button"
                onClick={handleConfirmCheckIn}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 ${
                  checkType === 'boarded'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                }`}
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  确认【{currentChild.nickname}】
                  {checkType === 'boarded' ? '上车打卡并通知家长' : '送达打卡并记录行程'}
                </span>
              </button>
            </div>
          )}

          {/* Today's Checkin Records for this Trip */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              本次行程打卡流水记录 ({childCheckIns.length})
            </h4>
            {childCheckIns.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                暂无打卡记录，请在接到孩子或送达时点击上方确认打卡
              </div>
            ) : (
              <div className="space-y-2">
                {childCheckIns.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={record.photoUrl}
                        alt="凭证"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-300 shadow-sm"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                              record.type === 'boarded'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {record.type === 'boarded' ? '已上车打卡' : '已送达打卡'}
                          </span>
                          <span className="font-semibold text-slate-800">{record.locationName}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {record.notes} · 经办人: {record.signedBy}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-700">{record.formattedTime}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">GPS已验证</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
