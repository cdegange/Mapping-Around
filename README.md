# Mapping Around

A React + Vite starter for designing, visualizing, and saving activity routes with Mapbox. Users can choose an activity (running, cycling, walking), toggle an activity-specific heatmap overlay, draw waypoints directly on the map, and save/load routes locally.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with your Mapbox public token:

   ```bash
   cp .env.example .env
   # then edit .env and paste your token
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at the URL shown in the terminal (typically `http://localhost:5173`).

## Feature overview

- **Activity selector:** swap between running, cycling, and walking modes, updating the base color palette and heatmap.
- **Heatmap overlay:** optional Mapbox heatmap layer seeded with example data per activity.
- **Route builder:** toggle drawing, add points with map clicks, undo or clear, and see the live distance calculation.
- **Route library:** save routes locally (browser storage), reload them later, or delete them.

## Notes

- The map will stay disabled until a valid `VITE_MAPBOX_TOKEN` environment variable is provided.
- Distance is computed via the Haversine formula and rounded to two decimals.
