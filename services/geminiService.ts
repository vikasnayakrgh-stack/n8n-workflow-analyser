
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeWorkflow = async (workflowJson: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert n8n Workflow Architect and Automation Engineer. Your expertise includes all n8n nodes, 
    advanced workflow patterns, error handling, performance optimization, and production-ready architecture.

    Your responsibilities:
    1. Analyze n8n workflow JSON structures for purpose and business logic.
    2. Identify critical issues, syntax errors, and misconfigured nodes.
    3. Suggest testing methodologies (scenarios, edge cases).
    4. Provide optimization recommendations based on modern 2025 patterns (Sub-workflows, Queue Mode, Multi-Agent AI).
    5. Generate an improved version of the JSON.

    Important for n8n:
    - Focus on performance (reducing API calls).
    - Check for security (credentials in JS).
    - Optimize for scalability.
  `;

  const prompt = `
    Analyze this n8n Workflow JSON. Provide a comprehensive architectural review.
    
    Workflow JSON:
    ${workflowJson}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 24000 },
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: "Overall quality score 0-100" },
          summary: { type: Type.STRING },
          analysis: {
            type: Type.OBJECT,
            properties: {
              purpose: { type: Type.STRING },
              architecture: { type: Type.STRING },
              dataFlow: { type: Type.STRING }
            },
            required: ["purpose", "architecture", "dataFlow"]
          },
          issues: {
            type: Type.OBJECT,
            properties: {
              critical: { type: Type.ARRAY, items: { type: Type.STRING } },
              warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["critical", "warnings", "suggestions"]
          },
          testing: {
            type: Type.OBJECT,
            properties: {
              scenarios: { type: Type.ARRAY, items: { type: Type.STRING } },
              edgeCases: { type: Type.ARRAY, items: { type: Type.STRING } },
              monitoring: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["scenarios", "edgeCases", "monitoring"]
          },
          optimization: {
            type: Type.OBJECT,
            properties: {
              performance: { type: Type.ARRAY, items: { type: Type.STRING } },
              patterns: { type: Type.ARRAY, items: { type: Type.STRING } },
              scalability: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["performance", "patterns", "scalability"]
          },
          improvedJson: { type: Type.STRING, description: "Valid n8n workflow JSON string with improvements" },
          optimizedPrompt: { type: Type.STRING, description: "If any AI node is present, optimize its system prompt" }
        },
        required: ["score", "summary", "analysis", "issues", "testing", "optimization", "improvedJson", "optimizedPrompt"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};
