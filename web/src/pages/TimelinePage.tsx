import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  Heart, 
  Database, 
  Box, 
  Layers, 
  User, 
  X,
  ChevronDown
} from 'lucide-react';
import type { Model, CategoryGroup } from '../types';

interface TimelinePageProps {
  models: Model[];
  categories: CategoryGroup[];
  loading: boolean;
}

const getColorForPublisher = (publisher: string) => {
  let hash = 0;
  for (let i = 0; i < publisher.length; i++) {
    hash = publisher.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 60%, 96%)`;
};

const getTextColorForPublisher = (publisher: string) => {
  let hash = 0;
  for (let i = 0; i < publisher.length; i++) {
    hash = publisher.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 60%, 30%)`;
};

const parseParameters = (paramStr?: string): number | null => {
  if (!paramStr) return null;
  const s = paramStr.toUpperCase().replace(/\s/g, '');
  
  // Handle multiplication (e.g., 8x7B)
  if (s.includes('X')) {
    const parts = s.split('X');
    if (parts.length === 2) {
      const multiplier = parseFloat(parts[0]);
      const baseStr = parts[1];
      const baseVal = parseParameters(baseStr);
      
      if (!isNaN(multiplier) && baseVal !== null) {
        return multiplier * baseVal;
      }
      return null;
    }
  }

  let val = parseFloat(s.replace(/[^0-9.]/g, ''));
  if (isNaN(val)) return null;

  if (s.includes('T')) {
    val *= 1000;
  } else if (s.includes('M')) {
    val /= 1000;
  } else if (s.includes('K')) {
    val /= 1000000;
  } else if (s.includes('B')) {
    // val = val
  } else {
    // No explicit unit
    // Heuristic: If > 2000, assume raw count -> convert to B
    // e.g. 424960 -> 424960 / 1e9 = 0.00042 B
    if (val > 2000) {
      val /= 1000000000;
    }
  }
  
  return val;
};

