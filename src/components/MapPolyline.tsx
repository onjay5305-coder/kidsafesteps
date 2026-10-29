import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

declare global {
  namespace google {
    namespace maps {
      type Polyline = any;
      const Polyline: any;
    }
  }
}
declare const google: any;

interface MapPolylineProps {
  path: { lat: number; lng: number }[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
  geodesic?: boolean;
}

export function MapPolyline({
  path,
  strokeColor = '#2563eb',
  strokeOpacity = 0.85,
  strokeWeight = 5,
  geodesic = true,
}: MapPolylineProps) {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic,
        strokeColor,
        strokeOpacity,
        strokeWeight,
        map,
      });
    } else {
      polylineRef.current.setPath(path);
      polylineRef.current.setOptions({
        strokeColor,
        strokeOpacity,
        strokeWeight,
        geodesic,
      });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, path, strokeColor, strokeOpacity, strokeWeight, geodesic]);

  return null;
}
