export interface Model {
  id: string;
  name: string;
  publisher: string;
  type: 'open' | 'closed';
  release_date: string | null;
  tags?: string[];
  description?: string;
  parameters?: string;
  pipeline_tag?: string;
  url?: string;
  downloads?: number;
  likes?: number;
  original_repo?: string;
  metrics?: Record<string, number | string>;
  papers?: string[];
  // Added for frontend logic after flattening
  category?: string;
}

export interface PipelineGroup {
  pipeline_tag: string;
  models: Model[];
  count: number;
}

export interface CategoryGroup {
  category: string;
  description: string;
  benchmarks: string[];
  tags: string[];
  pipelines: PipelineGroup[];
  total_count: number;
}

export interface Benchmark {
  name: string;
  description: string;
  link: string;
}

export interface BenchmarkGroup {
  name: string;
  description: string;
  tags?: string[];
  benchmarks: Benchmark[];
}
