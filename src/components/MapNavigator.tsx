import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, useMap } from '@vis.gl/react-google-maps';
import { MapPolyline } from './MapPolyline';
import { LiveVehicleState, LocationPoint, Child } from '../types';
import {
  Navigation,
  Compass,
  Maximize2,
  ShieldCheck,
  Play,
  Pause,
  FastForward,
  LocateFixed,
  AlertTriangle,
  Layers,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface MapNavigatorProps {
  vehicleState: LiveVehicleState;
  activeStops: LocationPoint[];
  childrenList: Child[];
  checkedInChildIds: string[];
  onSelectStop?: (stop: LocationPoint) => void;
  onSelectChild?: (childId: string) => void;
  onSimulateMove?: (step: number) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simSpeed: number;
  onChangeSimSpeed: (speed: number) => void;
}

// Subcomponent to smoothly pan map to vehicle
function MapCameraFollower({ target }: { target: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    if (map) {
      map.panTo(target);
    }
  }, [map, target.lat, target.lng]);
  return null;
}

export const MapNavigator: React.FC<MapNavigatorProps> = ({
  vehicleState,
  activeStops,
  childrenList,
  checkedInChildIds,
  onSelectStop,
  onSelectChild,
  isSimulating,
  onToggleSimulation,
  simSpeed,
  onChangeSimSpeed,
}) => {
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');
  const [isFollowVehicle, setIsFollowVehicle] = useState(true);

  // Compute polyline path from stops
  const routePath = activeStops.map((s) => ({ lat: s.lat, lng: s.lng }));

  // Child lookup map
  const childMap = new window.Map(childrenList.map((c) => [c.id, c]));

  return (
    <div className="relative w-full h-[420px] md:h-[500px] lg:h-[560px] rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 bg-slate-900">
      {/* Google Map Canvas */}
      <Map
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        mapId="DEMO_MAP_ID"
        defaultCenter={{ lat: vehicleState.lat, lng: vehicleState.lng }}
        defaultZoom={15}
        gestureHandling="greedy"
        disableDefaultUI={true}
        mapTypeId={mapType}
        className="w-full h-full"
      >
        {isFollowVehicle && (
          <MapCameraFollower target={{ lat: vehicleState.lat, lng: vehicleState.lng }} />
        )}

        {/* Route Polyline (Planned Journey) */}
        {routePath.length > 1 && (
          <MapPolyline
            path={routePath}
            strokeColor="#3b82f6"
            strokeOpacity={0.8}
            strokeWeight={6}
          />
        )}

        {/* Vehicle Marker */}
        <AdvancedMarker
          position={{ lat: vehicleState.lat, lng: vehicleState.lng }}
          title="接送专用车 (沪A·68K99)"
        >
          <div className="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
            {/* Animated Pulse Ring */}
            <span className="absolute w-12 h-12 bg-blue-500/30 rounded-full animate-ping pointer-events-none" />
            <div className="relative z-10 w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-xl border-2 border-white transform transition-transform duration-300">
              <Navigation
                className="w-6 h-6 transition-transform duration-500 text-amber-300 fill-amber-300"
                style={{ transform: `rotate(${vehicleState.heading}deg)` }}
              />
            </div>
            {/* Vehicle floating status pill */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap shadow-md border border-slate-700/80 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>载童专车 · {vehicleState.speedKmH} km/h</span>
            </div>
          </div>
        </AdvancedMarker>

        {/* Stops & Kids Markers */}
        {activeStops.map((stop, idx) => {
          const isOrigin = idx === 0;
          const isDestination = idx === activeStops.length - 1;

          return (
            <AdvancedMarker
              key={`stop-${idx}-${stop.lat}`}
              position={{ lat: stop.lat, lng: stop.lng }}
              onClick={() => onSelectStop?.(stop)}
            >
              <div className="flex flex-col items-center -translate-x-1/2 -translate-y-full cursor-pointer hover:scale-105 transition-transform group">
                <div
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold shadow-md whitespace-nowrap border mb-1 flex items-center gap-1 ${
                    isDestination
                      ? 'bg-rose-500 text-white border-rose-600'
                      : isOrigin
                      ? 'bg-slate-700 text-white border-slate-600'
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}
                >
                  {isDestination ? (
                    <span>🏫 终点: {stop.name}</span>
                  ) : isOrigin ? (
                    <span>🚗 出发点</span>
                  ) : (
                    <span>📍 途经第{idx}站: {stop.name}</span>
                  )}
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg border-2 border-white ${
                    isDestination
                      ? 'bg-rose-600'
                      : isOrigin
                      ? 'bg-slate-800'
                      : 'bg-emerald-500'
                  }`}
                >
                  {isDestination ? '学' : isOrigin ? '始' : idx}
                </div>
                <div className="w-1 h-2 bg-slate-800" />
              </div>
            </AdvancedMarker>
          );
        })}
      </Map>

      {/* Top HUD: Turn-by-Turn Navigation Bar */}
      <div className="absolute top-3 left-3 right-3 md:left-4 md:right-auto md:w-96 z-10">
        <div className="bg-slate-900/90 backdrop-blur-md text-white rounded-xl p-3.5 shadow-2xl border border-slate-700/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Navigation className="w-6 h-6 rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
                  280米后右转
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  路况通畅
                </span>
              </div>
              <h4 className="font-semibold text-sm text-slate-100 truncate max-w-[200px]">
                进入 育才大道学校通道
              </h4>
            </div>
          </div>

          <div className="text-right pl-2 border-l border-slate-700">
            <div className="text-lg font-bold text-emerald-400 leading-none">
              8 <span className="text-xs font-normal text-slate-300">分钟</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">剩余 2.3 km</div>
          </div>
        </div>
      </div>

      {/* Bottom Floating Telemetry & Controls */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Speedometer & Car Status Pill */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 px-3.5 flex items-center gap-4 text-white shadow-xl">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
              {vehicleState.speedKmH}
            </span>
            <span className="text-[11px] text-slate-400">km/h</span>
          </div>

          <div className="h-6 w-px bg-slate-700" />

          <div className="text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>儿童安全锁已开启</span>
            </div>
            <div className="text-[11px] text-slate-400">电量 {vehicleState.batteryPct}% · 空调 {vehicleState.acTemp}°C</div>
          </div>
        </div>

        {/* Map Control Buttons (Simulation, Follow, MapType) */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-xl text-white">
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? '暂停行车模拟' : '开始行车模拟演示'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isSimulating
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? '巡航中' : '模拟行车'}</span>
          </button>

          {isSimulating && (
            <button
              onClick={() => onChangeSimSpeed(simSpeed === 1 ? 2 : simSpeed === 2 ? 4 : 1)}
              className="px-2 py-1.5 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-0.5"
              title="切换行进速度倍率"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{simSpeed}x</span>
            </button>
          )}

          <button
            onClick={() => setIsFollowVehicle(!isFollowVehicle)}
            title="锁定追踪车辆"
            className={`p-2 rounded-lg text-xs transition-colors border ${
              isFollowVehicle
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <LocateFixed className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
            title="切换卫星/标准路网"
            className="p-2 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
