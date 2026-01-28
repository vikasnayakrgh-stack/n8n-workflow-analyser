
export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  parameters: any;
  position: [number, number];
}

export interface WorkflowJson {
  name: string;
  nodes: WorkflowNode[];
  connections: Record<string, any>;
}

export interface AnalysisResult {
  score: number;
  summary: string;
  analysis: {
    purpose: string;
    architecture: string;
    dataFlow: string;
  };
  issues: {
    critical: string[];
    warnings: string[];
    suggestions: string[];
  };
  testing: {
    scenarios: string[];
    edgeCases: string[];
    monitoring: string[];
  };
  optimization: {
    performance: string[];
    patterns: string[];
    scalability: string[];
  };
  improvedJson: string;
  optimizedPrompt: string;
}

export enum AnalysisStage {
  IDLE = 'IDLE',
  PARSING = 'PARSING',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
