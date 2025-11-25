import { useEffect, useState } from 'react';
import type { Route } from '../types';

const STORAGE_KEY = 'mapping-around-routes';

export function useLocalRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRoutes(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored routes', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(routes));
  }, [routes]);

  return { routes, setRoutes } as const;
}
