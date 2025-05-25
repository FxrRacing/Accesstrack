// lib/devtoolsStore.ts

import { create } from 'zustand';
import { mockService } from './mockService';

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


type MockService = {
  submittedData: Record<string, unknown>;
  setSubmittedData: (data: Record<string, unknown>) => void;
}


export const useMockService = create<MockService>((set) => ({
  submittedData: {},
  setSubmittedData: (data) => set({ submittedData: data }),
}));

export const mockToastService = (data:Record<string, unknown>) => {
  useMockService.getState().setSubmittedData(data)
  mockService.formMock(data)
}
