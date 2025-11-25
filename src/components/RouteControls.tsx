interface Props {
  routeName: string;
  onRouteNameChange: (name: string) => void;
  isDrawing: boolean;
  canUndo: boolean;
  canSave: boolean;
  distanceKm: number;
  onToggleDrawing: () => void;
  onUndo: () => void;
  onClear: () => void;
  onSave: () => void;
}

export function RouteControls({
  routeName,
  onRouteNameChange,
  isDrawing,
  canUndo,
  canSave,
  distanceKm,
  onToggleDrawing,
  onUndo,
  onClear,
  onSave
}: Props) {
  return (
    <div className="panel">
      <div className="header">
        <div>
          <div className="label">Route builder</div>
          <p className="help-text">Click on the map to add waypoints and trace your path.</p>
        </div>
        <span className="status-dot" aria-hidden />
      </div>

      <div className="controls-grid">
        <button className="button" type="button" onClick={onToggleDrawing}>
          {isDrawing ? 'Pause drawing' : 'Start drawing'}
        </button>
        <button className="button secondary" type="button" onClick={onUndo} disabled={!canUndo}>
          Undo point
        </button>
        <button className="button secondary" type="button" onClick={onClear}>
          Clear path
        </button>
      </div>

      <div>
        <div className="label">Name this route</div>
        <input
          className="input"
          placeholder="Morning ride on the bay..."
          value={routeName}
          onChange={(event) => onRouteNameChange(event.target.value)}
        />
      </div>

      <div className="card">
        <div>
          <h4 style={{ margin: 0 }}>Distance</h4>
          <p className="muted">Automatically calculated from your waypoints</p>
        </div>
        <strong>{distanceKm.toFixed(2)} km</strong>
      </div>

      <button className="button" type="button" onClick={onSave} disabled={!canSave}>
        Save route
      </button>
    </div>
  );
}
