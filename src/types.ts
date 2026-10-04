export type SlidePart = 'parte_0' | 'parte_1' | 'parte_2';

export interface SlideAuthor {
  name: string;
  role?: string;
}

export interface SlideData {
  id: number;
  part: SlidePart;
  partLabel: string;
  title: string;
  subtitle?: string;
  speakerScript: string;
  keyPoints?: string[];
  type?: 'cover' | 'agenda' | 'divider' | 'content' | 'interactive' | 'closing';
  image?: string;
  interactiveType?:
    | 'product_lifecycle'
    | 'circular_lifecycle'
    | 'system_architecture'
    | 'traceability_flow'
    | 'simulation_matrix'
    | 'value_chain'
    | 'canvas_2036'
    | 'implementation_phases'
    | 'roadmap_matrix'
    | 'revenue_evolution'
    | 'strategic_targets';
}

export interface RoadmapTechnology {
  name: string;
  category: string;
  scaleYear: number;
  phasesByYear: { [year: number]: number }; // Year 2026-2036 -> Phase 1 to 5
  notes?: string;
}

export interface RevenueDataPoint {
  year: number;
  embreagens: number; // percentage
  frenagemRegenerativa: number;
  servicosDigitaisCirculares: number;
}
