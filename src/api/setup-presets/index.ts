import type { SetupPreset } from '@/model/setup-preset';
import { requestJson } from '../request-json';

/** GET /api/data/setup-presets (active project types with their repo roles) */
export const listSetupPresets = () => requestJson<SetupPreset[]>('/api/data/setup-presets');
