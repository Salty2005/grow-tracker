import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Plant,
  CareLog,
  EnvironmentReading,
  GrowthSnapshot,
  HarvestData,
  GrowthStage,
} from '../types';

const STORAGE_KEYS = {
  PLANTS: '@grow_plants',
  CARE_LOGS: '@grow_care_logs',
  ENVIRONMENT: '@grow_environment',
  SNAPSHOTS: '@grow_snapshots',
  HARVEST: '@grow_harvest',
};

export async function loadPlants(): Promise<Plant[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PLANTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function savePlants(plants: Plant[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
  } catch (error) {
    console.error('Failed to save plants:', error);
  }
}

export async function loadCareLogs(): Promise<CareLog[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CARE_LOGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveCareLogs(logs: CareLog[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CARE_LOGS, JSON.stringify(logs));
  } catch (error) {
    console.error('Failed to save care logs:', error);
  }
}

export async function loadEnvironmentReadings(): Promise<EnvironmentReading[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.ENVIRONMENT);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveEnvironmentReadings(readings: EnvironmentReading[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ENVIRONMENT, JSON.stringify(readings));
  } catch (error) {
    console.error('Failed to save environment readings:', error);
  }
}

export async function loadGrowthSnapshots(): Promise<GrowthSnapshot[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SNAPSHOTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveGrowthSnapshots(snapshots: GrowthSnapshot[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SNAPSHOTS, JSON.stringify(snapshots));
  } catch (error) {
    console.error('Failed to save growth snapshots:', error);
  }
}

export async function loadHarvestData(): Promise<HarvestData[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HARVEST);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function saveHarvestData(data: HarvestData[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HARVEST, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save harvest data:', error);
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function calculateDaysSince(startDate: string): number {
  const d = new Date(startDate);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = today.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function calculateVPD(tempC: number, humidity: number): number {
  const svp = 0.6108 * Math.exp((17.27 * tempC) / (tempC + 237.3));
  const vpd = svp * (1 - humidity / 100);
  return Math.round(vpd * 100) / 100;
}

export function getStageProgress(
  stage: GrowthStage,
  startDate: string,
  expectedHarvest: string | null
): number {
  const days = calculateDaysSince(startDate);
  const stageDurations: Record<GrowthStage, number> = {
    seed: 1,
    germination: 5,
    seedling: 14,
    vegetative: 35,
    'pre-flower': 10,
    flowering: 35,
    'late-flowering': 21,
    harvest: 1,
    drying: 10,
    curing: 28,
    complete: 0,
  };

  const totalDays = Object.values(stageDurations).reduce((a, b) => a + b, 0);
  const currentDay = days;
  return Math.min(100, Math.max(0, (currentDay / totalDays) * 100));
}

export function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
