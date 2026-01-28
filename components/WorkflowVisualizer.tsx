
import React from 'react';
import { WorkflowJson } from '../types';

interface WorkflowVisualizerProps {
  workflow: WorkflowJson;
}

const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ workflow }) => {
  if (!workflow.nodes || workflow.nodes.length === 0) return null;

  const minX = Math.min(...workflow.nodes.map(n => n.position?.[0] || 0));
  const minY = Math.min(...workflow.nodes.map(n => n.position?.[1] || 0));
  
  const nodes = workflow.nodes.map(n => ({
    ...n,
    visualX: ((n.position?.[0] || 0) - minX) / 3 + 100,
    visualY: ((n.position?.[1] || 0) - minY) / 3 + 100
  }));

  const getNodeStyles = (type: string) => {
    if (type.includes('webhook')) return { color: 'fill-amber-500', glow: 'shadow-amber-500/40' };
    if (type.includes('code')) return { color: 'fill-blue-500', glow: 'shadow-blue-500/40' };
    if (type.includes('if') || type.includes('switch')) return { color: 'fill-emerald-500', glow: 'shadow-emerald-500/40' };
    if (type.includes('httpRequest')) return { color: 'fill-purple-500', glow: 'shadow-purple-500/40' };
    if (type.includes('agent') || type.includes('chain')) return { color: 'fill-rose-500', glow: 'shadow-rose-500/40' };
    if (type.includes('postgres') || type.includes('supabase')) return { color: 'fill-sky-400', glow: 'shadow-sky-400/40' };
    return { color: 'fill-slate-500', glow: 'shadow-slate-500/40' };
  };

  return (
    <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-200 flex items-center gap-3">
          <span className="p-1.5 bg-blue-500/20 rounded-lg">
             <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
             </svg>
          </span>
          Dynamic Topology
        </h3>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-700">
          Normalized View
        </span>
      </div>

      <div className="relative h-[360px] w-full bg-slate-950 rounded-2xl p-4 overflow-auto border border-slate-900 group">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" className="drop-shadow-2xl">
          {/* Grid lines for aesthetic */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Simple connections */}
          {nodes.map((node, i) => {
             const nextNodes = nodes.slice(i + 1, i + 3); // Purely for visualization aesthetic
             return nextNodes.map((next, j) => (
                <path
                  key={`path-${i}-${j}`}
                  d={`M ${node.visualX} ${node.visualY} Q ${(node.visualX + next.visualX)/2} ${node.visualY - 40} ${next.visualX} ${next.visualY}`}
                  className="stroke-slate-800 fill-none"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
             ));
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const style = getNodeStyles(node.type);
            return (
              <g key={node.id} className="transition-all hover:scale-125 cursor-default">
                <circle 
                  cx={node.visualX} 
                  cy={node.visualY} 
                  r="14" 
                  className={`${style.color} filter drop-shadow-md hover:brightness-125 transition-all`}
                />
                <circle 
                  cx={node.visualX} 
                  cy={node.visualY} 
                  r="20" 
                  className={`${style.color} opacity-5`}
                />
                <text 
                  x={node.visualX} 
                  y={node.visualY + 35} 
                  textAnchor="middle" 
                  className="fill-slate-400 text-[11px] font-bold uppercase tracking-tight"
                >
                  {node.name.length > 25 ? node.name.substring(0, 22) + '...' : node.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Trigger</div>
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Logic</div>
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> AI/LLM</div>
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> HTTP</div>
         <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span> Storage</div>
      </div>
    </div>
  );
};

export default WorkflowVisualizer;
