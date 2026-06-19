export type GrowthStage =
  | 'seed'
  | 'germination'
  | 'seedling'
  | 'vegetative'
  | 'pre-flower'
  | 'flowering'
  | 'late-flowering'
  | 'harvest'
  | 'drying'
  | 'curing'
  | 'complete';

export type CareType =
  | 'water'
  | 'nutrients'
  | 'ph_adjust'
  | 'prune'
  | 'top'
  | 'lst'
  | 'scrog'
  | 'defoliate'
  | 'flush'
  | 'repot'
  | 'ipm'
  | 'other';

export type NutrientType =
  | 'grow'
  | 'bloom'
  | 'micro'
  | 'calmag'
  | 'boost'
  | 'enzyme'
  | 'silica'
  | 'molasses'
  | 'custom';

export type LightSchedule = '18/6' | '12/12' | '20/4' | '24/0' | 'auto';

export interface Plant {
  id: string;
  name: string;
  strain: string;
  gender: 'male' | 'female' | 'unknown';
  stage: GrowthStage;
  startDate: string;
  expectedHarvestDate: string | null;
  lightSchedule: LightSchedule;
  medium: string;
  potSize: string;
  geneticType: 'photoperiod' | 'autoflower';
  notes: string;
  photos: PlantPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface PlantPhoto {
  id: string;
  plantId: string;
  uri: string;
  stage: GrowthStage;
  caption: string;
  takenAt: string;
}

export interface CareLog {
  id: string;
  plantId: string;
  type: CareType;
  details: string;
  nutrientName: string | null;
  nutrientAmount: string | null;
  waterAmount: string | null;
  phLevel: number | null;
  createdAt: string;
}

export interface EnvironmentReading {
  id: string;
  plantId: string;
  temperature: number;
  humidity: number;
  vpd: number | null;
  co2: number | null;
  lightIntensity: number | null;
  soilMoisture: number | null;
  soilPh: number | null;
  runoffPpm: number | null;
  waterPpm: number | null;
  waterPh: number | null;
  notes: string;
  createdAt: string;
}

export interface GrowthSnapshot {
  id: string;
  plantId: string;
  height: number | null;
  width: number | null;
  nodeCount: number | null;
  leafCount: number | null;
  budCount: number | null;
  budDensity: 'airy' | 'medium' | 'dense' | null;
  trichomeStatus: 'clear' | 'cloudy' | 'amber' | 'mixed' | null;
  pistilStatus: 'white' | 'turning' | 'dark' | null;
  notes: string;
  createdAt: string;
}

export interface HarvestData {
  id: string;
  plantId: string;
  wetWeight: number | null;
  dryWeight: number | null;
  trimWeight: number | null;
  cureWeight: number | null;
  dryingDays: number | null;
  curingDays: number | null;
  dryingTemp: number | null;
  dryingHumidity: number | null;
  cureJarCount: number | null;
  qualityRating: number | null;
  notes: string;
  createdAt: string;
}

export interface NutrientSchedule {
  stage: GrowthStage;
  week: number;
  nutrients: { type: NutrientType; amount: string; frequency: string }[];
  phRange: string;
  ecRange: string;
  ppmRange: string;
  notes: string;
}

export interface EnvironmentTarget {
  stage: GrowthStage;
  tempDay: string;
  tempNight: string;
  humidity: string;
  vpd: string;
  lightHours: number;
  lightIntensity: string;
  notes: string;
}

export interface StageGuide {
  stage: GrowthStage;
  name: string;
  duration: string;
  description: string;
  keyTasks: string[];
  commonProblems: string[];
  tips: string[];
}
