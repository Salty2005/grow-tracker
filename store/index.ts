import { create } from 'zustand';
import {
  Plant,
  CareLog,
  EnvironmentReading,
  GrowthSnapshot,
  HarvestData,
  GrowthStage,
  CareType,
  LightSchedule,
} from '../types';
import {
  loadPlants,
  savePlants,
  loadCareLogs,
  saveCareLogs,
  loadEnvironmentReadings,
  saveEnvironmentReadings,
  loadGrowthSnapshots,
  saveGrowthSnapshots,
  loadHarvestData,
  saveHarvestData,
  generateId,
} from '../lib/storage';

interface AppState {
  plants: Plant[];
  careLogs: CareLog[];
  environmentReadings: EnvironmentReading[];
  growthSnapshots: GrowthSnapshot[];
  harvestData: HarvestData[];
  isLoaded: boolean;

  initialize: () => Promise<void>;

  addPlant: (plant: Omit<Plant, 'id' | 'createdAt' | 'updatedAt' | 'photos'>) => Promise<void>;
  updatePlant: (id: string, updates: Partial<Plant>) => Promise<void>;
  deletePlant: (id: string) => Promise<void>;
  updatePlantStage: (id: string, stage: GrowthStage) => Promise<void>;
  updatePlantStartDate: (id: string, startDate: string) => Promise<void>;

  addCareLog: (log: Omit<CareLog, 'id' | 'createdAt'>) => Promise<void>;
  deleteCareLog: (id: string) => Promise<void>;

  addEnvironmentReading: (reading: Omit<EnvironmentReading, 'id' | 'createdAt'>) => Promise<void>;
  deleteEnvironmentReading: (id: string) => Promise<void>;

  addGrowthSnapshot: (snapshot: Omit<GrowthSnapshot, 'id' | 'createdAt'>) => Promise<void>;
  deleteGrowthSnapshot: (id: string) => Promise<void>;
  removePhotoFromSnapshot: (snapshotId: string, photoId: string) => Promise<void>;

  addHarvestData: (data: Omit<HarvestData, 'id' | 'createdAt'>) => Promise<void>;
  updateHarvestData: (id: string, updates: Partial<HarvestData>) => Promise<void>;

  getPlantCareLogs: (plantId: string) => CareLog[];
  getPlantEnvironmentReadings: (plantId: string) => EnvironmentReading[];
  getPlantGrowthSnapshots: (plantId: string) => GrowthSnapshot[];
  getPlantHarvestData: (plantId: string) => HarvestData | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  plants: [],
  careLogs: [],
  environmentReadings: [],
  growthSnapshots: [],
  harvestData: [],
  isLoaded: false,

  initialize: async () => {
    const [plants, careLogs, environmentReadings, growthSnapshots, harvestData] =
      await Promise.all([
        loadPlants(),
        loadCareLogs(),
        loadEnvironmentReadings(),
        loadGrowthSnapshots(),
        loadHarvestData(),
      ]);
    set({
      plants,
      careLogs,
      environmentReadings,
      growthSnapshots,
      harvestData,
      isLoaded: true,
    });
  },

  addPlant: async (plantData) => {
    const now = new Date().toISOString();
    const plant: Plant = {
      ...plantData,
      id: generateId(),
      photos: [],
      createdAt: now,
      updatedAt: now,
    };
    const plants = [...get().plants, plant];
    set({ plants });
    await savePlants(plants);
  },

  updatePlant: async (id, updates) => {
    const plants = get().plants.map((p) =>
      p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    );
    set({ plants });
    await savePlants(plants);
  },

  deletePlant: async (id) => {
    const plants = get().plants.filter((p) => p.id !== id);
    const careLogs = get().careLogs.filter((l) => l.plantId !== id);
    const environmentReadings = get().environmentReadings.filter((r) => r.plantId !== id);
    const growthSnapshots = get().growthSnapshots.filter((s) => s.plantId !== id);
    const harvestData = get().harvestData.filter((h) => h.plantId !== id);
    set({ plants, careLogs, environmentReadings, growthSnapshots, harvestData });
    await savePlants(plants);
    await saveCareLogs(careLogs);
    await saveEnvironmentReadings(environmentReadings);
    await saveGrowthSnapshots(growthSnapshots);
    await saveHarvestData(harvestData);
  },

  updatePlantStage: async (id, stage) => {
    const plants = get().plants.map((p) =>
      p.id === id ? { ...p, stage, updatedAt: new Date().toISOString() } : p
    );
    set({ plants });
    await savePlants(plants);
  },

  updatePlantStartDate: async (id, startDate) => {
    const plants = get().plants.map((p) =>
      p.id === id ? { ...p, startDate, updatedAt: new Date().toISOString() } : p
    );
    set({ plants });
    await savePlants(plants);
  },

  addCareLog: async (logData) => {
    const log: CareLog = {
      ...logData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const careLogs = [...get().careLogs, log];
    set({ careLogs });
    await saveCareLogs(careLogs);
  },

  deleteCareLog: async (id) => {
    const careLogs = get().careLogs.filter((l) => l.id !== id);
    set({ careLogs });
    await saveCareLogs(careLogs);
  },

  addEnvironmentReading: async (readingData) => {
    const reading: EnvironmentReading = {
      ...readingData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const environmentReadings = [...get().environmentReadings, reading];
    set({ environmentReadings });
    await saveEnvironmentReadings(environmentReadings);
  },

  deleteEnvironmentReading: async (id) => {
    const environmentReadings = get().environmentReadings.filter((r) => r.id !== id);
    set({ environmentReadings });
    await saveEnvironmentReadings(environmentReadings);
  },

  addGrowthSnapshot: async (snapshotData) => {
    const snapshot: GrowthSnapshot = {
      ...snapshotData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const growthSnapshots = [...get().growthSnapshots, snapshot];
    set({ growthSnapshots });
    await saveGrowthSnapshots(growthSnapshots);
  },

  deleteGrowthSnapshot: async (id) => {
    const growthSnapshots = get().growthSnapshots.filter((s) => s.id !== id);
    set({ growthSnapshots });
    await saveGrowthSnapshots(growthSnapshots);
  },

  removePhotoFromSnapshot: async (snapshotId, photoId) => {
    const growthSnapshots = get().growthSnapshots.map((s) => {
      if (s.id !== snapshotId) return s;
      return {
        ...s,
        photos: s.photos.filter((p) => p.id !== photoId),
      };
    });
    set({ growthSnapshots });
    await saveGrowthSnapshots(growthSnapshots);
  },

  addHarvestData: async (data) => {
    const harvest: HarvestData = {
      ...data,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    const harvestData = [...get().harvestData, harvest];
    set({ harvestData });
    await saveHarvestData(harvestData);
  },

  updateHarvestData: async (id, updates) => {
    const harvestData = get().harvestData.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    );
    set({ harvestData });
    await saveHarvestData(harvestData);
  },

  getPlantCareLogs: (plantId) => {
    return get()
      .careLogs.filter((l) => l.plantId === plantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPlantEnvironmentReadings: (plantId) => {
    return get()
      .environmentReadings.filter((r) => r.plantId === plantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPlantGrowthSnapshots: (plantId) => {
    return get()
      .growthSnapshots.filter((s) => s.plantId === plantId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPlantHarvestData: (plantId) => {
    return get().harvestData.find((h) => h.plantId === plantId);
  },
}));
