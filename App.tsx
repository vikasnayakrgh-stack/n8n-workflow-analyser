
import React, { useState, useCallback } from 'react';
import { WorkflowJson, AnalysisResult, AnalysisStage } from './types';
import { analyzeWorkflow } from './services/geminiService';
import WorkflowVisualizer from './components/WorkflowVisualizer';
import AnalysisDashboard from './components/AnalysisDashboard';

const App: React.FC = () => {
  const [inputJson, setInputJson] = useState<string>('');
  const [parsedWorkflow, setParsedWorkflow] = useState<WorkflowJson | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [stage, setStage] = useState<AnalysisStage>(AnalysisStage.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputJson(e.target.value);
  };

  const startAnalysis = async () => {
    setStage(AnalysisStage.PARSING);
    setError(null);
    
    try {
      const parsed = JSON.parse(inputJson);
      setParsedWorkflow(parsed);
      
      setStage(AnalysisStage.ANALYZING);
      const result = await analyzeWorkflow(inputJson);
      setAnalysis(result);
      setStage(AnalysisStage.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analysis failed. Check your JSON format.');
      setStage(AnalysisStage.ERROR);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 mb-2">
          Workflow Optimizer Pro
        </h1>
        <p className="text-slate-400">Deep analysis for AI Priya v3.2 and beyond.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Input & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Workflow JSON
            </h2>
            <textarea
              className="w-full h-96 bg-slate-900 border border-slate-700 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Paste your n8n workflow JSON here..."
              value={inputJson}
              onChange={handleJsonChange}
            />
            <button
              onClick={startAnalysis}
              disabled={!inputJson || stage === AnalysisStage.ANALYZING}
              className={`mt-4 w-full py-3 px-6 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                stage === AnalysisStage.ANALYZING 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-900/20'
              }`}
            >
              {stage === AnalysisStage.ANALYZING ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-3 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                  Gemini is Thinking...
                </>
              ) : (
                'Analyze Workflow'
              )}
            </button>
            {error && <p className="mt-4 text-red-400 text-sm bg-red-900/20 p-3 rounded border border-red-900/30">{error}</p>}
          </div>
          
          {parsedWorkflow && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
              <h3 className="text-slate-300 font-medium mb-3">Workflow Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-800">
                  <div className="text-2xl font-bold text-blue-400">{parsedWorkflow.nodes.length}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Nodes</div>
                </div>
                <div className="bg-slate-900 p-3 rounded-lg text-center border border-slate-800">
                  <div className="text-2xl font-bold text-emerald-400">
                    {parsedWorkflow.nodes.filter(n => n.type.includes('code')).length}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">JS Blocks</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Visualization & Analysis */}
        <div className="lg:col-span-8 space-y-8">
          {stage === AnalysisStage.IDLE && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 py-20 border-2 border-dashed border-slate-800 rounded-3xl">
              <svg className="w-20 h-20 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xl">Upload your n8n workflow to begin optimization.</p>
              <p className="text-sm mt-2 italic text-slate-600">Pro Tip: Gemini 3 Pro reasoning is used for analysis.</p>
            </div>
          )}

          {parsedWorkflow && <WorkflowVisualizer workflow={parsedWorkflow} />}
          {analysis && <AnalysisDashboard result={analysis} />}
        </div>
      </div>
    </div>
  );
};

export default App;
