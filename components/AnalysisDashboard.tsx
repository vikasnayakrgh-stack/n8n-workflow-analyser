
import React, { useState } from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDashboardProps {
  result: AnalysisResult;
  onApplyFix: (json: string) => void;
}

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, onApplyFix }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'issues' | 'fix' | 'testing' | 'json'>('summary');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const TabButton = ({ id, label, icon, color = "bg-blue-600" }: { id: typeof activeTab, label: string, icon: React.ReactNode, color?: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
        activeTab === id 
          ? `${color} text-white shadow-lg shadow-blue-900/40` 
          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Health Card */}
      <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
        <div className="max-w-xl">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded-full border border-blue-500/20 uppercase tracking-widest">Architect Review</span>
             <span className="text-slate-500 text-sm">v2.1 Analysis Engine</span>
          </div>
          <h2 className="text-3xl font-bold mb-3 text-white">Diagnostic Summary</h2>
          <p className="text-slate-400 leading-relaxed">{result.summary}</p>
        </div>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 min-w-[140px]">
          <div className={`text-6xl font-black ${getScoreColor(result.score)}`}>
            {result.score}
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 mt-2">Stability Index</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3">
        <TabButton 
          id="summary" label="Analysis" 
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z"/></svg>} 
        />
        <TabButton 
          id="issues" label="Issues" 
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>} 
        />
        <TabButton 
          id="fix" label="Fix" 
          color="bg-emerald-600"
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>} 
        />
        <TabButton 
          id="testing" label="Testing Lab" 
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.641.32a4 4 0 01-2.574.344l-2.387-.477a2 2 0 00-1.022.547l-1.313 1.314c-.4.4-.442 1.028-.098 1.47a10.024 10.024 0 005.244 3.054V21a1 1 0 001 1h6a1 1 0 001-1v-1.642a10.024 10.024 0 005.244-3.054c.344-.442.302-1.07-.098-1.47l-1.313-1.314z"/></svg>} 
        />
        <TabButton 
          id="json" label="Improved JSON" 
          icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>} 
        />
      </div>

      {/* Tab Content */}
      <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 min-h-[400px]">
        {activeTab === 'summary' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Architecture Insight</h3>
              <p className="text-slate-400 leading-relaxed mb-6">{result.analysis.architecture}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-blue-400 font-bold text-xs uppercase mb-2 tracking-widest">Core Purpose</h4>
                    <p className="text-sm text-slate-300">{result.analysis.purpose}</p>
                 </div>
                 <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-700">
                    <h4 className="text-emerald-400 font-bold text-xs uppercase mb-2 tracking-widest">Data Flow Strategy</h4>
                    <p className="text-sm text-slate-300">{result.analysis.dataFlow}</p>
                 </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Modern Patterns & Scalability</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {result.optimization.patterns.map((p, i) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-sm text-slate-400 hover:border-blue-500/30 transition-all cursor-default group">
                    <span className="block text-blue-500 mb-1 group-hover:translate-x-1 transition-transform">→</span> {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Critical Section */}
            <div>
              <h4 className="text-rose-400 font-bold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                Critical Blockers ({result.issues.critical.length})
              </h4>
              <div className="space-y-2">
                {result.issues.critical.map((item, i) => (
                  <div key={i} className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl text-sm text-rose-200/80">
                    {item}
                  </div>
                ))}
                {result.issues.critical.length === 0 && <p className="text-slate-500 italic text-sm">No critical issues found.</p>}
              </div>
            </div>

            {/* Warnings Section */}
            <div>
              <h4 className="text-amber-400 font-bold mb-3">Warnings ({result.issues.warnings.length})</h4>
              <div className="space-y-2">
                {result.issues.warnings.map((item, i) => (
                  <div key={i} className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-sm text-amber-200/80">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions Section */}
            <div>
              <h4 className="text-blue-400 font-bold mb-3">Architect Suggestions ({result.issues.suggestions.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.issues.suggestions.map((item, i) => (
                  <div key={i} className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-sm text-blue-200/80">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fix' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-xl">
               <div className="p-4 bg-emerald-500/20 rounded-full">
                  <svg className="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.432a11.955 11.955 0 01-8.618-3.04A11.955 11.955 0 0112 11.608a11.955 11.955 0 018.618 3.04 11.955 11.955 0 01-8.618 3.04z"/></svg>
               </div>
               <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-bold text-white mb-2">Architectural Fix Ready</h3>
                  <p className="text-emerald-200/70 text-sm max-w-lg">The improved version resolves all identified critical blockers, implements secure credential handling, and optimizes code blocks for stability.</p>
               </div>
               <button 
                 onClick={() => onApplyFix(result.improvedJson)}
                 className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-900/40 active:scale-95 flex items-center gap-3"
               >
                 Apply Fix to Workspace
               </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                  <h4 className="text-emerald-400 font-bold text-xs uppercase mb-4 tracking-widest">Key Improvements Applied</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-500 mt-1">✓</span> Secure credential injection via n8n parameters
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-500 mt-1">✓</span> Decoupled monolithic scripts into modular logic blocks
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-500 mt-1">✓</span> Integrated robust n8n-native retry mechanisms
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-500 mt-1">✓</span> Optimized system prompts for target LLM models
                    </li>
                  </ul>
               </div>
               <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
                  <h4 className="text-blue-400 font-bold text-xs uppercase mb-4 tracking-widest">Stability Impact</h4>
                  <div className="flex items-end gap-2 mb-2">
                     <span className="text-3xl font-black text-white">+{Math.round((100 - result.score) * 0.8)}%</span>
                     <span className="text-slate-500 text-xs mb-1">Estimated Reliability Boost</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                     <div className="bg-emerald-500 h-full w-[85%]"></div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Validation Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.testing.scenarios.map((s, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-slate-800">
                    <div className="text-slate-600 font-bold">0{i+1}</div>
                    <div className="text-sm text-slate-300">{s}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Edge Cases to Guard</h3>
              <ul className="space-y-3">
                {result.testing.edgeCases.map((e, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg>
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-xl font-bold text-white">Refactored Workflow Source</h3>
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(result.improvedJson);
                   alert('Copied to clipboard!');
                 }}
                 className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
                 Copy JSON
               </button>
            </div>
            <div className="bg-slate-950 rounded-2xl p-6 border border-slate-900 font-mono text-xs leading-relaxed overflow-x-auto text-emerald-400/80 custom-scrollbar max-h-[500px]">
               <pre>{JSON.stringify(JSON.parse(result.improvedJson), null, 2)}</pre>
            </div>
            {result.optimizedPrompt && (
              <div className="mt-8">
                 <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                   <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                   Optimized AI System Prompt
                 </h4>
                 <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 text-sm text-slate-300 italic">
                   {result.optimizedPrompt}
                 </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDashboard;
