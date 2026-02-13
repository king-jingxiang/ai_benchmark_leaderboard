import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Heart, 
  Database, 
  Calendar, 
  User, 
  FileText, 
  BarChart2, 
  Tag,
  Layers,
  Box
} from 'lucide-react';
import type { Model, CategoryGroup, Benchmark } from '../types';

interface ModelDetailPageProps {
  models: Model[];
  categories: CategoryGroup[];
  benchmarks: Record<string, Benchmark>;
  loading: boolean;
}

const R2_BASE_URL = 'https://pub-f31a5865021b44d0a2c4003b3da37f04.r2.dev';

const getColorForPipeline = (pipeline: string) => {
  let hash = 0;
  for (let i = 0; i < pipeline.length; i++) {
    hash = pipeline.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 95%)`;
};

const getTextColorForPipeline = (pipeline: string) => {
  let hash = 0;
  for (let i = 0; i < pipeline.length; i++) {
    hash = pipeline.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 30%)`;
};

const ModelDetailPage = ({ models, categories, benchmarks, loading }: ModelDetailPageProps) => {
  const params = useParams();
  const modelId = params.modelId ? decodeURIComponent(params.modelId) : '';
  const [detailModel, setDetailModel] = useState<Model | null>(null);
  const [fetching, setFetching] = useState(false);

  const initialModel = useMemo(() => models.find(item => item.id === modelId), [models, modelId]);

  useEffect(() => {
    if (!modelId) return;

    setFetching(true);
    // URL structure: .../ai_benchmark_leaderboard/latest/models/{id}.json
    const url = `${R2_BASE_URL}/ai_benchmark_leaderboard/latest/models/${modelId}.json`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        setDetailModel(data);
        setFetching(false);
      })
      .catch(err => {
        console.warn('Failed to fetch model details, falling back to summary', err);
        setFetching(false);
      });
  }, [modelId]);

  const model = detailModel || initialModel;

  const categoryGroup = useMemo(() => {
    if (!model) return null;
    if (model.category) {
      return categories.find(c => c.category === model.category);
    }
    return categories.find(c => 
      c.pipelines.some(p => p.models.some(m => m.id === model.id))
    );
  }, [model, categories]);

  const getModelLink = (item: Model) => item.url || item.original_repo || '';

  const shouldShowParameters = (value?: string) => {
    if (!value) return false;
    return value.toLowerCase() !== 'unpublished';
  };

  if ((loading || fetching) && !model) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            返回时间线
        </Link>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-600">
          <div className="text-lg font-medium">未找到对应模型</div>
          <div className="text-sm mt-2">Could not find model: {modelId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Back Link */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回时间线
      </Link>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header Section */}
        <div className="p-6 md:p-8 border-b border-slate-100">
            {/* Top Row: Tags & Action */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Open/Closed Source Badge */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${
                        model.type === 'open' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                        <Box className="w-3.5 h-3.5" />
                        {model.type === 'open' ? 'Open Source' : 'Closed Source'}
                    </span>

                    {/* Category Badge */}
                    {categoryGroup && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200">
                            {categoryGroup.category}
                        </span>
                    )}

                    {/* Pipeline Badge */}
                    {model.pipeline_tag && (
                        <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
                            style={{ 
                                backgroundColor: getColorForPipeline(model.pipeline_tag),
                                borderColor: getColorForPipeline(model.pipeline_tag),
                                color: getTextColorForPipeline(model.pipeline_tag)
                            }}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            {model.pipeline_tag}
                        </span>
                    )}
                </div>

                {/* Primary Action Button */}
                {getModelLink(model) && (
                    <a
                        href={getModelLink(model)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shrink-0"
                    >
                        <span>View on Huggingface</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                )}
            </div>

            {/* Title & Info */}
            <div className="mt-5">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 break-all">{model.id}</h1>
                <div className="mt-2 text-lg text-slate-600 font-medium">{model.name}</div>
                
                <div className="mt-3 flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-700">{model.publisher}</span>
                    </div>
                </div>

                {/* Description */}
                <div className="mt-6 text-slate-600 text-base leading-relaxed">
                    {model.description || '暂无描述'}
                </div>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 bg-slate-50/50 border-b border-slate-100">
             <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Download className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Downloads</span>
                </div>
                <div className="text-xl font-semibold text-slate-900">
                    {model.downloads !== undefined ? model.downloads.toLocaleString() : '-'}
                </div>
             </div>
             
             <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Likes</span>
                </div>
                <div className="text-xl font-semibold text-slate-900">
                    {model.likes !== undefined ? model.likes.toLocaleString() : '-'}
                </div>
             </div>

             <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Parameters</span>
                </div>
                <div className="text-xl font-semibold text-slate-900">
                    {shouldShowParameters(model.parameters) ? model.parameters : '-'}
                </div>
             </div>

             <div className="p-4 md:p-6 flex flex-col items-center justify-center text-center">
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Released</span>
                </div>
                <div className="text-xl font-semibold text-slate-900">
                    {model.release_date ? new Date(model.release_date).toLocaleDateString() : '-'}
                </div>
             </div>
        </div>

        {/* Details Sections */}
        <div className="p-6 md:p-8 space-y-8">
            
            {/* Associated Benchmarks */}
            {categoryGroup && categoryGroup.benchmarks && categoryGroup.benchmarks.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                        <BarChart2 className="w-5 h-5 text-indigo-500" />
                        关联评测任务 (Benchmarks)
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryGroup.benchmarks.map(benchmarkName => {
                            const benchmark = benchmarks[benchmarkName];
                            if (!benchmark) return null;
                            return (
                                <a
                                    key={benchmarkName}
                                    href={benchmark.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="group block p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all"
                                >
                                    <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {benchmark.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {benchmark.description}
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Papers */}
            {model.papers && model.papers.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        相关论文 (Papers)
                    </h3>
                    <div className="flex flex-col gap-2">
                        {model.papers.map((url, idx) => (
                            <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="text-sm text-indigo-600 font-medium break-all hover:underline">{url}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Detailed Metrics */}
            {model.metrics && Object.keys(model.metrics).length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                        <BarChart2 className="w-5 h-5 text-indigo-500" />
                        详细指标 (Metrics)
                    </h3>
                    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {Object.entries(model.metrics).map(([key, value]) => (
                            <div key={key} className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{key}</div>
                                <div className="text-sm font-mono font-semibold text-slate-900">{String(value)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 mb-4">
                        <Tag className="w-5 h-5 text-indigo-500" />
                        标签 (Tags)
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {model.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full border border-slate-200 bg-white text-xs text-slate-600 hover:border-slate-300 transition-colors">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ModelDetailPage;
