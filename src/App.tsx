import { useMemo, useState } from 'react';
import type { Position } from 'geojson';
import { ActivitySelector } from './components/ActivitySelector';
import { MapView } from './components/MapView';
import { RouteControls } from './components/RouteControls';
import { SavedRoutesList } from './components/SavedRoutesList';
import { useLocalRoutes } from './hooks/useLocalRoutes';
import { heatmapData } from './data/heatmap';
import type { ActivityType, Route } from './types';
import { totalDistanceKm } from './utils/geometry';

function App() {
  const [activity, setActivity] = useState<ActivityType>('running');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [routeName, setRouteName] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [coordinates, setCoordinates] = useState<Position[]>([]);
  const { routes, setRoutes } = useLocalRoutes();

  const distanceKm = useMemo(() => totalDistanceKm(coordinates), [coordinates]);
  const token = import.meta.env.VITE_MAPBOX_TOKEN;
  const heatmap = heatmapData[activity];

  const handleSaveRoute = () => {
    if (coordinates.length < 2) return;

    const newRoute: Route = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2),
      activity,
      name: routeName || `${activity} route ${routes.length + 1}`,
      coordinates,
      distanceKm,
      createdAt: new Date().toISOString()
    };

    setRoutes([...routes, newRoute]);
    setRouteName('');
    setCoordinates([]);
    setIsDrawing(false);
  };

  const handleLoadRoute = (route: Route) => {
    setActivity(route.activity);
    setCoordinates(route.coordinates);
    setIsDrawing(false);
    setRouteName(route.name);
  };

  const handleDeleteRoute = (id: string) => {
    setRoutes(routes.filter((route) => route.id !== id));
  };

  const canSave = coordinates.length >= 2;
  const canUndo = coordinates.length > 0;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="header">
          <div>
            <h1 style={{ margin: 0 }}>Mapping Around</h1>
            <p className="help-text">Design, analyze, and save your next outing.</p>
          </div>
        </div>

        {!token && (
          <div className="token-warning">
            <strong>Mapbox token missing.</strong> Create a <code>.env</code> file with a
            <code>VITE_MAPBOX_TOKEN</code> value to enable the map.
          </div>
        )}

        <ActivitySelector
          value={activity}
          onChange={(next) => {
            setActivity(next);
            setCoordinates([]);
            setIsDrawing(false);
          }}
          heatmapEnabled={showHeatmap}
          onToggleHeatmap={setShowHeatmap}
        />

        <RouteControls
          routeName={routeName}
          onRouteNameChange={setRouteName}
          isDrawing={isDrawing}
          canUndo={canUndo}
          canSave={canSave}
          distanceKm={distanceKm}
          onToggleDrawing={() => setIsDrawing((current) => !current)}
          onUndo={() => setCoordinates((prev) => prev.slice(0, -1))}
          onClear={() => {
            setCoordinates([]);
            setIsDrawing(false);
          }}
          onSave={handleSaveRoute}
        />

        <SavedRoutesList routes={routes} onSelect={handleLoadRoute} onDelete={handleDeleteRoute} />
      </aside>

      <main>
        <MapView
          activity={activity}
          coordinates={coordinates}
          isDrawing={isDrawing}
          showHeatmap={showHeatmap}
          heatmap={heatmap}
          onAddCoordinate={(coordinate) => setCoordinates((prev) => [...prev, coordinate])}
        />
      </main>
    </div>
  );
}

export default App;