const TimelinePage = ({ models, categories, loading }: TimelinePageProps) => {
  const defaultCategory = '文本生成与通用大模型 (LLM & Generative AI)';
  const today = new Date();
  const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), 1);
  const defaultStartMonth = `${lastYear.getFullYear()}-${String(lastYear.getMonth() + 1).padStart(2, '0')}`;

  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filterType, setFilterType] = useState<'all' | 'open' | 'closed'>('all');
  const [selectedPublisher, setSelectedPublisher] = useState<string>('all');
  const [selectedPipelineTag, setSelectedPipelineTag] = useState<string>(searchParams.get('pipeline') || 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || defaultCategory);
  const [idQuery, setIdQuery] = useState<string>('');
  const [startMonth, setStartMonth] = useState<string>(defaultStartMonth);
  const [endMonth, setEndMonth] = useState<string>('all');
  const [minParameters, setMinParameters] = useState<number>(0); // 0 to 1000 (1T)
  const navigate = useNavigate();

  const publishers = useMemo(() => Array.from(new Set(models.map(m => m.publisher))).sort(), [models]);
  const pipelineTags = useMemo(
    () => Array.from(new Set(models.map(m => m.pipeline_tag).filter(Boolean) as string[])).sort(),
    [models]
  );
  
  const categoryNames = useMemo(() => categories.map(c => c.category), [categories]);

  const modelsWithMeta = useMemo(() => {
    return models.map(model => {
      const date = model.release_date ? new Date(model.release_date) : null;
      const time = date && !Number.isNaN(date.getTime()) ? date.getTime() : null;
      const monthKey = date && time ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}` : null;
      return { ...model, monthKey, time };
    });
  }, [models]);

  const normalizedIdQuery = idQuery.trim().toLowerCase();

  const baseFilteredModels = useMemo(() => {
    return modelsWithMeta.filter(m => {
      if (filterType !== 'all' && m.type !== filterType) return false;
      if (selectedPublisher !== 'all' && m.publisher !== selectedPublisher) return false;
      if (selectedPipelineTag !== 'all' && m.pipeline_tag !== selectedPipelineTag) return false;
      if (selectedCategory !== 'all' && m.category !== selectedCategory) return false;
      if (normalizedIdQuery && !m.id.toLowerCase().includes(normalizedIdQuery)) return false;

      // Parameter filtering
      const paramVal = parseParameters(m.parameters);

      // Rule: For "All" type, filter out open source models with unknown parameters
      if (filterType === 'all' && m.type === 'open' && paramVal === null) {
          return false;
      }

      // Rule: Slider filter (minParameters is in Billions)
      if (minParameters > 0) {
          if (paramVal === null) {
              // Don't filter out closed source models even if parameters are unknown
              if (m.type !== 'closed') return false;
          } else {
              if (paramVal < minParameters) return false;
          }
      }

      return true;
    });
  }, [modelsWithMeta, filterType, selectedPublisher, selectedPipelineTag, selectedCategory, normalizedIdQuery, minParameters]);

  const monthRange = useMemo(() => {
    return Array.from(new Set(baseFilteredModels.map(m => m.monthKey).filter(Boolean) as string[])).sort();
  }, [baseFilteredModels]);

  const monthIndex = (key: string) => {
    const [year, month] = key.split('-').map(Number);
    return year * 12 + (month - 1);
  };

  const safeStartMonth = useMemo(
    () => (startMonth === 'all' || !monthRange.includes(startMonth) ? 'all' : startMonth),
    [startMonth, monthRange]
  );
  const safeEndMonth = useMemo(
    () => (endMonth === 'all' || !monthRange.includes(endMonth) ? 'all' : endMonth),
    [endMonth, monthRange]
  );

  const startIndex = useMemo(
    () => (safeStartMonth === 'all' ? null : monthIndex(safeStartMonth)),
    [safeStartMonth]
  );
  const endIndex = useMemo(
    () => (safeEndMonth === 'all' ? null : monthIndex(safeEndMonth)),
    [safeEndMonth]
  );

  const displayMonths = useMemo(() => {
    if (monthRange.length === 0) return [];
    return monthRange.filter(monthKey => {
      const index = monthIndex(monthKey);
      if (startIndex !== null && index < startIndex) return false;
      if (endIndex !== null && index > endIndex) return false;
      return true;
    });
  }, [monthRange, startIndex, endIndex]);

  const filteredModels = useMemo(() => {
    return baseFilteredModels.filter(m => {
      if (m.monthKey) {
        const index = monthIndex(m.monthKey);
        if (startIndex !== null && index < startIndex) return false;
        if (endIndex !== null && index > endIndex) return false;
        return true;
      }
      return startIndex === null && endIndex === null;
    });
  }, [baseFilteredModels, startIndex, endIndex]);

  const modelsByMonth = useMemo(() => {
    const map = new Map<string, typeof filteredModels>();
    filteredModels.forEach(model => {
      if (!model.monthKey) return;
      if (!map.has(model.monthKey)) {
        map.set(model.monthKey, []);
      }
      map.get(model.monthKey)?.push(model);
    });
    map.forEach(list => {
      list.sort((a, b) => (b.time ?? 0) - (a.time ?? 0));
    });
    return map;
  }, [filteredModels]);

  const unknownDateModels = useMemo(() => filteredModels.filter(m => !m.monthKey), [filteredModels]);

  const formatMonthLabel = (monthKey: string) => {
    const [year, month] = monthKey.split('-').map(Number);
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: 'short' }).format(new Date(year, month - 1, 1));
  };

  const formatDate = (dateValue: number | null) => {
    if (!dateValue) return '未知日期';
    return new Intl.DateTimeFormat('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(dateValue));
  };

  const formatTypeLabel = (type: Model['type']) => (type === 'open' ? 'Open Source' : 'Closed Source');

  const shouldShowParameters = (value?: string) => {
    if (!value) return false;
    return value.toLowerCase() !== 'unpublished';
  };

  const renderModelCard = (model: Model, dateLabel: string) => {
    const parametersVisible = shouldShowParameters(model.parameters);
    const publisherColor = getColorForPublisher(model.publisher);
    const publisherTextColor = getTextColorForPublisher(model.publisher);
    
    // Simplified card background logic - keep it clean white with hover effect
    const getCardBorderClass = (type: Model['type']) => {
        if (type === 'open') return 'hover:border-emerald-300';
        if (type === 'closed') return 'hover:border-sky-300';
        return 'hover:border-indigo-300';
    };

    return (
      <button
        type="button"
        onClick={() => navigate(`/models/${encodeURIComponent(model.id)}`)}
        className={`group relative flex flex-col w-full h-full rounded-xl border border-slate-200 bg-white p-4 text-left transition-all duration-200 hover:shadow-md ${getCardBorderClass(model.type)}`}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
               <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                   model.type === 'open' 
                       ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                       : 'bg-slate-50 text-slate-600 border-slate-100'
               }`}>
                   <Box className="w-3 h-3" />
                   {formatTypeLabel(model.type)}
               </span>
               <span 
                   className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium"
                   style={{ backgroundColor: publisherColor, color: publisherTextColor }}
               >
                   {model.publisher}
               </span>
            </div>
            <div className="text-xs text-slate-400 shrink-0 font-mono">{dateLabel}</div>
        </div>

        <div className="mb-2">
            <h3 className="text-base font-bold text-slate-900 break-all leading-tight group-hover:text-indigo-600 transition-colors">
                {model.id}
            </h3>
        </div>

        <div className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-grow">
            {model.description || '暂无描述'}
        </div>

        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center gap-4 text-xs text-slate-400">
            {model.downloads !== undefined && (
                <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{model.downloads.toLocaleString()}</span>
                </div>
            )}
            {model.likes !== undefined && (
                <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{model.likes.toLocaleString()}</span>
                </div>
            )}
            {parametersVisible && (
                <div className="flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    <span>{model.parameters}</span>
                </div>
            )}
        </div>
      </button>
    );
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                
                {/* Search & Main Filters */}
                <div className="flex flex-col md:flex-row gap-3 flex-grow">
                    <div className="relative flex-grow md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                            value={idQuery}
                            onChange={(e) => setIdQuery(e.target.value)}
                            placeholder="搜索模型 ID..."
                        />
                        {idQuery && (
                            <button 
                                onClick={() => setIdQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                         <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <select
                                className="appearance-none bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-50"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="all">全部场景</option>
                                {categoryNames.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <select
                                className="appearance-none bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-50"
                                value={selectedPublisher}
                                onChange={(e) => setSelectedPublisher(e.target.value)}
                            >
                                <option value="all">全部发布方</option>
                                {publishers.map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                            <select
                                className="appearance-none bg-white border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-slate-50"
                                value={selectedPipelineTag}
                                onChange={(e) => setSelectedPipelineTag(e.target.value)}
                            >
                                <option value="all">全部 Pipeline</option>
                                {pipelineTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Type Toggles */}
                <div className="flex bg-slate-100/50 p-1 rounded-lg border border-slate-200/50">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'all' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        全部
                    </button>
                    <button
                        onClick={() => setFilterType('open')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'open' ? 'bg-white text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        开源
                    </button>
                    <button
                        onClick={() => setFilterType('closed')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterType === 'closed' ? 'bg-white text-sky-700 shadow-sm border border-sky-100' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        闭源
                    </button>
                </div>
            </div>

            {/* Advanced Filters (Date & Params) */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div className="flex items-center gap-2">
                        <select
                            className="bg-transparent hover:bg-slate-50 rounded px-2 py-1 focus:outline-none cursor-pointer"
                            value={safeStartMonth}
                            onChange={(e) => setStartMonth(e.target.value)}
                        >
                            <option value="all">起始月份</option>
                            {monthRange.map(month => (
                            <option key={month} value={month}>{formatMonthLabel(month)}</option>
                            ))}
                        </select>
                        <span className="text-slate-300">→</span>
                        <select
                            className="bg-transparent hover:bg-slate-50 rounded px-2 py-1 focus:outline-none cursor-pointer"
                            value={safeEndMonth}
                            onChange={(e) => setEndMonth(e.target.value)}
                        >
                            <option value="all">结束月份</option>
                            {monthRange.map(month => (
                            <option key={month} value={month}>{formatMonthLabel(month)}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-slate-400" />
                        <span>参数量 &gt;</span>
                        <span className="font-mono font-medium text-slate-900 w-12 text-right">
                            {minParameters === 0 ? 'All' : minParameters >= 1000 ? '1T' : `${minParameters}B`}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={1000}
                        step={10}
                        value={minParameters}
                        onChange={(e) => setMinParameters(Number(e.target.value))}
                        className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>
                
                <div className="sm:ml-auto text-xs text-slate-400">
                    共找到 <span className="text-slate-900 font-medium">{filteredModels.length}</span> 个模型
                </div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">没有找到匹配的模型</h3>
            <p className="text-slate-500 mt-2">请尝试调整筛选条件或搜索关键词</p>
            <button 
                onClick={() => {
                    setFilterType('all');
                    setSelectedPublisher('all');
                    setSelectedPipelineTag('all');
                    setIdQuery('');
                    setStartMonth(defaultStartMonth);
                    setEndMonth('all');
                    setMinParameters(0);
                }}
                className="mt-6 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
                重置所有筛选
            </button>
        </div>
      ) : (
        <div className="space-y-12">
            {[...displayMonths].reverse().map(month => {
                const modelsForMonth = modelsByMonth.get(month) ?? [];
                if (modelsForMonth.length === 0) return null;
                
                return (
                  <div key={month} className="relative">
                    {/* Timeline Line (Visual Only) */}
                    <div className="absolute left-4 top-10 bottom-0 w-px bg-slate-200 hidden lg:block -z-10"></div>

                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                        {/* Month Header */}
                        <div className="lg:w-32 shrink-0">
                            <div className="sticky top-24 flex items-center gap-3 lg:flex-row-reverse">
                                <span className="text-sm font-bold text-slate-900 bg-white/90 backdrop-blur px-2 py-1 rounded-md border border-slate-100 shadow-sm">
                                    {formatMonthLabel(month)}
                                </span>
                                <div className="relative flex h-3 w-3 items-center justify-center">
                                    <span className="absolute h-3 w-3 rounded-full bg-indigo-100 animate-ping opacity-75"></span>
                                    <span className="relative h-2 w-2 rounded-full bg-indigo-500"></span>
                                </div>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        <div className="flex-grow grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {modelsForMonth.map(model => (
                                <div key={model.id}>
                                    {renderModelCard(model, formatDate(model.time))}
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
                );
            })}
          
          {unknownDateModels.length > 0 && (
            <div className="pt-12 border-t border-slate-200">
               <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                   <span className="w-8 h-px bg-slate-300"></span>
                   未知日期
               </h3>
               <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {unknownDateModels.map(model => (
                  <div key={model.id}>
                    {renderModelCard(model, '未知日期')}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimelinePage;
