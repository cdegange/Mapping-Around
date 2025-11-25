import { useEffect, useMemo, useRef } from 'react';
import mapboxgl, { type Map, type MapLayerMouseEvent } from 'mapbox-gl';
import type { FeatureCollection, LineString, Position } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { ActivityType } from '../types';

interface Props {
  activity: ActivityType;
  coordinates: Position[];
  isDrawing: boolean;
  showHeatmap: boolean;
  heatmap: FeatureCollection<LineString>;
  onAddCoordinate: (coordinate: Position) => void;
}

const ROUTE_SOURCE = 'active-route';
const ROUTE_LAYER = 'active-route-line';
const POINTS_LAYER = 'active-route-points';
const HEATMAP_SOURCE = 'activity-heatmap';
const HEATMAP_LAYER = 'activity-heatmap-layer';

export function MapView({ activity, coordinates, isDrawing, showHeatmap, heatmap, onAddCoordinate }: Props) {
  const mapRef = useRef<Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDrawingRef = useRef(isDrawing);

  isDrawingRef.current = isDrawing;

  const routeGeoJSON = useMemo(
    () => ({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates
          }
        },
        ...coordinates.map((coordinate) => ({
          type: 'Feature' as const,
          properties: {},
          geometry: {
            type: 'Point' as const,
            coordinates: coordinate
          }
        }))
      ]
    }),
    [coordinates]
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) return;
    mapboxgl.accessToken = token ?? '';

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-122.4231, 37.7797],
      zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    const handleClick = (event: MapLayerMouseEvent) => {
      if (!isDrawingRef.current) return;
      onAddCoordinate([event.lngLat.lng, event.lngLat.lat]);
    };

    map.on('click', handleClick);

    map.on('load', () => {
      if (!map.getSource(ROUTE_SOURCE)) {
        map.addSource(ROUTE_SOURCE, {
          type: 'geojson',
          data: routeGeoJSON
        });
      }

      if (!map.getLayer(ROUTE_LAYER)) {
        map.addLayer({
          id: ROUTE_LAYER,
          type: 'line',
          source: ROUTE_SOURCE,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#0284c7',
            'line-width': 4,
            'line-opacity': 0.9
          }
        });
      }

      if (!map.getLayer(POINTS_LAYER)) {
        map.addLayer({
          id: POINTS_LAYER,
          type: 'circle',
          source: ROUTE_SOURCE,
          paint: {
            'circle-radius': 5,
            'circle-color': '#0ea5e9',
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
          },
          filter: ['==', '$type', 'Point']
        });
      }

      refreshHeatmap(map, heatmap, showHeatmap);
    });

    mapRef.current = map;

    return () => {
      map.off('click', handleClick);
      map.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mapRef.current) return;
    const source = mapRef.current.getSource(ROUTE_SOURCE) as mapboxgl.GeoJSONSource | undefined;
    if (source) {
      source.setData(routeGeoJSON);
    }
  }, [routeGeoJSON]);

  useEffect(() => {
    if (!mapRef.current || coordinates.length < 2) return;
    const bounds = coordinates.reduce((acc, coordinate) => acc.extend(coordinate as [number, number]), new mapboxgl.LngLatBounds());
    mapRef.current.fitBounds(bounds, { padding: 60, duration: 800 });
  }, [coordinates]);

  useEffect(() => {
    if (!mapRef.current) return;
    refreshHeatmap(mapRef.current, heatmap, showHeatmap);
  }, [activity, heatmap, showHeatmap]);

  return <div ref={containerRef} className="map-container" aria-label="Map" />;
}

function refreshHeatmap(map: Map, data: FeatureCollection<LineString>, visible: boolean) {
  const hasSource = Boolean(map.getSource(HEATMAP_SOURCE));

  if (!hasSource) {
    map.addSource(HEATMAP_SOURCE, {
      type: 'geojson',
      data
    });
  } else {
    (map.getSource(HEATMAP_SOURCE) as mapboxgl.GeoJSONSource).setData(data);
  }

  const hasLayer = Boolean(map.getLayer(HEATMAP_LAYER));
  if (!hasLayer) {
    map.addLayer({
      id: HEATMAP_LAYER,
      type: 'heatmap',
      source: HEATMAP_SOURCE,
      paint: {
        'heatmap-weight': 0.7,
        'heatmap-intensity': 1.5,
        'heatmap-radius': 24,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(59,130,246,0)',
          0.2,
          'rgba(37,99,235,0.4)',
          0.6,
          'rgba(2,132,199,0.8)',
          1,
          'rgba(8,47,73,0.95)'
        ]
      }
    });
  }

  const visibility = visible ? 'visible' : 'none';
  map.setLayoutProperty(HEATMAP_LAYER, 'visibility', visibility);
}
