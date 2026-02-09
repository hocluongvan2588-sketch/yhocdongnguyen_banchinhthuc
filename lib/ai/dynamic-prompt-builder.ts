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
  try {
    // Try to load from database first
    const dbPrompt = await buildPromptWithFallback(
      'unified-medical-diagnosis',
      {},
      ''
    );
    
    // If database prompt is available and different from fallback, use it
    if (dbPrompt && dbPrompt.length > 100) {
      console.log('[v0] Using database prompt');
      return dbPrompt;
    }
  } catch (error) {
    console.log('[v0] Database prompt unavailable, using fallback');
  }
  
  // Fallback to hardcoded unified-medical-prompt
  // Use buildUnifiedMedicalPrompt directly - it's already fully built, not a template
  console.log('[v0] Using hardcoded unified-medical-prompt');
  return buildUnifiedMedicalPrompt(input);
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
