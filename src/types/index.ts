import type { FeatureCollection, LineString, Position } from 'geojson';

export type ActivityType = 'running' | 'cycling' | 'walking';

export interface Route {
  id: string;
  name: string;
  activity: ActivityType;
  coordinates: Position[];
  distanceKm: number;
  createdAt: string;
}

export type HeatmapData = Record<ActivityType, FeatureCollection<LineString>>;
