import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Target, Zap } from 'lucide-react';
import type { BenchmarkGroup } from '../types';

interface BenchmarkTasksPageProps {
  benchmarkGroups: BenchmarkGroup[];
  loading: boolean;
}

const BenchmarkTasksPage: React.FC<BenchmarkTasksPageProps> = ({ benchmarkGroups, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6">
            <Target className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
          AI 模型评测任务
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          汇集主流 AI 评测基准，覆盖文本生成、智能体、多模态、RAG 等核心领域，
          帮助开发者快速了解各领域评估标准。
        </p>
      </div>

      <div className="grid gap-12">
        {benchmarkGroups.map((group, groupIndex) => (
          <section key={groupIndex} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Zap className="w-5 h-5 text-indigo-500" />
                    {group.name}
                    </h2>
                    <p className="mt-2 text-slate-600 max-w-2xl">{group.description}</p>
                </div>
                
                {group.tags && (
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {group.tags.map(tag => (
                      <Link
                        key={tag}
                        to={`/?pipeline=${encodeURIComponent(tag)}&category=all`}
                        className="inline-flex items-center px-2.5 py-1 bg-white text-slate-600 text-xs font-medium rounded-full border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.benchmarks.map((benchmark, idx) => (
                    <a
                    key={idx}
                    href={benchmark.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                    >
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors pr-6">
                        {benchmark.name}
                        </h3>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 absolute top-5 right-5" />
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-grow">
                        {benchmark.description}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>View Benchmark</span>
                        <ExternalLink className="w-3 h-3" />
                    </div>
                    </a>
                ))}
                </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BenchmarkTasksPage;
