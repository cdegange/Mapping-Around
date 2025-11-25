import type { Route } from '../types';

interface Props {
  routes: Route[];
  onSelect: (route: Route) => void;
  onDelete: (id: string) => void;
}

export function SavedRoutesList({ routes, onSelect, onDelete }: Props) {
  return (
    <div className="panel">
      <div className="header">
        <div>
          <div className="label">Saved routes</div>
          <p className="help-text">Load, review, or remove previously crafted routes.</p>
        </div>
        <span className="badge">Library</span>
      </div>

      {routes.length === 0 ? (
        <p className="help-text">No saved routes yet. Build something and hit save!</p>
      ) : (
        <div className="card-list">
          {routes.map((route) => (
            <div key={route.id} className="card">
              <div>
                <h4>{route.name}</h4>
                <p className="muted">
                  {route.activity} · {route.distanceKm.toFixed(2)} km
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="button secondary" type="button" onClick={() => onSelect(route)}>
                  Load
                </button>
                <button className="button secondary" type="button" onClick={() => onDelete(route.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
