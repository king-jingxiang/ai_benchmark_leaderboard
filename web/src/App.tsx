import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import { Brain, Github } from 'lucide-react';
import type { Model, CategoryGroup, Benchmark, BenchmarkGroup } from './types';
import ModelDetailPage from './pages/ModelDetailPage';
import PlaceholderPage from './pages/PlaceholderPage';
import TimelinePage from './pages/TimelinePage';
import BenchmarkTasksPage from './pages/BenchmarkTasksPage';

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [categories, setCategories] = useState<CategoryGroup[]>([]);
  // Store the raw benchmark groups
  const [benchmarkGroups, setBenchmarkGroups] = useState<BenchmarkGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // R2 public access URL
  const R2_BASE_URL = 'https://pub-f31a5865021b44d0a2c4003b3da37f04.r2.dev';

  useEffect(() => {
    Promise.all([
      fetch(`${R2_BASE_URL}/ai_benchmark_leaderboard/latest/leaderboard/models.json`).then(res => res.json()),
      // Catch error and return empty array for benchmarks
      fetch(`${R2_BASE_URL}/ai_benchmark_leaderboard/latest/benchmarks/benchmarks.json`).then(res => res.json()).catch(() => ([]))
    ])
      .then(([modelsData, benchmarksData]) => {
        const groups = modelsData as CategoryGroup[];
        setCategories(groups);
        
        // Handle benchmarks data which is now an array of groups
        const bGroups = benchmarksData as BenchmarkGroup[];
        setBenchmarkGroups(bGroups);

        const allModels: Model[] = [];
        groups.forEach(group => {
          group.pipelines.forEach(pipeline => {
            pipeline.models.forEach(model => {
              allModels.push({ ...model, category: group.category });
            });
          });
        });

        const sorted = allModels.sort((a: Model, b: Model) => {
          const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
          const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
          return dateB - dateA;
        });
        setModels(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load models', err);
        setLoading(false);
      });
  }, []);

  // Transform benchmark groups into a map for ModelDetailPage
  const benchmarkMap = useMemo(() => {
    const map: Record<string, Benchmark> = {};
    if (Array.isArray(benchmarkGroups)) {
      benchmarkGroups.forEach(group => {
        if (group.benchmarks) {
          group.benchmarks.forEach(bm => {
            map[bm.name] = bm;
          });
        }
      });
    }
    return map;
  }, [benchmarkGroups]);

  const navItems = [
    { to: '/', label: '时间线' },
    { to: '/tasks', label: '评测任务' },
    { to: '/best-model', label: '最佳模型选型' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3 md:h-16 md:py-0 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-0">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Benchmark Leaderboard
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 overflow-x-auto max-w-[calc(100vw-6rem)] md:max-w-none">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }: { isActive: boolean }) =>
                    `px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      isActive 
                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <a
              href="https://github.com/king-jingxiang/ai_benchmark_leaderboard"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-100 rounded-full"
              title="View on GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32 md:pt-24 pb-12">
        <Routes>
          <Route path="/" element={<TimelinePage models={models} categories={categories} loading={loading} />} />
          <Route path="/models/:modelId" element={<ModelDetailPage models={models} categories={categories} benchmarks={benchmarkMap} loading={loading} />} />
          <Route path="/tasks" element={<BenchmarkTasksPage benchmarkGroups={benchmarkGroups} loading={loading} />} />
          <Route path="/best-model" element={<PlaceholderPage title="最佳模型选型" description="敬请期待" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
