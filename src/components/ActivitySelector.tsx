import type { ActivityType } from '../types';

interface Props {
  value: ActivityType;
  onChange: (activity: ActivityType) => void;
  heatmapEnabled: boolean;
  onToggleHeatmap: (enabled: boolean) => void;
}

const activityLabels: Record<ActivityType, string> = {
  running: 'Running',
  cycling: 'Cycling',
  walking: 'Walking'
};

export function ActivitySelector({ value, onChange, heatmapEnabled, onToggleHeatmap }: Props) {
  return (
    <div className="panel">
      <div className="header">
        <div>
          <div className="label">Activity type</div>
          <p className="help-text">Choose the sport you are routing for.</p>
        </div>
        <span className="badge">Mode</span>
      </div>

      <select
        className="select"
        value={value}
        onChange={(event) => onChange(event.target.value as ActivityType)}
      >
        {Object.entries(activityLabels).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>

      <label className="help-text" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={heatmapEnabled}
          onChange={(event) => onToggleHeatmap(event.target.checked)}
        />
        Show activity heatmap overlay
      </label>
    </div>
  );
}
