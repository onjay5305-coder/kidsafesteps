import { Child, ScheduleItem, CheckInRecord, TripRecord, ChatMessage, LiveVehicleState } from '../types';

export const INITIAL_CHILDREN: Child[] = [
  {
    id: 'child_1',
    name: '林子轩',
    nickname: '轩轩',
    avatar: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=200&q=80',
    age: 8,
    grade: '小学二年级(3)班',
    school: '实验外国语小学',
    guardianName: '林海峰',
    guardianRelation: '爸爸',
    guardianPhone: '13812345678',
    emergencyPhone: '13987654321',
    notes: '容易晕车，尽量安排前排或靠窗；带了水壶在书包侧袋',
    allergies: '对花生轻微过敏',
    homeAddress: '阳光花园小区东门 1号楼'
  },
  {
    id: 'child_2',
    name: '陈可欣',
    nickname: '可可',
    avatar: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=200&q=80',
    age: 9,
    grade: '小学三年级(1)班',
    school: '实验外国语小学',
    guardianName: '陈雅琴',
    guardianRelation: '妈妈',
    guardianPhone: '13700112233',
    emergencyPhone: '13700112234',
    notes: '周二和周四下午有大提琴课，需小心放置大提琴箱',
    allergies: '无特殊过敏',
    homeAddress: '绿城翡翠湾 8栋地下车库入口'
  },
  {
    id: 'child_3',
    name: '张宇恒',
    nickname: '恒恒',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=80',
    age: 7,
    grade: '小学一年级(5)班',
    school: '明德双语附属实验小学',
    guardianName: '张建军',
    guardianRelation: '爷爷',
    guardianPhone: '13666554433',
    emergencyPhone: '13588990011',
    notes: '活泼好动，上车必须戴好儿童安全气囊背心及安全带',
    allergies: '牛奶乳糖不耐',
    homeAddress: '金茂府南门 接送等候区'
  },
  {
    id: 'child_4',
    name: '王若晴',
    nickname: '晴晴',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80',
    age: 10,
    grade: '小学四年级(2)班',
    school: '明德双语附属实验小学',
    guardianName: '王薇',
    guardianRelation: '妈妈',
    guardianPhone: '13911223344',
    emergencyPhone: '13911223345',
    notes: '周六上午有少儿奥数与乐高机器人集训',
    allergies: '无',
    homeAddress: '万科城北区 3号门'
  }
];

// Central coordinate center: Shanghai West Road / Jing'an / Xuhui urban area
export const BASE_COORDS = {
  driverStart: { lat: 31.222, lng: 121.445 },
  stop1: { lat: 31.225, lng: 121.449 }, // 阳光花园
  stop2: { lat: 31.231, lng: 121.455 }, // 绿城翡翠湾
  stop3: { lat: 31.236, lng: 121.462 }, // 金茂府
  school1: { lat: 31.242, lng: 121.468 }, // 实验外国语小学
  school2: { lat: 31.248, lng: 121.475 }, // 明德双语实验小学
  musicCenter: { lat: 31.228, lng: 121.438 }, // 少年宫音乐艺术中心
  sportsPark: { lat: 31.218, lng: 121.452 } // 青少年奥林匹克体育中心
};

