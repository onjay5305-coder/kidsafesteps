/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Navbar } from './components/Navbar';
import { MapNavigator } from './components/MapNavigator';
import { ScheduleWeekView } from './components/ScheduleWeekView';
import { CheckInPanel } from './components/CheckInPanel';
import { AddScheduleModal } from './components/AddScheduleModal';
import { ScheduleAdjustModal } from './components/ScheduleAdjustModal';
import { FamilyShareModal } from './components/FamilyShareModal';
import { EmergencyModal } from './components/EmergencyModal';
import { EncryptionSecurityModal } from './components/EncryptionSecurityModal';
import { ChatMessenger } from './components/ChatMessenger';
import { TripHistoryView } from './components/TripHistoryView';
import { ParentViewMode } from './components/ParentViewMode';
import {
  INITIAL_CHILDREN,
  INITIAL_SCHEDULES,
  INITIAL_CHECKINS,
  INITIAL_TRIP_HISTORY,
  INITIAL_CHAT_MESSAGES,
  INITIAL_VEHICLE_STATE,
  BASE_COORDS,
} from './mock/initialData';
import {
  Child,
  ScheduleItem,
  CheckInRecord,
  TripRecord,
  ChatMessage,
  LiveVehicleState,
  DayOfWeek,
  LocationPoint,
} from './types';
import {
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Radio,
  Clock,
  Compass,
  Car,
  BellRing
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCp1X_Ws57_TB43apoPsCHM9RkjsUftbwc';

export default function App() {
  // Quota banner state per Section 8
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Core App States
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(INITIAL_SCHEDULES);
  const [activeScheduleId, setActiveScheduleId] = useState<string>('sch_mon_morning');
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>(INITIAL_CHECKINS);
  const [tripHistory, setTripHistory] = useState<TripRecord[]>(INITIAL_TRIP_HISTORY);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [vehicleState, setVehicleState] = useState<LiveVehicleState>(INITIAL_VEHICLE_STATE);

  // UI state
  const [currentRole, setCurrentRole] = useState<'driver' | 'parent'>('driver');
  const [activeTab, setActiveTab] = useState<'map_schedule' | 'history' | 'messages'>('map_schedule');
  const [selectedChildChatFilter, setSelectedChildChatFilter] = useState<string | undefined>();

  // Modals state
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false);
  const [addScheduleDay, setAddScheduleDay] = useState<DayOfWeek>(1);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [scheduleToAdjust, setScheduleToAdjust] = useState<ScheduleItem | null>(null);
  const [isFamilyShareOpen, setIsFamilyShareOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Toast banner notification
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastNotification(text);
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  // Find active schedule
  const activeSchedule = schedules.find((s) => s.id === activeScheduleId) || schedules[0] || null;

  // Active waypoints
  const activeStops: LocationPoint[] = activeSchedule
    ? activeSchedule.routeStops || [
        {
          name: '常熟路车库',
          address: '常熟路车库',
          lat: BASE_COORDS.driverStart.lat,
          lng: BASE_COORDS.driverStart.lng,
          estimatedTime: '07:25',
        },
        activeSchedule.pickupPoint,
        activeSchedule.dropoffPoint,
      ]
    : [];

  // Simulation engine
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const simIndexRef = useRef(0);

  // Generate smooth simulation coordinates along the route
  const simPoints = [
    { lat: 31.222, lng: 121.445, heading: 45, speed: 28 },
    { lat: 31.2235, lng: 121.447, heading: 50, speed: 32 },
    { lat: 31.225, lng: 121.449, heading: 40, speed: 18 }, // stop 1
    { lat: 31.228, lng: 121.452, heading: 55, speed: 38 },
    { lat: 31.231, lng: 121.455, heading: 60, speed: 22 }, // stop 2
    { lat: 31.2335, lng: 121.4582, heading: 48, speed: 34 },
    { lat: 31.236, lng: 121.462, heading: 35, speed: 30 }, // stop 3
    { lat: 31.239, lng: 121.465, heading: 42, speed: 40 },
    { lat: 31.242, lng: 121.468, heading: 30, speed: 20 }, // school 1
    { lat: 31.245, lng: 121.471, heading: 45, speed: 35 },
    { lat: 31.248, lng: 121.475, heading: 60, speed: 15 }, // school 2
  ];

  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      simIndexRef.current = (simIndexRef.current + 1) % simPoints.length;
      const pt = simPoints[simIndexRef.current];
      setVehicleState((prev) => ({
        ...prev,
        lat: pt.lat,
        lng: pt.lng,
        heading: pt.heading,
        speedKmH: Math.round(pt.speed * (0.9 + Math.random() * 0.2)),
        isMoving: true,
      }));
    }, 2800 / simSpeed);

    return () => clearInterval(interval);
  }, [isSimulating, simSpeed]);

  // Handle Check-in / Check-out
  const handlePerformCheckIn = (recordData: Omit<CheckInRecord, 'id'>) => {
    const newRecord: CheckInRecord = {
      ...recordData,
      id: `chk_${Date.now()}`,
    };

    setCheckInRecords((prev) => [newRecord, ...prev]);

    const kid = childrenList.find((c) => c.id === newRecord.childId);
    const kidName = kid ? kid.name : '孩子';

    const actionText =
      newRecord.type === 'boarded' ? '已安全上车打卡' : '已顺利送达打卡';

    const alertContent = `【打卡自动播报】${kidName} ${actionText}！地点：${newRecord.locationName}，时间：${newRecord.formattedTime}。安全带与状态已核验。`;

    // Push system message to chat
    const systemMsg: ChatMessage = {
      id: `sys_${Date.now()}`,
      scheduleId: newRecord.scheduleId,
      childId: newRecord.childId,
      sender: 'system',
      senderName: '打卡审计中心',
      senderAvatar: '',
      content: alertContent,
      timestamp: Date.now(),
      type: 'checkin_alert',
      read: true,
    };

    setMessages((prev) => [...prev, systemMsg]);
    showToast(`打卡成功！已记录精准时间(${newRecord.formattedTime})并实时推送给关联家长。`);
  };

  // Handle Add New Schedule
  const handleSaveNewSchedule = (newSchedule: ScheduleItem) => {
    setSchedules((prev) => [...prev, newSchedule]);
    setActiveScheduleId(newSchedule.id);
    showToast(`成功新增每周${newSchedule.title}！已同步至定时接送日历。`);
  };

  // Handle Schedule Adjustment
  const handleConfirmAdjust = (adjustedSchedule: ScheduleItem, notifyMessage: string) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === adjustedSchedule.id ? adjustedSchedule : s))
    );

    // Push adjustment alert to chat
    const alertMsg: ChatMessage = {
      id: `adj_${Date.now()}`,
      scheduleId: adjustedSchedule.id,
      sender: 'system',
      senderName: '行程调整中心',
      senderAvatar: '',
      content: notifyMessage,
      timestamp: Date.now(),
      type: 'checkin_alert',
      read: true,
    };

    setMessages((prev) => [...prev, alertMsg]);
    showToast('行程调整成功！GPS 导航已动态更新路线，家长端已同步提醒。');
  };

  // Handle Chat Message
  const handleSendMessage = (msgData: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: ChatMessage = {
      ...msgData,
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  // Handle Emergency SOS
  const handleTriggerSOS = (sosDetails: string) => {
    const sosMsg: ChatMessage = {
      id: `sos_${Date.now()}`,
      sender: 'system',
      senderName: '🚨 紧急报警广播',
      senderAvatar: '',
      content: sosDetails,
      timestamp: Date.now(),
      type: 'emergency_alert',
      read: false,
    };
    setMessages((prev) => [...prev, sosMsg]);
    showToast('🚨 SOS 紧急求救广播已激活！正在向应急中心与所有家长推送高精经纬度！');
  };

  const checkedInChildIds = checkInRecords
    .filter((r) => r.scheduleId === activeScheduleId && r.type === 'boarded')
    .map((r) => r.childId);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
        {/* Tier 2 Quota Exceeded Sticky Notice Banner (Section 8) */}
        {quotaExceeded && (
          <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
            <span>
              Google Maps Platform quota reached. If you are the app owner, visit{' '}
              <a
                href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold text-amber-950 hover:text-amber-800"
              >
                maps developer site
              </a>{' '}
              for instructions to update your account.
            </span>
          </div>
        )}

        {/* Global Toast Alert */}
        {toastNotification && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <BellRing className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>{toastNotification}</span>
          </div>
        )}

        {/* Top Navbar */}
        <Navbar
          currentRole={currentRole}
          onToggleRole={() => setCurrentRole(currentRole === 'driver' ? 'parent' : 'driver')}
          onOpenSOS={() => setIsEmergencyOpen(true)}
          onOpenShare={() => setIsFamilyShareOpen(true)}
          onOpenSecurity={() => setIsSecurityOpen(true)}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          unreadCount={messages.filter((m) => !m.read).length}
        />

        {/* Main Workspace */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 md:p-6 space-y-5">
          {/* Quick Role & Mode Banner */}
          <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`font-bold px-2.5 py-1 rounded-lg ${
                  currentRole === 'driver'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {currentRole === 'driver' ? '🚗 当前为车主驾驶舱视图' : '👨‍👩‍👧 当前为家长简明监护端'}
              </span>
              <span className="text-slate-500 hidden sm:inline">
                {currentRole === 'driver'
                  ? '支持高精 GPS 导航、打卡签到、查看沿途上下车站点与路线调整'
                  : '一键清晰查看接送车辆状态、孩子上下车打卡证明及直接拨打/留言'}
              </span>
            </div>

            <button
              onClick={() => setCurrentRole(currentRole === 'driver' ? 'parent' : 'driver')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>切换至 {currentRole === 'driver' ? '家长监护端' : '车主驾驶舱'}</span>
            </button>
          </div>

          {/* TAB 1: 实时导航与排程 (Map & Weekly Schedule) */}
          {activeTab === 'map_schedule' && (
            <div className="space-y-5">
              {currentRole === 'parent' ? (
                /* PARENT VIEW MODE */
                <div className="space-y-5">
                  <ParentViewMode
                    childrenList={childrenList}
                    vehicleState={vehicleState}
                    activeSchedule={activeSchedule}
                    checkInRecords={checkInRecords}
                    onOpenChat={(kidId) => {
                      setSelectedChildChatFilter(kidId);
                      setActiveTab('messages');
                    }}
                    onOpenAdjust={(sch) => {
                      setScheduleToAdjust(sch);
                      setIsAdjustOpen(true);
                    }}
                    onOpenShare={() => setIsFamilyShareOpen(true)}
                    onOpenSOS={() => setIsEmergencyOpen(true)}
                  />

                  {/* Map view included for parent to track car in real-time */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-blue-600" />
                        <span>实时车辆 GPS 轨迹与地图监护</span>
                      </h3>
                      <span className="text-xs text-slate-500">
                        当前车速: {vehicleState.speedKmH} km/h · 信号高精锁定
                      </span>
                    </div>
                    <MapNavigator
                      vehicleState={vehicleState}
                      activeStops={activeStops}
                      childrenList={childrenList}
                      checkedInChildIds={checkedInChildIds}
                      isSimulating={isSimulating}
                      onToggleSimulation={() => setIsSimulating(!isSimulating)}
                      simSpeed={simSpeed}
                      onChangeSimSpeed={setSimSpeed}
                    />
                  </div>
                </div>
              ) : (
                /* DRIVER VIEW MODE */
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Interactive Google Map Navigation (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h3 className="font-bold text-slate-800 text-sm">
                          GPS 智能行车导航仪表板
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <button
                          onClick={() => setIsCheckInOpen(true)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>一键上下车打卡</span>
                        </button>
                      </div>
                    </div>

                    <MapNavigator
                      vehicleState={vehicleState}
                      activeStops={activeStops}
                      childrenList={childrenList}
                      checkedInChildIds={checkedInChildIds}
                      onSelectStop={(stop) => {
                        showToast(`已选中途经点：${stop.name} (${stop.estimatedTime})`);
                      }}
                      onSelectChild={(kidId) => {
                        const kid = childrenList.find((c) => c.id === kidId);
                        if (kid) showToast(`载送儿童：${kid.name} - ${kid.grade}`);
                      }}
                      isSimulating={isSimulating}
                      onToggleSimulation={() => setIsSimulating(!isSimulating)}
                      simSpeed={simSpeed}
                      onChangeSimSpeed={setSimSpeed}
                    />

                    {/* Quick Active Schedule Status Bar */}
                    {activeSchedule && (
                      <div className="bg-white rounded-xl p-3 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-600" />
                            <span>正在执行: {activeSchedule.title}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            上车: {activeSchedule.pickupPoint.name} ➔ 送达: {activeSchedule.dropoffPoint.name}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setScheduleToAdjust(activeSchedule);
                              setIsAdjustOpen(true);
                            }}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-2.5 py-1.5 rounded-lg border border-amber-200 transition-colors"
                          >
                            临时行程改签
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Weekly Schedule & Child Management (5 cols) */}
                  <div className="lg:col-span-5 space-y-4">
                    <ScheduleWeekView
                      schedules={schedules}
                      childrenList={childrenList}
                      activeScheduleId={activeScheduleId}
                      onSelectSchedule={(sch) => {
                        setActiveScheduleId(sch.id);
                        showToast(`已切换当前导航路线为【${sch.title}】`);
                      }}
                      onOpenAddSchedule={(day) => {
                        setAddScheduleDay(day);
                        setIsAddScheduleOpen(true);
                      }}
                      onOpenCheckIn={(sch) => {
                        setActiveScheduleId(sch.id);
                        setIsCheckInOpen(true);
                      }}
                      onOpenAdjust={(sch) => {
                        setScheduleToAdjust(sch);
                        setIsAdjustOpen(true);
                      }}
                      onOpenChatWithChild={(kidId) => {
                        setSelectedChildChatFilter(kidId);
                        setActiveTab('messages');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 家车即时沟通与留言 (Chat & Notes) */}
          {activeTab === 'messages' && (
            <div className="max-w-4xl mx-auto">
              <ChatMessenger
                messages={messages}
                childrenList={childrenList}
                activeSchedule={activeSchedule}
                onSendMessage={handleSendMessage}
                currentRole={currentRole}
                onToggleRole={() => setCurrentRole(currentRole === 'driver' ? 'parent' : 'driver')}
                selectedChildFilter={selectedChildChatFilter}
                onSelectChildFilter={setSelectedChildChatFilter}
              />
            </div>
          )}

          {/* TAB 3: 行程数据记录与审计 (Trip History) */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <TripHistoryView
                tripHistory={tripHistory}
                childrenList={childrenList}
                todayCheckIns={checkInRecords}
              />
            </div>
          )}
        </main>

        {/* Modal 1: Check-in & Check-out Panel */}
        <CheckInPanel
          isOpen={isCheckInOpen}
          onClose={() => setIsCheckInOpen(false)}
          schedule={activeSchedule}
          childrenList={childrenList}
          checkInRecords={checkInRecords}
          vehicleState={vehicleState}
          onPerformCheckIn={handlePerformCheckIn}
        />

        {/* Modal 2: Add Recurring Weekly Schedule */}
        <AddScheduleModal
          isOpen={isAddScheduleOpen}
          onClose={() => setIsAddScheduleOpen(false)}
          onSave={handleSaveNewSchedule}
          childrenList={childrenList}
          initialDay={addScheduleDay}
        />

        {/* Modal 3: Temporary Schedule Adjustment */}
        <ScheduleAdjustModal
          isOpen={isAdjustOpen}
          onClose={() => setIsAdjustOpen(false)}
          schedule={scheduleToAdjust || activeSchedule}
          onConfirmAdjust={handleConfirmAdjust}
        />

        {/* Modal 4: Family Live Location Share */}
        <FamilyShareModal
          isOpen={isFamilyShareOpen}
          onClose={() => setIsFamilyShareOpen(false)}
          vehicleState={vehicleState}
          activeSchedule={activeSchedule}
          childrenList={childrenList}
          checkIns={checkInRecords}
          onOpenParentPreview={() => {
            setCurrentRole('parent');
            setActiveTab('map_schedule');
            showToast('已进入家人端极简监护实时预览模式');
          }}
        />

        {/* Modal 5: Emergency Call & SOS */}
        <EmergencyModal
          isOpen={isEmergencyOpen}
          onClose={() => setIsEmergencyOpen(false)}
          vehicleState={vehicleState}
          childrenList={childrenList}
          onTriggerSOS={handleTriggerSOS}
        />

        {/* Modal 6: Data Encryption & Privacy Guard Report */}
        <EncryptionSecurityModal
          isOpen={isSecurityOpen}
          onClose={() => setIsSecurityOpen(false)}
        />
      </div>
    </APIProvider>
  );
}
