import type { HeatmapData } from '../types';

export const heatmapData: HeatmapData = {
  running: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4231, 37.7797],
            [-122.4186, 37.775],
            [-122.4128, 37.7723]
          ]
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4283, 37.7694],
            [-122.4234, 37.7645],
            [-122.4194, 37.7603]
          ]
        }
      }
    ]
  },
  cycling: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4362, 37.8024],
            [-122.4312, 37.7949],
            [-122.426, 37.7874]
          ]
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4057, 37.8044],
            [-122.402, 37.7973],
            [-122.3977, 37.7901]
          ]
        }
      }
    ]
  },
  walking: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.3936, 37.7767],
            [-122.3898, 37.7712],
            [-122.3875, 37.7652]
          ]
        }
      },
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [
            [-122.4316, 37.758],
            [-122.4269, 37.7547],
            [-122.4219, 37.751]
          ]
        }
      }
    ]
  }
};
