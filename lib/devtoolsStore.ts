// lib/devtoolsStore.ts
import { create } from 'zustand';

type DevToolsStore = {
  showJsonDump: boolean;
  showIds: boolean;
  mockMode: boolean;
  showRouteInfo: boolean;
  userRole: 'guest' | 'user' | 'admin';
  toggle: (key: keyof Omit<DevToolsStore, 'toggle' | 'setRole'>) => void;
  setRole: (role: 'guest' | 'user' | 'admin') => void;
};

export const useDevToolsStore = create<DevToolsStore>((set) => ({
  showJsonDump: false,
  showIds: false,
  mockMode: false,
  showRouteInfo: false,
  userRole: 'guest',
  toggle: (key) => set((state) => ({ [key]: !state[key] })),
  setRole: (role) => set({ userRole: role }),
}));
