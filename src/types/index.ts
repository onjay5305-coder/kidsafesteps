export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 0; // 1: Mon ... 0: Sun

export interface Child {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  age: number;
  grade: string;
  school: string;
  guardianName: string;
  guardianRelation: string; // e.g. "妈妈", "爸爸", "外婆"
  guardianPhone: string;
  emergencyPhone: string;
  notes?: string;
  allergies?: string;
  homeAddress: string;
}

export interface LocationPoint {
  name: string;
  address: string;
  lat: number;
  lng: number;
  estimatedTime: string;
}

export type TripType = 'morning_school' | 'afternoon_pickup' | 'activity_tutoring' | 'weekend_class';

export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'adjusted' | 'cancelled';

export interface ScheduleItem {
  id: string;
  dayOfWeek: DayOfWeek;
  title: string;
  timeSlot: string; // "07:30 - 08:20"
  type: TripType;
  childIds: string[];
  pickupPoint: LocationPoint;
  dropoffPoint: LocationPoint;
  status: ScheduleStatus;
  notes?: string;
  isAdjusted?: boolean;
  adjustmentReason?: string;
  adjustedOriginalTime?: string;
  routeStops: LocationPoint[];
}

export interface CheckInRecord {
  id: string;
  scheduleId: string;
  childId: string;
  type: 'boarded' | 'arrived'; // boarded: 上车打卡, arrived: 送达打卡
  timestamp: number;
  formattedTime: string;
  locationName: string;
  lat: number;
  lng: number;
  seatbeltSecured: boolean;
  photoUrl: string;
  signedBy: string; // 司机或确认老师/家长
  notes?: string;
  temperature?: string;
}

export interface TripRecord {
  id: string;
  scheduleId: string;
  scheduleTitle: string;
  date: string;
  startTime: number;
  endTime?: number;
  distanceKm: number;
  durationMinutes: number;
  avgSpeedKmH: number;
  status: 'driving' | 'completed' | 'paused';
  checkIns: CheckInRecord[];
  fuelSavedKg?: number;
}

export interface ChatMessage {
  id: string;
  scheduleId?: string;
  childId?: string;
  sender: 'driver' | 'parent' | 'system';
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: number;
  type: 'text' | 'voice' | 'checkin_alert' | 'emergency_alert';
  voiceDurationSec?: number;
  read: boolean;
}

export interface LiveVehicleState {
  lat: number;
  lng: number;
  speedKmH: number;
  heading: number; // 0-360 deg
  isMoving: boolean;
  batteryPct: number;
  gear: 'D' | 'P' | 'R';
  doorsLocked: boolean;
  childLockActive: boolean;
  acTemp: number;
  dashcamOnline: boolean;
  e2eeActive: boolean;
}

export interface FamilyShareConfig {
  active: boolean;
  shareCode: string;
  shareUrl: string;
  recipientName: string;
  expiresInHours: number;
  createdAt: number;
  allowChat: boolean;
  allowRealtimeGPS: boolean;
}