export const INITIAL_SCHEDULES: ScheduleItem[] = [
  // 周一 (Day 1)
  {
    id: 'sch_mon_morning',
    dayOfWeek: 1,
    title: '周一 晨间送学专线 (轩轩 & 可可)',
    timeSlot: '07:25 - 08:05',
    type: 'morning_school',
    childIds: ['child_1', 'child_2'],
    pickupPoint: {
      name: '阳光花园东门',
      address: '朝阳路88号阳光花园东门接驳点',
      lat: BASE_COORDS.stop1.lat,
      lng: BASE_COORDS.stop1.lng,
      estimatedTime: '07:30'
    },
    dropoffPoint: {
      name: '实验外国语小学 正门',
      address: '育才大道120号学校护童专用道',
      lat: BASE_COORDS.school1.lat,
      lng: BASE_COORDS.school1.lng,
      estimatedTime: '08:05'
    },
    status: 'in_progress',
    notes: '周一早高峰路况易拥堵，建议提前5分钟发车',
    routeStops: [
      { name: '出发点·私家车位', address: '常熟路车库', lat: BASE_COORDS.driverStart.lat, lng: BASE_COORDS.driverStart.lng, estimatedTime: '07:25' },
      { name: '接轩轩·阳光花园', address: '阳光花园东门', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng, estimatedTime: '07:30' },
      { name: '接可可·翡翠湾', address: '绿城翡翠湾8栋入口', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng, estimatedTime: '07:42' },
      { name: '送达·实验外国语小学', address: '育才大道120号', lat: BASE_COORDS.school1.lat, lng: BASE_COORDS.school1.lng, estimatedTime: '08:05' }
    ]
  },
  {
    id: 'sch_mon_afternoon',
    dayOfWeek: 1,
    title: '周一 下午放学接送专线',
    timeSlot: '16:30 - 17:20',
    type: 'afternoon_pickup',
    childIds: ['child_1', 'child_2', 'child_3'],
    pickupPoint: {
      name: '实验外国语小学 辅门接送区',
      address: '育才大道辅路学生放学通道',
      lat: BASE_COORDS.school1.lat,
      lng: BASE_COORDS.school1.lng,
      estimatedTime: '16:35'
    },
    dropoffPoint: {
      name: '金茂府小区 接送点',
      address: '金茂府南门',
      lat: BASE_COORDS.stop3.lat,
      lng: BASE_COORDS.stop3.lng,
      estimatedTime: '17:20'
    },
    status: 'scheduled',
    routeStops: [
      { name: '接学第一站·外语小学', address: '育才大道120号', lat: BASE_COORDS.school1.lat, lng: BASE_COORDS.school1.lng, estimatedTime: '16:35' },
      { name: '接学第二站·明德小学', address: '学府路1号', lat: BASE_COORDS.school2.lat, lng: BASE_COORDS.school2.lng, estimatedTime: '16:50' },
      { name: '送达轩轩家', address: '阳光花园东门', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng, estimatedTime: '17:05' },
      { name: '送达可可家', address: '翡翠湾入口', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng, estimatedTime: '17:15' },
      { name: '送达恒恒家', address: '金茂府南门', lat: BASE_COORDS.stop3.lat, lng: BASE_COORDS.stop3.lng, estimatedTime: '17:25' }
    ]
  },
  // 周二 (Day 2)
  {
    id: 'sch_tue_morning',
    dayOfWeek: 2,
    title: '周二 晨间多子拼车送学',
    timeSlot: '07:20 - 08:10',
    type: 'morning_school',
    childIds: ['child_1', 'child_3'],
    pickupPoint: {
      name: '金茂府南门',
      address: '金茂府南门接驳柱A区',
      lat: BASE_COORDS.stop3.lat,
      lng: BASE_COORDS.stop3.lng,
      estimatedTime: '07:25'
    },
    dropoffPoint: {
      name: '明德双语实验小学',
      address: '学府路1号大门',
      lat: BASE_COORDS.school2.lat,
      lng: BASE_COORDS.school2.lng,
      estimatedTime: '08:10'
    },
    status: 'scheduled',
    routeStops: [
      { name: '接恒恒', address: '金茂府南门', lat: BASE_COORDS.stop3.lat, lng: BASE_COORDS.stop3.lng, estimatedTime: '07:25' },
      { name: '接轩轩', address: '阳光花园', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng, estimatedTime: '07:40' },
      { name: '送达明德与实验', address: '学府路1号', lat: BASE_COORDS.school2.lat, lng: BASE_COORDS.school2.lng, estimatedTime: '08:10' }
    ]
  },
  {
    id: 'sch_tue_art',
    dayOfWeek: 2,
    title: '周二 课后大提琴艺术班接送 (可可)',
    timeSlot: '17:15 - 18:30',
    type: 'activity_tutoring',
    childIds: ['child_2'],
    pickupPoint: {
      name: '实验外国语小学',
      address: '育才大道120号',
      lat: BASE_COORDS.school1.lat,
      lng: BASE_COORDS.school1.lng,
      estimatedTime: '17:15'
    },
    dropoffPoint: {
      name: '少年宫音乐艺术中心',
      address: '文化艺术广场B栋3层',
      lat: BASE_COORDS.musicCenter.lat,
      lng: BASE_COORDS.musicCenter.lng,
      estimatedTime: '17:45'
    },
    status: 'scheduled',
    notes: '大提琴放置在后备箱固定卡扣，已向老师预约好交接',
    routeStops: [
      { name: '接可可', address: '育才大道120号', lat: BASE_COORDS.school1.lat, lng: BASE_COORDS.school1.lng, estimatedTime: '17:15' },
      { name: '送达少年宫', address: '文化艺术广场B栋', lat: BASE_COORDS.musicCenter.lat, lng: BASE_COORDS.musicCenter.lng, estimatedTime: '17:45' }
    ]
  },
  // 周三 (Day 3)
  {
    id: 'sch_wed_morning',
    dayOfWeek: 3,
    title: '周三 晨间全线送学',
    timeSlot: '07:25 - 08:15',
    type: 'morning_school',
    childIds: ['child_1', 'child_2', 'child_4'],
    pickupPoint: {
      name: '万科城北区 3号门',
      address: '万科城北区环岛候车亭',
      lat: BASE_COORDS.stop2.lat,
      lng: BASE_COORDS.stop2.lng,
      estimatedTime: '07:30'
    },
    dropoffPoint: {
      name: '实验外国语小学',
      address: '育才大道120号',
      lat: BASE_COORDS.school1.lat,
      lng: BASE_COORDS.school1.lng,
      estimatedTime: '08:15'
    },
    status: 'scheduled',
    routeStops: [
      { name: '接晴晴', address: '万科城北区', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng, estimatedTime: '07:30' },
      { name: '接轩轩', address: '阳光花园', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng, estimatedTime: '07:45' },
      { name: '送达学校', address: '育才大道120号', lat: BASE_COORDS.school1.lat, lng: BASE_COORDS.school1.lng, estimatedTime: '08:15' }
    ]
  },
  // 周四 (Day 4)
  {
    id: 'sch_thu_afternoon',
    dayOfWeek: 4,
    title: '周四 放学接送 & 托管中心',
    timeSlot: '16:40 - 17:35',
    type: 'afternoon_pickup',
    childIds: ['child_2', 'child_3'],
    pickupPoint: {
      name: '明德双语实验小学',
      address: '学府路1号',
      lat: BASE_COORDS.school2.lat,
      lng: BASE_COORDS.school2.lng,
      estimatedTime: '16:40'
    },
    dropoffPoint: {
      name: '新华儿童托管中心',
      address: '民康路300号智慧大厦A座',
      lat: BASE_COORDS.stop3.lat,
      lng: BASE_COORDS.stop3.lng,
      estimatedTime: '17:30'
    },
    status: 'scheduled',
    routeStops: [
      { name: '接学生', address: '学府路1号', lat: BASE_COORDS.school2.lat, lng: BASE_COORDS.school2.lng, estimatedTime: '16:40' },
      { name: '送达托管中心', address: '民康路300号', lat: BASE_COORDS.stop3.lat, lng: BASE_COORDS.stop3.lng, estimatedTime: '17:30' }
    ]
  },
  // 周五 (Day 5)
  {
    id: 'sch_fri_afternoon',
    dayOfWeek: 5,
    title: '周五 放学安全回家专车',
    timeSlot: '15:30 - 16:30',
    type: 'afternoon_pickup',
    childIds: ['child_1', 'child_2', 'child_3', 'child_4'],
    pickupPoint: {
      name: '实验外国语小学',
      address: '育才大道120号',
      lat: BASE_COORDS.school1.lat,
      lng: BASE_COORDS.school1.lng,
      estimatedTime: '15:30'
    },
    dropoffPoint: {
      name: '阳光花园/金茂府/翡翠湾',
      address: '各学生家庭点',
      lat: BASE_COORDS.stop1.lat,
      lng: BASE_COORDS.stop1.lng,
      estimatedTime: '16:30'
    },
    status: 'scheduled',
    routeStops: [
      { name: '学校接人', address: '育才大道120号', lat: BASE_COORDS.school1.lat, lng: BASE_COORDS.school1.lng, estimatedTime: '15:30' },
      { name: '送达轩轩', address: '阳光花园', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng, estimatedTime: '15:50' },
      { name: '送达可可', address: '翡翠湾', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng, estimatedTime: '16:10' },
      { name: '送达恒恒', address: '金茂府', lat: BASE_COORDS.stop3.lat, lng: BASE_COORDS.stop3.lng, estimatedTime: '16:30' }
    ]
  },
  // 周六 (Day 6)
  {
    id: 'sch_sat_sports',
    dayOfWeek: 6,
    title: '周六 周末奥体足球青训营 (恒恒 & 晴晴)',
    timeSlot: '09:00 - 11:30',
    type: 'weekend_class',
    childIds: ['child_3', 'child_4'],
    pickupPoint: {
      name: '金茂府南门',
      address: '金茂府南门',
      lat: BASE_COORDS.stop3.lat,
      lng: BASE_COORDS.stop3.lng,
      estimatedTime: '09:00'
    },
    dropoffPoint: {
      name: '青少年奥林匹克体育中心 足球场2号门',
      address: '奥体东路8号体育公园南门',
      lat: BASE_COORDS.sportsPark.lat,
      lng: BASE_COORDS.sportsPark.lng,
      estimatedTime: '09:35'
    },
    status: 'scheduled',
    notes: '记得检查足球鞋、护腿板与运动水壶',
    routeStops: [
      { name: '接恒恒', address: '金茂府', lat: BASE_COORDS.stop3.lat, lng: BASE_COORDS.stop3.lng, estimatedTime: '09:00' },
      { name: '接晴晴', address: '万科城北区', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng, estimatedTime: '09:15' },
      { name: '送达奥体中心', address: '奥体东路8号', lat: BASE_COORDS.sportsPark.lat, lng: BASE_COORDS.sportsPark.lng, estimatedTime: '09:35' }
    ]
  },
  // 周日 (Day 0)
  {
    id: 'sch_sun_piano',
    dayOfWeek: 0,
    title: '周日 乐理与英语俱乐部',
    timeSlot: '14:00 - 16:30',
    type: 'weekend_class',
    childIds: ['child_1', 'child_2'],
    pickupPoint: {
      name: '阳光花园',
      address: '阳光花园东门',
      lat: BASE_COORDS.stop1.lat,
      lng: BASE_COORDS.stop1.lng,
      estimatedTime: '14:00'
    },
    dropoffPoint: {
      name: '文化少年宫',
      address: '艺术广场B座',
      lat: BASE_COORDS.musicCenter.lat,
      lng: BASE_COORDS.musicCenter.lng,
      estimatedTime: '14:35'
    },
    status: 'scheduled',
    routeStops: [
      { name: '接轩轩', address: '阳光花园', lat: BASE_COORDS.stop1.lat, lng: BASE_COORDS.stop1.lng, estimatedTime: '14:00' },
      { name: '接可可', address: '翡翠湾', lat: BASE_COORDS.stop2.lat, lng: BASE_COORDS.stop2.lng, estimatedTime: '14:15' },
      { name: '送达少年宫', address: '文化广场B座', lat: BASE_COORDS.musicCenter.lat, lng: BASE_COORDS.musicCenter.lng, estimatedTime: '14:35' }
    ]
  }
];

