import React from 'react';
import type { Model } from '../types';

interface TimelineProps {
  models: Model[];
  onSelectModel?: (model: Model) => void;
}

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

const Timeline: React.FC<TimelineProps> = ({ models, onSelectModel }) => {
  if (models.length === 0) {
    return <div className="text-center text-slate-500 mt-10">No models found.</div>;
  }

  const shouldShowParameters = (value?: string) => {
    if (!value) return false;
    return value.toLowerCase() !== 'unpublished';
  };

  const formatTypeLabel = (type: Model['type']) => (type === 'open' ? '开源' : '闭源');

  return (
    <div className="relative container mx-auto px-6 py-6 flex flex-col space-y-10">
      <div className="pointer-events-none absolute inset-0 left-8 md:left-1/2 md:-translate-x-1/2 w-px bg-slate-200"></div>
      {models.map((model, index) => {
        const isLeft = index % 2 === 0;
        const parametersVisible = shouldShowParameters(model.parameters);
        const pipelineColor = model.pipeline_tag ? getColorForPipeline(model.pipeline_tag) : '#f1f5f9';
        const pipelineTextColor = model.pipeline_tag ? getTextColorForPipeline(model.pipeline_tag) : '#475569';

        return (
          <div key={model.id} className="relative z-10">
            <div className={`flex flex-col md:flex-row items-center w-full ${isLeft ? 'md:flex-row-reverse' : ''}`}>
              <div className="hidden md:block w-1/2"></div>
              <div className="absolute left-8 md:static md:left-auto flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 z-20 transform -translate-x-1/2 md:translate-x-0">
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></div>
              </div>
              <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isLeft ? 'md:pr-12' : 'md:pl-12'}`}>
                <button
                  type="button"
                  onClick={() => onSelectModel?.(model)}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{model.id}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <div className="text-xs text-slate-500 border border-slate-100 rounded px-1.5">{formatTypeLabel(model.type)}</div>
                        {model.pipeline_tag && (
                          <div 
                            className="text-xs px-1.5 rounded" 
                            style={{ backgroundColor: pipelineColor, color: pipelineTextColor }}
                          >
                            {model.pipeline_tag}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">
                      {model.release_date ? new Date(model.release_date).toLocaleDateString() : '未知日期'}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{model.publisher} · {model.name}</div>
                  <div className="mt-2 text-sm text-slate-600 line-clamp-2">
                    {model.description || '暂无描述'}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    {model.downloads !== undefined && <span>⬇ {model.downloads.toLocaleString()}</span>}
                    {model.likes !== undefined && <span>★ {model.likes.toLocaleString()}</span>}
                    {parametersVisible && <span>参数量 {model.parameters}</span>}
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
