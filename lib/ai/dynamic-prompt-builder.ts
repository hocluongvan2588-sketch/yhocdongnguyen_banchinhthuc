/**
 * Dynamic Prompt Builder - Use database prompts with fallback
 */

import { buildPromptWithFallback } from './prompt-loader';
import { buildUnifiedMedicalPrompt } from '@/lib/prompts/unified-medical.prompt';

export interface DiagnosisInput {
  patientContext: {
    gender: string;
    age: number;
    subject: string;
    question: string;
  };
  maihua: {
    mainHexagram: { name: string };
    changedHexagram: { name: string };
    mutualHexagram: { name: string };
    movingLine: number;
    interpretation: {
      health: string;
      trend: string;
      mutual: string;
    };
  };
  diagnostic: {
    mapping: {
      upperTrigram: {
        name: string;
        element: string;
        primaryOrgans: string[];
      };
      lowerTrigram: {
        name: string;
        element: string;
        primaryOrgans: string[];
      };
      movingYao: {
        name: string;
        position: number;
        bodyLevel: string;
        anatomy: string[];
        organs: string[];
        clinicalSignificance: string;
      };
    };
    expertAnalysis: {
      tiDung: {
        ti: { element: string };
        dung: { element: string };
        relation: string;
        severity: string;
        prognosis: string;
      };
    };
  };
  seasonInfo: any;
  namDuocInfo?: any;
}

/**
 * Build medical diagnosis prompt with database fallback
 */
export async function buildDynamicMedicalPrompt(input: DiagnosisInput): Promise<string> {
  const variables = {
    // Patient info
    gender: input.patientContext.gender,
    age: input.patientContext.age,
    subject: input.patientContext.subject,
    question: input.patientContext.question,
    
    // Hexagram info
    mainHexagram: input.maihua.mainHexagram.name,
    changedHexagram: input.maihua.changedHexagram.name,
    mutualHexagram: input.maihua.mutualHexagram.name,
    movingLine: input.maihua.movingLine,
    
    // Trigram info
    upperTrigramName: input.diagnostic.mapping.upperTrigram.name,
    upperTrigramElement: input.diagnostic.mapping.upperTrigram.element,
    lowerTrigramName: input.diagnostic.mapping.lowerTrigram.name,
    lowerTrigramElement: input.diagnostic.mapping.lowerTrigram.element,
    
    // Yao info
    movingYaoPosition: input.diagnostic.mapping.movingYao.position,
    movingYaoBodyLevel: input.diagnostic.mapping.movingYao.bodyLevel,
    movingYaoAnatomy: input.diagnostic.mapping.movingYao.anatomy.join(', '),
    movingYaoOrgans: input.diagnostic.mapping.movingYao.organs.join(', '),
    
    // Ti-Dung analysis
    tiElement: input.diagnostic.expertAnalysis.tiDung.ti.element,
    dungElement: input.diagnostic.expertAnalysis.tiDung.dung.element,
    tiDungRelation: input.diagnostic.expertAnalysis.tiDung.relation,
    severity: input.diagnostic.expertAnalysis.tiDung.severity,
    
    // Season info
    season: input.seasonInfo?.tietKhi?.season || 'N/A',
    seasonElement: input.seasonInfo?.tietKhi?.element || 'N/A',
  };
  
  // Fallback template (use hardcoded unified-medical-prompt)
  const fallbackTemplate = buildUnifiedMedicalPrompt(input);
  
  // Try database first, fallback to hardcoded
  return await buildPromptWithFallback(
    'unified-medical-diagnosis',
    variables,
    fallbackTemplate
  );
}

/**
 * Build JSON formatter prompt
 */
export async function buildDynamicJsonFormatterPrompt(rawAnalysis: string): Promise<string> {
  const fallbackTemplate = `Bạn là chuyên gia format JSON. Hãy chuyển đổi phân tích Y học sau thành JSON chuẩn theo schema:

PHÂN TÍCH NGUỒN:
{{rawAnalysis}}

Trả về JSON với cấu trúc:
{
  "summary": "Tóm tắt chẩn đoán",
  "diagnosis": { "mainIssue": "...", "rootCause": "...", "severity": "..." },
  "symptoms": [{ "name": "...", "description": "...", "element": "..." }],
  "treatment": { "recommendations": [...], "lifestyle": [...] },
  "prognosis": "..."
}`;

  return await buildPromptWithFallback(
    'json-formatter',
    { rawAnalysis },
    fallbackTemplate
  );
}