export const INITIAL_CHECKINS: CheckInRecord[] = [
  {
    id: 'chk_101',
    scheduleId: 'sch_mon_morning',
    childId: 'child_1',
    type: 'boarded',
    timestamp: Date.now() - 1000 * 60 * 18,
    formattedTime: '07:32',
    locationName: '阳光花园东门接送柱A',
    lat: BASE_COORDS.stop1.lat,
    lng: BASE_COORDS.stop1.lng,
    seatbeltSecured: true,
    photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
    signedBy: '车主王叔叔',
    notes: '已系好五点式安全带，状态良好',
    temperature: '36.4°C'
  },
  {
    id: 'chk_102',
    scheduleId: 'sch_mon_morning',
    childId: 'child_2',
    type: 'boarded',
    timestamp: Date.now() - 1000 * 60 * 8,
    formattedTime: '07:44',
    locationName: '绿城翡翠湾8栋入口',
    lat: BASE_COORDS.stop2.lat,
    lng: BASE_COORDS.stop2.lng,
    seatbeltSecured: true,
    photoUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=400&q=80',
    signedBy: '车主王叔叔',
    notes: '大提琴已固定在后排卡槽，已向妈妈挥手告别',
    temperature: '36.5°C'
  }
];

export const INITIAL_TRIP_HISTORY: TripRecord[] = [
  {
    id: 'trip_hist_prev_1',
    scheduleId: 'sch_fri_afternoon',
    scheduleTitle: '上周五 放学安全回家专车',
    date: '2026-10-23',
    startTime: Date.now() - 86400000 * 5 - 3600000,
    endTime: Date.now() - 86400000 * 5,
    distanceKm: 14.8,
    durationMinutes: 42,
    avgSpeedKmH: 26.5,
    status: 'completed',
    fuelSavedKg: 1.4,
    checkIns: [
      {
        id: 'chk_h1',
        scheduleId: 'sch_fri_afternoon',
        childId: 'child_1',
        type: 'arrived',
        timestamp: Date.now() - 86400000 * 5 - 1800000,
        formattedTime: '15:52',
        locationName: '阳光花园',
        lat: BASE_COORDS.stop1.lat,
        lng: BASE_COORDS.stop1.lng,
        seatbeltSecured: true,
        photoUrl: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=400&q=80',
        signedBy: '轩轩妈妈'
      },
      {
        id: 'chk_h2',
        scheduleId: 'sch_fri_afternoon',
        childId: 'child_2',
        type: 'arrived',
        timestamp: Date.now() - 86400000 * 5 - 600000,
        formattedTime: '16:12',
        locationName: '翡翠湾',
        lat: BASE_COORDS.stop2.lat,
        lng: BASE_COORDS.stop2.lng,
        seatbeltSecured: true,
        photoUrl: 'https://images.unsplash.com/photo-1517456793572-1d8efd6dc135?auto=format&fit=crop&w=400&q=80',
        signedBy: '可可爸爸'
      }
    ]
  },
  {
    id: 'trip_hist_prev_2',
    scheduleId: 'sch_sat_sports',
    scheduleTitle: '上周六 奥体足球青训接送',
    date: '2026-10-24',
    startTime: Date.now() - 86400000 * 4 - 5400000,
    endTime: Date.now() - 86400000 * 4,
    distanceKm: 18.2,
    durationMinutes: 51,
    avgSpeedKmH: 28.2,
    status: 'completed',
    fuelSavedKg: 1.8,
    checkIns: []
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'system',
    senderName: '安全守护系统',
    senderAvatar: '',
    content: '车辆【沪A·68K99】已开启高精度GPS定位与端到端AES-256传输加密通道。',
    timestamp: Date.now() - 1000 * 60 * 25,
    type: 'checkin_alert',
    read: true
  },
  {
    id: 'msg_2',
    sender: 'driver',
    senderName: '王师傅 (车主)',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    content: '各位家长早上好，车辆已完成内部消毒并调整空调为舒适的24.5°C，现前往接轩轩。',
    timestamp: Date.now() - 1000 * 60 * 22,
    type: 'text',
    read: true
  },
  {
    id: 'msg_3',
    sender: 'system',
    senderName: '打卡通知',
    senderAvatar: '',
    content: '【林子轩】已于 07:32 在 阳光花园东门 成功上车打卡！已系好安全带，体温 36.4°C。',
    timestamp: Date.now() - 1000 * 60 * 18,
    type: 'checkin_alert',
    read: true
  },
  {
    id: 'msg_4',
    childId: 'child_1',
    sender: 'parent',
    senderName: '林海峰 (轩轩爸爸)',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    content: '收到！感谢王师傅，辛苦了！',
    timestamp: Date.now() - 1000 * 60 * 16,
    type: 'text',
    read: true
  },
  {
    id: 'msg_5',
    childId: 'child_2',
    sender: 'parent',
    senderName: '陈雅琴 (可可妈妈)',
    senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    content: '王师傅，可可已在翡翠湾8栋门口台阶等候，拿了乐谱夹。',
    timestamp: Date.now() - 1000 * 60 * 11,
    type: 'text',
    read: true
  },
  {
    id: 'msg_6',
    sender: 'system',
    senderName: '打卡通知',
    senderAvatar: '',
    content: '【陈可欣】已于 07:44 在 绿城翡翠湾 成功上车打卡！车辆正驶向实验外国语小学。',
    timestamp: Date.now() - 1000 * 60 * 8,
    type: 'checkin_alert',
    read: true
  }
];

export const INITIAL_VEHICLE_STATE: LiveVehicleState = {
  lat: 31.2335,
  lng: 121.4582,
  speedKmH: 34,
  heading: 48,
  isMoving: true,
  batteryPct: 86,
  gear: 'D',
  doorsLocked: true,
  childLockActive: true,
  acTemp: 24.5,
  dashcamOnline: true,
  e2eeActive: true
};
