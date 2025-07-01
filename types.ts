
export enum SummaryLength {
  BRIEF = 'Brief (50-100 words)',
  STANDARD = 'Standard (150-300 words)',
  DETAILED = 'Detailed (300-500 words)',
}

export enum OutputFormat {
  PARAGRAPH = 'Paragraph',
  BULLET_POINTS = 'Bullet Points',
  EXECUTIVE_SUMMARY = 'Executive Summary',
}

export interface SummarizationResult {
  summary: string;
  keyInsights?: string[];
  actionableItems?: string[];
  suggestedQuestions?: string[];
}

// Minimal type for API key check, real key is in process.env
export interface AppConfig {
  apiKeyAvailable: boolean;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  content: string;
  summaryLength: SummaryLength;
  outputFormat: OutputFormat;
  focusArea: string;
  result: SummarizationResult;
}
