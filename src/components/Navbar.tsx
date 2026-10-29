import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Share2,
  Lock,
  History,
  Car,
  Users,
  Compass,
  MessageSquare
} from 'lucide-react';

interface NavbarProps {
  currentRole: 'driver' | 'parent';
  onToggleRole: () => void;
  onOpenSOS: () => void;
  onOpenShare: () => void;
  onOpenSecurity: () => void;
  activeTab: 'map_schedule' | 'history' | 'messages';
  onChangeTab: (tab: 'map_schedule' | 'history' | 'messages') => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onToggleRole,
  onOpenSOS,
  onOpenShare,
  onOpenSecurity,
  activeTab,
  onChangeTab,
  unreadCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md">
            <Car className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-base md:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                童途安行
              </h1>
              <span className="hidden sm:inline-block text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/30 font-medium">
                私家车儿童定时载送系统
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              高精GPS导航 · 一周排程 · 上下车打卡 · 实时共享 · E2EE隐私加密
            </p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => onChangeTab('map_schedule')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'map_schedule'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>实时导航与排程</span>
          </button>

          <button
            onClick={() => onChangeTab('messages')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
              activeTab === 'messages'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>家车沟通与留言</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={() => onChangeTab('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>行程数据记录</span>
          </button>
        </div>

        {/* Right Tools (Encryption badge, Role Switch, Share, SOS) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Encryption Badge */}
          <button
            onClick={onOpenSecurity}
            title="查看端到端传输加密报告"
            className="flex items-center gap-1 text-[11px] font-mono bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">E2EE</span>
            <span>加密保护中</span>
          </button>

          {/* Role Switcher Button */}
          <button
            onClick={onToggleRole}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              currentRole === 'driver'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
            title="点击在车主端和家长监护端之间切换视角"
          >
            {currentRole === 'driver' ? (
              <>
                <Car className="w-3.5 h-3.5 text-amber-300" />
                <span>车主端</span>
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-emerald-200" />
                <span>家长端</span>
              </>
            )}
          </button>

          {/* Share Position */}
          <button
            onClick={onOpenShare}
            title="一键共享实时位置给家人朋友"
            className="p-2 sm:px-3 sm:py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">位置共享</span>
          </button>

          {/* SOS Emergency Call */}
          <button
            onClick={onOpenSOS}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white rounded-xl text-xs font-black flex items-center gap-1 shadow-md shadow-rose-600/30 transition-all animate-pulse"
            title="一键触发紧急呼叫 (SOS)"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub Navigation bar */}
      <div className="flex md:hidden items-center justify-around bg-slate-950/90 py-2 border-t border-slate-800 text-xs">
        <button
          onClick={() => onChangeTab('map_schedule')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            activeTab === 'map_schedule' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>导航与排程</span>
        </button>
        <button
          onClick={() => onChangeTab('messages')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg relative ${
            activeTab === 'messages' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>沟通留言</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-0.5 right-1" />
          )}
        </button>
        <button
          onClick={() => onChangeTab('history')}
          className={`flex items-center gap-1 px-3 py-1 rounded-lg ${
            activeTab === 'history' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>行程数据</span>
        </button>
      </div>
    </header>
  );
};
